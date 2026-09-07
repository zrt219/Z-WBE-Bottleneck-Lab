import {
  NEMOTRON_SYSTEM_PROMPT,
  PROMPT_VERSION,
  NemotronInputSchema,
  GroundingContractResponse,
  generateGroundedFallback,
  repairAndParseNemotronResponse,
  scenarioHash,
  ScenarioAssumptions,
  CalculatedMetrics
} from '@z-wbe/shared';
import { config } from '../config';

export interface NemotronExecutionResult {
  enabled: boolean;
  modelIdentifier: string;
  fromCache?: boolean;
  requestsThisSession: number;
  status: 'ok' | 'unavailable' | 'rate_limited' | 'temporarily_unavailable';
  errorMessage?: string;
  interpretation: GroundingContractResponse;
}

export interface CacheEntry {
  timestamp: string;
  modelSlug: string;
  promptVersion: string;
  scenarioHash: string;
  response: GroundingContractResponse;
}

// In-memory interpretation cache: scenarioHash -> CacheEntry
const interpretationCache = new Map<string, CacheEntry>();

// Session counter: counts actual live API calls made to OpenRouter
let aiRequestsThisSession = 0;

export function getAiRequestsCount(): number {
  return aiRequestsThisSession;
}

export function resetAiRequestsCount(): number {
  aiRequestsThisSession = 0;
  return aiRequestsThisSession;
}

export function getCacheSize(): number {
  return interpretationCache.size;
}

export function clearCache(): void {
  interpretationCache.clear();
}

/**
 * Executes grounded scenario interpretation with NVIDIA Nemotron 3 Super via OpenRouter.
 * 
 * Strict Golden Ticket Architecture Lock:
 * 1. ONLY NVIDIA Nemotron 3 Super (nvidia/nemotron-3-super-120b-a12b:free) via OpenRouter.
 * 2. Deterministic cache using scenarioHash(model, promptVersion, assumptions, metrics).
 * 3. Graceful degradation: never crashes simulation if key absent, 429, timeout, or network error.
 * 4. Maximum automatic retry: 1.
 * 5. Strictly protects API key (never logged, never sent to client).
 */
export async function explainScenarioWithNemotron(
  request: NemotronInputSchema,
  assumptions?: ScenarioAssumptions,
  metrics?: CalculatedMetrics
): Promise<NemotronExecutionResult> {
  const modelSlug = config.openrouterModel;

  // 1. Check if OPENROUTER_API_KEY is configured
  if (!config.isOpenRouterConfigured) {
    const fallback = generateGroundedFallback(
      request,
      'unavailable',
      'AI INTERPRETATION UNAVAILABLE'
    );
    return {
      enabled: false,
      modelIdentifier: modelSlug,
      requestsThisSession: aiRequestsThisSession,
      status: 'unavailable',
      errorMessage: 'AI INTERPRETATION UNAVAILABLE',
      interpretation: fallback
    };
  }

  // 2. Compute deterministic scenario hash for caching
  let hashKey: string | null = null;
  if (assumptions && metrics) {
    hashKey = scenarioHash(modelSlug, PROMPT_VERSION, assumptions, metrics);
    const cached = interpretationCache.get(hashKey);
    if (cached) {
      const responseWithCacheFlag: GroundingContractResponse = {
        ...cached.response,
        fromCache: true
      };
      return {
        enabled: true,
        modelIdentifier: modelSlug,
        fromCache: true,
        requestsThisSession: aiRequestsThisSession,
        status: 'ok',
        interpretation: responseWithCacheFlag
      };
    }
  }

  // 3. Prepare OpenRouter request payload
  const userPayload = JSON.stringify(request, null, 2);
  const userPrompt = `Here is the verified deterministic scenario data from Z-WBE Bottleneck Lab:\n\n\`\`\`json\n${userPayload}\n\`\`\`\n\nPlease provide your grounded scientific interpretation as valid JSON adhering to the required schema.`;

  const requestBody = {
    model: modelSlug,
    messages: [
      {
        role: 'system',
        content: NEMOTRON_SYSTEM_PROMPT
      },
      {
        role: 'user',
        content: userPrompt
      }
    ],
    temperature: 1.0,
    top_p: 0.95,
    max_tokens: 1000
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${config.openrouterApiKey}`,
    'HTTP-Referer': config.appUrl,
    'X-Title': 'Z-WBE Bottleneck Lab'
  };

  const endpoint = `${config.openrouterBaseUrl}/chat/completions`;

  // Maximum 1 retry (total 2 attempts max) to protect free quota
  let lastStatus: number | null = null;
  let lastErrorMessage = '';

  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      aiRequestsThisSession++; // Count actual call

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout

      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeout);
      lastStatus = response.status;

      // Handle 429 Rate Limit
      if (response.status === 429) {
        const rateLimitMessage =
          'FREE API RATE LIMIT REACHED\nYour simulation is still available.\nTry Nemotron again later.';
        console.warn(`[Nemotron Service] HTTP 429 rate limit reached on attempt ${attempt + 1}.`);
        const fallback = generateGroundedFallback(request, 'rate_limited', rateLimitMessage);
        return {
          enabled: true,
          modelIdentifier: modelSlug,
          requestsThisSession: aiRequestsThisSession,
          status: 'rate_limited',
          errorMessage: rateLimitMessage,
          interpretation: fallback
        };
      }

      if (!response.ok) {
        lastErrorMessage = `OpenRouter returned status ${response.status}: ${response.statusText}`;
        console.warn(`[Nemotron Service] Attempt ${attempt + 1} failed: ${lastErrorMessage}`);
        if (attempt === 0) continue; // Try 1 retry
        break;
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        lastErrorMessage = 'Empty response choices returned by Nemotron model.';
        console.warn(`[Nemotron Service] Attempt ${attempt + 1}: ${lastErrorMessage}`);
        if (attempt === 0) continue;
        break;
      }

      // Parse output with server-side validation and 1 repair attempt
      const parsed = repairAndParseNemotronResponse(content, modelSlug, request);

      // Store in deterministic cache
      if (hashKey) {
        interpretationCache.set(hashKey, {
          timestamp: new Date().toISOString(),
          modelSlug,
          promptVersion: PROMPT_VERSION,
          scenarioHash: hashKey,
          response: parsed
        });
      }

      return {
        enabled: true,
        modelIdentifier: modelSlug,
        fromCache: false,
        requestsThisSession: aiRequestsThisSession,
        status: 'ok',
        interpretation: parsed
      };
    } catch (err: unknown) {
      const isTimeout = err instanceof Error && err.name === 'AbortError';
      lastErrorMessage = isTimeout ? 'Request timed out after 25s' : err instanceof Error ? err.message : 'Network error';
      console.warn(`[Nemotron Service] Error on attempt ${attempt + 1}: ${lastErrorMessage}`);
      if (attempt === 0) continue;
    }
  }

  // Graceful degradation fallback if all attempts fail
  const fallbackMessage =
    lastStatus === 429
      ? 'FREE API RATE LIMIT REACHED\nYour simulation is still available.\nTry Nemotron again later.'
      : 'AI INTERPRETATION TEMPORARILY UNAVAILABLE\nThe deterministic simulation remains valid.';

  const fallback = generateGroundedFallback(
    request,
    lastStatus === 429 ? 'rate_limited' : 'temporarily_unavailable',
    fallbackMessage
  );

  return {
    enabled: true,
    modelIdentifier: modelSlug,
    requestsThisSession: aiRequestsThisSession,
    status: lastStatus === 429 ? 'rate_limited' : 'temporarily_unavailable',
    errorMessage: fallbackMessage,
    interpretation: fallback
  };
}
import {
  PRESET_DROSOPHILA,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis,
  buildNemotronInputSchema,
  generateGroundedFallback,
  NEMOTRON_SYSTEM_PROMPT,
  repairAndParseNemotronResponse,
  scenarioHash
} from '../../shared/dist/index.js';

let sessionRequests = 0;
const cache = new Map<string, any>();

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';

  // 1. Health check: /api/health or /health
  if (url.includes('health')) {
    return res.status(200).json({
      status: 'ok',
      service: 'Z-WBE Bottleneck Lab Backend (Vercel Serverless)',
      version: '1.0.0',
      model: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free',
      openrouterConfigured: Boolean(process.env.OPENROUTER_API_KEY && !process.env.OPENROUTER_API_KEY.includes('placeholder')),
      aiRequestsThisSession: sessionRequests,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Session requests: /api/session-requests or /session-requests
  if (url.includes('session-requests')) {
    return res.status(200).json({
      requestsThisSession: sessionRequests
    });
  }

  // 3. Explain endpoint: /api/explain or /explain
  if (url.includes('explain')) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    let parsedBody = req.body;
    if (typeof parsedBody === 'string') {
      try {
        parsedBody = JSON.parse(parsedBody);
      } catch {}
    }

    try {
      const { assumptions, metrics, bottleneck, sensitivity } = parsedBody || {};

      const activeAssumptions = assumptions || PRESET_DROSOPHILA;
      const activeMetrics = metrics || calculateAllMetrics(activeAssumptions);
      const activeBottleneck = bottleneck || calculateBottlenecks(activeAssumptions, activeMetrics);
      const activeSensitivity = sensitivity || runSensitivityAnalysis(activeAssumptions);

      const groundingRequest = buildNemotronInputSchema(
        activeAssumptions,
        activeMetrics,
        activeBottleneck,
        activeSensitivity
      );

      const apiKey = process.env.OPENROUTER_API_KEY;
      const model = process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free';

      if (!apiKey || apiKey.includes('placeholder')) {
        const fallback = generateGroundedFallback(
          groundingRequest,
          'unavailable',
          'AI INTERPRETATION UNAVAILABLE\nOpenRouter API key is not configured on the server.\nThe deterministic simulation laboratory remains 100% operational.'
        );
        return res.status(200).json({
          enabled: false,
          modelIdentifier: model,
          requestsThisSession: sessionRequests,
          status: 'unavailable',
          interpretation: fallback,
          groundingRequest
        });
      }

      const hash = scenarioHash(model, '2026-03-gtc-nemotron-v1', activeAssumptions, activeMetrics);
      if (cache.has(hash)) {
        return res.status(200).json({
          enabled: true,
          modelIdentifier: model,
          fromCache: true,
          requestsThisSession: sessionRequests,
          status: 'ok',
          interpretation: cache.get(hash),
          groundingRequest
        });
      }

      sessionRequests += 1;
      const payload = {
        model,
        messages: [
          { role: 'system', content: NEMOTRON_SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(groundingRequest, null, 2) }
        ],
        temperature: 0.1,
        max_tokens: 2000
      };

      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'https://z-wbe-bottleneck-lab.vercel.app',
          'X-Title': 'Z-WBE Bottleneck Lab'
        },
        body: JSON.stringify(payload)
      });

      if (!openRouterRes.ok) {
        if (openRouterRes.status === 429) {
          const fallback = generateGroundedFallback(
            groundingRequest,
            'rate_limited',
            'FREE API RATE LIMIT REACHED\nYour simulation is still available.\nTry Nemotron again later.'
          );
          return res.status(429).json({
            enabled: true,
            modelIdentifier: model,
            requestsThisSession: sessionRequests,
            status: 'rate_limited',
            interpretation: fallback,
            groundingRequest
          });
        }
        throw new Error(`OpenRouter returned status ${openRouterRes.status}`);
      }

      const data = await openRouterRes.json();
      const rawContent = data.choices?.[0]?.message?.content || '';
      const interpretation = repairAndParseNemotronResponse(rawContent, groundingRequest);
      cache.set(hash, interpretation);

      return res.status(200).json({
        enabled: true,
        modelIdentifier: model,
        fromCache: false,
        requestsThisSession: sessionRequests,
        status: 'ok',
        interpretation,
        groundingRequest
      });
    } catch (err: any) {
      console.error('[API Explain Handler Error]', err);
      const safeMetrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const safeBottleneck = calculateBottlenecks(PRESET_DROSOPHILA, safeMetrics);
      const safeSensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
      const safePayload = buildNemotronInputSchema(PRESET_DROSOPHILA, safeMetrics, safeBottleneck, safeSensitivity);
      const fallback = generateGroundedFallback(
        safePayload,
        'temporarily_unavailable',
        'AI INTERPRETATION TEMPORARILY UNAVAILABLE\nThe deterministic simulation remains valid.'
      );
      return res.status(200).json({
        enabled: true,
        modelIdentifier: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free',
        requestsThisSession: sessionRequests,
        status: 'temporarily_unavailable',
        errorMessage: err?.message || 'Calculation completed with fallback',
        interpretation: fallback,
        groundingRequest: safePayload
      });
    }
  }

  return res.status(404).json({ error: 'Endpoint not found', url });
}

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env from possible locations (workspace root or backend folder)
const candidateEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env')
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

/**
 * Checks if an API key is either missing or contains an unpopulated placeholder.
 */
export function isPlaceholderKey(key: string | undefined): boolean {
  if (!key) return true;
  const trimmed = key.trim().toLowerCase();
  return (
    trimmed === '' ||
    trimmed === 'your_openrouter_api_key_here' ||
    trimmed.startsWith('your_') ||
    trimmed === 'placeholder'
  );
}

const rawOpenRouterKey = process.env.OPENROUTER_API_KEY || '';
const isOpenRouterValid = Boolean(rawOpenRouterKey && !isPlaceholderKey(rawOpenRouterKey));

export const config = {
  // Cloud Run dynamically injects PORT. Default to 8080 if not defined.
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
  environment: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',

  // NVIDIA Nemotron 3 Super via OpenRouter
  openrouterApiKey: rawOpenRouterKey,
  openrouterModel: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free',
  openrouterBaseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  appUrl: process.env.APP_URL || 'http://localhost:5173',
  isOpenRouterConfigured: isOpenRouterValid,

  // Canonical model identifier
  modelIdentifier: process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free'
};

/**
 * Validates environment configuration at server startup.
 * Never logs secrets or raw API keys.
 */
export function validateStartupEnvironment(): {
  isOpenRouterConfigured: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  console.log('=====================================================');
  console.log('[Z-WBE Backend] Server Environment Initializing');
  console.log(`  - NODE_ENV: ${config.environment}`);
  console.log(`  - Port: ${config.port} (Cloud Run compatible)`);
  console.log(`  - Base URL: ${config.openrouterBaseUrl}`);

  // Validate Nemotron / OpenRouter configuration
  if (config.isOpenRouterConfigured) {
    console.log(`  - NVIDIA Nemotron Model: ${config.openrouterModel} [ACTIVE - OpenRouter Key configured]`);
  } else {
    const warningMsg = 'OPENROUTER_API_KEY is absent or placeholder. AI interpretation will display: AI INTERPRETATION UNAVAILABLE.';
    warnings.push(warningMsg);
    console.log(`  - NVIDIA Nemotron Model: ${config.openrouterModel} [OFFLINE - ${warningMsg}]`);
  }

  // Check that client-side code has not inadvertently exposed keys
  for (const envKey of Object.keys(process.env)) {
    if (
      envKey.startsWith('VITE_') &&
      (envKey.includes('KEY') || envKey.includes('SECRET') || envKey.includes('TOKEN'))
    ) {
      const leakWarning = `POTENTIAL LEAK: Detected ${envKey} in environment. Never expose secret keys to client builds!`;
      warnings.push(leakWarning);
      console.warn('[SECURITY WARNING] ' + leakWarning);
    }
  }

  console.log('  - Deterministic Z-WBE Calculator: ACTIVE (100% independent of external AI services)');
  console.log('=====================================================');

  return {
    isOpenRouterConfigured: config.isOpenRouterConfigured,
    warnings
  };
}


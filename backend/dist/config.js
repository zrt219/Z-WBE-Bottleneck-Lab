"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.isPlaceholderKey = isPlaceholderKey;
exports.validateStartupEnvironment = validateStartupEnvironment;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load .env from possible locations (workspace root or backend folder)
const candidateEnvPaths = [
    path_1.default.resolve(process.cwd(), '.env'),
    path_1.default.resolve(__dirname, '../../.env'),
    path_1.default.resolve(__dirname, '../.env')
];
for (const envPath of candidateEnvPaths) {
    if (fs_1.default.existsSync(envPath)) {
        dotenv_1.default.config({ path: envPath });
        break;
    }
}
/**
 * Checks if an API key is either missing or contains an unpopulated placeholder.
 */
function isPlaceholderKey(key) {
    if (!key)
        return true;
    const trimmed = key.trim().toLowerCase();
    return (trimmed === '' ||
        trimmed === 'your_openrouter_api_key_here' ||
        trimmed.startsWith('your_') ||
        trimmed === 'placeholder');
}
const rawOpenRouterKey = process.env.OPENROUTER_API_KEY || '';
const isOpenRouterValid = Boolean(rawOpenRouterKey && !isPlaceholderKey(rawOpenRouterKey));
exports.config = {
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
function validateStartupEnvironment() {
    const warnings = [];
    console.log('=====================================================');
    console.log('[Z-WBE Backend] Server Environment Initializing');
    console.log(`  - NODE_ENV: ${exports.config.environment}`);
    console.log(`  - Port: ${exports.config.port} (Cloud Run compatible)`);
    console.log(`  - Base URL: ${exports.config.openrouterBaseUrl}`);
    // Validate Nemotron / OpenRouter configuration
    if (exports.config.isOpenRouterConfigured) {
        console.log(`  - NVIDIA Nemotron Model: ${exports.config.openrouterModel} [ACTIVE - OpenRouter Key configured]`);
    }
    else {
        const warningMsg = 'OPENROUTER_API_KEY is absent or placeholder. AI interpretation will display: AI INTERPRETATION UNAVAILABLE.';
        warnings.push(warningMsg);
        console.log(`  - NVIDIA Nemotron Model: ${exports.config.openrouterModel} [OFFLINE - ${warningMsg}]`);
    }
    // Check that client-side code has not inadvertently exposed keys
    for (const envKey of Object.keys(process.env)) {
        if (envKey.startsWith('VITE_') &&
            (envKey.includes('KEY') || envKey.includes('SECRET') || envKey.includes('TOKEN'))) {
            const leakWarning = `POTENTIAL LEAK: Detected ${envKey} in environment. Never expose secret keys to client builds!`;
            warnings.push(leakWarning);
            console.warn('[SECURITY WARNING] ' + leakWarning);
        }
    }
    console.log('  - Deterministic Z-WBE Calculator: ACTIVE (100% independent of external AI services)');
    console.log('=====================================================');
    return {
        isOpenRouterConfigured: exports.config.isOpenRouterConfigured,
        warnings
    };
}

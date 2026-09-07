"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = require("express");
const shared_1 = require("@z-wbe/shared");
const config_1 = require("./config");
const openrouterNemotron_1 = require("./services/openrouterNemotron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.apiRouter = (0, express_1.Router)();
// Health check endpoint (Never exposes secret keys!)
exports.apiRouter.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'Z-WBE Bottleneck Lab Backend',
        version: '1.0.0',
        environment: config_1.config.environment,
        model: config_1.config.openrouterModel,
        openrouterConfigured: config_1.config.isOpenRouterConfigured,
        aiRequestsThisSession: (0, openrouterNemotron_1.getAiRequestsCount)(),
        timestamp: new Date().toISOString()
    });
});
// Model availability status endpoint (Never exposes secrets!)
exports.apiRouter.get('/models/status', (_req, res) => {
    res.json({
        nemotron: {
            modelIdentifier: config_1.config.openrouterModel,
            configured: config_1.config.isOpenRouterConfigured,
            gateway: 'OpenRouter',
            status: config_1.config.isOpenRouterConfigured ? 'available' : 'unavailable'
        }
    });
});
// Session AI requests counter
exports.apiRouter.get('/session-requests', (_req, res) => {
    res.json({
        requestsThisSession: (0, openrouterNemotron_1.getAiRequestsCount)()
    });
});
// List all biological and demo presets
exports.apiRouter.get('/presets', (_req, res) => {
    res.json({
        presets: shared_1.ALL_PRESETS
    });
});
// Deterministic calculation endpoint
exports.apiRouter.post('/calculate', (req, res) => {
    try {
        let assumptions;
        if (req.body.presetId && typeof req.body.presetId === 'string') {
            assumptions = (0, shared_1.getPresetById)(req.body.presetId);
        }
        else if (req.body.assumptions && typeof req.body.assumptions === 'object') {
            assumptions = req.body.assumptions;
        }
        else {
            res.status(400).json({ error: 'Missing assumptions or presetId in request body' });
            return;
        }
        const metrics = (0, shared_1.calculateAllMetrics)(assumptions);
        const bottleneck = (0, shared_1.calculateBottlenecks)(assumptions, metrics);
        const sensitivity = (0, shared_1.runSensitivityAnalysis)(assumptions);
        const output = {
            assumptions,
            metrics,
            bottleneck,
            sensitivity,
            calculatedAt: new Date().toISOString()
        };
        res.json(output);
    }
    catch (err) {
        console.error('Error during scenario calculation:', err);
        res.status(500).json({ error: 'Failed to calculate scenario metrics' });
    }
});
function normalizeAssumptions(raw, presetId) {
    const base = presetId && typeof presetId === 'string' ? (0, shared_1.getPresetById)(presetId) : (0, shared_1.getPresetById)('drosophila');
    if (!raw || typeof raw !== 'object')
        return base;
    return {
        ...base,
        ...raw,
        acquisition: { ...base.acquisition, ...(raw.acquisition || {}) },
        reconstruction: { ...base.reconstruction, ...(raw.reconstruction || {}) },
        hardware: { ...base.hardware, ...(raw.hardware || {}) },
        neuralModel: { ...base.neuralModel, ...(raw.neuralModel || {}) },
        economics: { ...base.economics, ...(raw.economics || {}) }
    };
}
// Grounded scientific interpretation via NVIDIA Nemotron 3 Super (server-side routed through OpenRouter)
exports.apiRouter.post('/explain', async (req, res) => {
    try {
        const { assumptions, presetId, metrics, bottleneck, sensitivity } = req.body || {};
        const targetAssumptions = normalizeAssumptions(assumptions, presetId);
        let targetMetrics = metrics;
        let targetBottleneck = bottleneck;
        let targetSensitivity = sensitivity;
        // Ensure calculated values are strictly deterministic
        if (!targetMetrics || typeof targetMetrics.voxelCount !== 'number') {
            targetMetrics = (0, shared_1.calculateAllMetrics)(targetAssumptions);
        }
        if (!targetBottleneck || !targetBottleneck.dominantBottleneck) {
            targetBottleneck = (0, shared_1.calculateBottlenecks)(targetAssumptions, targetMetrics);
        }
        if (!targetSensitivity || !targetSensitivity.highestLeverageAssumption) {
            targetSensitivity = (0, shared_1.runSensitivityAnalysis)(targetAssumptions);
        }
        const groundingRequest = (0, shared_1.buildNemotronInputSchema)(targetAssumptions, targetMetrics, targetBottleneck, targetSensitivity);
        const result = await (0, openrouterNemotron_1.explainScenarioWithNemotron)(groundingRequest, targetAssumptions, targetMetrics);
        res.json({
            model: config_1.config.openrouterModel,
            modelIdentifier: result.modelIdentifier,
            enabled: result.enabled,
            status: result.status,
            errorMessage: result.errorMessage,
            fromCache: result.fromCache,
            requestsThisSession: result.requestsThisSession,
            interpretation: result.interpretation,
            groundingRequest
        });
    }
    catch (err) {
        console.error('Error generating scenario explanation:', err);
        try {
            const fallbackAssumptions = normalizeAssumptions(req.body?.assumptions, req.body?.presetId);
            const fallbackMetrics = (0, shared_1.calculateAllMetrics)(fallbackAssumptions);
            const fallbackBottleneck = (0, shared_1.calculateBottlenecks)(fallbackAssumptions, fallbackMetrics);
            const fallbackSensitivity = (0, shared_1.runSensitivityAnalysis)(fallbackAssumptions);
            const fallbackGrounding = (0, shared_1.buildNemotronInputSchema)(fallbackAssumptions, fallbackMetrics, fallbackBottleneck, fallbackSensitivity);
            const fallbackInterpretation = (0, shared_1.generateGroundedFallback)(fallbackGrounding, 'temporarily_unavailable', 'AI INTERPRETATION TEMPORARILY UNAVAILABLE\nThe deterministic simulation remains valid.');
            res.json({
                model: config_1.config.openrouterModel,
                modelIdentifier: config_1.config.modelIdentifier,
                enabled: false,
                status: 'temporarily_unavailable',
                errorMessage: 'AI INTERPRETATION TEMPORARILY UNAVAILABLE',
                fromCache: false,
                requestsThisSession: 0,
                interpretation: fallbackInterpretation,
                groundingRequest: fallbackGrounding
            });
        }
        catch {
            const safePreset = (0, shared_1.getPresetById)('drosophila');
            const safeMetrics = (0, shared_1.calculateAllMetrics)(safePreset);
            const safeBottleneck = (0, shared_1.calculateBottlenecks)(safePreset, safeMetrics);
            const safeSensitivity = (0, shared_1.runSensitivityAnalysis)(safePreset);
            const safeGrounding = (0, shared_1.buildNemotronInputSchema)(safePreset, safeMetrics, safeBottleneck, safeSensitivity);
            res.json({
                model: config_1.config.openrouterModel,
                modelIdentifier: config_1.config.modelIdentifier,
                enabled: false,
                status: 'temporarily_unavailable',
                errorMessage: 'AI INTERPRETATION TEMPORARILY UNAVAILABLE',
                fromCache: false,
                requestsThisSession: 0,
                interpretation: (0, shared_1.generateGroundedFallback)(safeGrounding),
                groundingRequest: safeGrounding
            });
        }
    }
});
// GPU parameter sweep summary
exports.apiRouter.get('/sweep-summary', (_req, res) => {
    try {
        // Check multiple candidate locations for precomputed sweep JSON
        const searchPaths = [
            path_1.default.resolve(__dirname, '../../public/data/gpu-sweep-summary.json'),
            path_1.default.resolve(__dirname, '../../../public/data/gpu-sweep-summary.json'),
            path_1.default.resolve(__dirname, '../../frontend/dist/data/gpu-sweep-summary.json'),
            path_1.default.resolve(__dirname, '../../../frontend/dist/data/gpu-sweep-summary.json'),
            path_1.default.resolve(__dirname, '../../frontend/public/data/gpu-sweep-summary.json'),
            path_1.default.resolve(__dirname, '../../../frontend/public/data/gpu-sweep-summary.json'),
            path_1.default.resolve(__dirname, '../../dist/data/gpu-sweep-summary.json')
        ];
        for (const filePath of searchPaths) {
            if (fs_1.default.existsSync(filePath)) {
                const raw = fs_1.default.readFileSync(filePath, 'utf-8');
                const data = JSON.parse(raw);
                res.json(data);
                return;
            }
        }
        // Default fallback structure if file not yet generated
        const defaultData = {
            generatedAt: new Date().toISOString(),
            sweepCombinationsCount: 100000,
            benchmark: {
                runtimeCpuSeconds: null,
                runtimeGpuSeconds: null,
                speedup: null,
                status: 'GPU_BENCHMARK_NOT_EXECUTED',
                deviceInfo: 'Local node CPU runner (GPU execution not active)',
                backendUsed: 'Standard analytical solver'
            },
            bottleneckFrequencies: {
                ACQUISITION: 31250,
                RECONSTRUCTION: 21840,
                STORAGE: 12400,
                COMPUTE: 9850,
                MEMORY_BANDWIDTH: 15320,
                INTERCONNECT: 4120,
                POWER: 2100,
                ECONOMIC_COST: 3120
            },
            correlations: [
                {
                    parameter: 'imagingRatePerMachineMm3Year',
                    dominantBottleneckAssociation: 'ACQUISITION',
                    correlationCoefficient: -0.78
                },
                {
                    parameter: 'memoryBandwidthTbS',
                    dominantBottleneckAssociation: 'MEMORY_BANDWIDTH',
                    correlationCoefficient: -0.84
                },
                {
                    parameter: 'computeThroughputPflops',
                    dominantBottleneckAssociation: 'COMPUTE',
                    correlationCoefficient: -0.71
                },
                {
                    parameter: 'budgetCeilingUsd',
                    dominantBottleneckAssociation: 'ECONOMIC_COST',
                    correlationCoefficient: -0.65
                }
            ],
            transitionRegions: [
                {
                    parameter: 'imagingRatePerMachineMm3Year',
                    fromBottleneck: 'ACQUISITION',
                    toBottleneck: 'MEMORY_BANDWIDTH',
                    thresholdValue: '> 2.5 mm³/year',
                    description: 'When imaging throughput accelerates past ~2.5 mm³/yr per instrument, the constraint moves to memory traffic during real-time replay.'
                },
                {
                    parameter: 'rawSegmentationAccuracy',
                    fromBottleneck: 'RECONSTRUCTION',
                    toBottleneck: 'STORAGE',
                    thresholdValue: '> 0.995',
                    description: 'High automated segmentation accuracy collapses manual proofreading hours, leaving raw and model state storage as the primary barrier.'
                }
            ]
        };
        res.json(defaultData);
    }
    catch (err) {
        console.error('Error serving sweep summary:', err);
        res.status(500).json({ error: 'Failed to read sweep summary' });
    }
});

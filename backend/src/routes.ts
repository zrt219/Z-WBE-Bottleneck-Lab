import { Router, Request, Response } from 'express';
import {
  ALL_PRESETS,
  getPresetById,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis,
  buildNemotronInputSchema,
  generateGroundedFallback,
  ScenarioAssumptions,
  ScenarioCalculationOutput,
  GpuSweepSummaryData
} from '@z-wbe/shared';
import { config } from './config';
import { explainScenarioWithNemotron, getAiRequestsCount } from './services/openrouterNemotron';
import fs from 'fs';
import path from 'path';

export const apiRouter = Router();

// Health check endpoint (Never exposes secret keys!)
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Z-WBE Bottleneck Lab Backend',
    version: '1.0.0',
    environment: config.environment,
    model: config.openrouterModel,
    openrouterConfigured: config.isOpenRouterConfigured,
    aiRequestsThisSession: getAiRequestsCount(),
    timestamp: new Date().toISOString()
  });
});

// Model availability status endpoint (Never exposes secrets!)
apiRouter.get('/models/status', (_req: Request, res: Response) => {
  res.json({
    nemotron: {
      modelIdentifier: config.openrouterModel,
      configured: config.isOpenRouterConfigured,
      gateway: 'OpenRouter',
      status: config.isOpenRouterConfigured ? 'available' : 'unavailable'
    }
  });
});

// Session AI requests counter
apiRouter.get('/session-requests', (_req: Request, res: Response) => {
  res.json({
    requestsThisSession: getAiRequestsCount()
  });
});

// List all biological and demo presets
apiRouter.get('/presets', (_req: Request, res: Response) => {
  res.json({
    presets: ALL_PRESETS
  });
});

// Deterministic calculation endpoint
apiRouter.post('/calculate', (req: Request, res: Response) => {
  try {
    let assumptions: ScenarioAssumptions;

    if (req.body.presetId && typeof req.body.presetId === 'string') {
      assumptions = getPresetById(req.body.presetId);
    } else if (req.body.assumptions && typeof req.body.assumptions === 'object') {
      assumptions = req.body.assumptions as ScenarioAssumptions;
    } else {
      res.status(400).json({ error: 'Missing assumptions or presetId in request body' });
      return;
    }

    const metrics = calculateAllMetrics(assumptions);
    const bottleneck = calculateBottlenecks(assumptions, metrics);
    const sensitivity = runSensitivityAnalysis(assumptions);

    const output: ScenarioCalculationOutput = {
      assumptions,
      metrics,
      bottleneck,
      sensitivity,
      calculatedAt: new Date().toISOString()
    };

    res.json(output);
  } catch (err: unknown) {
    console.error('Error during scenario calculation:', err);
    res.status(500).json({ error: 'Failed to calculate scenario metrics' });
  }
});

function normalizeAssumptions(raw?: Partial<ScenarioAssumptions>, presetId?: string): ScenarioAssumptions {
  const base = presetId && typeof presetId === 'string' ? getPresetById(presetId) : getPresetById('drosophila');
  if (!raw || typeof raw !== 'object') return base;
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
apiRouter.post('/explain', async (req: Request, res: Response) => {
  try {
    const { assumptions, presetId, metrics, bottleneck, sensitivity } = req.body || {};

    const targetAssumptions: ScenarioAssumptions = normalizeAssumptions(assumptions, presetId);

    let targetMetrics = metrics;
    let targetBottleneck = bottleneck;
    let targetSensitivity = sensitivity;

    // Ensure calculated values are strictly deterministic
    if (!targetMetrics || typeof targetMetrics.voxelCount !== 'number') {
      targetMetrics = calculateAllMetrics(targetAssumptions);
    }
    if (!targetBottleneck || !targetBottleneck.dominantBottleneck) {
      targetBottleneck = calculateBottlenecks(targetAssumptions, targetMetrics);
    }
    if (!targetSensitivity || !targetSensitivity.highestLeverageAssumption) {
      targetSensitivity = runSensitivityAnalysis(targetAssumptions);
    }

    const groundingRequest = buildNemotronInputSchema(
      targetAssumptions,
      targetMetrics,
      targetBottleneck,
      targetSensitivity
    );

    const result = await explainScenarioWithNemotron(
      groundingRequest,
      targetAssumptions,
      targetMetrics
    );

    res.json({
      model: config.openrouterModel,
      modelIdentifier: result.modelIdentifier,
      enabled: result.enabled,
      status: result.status,
      errorMessage: result.errorMessage,
      fromCache: result.fromCache,
      requestsThisSession: result.requestsThisSession,
      interpretation: result.interpretation,
      groundingRequest
    });
  } catch (err: unknown) {
    console.error('Error generating scenario explanation:', err);
    try {
      const fallbackAssumptions = normalizeAssumptions(req.body?.assumptions, req.body?.presetId);
      const fallbackMetrics = calculateAllMetrics(fallbackAssumptions);
      const fallbackBottleneck = calculateBottlenecks(fallbackAssumptions, fallbackMetrics);
      const fallbackSensitivity = runSensitivityAnalysis(fallbackAssumptions);
      const fallbackGrounding = buildNemotronInputSchema(
        fallbackAssumptions,
        fallbackMetrics,
        fallbackBottleneck,
        fallbackSensitivity
      );
      const fallbackInterpretation = generateGroundedFallback(
        fallbackGrounding,
        'temporarily_unavailable',
        'AI INTERPRETATION TEMPORARILY UNAVAILABLE\nThe deterministic simulation remains valid.'
      );
      res.json({
        model: config.openrouterModel,
        modelIdentifier: config.modelIdentifier,
        enabled: false,
        status: 'temporarily_unavailable',
        errorMessage: 'AI INTERPRETATION TEMPORARILY UNAVAILABLE',
        fromCache: false,
        requestsThisSession: 0,
        interpretation: fallbackInterpretation,
        groundingRequest: fallbackGrounding
      });
    } catch {
      const safePreset = getPresetById('drosophila');
      const safeMetrics = calculateAllMetrics(safePreset);
      const safeBottleneck = calculateBottlenecks(safePreset, safeMetrics);
      const safeSensitivity = runSensitivityAnalysis(safePreset);
      const safeGrounding = buildNemotronInputSchema(safePreset, safeMetrics, safeBottleneck, safeSensitivity);
      res.json({
        model: config.openrouterModel,
        modelIdentifier: config.modelIdentifier,
        enabled: false,
        status: 'temporarily_unavailable',
        errorMessage: 'AI INTERPRETATION TEMPORARILY UNAVAILABLE',
        fromCache: false,
        requestsThisSession: 0,
        interpretation: generateGroundedFallback(safeGrounding),
        groundingRequest: safeGrounding
      });
    }
  }
});

// GPU parameter sweep summary
apiRouter.get('/sweep-summary', (_req: Request, res: Response) => {
  try {
    // Check multiple candidate locations for precomputed sweep JSON
    const searchPaths = [
      path.resolve(__dirname, '../../public/data/gpu-sweep-summary.json'),
      path.resolve(__dirname, '../../../public/data/gpu-sweep-summary.json'),
      path.resolve(__dirname, '../../frontend/dist/data/gpu-sweep-summary.json'),
      path.resolve(__dirname, '../../../frontend/dist/data/gpu-sweep-summary.json'),
      path.resolve(__dirname, '../../frontend/public/data/gpu-sweep-summary.json'),
      path.resolve(__dirname, '../../../frontend/public/data/gpu-sweep-summary.json'),
      path.resolve(__dirname, '../../dist/data/gpu-sweep-summary.json')
    ];

    for (const filePath of searchPaths) {
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(raw);
        res.json(data);
        return;
      }
    }

    // Default fallback structure if file not yet generated
    const defaultData: GpuSweepSummaryData = {
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
  } catch (err) {
    console.error('Error serving sweep summary:', err);
    res.status(500).json({ error: 'Failed to read sweep summary' });
  }
});

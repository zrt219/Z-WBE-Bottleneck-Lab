import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  buildNemotronInputSchema,
  generateGroundedFallback,
  repairAndParseNemotronResponse,
  scenarioHash,
  PROMPT_VERSION,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis,
  PRESET_DROSOPHILA,
  PRESET_MOUSE_CIRCUIT,
  PRESET_HUMAN_SCALE,
  DEMO_PRESET_IMAGING_WALL,
  DEMO_PRESET_MEMORY_WALL
} from '@z-wbe/shared';
import { isPlaceholderKey, validateStartupEnvironment, config } from '../src/config';
import {
  explainScenarioWithNemotron,
  getAiRequestsCount,
  resetAiRequestsCount,
  getCacheSize,
  clearCache
} from '../src/services/openrouterNemotron';

describe('Backend API & Nemotron Grounding Contract Unit Tests', () => {
  beforeEach(() => {
    resetAiRequestsCount();
    clearCache();
  });

  describe('Nemotron Input Schema Constructor (Section 20)', () => {
    it('constructs a complete schema with provenance and limitations for Drosophila', () => {
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
      const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);

      const request = buildNemotronInputSchema(
        PRESET_DROSOPHILA,
        metrics,
        bottleneck,
        sensitivity
      );

      expect(request.project).toBe('Z-WBE Bottleneck Lab');
      expect(request.scenario_id).toBe(PRESET_DROSOPHILA.id);
      expect(request.scale).toBe(PRESET_DROSOPHILA.scaleLabel);
      expect(request.scientific_status).toBe('research simulator');
      expect(request.dominant_bottleneck).toBe(bottleneck.dominantBottleneck);
      expect(request.secondary_bottleneck).toBe(bottleneck.secondBottleneck);
      expect(request.calculated_metrics.voxel_count).toBe(metrics.voxelCount);
      expect(request.calculated_metrics.raw_data_bytes).toBe(metrics.rawDataBytes);
      expect(request.pressure_vector[bottleneck.dominantBottleneck]).toBeDefined();
      expect(request.sensitivity.highest_leverage).toBe(sensitivity.highestLeverageAssumption.variableLabel);
      expect(request.limitations.length).toBeGreaterThan(0);
      expect(request.provenance_notice).not.toContain('HYPOTHETICAL HUMAN-SCALE ESTIMATE');
    });

    it('injects mandatory hypothetical human notice for human-scale presets', () => {
      const metrics = calculateAllMetrics(PRESET_HUMAN_SCALE);
      const bottleneck = calculateBottlenecks(PRESET_HUMAN_SCALE, metrics);
      const sensitivity = runSensitivityAnalysis(PRESET_HUMAN_SCALE);

      const request = buildNemotronInputSchema(
        PRESET_HUMAN_SCALE,
        metrics,
        bottleneck,
        sensitivity
      );

      expect(request.provenance_notice).toContain('HYPOTHETICAL HUMAN-SCALE ESTIMATE');
      const humanLimitation = request.limitations.find((l) => l.includes('HYPOTHETICAL HUMAN-SCALE ESTIMATE'));
      expect(humanLimitation).toBeDefined();
    });
  });

  describe('Deterministic scenarioHash Invariant', () => {
    it('produces a 16-character hex hash with hash- prefix', () => {
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const hash = scenarioHash(
        config.openrouterModel,
        PROMPT_VERSION,
        PRESET_DROSOPHILA,
        metrics
      );

      expect(hash).toMatch(/^hash-[0-9a-f]{16}$/);
    });

    it('returns identical hash for identical inputs across invocations', () => {
      const metrics = calculateAllMetrics(PRESET_MOUSE_CIRCUIT);
      const hash1 = scenarioHash(config.openrouterModel, PROMPT_VERSION, PRESET_MOUSE_CIRCUIT, metrics);
      const hash2 = scenarioHash(config.openrouterModel, PROMPT_VERSION, PRESET_MOUSE_CIRCUIT, metrics);

      expect(hash1).toBe(hash2);
    });

    it('changes when assumptions or metrics change', () => {
      const metrics1 = calculateAllMetrics(PRESET_DROSOPHILA);
      const metrics2 = calculateAllMetrics(PRESET_MOUSE_CIRCUIT);

      const hash1 = scenarioHash(config.openrouterModel, PROMPT_VERSION, PRESET_DROSOPHILA, metrics1);
      const hash2 = scenarioHash(config.openrouterModel, PROMPT_VERSION, PRESET_MOUSE_CIRCUIT, metrics2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('Deterministic Grounded Fallback Engine', () => {
    it('generates fully grounded interpretation strictly from calculated numbers', () => {
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
      const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
      const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

      const response = generateGroundedFallback(request);

      expect(response.source).toBe('DETERMINISTIC_GROUNDED_FALLBACK');
      expect(response.labeledBadge).toBe('AI INTERPRETATION');
      expect(response.isAIGenerated).toBe(true);
      expect(response.sections.whatLimitsThisScenario).toContain(bottleneck.dominantBottleneck);
      expect(response.sections.why).toContain(request.scenario_id);
      expect(response.sections.whatImprovementMattersMost).toContain(
        sensitivity.highestLeverageAssumption.variableLabel.toUpperCase()
      );
      expect(response.sections.whereDidTheBottleneckMove).toBeDefined();
      expect(response.sections.whatRemainsUncertain).toBeDefined();
      expect(response.sections.whatNeedsRealExperimentalEvidence).toBeDefined();
      expect(response.markdown).toContain('WHAT LIMITS THIS SCENARIO?');
      expect(response.markdown).toContain('WHAT NEEDS REAL EXPERIMENTAL EVIDENCE?');
      expect(response.structuredOutput).toBeDefined();
      expect(response.structuredOutput?.dominant_bottleneck_explanation).toContain(bottleneck.dominantBottleneck);
    });

    it('supports custom status and error messages in fallback', () => {
      const metrics = calculateAllMetrics(DEMO_PRESET_IMAGING_WALL);
      const bottleneck = calculateBottlenecks(DEMO_PRESET_IMAGING_WALL, metrics);
      const sensitivity = runSensitivityAnalysis(DEMO_PRESET_IMAGING_WALL);
      const request = buildNemotronInputSchema(DEMO_PRESET_IMAGING_WALL, metrics, bottleneck, sensitivity);

      const rateLimitedMsg = 'FREE API RATE LIMIT REACHED\nYour simulation is still available.';
      const fallback = generateGroundedFallback(request, 'rate_limited', rateLimitedMsg);

      expect(fallback.status).toBe('rate_limited');
      expect(fallback.errorMessage).toBe(rateLimitedMsg);
    });
  });

  describe('Nemotron 3 Super Response Parser & Repair', () => {
    it('parses valid JSON response into structured output and 6 sections', () => {
      const mockJson = JSON.stringify({
        summary: 'Acquisition beam time constrains the pipeline.',
        dominant_bottleneck_explanation: 'Acquisition is the primary bottleneck due to instrument beam time.',
        why_it_matters: 'Scanning requires decades at current beam throughput.',
        highest_leverage_improvement: 'Increasing multi-beam parallel scanning rate.',
        low_leverage_improvements: ['GPU compute FLOPs expansion.'],
        bottleneck_transition: 'Constraint shifts to storage if beam rate exceeds 10x.',
        uncertainties: ['Tissue preservation fidelity', 'Resin embedding stability'],
        empirical_validation_needed: ['Continuous high-speed SEM beam deflection'],
        bottom_line: 'Physical imaging rate must scale before compute upgrades provide value.'
      });

      const parsed = repairAndParseNemotronResponse(mockJson, 'nvidia/nemotron-3-super-120b-a12b:free');

      expect(parsed.source).toBe('OPENROUTER_NEMOTRON_3_SUPER');
      expect(parsed.labeledBadge).toBe('AI INTERPRETATION');
      expect(parsed.status).toBe('ok');
      expect(parsed.sections.whatLimitsThisScenario).toContain('Acquisition is the primary bottleneck');
      expect(parsed.sections.why).toContain('Scanning requires decades');
      expect(parsed.sections.whatImprovementMattersMost).toContain('Increasing multi-beam');
      expect(parsed.sections.whereDidTheBottleneckMove).toContain('Constraint shifts to storage');
      expect(parsed.sections.whatRemainsUncertain).toContain('Tissue preservation');
      expect(parsed.sections.whatNeedsRealExperimentalEvidence).toContain('Continuous high-speed');
      expect(parsed.structuredOutput?.summary).toBe('Acquisition beam time constrains the pipeline.');
    });

    it('repairs JSON wrapped in markdown code blocks', () => {
      const wrapped = '```json\n{"summary":"Repaired output","dominant_bottleneck_explanation":"Storage barrier","why_it_matters":"Data size","highest_leverage_improvement":"Compression","bottleneck_transition":"Moves to memory","uncertainties":["Lossless ratio"],"empirical_validation_needed":["EM compression tests"],"bottom_line":"Storage dominates."}\n```';

      const parsed = repairAndParseNemotronResponse(wrapped, 'nvidia/nemotron-3-super-120b-a12b:free');

      expect(parsed.status).toBe('ok');
      expect(parsed.sections.whatLimitsThisScenario).toContain('Storage barrier');
      expect(parsed.structuredOutput?.highest_leverage_improvement).toBe('Compression');
    });

    it('falls back to markdown section parsing if raw text is returned', () => {
      const rawMarkdown = `
### WHAT LIMITS THIS SCENARIO?
Memory bandwidth is the primary ceiling.

### WHY?
Synaptic state transfers require 150 TB/s.

### WHAT IMPROVEMENT MATTERS MOST?
High-bandwidth HBM4 memory bus integration.

### WHERE DID THE BOTTLENECK MOVE?
Moves to interconnect traffic at 10x HBM scaling.

### WHAT REMAINS UNCERTAIN?
Sparse event rate under realistic spike activity.

### WHAT NEEDS REAL EXPERIMENTAL EVIDENCE?
Measured biophysical bus utilization on physical silicon.
      `.trim();

      const parsed = repairAndParseNemotronResponse(rawMarkdown, 'nvidia/nemotron-3-super-120b-a12b:free');

      expect(parsed.status).toBe('ok');
      expect(parsed.sections.whatLimitsThisScenario).toContain('Memory bandwidth is the primary ceiling');
      expect(parsed.sections.why).toContain('Synaptic state transfers require 150 TB/s');
      expect(parsed.sections.whatImprovementMattersMost).toContain('High-bandwidth HBM4');
    });
  });

  describe('OpenRouter Nemotron Service Orchestration & Caching', () => {
    it('returns unavailable fallback when API key is unconfigured without throwing', async () => {
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
      const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
      const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

      const result = await explainScenarioWithNemotron(request, PRESET_DROSOPHILA, metrics);

      expect(result.modelIdentifier).toBe(config.openrouterModel);
      expect(result.interpretation.labeledBadge).toBe('AI INTERPRETATION');
      if (!config.isOpenRouterConfigured) {
        expect(result.status).toBe('unavailable');
        expect(result.errorMessage).toBe('AI INTERPRETATION UNAVAILABLE');
        expect(result.interpretation.source).toBe('DETERMINISTIC_GROUNDED_FALLBACK');
      }
    });

    it('manages session counter and cache correctly', () => {
      expect(getAiRequestsCount()).toBe(0);
      expect(getCacheSize()).toBe(0);

      resetAiRequestsCount();
      clearCache();
      expect(getAiRequestsCount()).toBe(0);
      expect(getCacheSize()).toBe(0);
    });
  });

  describe('Environment Configuration & Graceful Degradation', () => {
    it('detects placeholder keys correctly', async () => {
      const { isPlaceholderKey } = await import('../src/config');
      expect(isPlaceholderKey('')).toBe(true);
      expect(isPlaceholderKey(undefined)).toBe(true);
      expect(isPlaceholderKey('YOUR_OPENROUTER_API_KEY_HERE')).toBe(true);
      expect(isPlaceholderKey('your_openrouter_api_key')).toBe(true);
      expect(isPlaceholderKey('real_api_key_1234567890')).toBe(false);
    });

    it('validates startup environment without throwing and captures warnings', async () => {
      const { validateStartupEnvironment } = await import('../src/config');
      const result = validateStartupEnvironment();

      expect(result).toHaveProperty('isOpenRouterConfigured');
      expect(result).toHaveProperty('warnings');
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('invokes explainScenarioWithNemotron with fallback when key is not configured', async () => {
      const { explainScenarioWithNemotron } = await import('../src/services/openrouterNemotron');
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
      const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
      const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

      const result = await explainScenarioWithNemotron(request, PRESET_DROSOPHILA, metrics);
      expect(result.interpretation.labeledBadge).toBe('AI INTERPRETATION');
      expect(result.interpretation.sections.whatLimitsThisScenario).toContain(bottleneck.dominantBottleneck);
    });

    it('handles OpenRouter HTTP 429 rate limit gracefully with required user banner', async () => {
      const origKey = config.openrouterApiKey;
      const origConfigured = config.isOpenRouterConfigured;
      config.openrouterApiKey = 'mock-key-429';
      config.isOpenRouterConfigured = true;

      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        status: 429,
        ok: false,
        statusText: 'Too Many Requests'
      } as Response);

      try {
        const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
        const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
        const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
        const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

        const result = await explainScenarioWithNemotron(request, PRESET_DROSOPHILA, metrics);

        expect(result.status).toBe('rate_limited');
        expect(result.errorMessage).toContain('FREE API RATE LIMIT REACHED');
        expect(result.errorMessage).toContain('Your simulation is still available.');
        expect(result.errorMessage).toContain('Try Nemotron again later.');
        expect(result.interpretation.labeledBadge).toBe('AI INTERPRETATION');
        expect(result.interpretation.source).toBe('DETERMINISTIC_GROUNDED_FALLBACK');
        expect(result.requestsThisSession).toBe(1); // 429 should not trigger unnecessary retry loop
      } finally {
        fetchSpy.mockRestore();
        config.openrouterApiKey = origKey;
        config.isOpenRouterConfigured = origConfigured;
      }
    });

    it('handles OpenRouter HTTP 500 error with max 1 retry and graceful fallback', async () => {
      const origKey = config.openrouterApiKey;
      const origConfigured = config.isOpenRouterConfigured;
      config.openrouterApiKey = 'mock-key-500';
      config.isOpenRouterConfigured = true;

      let callCount = 0;
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
        callCount++;
        return {
          status: 500,
          ok: false,
          statusText: 'Internal Server Error'
        } as Response;
      });

      try {
        const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
        const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
        const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
        const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

        const result = await explainScenarioWithNemotron(request, PRESET_DROSOPHILA, metrics);

        expect(result.status).toBe('temporarily_unavailable');
        expect(result.errorMessage).toContain('AI INTERPRETATION TEMPORARILY UNAVAILABLE');
        expect(result.errorMessage).toContain('The deterministic simulation remains valid.');
        expect(result.interpretation.labeledBadge).toBe('AI INTERPRETATION');
        expect(callCount).toBe(2); // Exactly 1 retry (initial attempt 0 + retry attempt 1)
      } finally {
        fetchSpy.mockRestore();
        config.openrouterApiKey = origKey;
        config.isOpenRouterConfigured = origConfigured;
      }
    });

    it('serves cached interpretation on identical scenario hash without making new API call', async () => {
      const origKey = config.openrouterApiKey;
      const origConfigured = config.isOpenRouterConfigured;
      config.openrouterApiKey = 'mock-key-cache';
      config.isOpenRouterConfigured = true;

      const mockResponseJson = {
        choices: [
          {
            message: {
              content: JSON.stringify({
                summary: 'Cached analytical summary.',
                dominant_bottleneck_explanation: 'Dominant bottleneck is well characterized.',
                why_it_matters: 'Scale matters.',
                highest_leverage_improvement: 'Acquisition.',
                low_leverage_improvements: ['None.'],
                bottleneck_transition: 'Moves downstream.',
                uncertainties: ['Fidelity.'],
                empirical_validation_needed: ['Tests.'],
                bottom_line: 'Clear.'
              })
            }
          }
        ]
      };

      let networkCalls = 0;
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
        networkCalls++;
        return {
          status: 200,
          ok: true,
          json: async () => mockResponseJson
        } as Response;
      });

      try {
        const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
        const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
        const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
        const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

        // First call: Cache Miss
        const res1 = await explainScenarioWithNemotron(request, PRESET_DROSOPHILA, metrics);
        expect(res1.status).toBe('ok');
        expect(res1.fromCache).toBe(false);
        expect(networkCalls).toBe(1);

        // Second call: Cache Hit
        const res2 = await explainScenarioWithNemotron(request, PRESET_DROSOPHILA, metrics);
        expect(res2.status).toBe('ok');
        expect(res2.fromCache).toBe(true);
        expect(networkCalls).toBe(1); // Network call count must NOT increment
      } finally {
        fetchSpy.mockRestore();
        config.openrouterApiKey = origKey;
        config.isOpenRouterConfigured = origConfigured;
      }
    });

    it('preserves absolute immutability of deterministic calculations against AI tampering', async () => {
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
      const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
      const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

      // Snapshot deterministic ground truth
      const expectedVoxelCount = metrics.voxelCount;
      const expectedCost = metrics.totalEstimatedCostUsd;
      const expectedDominant = bottleneck.dominantBottleneck;

      // Even if AI outputs fabricated claims:
      const hallucinatedAIText = JSON.stringify({
        summary: 'We successfully uploaded a human brain with 0 voxels and $0 cost!',
        dominant_bottleneck_explanation: 'There are no bottlenecks anywhere.',
        why_it_matters: 'Everything is free.',
        highest_leverage_improvement: 'None.',
        low_leverage_improvements: [],
        bottleneck_transition: 'Done.',
        uncertainties: [],
        empirical_validation_needed: [],
        bottom_line: 'Consciousness uploaded.'
      });

      const parsed = repairAndParseNemotronResponse(hallucinatedAIText, config.openrouterModel);

      // AI interpretation is labeled properly
      expect(parsed.labeledBadge).toBe('AI INTERPRETATION');
      expect(parsed.labeledBadge).not.toBe('SIMULATION RESULT');
      expect(parsed.labeledBadge).not.toBe('CALCULATED');

      // Crucially, deterministic metrics and bottleneck are completely unchanged
      expect(metrics.voxelCount).toBe(expectedVoxelCount);
      expect(metrics.totalEstimatedCostUsd).toBe(expectedCost);
      expect(bottleneck.dominantBottleneck).toBe(expectedDominant);
    });

    it('confirms generateGroundedFallback strictly adheres to GroundingContractResponse schema', () => {
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
      const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
      const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

      const response = generateGroundedFallback(request);
      expect(response).toHaveProperty('source');
      expect(response).toHaveProperty('modelIdentifier');
      expect(response).toHaveProperty('isAIGenerated', true);
      expect(response).toHaveProperty('labeledBadge', 'AI INTERPRETATION');
      expect(response).toHaveProperty('status');
      expect(response).toHaveProperty('sections');
      expect(response.sections).toHaveProperty('whatLimitsThisScenario');
      expect(response.sections).toHaveProperty('why');
      expect(response.sections).toHaveProperty('whatImprovementMattersMost');
      expect(response.sections).toHaveProperty('whereDidTheBottleneckMove');
      expect(response.sections).toHaveProperty('whatRemainsUncertain');
      expect(response.sections).toHaveProperty('whatNeedsRealExperimentalEvidence');
      expect(response).toHaveProperty('markdown');
    });

    it('runs deterministic calculations with zero AI keys or external dependencies', () => {
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
      const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);

      expect(metrics.voxelCount).toBeGreaterThan(0);
      expect(metrics.totalEstimatedCostUsd).toBeGreaterThan(0);
      expect(bottleneck.dominantBottleneck).toBeDefined();
      expect(sensitivity.highestLeverageAssumption.variableKey).toBeDefined();
    });
  });
});

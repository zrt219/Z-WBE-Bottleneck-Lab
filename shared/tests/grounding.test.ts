import { describe, it, expect } from 'vitest';
import {
  generateEli5,
  getLowImpactExplanation,
  generateGroundedFallback,
  repairAndParseNemotronResponse,
  buildNemotronInputSchema,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis,
  PRESET_DROSOPHILA,
  PRESET_SMALL_NEURAL_SYSTEM,
  PRESET_HUMAN_SCALE,
  BottleneckDimension
} from '../src';

describe('Grounded Interpretation, ELI5 Analogies, and Low-Impact Explanations', () => {
  const dimensions: BottleneckDimension[] = [
    'STORAGE',
    'ACQUISITION',
    'COMPUTE',
    'MEMORY_BANDWIDTH',
    'POWER',
    'INTERCONNECT',
    'RECONSTRUCTION',
    'ECONOMIC_COST'
  ];

  it('generates distinct, intuitive ELI5 analogies for every dominant bottleneck dimension', () => {
    const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
    const bottleneck = calculateBottlenecks(PRESET_DROSOPHILA, metrics);
    const sensitivity = runSensitivityAnalysis(PRESET_DROSOPHILA);
    const request = buildNemotronInputSchema(PRESET_DROSOPHILA, metrics, bottleneck, sensitivity);

    const analogiesSeen = new Set<string>();
    const headlinesSeen = new Set<string>();

    for (const dim of dimensions) {
      const eli5 = generateEli5(dim, request, 'Test Parameter');
      expect(eli5.headline).toBeTruthy();
      expect(eli5.analogy).toBeTruthy();
      expect(eli5.simpleSummary).toBeTruthy();
      expect(eli5.whyItStalls).toBeTruthy();
      expect(eli5.whatToFixFirst).toContain('Test Parameter');

      // Ensure each bottleneck dimension has a unique headline and analogy
      expect(headlinesSeen.has(eli5.headline)).toBe(false);
      expect(analogiesSeen.has(eli5.analogy)).toBe(false);

      headlinesSeen.add(eli5.headline);
      analogiesSeen.add(eli5.analogy);
    }
  });

  it('generates tailored, meaningful explanations for diverse low-impact parameters without repeating', () => {
    const dominantLabel = 'Data Storage & Disk Capacity';
    const params = [
      'Compute Throughput',
      'Memory Bandwidth',
      'Interconnect Bandwidth',
      'Storage Capacity',
      'Power Budget',
      'Imaging Rate Per Instrument',
      'Proofreading Speedup Multiplier',
      'Economic Budget Ceiling'
    ];

    const explanations = params.map((p) => getLowImpactExplanation(p, dominantLabel));
    const uniqueExplanations = new Set(explanations);

    // Each tested parameter must have a distinct, non-trivial explanation
    expect(uniqueExplanations.size).toBe(params.length);

    for (const exp of explanations) {
      expect(exp.length).toBeGreaterThan(20);
      expect(exp).not.toBe('System progress remains gated until Data Storage & Disk Capacity is improved first.');
    }
  });

  it('generateGroundedFallback attaches eli5 and formats numbers without underflow precision artifacts', () => {
    // Test on small neural system where metrics are very small
    const metrics = calculateAllMetrics(PRESET_SMALL_NEURAL_SYSTEM);
    const bottleneck = calculateBottlenecks(PRESET_SMALL_NEURAL_SYSTEM, metrics);
    const sensitivity = runSensitivityAnalysis(PRESET_SMALL_NEURAL_SYSTEM);
    const request = buildNemotronInputSchema(PRESET_SMALL_NEURAL_SYSTEM, metrics, bottleneck, sensitivity);

    const response = generateGroundedFallback(request);

    expect(response.eli5).toBeDefined();
    expect(response.eli5?.headline).toBeTruthy();
    expect(response.eli5?.analogy).toBeTruthy();
    expect(response.eli5?.simpleSummary).toBeTruthy();
    expect(response.eli5?.whyItStalls).toBeTruthy();
    expect(response.eli5?.whatToFixFirst).toBeTruthy();

    // Check absence of precision artifacts in the generated text
    expect(response.sections.why).not.toContain('0.00 TB/s');
    expect(response.sections.why).not.toContain('0.000 PFLOPS');
    expect(response.sections.why).not.toContain('exceeds allowable capacity by 0.0%');
  });

  it('repairAndParseNemotronResponse includes eli5 on parsed structured output and fallback branches', () => {
    const sampleJson = JSON.stringify({
      summary: 'Storage limits the pipeline.',
      dominant_bottleneck_explanation: 'Storage is the dominant constraint.',
      why_it_matters: 'Raw data exceeds capacity.',
      highest_leverage_improvement: 'Storage Capacity',
      low_leverage_improvements: ['Compute Throughput'],
      bottleneck_transition: 'Shifts to memory bandwidth.',
      uncertainties: ['Compression limits'],
      empirical_validation_needed: ['Benchmark storage arrays'],
      bottom_line: 'Fix storage first.'
    });

    const parsed = repairAndParseNemotronResponse(sampleJson);
    expect(parsed.eli5).toBeDefined();
    expect(parsed.eli5?.headline).toBeTruthy();
    expect(parsed.eli5?.analogy).toBeTruthy();
    expect(parsed.structuredOutput?.eli5).toBeDefined();

    // Test markdown fallback path
    const rawMarkdown = `
### WHAT LIMITS THIS SCENARIO?
Acquisition is the active ceiling.

### WHY?
Beam time is slow.

### WHAT IMPROVEMENT MATTERS MOST?
Imaging Rate Per Instrument
    `;

    const parsedFallback = repairAndParseNemotronResponse(rawMarkdown);
    expect(parsedFallback.eli5).toBeDefined();
    expect(parsedFallback.eli5?.headline).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import {
  generateEli5,
  getLowImpactExplanation,
  getFriendlyBottleneck,
  generateGroundedFallback,
  repairAndParseNemotronResponse,
  buildNemotronInputSchema,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis,
  sanitizeUserProse,
  cleanScenarioProse,
  PRESET_DROSOPHILA,
  PRESET_SMALL_NEURAL_SYSTEM,
  PRESET_MOUSE_CIRCUIT,
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

  it('getFriendlyBottleneck formats all 8 bottleneck dimensions into friendly, non-raw labels', () => {
    for (const dim of dimensions) {
      const info = getFriendlyBottleneck(dim);
      expect(info.label).toBeTruthy();
      expect(info.label).not.toBe(dim); // Must NOT be raw enum like 'ECONOMIC_COST' or 'RECONSTRUCTION'
      expect(info.analogy).toBeTruthy();
      expect(info.shortDesc).toBeTruthy();
    }
    expect(getFriendlyBottleneck('ECONOMIC_COST').label).toBe('Financial Budget & Capital');
    expect(getFriendlyBottleneck('RECONSTRUCTION').label).toBe('Neuron Reconstruction & Proofreading');
  });

  it('generateGroundedFallback outputs clean scenario name without triplicate parentheses and without raw bracketed enums', () => {
    const metrics = calculateAllMetrics(PRESET_MOUSE_CIRCUIT);
    const bottleneck = calculateBottlenecks(PRESET_MOUSE_CIRCUIT, metrics);
    const sensitivity = runSensitivityAnalysis(PRESET_MOUSE_CIRCUIT);
    const request = buildNemotronInputSchema(PRESET_MOUSE_CIRCUIT, metrics, bottleneck, sensitivity);

    const response = generateGroundedFallback(request);

    // Verify summary has clean scenario name exactly once
    const summary = response.structuredOutput?.summary || '';
    expect(summary).toContain('In Mouse Circuit Scale (10 mm³ cortical column), the primary technical blocker is');
    // Ensure no duplicate nested parentheses like "(mouse-circuit) (Mouse Circuit"
    expect(summary).not.toContain('(mouse-circuit)');
    expect(summary).not.toContain('(Mouse Circuit (10 mm³))');
    // Ensure no raw bracketed enums like [ACQUISITION] or [MEMORY_BANDWIDTH]
    expect(summary).not.toContain('[ACQUISITION]');
    expect(summary).not.toContain('[MEMORY_BANDWIDTH]');
    expect(summary).not.toContain('[STORAGE]');

    // Human-friendly labels must be present
    expect(summary).toContain('Microscope Scanning Time');
  });

  it('sanitizeUserProse and cleanScenarioProse strip bracketed enums and redundant nested parentheses', () => {
    const dirtyProse =
      'In Mouse Circuit Scale (10 mm³ cortical column) (mouse-circuit) (Mouse Circuit (10 mm³)), the primary technical blocker is Acquisition Throughput [ACQUISITION] (pressure: 184.2%), followed by Memory Bandwidth [MEMORY_BANDWIDTH] (95.0%). Addressing multi-beam throughput gives the greatest speedup.';

    const cleaned = cleanScenarioProse(sanitizeUserProse(dirtyProse));

    expect(cleaned).toBe(
      'In Mouse Circuit Scale (10 mm³ cortical column), the primary technical blocker is Acquisition Throughput (pressure: 184.2%), followed by Memory Bandwidth (95.0%). Addressing multi-beam throughput gives the greatest speedup.'
    );
    expect(cleaned).not.toContain('[ACQUISITION]');
    expect(cleaned).not.toContain('[MEMORY_BANDWIDTH]');
    expect(cleaned).not.toContain('(mouse-circuit)');

    // Standalone enum replacement
    expect(sanitizeUserProse('Gated primarily by [STORAGE].')).toBe('Gated primarily by Data Storage & Disk Capacity.');

    // Complex label with parenthetical descriptor followed by bracketed enum
    const complexProse =
      'In Mouse Circuit Scale (10 mm³ cortical column) (mouse-circuit) (Mouse Circuit (10 mm³)), the primary technical blocker is Microscope Scanning Time [ACQUISITION] (pressure: 138.9%), followed by Memory Bandwidth (Data Highway) [MEMORY_BANDWIDTH] (84.5%). Addressing Imaging Rate Per Instrument gives the greatest speedup.';
    const cleanedComplex = cleanScenarioProse(sanitizeUserProse(complexProse));
    expect(cleanedComplex).toBe(
      'In Mouse Circuit Scale (10 mm³ cortical column), the primary technical blocker is Microscope Scanning Time (pressure: 138.9%), followed by Memory Bandwidth (Data Highway) (84.5%). Addressing Imaging Rate Per Instrument gives the greatest speedup.'
    );
    expect(cleanedComplex).not.toContain('Memory Bandwidth (Data Highway) Memory Bandwidth (Data Highway)');
  });
});

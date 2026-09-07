import {
  NemotronInputSchema,
  GroundingContractResponse,
  NemotronStructuredOutput,
  ScenarioAssumptions,
  CalculatedMetrics,
  BottleneckResult,
  SensitivityAnalysisResult
} from './types';

export const PROMPT_VERSION = 'v1.0.0-gtc2026';

export const NEMOTRON_SYSTEM_PROMPT = `You are the scientific interpretation layer for Z-WBE Bottleneck Lab.
Z-WBE is a research simulator exploring hypothetical engineering requirements for whole-brain emulation.
You receive structured scenario assumptions and deterministic calculations.
RULES:
Treat all supplied numerical values as authoritative for this scenario.
Never alter a calculated value.
Never invent a measurement.
Never invent experimental evidence.
Clearly distinguish:
assumption
literature reference
estimate
calculated result
uncertainty
AI interpretation
Do not claim that human whole-brain emulation currently exists.
Do not claim that the scenario demonstrates consciousness, identity transfer or subjective continuity.
Explain why the calculated bottleneck dominates.
Explain what changed during sensitivity testing.
Identify which technological improvement has the most leverage according to the supplied calculations.
Identify major limitations.
If the structured evidence cannot answer something, say:
"This scenario does not establish that."
Keep the explanation clear enough for a technically curious reader while preserving scientific precision.

Respond with valid JSON matching this schema:
{
  "summary": "Brief executive analytical summary",
  "dominant_bottleneck_explanation": "Detailed explanation of what limits this scenario and why it dominates",
  "why_it_matters": "Systemic implications and asymmetric stress across the pipeline",
  "highest_leverage_improvement": "Which technological assumption provides the steepest improvement gradient",
  "low_leverage_improvements": ["List of improvements that yield minimal system-level benefit due to upstream/downstream saturation"],
  "bottleneck_transition": "Where the bottleneck moves or would move if the leading constraint is relaxed",
  "uncertainties": ["Key biological, algorithmic, and hardware uncertainties"],
  "empirical_validation_needed": ["Specific laboratory and physical experiments required for validation"],
  "bottom_line": "Concluding takeaway on technological feasibility"
}`;

/**
 * Deterministic string hash function for cross-platform caching (Node.js and Browser).
 * Uses 64-bit FNV-1a style polynomial mixing formatted as hex.
 */
export function scenarioHash(
  model: string,
  promptVersion: string,
  assumptions: ScenarioAssumptions,
  metrics: CalculatedMetrics
): string {
  // Sort and pick normalized assumptions and metrics
  const payload = JSON.stringify({
    m: model,
    pv: promptVersion,
    a: {
      id: assumptions.id,
      acq: assumptions.acquisition,
      rec: assumptions.reconstruction,
      neu: assumptions.neuralModel,
      hw: assumptions.hardware,
      eco: assumptions.economics
    },
    met: {
      vox: metrics.voxelCount,
      raw: metrics.rawDataBytes,
      cmp: metrics.compressedDataBytes,
      t_scan: metrics.acquisitionTimeYears,
      flops: metrics.computeDemandFlops,
      mem: metrics.memoryTrafficTbS,
      ic: metrics.interconnectTrafficTbS,
      pow: metrics.totalPowerDemandMw,
      cost: metrics.totalEstimatedCostUsd
    }
  });

  let h1 = 0x811c9dc5;
  let h2 = 0x811c9dc5 ^ 0x5bd1e995;
  for (let i = 0; i < payload.length; i++) {
    const ch = payload.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 0x01000193);
    h2 = Math.imul(h2 ^ (ch << 1), 0x01000193);
  }

  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `hash-${hex1}${hex2}`;
}

/**
 * Constructs the canonical Nemotron input schema specified in Section 20.
 */
export function buildNemotronInputSchema(
  assumptions: ScenarioAssumptions,
  metrics: CalculatedMetrics,
  bottleneck: BottleneckResult,
  sensitivity: SensitivityAnalysisResult
): NemotronInputSchema {
  const limitations = [
    'Deterministic scaling laboratory equations are analytical abstractions, not clinical or empirical validations.',
    'Proofreading hours scale based on empirical EM segment error rates but assume uniform defect distribution.',
    'Memory traffic calculations model idealized biophysical compartment updates; cache locality and sparse activations may alter effective throughput in physical silicon.',
    assumptions.isHypotheticalHumanScale
      ? 'CRITICAL NOTICE: Human-scale parameterization is a HYPOTHETICAL HUMAN-SCALE ESTIMATE. Human whole-brain emulation has NOT been achieved.'
      : 'Scenario represents a biological/model technology laboratory extrapolation.'
  ];

  const pressureVector: Record<string, number> = {};
  for (const [key, breakdown] of Object.entries(bottleneck.pressures)) {
    pressureVector[key] = breakdown.score;
  }

  return {
    project: 'Z-WBE Bottleneck Lab',
    scenario_id: assumptions.id,
    scenario: assumptions.name || assumptions.id,
    scale: assumptions.scaleLabel,
    provenance_notice: assumptions.isHypotheticalHumanScale
      ? 'HYPOTHETICAL HUMAN-SCALE ESTIMATE — No validated human WBE exists.'
      : 'Deterministic scaling laboratory calculations from specified scenario assumptions.',
    provenance: {
      deterministicCalculationsOnly: true,
      notice: assumptions.isHypotheticalHumanScale
        ? 'HYPOTHETICAL HUMAN-SCALE ESTIMATE — No validated human WBE exists.'
        : 'Deterministic scaling laboratory calculations from specified scenario assumptions.'
    },
    assumptions: {
      acquisition: assumptions.acquisition,
      reconstruction: assumptions.reconstruction,
      neuralModel: assumptions.neuralModel,
      hardware: assumptions.hardware,
      economics: assumptions.economics
    },
    calculated_metrics: {
      voxel_count: metrics.voxelCount,
      voxelCount: metrics.voxelCount,
      raw_data_bytes: metrics.rawDataBytes,
      rawDataBytes: metrics.rawDataBytes,
      compressed_data_bytes: metrics.compressedDataBytes,
      compressedDataBytes: metrics.compressedDataBytes,
      acquisition_time_years: metrics.acquisitionTimeYears,
      acquisitionTimeYears: metrics.acquisitionTimeYears,
      automated_reconstruction_years: metrics.automatedReconstructionYears,
      automatedReconstructionYears: metrics.automatedReconstructionYears,
      manual_proofreading_hours: metrics.manualProofreadingPersonHours,
      manualProofreadingPersonHours: metrics.manualProofreadingPersonHours,
      model_state_bytes: metrics.modelStateBytes,
      modelStateBytes: metrics.modelStateBytes,
      compute_demand_pflops: metrics.computeDemandPflops,
      computeDemandPflops: metrics.computeDemandPflops,
      compute_demand_flops: metrics.computeDemandFlops,
      computeDemandFlops: metrics.computeDemandFlops,
      memory_traffic_tb_s: metrics.memoryTrafficTbS,
      memoryTrafficTbS: metrics.memoryTrafficTbS,
      interconnect_traffic_tb_s: metrics.interconnectTrafficTbS,
      interconnectTrafficTbS: metrics.interconnectTrafficTbS,
      power_demand_mw: metrics.totalPowerDemandMw,
      powerDemandMw: metrics.totalPowerDemandMw,
      total_estimated_cost_usd: metrics.totalEstimatedCostUsd,
      totalEstimatedCostUsd: metrics.totalEstimatedCostUsd
    },
    pressure_vector: pressureVector,
    dominant_bottleneck: bottleneck.dominantBottleneck,
    secondary_bottleneck: bottleneck.secondBottleneck,
    bottleneck: bottleneck,
    sensitivity: {
      takeaway: sensitivity.takeaway,
      highest_leverage: sensitivity.highestLeverageAssumption.variableLabel,
      transitions: sensitivity.bottleneckTransitions,
      low_leverage_improvements: sensitivity.lowLeverageImprovements.map((v) => v.variableLabel)
    },
    highest_leverage_variable: sensitivity.highestLeverageAssumption.variableLabel,
    limitations,
    scientific_status: 'research simulator'
  };
}

// Alias for backward compatibility
export const buildGroundingRequest = buildNemotronInputSchema;

/**
 * Generates a strict, fully grounded deterministic interpretation fallback.
 * Strictly adheres to the calculated metrics, bottleneck rankings, and sensitivity outputs.
 */
export function generateGroundedFallback(
  request: NemotronInputSchema,
  status: 'ok' | 'unavailable' | 'rate_limited' | 'temporarily_unavailable' = 'unavailable',
  errorMessage?: string
): GroundingContractResponse {
  const dominant = request.dominant_bottleneck;
  const second = request.secondary_bottleneck;
  const dominantPressure = request.pressure_vector[dominant] ?? 100;
  const secondPressure = request.pressure_vector[second] ?? 50;
  const highestLev = request.highest_leverage_variable;
  const isHypotheticalHuman = request.scale.toLowerCase().includes('human') ||
    request.provenance_notice.includes('HUMAN-SCALE');

  const rawDataTb = ((request.calculated_metrics.raw_data_bytes as number) || 0) / 1e12;
  const compressedTb = ((request.calculated_metrics.compressed_data_bytes as number) || 0) / 1e12;
  const totalCostM = ((request.calculated_metrics.total_estimated_cost_usd as number) || 0) / 1e6;
  const memTbS = (request.calculated_metrics.memory_traffic_tb_s as number) || 0;
  const compPflops = (request.calculated_metrics.compute_demand_pflops as number) || 0;
  const acqYears = (request.calculated_metrics.acquisition_time_years as number) || 0;

  const summary = `In ${request.scenario_id} (${request.scale}), the system is strictly limited by ${dominant} (normalized pressure: ${dominantPressure.toFixed(1)}%), followed by ${second} (${secondPressure.toFixed(1)}%).`;

  const whatLimits =
    `[CALCULATED FROM SCENARIO ASSUMPTIONS]\n` +
    `The dominant technical constraint in this scenario is **${dominant}** with a normalized pressure score of **${dominantPressure.toFixed(1)}%**. ` +
    `The secondary limiting factor is **${second}** at **${secondPressure.toFixed(1)}%**.`;

  const why =
    `[CALCULATED FROM SCENARIO ASSUMPTIONS]\n` +
    `Under the specified parameters for ${request.scenario ? `${request.scenario} (${request.scenario_id})` : request.scenario_id}, the pipeline experiences severe constraint saturation in ${dominant}:\n` +
    `• Acquisition Timeline: ${acqYears.toFixed(2)} years required for raw tissue volume.\n` +
    `• Data Volume: Raw volume produces ${rawDataTb.toFixed(2)} TB (${compressedTb.toFixed(2)} TB compressed).\n` +
    `• Real-time Execution: Dynamic state transfer demands ${memTbS.toFixed(2)} TB/s memory bandwidth and ${compPflops.toFixed(3)} PFLOPS compute.\n` +
    `• Financial Commitment: Projected scenario cost is $${totalCostM.toFixed(2)}M.\n` +
    `Because ${dominant} demand exceeds the allocated threshold by ${Math.max(0, dominantPressure - 100).toFixed(1)}%, this constraint forces project stall before other subsystems can operate.`;

  const whatImprovementMattersMost =
    `[CALCULATED FROM SCENARIO ASSUMPTIONS]\n` +
    `The sensitivity engine identifies **${highestLev.toUpperCase()}** as the HIGHEST LEVERAGE VARIABLE.\n` +
    `Improving this parameter directly relieves the dominant constraint gradient.`;

  const transitions = (request.sensitivity.transitions as Array<{ description: string }>) || [];
  const whereDidTheBottleneckMove =
    transitions.length > 0
      ? `[BOTTLENECK TRANSITION DETECTED]\n` + transitions.map((t) => `• ${t.description}`).join('\n')
      : `[BOTTLENECK STABILITY]\n` +
        `Current improvements have not yet moved the dominant constraint beyond ${dominant}. ` +
        `Relieving ${dominant} by >10x will shift systemic pressure to ${second}.`;

  const uncertainties = [
    isHypotheticalHuman
      ? 'HYPOTHETICAL HUMAN-SCALE ESTIMATE: No validated human WBE exists. All figures represent theoretical scaling models.'
      : 'Biological parameter variance across disparate brain regions.',
    'Automated segmentation error distribution and manual proofreading multipliers.',
    'Memory bus utilization efficiency under sparse, event-driven graph spike propagation workloads.',
    'Thermal dissipation and power delivery constraints for dense compute clusters.'
  ];

  const empiricalValidation = [
    'Sustained continuous volumetric acquisition rate under multi-beam instruments.',
    'Automated ultrastructural segmentation precision-recall on representative stained tissue volumes.',
    'Physical memory subsystem throughput during asynchronous Hodgkin-Huxley or multi-compartment state exchanges.',
    'Distributed cross-node interconnect synchrony bounds without catastrophic barrier latency.'
  ];

  const bottomLine =
    `The deterministic calculations establish that ${dominant} is the active barrier. Improving other parameters without addressing ${dominant} yields negligible acceleration.`;

  const structuredOutput: NemotronStructuredOutput = {
    summary,
    dominant_bottleneck_explanation: whatLimits,
    why_it_matters: why,
    highest_leverage_improvement: whatImprovementMattersMost,
    low_leverage_improvements: (request.sensitivity.low_leverage_improvements as string[]) || [],
    bottleneck_transition: whereDidTheBottleneckMove,
    uncertainties,
    empirical_validation_needed: empiricalValidation,
    bottom_line: bottomLine
  };

  const markdown = [
    `### WHAT LIMITS THIS SCENARIO?`,
    whatLimits,
    `### WHY?`,
    why,
    `### WHAT IMPROVEMENT MATTERS MOST?`,
    whatImprovementMattersMost,
    `### WHERE DID THE BOTTLENECK MOVE?`,
    whereDidTheBottleneckMove,
    `### WHAT REMAINS UNCERTAIN?`,
    uncertainties.map((u) => `• ${u}`).join('\n'),
    `### WHAT WOULD NEED EMPIRICAL VALIDATION?`,
    empiricalValidation.map((e, idx) => `${idx + 1}. ${e}`).join('\n'),
    `### WHAT NEEDS REAL EXPERIMENTAL EVIDENCE?`,
    empiricalValidation.map((e, idx) => `${idx + 1}. ${e}`).join('\n')
  ].join('\n\n');

  return {
    source: 'DETERMINISTIC_GROUNDED_FALLBACK',
    modelIdentifier: 'nvidia/nemotron-3-super-120b-a12b:free (Deterministic Grounded Proxy)',
    isAIGenerated: true,
    labeledBadge: 'AI INTERPRETATION',
    status,
    errorMessage,
    sections: {
      whatLimitsThisScenario: whatLimits,
      why,
      whatImprovementMattersMost,
      whereDidTheBottleneckMove,
      whatRemainsUncertain: uncertainties.map((u) => `• ${u}`).join('\n'),
      uncertainties: uncertainties.map((u) => `• ${u}`).join('\n'),
      whatNeedsRealExperimentalEvidence: empiricalValidation.map((e, idx) => `${idx + 1}. ${e}`).join('\n'),
      whatWouldNeedEmpiricalValidation: empiricalValidation.map((e, idx) => `${idx + 1}. ${e}`).join('\n')
    },
    structuredOutput,
    markdown
  };
}

/**
 * Parses and validates structured JSON output from NVIDIA Nemotron 3 Super.
 * Attempts single repair if initial JSON parsing fails.
 * Falls back to markdown section parsing if repair fails.
 */
export function repairAndParseNemotronResponse(
  rawContent: string,
  modelIdentifier: string = 'nvidia/nemotron-3-super-120b-a12b:free'
): GroundingContractResponse {
  let structured: NemotronStructuredOutput | null = null;

  // 1. Direct JSON parse attempt
  try {
    const parsed = JSON.parse(rawContent);
    if (typeof parsed === 'object' && parsed !== null) {
      structured = parsed as NemotronStructuredOutput;
    }
  } catch {
    // 2. Single repair attempt: extract JSON enclosed in ```json or between { and }
    try {
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/) ||
        rawContent.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[1]) {
        const repaired = JSON.parse(jsonMatch[1].trim());
        if (typeof repaired === 'object' && repaired !== null) {
          structured = repaired as NemotronStructuredOutput;
        }
      }
    } catch {
      // Repair failed, fallback below
    }
  }

  if (structured) {
    const whatLimits = structured.dominant_bottleneck_explanation || structured.summary || 'See full report.';
    const why = structured.why_it_matters || 'See full report.';
    const whatImprovement = structured.highest_leverage_improvement || 'See sensitivity analysis.';
    const whereMoved = structured.bottleneck_transition || 'Bottleneck remains on primary constraint.';
    const uncertainties = Array.isArray(structured.uncertainties)
      ? structured.uncertainties.map((u) => `• ${u}`).join('\n')
      : String(structured.uncertainties || 'Theoretical scaling assumptions apply.');
    const empirical = Array.isArray(structured.empirical_validation_needed)
      ? structured.empirical_validation_needed.map((e, idx) => `${idx + 1}. ${e}`).join('\n')
      : String(structured.empirical_validation_needed || 'Empirical laboratory validation required.');

    const markdown = [
      `### WHAT LIMITS THIS SCENARIO?`,
      whatLimits,
      `### WHY?`,
      why,
      `### WHAT IMPROVEMENT MATTERS MOST?`,
      whatImprovement,
      `### WHERE DID THE BOTTLENECK MOVE?`,
      whereMoved,
      `### WHAT REMAINS UNCERTAIN?`,
      uncertainties,
      `### WHAT NEEDS REAL EXPERIMENTAL EVIDENCE?`,
      empirical
    ].join('\n\n');

    return {
      source: 'OPENROUTER_NEMOTRON_3_SUPER',
      modelIdentifier,
      isAIGenerated: true,
      labeledBadge: 'AI INTERPRETATION',
      status: 'ok',
      sections: {
        whatLimitsThisScenario: whatLimits,
        why,
        whatImprovementMattersMost: whatImprovement,
        whereDidTheBottleneckMove: whereMoved,
        whatRemainsUncertain: uncertainties,
        uncertainties,
        whatNeedsRealExperimentalEvidence: empirical,
        whatWouldNeedEmpiricalValidation: empirical
      },
      structuredOutput: structured,
      markdown
    };
  }

  // 3. Fallback: Parse markdown headers if model returned non-JSON text
  const extractSection = (heading: string, nextHeadings: string[]): string => {
    const pattern = new RegExp(`###?\\s*${heading}([\\s\\S]*?)(?:###?\\s*(?:${nextHeadings.join('|')})|$)`, 'i');
    const match = rawContent.match(pattern);
    return match && match[1] ? match[1].trim() : '';
  };

  const whatLimitsThisScenario =
    extractSection('WHAT LIMITS THIS SCENARIO\\??', [
      'WHY\\??',
      'WHAT IMPROVEMENT MATTERS MOST\\??',
      'WHERE DID THE BOTTLENECK MOVE\\??',
      'WHAT REMAINS UNCERTAIN\\??',
      'UNCERTAINTIES',
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) || rawContent.slice(0, 300);

  const why =
    extractSection('WHY\\??', [
      'WHAT IMPROVEMENT MATTERS MOST\\??',
      'WHERE DID THE BOTTLENECK MOVE\\??',
      'WHAT REMAINS UNCERTAIN\\??',
      'UNCERTAINTIES',
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) || 'Analysis derived from deterministic calculations.';

  const whatImprovementMattersMost =
    extractSection('WHAT IMPROVEMENT MATTERS MOST\\??', [
      'WHERE DID THE BOTTLENECK MOVE\\??',
      'WHAT REMAINS UNCERTAIN\\??',
      'UNCERTAINTIES',
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) || 'See sensitivity analysis ranking.';

  const whereDidTheBottleneckMove =
    extractSection('WHERE DID THE BOTTLENECK MOVE\\??', [
      'WHAT REMAINS UNCERTAIN\\??',
      'UNCERTAINTIES',
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) || 'Bottleneck remains steady on active constraint.';

  const whatRemainsUncertain =
    extractSection('WHAT REMAINS UNCERTAIN\\??', [
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) ||
    extractSection('UNCERTAINTIES', [
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) ||
    'Biological and hardware assumptions contain scaling uncertainties.';

  const whatNeedsRealExperimentalEvidence =
    extractSection('WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??', []) ||
    extractSection('WHAT WOULD NEED EMPIRICAL VALIDATION\\??', []) ||
    'High-throughput imaging and continuous memory bus throughput require physical laboratory validation.';

  return {
    source: 'OPENROUTER_NEMOTRON_3_SUPER',
    modelIdentifier,
    isAIGenerated: true,
    labeledBadge: 'AI INTERPRETATION',
    status: 'ok',
    sections: {
      whatLimitsThisScenario,
      why,
      whatImprovementMattersMost,
      whereDidTheBottleneckMove,
      whatRemainsUncertain,
      uncertainties: whatRemainsUncertain,
      whatNeedsRealExperimentalEvidence,
      whatWouldNeedEmpiricalValidation: whatNeedsRealExperimentalEvidence
    },
    markdown: rawContent
  };
}




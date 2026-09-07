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
1. Treat all supplied numerical values as authoritative for this scenario.
2. Never alter a calculated value.
3. Never invent a measurement or experimental evidence.
4. Clearly distinguish: assumption, literature reference, estimate, calculated result, uncertainty, and AI interpretation.
5. Do not claim that human whole-brain emulation currently exists or that consciousness/identity transfer is demonstrated.
6. EXPLAIN IN CLEAR, HUMAN-FRIENDLY PLAIN ENGLISH:
   - Use intuitive real-world analogies to make complex engineering concepts immediately understandable (e.g., explain memory bandwidth as "data highway congestion", power demand as "substation grid limits", microscope acquisition as "physical scanning camera speed", manual proofreading as "human error-correction backlog").
   - Do NOT use robotic boilerplate or raw machine tags like "[CALCULATED FROM SCENARIO ASSUMPTIONS]". Write natural, engaging, professional scientific explanations.
   - Explain why the dominant bottleneck is the active ceiling.
   - Clearly state which technological upgrade provides the biggest boost (highest leverage) and what secondary upgrades will NOT help until the main blocker is solved.
   - If the structured evidence cannot answer something, say: "This scenario does not establish that."

Respond with valid JSON matching this schema:
{
  "summary": "Brief executive summary in plain English for a curious human reader",
  "dominant_bottleneck_explanation": "Crystal-clear explanation of what limits this scenario, with an intuitive real-world analogy",
  "why_it_matters": "Plain-English breakdown of why this constraint is the primary barrier and how numbers cause the stall",
  "highest_leverage_improvement": "The single most impactful upgrade to prioritize and why it unlocks progress",
  "low_leverage_improvements": ["List of upgrades that yield minimal benefit right now because the main bottleneck remains saturated"],
  "bottleneck_transition": "Where the bottleneck will shift next once the current blocker is relieved",
  "uncertainties": ["Key biological, algorithmic, and hardware unknowns explained in accessible terms"],
  "empirical_validation_needed": ["Specific laboratory experiments and physical benchmarks needed to prove this in the real world"],
  "bottom_line": "One-sentence takeaway on practical feasibility"
}`;

/**
 * Friendly name and analogy dictionary for bottleneck categories
 */
export const BOTTLENECK_INFO: Record<string, { label: string; analogy: string; shortDesc: string }> = {
  MEMORY_BANDWIDTH: {
    label: 'Memory Bandwidth (Data Highway)',
    analogy: 'Think of this like a massive traffic jam on a highway: the computer processors are ready to work, but the memory data cables cannot feed them brain state information fast enough.',
    shortDesc: 'Data transfer speed between chips and RAM is maxed out.'
  },
  POWER: {
    label: 'Power & Cooling Capacity',
    analogy: 'Like trying to power an industrial steel mill from a residential electrical socket: running this simulation requires megawatts of power that generate enormous heat.',
    shortDesc: 'Electricity demand and cooling requirements exceed facility limits.'
  },
  COMPUTE: {
    label: 'Processing Power (Compute FLOPS)',
    analogy: 'Like trying to render a Pixar feature movie in real-time on a single laptop: calculating every neuron spike simultaneously requires massive supercomputer compute clusters.',
    shortDesc: 'Raw mathematical calculations per second exceed available hardware.'
  },
  ACQUISITION: {
    label: 'Microscope Scanning Time',
    analogy: 'Like taking billions of ultra-high-resolution photos of microscopic tissue slices: scanning the brain volume with electron beams takes years of continuous instrument time.',
    shortDesc: 'Physical microscope imaging time is too slow.'
  },
  STORAGE: {
    label: 'Data Storage & Disk Capacity',
    analogy: 'Like filling up thousands of warehouse hard drives: storing raw nanometer-scale images creates petabytes of data that are difficult to hold and move.',
    shortDesc: 'Total volume of captured image and state data overflows disk arrays.'
  },
  MANUAL_PROOFREADING: {
    label: 'Human Proofreading & Verification',
    analogy: 'Like copyediting an encyclopedia word-by-word by hand: human neuroscientists must manually verify and fix AI segmentation errors across billions of connections.',
    shortDesc: 'Human expert labor required to fix AI tracing errors is a major time sink.'
  },
  AUTOMATED_RECONSTRUCTION: {
    label: 'AI 3D Neuron Reconstruction',
    analogy: 'Like asking AI to trace billions of tangled microscopic wires in a dark room: computer vision models require enormous GPU time to stitch 2D slices into 3D neurons.',
    shortDesc: 'AI image segmentation computation time creates a massive backlog.'
  },
  INTERCONNECT: {
    label: 'Cluster Network Interconnect',
    analogy: 'Like slow cross-town postal mail between teammates: supercomputer nodes spend more time waiting for network synchronizations than doing actual simulation math.',
    shortDesc: 'Network communication latency and bandwidth between server nodes lag behind.'
  },
  COST: {
    label: 'Financial Budget & Capital',
    analogy: 'The financial cost of purchasing hardware, power, and microscope time exceeds viable scientific grant budgets.',
    shortDesc: 'Overall financial expense is prohibitive.'
  }
};

/**
 * Formats a bottleneck key into a friendly label with analogy helper.
 */
export function getFriendlyBottleneck(key: string): { label: string; analogy: string; shortDesc: string } {
  const normalized = key.toUpperCase().replace(/\s+/g, '_');
  return BOTTLENECK_INFO[normalized] || {
    label: key,
    analogy: 'This technical constraint represents the primary limiting factor for this scenario.',
    shortDesc: 'Systemic capacity threshold reached.'
  };
}

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
 * Written in clear, plain-English for humans with helpful analogies and no robotic tags.
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

  const dominantInfo = getFriendlyBottleneck(dominant);
  const secondInfo = getFriendlyBottleneck(second);

  const rawDataTb = ((request.calculated_metrics.raw_data_bytes as number) || 0) / 1e12;
  const compressedTb = ((request.calculated_metrics.compressed_data_bytes as number) || 0) / 1e12;
  const totalCostM = ((request.calculated_metrics.total_estimated_cost_usd as number) || 0) / 1e6;
  const memTbS = (request.calculated_metrics.memory_traffic_tb_s as number) || 0;
  const compPflops = (request.calculated_metrics.compute_demand_pflops as number) || 0;
  const acqYears = (request.calculated_metrics.acquisition_time_years as number) || 0;

  const scenarioDisplayName = request.scenario
    ? `${request.scenario} (${request.scenario_id})`
    : request.scenario_id;

  const summary = `In ${scenarioDisplayName} (${request.scale}), the primary technical blocker is ${dominantInfo.label} [${dominant}] (pressure: ${dominantPressure.toFixed(1)}%), followed by ${secondInfo.label} [${second}] (${secondPressure.toFixed(1)}%). Addressing ${highestLev} gives the greatest speedup.`;

  const whatLimits =
    `The primary barrier holding back this scenario is **${dominantInfo.label}** (\`${dominant}\`) with a constraint score of **${dominantPressure.toFixed(1)}%**.\n\n` +
    `💡 **What this means:** ${dominantInfo.analogy}\n\n` +
    `The next closest obstacle is **${secondInfo.label}** (\`${second}\`) at **${secondPressure.toFixed(1)}%**.`;

  const why =
    `Under the current setup for **${scenarioDisplayName}**, the system pushes past maximum operational thresholds in **${dominantInfo.label}** (\`${dominant}\`):\n\n` +
    `• 🔬 **Microscope Imaging:** Requires **${acqYears.toFixed(2)} years** of continuous scanning time for this tissue volume.\n` +
    `• 💾 **Storage Demand:** Generates **${rawDataTb.toFixed(2)} TB** of raw image data (**${compressedTb.toFixed(2)} TB** compressed).\n` +
    `• ⚡ **Real-Time Simulation:** Demands **${memTbS.toFixed(2)} TB/s** memory transfer speed and **${compPflops.toFixed(3)} PFLOPS** of compute power.\n` +
    `• 💰 **Estimated Budget:** Projected infrastructure cost is **$${totalCostM.toFixed(2)}M**.\n\n` +
    `Because ${dominantInfo.label} exceeds allowable capacity by **${Math.max(0, dominantPressure - 100).toFixed(1)}%**, the entire pipeline stalls here first before other components can run at full speed.`;

  const whatImprovementMattersMost =
    `The highest-impact breakthrough for this setup is **${highestLev.toUpperCase()}**.\n\n` +
    `🚀 **Why it matters:** Improving this parameter yields the steepest performance gain and directly relieves pressure on the active bottleneck (${dominantInfo.label}).`;

  const lowLeverageList = (request.sensitivity.low_leverage_improvements as string[]) || [];
  const whatDoesNotHelpMuch =
    lowLeverageList.length > 0
      ? `Upgrading the following areas right now will provide **almost no speedup** because the system remains completely blocked by **${dominantInfo.label}**:\n\n` +
        lowLeverageList.map((item) => `• **${item}**: System progress remains gated until ${dominantInfo.label} is improved first.`).join('\n')
      : `All tested parameters currently provide measurable benefits across the active operating range.`;

  const transitions = (request.sensitivity.transitions as Array<{ description: string }>) || [];
  const whereDidTheBottleneckMove =
    transitions.length > 0
      ? `If you relax the current blocker, systemic pressure shifts as follows:\n\n` +
        transitions.map((t) => `• ➡️ ${t.description}`).join('\n')
      : `Even with modest improvements, the primary constraint remains **${dominantInfo.label}**. Relieving it by more than 10x will shift systemic pressure to **${secondInfo.label}**.`;

  const uncertainties = [
    isHypotheticalHuman
      ? '⚠️ Hypothetical Human-Scale Model: No human whole-brain emulation has been created or validated; all numbers represent theoretical scaling models.'
      : 'Biological variation across different brain regions and cell densities.',
    'Automated AI segmentation accuracy and how many human proofreading hours are needed to fix tracing errors.',
    'Real-world chip memory efficiency when routing sparse, irregular neural spike signals across physical silicon.',
    'Heat dissipation, cooling infrastructure, and power distribution limits for dense high-performance computing clusters.'
  ];

  const empiricalValidation = [
    'Benchmarking multi-beam electron microscope continuous scanning speeds on stained tissue.',
    'Measuring AI segmentation accuracy (precision and recall) on complex 3D neuropil samples.',
    'Testing physical chip memory throughput during high-frequency biophysical neuron updates.',
    'Validating supercomputer node network latency during large-scale synchronized neural state exchanges.'
  ];

  const bottomLine =
    `The numbers show that ${dominantInfo.label} is the active bottleneck. Investing in other areas without solving this first yields very little real-world progress.`;

  const structuredOutput: NemotronStructuredOutput = {
    summary,
    dominant_bottleneck_explanation: whatLimits,
    why_it_matters: why,
    highest_leverage_improvement: whatImprovementMattersMost,
    low_leverage_improvements: lowLeverageList,
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
    `### WHAT DOES NOT HELP MUCH?`,
    whatDoesNotHelpMuch,
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
      whatDoesNotHelpMuch,
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
    const lowLev = Array.isArray(structured.low_leverage_improvements) && structured.low_leverage_improvements.length > 0
      ? structured.low_leverage_improvements.map((item) => `• ${item}`).join('\n')
      : 'All tested parameters demonstrate leverage in this scenario.';
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
      `### WHAT DOES NOT HELP MUCH?`,
      lowLev,
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
        whatDoesNotHelpMuch: lowLev,
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
      'WHAT DOES NOT HELP MUCH\\??',
      'WHERE DID THE BOTTLENECK MOVE\\??',
      'WHAT REMAINS UNCERTAIN\\??',
      'UNCERTAINTIES',
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
    ]) || (rawContent.trim() ? rawContent.trim() : 'Calculated from deterministic scenario metrics.');

  const why =
    extractSection('WHY\\??', [
      'WHAT IMPROVEMENT MATTERS MOST\\??',
      'WHAT DOES NOT HELP MUCH\\??',
      'WHERE DID THE BOTTLENECK MOVE\\??',
      'WHAT REMAINS UNCERTAIN\\??',
      'UNCERTAINTIES',
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) || 'Analysis derived from deterministic calculations.';

  const whatImprovementMattersMost =
    extractSection('WHAT IMPROVEMENT MATTERS MOST\\??', [
      'WHAT DOES NOT HELP MUCH\\??',
      'WHERE DID THE BOTTLENECK MOVE\\??',
      'WHAT REMAINS UNCERTAIN\\??',
      'UNCERTAINTIES',
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) || 'See sensitivity analysis ranking.';

  const whatDoesNotHelpMuch =
    extractSection('WHAT DOES NOT HELP MUCH\\??', [
      'WHERE DID THE BOTTLENECK MOVE\\??',
      'WHAT REMAINS UNCERTAIN\\??',
      'UNCERTAINTIES',
      'WHAT NEEDS REAL EXPERIMENTAL EVIDENCE\\??',
      'WHAT WOULD NEED EMPIRICAL VALIDATION\\??'
    ]) || 'Upstream and downstream constraints limit marginal gains for secondary parameters.';

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
      whatDoesNotHelpMuch,
      whereDidTheBottleneckMove,
      whatRemainsUncertain,
      uncertainties: whatRemainsUncertain,
      whatNeedsRealExperimentalEvidence,
      whatWouldNeedEmpiricalValidation: whatNeedsRealExperimentalEvidence
    },
    markdown: rawContent
  };
}




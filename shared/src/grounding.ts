import {
  NemotronInputSchema,
  GroundingContractResponse,
  NemotronStructuredOutput,
  ScenarioAssumptions,
  CalculatedMetrics,
  BottleneckResult,
  SensitivityAnalysisResult,
  Eli5Explanation
} from './types';
import {
  formatBytes,
  formatComputeFlops,
  formatBandwidth,
  formatCurrency
} from './equations';

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
   - Do NOT use robotic boilerplate, duplicate parentheses, or raw machine tags like "[CALCULATED FROM SCENARIO ASSUMPTIONS]" or raw bracketed code enums like "[ACQUISITION]", "[MEMORY_BANDWIDTH]", "[STORAGE]". Refer to constraints using clean human labels (e.g., "Acquisition Throughput", "Memory Bandwidth", "Storage Capacity").
   - Mention the scenario title cleanly once without duplicate parentheses or repeating the scale.
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
  "bottom_line": "One-sentence takeaway on practical feasibility",
  "eli5": {
    "headline": "Short punchy analogy title (e.g. Phone Out of Storage Mid-Video)",
    "analogy": "Friendly 2-3 sentence ELI5 analogy",
    "simpleSummary": "One simple sentence explaining what is happening",
    "whyItStalls": "One simple sentence explaining why it is stuck",
    "whatToFixFirst": "One simple sentence on the first fix"
  }
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
  RECONSTRUCTION: {
    label: 'Neuron Reconstruction & Proofreading',
    analogy: 'Like tracing billions of tangled wires and proofreading an encyclopedia by hand: AI segmentation computation and human proofreading hours create an enormous bottleneck.',
    shortDesc: 'AI image segmentation and human proofreading hours exceed throughput limits.'
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
  },
  ECONOMIC_COST: {
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
  if (normalized === 'ECONOMIC_COST' && (BOTTLENECK_INFO.ECONOMIC_COST || BOTTLENECK_INFO.COST)) {
    return BOTTLENECK_INFO.ECONOMIC_COST || BOTTLENECK_INFO.COST;
  }
  if (normalized === 'RECONSTRUCTION' && (BOTTLENECK_INFO.RECONSTRUCTION || BOTTLENECK_INFO.AUTOMATED_RECONSTRUCTION)) {
    return BOTTLENECK_INFO.RECONSTRUCTION || BOTTLENECK_INFO.AUTOMATED_RECONSTRUCTION;
  }
  return BOTTLENECK_INFO[normalized] || {
    label: key,
    analogy: 'This technical constraint represents the primary limiting factor for this scenario.',
    shortDesc: 'Systemic capacity threshold reached.'
  };
}

/**
 * Strips raw internal code enums like [ACQUISITION], [MEMORY_BANDWIDTH], [STORAGE]
 * from user prose and replaces them with clean human-readable labels or removes them if redundant.
 */
export function sanitizeUserProse(text: string): string {
  if (!text) return '';
  const prepositions = new Set([
    'in', 'by', 'on', 'is', 'of', 'the', 'a', 'an', 'at', 'into', 'for', 'to', 'with', 'from',
    'was', 'are', 'were', 'becomes', 'became', 'remains'
  ]);

  // First replace pattern: [ENUM] with check of what comes before it
  let result = text.replace(/(.*?)\s*\[([A-Z_]{3,30})\]/g, (_match, prefix, enumName) => {
    const trimmedPrefix = prefix.trim();
    const lastWordMatch = trimmedPrefix.match(/([a-zA-Z]+)[^a-zA-Z]*$/);
    const lastWord = lastWordMatch ? lastWordMatch[1].toLowerCase() : '';
    const friendly = getFriendlyBottleneck(enumName);
    const friendlyLabel = friendly ? friendly.label : enumName;

    // If prefix is empty or ends with bullet, colon, dash, or a preposition/linking verb
    if (
      !trimmedPrefix ||
      trimmedPrefix.endsWith(':') ||
      trimmedPrefix.endsWith('-') ||
      trimmedPrefix.endsWith('•') ||
      prepositions.has(lastWord)
    ) {
      return `${prefix ? prefix + ' ' : ''}${friendlyLabel}`;
    }

    // Otherwise the preceding token is already the label name (e.g. "Microscope Scanning Time" or "(Data Highway)")
    // So strip the bracketed enum entirely!
    return prefix;
  });

  // Also replace any leftover [ENUM] that didn't match
  result = result.replace(/\[([A-Z_]{3,30})\]/g, (_match, enumName) => {
    const friendly = getFriendlyBottleneck(enumName);
    return friendly ? friendly.label : enumName;
  });

  // Clean duplicate phrases if any exist (e.g. repeated titles with parentheses)
  result = result.replace(/(\b[A-Za-z0-9&/_-]+(?:\s+[A-Za-z0-9&/_-]+)*(?:\s*\([^)]*\))?)\s+\1(?=[^\w]|$)/g, '$1');
  result = result.replace(/[ \t]{2,}/g, ' ');
  result = result.replace(/\s*\(\s*\)/g, '');
  return result.trim();
}

/**
 * Removes duplicate or triplicate parenthesized scenario identifiers or scales.
 * E.g., "In Mouse Circuit Scale (10 mm³ cortical column) (mouse-circuit) (Mouse Circuit (10 mm³)),"
 * becomes "In Mouse Circuit Scale (10 mm³ cortical column),"
 */
export function cleanScenarioProse(text: string): string {
  if (!text) return '';
  return text
    .replace(/(In\s+[^,]+?)\s*\([a-z0-9_-]+\)\s*(?:\((?:[^()]|\([^()]*\))*\)\s*)?,/gi, '$1,')
    .replace(/^([^(\n]+(?:\((?:[^()]|\([^()]*\))*\))?)\s*\([a-z0-9_-]+\)\s*(?:\((?:[^()]|\([^()]*\))*\)\s*)?$/gi, '$1')
    .trim();
}

/**
 * Tailored real-world ELI5 analogies for each dominant bottleneck dimension.
 */
export function generateEli5(
  dominant: string,
  request: NemotronInputSchema,
  highestLev?: string
): Eli5Explanation {
  const norm = dominant.toUpperCase().replace(/\s+/g, '_');
  const leverageTarget = highestLev || request.highest_leverage_variable || 'the highest-leverage parameter';

  switch (norm) {
    case 'STORAGE':
      return {
        headline: 'Your Phone Ran Out of Storage Mid-Video',
        analogy:
          'Imagine trying to record 10 straight years of 8K ultra-high-definition video on your smartphone. Before you can even edit, watch, or share the clip, your phone screams "Storage Full!". That is what is happening here: our microscopes produce such an unfathomable ocean of nanometer-scale images that our storage hard drive arrays fill up completely before we can do anything else with them.',
        simpleSummary: 'The brain image files are too gigantic to fit on available storage hard drives.',
        whyItStalls:
          'Microscopes generate petabytes of raw visual data that overflow storage arrays, stopping all downstream analysis.',
        whatToFixFirst: `Deploy larger petabyte-scale storage arrays and smarter image compression, prioritizing ${leverageTarget}.`
      };

    case 'ACQUISITION':
      return {
        headline: 'Reading an Encyclopedia with a Tiny Magnifying Glass',
        analogy:
          'Imagine trying to read a 10-million-page encyclopedia one single letter at a time through a high-powered magnifying glass. Even with hundreds of helpers, photographing every microscopic nanometer of brain tissue with electron beams takes decades of real-world physical camera time.',
        simpleSummary: 'Physical microscopes take too many years to photograph the brain tissue.',
        whyItStalls:
          'Physical electron beam scanning speeds are limited. Until the tissue is photographed, supercomputers have no data to work with.',
        whatToFixFirst: `Speed up physical scanning by adding multi-beam microscopes or parallelizing instruments, prioritizing ${leverageTarget}.`
      };

    case 'COMPUTE':
      return {
        headline: 'Simulating a Hurricane on a Pocket Calculator',
        analogy:
          'Imagine trying to predict every drop of rain and gust of wind in a Category 5 hurricane using a basic pocket solar calculator. Simulating billions of living neurons firing simultaneously requires trillions of complex mathematical equations every split second, far exceeding our available computer processor chips.',
        simpleSummary: 'Computer processors are too slow to calculate all the neural math in real time.',
        whyItStalls:
          'Billions of dynamic neuron updates and synaptic firings overwhelm the mathematical calculation throughput of available chips.',
        whatToFixFirst: `Add high-performance GPU clusters or specialized neural accelerator processors, prioritizing ${leverageTarget}.`
      };

    case 'MEMORY_BANDWIDTH':
      return {
        headline: 'Rush-Hour Gridlock on a 2-Lane Highway',
        analogy:
          'Imagine having a kitchen full of world-class master chefs ready to cook at lightning speed, but only a single narrow doorway to the pantry. The chefs spend 95% of their day waiting in line for ingredients. Even if our processor chips are super-fast, the memory data cables cannot feed them brain state information fast enough.',
        simpleSummary: 'Data gets stuck in traffic between memory chips and processors.',
        whyItStalls:
          'Processors sit idle waiting for synaptic data to travel across memory buses, creating a massive communication traffic jam.',
        whatToFixFirst: `Upgrade memory bandwidth with High Bandwidth Memory (HBM3e/HBM4) or near-memory computing, prioritizing ${leverageTarget}.`
      };

    case 'POWER':
      return {
        headline: 'Plugging an Industrial Steel Mill into a Bedroom Outlet',
        analogy:
          'Imagine plugging a massive industrial factory into your bedroom wall socket. The circuit breaker trips immediately. Running this many supercomputers simultaneously draws so much electrical power that it would overload standard utility grids and generate enough heat to boil a swimming pool.',
        simpleSummary: 'The simulation requires more electrical power than the facility grid can deliver.',
        whyItStalls:
          'Megawatt power limits and heat dissipation constraints cap the number of processing chips that can run at once.',
        whatToFixFirst: `Improve computational energy efficiency (FLOPs per Watt) or expand facility power infrastructure, prioritizing ${leverageTarget}.`
      };

    case 'INTERCONNECT':
      return {
        headline: 'Sending Snail-Mail Letters Across Town for Every Decision',
        analogy:
          'Imagine an orchestra where every musician is sitting in a different building across town and has to mail a postcard before playing the next note. Supercomputer server nodes spend more time waiting for network cables to synchronize than doing actual simulation math.',
        simpleSummary: 'Network cables between server racks are too slow to keep nodes synchronized.',
        whyItStalls:
          'Densely connected neural circuits require constant cross-node communication, saturating network fabrics and stalling synchronized steps.',
        whatToFixFirst: `Install ultra-fast optical interconnects and low-latency network switches, prioritizing ${leverageTarget}.`
      };

    case 'RECONSTRUCTION':
    case 'AUTOMATED_RECONSTRUCTION':
      return {
        headline: 'Tracing Tangled Spaghetti in the Dark',
        analogy:
          'Imagine taking a photo of a bowl with 100,000 miles of tangled spaghetti noodles and trying to trace every single noodle from start to finish without making a single mistake. AI computer vision models must trace billions of microscopic neural wires across millions of image slices, creating an enormous AI computational backlog.',
        simpleSummary: 'AI vision models take years to stitch 2D microscope photos into 3D neurons.',
        whyItStalls:
          'Automated volumetric segmentation of densely packed axons and dendrites requires immense GPU inference time.',
        whatToFixFirst: `Deploy accelerated segmentation algorithms and dedicated AI inference accelerators, prioritizing ${leverageTarget}.`
      };

    case 'MANUAL_PROOFREADING':
      return {
        headline: 'Proofreading an Entire Library with a Red Pen',
        analogy:
          'Imagine hiring human editors to proofread every book in the Library of Congress letter-by-letter to catch spelling errors. Even the best AI tracing models make mistakes, and human neuroscientists must manually inspect and fix billions of tangled connections.',
        simpleSummary: 'Humans cannot review and correct AI tracing errors fast enough.',
        whyItStalls:
          'Manual proofreading requires millions of expert human hours, creating a massive labor and timeline bottleneck.',
        whatToFixFirst: `Improve AI segmentation accuracy to slash proofreading error rates, prioritizing ${leverageTarget}.`
      };

    case 'ECONOMIC_COST':
    case 'COST':
      return {
        headline: 'Buying a Rocket Fleet on a Lemonade Stand Budget',
        analogy:
          'Imagine planning a human mission to Mars with the money saved in your childhood piggy bank. The cost of purchasing electron microscopes, supercomputer clusters, petabyte storage, and electric power vastly exceeds standard scientific research budgets.',
        simpleSummary: 'The project costs far more money than available research grants.',
        whyItStalls:
          'Total equipment acquisition, electrical power, and human labor costs exceed the available financial ceiling.',
        whatToFixFirst: `Lower component costs through standardized hardware or seek national-scale consortium funding, prioritizing ${leverageTarget}.`
      };

    default: {
      const dominantInfo = getFriendlyBottleneck(dominant);
      return {
        headline: 'System Highway Gridlock',
        analogy: `One single part of the system (${dominantInfo.label}) is moving far slower than the rest, like a 5-lane highway funneling into a single narrow tollbooth. Everything upstream piles up behind it into a complete standstill.`,
        simpleSummary: `The pipeline is stuck waiting on ${dominantInfo.label}.`,
        whyItStalls: `System throughput is capped by operational limits in ${dominantInfo.label}.`,
        whatToFixFirst: `Relieve the active constraint by prioritizing ${leverageTarget}.`
      };
    }
  }
}

/**
 * Generates unique, meaningful explanations for why each secondary parameter doesn't help.
 */
export function getLowImpactExplanation(variableLabel: string, dominantLabel: string): string {
  const norm = variableLabel.toLowerCase();
  if (norm.includes('compute') || norm.includes('flop')) {
    return `Adding extra processing power leaves compute chips starved for data while ${dominantLabel} remains the gating bottleneck.`;
  }
  if (norm.includes('memory bandwidth') || norm.includes('ram')) {
    return `Expanding memory transfer buses cannot accelerate the pipeline while upstream data throughput is throttled by ${dominantLabel}.`;
  }
  if (norm.includes('interconnect') || norm.includes('network')) {
    return `Higher cross-node network bandwidth provides minimal gain because server nodes are already waiting on ${dominantLabel}.`;
  }
  if (norm.includes('storage') || norm.includes('disk')) {
    return `Adding more archive disk capacity provides storage headroom, but does not solve active throughput limits in ${dominantLabel}.`;
  }
  if (norm.includes('power') || norm.includes('watt')) {
    return `Increasing electrical power headroom provides zero speedup since hardware is already throttled by ${dominantLabel} rather than power limits.`;
  }
  if (norm.includes('imaging rate') || norm.includes('machine') || norm.includes('instrument')) {
    return `Accelerating or multiplying imaging instruments cannot speed up completion while downstream processing is stalled by ${dominantLabel}.`;
  }
  if (norm.includes('proofreading') || norm.includes('segmentation')) {
    return `Faster proofreading yields negligible overall speedup because total timeline is dominated by ${dominantLabel}.`;
  }
  if (norm.includes('budget') || norm.includes('cost') || norm.includes('economic')) {
    return `Expanding capital budget cannot overcome the fundamental physical and hardware ceilings imposed by ${dominantLabel}.`;
  }
  return `Yields minimal performance gain because system throughput remains primarily gated by ${dominantLabel}.`;
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

  const rawBytes = Number(request.calculated_metrics.raw_data_bytes ?? request.calculated_metrics.rawDataBytes ?? 0);
  const compressedBytes = Number(request.calculated_metrics.compressed_data_bytes ?? request.calculated_metrics.compressedDataBytes ?? 0);
  const costUsd = Number(request.calculated_metrics.total_estimated_cost_usd ?? request.calculated_metrics.totalEstimatedCostUsd ?? 0);
  const memTbS = Number(request.calculated_metrics.memory_traffic_tb_s ?? request.calculated_metrics.memoryTrafficTbS ?? 0);
  const compFlops = Number(
    request.calculated_metrics.compute_demand_flops ??
    request.calculated_metrics.computeDemandFlops ??
    (Number(request.calculated_metrics.compute_demand_pflops ?? request.calculated_metrics.computeDemandPflops ?? 0) * 1e15)
  );
  const acqYears = Number(request.calculated_metrics.acquisition_time_years ?? request.calculated_metrics.acquisitionTimeYears ?? 0);
  const acqDays = acqYears * 365.25;

  const formattedRaw = formatBytes(rawBytes);
  const formattedCompressed = formatBytes(compressedBytes);
  const formattedCost = formatCurrency(costUsd);
  const formattedBandwidth = formatBandwidth(memTbS);
  const formattedCompute = formatComputeFlops(compFlops);
  const formattedAcquisitionTime = acqYears >= 1.0
    ? `${acqYears.toFixed(2)} years`
    : acqDays >= 1.0
    ? `${acqDays.toFixed(1)} days`
    : `${Math.max(1, Math.round(acqDays * 24))} hours`;

  const capacityStatus = dominantPressure > 100
    ? `exceeds allowable capacity by **${(dominantPressure - 100 < 0.1 ? '<0.1%' : `${(dominantPressure - 100).toFixed(1)}%`)}**`
    : dominantPressure >= 99
    ? `is operating at full capacity (**${dominantPressure.toFixed(1)}%** of allowable ceiling)`
    : `is operating as the primary ceiling at **${dominantPressure.toFixed(1)}%** load`;

  // Clean scenario display name: print cleanly exactly once without duplicate parentheses or repeated IDs/scales
  const cleanScenarioTitle = request.scenario || request.scale || request.scenario_id;

  const summary = `In ${cleanScenarioTitle}, the primary technical blocker is ${dominantInfo.label} (pressure: ${dominantPressure.toFixed(1)}%), followed by ${secondInfo.label} (${secondPressure.toFixed(1)}%). Addressing ${highestLev} gives the greatest speedup.`;

  const whatLimits =
    `The primary barrier holding back this scenario is **${dominantInfo.label}** (\`${dominant}\`) with a constraint score of **${dominantPressure.toFixed(1)}%**.\n\n` +
    `💡 **What this means:** ${dominantInfo.analogy}\n\n` +
    `The next closest obstacle is **${secondInfo.label}** (\`${second}\`) at **${secondPressure.toFixed(1)}%**.`;

  const scenarioIdRef = request.scenario && request.scenario !== request.scenario_id
    ? ` (\`${request.scenario_id}\`)`
    : '';

  const why =
    `Under the current setup for **${cleanScenarioTitle}**${scenarioIdRef}, the system pushes past maximum operational thresholds in **${dominantInfo.label}** (\`${dominant}\`):\n\n` +
    `• 🔬 **Microscope Imaging:** Requires **${formattedAcquisitionTime}** of continuous scanning time for this tissue volume.\n` +
    `• 💾 **Storage Demand:** Generates **${formattedRaw}** of raw image data (**${formattedCompressed}** compressed).\n` +
    `• ⚡ **Real-Time Simulation:** Demands **${formattedBandwidth}** memory transfer speed and **${formattedCompute}** of compute power.\n` +
    `• 💰 **Estimated Budget:** Projected infrastructure cost is **${formattedCost}**.\n\n` +
    `Because ${dominantInfo.label} ${capacityStatus}, the entire pipeline stalls here first before other components can run at full speed.`;

  const whatImprovementMattersMost =
    `The highest-impact breakthrough for this setup is **${highestLev.toUpperCase()}**.\n\n` +
    `🚀 **Why it matters:** Improving this parameter yields the steepest performance gain and directly relieves pressure on the active bottleneck (${dominantInfo.label}).`;

  const lowLeverageList = (request.sensitivity.low_leverage_improvements as string[]) || [];
  const whatDoesNotHelpMuch =
    lowLeverageList.length > 0
      ? `Upgrading the following areas right now will provide **almost no speedup** because the system remains completely blocked by **${dominantInfo.label}**:\n\n` +
        lowLeverageList.map((item) => `• **${item}**: ${getLowImpactExplanation(item, dominantInfo.label)}`).join('\n')
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

  const eli5 = generateEli5(dominant, request, highestLev);

  const structuredOutput: NemotronStructuredOutput = {
    summary,
    dominant_bottleneck_explanation: whatLimits,
    why_it_matters: why,
    highest_leverage_improvement: whatImprovementMattersMost,
    low_leverage_improvements: lowLeverageList.map((item) => `${item}: ${getLowImpactExplanation(item, dominantInfo.label)}`),
    bottleneck_transition: whereDidTheBottleneckMove,
    uncertainties,
    empirical_validation_needed: empiricalValidation,
    bottom_line: bottomLine,
    eli5
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
    eli5,
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
  modelIdentifier: string = 'nvidia/nemotron-3-super-120b-a12b:free',
  request?: NemotronInputSchema
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
    const dominantKey = request?.dominant_bottleneck ||
      (rawContent.includes('STORAGE') ? 'STORAGE' :
       rawContent.includes('ACQUISITION') ? 'ACQUISITION' :
       rawContent.includes('COMPUTE') ? 'COMPUTE' :
       rawContent.includes('POWER') ? 'POWER' :
       rawContent.includes('INTERCONNECT') ? 'INTERCONNECT' :
       rawContent.includes('RECONSTRUCTION') ? 'RECONSTRUCTION' :
       rawContent.includes('PROOFREADING') ? 'MANUAL_PROOFREADING' :
       rawContent.includes('COST') ? 'ECONOMIC_COST' : 'MEMORY_BANDWIDTH');


    const eli5: Eli5Explanation = structured.eli5 || generateEli5(
      dominantKey,
      request || {
        project: 'Z-WBE Bottleneck Lab',
        scenario_id: 'scenario',
        scale: 'scale',
        provenance_notice: '',
        assumptions: {},
        calculated_metrics: {},
        pressure_vector: {},
        dominant_bottleneck: dominantKey,
        secondary_bottleneck: 'COMPUTE',
        sensitivity: {},
        highest_leverage_variable: structured.highest_leverage_improvement || 'Primary Lever',
        limitations: [],
        scientific_status: 'research'
      },
      structured.highest_leverage_improvement
    );

    const rawSummary = structured.summary || structured.dominant_bottleneck_explanation || 'Simulation constrained by critical ceiling.';
    const cleanSummary = cleanScenarioProse(sanitizeUserProse(rawSummary));
    structured.summary = cleanSummary;

    const rawWhatLimits = structured.dominant_bottleneck_explanation || structured.summary || 'See full report.';
    const whatLimits = cleanScenarioProse(sanitizeUserProse(rawWhatLimits));
    const why = cleanScenarioProse(sanitizeUserProse(structured.why_it_matters || 'See full report.'));
    const whatImprovement = sanitizeUserProse(structured.highest_leverage_improvement || 'See sensitivity analysis.');
    const lowLev = Array.isArray(structured.low_leverage_improvements) && structured.low_leverage_improvements.length > 0
      ? structured.low_leverage_improvements.map((item) => `• ${sanitizeUserProse(item)}`).join('\n')
      : 'All tested parameters demonstrate leverage in this scenario.';
    const whereMoved = sanitizeUserProse(structured.bottleneck_transition || 'Bottleneck remains on primary constraint.');
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
      eli5,
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
      structuredOutput: {
        ...structured,
        eli5
      },
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

  const fallbackDominantKey = request?.dominant_bottleneck || 'MEMORY_BANDWIDTH';
  const fallbackEli5: Eli5Explanation = generateEli5(
    fallbackDominantKey,
    request || {
      project: 'Z-WBE Bottleneck Lab',
      scenario_id: 'scenario',
      scale: 'scale',
      provenance_notice: '',
      assumptions: {},
      calculated_metrics: {},
      pressure_vector: {},
      dominant_bottleneck: fallbackDominantKey,
      secondary_bottleneck: 'COMPUTE',
      sensitivity: {},
      highest_leverage_variable: whatImprovementMattersMost || 'Primary Lever',
      limitations: [],
      scientific_status: 'research'
    },
    whatImprovementMattersMost
  );

  return {
    source: 'OPENROUTER_NEMOTRON_3_SUPER',
    modelIdentifier,
    isAIGenerated: true,
    labeledBadge: 'AI INTERPRETATION',
    status: 'ok',
    eli5: fallbackEli5,
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




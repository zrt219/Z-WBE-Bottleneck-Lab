export type ScaleId =
  | 'small-neural-system'
  | 'drosophila'
  | 'mouse-circuit'
  | 'human-scale'
  | 'custom';

export type BottleneckDimension =
  | 'ACQUISITION'
  | 'RECONSTRUCTION'
  | 'STORAGE'
  | 'COMPUTE'
  | 'MEMORY_BANDWIDTH'
  | 'INTERCONNECT'
  | 'POWER'
  | 'ECONOMIC_COST';

export interface AcquisitionAssumptions {
  tissueVolumeMm3: number; // mm³
  voxelResXNm: number; // nm
  voxelResYNm: number; // nm
  voxelResZNm: number; // nm
  bitsPerVoxel: number; // bits (typically 8)
  compressionRatio: number; // e.g. 2.0 (lossless/near-lossless)
  imagingRatePerMachineMm3Year: number; // mm³/year per instrument
  machineCount: number; // number of physical instruments
  utilization: number; // 0.0 to 1.0 (uptime / beam time fraction)
}

export interface ReconstructionAssumptions {
  rawSegmentationAccuracy: number; // 0.0 to 1.0 (e.g. 0.98)
  proofreadingMultiplier: number; // multiplier speedup from AI proofreading tools (e.g. 10x)
  automatedThroughputMm3Year: number; // mm³/year for automated pipeline
  manualProofreadingHoursPerMm3: number; // human proofreader hours per mm³
}

export interface NeuralModelAssumptions {
  neuronCount: number;
  synapseCount: number;
  averageFiringRateHz: number; // Hz (spikes per second per neuron)
  bytesPerNeuron: number; // bytes of dynamic state (e.g. 1024)
  bytesPerSynapse: number; // bytes of dynamic state (e.g. 16)
  computeOpsPerNeuronUpdate: number; // FLOP per compartment/update
  computeOpsPerSynapticEvent: number; // FLOP per post-synaptic integration
  neuronUpdateRateHz: number; // Hz (biophysical simulation step, e.g. 1000 Hz = 1ms dt)
}

export interface HardwareAssumptions {
  computeThroughputPflops: number; // PFLOPS (10^15 FLOP/s) available
  memoryBandwidthTbS: number; // TB/s available memory bandwidth
  interconnectBandwidthTbS: number; // TB/s cross-node interconnect
  storageCapacityPb: number; // PB storage cluster capacity
  powerBudgetMw: number; // MW electrical power budget
}

export interface EconomicAssumptions {
  imagingInstrumentCostPerYear: number; // $ per machine/year (depreciation + maintenance)
  storageCostPerTbYear: number; // $ per TB per year
  computeCostPerPflopYear: number; // $ per PFLOPS per year
  energyCostPerMwh: number; // $ per MWh
  humanProofreadingHourlyRate: number; // $ per person-hour
  targetTimelineYears: number; // baseline target completion timeline (e.g. 1.0 year)
  budgetCeilingUsd: number; // available funding ceiling ($)
}

export interface ScenarioAssumptions {
  id: string;
  name: string;
  scaleId: ScaleId;
  scaleLabel: string;
  isHypotheticalHumanScale: boolean;
  acquisition: AcquisitionAssumptions;
  reconstruction: ReconstructionAssumptions;
  neuralModel: NeuralModelAssumptions;
  hardware: HardwareAssumptions;
  economics: EconomicAssumptions;
}

export interface CalculatedMetrics {
  // Acquisition
  voxelCount: number; // N_voxel
  rawDataBytes: number; // D_raw (bytes)
  compressedDataBytes: number; // D_compressed (bytes)
  effectiveImagingThroughputMm3Year: number; // R_total (mm³/year)
  acquisitionTimeYears: number; // T_scan (years)
  acquisitionTimeDays: number; // T_scan (days)

  // Reconstruction
  automatedReconstructionYears: number;
  manualProofreadingPersonHours: number;
  manualProofreadingPersonYears: number; // at 2000 hours/year

  // Model & Simulation
  modelStateBytes: number; // S_state (bytes)
  modelStateTb: number; // TB
  computeDemandFlops: number; // F_total (FLOP/s)
  computeDemandPflops: number; // PFLOPS
  neuralStateTrafficBytesSec: number;
  synapticStateTrafficBytesSec: number;
  memoryTrafficBytesSec: number; // B_memory (bytes/s)
  memoryTrafficTbS: number; // TB/s
  interconnectTrafficBytesSec: number; // cross-node traffic
  interconnectTrafficTbS: number; // TB/s

  // Hardware & Power
  totalPowerDemandMw: number; // MW

  // Economics
  imagingCostUsd: number;
  storageCostUsdPerYear: number;
  computeCostUsdPerYear: number;
  energyCostUsdPerYear: number;
  proofreadingCostUsd: number;
  totalEstimatedCostUsd: number;
}

export interface PressureBreakdown {
  score: number; // Normalized pressure (0 - 100 scale, >100 indicates overload)
  rawRatio: number; // Demand / Capacity ratio
  demandFormatted: string;
  capacityFormatted: string;
  summary: string;
}

export type PressuresMap = Record<BottleneckDimension, PressureBreakdown>;

export interface BottleneckResult {
  dominantBottleneck: BottleneckDimension;
  secondBottleneck: BottleneckDimension;
  dominantScore: number;
  secondScore: number;
  margin: number;
  pressures: PressuresMap;
  sensitivitySummary: string;
  uncertaintyNotes: string[];
}

export interface SensitivityPerturbation {
  multiplier: 0.5 | 1.0 | 2.0 | 10.0 | 100.0;
  bottleneckScore: number;
  dominantBottleneck: BottleneckDimension;
  totalCostUsd: number;
  acquisitionTimeYears: number;
}

export interface SensitivityVariableResult {
  variableKey: string;
  variableCategory: 'acquisition' | 'reconstruction' | 'neuralModel' | 'hardware' | 'economics';
  variableLabel: string;
  unit: string;
  baselineValue: number;
  perturbations: Record<'0.5x' | '1x' | '2x' | '10x' | '100x', SensitivityPerturbation>;
  leverageScore: number; // % reduction in max pressure when improved 2x / 10x / 100x
  isHighestLeverage: boolean;
}

export interface BottleneckTransition {
  variableKey: string;
  variableLabel: string;
  fromBottleneck: BottleneckDimension;
  toBottleneck: BottleneckDimension;
  triggerMultiplier: string;
  description: string;
}

export interface SensitivityAnalysisResult {
  variables: SensitivityVariableResult[];
  highestLeverageAssumption: SensitivityVariableResult;
  bottleneckTransitions: BottleneckTransition[];
  lowLeverageImprovements: SensitivityVariableResult[];
  takeaway: string;
}

export interface ScenarioCalculationOutput {
  assumptions: ScenarioAssumptions;
  metrics: CalculatedMetrics;
  bottleneck: BottleneckResult;
  sensitivity: SensitivityAnalysisResult;
  calculatedAt: string;
}

export interface NemotronInputSchema {
  project: string;
  scenario_id: string;
  scenario?: string;
  scale: string;
  provenance_notice: string;
  provenance?: {
    deterministicCalculationsOnly: boolean;
    notice?: string;
  };
  assumptions: Record<string, unknown>;
  calculated_metrics: Record<string, unknown>;
  pressure_vector: Record<string, number>;
  dominant_bottleneck: string;
  secondary_bottleneck: string;
  bottleneck?: BottleneckResult;
  sensitivity: Record<string, unknown>;
  highest_leverage_variable: string;
  limitations: string[];
  scientific_status: string;
}

export type GroundingContractRequest = NemotronInputSchema;

export interface Eli5Explanation {
  headline: string;
  analogy: string;
  simpleSummary: string;
  whyItStalls: string;
  whatToFixFirst: string;
}

export interface NemotronStructuredOutput {
  summary: string;
  dominant_bottleneck_explanation: string;
  why_it_matters: string;
  highest_leverage_improvement: string;
  low_leverage_improvements: string[];
  bottleneck_transition: string;
  uncertainties: string[];
  empirical_validation_needed: string[];
  bottom_line: string;
  eli5?: Eli5Explanation;
}

export interface GroundingContractResponse {
  source: 'OPENROUTER_NEMOTRON_3_SUPER' | 'DETERMINISTIC_GROUNDED_FALLBACK';
  modelIdentifier: string;
  isAIGenerated: true;
  labeledBadge: 'AI INTERPRETATION';
  status: 'ok' | 'unavailable' | 'rate_limited' | 'temporarily_unavailable';
  errorMessage?: string;
  fromCache?: boolean;
  eli5?: Eli5Explanation;
  sections: {
    whatLimitsThisScenario: string;
    why: string;
    whatImprovementMattersMost: string;
    whatDoesNotHelpMuch?: string;
    whereDidTheBottleneckMove: string;
    whatRemainsUncertain: string;
    whatNeedsRealExperimentalEvidence: string;
    uncertainties?: string;
    whatWouldNeedEmpiricalValidation?: string;
  };
  structuredOutput?: NemotronStructuredOutput;
  markdown: string;
}

export interface GpuSweepSummaryData {
  generatedAt: string;
  sweepCombinationsCount: number;
  benchmark: {
    runtimeCpuSeconds: number | null;
    runtimeGpuSeconds: number | null;
    speedup: number | null;
    status: 'GPU_ACCELERATED' | 'GPU_BENCHMARK_NOT_EXECUTED';
    deviceInfo: string;
    backendUsed: string;
  };
  bottleneckFrequencies: Record<BottleneckDimension, number>;
  correlations: Array<{
    parameter: string;
    dominantBottleneckAssociation: BottleneckDimension;
    correlationCoefficient: number;
  }>;
  transitionRegions: Array<{
    parameter: string;
    fromBottleneck: BottleneckDimension;
    toBottleneck: BottleneckDimension;
    thresholdValue: string;
    description: string;
  }>;
}

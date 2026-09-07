export type ScaleId = 'small-neural-system' | 'drosophila' | 'mouse-circuit' | 'human-scale' | 'custom';
export type BottleneckDimension = 'ACQUISITION' | 'RECONSTRUCTION' | 'STORAGE' | 'COMPUTE' | 'MEMORY_BANDWIDTH' | 'INTERCONNECT' | 'POWER' | 'ECONOMIC_COST';
export interface AcquisitionAssumptions {
    tissueVolumeMm3: number;
    voxelResXNm: number;
    voxelResYNm: number;
    voxelResZNm: number;
    bitsPerVoxel: number;
    compressionRatio: number;
    imagingRatePerMachineMm3Year: number;
    machineCount: number;
    utilization: number;
}
export interface ReconstructionAssumptions {
    rawSegmentationAccuracy: number;
    proofreadingMultiplier: number;
    automatedThroughputMm3Year: number;
    manualProofreadingHoursPerMm3: number;
}
export interface NeuralModelAssumptions {
    neuronCount: number;
    synapseCount: number;
    averageFiringRateHz: number;
    bytesPerNeuron: number;
    bytesPerSynapse: number;
    computeOpsPerNeuronUpdate: number;
    computeOpsPerSynapticEvent: number;
    neuronUpdateRateHz: number;
}
export interface HardwareAssumptions {
    computeThroughputPflops: number;
    memoryBandwidthTbS: number;
    interconnectBandwidthTbS: number;
    storageCapacityPb: number;
    powerBudgetMw: number;
}
export interface EconomicAssumptions {
    imagingInstrumentCostPerYear: number;
    storageCostPerTbYear: number;
    computeCostPerPflopYear: number;
    energyCostPerMwh: number;
    humanProofreadingHourlyRate: number;
    targetTimelineYears: number;
    budgetCeilingUsd: number;
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
    voxelCount: number;
    rawDataBytes: number;
    compressedDataBytes: number;
    effectiveImagingThroughputMm3Year: number;
    acquisitionTimeYears: number;
    acquisitionTimeDays: number;
    automatedReconstructionYears: number;
    manualProofreadingPersonHours: number;
    manualProofreadingPersonYears: number;
    modelStateBytes: number;
    modelStateTb: number;
    computeDemandFlops: number;
    computeDemandPflops: number;
    neuralStateTrafficBytesSec: number;
    synapticStateTrafficBytesSec: number;
    memoryTrafficBytesSec: number;
    memoryTrafficTbS: number;
    interconnectTrafficBytesSec: number;
    interconnectTrafficTbS: number;
    totalPowerDemandMw: number;
    imagingCostUsd: number;
    storageCostUsdPerYear: number;
    computeCostUsdPerYear: number;
    energyCostUsdPerYear: number;
    proofreadingCostUsd: number;
    totalEstimatedCostUsd: number;
}
export interface PressureBreakdown {
    score: number;
    rawRatio: number;
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
    leverageScore: number;
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
//# sourceMappingURL=types.d.ts.map
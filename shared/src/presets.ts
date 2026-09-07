import { ScenarioAssumptions } from './types';

export const PRESET_SMALL_NEURAL_SYSTEM: ScenarioAssumptions = {
  id: 'small-neural-system',
  name: 'Small Neural System (C. elegans model)',
  scaleId: 'small-neural-system',
  scaleLabel: 'Small Neural System (C. elegans)',
  isHypotheticalHumanScale: false,
  acquisition: {
    tissueVolumeMm3: 0.0005, // ~0.5 nanoliters
    voxelResXNm: 4,
    voxelResYNm: 4,
    voxelResZNm: 30,
    bitsPerVoxel: 8,
    compressionRatio: 2.5,
    imagingRatePerMachineMm3Year: 0.05,
    machineCount: 1,
    utilization: 0.85
  },
  reconstruction: {
    rawSegmentationAccuracy: 0.995,
    proofreadingMultiplier: 5.0,
    automatedThroughputMm3Year: 0.1,
    manualProofreadingHoursPerMm3: 2000
  },
  neuralModel: {
    neuronCount: 302,
    synapseCount: 7500,
    averageFiringRateHz: 2.0,
    bytesPerNeuron: 512,
    bytesPerSynapse: 8,
    computeOpsPerNeuronUpdate: 150,
    computeOpsPerSynapticEvent: 40,
    neuronUpdateRateHz: 1000
  },
  hardware: {
    computeThroughputPflops: 0.001, // 1 TFLOPS
    memoryBandwidthTbS: 0.1, // 100 GB/s
    interconnectBandwidthTbS: 0.05,
    storageCapacityPb: 0.01, // 10 TB
    powerBudgetMw: 0.002 // 2 kW
  },
  economics: {
    imagingInstrumentCostPerYear: 150000,
    storageCostPerTbYear: 18,
    computeCostPerPflopYear: 100000,
    energyCostPerMwh: 120,
    humanProofreadingHourlyRate: 35,
    targetTimelineYears: 0.5,
    budgetCeilingUsd: 250000
  }
};

export const PRESET_DROSOPHILA: ScenarioAssumptions = {
  id: 'drosophila',
  name: 'Drosophila Whole Brain Scale',
  scaleId: 'drosophila',
  scaleLabel: 'Drosophila (Fruit Fly)',
  isHypotheticalHumanScale: false,
  acquisition: {
    tissueVolumeMm3: 0.15, // ~150 nanoliters
    voxelResXNm: 8,
    voxelResYNm: 8,
    voxelResZNm: 8,
    bitsPerVoxel: 8,
    compressionRatio: 2.8,
    imagingRatePerMachineMm3Year: 0.2,
    machineCount: 2,
    utilization: 0.85
  },
  reconstruction: {
    rawSegmentationAccuracy: 0.985,
    proofreadingMultiplier: 10.0,
    automatedThroughputMm3Year: 1.0,
    manualProofreadingHoursPerMm3: 8000
  },
  neuralModel: {
    neuronCount: 140000,
    synapseCount: 50000000,
    averageFiringRateHz: 5.0,
    bytesPerNeuron: 1024,
    bytesPerSynapse: 16,
    computeOpsPerNeuronUpdate: 250,
    computeOpsPerSynapticEvent: 50,
    neuronUpdateRateHz: 1000
  },
  hardware: {
    computeThroughputPflops: 0.05, // 50 TFLOPS
    memoryBandwidthTbS: 1.5,
    interconnectBandwidthTbS: 0.5,
    storageCapacityPb: 0.5, // 500 TB
    powerBudgetMw: 0.02 // 20 kW
  },
  economics: {
    imagingInstrumentCostPerYear: 350000,
    storageCostPerTbYear: 18,
    computeCostPerPflopYear: 100000,
    energyCostPerMwh: 120,
    humanProofreadingHourlyRate: 40,
    targetTimelineYears: 1.0,
    budgetCeilingUsd: 1500000
  }
};

export const PRESET_MOUSE_CIRCUIT: ScenarioAssumptions = {
  id: 'mouse-circuit',
  name: 'Mouse Circuit Scale (10 mm³ cortical column)',
  scaleId: 'mouse-circuit',
  scaleLabel: 'Mouse Circuit (10 mm³)',
  isHypotheticalHumanScale: false,
  acquisition: {
    tissueVolumeMm3: 10.0,
    voxelResXNm: 4,
    voxelResYNm: 4,
    voxelResZNm: 30,
    bitsPerVoxel: 8,
    compressionRatio: 3.0,
    imagingRatePerMachineMm3Year: 0.5,
    machineCount: 8,
    utilization: 0.9
  },
  reconstruction: {
    rawSegmentationAccuracy: 0.98,
    proofreadingMultiplier: 15.0,
    automatedThroughputMm3Year: 15.0,
    manualProofreadingHoursPerMm3: 12000
  },
  neuralModel: {
    neuronCount: 10000000, // 10M neurons
    synapseCount: 10000000000, // 10B synapses
    averageFiringRateHz: 4.0,
    bytesPerNeuron: 2048,
    bytesPerSynapse: 16,
    computeOpsPerNeuronUpdate: 400,
    computeOpsPerSynapticEvent: 60,
    neuronUpdateRateHz: 1000
  },
  hardware: {
    computeThroughputPflops: 2.5, // 2.5 PFLOPS
    memoryBandwidthTbS: 25.0,
    interconnectBandwidthTbS: 10.0,
    storageCapacityPb: 25.0, // 25 PB
    powerBudgetMw: 0.25 // 250 kW
  },
  economics: {
    imagingInstrumentCostPerYear: 500000,
    storageCostPerTbYear: 15,
    computeCostPerPflopYear: 80000,
    energyCostPerMwh: 110,
    humanProofreadingHourlyRate: 45,
    targetTimelineYears: 2.0,
    budgetCeilingUsd: 12000000
  }
};

export const PRESET_HUMAN_SCALE: ScenarioAssumptions = {
  id: 'human-scale',
  name: 'Human-Scale Theoretical Connectome',
  scaleId: 'human-scale',
  scaleLabel: 'ESTIMATE / HYPOTHETICAL SCALE',
  isHypotheticalHumanScale: true,
  acquisition: {
    tissueVolumeMm3: 1200000.0, // ~1,200 cm³
    voxelResXNm: 4,
    voxelResYNm: 4,
    voxelResZNm: 30,
    bitsPerVoxel: 8,
    compressionRatio: 3.5,
    imagingRatePerMachineMm3Year: 1.0,
    machineCount: 100,
    utilization: 0.9
  },
  reconstruction: {
    rawSegmentationAccuracy: 0.992,
    proofreadingMultiplier: 100.0,
    automatedThroughputMm3Year: 50000.0,
    manualProofreadingHoursPerMm3: 2000
  },
  neuralModel: {
    neuronCount: 86000000000, // 86 Billion
    synapseCount: 150000000000000, // 150 Trillion
    averageFiringRateHz: 3.5,
    bytesPerNeuron: 2048,
    bytesPerSynapse: 16,
    computeOpsPerNeuronUpdate: 500,
    computeOpsPerSynapticEvent: 75,
    neuronUpdateRateHz: 1000
  },
  hardware: {
    computeThroughputPflops: 500.0, // 500 PFLOPS
    memoryBandwidthTbS: 12000.0, // 12,000 TB/s
    interconnectBandwidthTbS: 4000.0,
    storageCapacityPb: 25000.0, // 25,000 PB = 25 Exabytes
    powerBudgetMw: 50.0 // 50 MW
  },
  economics: {
    imagingInstrumentCostPerYear: 750000,
    storageCostPerTbYear: 12,
    computeCostPerPflopYear: 60000,
    energyCostPerMwh: 100,
    humanProofreadingHourlyRate: 50,
    targetTimelineYears: 5.0,
    budgetCeilingUsd: 500000000 // $500M
  }
};

export const PRESET_CUSTOM: ScenarioAssumptions = {
  id: 'custom',
  name: 'Custom Parameter Scenario',
  scaleId: 'custom',
  scaleLabel: 'Custom Configuration',
  isHypotheticalHumanScale: false,
  acquisition: {
    tissueVolumeMm3: 1.0,
    voxelResXNm: 4,
    voxelResYNm: 4,
    voxelResZNm: 30,
    bitsPerVoxel: 8,
    compressionRatio: 3.0,
    imagingRatePerMachineMm3Year: 1.0,
    machineCount: 4,
    utilization: 0.85
  },
  reconstruction: {
    rawSegmentationAccuracy: 0.985,
    proofreadingMultiplier: 10.0,
    automatedThroughputMm3Year: 5.0,
    manualProofreadingHoursPerMm3: 5000
  },
  neuralModel: {
    neuronCount: 1000000,
    synapseCount: 1000000000,
    averageFiringRateHz: 4.0,
    bytesPerNeuron: 1024,
    bytesPerSynapse: 16,
    computeOpsPerNeuronUpdate: 300,
    computeOpsPerSynapticEvent: 50,
    neuronUpdateRateHz: 1000
  },
  hardware: {
    computeThroughputPflops: 1.0,
    memoryBandwidthTbS: 10.0,
    interconnectBandwidthTbS: 2.0,
    storageCapacityPb: 5.0,
    powerBudgetMw: 0.1
  },
  economics: {
    imagingInstrumentCostPerYear: 350000,
    storageCostPerTbYear: 15,
    computeCostPerPflopYear: 80000,
    energyCostPerMwh: 120,
    humanProofreadingHourlyRate: 40,
    targetTimelineYears: 1.0,
    budgetCeilingUsd: 5000000
  }
};

// ---------------------------------------------------------------------------------
// DEMO PRESETS (3 Strong Stories - Clearly marked: SCENARIO — NOT EMPIRICAL RESULT)
// ---------------------------------------------------------------------------------

/**
 * PRESET 1 — Imaging Wall
 * Acquisition throughput is the dominant bottleneck.
 * Scanning takes decades with only 2 instruments at 0.1 mm³/year for a 5 mm³ tissue block.
 */
export const DEMO_PRESET_IMAGING_WALL: ScenarioAssumptions = {
  id: 'demo-imaging-wall',
  name: 'Demo Preset 1: The Imaging Wall',
  scaleId: 'mouse-circuit',
  scaleLabel: 'SCENARIO — NOT EMPIRICAL RESULT (Imaging Wall)',
  isHypotheticalHumanScale: false,
  acquisition: {
    tissueVolumeMm3: 5.0,
    voxelResXNm: 4,
    voxelResYNm: 4,
    voxelResZNm: 30,
    bitsPerVoxel: 8,
    compressionRatio: 2.5,
    imagingRatePerMachineMm3Year: 0.1, // very slow imaging
    machineCount: 2, // only 2 beam lines
    utilization: 0.8
  },
  reconstruction: {
    rawSegmentationAccuracy: 0.99,
    proofreadingMultiplier: 25.0,
    automatedThroughputMm3Year: 10.0,
    manualProofreadingHoursPerMm3: 2000
  },
  neuralModel: {
    neuronCount: 5000000,
    synapseCount: 4000000000,
    averageFiringRateHz: 4.0,
    bytesPerNeuron: 1024,
    bytesPerSynapse: 16,
    computeOpsPerNeuronUpdate: 300,
    computeOpsPerSynapticEvent: 50,
    neuronUpdateRateHz: 1000
  },
  hardware: {
    computeThroughputPflops: 5.0, // plenty of compute
    memoryBandwidthTbS: 20.0, // plenty of bandwidth
    interconnectBandwidthTbS: 10.0,
    storageCapacityPb: 15.0,
    powerBudgetMw: 0.5
  },
  economics: {
    imagingInstrumentCostPerYear: 400000,
    storageCostPerTbYear: 15,
    computeCostPerPflopYear: 80000,
    energyCostPerMwh: 110,
    humanProofreadingHourlyRate: 40,
    targetTimelineYears: 1.0,
    budgetCeilingUsd: 10000000
  }
};

/**
 * PRESET 2 — Memory Wall
 * Imaging technology improves dramatically (100x imaging speed, many machines),
 * but real-time simulation causes memory bandwidth to explode into the dominant bottleneck.
 */
export const DEMO_PRESET_MEMORY_WALL: ScenarioAssumptions = {
  id: 'demo-memory-wall',
  name: 'Demo Preset 2: The Memory Wall',
  scaleId: 'mouse-circuit',
  scaleLabel: 'SCENARIO — NOT EMPIRICAL RESULT (Memory Wall)',
  isHypotheticalHumanScale: false,
  acquisition: {
    tissueVolumeMm3: 5.0,
    voxelResXNm: 4,
    voxelResYNm: 4,
    voxelResZNm: 30,
    bitsPerVoxel: 8,
    compressionRatio: 2.5,
    imagingRatePerMachineMm3Year: 10.0, // 100x faster imaging!
    machineCount: 8,
    utilization: 0.9
  },
  reconstruction: {
    rawSegmentationAccuracy: 0.99,
    proofreadingMultiplier: 50.0,
    automatedThroughputMm3Year: 25.0,
    manualProofreadingHoursPerMm3: 1000
  },
  neuralModel: {
    neuronCount: 5000000,
    synapseCount: 4000000000,
    averageFiringRateHz: 15.0, // high-frequency synaptic event bursts
    bytesPerNeuron: 4096, // rich multi-compartment state
    bytesPerSynapse: 32, // detailed receptor & STDP state
    computeOpsPerNeuronUpdate: 400,
    computeOpsPerSynapticEvent: 50,
    neuronUpdateRateHz: 2000 // 0.5ms step
  },
  hardware: {
    computeThroughputPflops: 50.0, // high compute capacity
    memoryBandwidthTbS: 2.0, // constrained memory bus! (Bottleneck)
    interconnectBandwidthTbS: 15.0,
    storageCapacityPb: 20.0,
    powerBudgetMw: 1.0
  },
  economics: {
    imagingInstrumentCostPerYear: 400000,
    storageCostPerTbYear: 15,
    computeCostPerPflopYear: 80000,
    energyCostPerMwh: 110,
    humanProofreadingHourlyRate: 40,
    targetTimelineYears: 1.0,
    budgetCeilingUsd: 15000000
  }
};

/**
 * PRESET 3 — Economic Wall
 * Technical specs (compute, imaging, memory) are feasible on supercomputers,
 * but costs (storage, human proofreading, high-end instrument operation) blow past budget.
 */
export const DEMO_PRESET_ECONOMIC_WALL: ScenarioAssumptions = {
  id: 'demo-economic-wall',
  name: 'Demo Preset 3: The Economic Wall',
  scaleId: 'mouse-circuit',
  scaleLabel: 'SCENARIO — NOT EMPIRICAL RESULT (Economic Wall)',
  isHypotheticalHumanScale: false,
  acquisition: {
    tissueVolumeMm3: 20.0,
    voxelResXNm: 4,
    voxelResYNm: 4,
    voxelResZNm: 20,
    bitsPerVoxel: 8,
    compressionRatio: 2.0,
    imagingRatePerMachineMm3Year: 5.0,
    machineCount: 12,
    utilization: 0.95
  },
  reconstruction: {
    rawSegmentationAccuracy: 0.92, // Lower accuracy = huge manual proofreading burden!
    proofreadingMultiplier: 2.0, // Slow proofreading
    automatedThroughputMm3Year: 20.0,
    manualProofreadingHoursPerMm3: 25000
  },
  neuralModel: {
    neuronCount: 20000000,
    synapseCount: 20000000000,
    averageFiringRateHz: 5.0,
    bytesPerNeuron: 2048,
    bytesPerSynapse: 16,
    computeOpsPerNeuronUpdate: 300,
    computeOpsPerSynapticEvent: 50,
    neuronUpdateRateHz: 1000
  },
  hardware: {
    computeThroughputPflops: 50.0,
    memoryBandwidthTbS: 80.0,
    interconnectBandwidthTbS: 30.0,
    storageCapacityPb: 100.0,
    powerBudgetMw: 5.0
  },
  economics: {
    imagingInstrumentCostPerYear: 600000,
    storageCostPerTbYear: 20,
    computeCostPerPflopYear: 100000,
    energyCostPerMwh: 150,
    humanProofreadingHourlyRate: 65,
    targetTimelineYears: 1.0,
    budgetCeilingUsd: 5000000 // Tight budget of $5M vs $30M+ cost!
  }
};

export const ALL_PRESETS: ScenarioAssumptions[] = [
  PRESET_SMALL_NEURAL_SYSTEM,
  PRESET_DROSOPHILA,
  PRESET_MOUSE_CIRCUIT,
  PRESET_HUMAN_SCALE,
  PRESET_CUSTOM,
  DEMO_PRESET_IMAGING_WALL,
  DEMO_PRESET_MEMORY_WALL,
  DEMO_PRESET_ECONOMIC_WALL
];

export function getPresetById(id: string): ScenarioAssumptions {
  const found = ALL_PRESETS.find((p) => p.id === id);
  if (found) {
    return JSON.parse(JSON.stringify(found));
  }
  return JSON.parse(JSON.stringify(PRESET_SMALL_NEURAL_SYSTEM));
}

/**
 * Hero Demo Transformer:
 * "What happens if imaging becomes 100x faster?"
 * Takes any scenario and multiplies imaging rate per machine by 100x.
 */
export function applyImaging100xDemo(scenario: ScenarioAssumptions): ScenarioAssumptions {
  return {
    ...scenario,
    name: `${scenario.name} (100x Imaging Accelerated)`,
    acquisition: {
      ...scenario.acquisition,
      imagingRatePerMachineMm3Year: scenario.acquisition.imagingRatePerMachineMm3Year * 100
    }
  };
}

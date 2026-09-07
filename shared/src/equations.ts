import { CalculatedMetrics, ScenarioAssumptions } from './types';

/**
 * Deterministic equations for Whole Brain Emulation scaling parameters.
 *
 * All equations here are transparent, mathematical scaling models.
 * They are designed as a technology-scaling laboratory to examine constraint bottlenecks,
 * not as an experimentally validated human WBE model.
 */

// 1 mm³ = 10^18 nm³
const NM3_PER_MM3 = 1e18;
const BYTES_PER_TB = 1e12;

/**
 * Calculate voxel count:
 * N_voxel = V / (dx * dy * dz)
 */
export function calculateVoxelCount(
  tissueVolumeMm3: number,
  voxelResXNm: number,
  voxelResYNm: number,
  voxelResZNm: number
): number {
  if (tissueVolumeMm3 <= 0 || voxelResXNm <= 0 || voxelResYNm <= 0 || voxelResZNm <= 0) {
    return 0;
  }
  const voxelVolumeMm3 = (voxelResXNm * voxelResYNm * voxelResZNm) / NM3_PER_MM3;
  return tissueVolumeMm3 / voxelVolumeMm3;
}

/**
 * Calculate raw image data in bytes:
 * D_raw = N_voxel * bits_per_voxel / 8
 */
export function calculateRawDataBytes(voxelCount: number, bitsPerVoxel: number): number {
  if (voxelCount <= 0 || bitsPerVoxel <= 0) {
    return 0;
  }
  return (voxelCount * bitsPerVoxel) / 8;
}

/**
 * Calculate effective volumetric imaging rate:
 * R_total = R_machine * machine_count * utilization
 */
export function calculateEffectiveImagingThroughput(
  ratePerMachineMm3Year: number,
  machineCount: number,
  utilization: number
): number {
  if (ratePerMachineMm3Year <= 0 || machineCount <= 0 || utilization <= 0) {
    return 0;
  }
  return ratePerMachineMm3Year * machineCount * Math.min(1.0, Math.max(0, utilization));
}

/**
 * Calculate acquisition time:
 * T_scan = V / R_total (in years)
 */
export function calculateAcquisitionTimeYears(
  tissueVolumeMm3: number,
  effectiveThroughputMm3Year: number
): number {
  if (tissueVolumeMm3 <= 0 || effectiveThroughputMm3Year <= 0) {
    return Infinity;
  }
  return tissueVolumeMm3 / effectiveThroughputMm3Year;
}

/**
 * Calculate model state storage:
 * S_state = neurons * bytes_per_neuron + synapses * bytes_per_synapse
 */
export function calculateModelStateBytes(
  neuronCount: number,
  bytesPerNeuron: number,
  synapseCount: number,
  bytesPerSynapse: number
): number {
  const neuronBytes = Math.max(0, neuronCount) * Math.max(0, bytesPerNeuron);
  const synapseBytes = Math.max(0, synapseCount) * Math.max(0, bytesPerSynapse);
  return neuronBytes + synapseBytes;
}

/**
 * Calculate approximate compute demand:
 * F_total = neuron_count * neuron_update_rate * operations_per_neuron_update
 *         + synaptic_event_rate * operations_per_synaptic_event
 * (where synaptic_event_rate = synapse_count * average_firing_rate)
 */
export function calculateComputeDemandFlops(
  neuronCount: number,
  neuronUpdateRateHz: number,
  opsPerNeuronUpdate: number,
  synapseCount: number,
  averageFiringRateHz: number,
  opsPerSynapticEvent: number
): number {
  const neuralFlops =
    Math.max(0, neuronCount) *
    Math.max(0, neuronUpdateRateHz) *
    Math.max(0, opsPerNeuronUpdate);

  const synapticEventRate = Math.max(0, synapseCount) * Math.max(0, averageFiringRateHz);
  const synapticFlops = synapticEventRate * Math.max(0, opsPerSynapticEvent);

  return neuralFlops + synapticFlops;
}

/**
 * Calculate approximate memory traffic:
 * B_memory = neural_state_traffic + synaptic_state_traffic
 */
export function calculateMemoryTrafficBytesSec(
  neuronCount: number,
  neuronUpdateRateHz: number,
  bytesPerNeuron: number,
  synapseCount: number,
  averageFiringRateHz: number,
  bytesPerSynapse: number
): {
  neuralTrafficBytesSec: number;
  synapticTrafficBytesSec: number;
  totalMemoryTrafficBytesSec: number;
} {
  const neuralTrafficBytesSec =
    Math.max(0, neuronCount) *
    Math.max(0, neuronUpdateRateHz) *
    Math.max(0, bytesPerNeuron);

  const synapticTrafficBytesSec =
    Math.max(0, synapseCount) *
    Math.max(0, averageFiringRateHz) *
    Math.max(0, bytesPerSynapse);

  return {
    neuralTrafficBytesSec,
    synapticTrafficBytesSec,
    totalMemoryTrafficBytesSec: neuralTrafficBytesSec + synapticTrafficBytesSec
  };
}

/**
 * Calculate approximate cross-partition interconnect traffic:
 * Cross-node spike synchronization based on cluster partitioning fraction (~25% cross-boundary)
 */
export function calculateInterconnectTrafficBytesSec(
  synapseCount: number,
  averageFiringRateHz: number,
  crossNodeFraction: number = 0.25,
  spikePacketBytes: number = 8
): number {
  const totalSpikesPerSec = Math.max(0, synapseCount) * Math.max(0, averageFiringRateHz);
  return totalSpikesPerSec * crossNodeFraction * spikePacketBytes;
}

/**
 * Calculate all deterministic metrics for a scenario.
 */
export function calculateAllMetrics(assumptions: ScenarioAssumptions): CalculatedMetrics {
  const { acquisition, reconstruction, neuralModel, economics } = assumptions;

  // 1. Acquisition
  const voxelCount = calculateVoxelCount(
    acquisition.tissueVolumeMm3,
    acquisition.voxelResXNm,
    acquisition.voxelResYNm,
    acquisition.voxelResZNm
  );

  const rawDataBytes = calculateRawDataBytes(voxelCount, acquisition.bitsPerVoxel);
  const compressionRatio = Math.max(1.0, acquisition.compressionRatio);
  const compressedDataBytes = rawDataBytes / compressionRatio;

  const effectiveImagingThroughputMm3Year = calculateEffectiveImagingThroughput(
    acquisition.imagingRatePerMachineMm3Year,
    acquisition.machineCount,
    acquisition.utilization
  );

  const acquisitionTimeYears = calculateAcquisitionTimeYears(
    acquisition.tissueVolumeMm3,
    effectiveImagingThroughputMm3Year
  );
  const acquisitionTimeDays = isFinite(acquisitionTimeYears)
    ? acquisitionTimeYears * 365.25
    : Infinity;

  // 2. Reconstruction
  const automatedReconstructionYears =
    reconstruction.automatedThroughputMm3Year > 0
      ? acquisition.tissueVolumeMm3 / reconstruction.automatedThroughputMm3Year
      : Infinity;

  // Proofreading hours scale with volume, error rate, and speedup multiplier
  const baseProofreadingHours =
    acquisition.tissueVolumeMm3 * reconstruction.manualProofreadingHoursPerMm3;
  const errorRate = Math.max(0.0001, 1 - Math.min(0.9999, reconstruction.rawSegmentationAccuracy));
  const proofreadingMultiplier = Math.max(0.1, reconstruction.proofreadingMultiplier);
  // Normalized to 98% accuracy baseline (0.02 error)
  const manualProofreadingPersonHours =
    (baseProofreadingHours * (errorRate / 0.02)) / proofreadingMultiplier;
  const manualProofreadingPersonYears = manualProofreadingPersonHours / 2000; // 2000 hrs/work-year

  // 3. Model state & Compute
  const modelStateBytes = calculateModelStateBytes(
    neuralModel.neuronCount,
    neuralModel.bytesPerNeuron,
    neuralModel.synapseCount,
    neuralModel.bytesPerSynapse
  );
  const modelStateTb = modelStateBytes / BYTES_PER_TB;

  const computeDemandFlops = calculateComputeDemandFlops(
    neuralModel.neuronCount,
    neuralModel.neuronUpdateRateHz,
    neuralModel.computeOpsPerNeuronUpdate,
    neuralModel.synapseCount,
    neuralModel.averageFiringRateHz,
    neuralModel.computeOpsPerSynapticEvent
  );
  const computeDemandPflops = computeDemandFlops / 1e15;

  const { neuralTrafficBytesSec, synapticTrafficBytesSec, totalMemoryTrafficBytesSec } =
    calculateMemoryTrafficBytesSec(
      neuralModel.neuronCount,
      neuralModel.neuronUpdateRateHz,
      neuralModel.bytesPerNeuron,
      neuralModel.synapseCount,
      neuralModel.averageFiringRateHz,
      neuralModel.bytesPerSynapse
    );
  const memoryTrafficTbS = totalMemoryTrafficBytesSec / BYTES_PER_TB;

  const interconnectTrafficBytesSec = calculateInterconnectTrafficBytesSec(
    neuralModel.synapseCount,
    neuralModel.averageFiringRateHz
  );
  const interconnectTrafficTbS = interconnectTrafficBytesSec / BYTES_PER_TB;

  // 4. Power Demand
  // ~20 kW per PFLOPS (0.020 MW/PFLOPS modern accelerated compute)
  // ~0.005 MW per TB/s memory traffic & interconnect
  // PUE factor 1.2
  const computePowerMw = computeDemandPflops * 0.020;
  const memoryNetworkPowerMw = (memoryTrafficTbS + interconnectTrafficTbS) * 0.005;
  const totalPowerDemandMw = (computePowerMw + memoryNetworkPowerMw) * 1.2;

  // 5. Economics
  const activeImagingYears = Math.max(0.01, Math.min(acquisitionTimeYears, economics.targetTimelineYears));
  const imagingCostUsd =
    acquisition.machineCount * economics.imagingInstrumentCostPerYear * activeImagingYears;

  const totalStorageTb = (compressedDataBytes + modelStateBytes) / BYTES_PER_TB;
  const storageCostUsdPerYear = totalStorageTb * economics.storageCostPerTbYear;

  const computeCostUsdPerYear = computeDemandPflops * economics.computeCostPerPflopYear;

  const energyCostUsdPerYear =
    totalPowerDemandMw * 8760 * economics.energyCostPerMwh;

  const proofreadingCostUsd =
    manualProofreadingPersonHours * economics.humanProofreadingHourlyRate;

  const totalEstimatedCostUsd =
    imagingCostUsd +
    storageCostUsdPerYear * economics.targetTimelineYears +
    computeCostUsdPerYear * economics.targetTimelineYears +
    energyCostUsdPerYear * economics.targetTimelineYears +
    proofreadingCostUsd;

  return {
    voxelCount,
    rawDataBytes,
    compressedDataBytes,
    effectiveImagingThroughputMm3Year,
    acquisitionTimeYears,
    acquisitionTimeDays,
    automatedReconstructionYears,
    manualProofreadingPersonHours,
    manualProofreadingPersonYears,
    modelStateBytes,
    modelStateTb,
    computeDemandFlops,
    computeDemandPflops,
    neuralStateTrafficBytesSec: neuralTrafficBytesSec,
    synapticStateTrafficBytesSec: synapticTrafficBytesSec,
    memoryTrafficBytesSec: totalMemoryTrafficBytesSec,
    memoryTrafficTbS,
    interconnectTrafficBytesSec,
    interconnectTrafficTbS,
    totalPowerDemandMw,
    imagingCostUsd,
    storageCostUsdPerYear,
    computeCostUsdPerYear,
    energyCostUsdPerYear,
    proofreadingCostUsd,
    totalEstimatedCostUsd
  };
}

/**
 * Dynamic scientific formatters that prevent underflow/overflow artifacts (e.g. 0.00 PFLOPS, 0.00 MW, 0 days).
 */
export function formatBytes(bytes: number): string {
  if (!isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const clampedI = Math.min(units.length - 1, Math.max(0, i));
  return `${(bytes / Math.pow(1024, clampedI)).toFixed(2)} ${units[clampedI]}`;
}

export function formatComputeFlops(flops: number): string {
  if (!isFinite(flops) || flops <= 0) return '0 FLOPS';
  if (flops >= 1e18) return `${(flops / 1e18).toFixed(2)} EFLOPS`;
  if (flops >= 1e15) return `${(flops / 1e15).toFixed(2)} PFLOPS`;
  if (flops >= 1e12) return `${(flops / 1e12).toFixed(2)} TFLOPS`;
  if (flops >= 1e9) return `${(flops / 1e9).toFixed(2)} GFLOPS`;
  if (flops >= 1e6) return `${(flops / 1e6).toFixed(2)} MFLOPS`;
  if (flops >= 1e3) return `${(flops / 1e3).toFixed(1)} kFLOPS`;
  return `${flops.toFixed(0)} FLOPS`;
}

export function formatPowerDemand(mw: number): string {
  if (!isFinite(mw) || mw <= 0) return '0 W';
  if (mw >= 1.0) return `${mw.toFixed(2)} MW`;
  if (mw >= 0.001) return `${(mw * 1000).toFixed(1)} kW`;
  return `${(mw * 1e6).toFixed(1)} W`;
}

export function formatBandwidth(tbS: number): string {
  if (!isFinite(tbS) || tbS <= 0) return '0 B/s';
  if (tbS >= 1.0) return `${tbS.toFixed(2)} TB/s`;
  if (tbS >= 0.001) return `${(tbS * 1000).toFixed(1)} GB/s`;
  return `${(tbS * 1e6).toFixed(1)} MB/s`;
}

export function formatAcquisitionDuration(years: number, days: number): string {
  if (!isFinite(years) || years <= 0) return '0 hrs';
  if (years >= 1.0) return `${years.toFixed(2)} yrs (${Math.round(days).toLocaleString()} d)`;
  if (days >= 1.0) return `${days.toFixed(1)} days (${(days * 24).toFixed(0)} hrs)`;
  const hours = days * 24;
  if (hours >= 1.0) return `${hours.toFixed(1)} hrs`;
  return `${(hours * 60).toFixed(0)} mins`;
}

export function formatCurrency(amount: number): string {
  if (!isFinite(amount) || amount <= 0) return '$0';
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}k`;
  return `$${amount.toFixed(0)}`;
}

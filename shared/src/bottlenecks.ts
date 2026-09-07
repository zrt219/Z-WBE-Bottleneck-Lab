import {
  BottleneckDimension,
  BottleneckResult,
  CalculatedMetrics,
  PressuresMap,
  ScenarioAssumptions
} from './types';
import {
  formatBytes,
  formatComputeFlops,
  formatPowerDemand,
  formatBandwidth,
  formatAcquisitionDuration,
  formatCurrency
} from './equations';

/**
 * Bottleneck Engine:
 * Deterministically calculates normalized pressure scores across 8 technological & economic dimensions:
 * 1. ACQUISITION
 * 2. RECONSTRUCTION
 * 3. STORAGE
 * 4. COMPUTE
 * 5. MEMORY_BANDWIDTH
 * 6. INTERCONNECT
 * 7. POWER
 * 8. ECONOMIC_COST
 *
 * Pressure score convention:
 * 100.0 = Demand exactly meets allocated capacity/target.
 * <100.0 = Feasible within allocated constraints (slack exists).
 * >100.0 = Constraint violation / bottleneck pressure.
 */

function formatNumber(num: number, decimals: number = 2): string {
  if (typeof num !== 'number' || !isFinite(num)) return '0';
  if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'k';
  return num.toFixed(decimals);
}



export function calculateBottlenecks(
  assumptions: ScenarioAssumptions,
  metrics: CalculatedMetrics
): BottleneckResult {
  const { acquisition, reconstruction, hardware, economics } = assumptions;

  // 1. Acquisition Pressure: Scan time vs target timeline (years)
  const targetYears = Math.max(0.01, economics.targetTimelineYears);
  const acquisitionRatio = metrics.acquisitionTimeYears / targetYears;
  const acquisitionScore = isFinite(acquisitionRatio) ? acquisitionRatio * 100 : 9999;

  // 2. Reconstruction Pressure:
  // Assumes a realistic proofreading lab of e.g. 50 parallel FTEs working over the target timeline
  const maxProofreadingHoursCapacity = 50 * 2000 * targetYears;
  const proofreadingRatio = metrics.manualProofreadingPersonHours / maxProofreadingHoursCapacity;
  const autoReconRatio = metrics.automatedReconstructionYears / targetYears;
  const reconRatio = Math.max(proofreadingRatio, autoReconRatio);
  const reconScore = isFinite(reconRatio) ? reconRatio * 100 : 9999;

  // 3. Storage Pressure: Total raw + model state storage vs PB capacity
  const totalStorageBytes = metrics.compressedDataBytes + metrics.modelStateBytes;
  const storageCapacityPb = hardware.storageCapacityPb ?? 50;
  const storageCapacityBytes = storageCapacityPb * 1e15;
  const storageRatio = storageCapacityBytes > 0 ? totalStorageBytes / storageCapacityBytes : 9999;
  const storageScore = storageRatio * 100;

  // 4. Compute Pressure: Demand PFLOPS vs hardware PFLOPS
  const computePflops = hardware.computeThroughputPflops ?? 1;
  const computeRatio =
    computePflops > 0 ? metrics.computeDemandPflops / computePflops : 9999;
  const computeScore = computeRatio * 100;

  // 5. Memory Bandwidth Pressure: Traffic TB/s vs available TB/s
  const memoryBandwidth = hardware.memoryBandwidthTbS ?? 10;
  const memoryRatio =
    memoryBandwidth > 0 ? metrics.memoryTrafficTbS / memoryBandwidth : 9999;
  const memoryScore = memoryRatio * 100;

  // 6. Interconnect Pressure: Cross-node TB/s vs available interconnect TB/s
  const interconnectBandwidth = hardware.interconnectBandwidthTbS ?? 2;
  const interconnectRatio =
    interconnectBandwidth > 0 ? metrics.interconnectTrafficTbS / interconnectBandwidth : 9999;
  const interconnectScore = interconnectRatio * 100;

  // 7. Power Pressure: Total MW vs power budget MW
  const powerBudget = hardware.powerBudgetMw ?? 10;
  const powerRatio =
    powerBudget > 0 ? metrics.totalPowerDemandMw / powerBudget : 9999;
  const powerScore = powerRatio * 100;

  // 8. Economic Cost Pressure: Estimated cost vs budget ceiling USD
  const costRatio =
    economics.budgetCeilingUsd > 0
      ? metrics.totalEstimatedCostUsd / economics.budgetCeilingUsd
      : 9999;
  const costScore = costRatio * 100;

  const pressures: PressuresMap = {
    ACQUISITION: {
      score: Number(acquisitionScore.toFixed(2)),
      rawRatio: Number(acquisitionRatio.toFixed(3)),
      demandFormatted: formatAcquisitionDuration(metrics.acquisitionTimeYears, metrics.acquisitionTimeDays),
      capacityFormatted: `${targetYears.toFixed(1)} yr target`,
      summary: `Takes ${metrics.acquisitionTimeYears >= 1 ? `${metrics.acquisitionTimeYears.toFixed(2)} years` : formatAcquisitionDuration(metrics.acquisitionTimeYears, metrics.acquisitionTimeDays)} across ${acquisition.machineCount} instruments.`
    },
    RECONSTRUCTION: {
      score: Number(reconScore.toFixed(2)),
      rawRatio: Number(reconRatio.toFixed(3)),
      demandFormatted: `${formatNumber(metrics.manualProofreadingPersonHours)} hrs (${metrics.manualProofreadingPersonYears.toFixed(1)} FTE-yrs)`,
      capacityFormatted: `${formatNumber(maxProofreadingHoursCapacity)} hrs capacity`,
      summary: `Proofreading requires ${formatNumber(metrics.manualProofreadingPersonHours)} person-hours.`
    },
    STORAGE: {
      score: Number(storageScore.toFixed(2)),
      rawRatio: Number(storageRatio.toFixed(3)),
      demandFormatted: formatBytes(totalStorageBytes),
      capacityFormatted: `${storageCapacityPb} PB (${formatBytes(storageCapacityBytes)})`,
      summary: `Image + model state requires ${formatBytes(totalStorageBytes)}.`
    },
    COMPUTE: {
      score: Number(computeScore.toFixed(2)),
      rawRatio: Number(computeRatio.toFixed(3)),
      demandFormatted: formatComputeFlops(metrics.computeDemandFlops),
      capacityFormatted: formatComputeFlops(computePflops * 1e15),
      summary: `Real-time emulation demand is ${formatComputeFlops(metrics.computeDemandFlops)}.`
    },
    MEMORY_BANDWIDTH: {
      score: Number(memoryScore.toFixed(2)),
      rawRatio: Number(memoryRatio.toFixed(3)),
      demandFormatted: formatBandwidth(metrics.memoryTrafficTbS),
      capacityFormatted: formatBandwidth(memoryBandwidth),
      summary: `Continuous state transfer requires ${formatBandwidth(metrics.memoryTrafficTbS)}.`
    },
    INTERCONNECT: {
      score: Number(interconnectScore.toFixed(2)),
      rawRatio: Number(interconnectRatio.toFixed(3)),
      demandFormatted: formatBandwidth(metrics.interconnectTrafficTbS),
      capacityFormatted: formatBandwidth(hardware.interconnectBandwidthTbS ?? 2),
      summary: `Cross-node synchronization traffic is ${formatBandwidth(metrics.interconnectTrafficTbS)}.`
    },
    POWER: {
      score: Number(powerScore.toFixed(2)),
      rawRatio: Number(powerRatio.toFixed(3)),
      demandFormatted: formatPowerDemand(metrics.totalPowerDemandMw),
      capacityFormatted: formatPowerDemand(hardware.powerBudgetMw ?? 10),
      summary: `System compute & network power reaches ${formatPowerDemand(metrics.totalPowerDemandMw)}.`
    },
    ECONOMIC_COST: {
      score: Number(costScore.toFixed(2)),
      rawRatio: Number(costRatio.toFixed(3)),
      demandFormatted: formatCurrency(metrics.totalEstimatedCostUsd),
      capacityFormatted: `${formatCurrency(economics.budgetCeilingUsd)} budget`,
      summary: `Total pipeline financial cost is estimated at ${formatCurrency(metrics.totalEstimatedCostUsd)}.`
    }
  };

  // Rank dimensions strictly deterministically
  const ranked = (Object.keys(pressures) as BottleneckDimension[]).sort((a, b) => {
    return pressures[b].score - pressures[a].score;
  });

  const dominantBottleneck = ranked[0];
  const secondBottleneck = ranked[1];
  const dominantScore = pressures[dominantBottleneck].score;
  const secondScore = pressures[secondBottleneck].score;
  const margin = Number((dominantScore - secondScore).toFixed(2));

  // Uncertainty notes based on model parameters
  const uncertaintyNotes: string[] = [];
  if (assumptions.isHypotheticalHumanScale) {
    uncertaintyNotes.push(
      'HYPOTHETICAL SCALE: Human-scale connectome and biophysical parameters represent theoretical scaling projections, not demonstrated empirical data.'
    );
  }
  if (reconstruction.rawSegmentationAccuracy < 0.99) {
    uncertaintyNotes.push(
      `Segmentation accuracy at ${(reconstruction.rawSegmentationAccuracy * 100).toFixed(1)}% yields high proofreading multiplier sensitivity; small error increases create non-linear proofreading backlogs.`
    );
  }
  if (assumptions.neuralModel.bytesPerSynapse < 8) {
    uncertaintyNotes.push(
      'Synaptic state allocation assumes minimal plasticity variables; complex multi-stage plastic states require substantially higher memory bandwidth.'
    );
  }
  if (pressures.MEMORY_BANDWIDTH.score > 80 && pressures.COMPUTE.score < 50) {
    uncertaintyNotes.push(
      'System demonstrates high arithmetic intensity shortfall (memory-bound execution); increasing raw compute FLOPs yields diminishing returns without memory subsystem scaling.'
    );
  }

  const sensitivitySummary =
    dominantScore > 100
      ? `Critical bottleneck in ${dominantBottleneck} exceeds threshold by ${(dominantScore - 100).toFixed(1)}%. Secondary constraint: ${secondBottleneck} (${secondScore.toFixed(1)}%). Margin: ${margin.toFixed(1)} points.`
      : `All parameters within constraint limits. Leading constraint is ${dominantBottleneck} (${dominantScore.toFixed(1)}% of budget), followed by ${secondBottleneck} (${secondScore.toFixed(1)}%).`;

  return {
    dominantBottleneck,
    secondBottleneck,
    dominantScore,
    secondScore,
    margin,
    pressures,
    sensitivitySummary,
    uncertaintyNotes
  };
}

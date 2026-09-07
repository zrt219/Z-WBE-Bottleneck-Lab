import { CalculatedMetrics, ScenarioAssumptions } from './types';
/**
 * Calculate voxel count:
 * N_voxel = V / (dx * dy * dz)
 */
export declare function calculateVoxelCount(tissueVolumeMm3: number, voxelResXNm: number, voxelResYNm: number, voxelResZNm: number): number;
/**
 * Calculate raw image data in bytes:
 * D_raw = N_voxel * bits_per_voxel / 8
 */
export declare function calculateRawDataBytes(voxelCount: number, bitsPerVoxel: number): number;
/**
 * Calculate effective volumetric imaging rate:
 * R_total = R_machine * machine_count * utilization
 */
export declare function calculateEffectiveImagingThroughput(ratePerMachineMm3Year: number, machineCount: number, utilization: number): number;
/**
 * Calculate acquisition time:
 * T_scan = V / R_total (in years)
 */
export declare function calculateAcquisitionTimeYears(tissueVolumeMm3: number, effectiveThroughputMm3Year: number): number;
/**
 * Calculate model state storage:
 * S_state = neurons * bytes_per_neuron + synapses * bytes_per_synapse
 */
export declare function calculateModelStateBytes(neuronCount: number, bytesPerNeuron: number, synapseCount: number, bytesPerSynapse: number): number;
/**
 * Calculate approximate compute demand:
 * F_total = neuron_count * neuron_update_rate * operations_per_neuron_update
 *         + synaptic_event_rate * operations_per_synaptic_event
 * (where synaptic_event_rate = synapse_count * average_firing_rate)
 */
export declare function calculateComputeDemandFlops(neuronCount: number, neuronUpdateRateHz: number, opsPerNeuronUpdate: number, synapseCount: number, averageFiringRateHz: number, opsPerSynapticEvent: number): number;
/**
 * Calculate approximate memory traffic:
 * B_memory = neural_state_traffic + synaptic_state_traffic
 */
export declare function calculateMemoryTrafficBytesSec(neuronCount: number, neuronUpdateRateHz: number, bytesPerNeuron: number, synapseCount: number, averageFiringRateHz: number, bytesPerSynapse: number): {
    neuralTrafficBytesSec: number;
    synapticTrafficBytesSec: number;
    totalMemoryTrafficBytesSec: number;
};
/**
 * Calculate approximate cross-partition interconnect traffic:
 * Cross-node spike synchronization based on cluster partitioning fraction (~25% cross-boundary)
 */
export declare function calculateInterconnectTrafficBytesSec(synapseCount: number, averageFiringRateHz: number, crossNodeFraction?: number, spikePacketBytes?: number): number;
/**
 * Calculate all deterministic metrics for a scenario.
 */
export declare function calculateAllMetrics(assumptions: ScenarioAssumptions): CalculatedMetrics;
/**
 * Dynamic scientific formatters that prevent underflow/overflow artifacts (e.g. 0.00 PFLOPS, 0.00 MW, 0 days).
 */
export declare function formatBytes(bytes: number): string;
export declare function formatComputeFlops(flops: number): string;
export declare function formatPowerDemand(mw: number): string;
export declare function formatBandwidth(tbS: number): string;
export declare function formatAcquisitionDuration(years: number, days: number): string;
export declare function formatCurrency(amount: number): string;
//# sourceMappingURL=equations.d.ts.map
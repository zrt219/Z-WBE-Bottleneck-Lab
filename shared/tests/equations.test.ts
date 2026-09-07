import { describe, it, expect } from 'vitest';
import {
  calculateVoxelCount,
  calculateRawDataBytes,
  calculateEffectiveImagingThroughput,
  calculateAcquisitionTimeYears,
  calculateModelStateBytes,
  calculateComputeDemandFlops,
  calculateMemoryTrafficBytesSec,
  calculateInterconnectTrafficBytesSec,
  calculateAllMetrics
} from '../src/equations';
import { PRESET_DROSOPHILA, PRESET_SMALL_NEURAL_SYSTEM } from '../src/presets';

describe('Deterministic Equation Unit Tests', () => {
  describe('Voxel Calculations', () => {
    it('calculates voxel count accurately for 1 mm³ at 10x10x10 nm resolution', () => {
      // 1 mm³ = 10^18 nm³. Voxel volume = 10 * 10 * 10 = 1000 nm³.
      // Expected = 10^18 / 1000 = 10^15 voxels.
      const voxels = calculateVoxelCount(1.0, 10, 10, 10);
      expect(voxels).toBeCloseTo(1e15, -5);
    });

    it('handles zero and negative inputs safely without NaN', () => {
      expect(calculateVoxelCount(0, 10, 10, 10)).toBe(0);
      expect(calculateVoxelCount(-5, 10, 10, 10)).toBe(0);
      expect(calculateVoxelCount(1, 0, 10, 10)).toBe(0);
    });
  });

  describe('Data-Volume Conversions', () => {
    it('calculates raw data bytes from voxel count and bit depth', () => {
      // 8e9 voxels at 8 bits/voxel = 8e9 bytes = 8 GB
      const bytes = calculateRawDataBytes(8e9, 8);
      expect(bytes).toBe(8e9);
    });

    it('handles edge case bit depths', () => {
      expect(calculateRawDataBytes(1e6, 16)).toBe(2e6);
      expect(calculateRawDataBytes(0, 8)).toBe(0);
      expect(calculateRawDataBytes(-100, 8)).toBe(0);
    });
  });

  describe('Acquisition Time', () => {
    it('calculates acquisition time correctly from volume and rate', () => {
      // Volume = 10 mm³, Rate = 5 mm³/year -> 2 years
      const years = calculateAcquisitionTimeYears(10, 5);
      expect(years).toBe(2);
    });

    it('returns Infinity for zero or negative throughput', () => {
      expect(calculateAcquisitionTimeYears(10, 0)).toBe(Infinity);
      expect(calculateAcquisitionTimeYears(10, -1)).toBe(Infinity);
    });

    it('calculates effective throughput from machine fleet and utilization', () => {
      // 0.5 mm³/yr * 4 machines * 0.8 utilization = 1.6 mm³/yr
      const rate = calculateEffectiveImagingThroughput(0.5, 4, 0.8);
      expect(rate).toBeCloseTo(1.6, 5);
    });

    it('respects small positive utilization without arbitrary clamping', () => {
      // 1.0 mm³/yr * 1 machine * 0.005 utilization = 0.005 mm³/yr
      const rate = calculateEffectiveImagingThroughput(1.0, 1, 0.005);
      expect(rate).toBeCloseTo(0.005, 5);
    });
  });

  describe('Model State Storage Estimate', () => {
    it('calculates model state storage accurately', () => {
      // 1000 neurons * 1024 bytes + 5000 synapses * 16 bytes
      // = 1,024,000 + 80,000 = 1,104,000 bytes
      const state = calculateModelStateBytes(1000, 1024, 5000, 16);
      expect(state).toBe(1104000);
    });

    it('handles 0 neurons and 0 synapses safely', () => {
      expect(calculateModelStateBytes(0, 1024, 0, 16)).toBe(0);
    });
  });

  describe('Compute Demand Estimate', () => {
    it('calculates continuous FLOPs demand based on updates and synaptic events', () => {
      // 1000 neurons * 1000 Hz * 200 ops = 200,000,000 FLOP/s
      // 10,000 synapses * 5 Hz * 50 ops = 2,500,000 FLOP/s
      // Total = 202,500,000 FLOP/s
      const flops = calculateComputeDemandFlops(1000, 1000, 200, 10000, 5, 50);
      expect(flops).toBe(202500000);
    });
  });

  describe('Memory Bandwidth Estimate', () => {
    it('calculates memory traffic from state update frequencies', () => {
      // 10,000 neurons * 1000 Hz * 512 bytes = 5,120,000,000 bytes/s
      // 100,000 synapses * 5 Hz * 16 bytes = 8,000,000 bytes/s
      // Total = 5,128,000,000 bytes/s
      const traffic = calculateMemoryTrafficBytesSec(10000, 1000, 512, 100000, 5, 16);
      expect(traffic.totalMemoryTrafficBytesSec).toBe(5128000000);
      expect(traffic.neuralTrafficBytesSec).toBe(5120000000);
      expect(traffic.synapticTrafficBytesSec).toBe(8000000);
    });
  });

  describe('End-to-End Metrics Aggregation', () => {
    it('correctly aggregates Drosophila scenario metrics', () => {
      const metrics = calculateAllMetrics(PRESET_DROSOPHILA);
      expect(metrics.voxelCount).toBeGreaterThan(1e11);
      expect(metrics.rawDataBytes).toBeGreaterThan(1e11);
      expect(metrics.acquisitionTimeYears).toBeGreaterThan(0);
      expect(metrics.computeDemandPflops).toBeGreaterThan(0);
      expect(metrics.memoryTrafficTbS).toBeGreaterThan(0);
      expect(metrics.totalEstimatedCostUsd).toBeGreaterThan(0);
    });

    it('correctly calculates Small Neural System metrics', () => {
      const metrics = calculateAllMetrics(PRESET_SMALL_NEURAL_SYSTEM);
      expect(metrics.modelStateBytes).toBeGreaterThan(0);
      expect(metrics.totalPowerDemandMw).toBeGreaterThan(0);
      expect(isFinite(metrics.acquisitionTimeYears)).toBe(true);
    });

    it('computes energyCostUsdPerYear strictly as an annual rate and scales over multi-year timelines in totalEstimatedCostUsd', () => {
      const customTimelineAssumptions = {
        ...PRESET_DROSOPHILA,
        economics: {
          ...PRESET_DROSOPHILA.economics,
          targetTimelineYears: 4.0
        }
      };
      const metrics = calculateAllMetrics(customTimelineAssumptions);
      const expectedAnnualEnergy = metrics.totalPowerDemandMw * 8760 * customTimelineAssumptions.economics.energyCostPerMwh;
      expect(metrics.energyCostUsdPerYear).toBeCloseTo(expectedAnnualEnergy, 2);

      // Verify that totalEstimatedCostUsd includes 4 years of energy cost
      const totalWithoutEnergy = metrics.totalEstimatedCostUsd - metrics.energyCostUsdPerYear * 4.0;
      expect(totalWithoutEnergy).toBeGreaterThan(0);
    });
  });

  describe('Interconnect Traffic Estimate', () => {
    it('calculates cross-partition interconnect traffic from synapse firing events', () => {
      // 1e8 synapses * 5 Hz * 0.25 cross-node * 8 bytes = 1,000,000,000 bytes/sec = 1 GB/s
      const bytesSec = calculateInterconnectTrafficBytesSec(1e8, 5, 0.25, 8);
      expect(bytesSec).toBe(1e9);
    });

    it('returns zero for zero firing rate or zero synapses', () => {
      expect(calculateInterconnectTrafficBytesSec(0, 5)).toBe(0);
      expect(calculateInterconnectTrafficBytesSec(100, 0)).toBe(0);
    });
  });

  describe('Reconstruction Estimates and Invalid Input Resilience', () => {
    it('calculates reconstruction and proofreading metrics safely with zero volume', () => {
      const zeroAssumptions = {
        ...PRESET_DROSOPHILA,
        acquisition: {
          ...PRESET_DROSOPHILA.acquisition,
          tissueVolumeMm3: 0
        }
      };
      const metrics = calculateAllMetrics(zeroAssumptions);
      expect(metrics.voxelCount).toBe(0);
      expect(metrics.rawDataBytes).toBe(0);
      expect(metrics.manualProofreadingPersonHours).toBe(0);
      expect(isFinite(metrics.acquisitionTimeYears)).toBe(false);
    });

    it('handles zero or negative hardware capacities gracefully', () => {
      const negativeHwAssumptions = {
        ...PRESET_DROSOPHILA,
        hardware: {
          computeThroughputPflops: 0,
          memoryBandwidthTbS: -1,
          interconnectBandwidthTbS: 0,
          storageCapacityPb: 0,
          powerBudgetMw: 0
        }
      };
      const metrics = calculateAllMetrics(negativeHwAssumptions);
      expect(metrics.computeDemandPflops).toBeGreaterThan(0);
      expect(metrics.memoryTrafficTbS).toBeGreaterThan(0);
    });
  });
});


import { describe, it, expect } from 'vitest';
import { runSensitivityAnalysis } from '../src/sensitivity';
import {
  DEMO_PRESET_IMAGING_WALL,
  DEMO_PRESET_MEMORY_WALL,
  PRESET_DROSOPHILA
} from '../src/presets';

describe('Sensitivity Analysis Engine Unit Tests', () => {
  it('runs local perturbations at 0.5x, 1x, 2x, and 10x for all major parameters', () => {
    const result = runSensitivityAnalysis(PRESET_DROSOPHILA);

    expect(result.variables.length).toBeGreaterThanOrEqual(8);
    for (const v of result.variables) {
      expect(v.perturbations['0.5x']).toBeDefined();
      expect(v.perturbations['1x']).toBeDefined();
      expect(v.perturbations['2x']).toBeDefined();
      expect(v.perturbations['10x']).toBeDefined();
      expect(v.perturbations['1x'].bottleneckScore).toBeGreaterThanOrEqual(0);
    }
  });

  it('identifies imaging throughput as highest leverage when imaging is the dominant wall', () => {
    const result = runSensitivityAnalysis(DEMO_PRESET_IMAGING_WALL);

    expect(result.highestLeverageAssumption).toBeDefined();
    // In Imaging Wall, imaging instrument rate or instrument count must have the highest leverage
    const topVar = result.highestLeverageAssumption.variableKey;
    expect(['imagingRatePerMachineMm3Year', 'machineCount']).toContain(topVar);
  });

  it('identifies memory bandwidth as highest leverage when memory is the dominant wall', () => {
    const result = runSensitivityAnalysis(DEMO_PRESET_MEMORY_WALL);

    expect(result.highestLeverageAssumption).toBeDefined();
    expect(result.highestLeverageAssumption.variableKey).toBe('memoryBandwidthTbS');
  });

  it('dynamically adapts takeaway message to reflect the active scenario', () => {
    const result1 = runSensitivityAnalysis(DEMO_PRESET_IMAGING_WALL);
    const result2 = runSensitivityAnalysis(DEMO_PRESET_MEMORY_WALL);

    expect(result1.takeaway).toContain('IMAGING');
    expect(result2.takeaway).toContain('MEMORY BANDWIDTH');
    expect(result1.takeaway).not.toBe(result2.takeaway);
  });

  it('guarantees that bottleneck relief takes precedence over non-bottleneck variables', () => {
    const result = runSensitivityAnalysis(DEMO_PRESET_MEMORY_WALL);
    const memVar = result.variables.find((v) => v.variableKey === 'memoryBandwidthTbS')!;
    const imagingVar = result.variables.find((v) => v.variableKey === 'imagingRatePerMachineMm3Year')!;
    expect(memVar.leverageScore).toBeGreaterThan(imagingVar.leverageScore);
  });
});

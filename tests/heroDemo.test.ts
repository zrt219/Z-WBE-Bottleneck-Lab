import { describe, it, expect } from 'vitest';
import {
  PRESET_DROSOPHILA,
  applyImaging100xDemo,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis,
  buildNemotronInputSchema,
  generateGroundedFallback
} from '@z-wbe/shared';

describe('One-Click Hero Demo Pipeline & Bottleneck Shift Verification', () => {
  it('accelerates imaging rate per machine by 100x', () => {
    const base = PRESET_DROSOPHILA;
    const accelerated = applyImaging100xDemo(base);

    expect(accelerated.name).toContain('(100x Imaging Accelerated)');
    expect(accelerated.acquisition.imagingRatePerMachineMm3Year).toBeCloseTo(
      base.acquisition.imagingRatePerMachineMm3Year * 100
    );
  });

  it('shifts the dominant bottleneck upon 100x imaging acceleration', () => {
    const baseMetrics = calculateAllMetrics(PRESET_DROSOPHILA);
    const baseBottleneck = calculateBottlenecks(PRESET_DROSOPHILA, baseMetrics);

    // Initial baseline has ACQUISITION as dominant constraint
    expect(baseBottleneck.dominantBottleneck).toBe('ACQUISITION');

    // After 1-click 100x acceleration:
    const accelerated = applyImaging100xDemo(PRESET_DROSOPHILA);
    const acceleratedMetrics = calculateAllMetrics(accelerated);
    const acceleratedBottleneck = calculateBottlenecks(accelerated, acceleratedMetrics);

    // Acquisition time plummets by 100x
    expect(acceleratedMetrics.acquisitionTimeYears).toBeCloseTo(
      baseMetrics.acquisitionTimeYears / 100,
      4
    );

    // Acquisition score drops below 100%, shifting dominant constraint away from ACQUISITION
    expect(acceleratedBottleneck.pressures.ACQUISITION.score).toBeLessThan(
      baseBottleneck.pressures.ACQUISITION.score
    );
    expect(acceleratedBottleneck.dominantBottleneck).not.toBe('ACQUISITION');
  });

  it('generates fully grounded interpretation and schema for the accelerated demo', () => {
    const accelerated = applyImaging100xDemo(PRESET_DROSOPHILA);
    const metrics = calculateAllMetrics(accelerated);
    const bottleneck = calculateBottlenecks(accelerated, metrics);
    const sensitivity = runSensitivityAnalysis(accelerated);

    const schema = buildNemotronInputSchema(accelerated, metrics, bottleneck, sensitivity);
    expect(schema.project).toBe('Z-WBE Bottleneck Lab');
    expect(schema.dominant_bottleneck).toBe(bottleneck.dominantBottleneck);

    const interpretation = generateGroundedFallback(schema);
    expect(['ok', 'unavailable']).toContain(interpretation.status);
    expect(interpretation.sections.whatLimitsThisScenario).toBeDefined();
    expect(interpretation.sections.whereDidTheBottleneckMove).toBeDefined();
  });
});

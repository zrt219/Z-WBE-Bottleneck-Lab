import { describe, it, expect } from 'vitest';
import { calculateAllMetrics } from '../src/equations';
import { calculateBottlenecks } from '../src/bottlenecks';
import {
  PRESET_DROSOPHILA,
  PRESET_HUMAN_SCALE,
  PRESET_CUSTOM,
  DEMO_PRESET_IMAGING_WALL,
  DEMO_PRESET_MEMORY_WALL,
  DEMO_PRESET_ECONOMIC_WALL,
  applyImaging100xDemo
} from '../src/presets';

describe('Bottleneck Engine Unit Tests', () => {
  it('selects ACQUISITION as dominant bottleneck in Preset 1 (Imaging Wall)', () => {
    const metrics = calculateAllMetrics(DEMO_PRESET_IMAGING_WALL);
    const result = calculateBottlenecks(DEMO_PRESET_IMAGING_WALL, metrics);

    expect(result.dominantBottleneck).toBe('ACQUISITION');
    expect(result.dominantScore).toBeGreaterThan(100);
    expect(result.margin).toBeGreaterThanOrEqual(0);
  });

  it('selects MEMORY_BANDWIDTH as dominant bottleneck in Preset 2 (Memory Wall)', () => {
    const metrics = calculateAllMetrics(DEMO_PRESET_MEMORY_WALL);
    const result = calculateBottlenecks(DEMO_PRESET_MEMORY_WALL, metrics);

    expect(result.dominantBottleneck).toBe('MEMORY_BANDWIDTH');
    expect(result.dominantScore).toBeGreaterThan(100);
  });

  it('selects ECONOMIC_COST as dominant bottleneck in Preset 3 (Economic Wall)', () => {
    const metrics = calculateAllMetrics(DEMO_PRESET_ECONOMIC_WALL);
    const result = calculateBottlenecks(DEMO_PRESET_ECONOMIC_WALL, metrics);

    expect(result.dominantBottleneck).toBe('ECONOMIC_COST');
    expect(result.dominantScore).toBeGreaterThan(100);
  });

  it('demonstrates hero demo: 100x imaging acceleration moves the bottleneck', () => {
    // Start at Imaging Wall
    const baselineMetrics = calculateAllMetrics(DEMO_PRESET_IMAGING_WALL);
    const baselineBottleneck = calculateBottlenecks(DEMO_PRESET_IMAGING_WALL, baselineMetrics);
    expect(baselineBottleneck.dominantBottleneck).toBe('ACQUISITION');

    // Accelerate imaging 100x
    const accelerated = applyImaging100xDemo(DEMO_PRESET_IMAGING_WALL);
    const acceleratedMetrics = calculateAllMetrics(accelerated);
    const acceleratedBottleneck = calculateBottlenecks(accelerated, acceleratedMetrics);

    // The bottleneck should have moved away from ACQUISITION
    expect(acceleratedBottleneck.dominantBottleneck).not.toBe('ACQUISITION');
    expect(acceleratedBottleneck.pressures.ACQUISITION.score).toBeLessThan(
      baselineBottleneck.pressures.ACQUISITION.score
    );
  });

  it('correctly flags Human-Scale connectome with hypothetical scaling notes', () => {
    const metrics = calculateAllMetrics(PRESET_HUMAN_SCALE);
    const result = calculateBottlenecks(PRESET_HUMAN_SCALE, metrics);

    const hasHypotheticalNote = result.uncertaintyNotes.some((n) =>
      n.includes('HYPOTHETICAL SCALE')
    );
    expect(hasHypotheticalNote).toBe(true);
  });

  it('correctly calculates bottlenecks for PRESET_CUSTOM', () => {
    const metrics = calculateAllMetrics(PRESET_CUSTOM);
    const result = calculateBottlenecks(PRESET_CUSTOM, metrics);
    expect(result.dominantBottleneck).toBeDefined();
    expect(result.dominantScore).toBeGreaterThan(0);
    expect(result.margin).toBeGreaterThanOrEqual(0);
  });
});

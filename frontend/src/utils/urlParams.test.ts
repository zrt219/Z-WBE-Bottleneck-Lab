import { describe, it, expect } from 'vitest';
import { encodeScenarioToUrl, decodeScenarioFromUrl } from './urlParams';
import { PRESET_MOUSE_CIRCUIT, PRESET_DROSOPHILA } from '@z-wbe/shared';

describe('URL Scenario Permalinks & Real-time State Sync', () => {
  it('encodes scenario assumptions into human-readable query string', () => {
    const encoded = encodeScenarioToUrl(PRESET_MOUSE_CIRCUIT);
    expect(encoded).toContain('preset=mouse-circuit');
    expect(encoded).toContain('vol=10');
    expect(encoded).toContain('memBw=');
    expect(encoded).toContain('pflops=');
  });

  it('decodes query string back into validated scenario assumptions', () => {
    const search = '?preset=mouse-circuit&vol=25.5&memBw=42.0';
    const decoded = decodeScenarioFromUrl(search);

    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe('mouse-circuit');
    expect(decoded?.acquisition.tissueVolumeMm3).toBe(25.5);
    expect(decoded?.hardware.memoryBandwidthTbS).toBe(42.0);
  });

  it('returns null on empty or invalid search string', () => {
    expect(decodeScenarioFromUrl('')).toBeNull();
    expect(decodeScenarioFromUrl('?')).toBeNull();
  });

  it('handles unknown preset by falling back to Drosophila baseline', () => {
    const search = '?preset=unknown-organism&vol=5.0';
    const decoded = decodeScenarioFromUrl(search);

    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe(PRESET_DROSOPHILA.id);
    expect(decoded?.acquisition.tissueVolumeMm3).toBe(5.0);
  });
});

import {
  ScenarioAssumptions,
  PRESET_SMALL_NEURAL_SYSTEM,
  PRESET_DROSOPHILA,
  PRESET_MOUSE_CIRCUIT,
  PRESET_HUMAN_SCALE,
  DEMO_PRESET_IMAGING_WALL,
  DEMO_PRESET_MEMORY_WALL
} from '@z-wbe/shared';

const PRESETS_MAP: Record<string, ScenarioAssumptions> = {
  'small-neural-system': PRESET_SMALL_NEURAL_SYSTEM,
  'drosophila': PRESET_DROSOPHILA,
  'mouse-circuit': PRESET_MOUSE_CIRCUIT,
  'human-scale': PRESET_HUMAN_SCALE,
  'demo-imaging-wall': DEMO_PRESET_IMAGING_WALL,
  'demo-memory-wall': DEMO_PRESET_MEMORY_WALL
};

/**
 * Encodes ScenarioAssumptions into human-readable URLSearchParams.
 */
export function encodeScenarioToUrl(assumptions: ScenarioAssumptions): string {
  const params = new URLSearchParams();

  // Find matching baseline preset
  const basePresetId = assumptions.id || assumptions.scaleId || 'drosophila';
  params.set('preset', basePresetId);

  // Core overrides
  if (assumptions.acquisition) {
    params.set('vol', String(assumptions.acquisition.tissueVolumeMm3));
    params.set('resX', String(assumptions.acquisition.voxelResXNm));
    params.set('resY', String(assumptions.acquisition.voxelResYNm));
    params.set('resZ', String(assumptions.acquisition.voxelResZNm));
    params.set('machines', String(assumptions.acquisition.machineCount));
    params.set('acqRate', String(assumptions.acquisition.imagingRatePerMachineMm3Year));
  }

  if (assumptions.neuralModel) {
    params.set('neurons', String(assumptions.neuralModel.neuronCount));
    params.set('synapses', String(assumptions.neuralModel.synapseCount));
    params.set('firingRate', String(assumptions.neuralModel.averageFiringRateHz));
  }

  if (assumptions.hardware) {
    params.set('pflops', String(assumptions.hardware.computeThroughputPflops));
    params.set('memBw', String(assumptions.hardware.memoryBandwidthTbS));
    params.set('interBw', String(assumptions.hardware.interconnectBandwidthTbS));
    params.set('storagePb', String(assumptions.hardware.storageCapacityPb));
    params.set('powerMw', String(assumptions.hardware.powerBudgetMw));
  }

  if (assumptions.economics) {
    params.set('budget', String(assumptions.economics.budgetCeilingUsd));
    params.set('targetYears', String(assumptions.economics.targetTimelineYears));
  }

  return params.toString();
}

/**
 * Parses URL query string into validated ScenarioAssumptions with baseline fallback.
 */
export function decodeScenarioFromUrl(search: string): ScenarioAssumptions | null {
  if (!search || search.length < 2) return null;

  try {
    const params = new URLSearchParams(search);
    const presetParam = params.get('preset') || 'drosophila';

    const basePreset = PRESETS_MAP[presetParam] || PRESET_DROSOPHILA;
    const cloned: ScenarioAssumptions = JSON.parse(JSON.stringify(basePreset));

    // Helper to safely parse float
    const getNum = (key: string): number | null => {
      const val = params.get(key);
      if (val === null || val === '') return null;
      const parsed = parseFloat(val);
      return isNaN(parsed) ? null : parsed;
    };

    // Acquisition
    const vol = getNum('vol');
    if (vol !== null && vol > 0) cloned.acquisition.tissueVolumeMm3 = vol;

    const resX = getNum('resX');
    if (resX !== null && resX > 0) cloned.acquisition.voxelResXNm = resX;

    const resY = getNum('resY');
    if (resY !== null && resY > 0) cloned.acquisition.voxelResYNm = resY;

    const resZ = getNum('resZ');
    if (resZ !== null && resZ > 0) cloned.acquisition.voxelResZNm = resZ;

    const machines = getNum('machines');
    if (machines !== null && machines > 0) cloned.acquisition.machineCount = Math.round(machines);

    const acqRate = getNum('acqRate');
    if (acqRate !== null && acqRate > 0) cloned.acquisition.imagingRatePerMachineMm3Year = acqRate;

    // Neural Model
    const neurons = getNum('neurons');
    if (neurons !== null && neurons > 0) cloned.neuralModel.neuronCount = neurons;

    const synapses = getNum('synapses');
    if (synapses !== null && synapses > 0) cloned.neuralModel.synapseCount = synapses;

    const firingRate = getNum('firingRate');
    if (firingRate !== null && firingRate > 0) cloned.neuralModel.averageFiringRateHz = firingRate;

    // Hardware
    const pflops = getNum('pflops');
    if (pflops !== null && pflops > 0) cloned.hardware.computeThroughputPflops = pflops;

    const memBw = getNum('memBw');
    if (memBw !== null && memBw > 0) cloned.hardware.memoryBandwidthTbS = memBw;

    const interBw = getNum('interBw');
    if (interBw !== null && interBw > 0) cloned.hardware.interconnectBandwidthTbS = interBw;

    const storagePb = getNum('storagePb');
    if (storagePb !== null && storagePb > 0) cloned.hardware.storageCapacityPb = storagePb;

    const powerMw = getNum('powerMw');
    if (powerMw !== null && powerMw > 0) cloned.hardware.powerBudgetMw = powerMw;

    // Economics
    const budget = getNum('budget');
    if (budget !== null && budget > 0) cloned.economics.budgetCeilingUsd = budget;

    const targetYears = getNum('targetYears');
    if (targetYears !== null && targetYears > 0) cloned.economics.targetTimelineYears = targetYears;

    return cloned;
  } catch (err) {
    console.warn('Failed to parse scenario URL parameters:', err);
    return null;
  }
}

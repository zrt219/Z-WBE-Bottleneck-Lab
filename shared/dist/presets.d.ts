import { ScenarioAssumptions } from './types';
export declare const PRESET_SMALL_NEURAL_SYSTEM: ScenarioAssumptions;
export declare const PRESET_DROSOPHILA: ScenarioAssumptions;
export declare const PRESET_MOUSE_CIRCUIT: ScenarioAssumptions;
export declare const PRESET_HUMAN_SCALE: ScenarioAssumptions;
export declare const PRESET_CUSTOM: ScenarioAssumptions;
/**
 * PRESET 1 — Imaging Wall
 * Acquisition throughput is the dominant bottleneck.
 * Scanning takes decades with only 2 instruments at 0.1 mm³/year for a 5 mm³ tissue block.
 */
export declare const DEMO_PRESET_IMAGING_WALL: ScenarioAssumptions;
/**
 * PRESET 2 — Memory Wall
 * Imaging technology improves dramatically (100x imaging speed, many machines),
 * but real-time simulation causes memory bandwidth to explode into the dominant bottleneck.
 */
export declare const DEMO_PRESET_MEMORY_WALL: ScenarioAssumptions;
/**
 * PRESET 3 — Economic Wall
 * Technical specs (compute, imaging, memory) are feasible on supercomputers,
 * but costs (storage, human proofreading, high-end instrument operation) blow past budget.
 */
export declare const DEMO_PRESET_ECONOMIC_WALL: ScenarioAssumptions;
export declare const ALL_PRESETS: ScenarioAssumptions[];
export declare function getPresetById(id: string): ScenarioAssumptions;
/**
 * Hero Demo Transformer:
 * "What happens if imaging becomes 100x faster?"
 * Takes any scenario and multiplies imaging rate per machine by 100x.
 */
export declare function applyImaging100xDemo(scenario: ScenarioAssumptions): ScenarioAssumptions;
//# sourceMappingURL=presets.d.ts.map
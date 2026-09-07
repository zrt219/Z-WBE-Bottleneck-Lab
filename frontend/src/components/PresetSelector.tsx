import React from 'react';
import {
  ScaleId,
  ScenarioAssumptions,
  PRESET_SMALL_NEURAL_SYSTEM,
  PRESET_DROSOPHILA,
  PRESET_MOUSE_CIRCUIT,
  PRESET_HUMAN_SCALE,
  PRESET_CUSTOM,
  DEMO_PRESET_IMAGING_WALL,
  DEMO_PRESET_MEMORY_WALL,
  DEMO_PRESET_ECONOMIC_WALL,
  applyImaging100xDemo
} from '@z-wbe/shared';
import { Sparkles, ArrowRight, Zap, AlertTriangle, Check, Layers } from 'lucide-react';

interface PresetSelectorProps {
  currentAssumptions: ScenarioAssumptions;
  onSelectPreset: (preset: ScenarioAssumptions) => void;
  onHeroDemoTrigger: (newAssumptions: ScenarioAssumptions) => void;
  onOneClickDemo?: () => void;
  bottleneckMovedBanner: boolean;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  currentAssumptions,
  onSelectPreset,
  onHeroDemoTrigger,
  onOneClickDemo,
  bottleneckMovedBanner
}) => {
  const scalePresets: Array<{
    id: ScaleId;
    label: string;
    description: string;
    preset: ScenarioAssumptions;
    warning?: string;
  }> = [
    {
      id: 'small-neural-system',
      label: 'Small Neural System',
      description: '302 neurons / 7.5k synapses',
      preset: PRESET_SMALL_NEURAL_SYSTEM
    },
    {
      id: 'drosophila',
      label: 'Drosophila-Scale',
      description: '140k neurons / 50M synapses',
      preset: PRESET_DROSOPHILA
    },
    {
      id: 'mouse-circuit',
      label: 'Mouse-Circuit Scale',
      description: '10M neurons / 10B synapses',
      preset: PRESET_MOUSE_CIRCUIT
    },
    {
      id: 'human-scale',
      label: 'Human-Scale Estimate',
      description: '86B neurons / 150T synapses',
      preset: PRESET_HUMAN_SCALE,
      warning: 'ESTIMATE / HYPOTHETICAL SCALE'
    },
    {
      id: 'custom',
      label: 'Custom Scenario',
      description: 'User-specified parameters',
      preset: PRESET_CUSTOM
    }
  ];

  const demoPresets = [
    {
      id: 'demo-imaging-wall',
      title: 'Preset 1: Imaging Wall',
      subtitle: 'Multi-beam scanning rate is dominant bottleneck',
      accentColor: 'border-l-blue-500',
      tag: 'Acquisition Dominant',
      preset: DEMO_PRESET_IMAGING_WALL
    },
    {
      id: 'demo-memory-wall',
      title: 'Preset 2: Memory Wall',
      subtitle: 'Imaging accelerated 100x; memory bus hits ceiling',
      accentColor: 'border-l-indigo-500',
      tag: 'Memory Dominant',
      preset: DEMO_PRESET_MEMORY_WALL
    },
    {
      id: 'demo-economic-wall',
      title: 'Preset 3: Economic Wall',
      subtitle: 'Compute is feasible, but proofreading & amortized cost dominate',
      accentColor: 'border-l-amber-500',
      tag: 'Cost Dominant',
      preset: DEMO_PRESET_ECONOMIC_WALL
    }
  ];

  const isCurrentPreset = (preset: ScenarioAssumptions) =>
    currentAssumptions.id === preset.id ||
    (preset.scaleId === 'custom' && currentAssumptions.scaleId === 'custom');

  return (
    <div id="tour-preset-selector" className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-card space-y-6">
      {/* Human Scale Warning Banner (Never display HUMAN WBE ACHIEVED!) */}
      {currentAssumptions.isHypotheticalHumanScale && (
        <div className="bg-amber-50/90 border border-amber-300/80 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xs uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  ESTIMATE / HYPOTHETICAL SCALE
                </span>
                <span className="text-[11px] font-semibold text-amber-800">
                  Epistemological Boundary
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-snug">
                Theoretical exploratory extrapolation. Human whole-brain emulation has not been achieved.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-mono text-amber-800 font-bold uppercase bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300">
            SCENARIO MODEL ONLY
          </span>
        </div>
      )}

      {/* Hero "Bottleneck Moved" Banner */}
      {bottleneckMovedBanner && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500 p-4 sm:p-5 rounded-xl flex items-center justify-between shadow-glow-emerald animate-pulse">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm text-emerald-950 uppercase tracking-wide">
                  THE BOTTLENECK MOVED!
                </span>
                <span className="text-[10px] font-mono font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  CONSTRAINT SHIFT DETECTED
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                100x imaging acceleration eliminated the acquisition bottleneck. The system has shifted to a downstream critical constraint. Click [ EXPLAIN WITH NEMOTRON ] below to analyze the shift.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono font-extrabold text-emerald-800 bg-emerald-100/90 px-3 py-1.5 rounded-lg border border-emerald-300">
            Δ SHIFT VERIFIED
          </span>
        </div>
      )}

      {/* Primary Scale Presets */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1. Biological Scale Benchmark
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            Active: <span className="font-bold text-slate-800">{currentAssumptions.name}</span>
          </span>
        </div>
        <div className="flex sm:grid sm:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto pb-1.5 sm:pb-0 snap-x snap-mandatory scrollbar-none">
          {scalePresets.map((scale) => {
            const active = isCurrentPreset(scale.preset);
            return (
              <button
                key={scale.id}
                onClick={() => onSelectPreset(scale.preset)}
                className={`min-w-[160px] sm:min-w-0 snap-start flex-1 text-left p-3 sm:p-4 rounded-xl border transition-all duration-150 relative cursor-pointer min-h-[44px] ${
                  active
                    ? 'border-blue-600 bg-blue-50/60 text-blue-950 shadow-xs ring-2 ring-blue-600/30'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-xs font-bold leading-snug ${active ? 'text-blue-950' : 'text-slate-800'}`}>
                    {scale.label}
                  </span>
                  {active && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-1">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono leading-tight">
                  {scale.description}
                </div>
                {scale.warning && (
                  <span className="inline-block mt-1.5 text-[9px] font-mono font-bold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-200">
                    {scale.warning}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Demo Presets & Hero Action */}
      <div className="border-t border-slate-100 pt-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Scenario Demonstrations & Empirical Stress Tests
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            SCENARIO MODELING — DETERMINISTIC EQUATIONS
          </span>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 gap-2.5 sm:gap-3 overflow-x-auto pb-1.5 sm:pb-0 snap-x snap-mandatory scrollbar-none">
          {demoPresets.map((demo) => {
            const active = isCurrentPreset(demo.preset);
            return (
              <button
                key={demo.id}
                onClick={() => onSelectPreset(demo.preset)}
                className={`min-w-[240px] sm:min-w-0 snap-start flex-1 p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer border-l-4 min-h-[44px] ${demo.accentColor} ${
                  active
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-600/30 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{demo.title}</span>
                  <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {demo.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                  {demo.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Hero Demo Question: Editorial Whitespace with subtle blue/indigo wash */}
        <div id="tour-hero-demo" className="relative overflow-hidden bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-sky-50/60 rounded-2xl p-5 sm:p-6 border border-blue-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider text-blue-800 font-extrabold bg-blue-100/90 px-2.5 py-0.5 rounded-full border border-blue-300 shadow-xs">
                <Sparkles className="w-3 h-3 text-blue-600 animate-pulse" />
                <span>Hero Demonstration</span>
              </span>
            </div>
            <p className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
              "What happens if imaging becomes 100x faster?"
            </p>
            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              Instantly accelerates acquisition rate 100x to test if the dominant constraint shifts to memory bandwidth, real-time compute, or proofreading costs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {onOneClickDemo && (
              <button
                onClick={onOneClickDemo}
                data-testid="hero-one-click-demo-button"
                className="flex items-center justify-center space-x-2 px-5 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:via-teal-500 hover:to-blue-500 text-white rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-150 shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                title="Accelerate imaging 100x and automatically generate grounded AI explanation in one click"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                <span>⚡ 1-Click Demo & Explain</span>
              </button>
            )}
            <button
              onClick={() => {
                const accelerated = applyImaging100xDemo(currentAssumptions);
                onHeroDemoTrigger(accelerated);
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-150 shadow-2xs hover:shadow cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              title="Shift parameters only without auto-running explanation"
            >
              <span>Shift Params Only</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


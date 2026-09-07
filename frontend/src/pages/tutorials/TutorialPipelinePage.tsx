import React, { useState, useMemo } from 'react';
import {
  GitMerge,
  Layers,
  ArrowRight,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertOctagon,
  ChevronRight,
  HelpCircle,
  BarChart3
} from 'lucide-react';
import { Tooltip } from '../../components/Tooltip';
import {
  PRESET_C_ELEGANS,
  PRESET_DROSOPHILA,
  PRESET_MOUSE_CIRCUIT,
  PRESET_HUMAN,
  calculateAllMetrics,
  calculateBottlenecks,
  formatBytes,
  formatComputeFlops,
  BottleneckDimension,
  getFriendlyBottleneck
} from '@z-wbe/shared';

interface StageDetail {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  inputs: string;
  outputs: string;
  primaryPhysics: string;
  criticalChallenge: string;
  color: string;
}

const STAGES: StageDetail[] = [
  {
    id: 'preservation',
    number: 1,
    name: 'Preservation',
    subtitle: 'Chemical Fixation & Vitrification',
    inputs: 'Live biological brain tissue (in vivo or immediate post-mortem)',
    outputs: 'Osmotically stable, heavy-metal stained resin block or vitrified specimen',
    primaryPhysics: 'Diffusion rates of aldehydes (glutaraldehyde, formaldehyde), osmium tetroxide penetrance',
    criticalChallenge: 'Ischemia artifacts, autolytic degradation, shrinkage distortion during dehydration',
    color: 'from-amber-500/20 to-orange-500/20 border-amber-300'
  },
  {
    id: 'acquisition',
    number: 2,
    name: 'Acquisition',
    subtitle: 'High-Throughput Electron Microscopy',
    inputs: 'Stained physical specimen slices or resin blocks',
    outputs: 'Raw high-contrast grayscale voxel tile stacks (4–8 nm voxel grid)',
    primaryPhysics: 'Secondary electron yield, beam current vs sample damage, shot noise limits',
    criticalChallenge: 'Continuous multi-year beam drift, diamond knife chatter, physical slice loss',
    color: 'from-blue-500/20 to-cyan-500/20 border-blue-300'
  },
  {
    id: 'reconstruction',
    number: 3,
    name: 'Reconstruction',
    subtitle: 'AI Computer Vision & Proofreading',
    inputs: 'Raw teravoxel/petavoxel image tiles',
    outputs: 'Segmented 3D cell boundaries, skeletonized neurites, detected synapses',
    primaryPhysics: 'Flood-filling networks (FFNs), multi-tile elastic mesh relaxation',
    criticalChallenge: 'Merges and splits in narrow unmyelinated axons, human proofreading labor scaling',
    color: 'from-indigo-500/20 to-purple-500/20 border-indigo-300'
  },
  {
    id: 'functionalization',
    number: 4,
    name: 'Functionalization',
    subtitle: 'Biophysical Parameter Assignment',
    inputs: 'Geometric wiring connectome (graph adjacency + morphology)',
    outputs: 'Annotated simulation graphs with neurotransmitter types, ion channel densities, conductances',
    primaryPhysics: 'Bayesian receptor assignment, electrophysiological parameter mapping',
    criticalChallenge: 'Inferring invisible molecular state (vesicle pool sizes, neuromodulator gradients) from static EM',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-300'
  },
  {
    id: 'execution',
    number: 5,
    name: 'Execution',
    subtitle: 'HPC Numerical Differential Integration',
    inputs: 'Functionalized neural network state vector at time t=0',
    outputs: 'Continuous biological membrane potentials, spike trains, neuromodulatory dynamics',
    primaryPhysics: 'Differential equation solvers (Runge-Kutta, Euler), sparse all-to-all spike routing',
    criticalChallenge: 'Memory bandwidth saturation (HBM3e), clock synchronization over optical interconnects',
    color: 'from-violet-500/20 to-fuchsia-500/20 border-violet-300'
  },
  {
    id: 'validation',
    number: 6,
    name: 'Validation',
    subtitle: 'Fidelity & Behavioral Grounding',
    inputs: 'Emulation state trajectories vs biological ground-truth recordings',
    outputs: 'Statistical divergence metrics, behavioral Turing tests, functional validity index',
    primaryPhysics: 'Multi-electrode array (MEA) statistical correlation, receptive field mapping',
    criticalChallenge: 'Chaotic divergence: infinitesimal initial state variances compound exponentially',
    color: 'from-rose-500/20 to-pink-500/20 border-rose-300'
  }
];

export const TutorialPipelinePage: React.FC = () => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(1); // Default to Acquisition
  const [selectedPresetKey, setSelectedPresetKey] = useState<'celegans' | 'drosophila' | 'mouse' | 'human'>('drosophila');

  const activePreset = useMemo(() => {
    switch (selectedPresetKey) {
      case 'celegans': return PRESET_C_ELEGANS;
      case 'drosophila': return PRESET_DROSOPHILA;
      case 'mouse': return PRESET_MOUSE_CIRCUIT;
      case 'human': return PRESET_HUMAN;
    }
  }, [selectedPresetKey]);

  // Compute metrics and bottlenecks using the shared deterministic physics engine
  const calculationResults = useMemo(() => {
    const metrics = calculateAllMetrics(activePreset);
    const bottlenecks = calculateBottlenecks(activePreset, metrics);
    return { metrics, bottlenecks };
  }, [activePreset]);

  const activeStage = STAGES[selectedStageIndex];
  const { dominantBottleneck, dominantScore, pressures } = calculationResults.bottlenecks;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-bold mb-2">
          <GitMerge className="w-4 h-4" />
          <span>Module 3 · Multi-Stage Pipeline & Physical Pressures</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          The 6 Pipeline Stages & 8-D Bottleneck Engine
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          WBE is an interdependent sequence of <strong>6 distinct physical and computational stages</strong>.
          The engine computes normalized pressure indices across <strong>8 physical resource axes</strong>:
          an emulation is feasible if and only if all 8 dimensions remain below critical saturation ($P \le 100\%$).
        </p>
      </div>

      {/* The 6-Stage Pipeline Interactive Ribbon */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
            Interactive Stage Inspector: Click Any Stage
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">
            Step {selectedStageIndex + 1} of 6
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STAGES.map((stage, idx) => {
            const isSelected = idx === selectedStageIndex;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageIndex(idx)}
                className={`p-3 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/30'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                      isSelected ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stage.number}
                  </span>
                  {isSelected && <ChevronRight className="w-4 h-4 text-white" />}
                </div>
                <div className="text-xs font-bold truncate">{stage.name}</div>
                <div className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {stage.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="text-xs font-mono text-blue-600 font-bold uppercase tracking-wider">
                Stage {activeStage.number} Deep Dive
              </div>
              <h3 className="text-base font-bold text-slate-900">
                {activeStage.name}: {activeStage.subtitle}
              </h3>
            </div>
            <Tooltip id={`stage_${activeStage.id}`}>
              <span className="text-xs text-blue-600 hover:underline cursor-help flex items-center space-x-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Stage Documentation</span>
              </span>
            </Tooltip>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Input Requirements</span>
              <p className="text-slate-800 leading-relaxed">{activeStage.inputs}</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 space-y-1">
              <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Generated Output</span>
              <p className="text-slate-800 leading-relaxed">{activeStage.outputs}</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-blue-200 space-y-1">
              <span className="font-bold text-blue-600 uppercase text-[10px] tracking-wider">Primary Governing Physics</span>
              <p className="text-slate-800 leading-relaxed">{activeStage.primaryPhysics}</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-rose-200 space-y-1">
              <span className="font-bold text-rose-600 uppercase text-[10px] tracking-wider">Critical Failure Mode</span>
              <p className="text-slate-800 leading-relaxed">{activeStage.criticalChallenge}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 8-D Bottleneck Engine Sandbox */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                8-Dimensional Pressure Engine Sandbox
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select an organism scale to watch how the 8 resource dimensions dynamically shift and exceed capacity.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'celegans', label: 'C. elegans' },
              { id: 'drosophila', label: 'Drosophila' },
              { id: 'mouse', label: 'Mouse Circuit' },
              { id: 'human', label: 'Whole Human' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPresetKey(p.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedPresetKey === p.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Bottleneck Alert Banner */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5">
            <AlertOctagon className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-900">
                Dominant Bottleneck for {activePreset.name}:
              </div>
              <div className="text-sm font-black text-amber-950">
                {getFriendlyBottleneck(dominantBottleneck).title} ({dominantBottleneck.replace('_', ' ')})
              </div>
            </div>
          </div>
          <div className="font-mono text-xs font-bold bg-white/80 px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900">
            Pressure Ratio: {(dominantScore / 100).toFixed(2)}× ({dominantScore.toFixed(0)}%)
          </div>
        </div>

        {/* 8-D Resource Dimension Bars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Physical Resource Dimension</span>
            <span>Demand / Allocated Capacity (Score %)</span>
          </div>

          <div className="space-y-2.5">
            {(Object.keys(pressures) as BottleneckDimension[]).map((dimKey) => {
              const dim = pressures[dimKey];
              const isBottleneck = dim.score > 100;
              const pressurePct = Math.min(dim.score, 100);

              return (
                <div
                  key={dimKey}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <Tooltip id={`dim_${dimKey.toLowerCase()}`}>
                      <span className="font-bold text-slate-800 hover:text-blue-600 cursor-help flex items-center space-x-1">
                        <span>{dimKey.replace('_', ' ')}</span>
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                      </span>
                    </Tooltip>
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-[11px] text-slate-500">
                        {dim.demandFormatted} / {dim.capacityFormatted}
                      </span>
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          isBottleneck
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {dim.score.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Progress Meter with 100% threshold */}
                  <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isBottleneck ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${pressurePct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

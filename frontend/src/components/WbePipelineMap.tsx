import React from 'react';
import { BottleneckResult, CalculatedMetrics } from '@z-wbe/shared';
import { ShieldCheck, Camera, Database, Cpu, Play, CheckCircle, AlertOctagon, ArrowDown } from 'lucide-react';

interface WbePipelineMapProps {
  bottleneck: BottleneckResult;
  metrics: CalculatedMetrics;
}

interface PipelineStage {
  id: string;
  stageNum: number;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  pressureScore: number;
  demandFormatted: string;
  capacityFormatted: string;
  isDominant: boolean;
  isSecond: boolean;
}

export const WbePipelineMap: React.FC<WbePipelineMapProps> = ({ bottleneck, metrics }) => {
  const p = bottleneck.pressures;

  // Map 8 dimensions to the 6 canonical WBE pipeline stages
  // Preservation: Biological stability (modeled with minimal fixed baseline ~15% unless acquisition takes >5 yrs)
  const preservationScore = Math.min(100, Math.max(10, metrics.acquisitionTimeYears > 5 ? 85 : 18));

  // Acquisition: maps to ACQUISITION pressure
  const acquisitionScore = p.ACQUISITION.score;

  // Reconstruction: maps to RECONSTRUCTION pressure
  const reconstructionScore = p.RECONSTRUCTION.score;

  // Functionalization: mapping structural connectivity to biophysical parameters (memory & model storage)
  const functionalizationScore = Math.max(p.STORAGE.score * 0.8, 25);

  // Execution: real-time emulation execution (max of COMPUTE, MEMORY_BANDWIDTH, INTERCONNECT, POWER)
  const executionScore = Math.max(
    p.COMPUTE.score,
    p.MEMORY_BANDWIDTH.score,
    p.INTERCONNECT.score,
    p.POWER.score
  );

  // Validation: physiological and behavioral verification against baseline benchmarks
  const validationScore = Math.min(100, Math.max(20, (p.COMPUTE.score + p.RECONSTRUCTION.score) * 0.25));

  const stages: PipelineStage[] = [
    {
      id: 'PRESERVATION',
      stageNum: 1,
      name: 'PRESERVATION',
      description: 'Chemical fixation, cryo-vitrification, structural preservation',
      icon: ShieldCheck,
      pressureScore: preservationScore,
      demandFormatted: metrics.acquisitionTimeYears > 5 ? 'High tissue degradation risk' : 'Cryo-stable state',
      capacityFormatted: 'Standard chemical fixation',
      isDominant: false,
      isSecond: false
    },
    {
      id: 'ACQUISITION',
      stageNum: 2,
      name: 'ACQUISITION',
      description: 'Multi-beam SEM / FIB-SEM volumetric scanning',
      icon: Camera,
      pressureScore: acquisitionScore,
      demandFormatted: p.ACQUISITION.demandFormatted,
      capacityFormatted: p.ACQUISITION.capacityFormatted,
      isDominant: bottleneck.dominantBottleneck === 'ACQUISITION',
      isSecond: bottleneck.secondBottleneck === 'ACQUISITION'
    },
    {
      id: 'RECONSTRUCTION',
      stageNum: 3,
      name: 'RECONSTRUCTION',
      description: 'Automated segmentation, synapse alignment, proofreading',
      icon: Database,
      pressureScore: reconstructionScore,
      demandFormatted: p.RECONSTRUCTION.demandFormatted,
      capacityFormatted: p.RECONSTRUCTION.capacityFormatted,
      isDominant: bottleneck.dominantBottleneck === 'RECONSTRUCTION',
      isSecond: bottleneck.secondBottleneck === 'RECONSTRUCTION'
    },
    {
      id: 'FUNCTIONALIZATION',
      stageNum: 4,
      name: 'FUNCTIONALIZATION',
      description: 'Channel inference, synaptic polarity, biophysical state mapping',
      icon: Cpu,
      pressureScore: functionalizationScore,
      demandFormatted: `Model: ${(metrics.modelStateBytes / 1e12).toFixed(2)} TB state`,
      capacityFormatted: 'Biophysical graph synthesis',
      isDominant: bottleneck.dominantBottleneck === 'STORAGE',
      isSecond: bottleneck.secondBottleneck === 'STORAGE'
    },
    {
      id: 'EXECUTION',
      stageNum: 5,
      name: 'EXECUTION',
      description: 'Real-time numerical simulation (compute, memory, power)',
      icon: Play,
      pressureScore: executionScore,
      demandFormatted: `${metrics.computeDemandPflops.toFixed(2)} PFLOPS / ${metrics.memoryTrafficTbS.toFixed(1)} TB/s`,
      capacityFormatted: `${metrics.totalPowerDemandMw.toFixed(2)} MW demand`,
      isDominant: ['COMPUTE', 'MEMORY_BANDWIDTH', 'INTERCONNECT', 'POWER'].includes(bottleneck.dominantBottleneck),
      isSecond: ['COMPUTE', 'MEMORY_BANDWIDTH', 'INTERCONNECT', 'POWER'].includes(bottleneck.secondBottleneck)
    },
    {
      id: 'VALIDATION',
      stageNum: 6,
      name: 'VALIDATION',
      description: 'Electrophysiological fidelity, behavioral replication',
      icon: CheckCircle,
      pressureScore: validationScore,
      demandFormatted: 'Statistical spike covariance',
      capacityFormatted: 'Electrode ground truth',
      isDominant: false,
      isSecond: false
    }
  ];

  const getSeverity = (score: number) => {
    if (score >= 70) {
      return {
        label: 'CRITICAL',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        bar: 'bg-gradient-to-r from-amber-500 to-rose-600',
        text: 'text-rose-600',
        iconBg: 'bg-rose-100 text-rose-700'
      };
    }
    if (score >= 40) {
      return {
        label: 'MODERATE',
        bg: 'bg-amber-50 text-amber-800 border-amber-200',
        bar: 'bg-gradient-to-r from-emerald-500 to-amber-500',
        text: 'text-amber-600',
        iconBg: 'bg-amber-100 text-amber-800'
      };
    }
    return {
      label: 'FEASIBLE',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bar: 'bg-emerald-500',
      text: 'text-emerald-600',
      iconBg: 'bg-emerald-100 text-emerald-700'
    };
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
            <span>WBE End-to-End Pipeline</span>
          </h2>
          <p className="text-[11px] text-slate-500">
            6 canonical technical stages. Stage with active constraint ceiling is highlighted.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
          <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>&lt;40% Feasible</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 shadow-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>40-70% Load</span>
          </span>
          <span className="flex items-center space-x-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shadow-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>&gt;70% Ceiling</span>
          </span>
        </div>
      </div>

      {/* Pipeline Stages Vertical Flow */}
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const sev = getSeverity(stage.pressureScore);
          return (
            <div key={stage.id} className="relative">
              <div
                className={`p-4 rounded-xl border transition-all duration-200 relative ${
                  stage.isDominant
                    ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/30 shadow-md'
                    : stage.isSecond
                    ? 'border-amber-400/90 bg-amber-50/25 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
                }`}
              >
                {stage.isDominant && (
                  <div className="absolute -top-3 right-4 bg-rose-600 text-white font-mono text-[9px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center space-x-1 animate-pulse ring-2 ring-white">
                    <AlertOctagon className="w-3 h-3" />
                    <span>#1 DOMINANT BOTTLENECK</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs ${
                        stage.isDominant
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 border border-slate-200/80'
                      }`}
                    >
                      {stage.stageNum}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-slate-900 tracking-tight">
                          {stage.name}
                        </span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${sev.bg}`}>
                          {sev.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <div className={`font-mono font-black text-sm tracking-tight ${stage.isDominant ? 'text-rose-600 font-extrabold' : 'text-slate-900'}`}>
                      {stage.pressureScore > 999 ? '>999%' : `${stage.pressureScore.toFixed(1)}%`}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono uppercase font-semibold">pressure</div>
                  </div>
                </div>

                {/* Pressure progress bar */}
                <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${sev.bar}`}
                    style={{ width: `${Math.min(100, Math.max(4, stage.pressureScore))}%` }}
                  ></div>
                </div>

                {/* Demand vs Capacity context chips */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-slate-500 font-mono">
                  <span className="bg-slate-50/90 px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-xs">
                    Demand: <strong className="text-slate-800 font-semibold">{stage.demandFormatted}</strong>
                  </span>
                  <span className="bg-slate-50/90 px-2.5 py-1 rounded-lg border border-slate-200/90 shadow-xs">
                    Basis: <strong className="text-slate-800 font-semibold">{stage.capacityFormatted}</strong>
                  </span>
                </div>
              </div>

              {/* Connecting Flow Arrow */}
              {idx < stages.length - 1 && (
                <div className="flex justify-center -my-1.5 relative z-10 pointer-events-none">
                  <div className="w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center text-[10px] shadow-xs">
                    <ArrowDown className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


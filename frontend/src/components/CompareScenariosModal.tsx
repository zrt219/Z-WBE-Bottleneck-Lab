import React from 'react';
import {
  ScenarioAssumptions,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis
} from '@z-wbe/shared';
import { GitCompare, X, TrendingUp, TrendingDown, Minus, Check } from 'lucide-react';

interface CompareScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseline: ScenarioAssumptions;
  modified: ScenarioAssumptions;
  onApplyModifiedAsBaseline?: () => void;
}

export const CompareScenariosModal: React.FC<CompareScenariosModalProps> = ({
  isOpen,
  onClose,
  baseline,
  modified,
  onApplyModifiedAsBaseline
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const mBase = calculateAllMetrics(baseline);
  const bBase = calculateBottlenecks(baseline, mBase);
  const sBase = runSensitivityAnalysis(baseline);

  const mMod = calculateAllMetrics(modified);
  const bMod = calculateBottlenecks(modified, mMod);
  const sMod = runSensitivityAnalysis(modified);

  const formatDelta = (valBase: number, valMod: number, unit: string = '', lowerIsBetter = true) => {
    const diff = valMod - valBase;
    if (Math.abs(diff) < 0.0001) {
      return (
        <span className="flex items-center text-slate-400 font-mono text-xs">
          <Minus className="w-3 h-3 mr-1" /> No change
        </span>
      );
    }
    const percent = valBase !== 0 ? (diff / valBase) * 100 : 0;
    const isGood = lowerIsBetter ? diff < 0 : diff > 0;

    return (
      <span
        className={`flex items-center font-mono text-xs font-bold ${
          isGood ? 'text-emerald-700' : 'text-rose-600'
        }`}
      >
        {isGood ? <TrendingDown className="w-3.5 h-3.5 mr-0.5" /> : <TrendingUp className="w-3.5 h-3.5 mr-0.5" />}
        <span>{diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)} {unit}</span>
        <span className="text-[10px] ml-1 opacity-80">({percent > 0 ? `+${percent.toFixed(0)}%` : `${percent.toFixed(0)}%`})</span>
      </span>
    );
  };

  const rows = [
    {
      metric: 'Acquisition Time',
      base: `${mBase.acquisitionTimeYears.toFixed(2)} yrs`,
      mod: `${mMod.acquisitionTimeYears.toFixed(2)} yrs`,
      delta: formatDelta(mBase.acquisitionTimeYears, mMod.acquisitionTimeYears, 'yrs', true)
    },
    {
      metric: 'Raw Image Data',
      base: `${(mBase.rawDataBytes / 1e12).toFixed(2)} TB`,
      mod: `${(mMod.rawDataBytes / 1e12).toFixed(2)} TB`,
      delta: formatDelta(mBase.rawDataBytes / 1e12, mMod.rawDataBytes / 1e12, 'TB', true)
    },
    {
      metric: 'Model State Storage',
      base: `${(mBase.modelStateBytes / 1e12).toFixed(2)} TB`,
      mod: `${(mMod.modelStateBytes / 1e12).toFixed(2)} TB`,
      delta: formatDelta(mBase.modelStateBytes / 1e12, mMod.modelStateBytes / 1e12, 'TB', true)
    },
    {
      metric: 'Real-time Compute',
      base: `${mBase.computeDemandPflops.toFixed(2)} PFLOPS`,
      mod: `${mMod.computeDemandPflops.toFixed(2)} PFLOPS`,
      delta: formatDelta(mBase.computeDemandPflops, mMod.computeDemandPflops, 'PFLOPS', true)
    },
    {
      metric: 'Memory Bandwidth',
      base: `${mBase.memoryTrafficTbS.toFixed(2)} TB/s`,
      mod: `${mMod.memoryTrafficTbS.toFixed(2)} TB/s`,
      delta: formatDelta(mBase.memoryTrafficTbS, mMod.memoryTrafficTbS, 'TB/s', true)
    },
    {
      metric: 'Power Demand',
      base: `${mBase.totalPowerDemandMw.toFixed(2)} MW`,
      mod: `${mMod.totalPowerDemandMw.toFixed(2)} MW`,
      delta: formatDelta(mBase.totalPowerDemandMw, mMod.totalPowerDemandMw, 'MW', true)
    },
    {
      metric: 'Total Estimated Cost',
      base: `$${(mBase.totalEstimatedCostUsd / 1e6).toFixed(2)}M`,
      mod: `$${(mMod.totalEstimatedCostUsd / 1e6).toFixed(2)}M`,
      delta: formatDelta(mBase.totalEstimatedCostUsd / 1e6, mMod.totalEstimatedCostUsd / 1e6, '$M', true)
    },
    {
      metric: 'Dominant Bottleneck',
      base: `${bBase.dominantBottleneck} (${bBase.dominantScore.toFixed(0)}%)`,
      mod: `${bMod.dominantBottleneck} (${bMod.dominantScore.toFixed(0)}%)`,
      delta: bBase.dominantBottleneck !== bMod.dominantBottleneck ? (
        <span className="font-mono text-xs font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
          SHIFTED TO {bMod.dominantBottleneck}
        </span>
      ) : (
        formatDelta(bBase.dominantScore, bMod.dominantScore, 'pts', true)
      )
    },
    {
      metric: 'Highest Leverage Assumption',
      base: sBase.highestLeverageAssumption.variableLabel,
      mod: sMod.highestLeverageAssumption.variableLabel,
      delta: (
        <span className="text-[11px] text-slate-700 font-semibold font-sans">
          {sMod.highestLeverageAssumption.variableLabel}
        </span>
      )
    }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Scenario Comparison Mode
              </h2>
              <p className="text-xs text-slate-500">
                Side-by-side evaluation of baseline parameters vs modified scenario.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                BASELINE SCENARIO
              </span>
              <div className="font-extrabold text-sm text-slate-900 mt-0.5">{baseline.name}</div>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold">
                MODIFIED SCENARIO
              </span>
              <div className="font-extrabold text-sm text-blue-950 mt-0.5">{modified.name}</div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full min-w-[520px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 bg-slate-50/80">
                  <th className="py-2.5 px-3">Metric / Stage</th>
                  <th className="py-2.5 px-3">Baseline</th>
                  <th className="py-2.5 px-3">Modified</th>
                  <th className="py-2.5 px-3">Variance / Shift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-sans font-bold text-slate-800">
                      {row.metric}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{row.base}</td>
                    <td className="py-3 px-3 text-slate-900 font-black">{row.mod}</td>
                    <td className="py-3 px-3">{row.delta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-mono">
            Calculations strictly evaluate deterministic scaling equations.
          </span>
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
            >
              Close
            </button>
            {onApplyModifiedAsBaseline && (
              <button
                onClick={() => {
                  onApplyModifiedAsBaseline();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors shadow-glow-blue cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Set Modified as New Baseline</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


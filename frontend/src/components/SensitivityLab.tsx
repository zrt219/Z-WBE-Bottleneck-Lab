import React from 'react';
import { SensitivityAnalysisResult } from '@z-wbe/shared';
import { Target, TrendingUp, Activity } from 'lucide-react';

interface SensitivityLabProps {
  sensitivity: SensitivityAnalysisResult;
}

export const SensitivityLab: React.FC<SensitivityLabProps> = ({ sensitivity }) => {
  const highest = sensitivity.highestLeverageAssumption;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Sensitivity & Leverage Analysis
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">Local Perturbation & Elasticity Gradient</p>
          </div>
        </div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
          CALCULATED FROM SCENARIO ASSUMPTIONS
        </span>
      </div>

      {/* Highest Leverage Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-blue-50/70 border border-blue-200/90 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-wider text-blue-950">
              HIGHEST LEVERAGE ASSUMPTION: {highest.variableLabel.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] font-mono font-black text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-300 shadow-xs shrink-0 self-start sm:self-auto">
            LEVERAGE SCORE: {highest.leverageScore.toFixed(1)}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          {sensitivity.takeaway}
        </p>

        <div className="pt-1.5 flex flex-wrap gap-2.5 text-[11px] font-mono">
          <div className="bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center space-x-1.5">
            <span className="text-slate-400 font-semibold">0.5x:</span>
            <span className="font-bold text-slate-800">{highest.perturbations['0.5x'].bottleneckScore.toFixed(1)}%</span>
            <span className="text-[9px] text-slate-400">({highest.perturbations['0.5x'].dominantBottleneck})</span>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-lg border border-blue-400/80 ring-2 ring-blue-500/20 shadow-xs flex items-center space-x-1.5">
            <span className="text-blue-700 font-bold">1.0x (Base):</span>
            <span className="font-black text-blue-950">{highest.perturbations['1x'].bottleneckScore.toFixed(1)}%</span>
            <span className="text-[9px] text-blue-600 font-medium">({highest.perturbations['1x'].dominantBottleneck})</span>
          </div>
          <div className="bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center space-x-1.5">
            <span className="text-slate-400 font-semibold">2.0x:</span>
            <span className="font-bold text-slate-800">{highest.perturbations['2x'].bottleneckScore.toFixed(1)}%</span>
            <span className="text-[9px] text-slate-400">({highest.perturbations['2x'].dominantBottleneck})</span>
          </div>
          <div className="bg-emerald-50 px-3.5 py-1.5 rounded-lg border border-emerald-300 shadow-xs flex items-center space-x-1.5">
            <span className="text-emerald-700 font-bold">10x:</span>
            <span className="font-black text-emerald-900">{highest.perturbations['10x'].bottleneckScore.toFixed(1)}%</span>
            <span className="text-[9px] text-emerald-700 font-semibold">({highest.perturbations['10x'].dominantBottleneck})</span>
          </div>
        </div>
      </div>

      {/* Perturbations Table across all tested variables */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-slate-500" />
            <span>Local Perturbation Response Matrix (0.5x → 10x)</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Ranked by Elasticity Delta
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200/90 rounded-xl shadow-xs">
          <table className="w-full min-w-[580px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] font-mono uppercase text-slate-500 bg-slate-50">
                <th className="py-3 px-3.5 font-bold">Variable</th>
                <th className="py-3 px-2 font-bold">Category</th>
                <th className="py-3 px-2 text-right font-bold">Base Value</th>
                <th className="py-3 px-2 text-center font-bold">0.5x</th>
                <th className="py-3 px-2 text-center font-bold">2x</th>
                <th className="py-3 px-2 text-center font-bold">10x</th>
                <th className="py-3 px-3.5 text-right font-bold">Leverage Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {sensitivity.variables.map((v) => {
                return (
                  <tr
                    key={v.variableKey}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      v.isHighestLeverage ? 'bg-blue-50/35 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3.5 text-slate-900 font-sans flex items-center space-x-2">
                      {v.isHighestLeverage && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                      )}
                      <span className={v.isHighestLeverage ? 'font-bold text-blue-950' : 'font-medium'}>
                        {v.variableLabel}
                      </span>
                    </td>
                    <td className="py-2.5 px-2 text-slate-500 uppercase text-[9px] font-bold">
                      {v.variableCategory}
                    </td>
                    <td className="py-2.5 px-2 text-right text-slate-700">
                      {v.baselineValue > 1000 ? v.baselineValue.toLocaleString() : v.baselineValue} <span className="text-slate-400 text-[10px]">{v.unit}</span>
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600">
                      {v.perturbations['0.5x'].bottleneckScore.toFixed(0)}%
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-600">
                      {v.perturbations['2x'].bottleneckScore.toFixed(0)}%
                    </td>
                    <td className="py-2.5 px-2 text-center text-slate-900 font-bold">
                      {v.perturbations['10x'].bottleneckScore.toFixed(0)}%
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2.5">
                        <span className={v.isHighestLeverage ? 'text-blue-700 font-black' : 'text-slate-700 font-semibold'}>
                          {v.leverageScore.toFixed(1)}
                        </span>
                        <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block border border-slate-200/70">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              v.isHighestLeverage
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                : 'bg-slate-400'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(8, (v.leverageScore / Math.max(1, highest.leverageScore)) * 100))}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


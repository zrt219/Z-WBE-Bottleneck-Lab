import React, { useEffect, useState } from 'react';
import { GpuSweepSummaryData } from '@z-wbe/shared';
import { Cpu, AlertCircle, BarChart3, RefreshCw, ArrowRight } from 'lucide-react';

export const GpuExplorationMap: React.FC = () => {
  const [data, setData] = useState<GpuSweepSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSweepData();
  }, []);

  const fetchSweepData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/sweep-summary');
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      console.warn('Could not fetch sweep summary from API, attempting local fallback:', err);
      try {
        const localRes = await fetch('/data/gpu-sweep-summary.json');
        if (localRes.ok) {
          const localJson = await localRes.json();
          setData(localJson);
          return;
        }
      } catch {
        // ignore
      }
      setError('Could not load sweep summary. Please run notebooks/gpu_scenario_sweep.ipynb or generation script.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-card text-center space-y-2">
        <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mx-auto" />
        <span className="text-xs text-slate-500 font-mono">Loading GPU Parameter Exploration Map...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-card text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
        <div className="text-sm font-bold text-slate-800">GPU Exploration Map Pending</div>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">{error}</p>
      </div>
    );
  }

  const b = data.benchmark;
  const isGpuExecuted = b.status === 'GPU_ACCELERATED' && b.runtimeGpuSeconds !== null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                GPU Parameter Exploration Map (100,000 Sweeps)
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                RAPIDS / cuDF
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Monte Carlo sensitivity space across imaging, reconstruction, compute, memory, and cost.
            </p>
          </div>
        </div>

        {/* Benchmark Execution Badge */}
        <div>
          {isGpuExecuted ? (
            <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold">NVIDIA GPU Accelerated ({b.speedup?.toFixed(1)}x Speedup)</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs">
              <AlertCircle className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-bold text-[11px]">GPU BENCHMARK NOT EXECUTED</span>
            </div>
          )}
        </div>
      </div>

      {/* Benchmark details strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Combinations</span>
          <div className="font-black text-slate-900 mt-0.5 text-sm">
            {data.sweepCombinationsCount.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">CPU pandas Runtime</span>
          <div className="font-bold text-slate-900 mt-0.5 text-sm">
            {b.runtimeCpuSeconds ? `${b.runtimeCpuSeconds.toFixed(2)}s` : 'N/A'}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">cuDF GPU Runtime</span>
          <div className="font-bold text-emerald-700 mt-0.5 text-sm">
            {b.runtimeGpuSeconds ? `${b.runtimeGpuSeconds.toFixed(2)}s` : 'N/A'}
          </div>
        </div>
        <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 shadow-xs">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Acceleration Factor</span>
          <div className="font-black text-blue-700 mt-0.5 text-sm">
            {b.speedup ? `${b.speedup.toFixed(1)}x speedup` : 'CPU Only'}
          </div>
        </div>
      </div>

      {/* Bottleneck Frequency Distribution */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Dominant Bottleneck Distribution Across 100,000 Parameter Sweeps</span>
          </span>
          <span className="font-mono text-slate-400 text-[10px]">Monte Carlo Density</span>
        </div>

        <div className="space-y-2 bg-slate-50/70 p-4 rounded-xl border border-slate-200/90 shadow-xs">
          {Object.entries(data.bottleneckFrequencies).map(([dim, count]) => {
            const percent = (count / data.sweepCombinationsCount) * 100;
            return (
              <div key={dim} className="flex items-center space-x-2 sm:space-x-3 text-[11px] font-mono">
                <span className="w-28 sm:w-40 shrink-0 truncate text-slate-800 font-sans text-xs font-bold">
                  {dim.replace('_', ' ')}
                </span>
                <div className="flex-1 bg-slate-200/90 h-2.5 rounded-full overflow-hidden border border-slate-200/60">
                  <div
                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 h-full rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <span className="w-14 sm:w-16 text-right font-black text-slate-900 shrink-0">
                  {percent.toFixed(1)}%
                </span>
                <span className="hidden sm:inline w-24 text-right text-slate-400 text-[10px] shrink-0">
                  ({count.toLocaleString()})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transition Regions & Correlations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
        {/* Transition Regions */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Phase Transition Regions
          </span>
          <div className="space-y-2">
            {data.transitionRegions.map((tr, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50/90 border border-slate-200/90 text-xs shadow-xs">
                <div className="flex items-center justify-between font-mono font-bold text-[11px] text-slate-900 mb-1">
                  <span className="flex items-center space-x-1">
                    <span>{tr.fromBottleneck}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-indigo-700">{tr.toBottleneck}</span>
                  </span>
                  <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{tr.thresholdValue}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug font-sans">{tr.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Correlations */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Parameter Sensitivity Correlations
          </span>
          <div className="space-y-2">
            {data.correlations.map((corr, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-between text-xs font-mono shadow-xs"
              >
                <div className="min-w-0 mr-2">
                  <span className="font-sans font-bold text-slate-900 block text-[11px]">
                    {corr.parameter}
                  </span>
                  <span className="text-[10px] text-slate-500 font-sans">
                    Relieves {corr.dominantBottleneckAssociation}
                  </span>
                </div>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                  r = {corr.correlationCoefficient.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


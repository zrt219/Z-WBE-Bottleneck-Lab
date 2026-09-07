import React from 'react';
import { BottleneckResult } from '@z-wbe/shared';
import { AlertTriangle, Sparkles, Loader2, ShieldCheck, ArrowUpRight, Info, Zap } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { BOTTLENECK_DIMENSION_TOOLTIPS } from '../data/tooltipData';

interface DominantBottleneckCardProps {
  bottleneck: BottleneckResult;
  onExplainClick: () => void;
  isLoadingExplanation: boolean;
  hasInterpretation?: boolean;
  onScrollToInterpretation?: () => void;
  onOneClickDemo?: () => void;
}

export const DominantBottleneckCard: React.FC<DominantBottleneckCardProps> = ({
  bottleneck,
  onExplainClick,
  isLoadingExplanation,
  hasInterpretation = false,
  onScrollToInterpretation,
  onOneClickDemo
}) => {
  const dominant = bottleneck.dominantBottleneck;
  const second = bottleneck.secondBottleneck;
  const dominantPressure = bottleneck.pressures[dominant];
  const secondPressure = bottleneck.pressures[second];

  const formatBottleneckName = (dim: string) => {
    return dim.replace('_', ' ');
  };

  return (
    <div id="tour-bottleneck-card" className="h-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Dominant Bottleneck
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">Dynamic Critical Ceiling</p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0 whitespace-nowrap">
            CALCULATED FROM SCENARIO ASSUMPTIONS
          </span>
        </div>

        {/* Primary Bottleneck Callout */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-rose-50/80 via-rose-50/30 to-white border border-rose-200/90 shadow-xs space-y-3 relative">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-extrabold text-rose-700 uppercase tracking-wide bg-rose-100 px-2.5 py-0.5 rounded-full border border-rose-300 shadow-xs shrink-0 whitespace-nowrap">
              #1 Limiting Constraint
            </span>
            <span className="font-mono font-black text-lg sm:text-xl text-rose-600 tracking-tight shrink-0 whitespace-nowrap">
              {dominantPressure.score > 999 ? '>999%' : `${dominantPressure.score.toFixed(1)}%`}
            </span>
          </div>

          <div className="text-base font-extrabold text-slate-900 tracking-tight">
            <Tooltip info={BOTTLENECK_DIMENSION_TOOLTIPS[dominant]}>
              <span className="cursor-help border-b border-dotted border-slate-400 hover:text-blue-600 transition-colors inline-flex items-center space-x-1">
                <span>{formatBottleneckName(dominant)}</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </span>
            </Tooltip>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-sans">
            {dominantPressure.summary}
          </p>

          <div className="text-[10px] font-mono text-rose-950 bg-rose-100/70 p-3 rounded-lg border border-rose-200 space-y-1 shadow-xs">
            <div><strong className="text-rose-900">Demand:</strong> {dominantPressure.demandFormatted}</div>
            <div><strong className="text-rose-900">Ceiling:</strong> {dominantPressure.capacityFormatted}</div>
          </div>
        </div>

        {/* Secondary Bottleneck & Separation Margin */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3 shadow-xs">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-1 text-xs">
            <span className="font-medium text-slate-500 shrink-0">Secondary Bottleneck:</span>
            <Tooltip info={BOTTLENECK_DIMENSION_TOOLTIPS[second]}>
              <span className="font-bold text-slate-800 font-mono text-left xl:text-right cursor-help border-b border-dotted border-slate-300 hover:text-blue-600 transition-colors inline-flex items-center space-x-1">
                <span>{formatBottleneckName(second)}</span>
                <span className="text-slate-500 font-normal">({secondPressure.score.toFixed(1)}%)</span>
                <Info className="w-3 h-3 text-slate-400" />
              </span>
            </Tooltip>
          </div>
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium text-slate-500">Separation Margin:</span>
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 text-[11px] shadow-xs shrink-0">
              +{bottleneck.margin.toFixed(1)} pts
            </span>
          </div>

          {/* Margin bar visualization */}
          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden border border-slate-200/60">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.max(5, (bottleneck.margin / Math.max(1, dominantPressure.score)) * 100))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Action Button: EXPLAIN THIS SCENARIO */}
      <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
        <button
          id="tour-explain-button"
          onClick={onExplainClick}
          disabled={isLoadingExplanation}
          data-testid="explain-scenario-button"
          aria-label="Explain this scenario"
          title="Explain this scenario"
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 hover:from-slate-700 hover:to-slate-900 border border-slate-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all duration-150 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
        >
          {isLoadingExplanation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Reasoning with Nemotron 3 Super...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>EXPLAIN THIS SCENARIO</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </>
          )}
        </button>

        {hasInterpretation && onScrollToInterpretation && (
          <button
            onClick={onScrollToInterpretation}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100/80 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-900 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs hover:shadow hover:-translate-y-0.5 active:translate-y-0.5"
          >
            <span>✓ Interpretation generated • View Analysis ↓</span>
          </button>
        )}

        {onOneClickDemo && (
          <button
            onClick={onOneClickDemo}
            disabled={isLoadingExplanation}
            data-testid="card-one-click-demo-button"
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-b from-emerald-50 to-teal-100/90 hover:from-emerald-100 hover:to-teal-200/90 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50"
            title="1-Click Demo: Accelerate imaging 100x & immediately run grounded AI interpretation"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 shrink-0" />
            <span>⚡ 1-Click Demo (100x Shift)</span>
          </button>
        )}

        <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strictly grounded in deterministic outputs.</span>
        </div>
      </div>
    </div>
  );
};


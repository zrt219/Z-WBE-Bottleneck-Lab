import React from 'react';
import { motion } from 'framer-motion';
import { BottleneckResult, getFriendlyBottleneck } from '@z-wbe/shared';
import { AlertTriangle, Sparkles, Loader2, ShieldCheck, ArrowUpRight, Info, Zap, Check } from 'lucide-react';
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
  const isBioAcquisition = dominant === 'ACQUISITION' || dominant === 'RECONSTRUCTION';

  const formatBottleneckName = (dim: string) => {
    return getFriendlyBottleneck(dim).label;
  };

  return (
    <div id="tour-bottleneck-card" className="h-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col justify-between space-y-4 sm:space-y-5">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3.5 min-h-[52px]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Dominant Bottleneck
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">Dynamic Critical Ceiling</p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0 whitespace-nowrap shadow-xs">
            <span className="hidden xl:inline">CALCULATED FROM SCENARIO ASSUMPTIONS</span>
            <span className="xl:hidden">CALCULATED</span>
          </span>
        </div>

        {/* Primary Bottleneck Callout */}
        <div className={`p-4 sm:p-5 rounded-xl border-2 space-y-3 relative shadow-xs transition-colors ${
          dominantPressure.score > 100
            ? 'border-rose-500 bg-gradient-to-b from-rose-50/80 to-rose-50/20'
            : 'border-emerald-500 bg-gradient-to-b from-emerald-50/80 to-emerald-50/20'
        }`}>
          <div className="flex items-center justify-between">
            <span
              className={`text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full border ${
                dominantPressure.score > 100
                  ? 'text-rose-700 bg-rose-100/90 border-rose-200'
                  : 'text-emerald-700 bg-emerald-100/90 border-emerald-200'
              }`}
            >
              {dominantPressure.score > 100 ? 'Constraint Violation Active' : 'All Constraints Feasible'}
            </span>
            <span
              className={`font-mono font-black text-lg sm:text-xl tracking-tight shrink-0 whitespace-nowrap opacity-100 ${
                dominantPressure.score > 100 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {dominantPressure.score > 999 ? '>999%' : `${dominantPressure.score.toFixed(1)}%`}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-white shadow-2xs">
              #1 DOMINANT CONSTRAINT
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

          <div className={`text-[10px] font-mono p-3 rounded-lg border space-y-1 shadow-xs ${
            dominantPressure.score > 100
              ? 'text-rose-950 bg-rose-100/70 border-rose-200'
              : 'text-emerald-950 bg-emerald-100/70 border-emerald-200'
          }`}>
            <div><strong>Demand:</strong> {dominantPressure.demandFormatted}</div>
            <div><strong>Ceiling:</strong> {dominantPressure.capacityFormatted}</div>
          </div>
        </div>

        {/* Secondary Bottleneck & Separation Margin */}
        <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3 shadow-xs">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-1 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                #2 SECONDARY
              </span>
              <span className="font-medium text-slate-500 shrink-0">Constraint:</span>
            </div>
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

          {/* Margin bar visualization with Framer Motion spring */}
          <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden border border-slate-200/60">
            <motion.div
              className="bg-blue-600 h-full rounded-full"
              initial={false}
              animate={{ width: `${Math.min(100, Math.max(5, (bottleneck.margin / Math.max(1, dominantPressure.score)) * 100))}%` }}
              transition={{ type: 'spring', damping: 22, stiffness: 140 }}
            />
          </div>
        </div>

        {/* System Pressure Hierarchy & Physical Regime */}
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] font-mono">
              Governing Regime
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
              isBioAcquisition
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              {isBioAcquisition ? 'Biological Acquisition Bound' : 'Exascale Hardware Bound'}
            </span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            <div className="text-[10px] font-mono text-slate-500 flex items-center justify-between">
              <span>8-Dimension Resource Pressures:</span>
              <span className="text-slate-400 font-normal">Score %</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {(Object.keys(bottleneck.pressures) as Array<keyof typeof bottleneck.pressures>).map((dimKey) => {
                const isDom = dimKey === dominant;
                const pItem = bottleneck.pressures[dimKey];
                const score = pItem.score;

                const badgeStyle = score > 100
                  ? 'bg-rose-100/90 border-rose-300 text-rose-900 font-bold'
                  : score >= 80
                  ? 'bg-amber-100/80 border-amber-300 text-amber-900 font-semibold'
                  : isDom
                  ? 'bg-blue-100/90 border-blue-300 text-blue-900 font-bold'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-800';

                return (
                  <div
                    key={dimKey}
                    className={`p-1.5 rounded-lg border text-center font-mono transition-all ${badgeStyle}`}
                    title={`${formatBottleneckName(dimKey)}: ${pItem.score.toFixed(1)}% (${pItem.demandFormatted} / ${pItem.capacityFormatted})`}
                  >
                    <div className="text-[8px] uppercase truncate tracking-tight">
                      {dimKey.replace('_', ' ').slice(0, 6)}
                    </div>
                    <div className="text-[10px] font-bold">
                      {pItem.score > 999 ? '>999' : `${pItem.score.toFixed(0)}%`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Standardized uniform height (h-12), generous padding (px-4 py-3), font weights, and tactile spring physics */}
      <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
        <motion.button
          id="tour-explain-button"
          onClick={onExplainClick}
          disabled={isLoadingExplanation}
          data-testid="explain-scenario-button"
          aria-label="Explain with Nemotron"
          title="Explain with Nemotron"
          whileHover={{ scale: isLoadingExplanation ? 1 : 1.02 }}
          whileTap={{ scale: isLoadingExplanation ? 1 : 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="w-full h-12 py-3 px-4 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 hover:from-slate-700 hover:to-slate-900 border border-slate-700 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer select-none whitespace-nowrap"
        >
          {isLoadingExplanation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
              <span>Reasoning with Nemotron 3...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>EXPLAIN WITH NEMOTRON</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
            </>
          )}
        </motion.button>

        {hasInterpretation && onScrollToInterpretation && (
          <motion.button
            onClick={onScrollToInterpretation}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-full h-12 py-3 px-4 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100/80 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-900 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:shadow select-none whitespace-nowrap"
          >
            <Check className="w-4 h-4 text-blue-600 shrink-0" />
            <span>View Generated Analysis ↓</span>
          </motion.button>
        )}

        {onOneClickDemo && (
          <motion.button
            onClick={onOneClickDemo}
            disabled={isLoadingExplanation}
            data-testid="card-one-click-demo-button"
            whileHover={{ scale: isLoadingExplanation ? 1 : 1.02 }}
            whileTap={{ scale: isLoadingExplanation ? 1 : 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-full h-12 py-3 px-4 rounded-xl bg-gradient-to-b from-emerald-50 to-teal-100/90 hover:from-emerald-100 hover:to-teal-200/90 border border-emerald-300 text-emerald-950 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow-sm hover:shadow disabled:opacity-50 select-none whitespace-nowrap"
            title="1-Click Demo: Accelerate imaging 100x & immediately run grounded AI interpretation"
          >
            <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600 shrink-0" />
            <span>⚡ 1-Click Demo (100x Shift)</span>
          </motion.button>
        )}

        <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Strictly grounded in deterministic outputs.</span>
        </div>
      </div>
    </div>
  );
};


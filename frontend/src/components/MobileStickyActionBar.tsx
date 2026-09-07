import React from 'react';
import { Zap, Sparkles, Loader2, ArrowUp, AlertTriangle } from 'lucide-react';

interface MobileStickyActionBarProps {
  dominantBottleneck: string;
  dominantScore: number;
  isLoadingExplanation: boolean;
  hasInterpretation: boolean;
  onOneClickDemo: () => void;
  onExplainClick: () => void;
  onScrollToBottleneck?: () => void;
  onScrollToInterpretation?: () => void;
}

export const MobileStickyActionBar: React.FC<MobileStickyActionBarProps> = ({
  dominantBottleneck,
  dominantScore,
  isLoadingExplanation,
  hasInterpretation,
  onOneClickDemo,
  onExplainClick,
  onScrollToBottleneck,
  onScrollToInterpretation
}) => {
  const formatName = (name: string) => name.replace('_', ' ');
  const isCritical = dominantScore >= 100;

  return (
    <aside
      aria-label="Mobile actions"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-3.5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Quick Dominant Bottleneck Chip */}
        <button
          onClick={onScrollToBottleneck}
          className="flex items-center space-x-1.5 px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 border border-slate-200 text-left transition-colors shrink-0 cursor-pointer min-h-[44px]"
          title="Scroll to Dominant Bottleneck"
        >
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${isCritical ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
            <AlertTriangle className={`w-3.5 h-3.5 ${isCritical ? 'text-rose-600' : 'text-amber-600'}`} />
          </div>
          <div className="leading-none pr-1">
            <div className="text-[9px] font-mono uppercase text-slate-500 font-bold">#1 Limit</div>
            <div className={`text-[11px] font-mono font-black truncate max-w-[85px] sm:max-w-[120px] ${isCritical ? 'text-rose-700' : 'text-slate-900'}`}>
              {dominantScore.toFixed(0)}% {formatName(dominantBottleneck)}
            </div>
          </div>
        </button>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          {/* 1-Click Demo Button */}
          <button
            onClick={onOneClickDemo}
            disabled={isLoadingExplanation}
            className="flex-1 max-w-[130px] sm:max-w-[150px] min-h-[44px] flex items-center justify-center space-x-1.5 px-2.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 active:from-emerald-700 active:to-blue-700 text-white font-extrabold text-[11px] uppercase tracking-tight shadow-xs hover:shadow transition-all disabled:opacity-50 cursor-pointer"
            title="1-Click Hero Demo: Accelerate imaging 100x & explain"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300 shrink-0" />
            <span className="truncate">⚡ Demo</span>
          </button>

          {/* Explain Scenario or View Analysis Button */}
          {hasInterpretation ? (
            <button
              onClick={onScrollToInterpretation}
              className="flex-1 max-w-[130px] sm:max-w-[150px] min-h-[44px] flex items-center justify-center space-x-1.5 px-2.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 border border-blue-300 text-blue-800 font-bold text-[11px] uppercase tracking-tight transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">View Analysis</span>
            </button>
          ) : (
            <button
              onClick={onExplainClick}
              disabled={isLoadingExplanation}
              className="flex-1 max-w-[130px] sm:max-w-[150px] min-h-[44px] flex items-center justify-center space-x-1.5 px-2.5 py-2 rounded-xl bg-slate-900 active:bg-slate-950 text-white font-extrabold text-[11px] uppercase tracking-tight shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoadingExplanation ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400 shrink-0" />
                  <span className="truncate">Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Explain</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

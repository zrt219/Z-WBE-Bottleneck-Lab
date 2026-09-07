import React, { useState, useRef, useEffect } from 'react';
import { TooltipInfo } from '../data/tooltipData';
import { Info } from 'lucide-react';

interface TooltipProps {
  info?: TooltipInfo;
  title?: string;
  unit?: string;
  description?: string;
  baseline?: string;
  impact?: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  asIcon?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  info,
  title = info?.title,
  unit = info?.unit,
  description = info?.description,
  baseline = info?.baseline,
  impact = info?.impact,
  children,
  position = 'top',
  className = '',
  asIcon = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number; actualPosition: string }>({
    x: 0,
    y: 0,
    actualPosition: position
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 280; // approximate width
    const tooltipHeight = 160; // approximate height
    const gap = 8;

    let targetPos = position;
    let x = 0;
    let y = 0;

    // Viewport boundaries
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Flip vertical if needed
    if (targetPos === 'top' && triggerRect.top - tooltipHeight - gap < 10) {
      targetPos = 'bottom';
    } else if (targetPos === 'bottom' && triggerRect.bottom + tooltipHeight + gap > viewportHeight - 10) {
      targetPos = 'top';
    }

    if (targetPos === 'top') {
      x = triggerRect.left + triggerRect.width / 2;
      y = triggerRect.top - gap;
    } else if (targetPos === 'bottom') {
      x = triggerRect.left + triggerRect.width / 2;
      y = triggerRect.bottom + gap;
    } else if (targetPos === 'left') {
      x = triggerRect.left - gap;
      y = triggerRect.top + triggerRect.height / 2;
    } else if (targetPos === 'right') {
      x = triggerRect.right + gap;
      y = triggerRect.top + triggerRect.height / 2;
    }

    // Clamp horizontal position so tooltip stays on screen
    const minX = tooltipWidth / 2 + 12;
    const maxX = viewportWidth - tooltipWidth / 2 - 12;
    x = Math.max(minX, Math.min(maxX, x));

    setCoords({ x, y, actualPosition: targetPos });
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible]);

  if (!title && !description) {
    return <>{children}</>;
  }

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      className={`relative inline-flex items-center ${className}`}
    >
      {asIcon ? (
        <button
          type="button"
          aria-label={title || 'Information'}
          className="text-slate-400 hover:text-blue-600 transition-colors p-0.5 rounded-full hover:bg-blue-50 focus:outline-hidden focus:ring-1 focus:ring-blue-400 cursor-help shrink-0"
        >
          <Info className="w-3.5 h-3.5 shrink-0" />
        </button>
      ) : (
        children
      )}

      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          style={{
            position: 'fixed',
            left: `${coords.x}px`,
            top: `${coords.y}px`,
            transform:
              coords.actualPosition === 'top'
                ? 'translate(-50%, -100%)'
                : coords.actualPosition === 'bottom'
                ? 'translate(-50%, 0)'
                : coords.actualPosition === 'left'
                ? 'translate(-100%, -50%)'
                : 'translate(0, -50%)',
            zIndex: 9999
          }}
          className="w-72 bg-slate-900/95 text-slate-100 backdrop-blur-md text-xs rounded-xl p-3.5 shadow-2xl border border-slate-700/80 pointer-events-none transition-opacity duration-150 animate-in fade-in zoom-in-95 space-y-2"
        >
          {/* Header with Title and Unit */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="font-bold text-white text-[12px] leading-tight flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
              <span>{title}</span>
            </div>
            {unit && (
              <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80 font-semibold">
                {unit}
              </span>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
              {description}
            </p>
          )}

          {/* Baseline / Science context */}
          {baseline && (
            <div className="bg-slate-800/80 rounded-lg p-2 text-[10px] text-slate-300 border border-slate-700/60 flex items-start space-x-1.5">
              <span className="text-amber-400 font-bold shrink-0">🔬 Reference:</span>
              <span className="leading-normal">{baseline}</span>
            </div>
          )}

          {/* Bottleneck impact */}
          {impact && (
            <div className="bg-indigo-950/60 rounded-lg p-2 text-[10px] text-indigo-200 border border-indigo-800/50 flex items-start space-x-1.5">
              <span className="text-emerald-400 font-bold shrink-0">⚡ Impact:</span>
              <span className="leading-normal">{impact}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  CalculatedMetrics,
  formatBytes,
  formatComputeFlops,
  formatPowerDemand,
  formatBandwidth,
  formatCurrency
} from '@z-wbe/shared';
import { HardDrive, Clock, Database, Cpu, Activity, Zap, DollarSign } from 'lucide-react';

interface ResultStripProps {
  metrics: CalculatedMetrics;
}

export const ResultStrip: React.FC<ResultStripProps> = ({ metrics }) => {
  const cards = [
    {
      label: 'RAW DATA',
      value: formatBytes(metrics.rawDataBytes),
      subtext: `Comp: ${formatBytes(metrics.compressedDataBytes)}`,
      icon: HardDrive,
      accentBorder: 'border-t-blue-500',
      iconBg: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'ACQUISITION TIME',
      value: !isFinite(metrics.acquisitionTimeYears)
        ? 'Infinite'
        : metrics.acquisitionTimeYears >= 1
        ? `${metrics.acquisitionTimeYears.toFixed(2)} yrs`
        : metrics.acquisitionTimeDays >= 1
        ? `${metrics.acquisitionTimeDays.toFixed(1)} days`
        : `${(metrics.acquisitionTimeDays * 24).toFixed(1)} hrs`,
      subtext: `${metrics.effectiveImagingThroughputMm3Year.toFixed(2)} mm³/yr fleet`,
      icon: Clock,
      accentBorder: 'border-t-indigo-500',
      iconBg: 'bg-indigo-50 text-indigo-600'
    },
    {
      label: 'MODEL STATE',
      value: formatBytes(metrics.modelStateBytes),
      subtext: `${formatBytes(metrics.modelStateBytes)} memory state`,
      icon: Database,
      accentBorder: 'border-t-purple-500',
      iconBg: 'bg-purple-50 text-purple-600'
    },
    {
      label: 'REAL-TIME COMPUTE',
      value: formatComputeFlops(metrics.computeDemandFlops),
      subtext: `${formatComputeFlops(metrics.computeDemandFlops)} real-time`,
      icon: Cpu,
      accentBorder: 'border-t-sky-500',
      iconBg: 'bg-sky-50 text-sky-600'
    },
    {
      label: 'MEMORY BANDWIDTH',
      value: formatBandwidth(metrics.memoryTrafficTbS),
      subtext: `Fabric: ${formatBandwidth(metrics.interconnectTrafficTbS)}`,
      icon: Activity,
      accentBorder: 'border-t-amber-500',
      iconBg: 'bg-amber-50 text-amber-600'
    },
    {
      label: 'POWER DEMAND',
      value: formatPowerDemand(metrics.totalPowerDemandMw),
      subtext: 'Compute & cooling',
      icon: Zap,
      accentBorder: 'border-t-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600'
    },
    {
      label: 'ESTIMATED COST',
      value: formatCurrency(metrics.totalEstimatedCostUsd),
      subtext: `Proofreading: ${formatCurrency(metrics.proofreadingCostUsd)}`,
      icon: DollarSign,
      accentBorder: 'border-t-rose-500',
      iconBg: 'bg-rose-50 text-rose-600'
    }
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Calculated Output Metrics
          </span>
        </div>
        <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-wide bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
          CALCULATED FROM SCENARIO ASSUMPTIONS
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-3.5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl bg-gradient-to-b from-white to-slate-50/90 border border-slate-200/90 border-t-2 ${card.accentBorder} hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 shadow-sm flex flex-col justify-between group ${
                idx === cards.length - 1 ? 'col-span-2 sm:col-span-3 md:col-span-2 xl:col-span-1' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-1.5 mb-2">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-tight text-slate-700 leading-snug">
                  {card.label}
                </span>
                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${card.iconBg} shadow-xs shrink-0`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="mt-1">
                <div
                  className="text-sm sm:text-base font-black font-mono text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors break-words"
                  title={card.value}
                >
                  {card.value}
                </div>
                <div
                  className="text-[10px] text-slate-500 font-mono leading-tight mt-0.5 break-words"
                  title={card.subtext}
                >
                  {card.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


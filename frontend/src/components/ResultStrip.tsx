import React from 'react';
import { CalculatedMetrics } from '@z-wbe/shared';
import { HardDrive, Clock, Database, Cpu, Activity, Zap, DollarSign } from 'lucide-react';

interface ResultStripProps {
  metrics: CalculatedMetrics;
}

function formatBytes(bytes: number): string {
  if (!isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const clampedI = Math.min(units.length - 1, Math.max(0, i));
  return `${(bytes / Math.pow(1024, clampedI)).toFixed(2)} ${units[clampedI]}`;
}

function formatCurrency(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}k`;
  return `$${amount.toFixed(0)}`;
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
      value: isFinite(metrics.acquisitionTimeYears)
        ? metrics.acquisitionTimeYears < 0.1
          ? `${Math.round(metrics.acquisitionTimeDays)} days`
          : `${metrics.acquisitionTimeYears.toFixed(2)} yrs`
        : 'Infinite',
      subtext: `${metrics.effectiveImagingThroughputMm3Year.toFixed(2)} mm³/yr fleet`,
      icon: Clock,
      accentBorder: 'border-t-indigo-500',
      iconBg: 'bg-indigo-50 text-indigo-600'
    },
    {
      label: 'MODEL STATE',
      value: formatBytes(metrics.modelStateBytes),
      subtext: `${metrics.modelStateTb.toFixed(2)} TB memory state`,
      icon: Database,
      accentBorder: 'border-t-purple-500',
      iconBg: 'bg-purple-50 text-purple-600'
    },
    {
      label: 'REAL-TIME COMPUTE',
      value:
        metrics.computeDemandPflops < 0.001
          ? `${(metrics.computeDemandFlops / 1e12).toFixed(1)} TFLOPS`
          : `${metrics.computeDemandPflops.toFixed(2)} PFLOPS`,
      subtext: `${(metrics.computeDemandFlops / 1e15).toFixed(2)} PFLOP/s real-time`,
      icon: Cpu,
      accentBorder: 'border-t-sky-500',
      iconBg: 'bg-sky-50 text-sky-600'
    },
    {
      label: 'MEMORY BANDWIDTH',
      value: `${metrics.memoryTrafficTbS.toFixed(2)} TB/s`,
      subtext: `Fabric: ${metrics.interconnectTrafficTbS.toFixed(2)} TB/s`,
      icon: Activity,
      accentBorder: 'border-t-amber-500',
      iconBg: 'bg-amber-50 text-amber-600'
    },
    {
      label: 'POWER DEMAND',
      value:
        metrics.totalPowerDemandMw < 0.01
          ? `${(metrics.totalPowerDemandMw * 1000).toFixed(1)} kW`
          : `${metrics.totalPowerDemandMw.toFixed(2)} MW`,
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
              className={`p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 border-t-2 ${card.accentBorder} hover:border-slate-300 hover:bg-white transition-all duration-150 shadow-xs hover:shadow-sm flex flex-col justify-between group ${
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


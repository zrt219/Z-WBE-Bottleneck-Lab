import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScenarioAssumptions } from '@z-wbe/shared';
import { Sliders, Camera, Cpu, Database, DollarSign, Activity, Plus, Minus, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { ASSUMPTION_TOOLTIPS } from '../data/tooltipData';
import { useAccessibility } from '../context/AccessibilityContext';

interface AssumptionControlsProps {
  assumptions: ScenarioAssumptions;
  onChange: (updated: ScenarioAssumptions) => void;
}

type TabKey = 'acquisition' | 'reconstruction' | 'neuralModel' | 'hardware' | 'economics';

export const AssumptionControls: React.FC<AssumptionControlsProps> = ({ assumptions, onChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('acquisition');

  const updateNested = <K extends keyof ScenarioAssumptions>(
    category: K,
    field: keyof ScenarioAssumptions[K],
    value: number
  ) => {
    const updated = {
      ...assumptions,
      scaleId: 'custom' as const,
      scaleLabel: assumptions.scaleLabel.includes('Custom')
        ? assumptions.scaleLabel
        : `${assumptions.scaleLabel} (Customized)`,
      [category]: {
        ...(assumptions[category] as object),
        [field]: value
      }
    };
    onChange(updated);
  };

  const tabs: Array<{ id: TabKey; label: string; shortLabel: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'acquisition', label: 'Acquisition', shortLabel: 'Acquis.', icon: Camera },
    { id: 'reconstruction', label: 'Reconstruction', shortLabel: 'Recon.', icon: Database },
    { id: 'neuralModel', label: 'Neural Model', shortLabel: 'Neural', icon: Activity },
    { id: 'hardware', label: 'Hardware', shortLabel: 'Hardw.', icon: Cpu },
    { id: 'economics', label: 'Economics', shortLabel: 'Econ.', icon: DollarSign }
  ];

  return (
    <div id="tour-assumption-controls" className="h-full bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-card flex flex-col justify-between space-y-4 sm:space-y-5">
      <div className="space-y-3 sm:space-y-3.5 flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 min-h-[52px]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Scenario Assumptions
              </h2>
              <p className="text-[10px] text-slate-500 font-mono">Independent Variable Controls</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1.5 shadow-xs shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Deterministic</span>
          </span>
        </div>

      {/* Category Tabs: Responsive 5-column grid with zero cut-off buttons and Framer Motion sliding pill */}
      <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-inner">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              title={t.label}
              className={`relative flex items-center justify-center py-2 px-1 rounded-lg text-[11px] font-semibold transition-colors duration-150 cursor-pointer w-full text-center ${
                isActive ? 'text-blue-950 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/90"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10 flex flex-col 2xl:flex-row items-center justify-center gap-0.5 2xl:gap-1.5 w-full min-w-0">
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="truncate text-center">
                  <span className="hidden 2xl:inline">{t.label}</span>
                  <span className="2xl:hidden">{t.shortLabel}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels (Solid and instant without see-through fade, zero scrollbar) */}
      <div className="space-y-2.5 text-xs pt-1 flex-1 overflow-y-auto pr-1 max-h-[580px] lg:max-h-[640px] no-scrollbar scrollbar-none">
        {activeTab === 'acquisition' && (
          <>
            <ControlField
              label="Tissue Volume"
              unit="mm³"
              description="Target anatomical biological tissue sample volume"
              tooltipKey="tissueVolumeMm3"
              value={assumptions.acquisition.tissueVolumeMm3}
              min={0.0001}
              max={1500000}
              step={assumptions.acquisition.tissueVolumeMm3 > 10 ? 1 : 0.001}
              onChange={(v) => updateNested('acquisition', 'tissueVolumeMm3', v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-1 gap-2.5">
              <ControlField
                label="Voxel X"
                unit="nm"
                description="Lateral beam scanning resolution along X-axis"
                tooltipKey="voxelResXNm"
                value={assumptions.acquisition.voxelResXNm}
                min={2}
                max={50}
                step={1}
                onChange={(v) => updateNested('acquisition', 'voxelResXNm', v)}
              />
              <ControlField
                label="Voxel Y"
                unit="nm"
                description="Lateral beam scanning resolution along Y-axis"
                tooltipKey="voxelResYNm"
                value={assumptions.acquisition.voxelResYNm}
                min={2}
                max={50}
                step={1}
                onChange={(v) => updateNested('acquisition', 'voxelResYNm', v)}
              />
              <ControlField
                label="Voxel Z"
                unit="nm"
                description="Axial physical sectioning thickness / milling depth along Z-axis"
                tooltipKey="voxelResZNm"
                value={assumptions.acquisition.voxelResZNm}
                min={2}
                max={100}
                step={1}
                onChange={(v) => updateNested('acquisition', 'voxelResZNm', v)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-2.5">
              <ControlField
                label="Bits Per Voxel"
                unit="bits"
                description="Grayscale digitization bit depth per acquired voxel"
                tooltipKey="bitsPerVoxel"
                value={assumptions.acquisition.bitsPerVoxel}
                min={4}
                max={16}
                step={1}
                onChange={(v) => updateNested('acquisition', 'bitsPerVoxel', v)}
              />
              <ControlField
                label="Compression"
                unit="x"
                description="Volumetric image dataset lossless compression ratio"
                tooltipKey="compressionRatio"
                value={assumptions.acquisition.compressionRatio}
                min={1}
                max={10}
                step={0.1}
                onChange={(v) => updateNested('acquisition', 'compressionRatio', v)}
              />
            </div>
            <ControlField
              label="Imaging Rate Per Machine"
              unit="mm³/year"
              description="Beam throughput rate per multi-beam electron microscope"
              tooltipKey="imagingRatePerMachineMm3Year"
              value={assumptions.acquisition.imagingRatePerMachineMm3Year}
              min={0.01}
              max={50}
              step={0.05}
              onChange={(v) => updateNested('acquisition', 'imagingRatePerMachineMm3Year', v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-2.5">
              <ControlField
                label="Instrument Count"
                unit="units"
                description="Number of parallel multi-beam electron microscopes operating in fleet"
                tooltipKey="machineCount"
                value={assumptions.acquisition.machineCount}
                min={1}
                max={200}
                step={1}
                onChange={(v) => updateNested('acquisition', 'machineCount', v)}
              />
              <ControlField
                label="Utilization Duty"
                unit="fraction"
                description="Effective beam uptime and sample exchange duty cycle (0.1–1.0)"
                tooltipKey="utilization"
                value={assumptions.acquisition.utilization}
                min={0.1}
                max={1.0}
                step={0.05}
                onChange={(v) => updateNested('acquisition', 'utilization', v)}
              />
            </div>
          </>
        )}

        {activeTab === 'reconstruction' && (
          <>
            <ControlField
              label="Raw Segmentation Accuracy"
              unit="fraction"
              description="Automated AI volumetric segmentation accuracy before human review"
              tooltipKey="rawSegmentationAccuracy"
              value={assumptions.reconstruction.rawSegmentationAccuracy}
              min={0.8}
              max={0.999}
              step={0.001}
              onChange={(v) => updateNested('reconstruction', 'rawSegmentationAccuracy', v)}
            />
            <ControlField
              label="Proofreading Speedup"
              unit="x"
              description="Multiplier from automated assistive proofreading tools"
              tooltipKey="proofreadingMultiplier"
              value={assumptions.reconstruction.proofreadingMultiplier}
              min={1}
              max={200}
              step={1}
              onChange={(v) => updateNested('reconstruction', 'proofreadingMultiplier', v)}
            />
            <ControlField
              label="Automated Throughput"
              unit="mm³/year"
              description="AI segmentation cluster pipeline throughput"
              tooltipKey="automatedThroughputMm3Year"
              value={assumptions.reconstruction.automatedThroughputMm3Year}
              min={0.05}
              max={50000}
              step={1}
              onChange={(v) => updateNested('reconstruction', 'automatedThroughputMm3Year', v)}
            />
            <ControlField
              label="Manual Proofreading Burden"
              unit="hrs/mm³"
              description="Expert manual proofreading time required per mm³"
              tooltipKey="manualProofreadingHoursPerMm3"
              value={assumptions.reconstruction.manualProofreadingHoursPerMm3}
              min={100}
              max={100000}
              step={100}
              onChange={(v) => updateNested('reconstruction', 'manualProofreadingHoursPerMm3', v)}
            />
          </>
        )}

        {activeTab === 'neuralModel' && (
          <>
            <ControlField
              label="Neuron Count"
              unit="cells"
              description="Total biologically modeled neurons"
              tooltipKey="neuronCount"
              value={assumptions.neuralModel.neuronCount}
              min={100}
              max={1e11}
              step={1000}
              onChange={(v) => updateNested('neuralModel', 'neuronCount', v)}
            />
            <ControlField
              label="Synapse Count"
              unit="synapses"
              description="Total synaptic junctions"
              tooltipKey="synapseCount"
              value={assumptions.neuralModel.synapseCount}
              min={1000}
              max={2e14}
              step={10000}
              onChange={(v) => updateNested('neuralModel', 'synapseCount', v)}
            />
            <ControlField
              label="Average Firing Rate"
              unit="Hz"
              description="Mean action potential firing frequency"
              tooltipKey="averageFiringRateHz"
              value={assumptions.neuralModel.averageFiringRateHz}
              min={0.5}
              max={50}
              step={0.5}
              onChange={(v) => updateNested('neuralModel', 'averageFiringRateHz', v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-2.5">
              <ControlField
                label="State Per Neuron"
                unit="bytes"
                description="Multi-compartment voltage, gating kinetics, and ion channel state memory"
                tooltipKey="bytesPerNeuron"
                value={assumptions.neuralModel.bytesPerNeuron}
                min={64}
                max={16384}
                step={64}
                onChange={(v) => updateNested('neuralModel', 'bytesPerNeuron', v)}
              />
              <ControlField
                label="State Per Synapse"
                unit="bytes"
                description="Synaptic weight, vesicle reserve, neurotransmitter, and STDP state memory"
                tooltipKey="bytesPerSynapse"
                value={assumptions.neuralModel.bytesPerSynapse}
                min={4}
                max={256}
                step={4}
                onChange={(v) => updateNested('neuralModel', 'bytesPerSynapse', v)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-2.5">
              <ControlField
                label="Ops / Neuron Update"
                unit="FLOP"
                description="Floating-point operations per numerical differential update step per neuron"
                tooltipKey="computeOpsPerNeuronUpdate"
                value={assumptions.neuralModel.computeOpsPerNeuronUpdate}
                min={10}
                max={5000}
                step={10}
                onChange={(v) => updateNested('neuralModel', 'computeOpsPerNeuronUpdate', v)}
              />
              <ControlField
                label="Ops / Synapse Event"
                unit="FLOP"
                description="FLOPs required to process a single spike arrival and conductance update"
                tooltipKey="computeOpsPerSynapticEvent"
                value={assumptions.neuralModel.computeOpsPerSynapticEvent}
                min={5}
                max={1000}
                step={5}
                onChange={(v) => updateNested('neuralModel', 'computeOpsPerSynapticEvent', v)}
              />
            </div>
            <ControlField
              label="Simulation Step Rate"
              unit="Hz"
              description="Numerical integration step frequency"
              tooltipKey="neuronUpdateRateHz"
              value={assumptions.neuralModel.neuronUpdateRateHz}
              min={100}
              max={10000}
              step={100}
              onChange={(v) => updateNested('neuralModel', 'neuronUpdateRateHz', v)}
            />
          </>
        )}

        {activeTab === 'hardware' && (
          <>
            <ControlField
              label="Compute Throughput"
              unit="PFLOPS"
              description="Dedicated compute cluster throughput capacity"
              tooltipKey="computeThroughputPflops"
              value={assumptions.hardware.computeThroughputPflops}
              min={0.001}
              max={2000}
              step={0.1}
              onChange={(v) => updateNested('hardware', 'computeThroughputPflops', v)}
            />
            <ControlField
              label="Memory Bandwidth"
              unit="TB/s"
              description="Aggregate high-bandwidth memory (HBM) bandwidth"
              tooltipKey="memoryBandwidthTbS"
              value={assumptions.hardware.memoryBandwidthTbS}
              min={0.05}
              max={50000}
              step={1}
              onChange={(v) => updateNested('hardware', 'memoryBandwidthTbS', v)}
            />
            <ControlField
              label="Interconnect Bandwidth"
              unit="TB/s"
              description="Cluster fabric interconnect bisection bandwidth"
              tooltipKey="interconnectBandwidthTbS"
              value={assumptions.hardware.interconnectBandwidthTbS}
              min={0.01}
              max={20000}
              step={1}
              onChange={(v) => updateNested('hardware', 'interconnectBandwidthTbS', v)}
            />
            <ControlField
              label="Storage Capacity"
              unit="PB"
              description="Hot Tier-1 storage capacity"
              tooltipKey="storageCapacityPb"
              value={assumptions.hardware.storageCapacityPb}
              min={0.01}
              max={50000}
              step={1}
              onChange={(v) => updateNested('hardware', 'storageCapacityPb', v)}
            />
            <ControlField
              label="Power Budget"
              unit="MW"
              description="Facility power and cooling ceiling"
              tooltipKey="powerBudgetMw"
              value={assumptions.hardware.powerBudgetMw}
              min={0.001}
              max={200}
              step={0.1}
              onChange={(v) => updateNested('hardware', 'powerBudgetMw', v)}
            />
          </>
        )}

        {activeTab === 'economics' && (
          <>
            <ControlField
              label="Imaging Instrument Cost / Yr"
              unit="$/yr"
              description="Amortized cost + maintenance per EM instrument"
              tooltipKey="imagingInstrumentCostPerYear"
              value={assumptions.economics.imagingInstrumentCostPerYear}
              min={50000}
              max={2000000}
              step={25000}
              onChange={(v) => updateNested('economics', 'imagingInstrumentCostPerYear', v)}
            />
            <ControlField
              label="Storage Cost / TB / Yr"
              unit="$/TB/yr"
              description="Annual high-durability storage cost"
              tooltipKey="storageCostPerTbYear"
              value={assumptions.economics.storageCostPerTbYear}
              min={2}
              max={100}
              step={1}
              onChange={(v) => updateNested('economics', 'storageCostPerTbYear', v)}
            />
            <ControlField
              label="Compute Cost / PFLOP / Yr"
              unit="$/PFLOP/yr"
              description="Amortized GPU cluster compute cost"
              tooltipKey="computeCostPerPflopYear"
              value={assumptions.economics.computeCostPerPflopYear}
              min={10000}
              max={500000}
              step={5000}
              onChange={(v) => updateNested('economics', 'computeCostPerPflopYear', v)}
            />
            <ControlField
              label="Energy Cost / MWh"
              unit="$/MWh"
              description="Facility electricity unit tariff"
              tooltipKey="energyCostPerMwh"
              value={assumptions.economics.energyCostPerMwh}
              min={40}
              max={400}
              step={5}
              onChange={(v) => updateNested('economics', 'energyCostPerMwh', v)}
            />
            <ControlField
              label="Human Proofreading Rate"
              unit="$/hr"
              description="Loaded labor cost per manual proofreader hour"
              tooltipKey="humanProofreadingHourlyRate"
              value={assumptions.economics.humanProofreadingHourlyRate}
              min={15}
              max={150}
              step={5}
              onChange={(v) => updateNested('economics', 'humanProofreadingHourlyRate', v)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 gap-2.5">
              <ControlField
                label="Target Timeline"
                unit="years"
                description="Target operational project duration for scanning and reconstruction"
                tooltipKey="targetTimelineYears"
                value={assumptions.economics.targetTimelineYears}
                min={0.1}
                max={10}
                step={0.1}
                onChange={(v) => updateNested('economics', 'targetTimelineYears', v)}
              />
              <ControlField
                label="Budget Ceiling"
                unit="USD"
                description="Total available capital budget ceiling in USD"
                tooltipKey="budgetCeilingUsd"
                value={assumptions.economics.budgetCeilingUsd}
                min={100000}
                max={2000000000}
                step={100000}
                onChange={(v) => updateNested('economics', 'budgetCeilingUsd', v)}
              />
            </div>
          </>
        )}
      </div>
    </div>

    {/* Footer Strip */}
    <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
      <div className="flex items-center space-x-2 text-slate-600 min-w-0">
        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
        <span className="truncate">Active: <strong className="text-slate-800">{assumptions.scaleLabel}</strong></span>
      </div>
      <span className="text-[10px] text-slate-400 font-medium shrink-0">Real-time sync</span>
    </div>
  </div>
);
};

interface ControlFieldProps {
  label: string;
  unit: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  tooltipKey?: string;
}

const ControlField: React.FC<ControlFieldProps> = ({
  label,
  unit,
  description,
  value,
  min,
  max,
  step,
  onChange,
  tooltipKey
}) => {
  const tooltipInfo = tooltipKey ? ASSUMPTION_TOOLTIPS[tooltipKey] : undefined;

  const { settings } = useAccessibility();

  const handleStep = (direction: 'up' | 'down') => {
    let nextVal = direction === 'up' ? value + step : value - step;
    if (nextVal < min) nextVal = min;
    if (nextVal > max) nextVal = max;
    // Round to avoid float precision issues
    const decimals = step.toString().split('.')[1]?.length || 0;
    onChange(Number(nextVal.toFixed(decimals)));
  };

  const formatDisplay = (val: number) => {
    if (val >= 1e9) return (val / 1e9).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'B';
    if (val >= 1e6) return (val / 1e6).toLocaleString(undefined, { maximumFractionDigits: 2 }) + 'M';
    if (val > 1000) return val.toLocaleString();
    if (val < 0.01) return val.toFixed(4);
    if (val < 1) return val.toFixed(3);
    return val.toString();
  };

  return (
    <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300/90 transition-all duration-150 space-y-2.5 shadow-xs hover:bg-slate-50/90">
      <div className="flex items-center justify-between gap-2 min-h-[30px]">
        <div className="flex items-center space-x-1.5 min-w-0">
          <Tooltip
            info={tooltipInfo}
            title={tooltipInfo?.title || label}
            unit={tooltipInfo?.unit || unit}
            description={tooltipInfo?.description || description}
            baseline={tooltipInfo?.baseline}
            impact={tooltipInfo?.impact}
          >
            <span className="font-bold text-slate-800 text-xs truncate cursor-help border-b border-dotted border-slate-300 hover:text-blue-600 transition-colors">
              {label}
            </span>
            <span className="text-slate-400 hover:text-blue-600 cursor-help shrink-0 ml-1">
              <Info className="w-3.5 h-3.5 inline" />
            </span>
          </Tooltip>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            onClick={() => handleStep('down')}
            className={`min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 ${settings.largeTargets ? 'sm:w-8 sm:h-8' : 'sm:w-6 sm:h-6'} w-10 h-10 rounded-lg bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-slate-600 flex items-center justify-center cursor-pointer shadow-xs transition-colors shrink-0 touch-manipulation active:scale-95`}
            title="Step down"
            aria-label={`Decrease ${label}`}
          >
            <Minus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
          </button>
          <div className="flex items-center space-x-1 font-mono text-xs sm:text-[11px] font-bold text-slate-900 bg-white px-2 py-1.5 sm:py-1 rounded-lg border border-slate-200 shadow-xs w-22 min-w-[84px] justify-center shrink-0">
            <span className="truncate">{formatDisplay(value)}</span>
            <span className="text-[10px] sm:text-[9px] font-semibold text-slate-400 shrink-0">{unit}</span>
          </div>
          <button
            onClick={() => handleStep('up')}
            className={`min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 ${settings.largeTargets ? 'sm:w-8 sm:h-8' : 'sm:w-6 sm:h-6'} w-10 h-10 rounded-lg bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-slate-600 flex items-center justify-center cursor-pointer shadow-xs transition-colors shrink-0 touch-manipulation active:scale-95`}
            title="Step up"
            aria-label={`Increase ${label}`}
          >
            <Plus className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
          </button>
        </div>
      </div>

      <div className="w-full pt-0.5">
        {settings.simplifiedInputs ? (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (!isNaN(val)) onChange(val);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-base sm:text-xs font-bold text-slate-900 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-hidden"
              aria-label={`${label} direct input (${unit})`}
            />
            <span className="text-xs sm:text-[10px] font-bold font-mono text-slate-400 shrink-0">{unit}</span>
          </div>
        ) : (
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 cursor-pointer mt-1 accent-blue-600 rounded-lg touch-manipulation block"
            aria-label={label}
          />
        )}
      </div>
    </div>
  );
};



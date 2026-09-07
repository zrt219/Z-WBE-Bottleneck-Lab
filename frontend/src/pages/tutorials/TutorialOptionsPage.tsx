import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Eye,
  Database,
  Cpu,
  Server,
  DollarSign,
  HelpCircle,
  Layers,
  Zap
} from 'lucide-react';
import { Tooltip } from '../../components/Tooltip';
import { ASSUMPTION_TOOLTIPS } from '../../data/tooltipData';
import { PRESET_DROSOPHILA, calculateAllMetrics, formatBytes, formatComputeFlops } from '@z-wbe/shared';

export const TutorialOptionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'acq' | 'recon' | 'model' | 'hw' | 'econ'>('acq');

  // Interactive Mini-Sandbox State (based on Drosophila baseline with live tweaks)
  const [tissueVolumeMm3, setTissueVolumeMm3] = useState(PRESET_DROSOPHILA.acquisition.tissueVolumeMm3);
  const [voxelResXNm, setVoxelResXNm] = useState(PRESET_DROSOPHILA.acquisition.voxelResXNm);
  const [machineCount, setMachineCount] = useState(PRESET_DROSOPHILA.acquisition.machineCount);

  // Real-time calculation using shared physics formulas
  const metrics = useMemo(() => {
    const customAssumptions = {
      ...PRESET_DROSOPHILA,
      acquisition: {
        ...PRESET_DROSOPHILA.acquisition,
        tissueVolumeMm3: tissueVolumeMm3,
        voxelResXNm: voxelResXNm,
        voxelResYNm: voxelResXNm,
        machineCount: machineCount
      }
    };
    return calculateAllMetrics(customAssumptions);
  }, [tissueVolumeMm3, voxelResXNm, machineCount]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-bold mb-2">
          <Sliders className="w-4 h-4" />
          <span>Module 2 · Independent Variables & Control Physics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Simulator Options & Controls Guide
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          The Z-WBE engine models whole-brain emulation through <strong>25+ orthogonal independent variables</strong>.
          Every option is grounded in published literature, empirical lab benchmarks, and hardware data sheets.
        </p>
      </div>

      {/* Domain Category Selector Tabs */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            The 5 Orthogonal Engineering Domains
          </h2>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('acq')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'acq'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>1. Acquisition & Imaging</span>
          </button>
          <button
            onClick={() => setActiveTab('recon')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'recon'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>2. Reconstruction & Vision</span>
          </button>
          <button
            onClick={() => setActiveTab('model')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'model'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>3. Biophysical Model</span>
          </button>
          <button
            onClick={() => setActiveTab('hw')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'hw'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>4. Hardware & Supercomputing</span>
          </button>
          <button
            onClick={() => setActiveTab('econ')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all ${
              activeTab === 'econ'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>5. Economics & Energy</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
          {activeTab === 'acq' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Physical Brain Specimen & High-Throughput Electron Microscopy</h3>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Stage: Acquisition</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Determines the raw physical input to the pipeline. Physical brain volume dictates total voxels to be scanned.
                Multi-beam SEM (such as Zeiss MultiSEM 505/506 with 61–91 parallel beams) and FIB-SEM slice-and-view throughput
                govern physical acquisition years.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                <ParameterCard id="tissueVolumeMm3" />
                <ParameterCard id="voxelResXNm" />
                <ParameterCard id="voxelResZNm" />
                <ParameterCard id="machineCount" />
                <ParameterCard id="imagingRatePerMachineMm3Year" />
                <ParameterCard id="compressionRatio" />
              </div>
            </div>
          )}

          {activeTab === 'recon' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Computer Vision, Automated Segmentation & Proofreading</h3>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">Stage: Reconstruction</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transforms raw petabyte voxel grids into segmented membrane boundaries, traced neurite skeletons, and classified synapses.
                Because automated segmentation inevitably produces split and merge errors, manual or agentic proofreading
                often dominates human labor costs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                <ParameterCard id="rawSegmentationAccuracy" />
                <ParameterCard id="proofreadingMultiplier" />
                <ParameterCard id="automatedThroughputMm3Year" />
                <ParameterCard id="manualProofreadingHoursPerMm3" />
              </div>
            </div>
          )}

          {activeTab === 'model' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Biophysical Fidelity & Simulation Mechanics</h3>
                <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Stage: Functionalization & Execution</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Determines how many differential equations must be solved per neuron and synapse per millisecond of biological time.
                Point neuron models (Izhikevich, Leaky Integrate-and-Fire) require ~100 FLOPs per spike, whereas multi-compartmental
                Hodgkin-Huxley models with active dendritic ion channels require ~1,000,000 FLOPs per time step.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                <ParameterCard id="neuronCount" />
                <ParameterCard id="synapseCount" />
                <ParameterCard id="averageFiringRateHz" />
                <ParameterCard id="bytesPerNeuron" />
                <ParameterCard id="bytesPerSynapse" />
                <ParameterCard id="computeOpsPerNeuronUpdate" />
              </div>
            </div>
          )}

          {activeTab === 'hw' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">HPC Supercomputer, Accelerators & Memory Bus</h3>
                <span className="text-[10px] font-mono bg-violet-100 text-violet-800 px-2 py-0.5 rounded">Stage: Execution</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simulating biological neural networks is notoriously memory-bandwidth bound rather than compute-bound.
                Each synaptic event requires updating sparse pointers in memory. High Bandwidth Memory (HBM3e) and low-latency
                InfiniBand interconnect fabrics dictate real-time simulation capability.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                <ParameterCard id="computeThroughputPflops" />
                <ParameterCard id="memoryBandwidthTbS" />
                <ParameterCard id="interconnectBandwidthTbS" />
                <ParameterCard id="storageCapacityPb" />
                <ParameterCard id="powerBudgetMw" />
              </div>
            </div>
          )}

          {activeTab === 'econ' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Capital Expenditure (CapEx) & Operational Costs (OpEx)</h3>
                <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded">Stage: Economics</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Translates physical instrument hours, electricity draw, cloud cold storage, and human specialist proofreading
                into monetary valuations. Allows research directors to evaluate the cost-per-emulated-biological-second.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                <ParameterCard id="imagingInstrumentCostPerYear" />
                <ParameterCard id="storageCostPerTbYear" />
                <ParameterCard id="computeCostPerPflopYear" />
                <ParameterCard id="energyCostPerMwh" />
                <ParameterCard id="humanProofreadingHourlyRate" />
                <ParameterCard id="budgetCeilingUsd" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Interactive Parameter Testbench Sandbox */}
      <div className="bg-white border-2 border-blue-600/30 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Interactive Parameter Testbench Sandbox
              </h3>
              <p className="text-xs text-slate-500">
                Adjust parameters below and hover over tooltips to inspect live mathematical changes.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            Real Biophysics Equations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls Column */}
          <div className="space-y-4">
            {/* Control 1: Brain Volume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Tooltip info={ASSUMPTION_TOOLTIPS.tissueVolumeMm3}>
                  <span className="text-xs font-bold text-slate-700 hover:text-blue-600 cursor-help flex items-center space-x-1">
                    <span>Brain Tissue Volume</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                </Tooltip>
                <span className="font-mono text-xs text-blue-600 font-bold">{tissueVolumeMm3.toFixed(3)} mm³</span>
              </div>
              <input
                type="range"
                min={0.01}
                max={2.0}
                step={0.01}
                value={tissueVolumeMm3}
                onChange={(e) => setTissueVolumeMm3(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.01 mm³ (C. elegans)</span>
                <span>0.15 mm³ (Drosophila)</span>
                <span>2.0 mm³ (Cortical Subvolume)</span>
              </div>
            </div>

            {/* Control 2: Voxel Resolution XY */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Tooltip info={ASSUMPTION_TOOLTIPS.voxelResXNm}>
                  <span className="text-xs font-bold text-slate-700 hover:text-blue-600 cursor-help flex items-center space-x-1">
                    <span>Voxel Resolution XY</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                </Tooltip>
                <span className="font-mono text-xs text-blue-600 font-bold">{voxelResXNm} nm</span>
              </div>
              <input
                type="range"
                min={2}
                max={20}
                step={1}
                value={voxelResXNm}
                onChange={(e) => setVoxelResXNm(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>2 nm (Synaptic Vesicles)</span>
                <span>8 nm (Drosophila Standard)</span>
                <span>20 nm (Coarse)</span>
              </div>
            </div>

            {/* Control 3: Machine Count */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Tooltip info={ASSUMPTION_TOOLTIPS.machineCount}>
                  <span className="text-xs font-bold text-slate-700 hover:text-blue-600 cursor-help flex items-center space-x-1">
                    <span>Microscope Fleet (Machine Count)</span>
                    <HelpCircle className="w-3 h-3 text-slate-400" />
                  </span>
                </Tooltip>
                <span className="font-mono text-xs text-blue-600 font-bold">{machineCount} scopes</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={machineCount}
                onChange={(e) => setMachineCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 (Single SEM)</span>
                <span>2 (Drosophila Baseline)</span>
                <span>20 (Industrial Imaging Core)</span>
              </div>
            </div>
          </div>

          {/* Real-time Output Readout Column */}
          <div className="bg-slate-900 text-white p-5 rounded-xl space-y-4 font-mono">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800 pb-2">
              Derived Physical Demands
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase">Total Raw Voxels</div>
                <div className="text-lg font-black text-blue-400 mt-1">
                  {metrics.voxelCount.toExponential(2)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Raw size: {formatBytes(metrics.rawDataBytes)}
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase">Acquisition Duration</div>
                <div className="text-lg font-black text-amber-400 mt-1">
                  {metrics.acquisitionTimeDays.toFixed(1)} Days
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {metrics.acquisitionTimeYears.toFixed(2)} Years continuous
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase">Estimated Neurons</div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  {PRESET_DROSOPHILA.neuralModel.neuronCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {PRESET_DROSOPHILA.neuralModel.synapseCount.toLocaleString()} Synapses
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase">Simulation Compute</div>
                <div className="text-lg font-black text-violet-400 mt-1">
                  {formatComputeFlops(metrics.computeDemandFlops)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  State: {formatBytes(metrics.modelStateBytes)}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 font-sans border-t border-slate-800 pt-2 flex items-center justify-between">
              <span>Try hovering over any underlined title to inspect its tooltip dictionary!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper card rendering dictionary definition and tooltip
const ParameterCard: React.FC<{ id: string }> = ({ id }) => {
  const data = ASSUMPTION_TOOLTIPS[id];
  if (!data) return null;

  return (
    <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1 hover:border-blue-300 transition-colors">
      <div className="flex items-center justify-between">
        <Tooltip info={data}>
          <span className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-help flex items-center space-x-1">
            <span>{data.title}</span>
            <HelpCircle className="w-3 h-3 text-slate-400" />
          </span>
        </Tooltip>
        {data.unit && (
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {data.unit}
          </span>
        )}
      </div>
      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
        {data.description}
      </p>
      {data.baseline && (
        <div className="text-[10px] font-mono text-blue-600 pt-1">
          Baseline: {data.baseline}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Database,
  Eye,
  AlertTriangle,
  Lightbulb,
  Zap,
  CheckCircle
} from 'lucide-react';

export const TutorialBasicsPage: React.FC = () => {
  // Amdahl's law sandbox state
  // Initial baseline stage fractions: Acquisition = 40%, Reconstruction = 45%, Simulation (1 year run) = 15%
  const [acqSpeedup, setAcqSpeedup] = useState(1);
  const [reconSpeedup, setReconSpeedup] = useState(1);
  const [simSpeedup, setSimSpeedup] = useState(1);

  // Initial durations in normalized days
  const baseAcqDays = 120;
  const baseReconDays = 150;
  const baseSimDays = 50;
  const totalBaseDays = baseAcqDays + baseReconDays + baseSimDays;

  // New durations
  const newAcqDays = baseAcqDays / acqSpeedup;
  const newReconDays = baseReconDays / reconSpeedup;
  const newSimDays = baseSimDays / simSpeedup;
  const newTotalDays = newAcqDays + newReconDays + newSimDays;

  const totalSpeedup = (totalBaseDays / newTotalDays).toFixed(2);

  // Dominant bottleneck in sandbox
  const maxDays = Math.max(newAcqDays, newReconDays, newSimDays);
  const currentBottleneck =
    maxDays === newAcqDays
      ? 'Acquisition (Imaging Throughput)'
      : maxDays === newReconDays
      ? 'Reconstruction (Segmentation & Proofreading)'
      : 'Simulation (Compute & Memory Bandwidth)';

  return (
    <div className="space-y-8">
      {/* Title & Metadata */}
      <div>
        <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-bold mb-2">
          <BookOpen className="w-4 h-4" />
          <span>Module 1 · Foundations of Whole Brain Emulation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          What is Whole Brain Emulation & Bottleneck Dynamics?
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          Whole Brain Emulation (WBE) is not artificial intelligence—it is <strong>computational biophysics</strong>:
          digitizing biological neural tissue at nanometer scale and executing the reconstructed connectome on high-performance hardware.
        </p>
      </div>

      {/* The Fundamental Problem Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>The "Domain Silo" Fallacy</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In neurotechnology discourse, domain experts frequently evaluate feasibility solely through their own lens:
          </p>
          <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
            <li><strong>Microscopists</strong> celebrate 100x increases in beam rate, neglecting exabyte storage costs.</li>
            <li><strong>AI Researchers</strong> develop autonomous segmentation, ignoring proofreading error cascades.</li>
            <li><strong>HPC Engineers</strong> design multi-petaflop clusters, overlooking memory bandwidth saturation.</li>
          </ul>
          <p className="text-xs text-slate-700 font-medium pt-1">
            Z-WBE Bottleneck Lab models all stages concurrently to prevent single-variable myopia.
          </p>
        </div>

        <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Amdahl's Law in Biological Emulation</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Amdahl’s Law states that the overall speedup of a multi-stage pipeline is fundamentally limited by the
            fraction of execution time occupied by the slowest unoptimized stage:
          </p>
          <div className="bg-white/90 p-2.5 rounded-lg border border-blue-100 font-mono text-center text-xs text-blue-950 font-bold">
            Speedup = 1 / [ (1 - P) + (P / S) ]
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Even if microscope acquisition is accelerated by 10,000×, if segmentation takes 5 months,
            the total project timeline barely shrinks. The bottleneck merely migrates downstream.
          </p>
        </div>
      </div>

      {/* Interactive Sandbox: Amdahl's Shifting Bottleneck Sandbox */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-6 shadow-md border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-400 font-bold border border-blue-400/30">
                INTERACTIVE SANDBOX
              </span>
              <h3 className="font-bold text-base text-white">
                Amdahl's Bottleneck Migration Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Accelerate individual pipeline stages below to watch the dominant bottleneck instantly shift.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 font-mono">Total System Speedup</div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {totalSpeedup}×
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Slider 1: Acquisition */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Acquisition (EM)</span>
              </div>
              <span className="font-mono text-xs text-blue-400 font-bold">{acqSpeedup}×</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={acqSpeedup}
              onChange={(e) => setAcqSpeedup(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Time: {newAcqDays.toFixed(1)} days</span>
              <span>{Math.round((newAcqDays / newTotalDays) * 100)}% of total</span>
            </div>
          </div>

          {/* Slider 2: Reconstruction */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                <Database className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reconstruction (AI)</span>
              </div>
              <span className="font-mono text-xs text-indigo-400 font-bold">{reconSpeedup}×</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={reconSpeedup}
              onChange={(e) => setReconSpeedup(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Time: {newReconDays.toFixed(1)} days</span>
              <span>{Math.round((newReconDays / newTotalDays) * 100)}% of total</span>
            </div>
          </div>

          {/* Slider 3: Simulation */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Simulation (HPC)</span>
              </div>
              <span className="font-mono text-xs text-emerald-400 font-bold">{simSpeedup}×</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={1}
              value={simSpeedup}
              onChange={(e) => setSimSpeedup(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Time: {newSimDays.toFixed(1)} days</span>
              <span>{Math.round((newSimDays / newTotalDays) * 100)}% of total</span>
            </div>
          </div>
        </div>

        {/* Dynamic Visual Breakdown Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-mono">
            <span>Project Pipeline Duration: {newTotalDays.toFixed(1)} Days (Baseline: {totalBaseDays} Days)</span>
            <span className="text-amber-400 font-bold flex items-center space-x-1">
              <span>Active Bottleneck: {currentBottleneck}</span>
            </span>
          </div>
          <div className="h-4 w-full bg-slate-800 rounded-md overflow-hidden flex">
            <div
              style={{ width: `${(newAcqDays / newTotalDays) * 100}%` }}
              className="bg-blue-500 h-full transition-all duration-200"
              title={`Acquisition: ${newAcqDays.toFixed(1)} days`}
            />
            <div
              style={{ width: `${(newReconDays / newTotalDays) * 100}%` }}
              className="bg-indigo-500 h-full transition-all duration-200"
              title={`Reconstruction: ${newReconDays.toFixed(1)} days`}
            />
            <div
              style={{ width: `${(newSimDays / newTotalDays) * 100}%` }}
              className="bg-emerald-500 h-full transition-all duration-200"
              title={`Simulation: ${newSimDays.toFixed(1)} days`}
            />
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400 font-mono pt-1">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Acquisition ({((newAcqDays / newTotalDays) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Reconstruction ({((newReconDays / newTotalDays) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Simulation ({((newSimDays / newTotalDays) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physical Scale Comparison */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          The Biological Scale Gradient: From Nematode to Human
        </h3>
        <p className="text-xs text-slate-600">
          The computational and physical demands do not scale linearly—they scale with the number of synaptic contacts (roughly 1,000 to 10,000 per neuron) and spatial brain volume:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100/90 text-slate-700 font-mono text-[11px] uppercase">
              <tr>
                <th className="p-3 border-b border-slate-200">Organism</th>
                <th className="p-3 border-b border-slate-200">Neurons</th>
                <th className="p-3 border-b border-slate-200">Synapses</th>
                <th className="p-3 border-b border-slate-200">Raw EM Data</th>
                <th className="p-3 border-b border-slate-200">Primary Bottleneck</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-bold text-slate-900">C. elegans</td>
                <td className="p-3 text-slate-600">302</td>
                <td className="p-3 text-slate-600">~7,000</td>
                <td className="p-3 text-slate-600">~12 Gigabytes</td>
                <td className="p-3 text-emerald-700 font-bold">Solved (White et al. 1986)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-bold text-slate-900">Drosophila (Fruit Fly)</td>
                <td className="p-3 text-slate-600">139,255</td>
                <td className="p-3 text-slate-600">~5.4 × 10⁷</td>
                <td className="p-3 text-slate-600">~100 Terabytes</td>
                <td className="p-3 text-blue-700 font-bold">Proofreading (FlyWire 2024)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-bold text-slate-900">Mouse Cortical Circuit</td>
                <td className="p-3 text-slate-600">7.1 × 10⁷</td>
                <td className="p-3 text-slate-600">~1.0 × 10¹¹</td>
                <td className="p-3 text-slate-600">~2 Petabytes (1mm³)</td>
                <td className="p-3 text-indigo-700 font-bold">High-Throughput Acquisition</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-sans font-bold text-slate-900">Human Brain (Total)</td>
                <td className="p-3 text-slate-600">8.6 × 10¹⁰</td>
                <td className="p-3 text-slate-600">~1.5 × 10¹⁴</td>
                <td className="p-3 text-slate-600">~1–3 Zettabytes</td>
                <td className="p-3 text-rose-700 font-bold">Physical Storage & HBM3e Bandwidth</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Takeaways Callout */}
      <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
        <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-emerald-600" />
          <span>Module 1 Key Takeaways</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Systemic Equilibrium:</strong> Solving imaging doesn't produce an emulation; every stage must scale harmoniously.</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Memory Wall:</strong> Human-scale biological simulation is constrained by memory bus bandwidth, not pure FLOPs.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

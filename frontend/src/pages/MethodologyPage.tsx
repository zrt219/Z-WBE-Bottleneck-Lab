import React from 'react';
import { BookOpen, Calculator, AlertTriangle, Cpu, CheckCircle } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4 space-y-2">
        <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-bold">
          <BookOpen className="w-4 h-4" />
          <span>Scientific Methodology & Architecture Contract</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Deterministic Scaling Equations vs Generative AI Interpretation
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Z-WBE Bottleneck Lab establishes a strict epistemological boundary: mathematics computes reality constraints; NVIDIA Nemotron 3 Super interprets and reasons over those verified constraints.
        </p>
      </div>

      {/* Core Principle Callout */}
      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/80 border border-blue-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-3">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-full border border-blue-300 shadow-xs">
          Core Product Principle
        </span>
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
          Separate Deterministic Calculation from Generative Interpretation
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          The application calculates all scientific quantities deterministically. NVIDIA Nemotron 3 Super explains calculated results. Nemotron must NEVER invent measurements, scientific evidence, costs, hardware values, or experimental outcomes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[10px] font-mono text-blue-700 uppercase font-bold">
              Deterministic Calculations (Labeled)
            </span>
            <div className="text-xs font-mono font-bold text-slate-900">
              CALCULATED FROM SCENARIO ASSUMPTIONS
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              Voxel volumes, data sizes, imaging durations, compute FLOPs, memory traffic, power, financial totals.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-1">
            <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">
              AI Output (Labeled)
            </span>
            <div className="text-xs font-mono font-bold text-slate-900">
              AI INTERPRETATION
            </div>
            <p className="text-[11px] text-slate-500 font-sans">
              Technical explanations, leverage rationale, downstream dependencies, uncertainties, empirical tests.
            </p>
          </div>
        </div>
      </div>

      {/* What is Calculated vs What is Assumed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What is Calculated */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>What is Calculated</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
            <li><strong>Voxel Count (N_voxel):</strong> Exact volumetric discrete elements derived from tissue volume and 3D nanoscale resolution.</li>
            <li><strong>Raw & Compressed Data Volumes:</strong> Byte totals computed from bit depth (8 bits) and compression ratios.</li>
            <li><strong>Acquisition Timeline (T_scan):</strong> Total scanning duration based on multi-instrument throughput and utilization.</li>
            <li><strong>Model State Footprint:</strong> Dynamic synaptic and neuronal memory allocation.</li>
            <li><strong>Continuous Compute Demand:</strong> Real-time simulation FLOP/s required for Hodgkin-Huxley or multi-compartment dynamics.</li>
            <li><strong>Memory Traffic (B_memory):</strong> High-bandwidth memory bus saturation caused by continuous state updates.</li>
            <li><strong>System Power & Financial Cost:</strong> Thermal power dissipation and amortized capital/operational expenses.</li>
            <li><strong>Dominant Bottleneck & Margin:</strong> Deterministic ranking of normalized pressure across all 8 technical axes.</li>
          </ul>
        </div>

        {/* What is Assumed */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>What is Assumed</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
            <li>Tissue preservation enables uninterrupted nanometer-scale electron microscopy or X-ray nanotomography.</li>
            <li>Segmentation error rates translate uniformly into manual proofreading interventions.</li>
            <li>Hardware clusters achieve target peak memory bandwidth and interconnect latency without catastrophic distributed locking.</li>
            <li>Energy and compute pricing remain within contemporary high-performance computing envelopes ($100k/PFLOP-yr, $120/MWh).</li>
            <li>Human-scale values are speculative scaling benchmarks, not empirical biological demonstrations.</li>
          </ul>
        </div>
      </div>

      {/* What Nemotron Does vs What Nemotron Does NOT Do */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Nemotron Does */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>What Nemotron Does</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
            <li>Explains the causal physics of why a specific bottleneck limits the scenario.</li>
            <li>Connects sensitivity results to system-level constraints (e.g. why increasing compute doesn't help when memory bandwidth is saturated).</li>
            <li>Identifies key biological and technological uncertainties.</li>
            <li>Recommends empirical laboratory experiments that would validate assumptions.</li>
          </ul>
        </div>

        {/* What Nemotron Does NOT Do */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-3">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>What Nemotron Does NOT Do</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
            <li>Nemotron <strong>never</strong> calculates or alters numbers, data volumes, or costs.</li>
            <li>Nemotron <strong>never</strong> invents unverified experimental literature or benchmark results.</li>
            <li>Nemotron <strong>never</strong> chooses the dominant bottleneck (this is exclusively determined by code).</li>
            <li>Nemotron <strong>never</strong> claims human whole-brain emulation has been achieved.</li>
          </ul>
        </div>
      </div>

      {/* Transparent Equations Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-2">
          <Calculator className="w-4 h-4 text-blue-600" />
          <span>Transparent Mathematical Equations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">1. Voxel Count</span>
            <div className="text-slate-900 font-bold">N_voxel = V / (dx * dy * dz)</div>
            <p className="text-[11px] font-sans text-slate-500">
              Where V is tissue volume in mm³ and dx, dy, dz are voxel dimensions in nm.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">2. Raw Image Data</span>
            <div className="text-slate-900 font-bold">D_raw = N_voxel * bits_per_voxel / 8</div>
            <p className="text-[11px] font-sans text-slate-500">
              Total uncompressed acquisition bytes across continuous serial electron microscopy.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">3. Effective Imaging Throughput</span>
            <div className="text-slate-900 font-bold">R_total = R_machine * machine_count * utilization</div>
            <p className="text-[11px] font-sans text-slate-500">
              Fleet-wide aggregate scanning volume rate (mm³/year).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">4. Acquisition Time</span>
            <div className="text-slate-900 font-bold">T_scan = V / R_total</div>
            <p className="text-[11px] font-sans text-slate-500">
              Total beam time needed to scan the target volume (years).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">5. Model State Storage</span>
            <div className="text-slate-900 font-bold">S_state = neurons * bytes_neuron + synapses * bytes_synapse</div>
            <p className="text-[11px] font-sans text-slate-500">
              In-memory state footprint for active biophysical state variables.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">6. Compute Demand</span>
            <div className="text-slate-900 font-bold">F_total = neurons * ν_update * ops_neuron + synapses * ν_fire * ops_synapse</div>
            <p className="text-[11px] font-sans text-slate-500">
              Continuous FLOP/s required for real-time biological synchrony.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">7. Memory Traffic</span>
            <div className="text-slate-900 font-bold">B_memory = neural_traffic + synaptic_traffic</div>
            <p className="text-[11px] font-sans text-slate-500">
              Continuous streaming memory bandwidth demand (TB/s).
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">8. Normalized Pressure</span>
            <div className="text-slate-900 font-bold">Pressure_i = (Demand_i / Capacity_i) * 100</div>
            <p className="text-[11px] font-sans text-slate-500">
              Dimensionless score where 100% indicates constraint saturation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

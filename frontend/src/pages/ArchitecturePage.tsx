import React from 'react';
import { Layers, ShieldCheck, Cloud, Server, ArrowRight, Sparkles } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-4 space-y-2">
        <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-bold">
          <Layers className="w-4 h-4" />
          <span>System Architecture & Data Flow</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Google Cloud Run, Deterministic Physics Engine, OpenRouter, and NVIDIA Nemotron 3 Super
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          How Z-WBE Bottleneck Lab decouples millisecond deterministic calculations from AI model interpretation and GPU parameter sweeps.
        </p>
      </div>

      {/* Primary Pipeline Diagram (Section 28 Truthful Architecture) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Cloud className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Complete Inference & Simulation Flow
            </h2>
          </div>
          <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Containerized for Google Cloud Run
          </span>
        </div>

        {/* Visual 5-Step Box Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center">
          {/* Step 1: User / Browser */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold font-mono">
              1
            </div>
            <div className="text-xs font-bold text-slate-900">User (Browser)</div>
            <p className="text-[10px] text-slate-500">
              React UI adjusts assumptions sliders & views live bottleneck map
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 2: Google Cloud Run */}
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 flex flex-col items-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
              2
            </div>
            <div className="text-xs font-bold text-blue-950">Google Cloud Run</div>
            <p className="text-[10px] text-slate-600">
              Hosts frontend & Node.js backend; secures server-side API keys
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 3: Deterministic TypeScript Engine */}
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 flex flex-col items-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold font-mono">
              3
            </div>
            <div className="text-xs font-bold text-emerald-950">Deterministic Engine</div>
            <p className="text-[10px] text-slate-600">
              Calculates voxels, compute, memory, power, cost & bottlenecks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center text-center pt-2">
          {/* Step 4: OpenRouter API Gateway */}
          <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 flex flex-col items-center space-y-1">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold font-mono">
              4
            </div>
            <div className="text-xs font-bold text-slate-900">OpenRouter Gateway</div>
            <p className="text-[10px] text-slate-600">
              Routes structured scenario payload with deterministic cache lookup
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step 5: NVIDIA Nemotron 3 Super */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col items-center space-y-1 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-xs font-bold font-mono">
              5
            </div>
            <div className="text-xs font-bold text-white">NVIDIA Nemotron 3 Super</div>
            <p className="text-[10px] text-slate-300">
              Model: nvidia/nemotron-3-super-120b-a12b:free generates grounded interpretation
            </p>
          </div>
        </div>

        {/* Security & Boundary Box */}
        <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 flex items-center space-x-3 text-xs text-emerald-950">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold">Zero Secret Exposure Boundary: </span>
            <span>
              The browser NEVER accesses the OpenRouter API key. All model requests are brokered strictly server-side by Google Cloud Run. Keys are never logged, never exposed to client bundles, and never returned in API payloads.
            </span>
          </div>
        </div>
      </div>

      {/* GPU Offline / Analytical Sweep Pipeline Diagram */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              NVIDIA GPU Parameter Exploration Pipeline (100,000 Sweeps)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
            Google Colab + RAPIDS cuDF
          </span>
        </div>

        {/* Visual Box Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center text-center">
          {/* Step A */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold font-mono">
              A
            </div>
            <div className="text-xs font-bold text-slate-900">Google Colab</div>
            <p className="text-[10px] text-slate-500">
              Generates 100,000 synthetic parameter combinations
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step B */}
          <div className="p-3.5 rounded-lg bg-slate-900 text-white flex flex-col items-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-bold font-mono">
              B
            </div>
            <div className="text-xs font-bold text-white">NVIDIA RAPIDS</div>
            <p className="text-[10px] text-slate-300">
              `cudf.pandas` vectorizes bottleneck classification across 8 constraints
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Step C */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono">
              C
            </div>
            <div className="text-xs font-bold text-slate-900">Summary Export</div>
            <p className="text-[10px] text-slate-500">
              Outputs `gpu-sweep-summary.json` for frontend visualization
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-600 space-y-1">
          <p>
            The Jupyter notebook <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">notebooks/gpu_scenario_sweep.ipynb</code> benchmarks CPU pandas against NVIDIA RAPIDS cuDF (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">cudf.pandas</code>).
          </p>
          <p className="text-slate-500 text-[11px]">
            If execution runs in an environment without an active CUDA GPU, the system transparently records <strong>GPU BENCHMARK NOT EXECUTED</strong> rather than fabricating benchmark timings.
          </p>
        </div>
      </div>

      {/* Technology Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-900">
            <Cloud className="w-4 h-4 text-blue-600" />
            <span>Google Cloud Run Deployment</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Stateless container execution scales from zero to peak scientific concurrency in sub-second time. Automatically handles TLS termination, request throttling, and environment secret injection for OpenRouter API key.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2">
          <div className="flex items-center space-x-2 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>NVIDIA Nemotron 3 Super via OpenRouter</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Calls the 120B parameter hybrid Mamba-Transformer architecture (<code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800">nvidia/nemotron-3-super-120b-a12b:free</code>) through OpenRouter. Grounded scientific responses are cached deterministically by scenario hash.
          </p>
        </div>
      </div>
    </div>
  );
};

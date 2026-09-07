import React from 'react';
import { Compass, Award, ShieldCheck, Cpu, Layers, Cloud } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-4 space-y-2">
        <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-bold">
          <Award className="w-4 h-4" />
          <span>Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Build</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          About Z-WBE Bottleneck Lab
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          A focused public demonstrator extracted from an ongoing Whole Brain Emulation research program, engineered for the Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket competition.
        </p>
      </div>

      {/* Research Question Banner */}
      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/80 border border-blue-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-3">
        <div className="flex items-center space-x-2 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>The Core Research Question</span>
        </div>
        <blockquote className="text-base sm:text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-4 py-1 italic tracking-tight">
          "Under a specified set of biological, imaging, reconstruction, computing and economic assumptions, which technical constraint becomes the dominant bottleneck first?"
        </blockquote>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          The purpose of this application is <strong>NOT</strong> to claim that human whole-brain emulation is currently possible or close. Its purpose is to turn vague debates into quantitative sensitivity curves. When researchers or futurists alter imaging throughput or compute budgets, what actually breaks next?
        </p>
      </div>

      {/* Project Background & Motivation */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Why This Demonstrator Exists
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2">
            <span className="font-bold text-slate-900 block">1. Escaping Vague Debates</span>
            <p className="text-slate-600 leading-relaxed">
              Discussions around brain emulation often suffer from siloed optimism: microscopists assume compute is trivial, while computer scientists assume automated segmentation is solved. This tool links the entire pipeline into one continuous constraint equation.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2">
            <span className="font-bold text-slate-900 block">2. Strict Grounding Principle</span>
            <p className="text-slate-600 leading-relaxed">
              Language models often hallucinate scientific measurements or costs when asked open-ended questions. Here, NVIDIA Nemotron 3 Super is constrained by contract to reason exclusively over deterministic equations calculated in code.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card space-y-2">
            <span className="font-bold text-slate-900 block">3. Discovering Shift Points</span>
            <p className="text-slate-600 leading-relaxed">
              The hero question—<em>"What happens if imaging becomes 100x faster?"</em>—illustrates that solving one barrier simply exposes the next (e.g. memory bus saturation or proofreading backlogs).
            </p>
          </div>
        </div>
      </div>

      {/* Technology Integration */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
          Google Cloud & NVIDIA Stack Integration
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Google Cloud Run:</span>
              <span className="text-slate-600 ml-1">
                Serves the Node.js TypeScript calculation engine and REST API. Provides container auto-scaling, low cold-start latency, and secure secret environment isolation for API credentials.
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">NVIDIA Nemotron 3 Super via OpenRouter:</span>
              <span className="text-slate-600 ml-1">
                Utilizes OpenRouter API to query NVIDIA's Nemotron 3 Super (120B parameter hybrid Mamba-Transformer model: <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-800">nvidia/nemotron-3-super-120b-a12b:free</code>), translating complex multi-variable physics into grounded scientific explanations.
              </span>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-900">NVIDIA RAPIDS cuDF & Google Colab Enterprise:</span>
              <span className="text-slate-600 ml-1">
                Accelerates 100,000-run Monte Carlo scenario sweeps via `cudf.pandas`. Maps parameter correlations and phase transition regions across hardware and biological parameter spaces.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Epistemological & Ethical Guardrails */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-card text-xs text-amber-950 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-amber-900">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>Scientific Ethics and Communication Guardrail</span>
        </div>
        <p className="leading-relaxed">
          Human-scale connectome and simulation estimations are explicitly labeled as <strong>ESTIMATE / HYPOTHETICAL SCALE</strong>. This application will never display <em>"HUMAN WBE ACHIEVED"</em>. It is designed as an engineering tool to challenge assumptions and establish what empirical evidence would be required to advance whole-brain emulation research.
        </p>
      </div>
    </div>
  );
};

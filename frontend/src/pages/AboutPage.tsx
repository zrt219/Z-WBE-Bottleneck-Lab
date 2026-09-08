import React, { useState } from 'react';
import {
  Compass,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Share2
} from 'lucide-react';
import { ContestBadgesModal } from '../components/ContestBadgesModal';

export const AboutPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Official Project Submission Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-700/60">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-400/40 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Google Cloud × NVIDIA Developer Challenge 2026</span>
            </span>
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-400/30 text-xs font-mono font-semibold">
              <span>Built for GTC 2026</span>
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Z-WBE Bottleneck Lab
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              A scientific web demonstrator addressing technological scaling constraints in Whole Brain Emulation. Built with open foundation models (<strong>NVIDIA Nemotron 3 Super 120B</strong>), containerized for <strong>Google Cloud Run</strong>, and accelerated with <strong>NVIDIA RAPIDS</strong>.
            </p>
          </div>

          {/* Architectural Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
              <div className="text-base">⚡</div>
              <div className="font-bold text-white mt-1">Deterministic Physics</div>
              <div className="text-[11px] text-slate-400">12 scaling laws computing FLOPs, TB/s & budgets</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
              <div className="text-base">🧠</div>
              <div className="font-bold text-white mt-1">Grounded Reasoning</div>
              <div className="text-[11px] text-slate-400">NVIDIA Nemotron 3 Super (120B) causal synthesis</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
              <div className="text-base">📊</div>
              <div className="font-bold text-white mt-1">GPU Analytics</div>
              <div className="text-[11px] text-slate-400">100k Monte Carlo parameter sweep with cuDF</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-xs">
              <div className="text-base">☁️</div>
              <div className="font-bold text-white mt-1">Cloud Native</div>
              <div className="text-[11px] text-slate-400">Containerized Google Cloud Run microservice</div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm active:scale-95 shadow-md transition-all cursor-pointer flex items-center space-x-2"
            >
              <Award className="w-4 h-4 text-blue-200" />
              <span>Inspect Verified Developer Credentials</span>
            </button>
            <a
              href="https://github.com/zrt219/Z-WBE-Bottleneck-Lab"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-950/60 hover:bg-amber-950/80 text-white font-bold text-xs sm:text-sm border border-amber-300/40 transition-all flex items-center space-x-1.5"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Verified Badges & Pathways Showcase Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-emerald-700 font-mono text-xs uppercase tracking-wider font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Google Cloud & NVIDIA Developer Community Badges</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Completed Learning Pathways & Architectural Lineage
            </h2>
          </div>
          <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full self-start sm:self-auto">
            4/4 Badges Verified • Sep 7, 2026
          </span>
        </div>

        {/* Badge Screenshot Image Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="font-bold text-slate-800">Official Profile Credentials (4/4 Complete Sweep)</span>
            <span>Issued by Google Cloud Skills Boost / NVIDIA AI</span>
          </div>

          {/* Public Profile Verification Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-mono">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-700">Official Google Developers Profile:</span>
              <span className="font-bold text-slate-900">ID: 110918189625880989910</span>
            </div>
            <a
              href="https://developers.google.com/profile/u/110918189625880989910"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1 bg-white hover:bg-slate-50 text-blue-700 rounded-lg border border-slate-300 font-bold transition-colors shadow-2xs"
            >
              <span>Verify Public Profile</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
            <img
              src="/images/google-nvidia-developer-badges.png"
              alt="Google Cloud & NVIDIA Developer Community Completed Badges (4/4 Complete Sweep): Deploy Faster Generative AI Models with NVIDIA NIM on GKE, Speed Up Data Analytics with GPUs, Accelerated Machine Learning with Google Cloud and NVIDIA, Intro to Inference: How to Run AI Models on a GPU - Completed Sep 7, 2026"
              className="w-full max-h-72 object-contain mx-auto"
            />
          </div>
          <p className="text-[11px] text-slate-500 text-center font-mono">
            Direct screenshot of verified learner profile badges (4/4 complete sweep) earned on September 7, 2026.
          </p>
        </div>

        {/* 4 Learning Pathways Detailed Breakdown */}
        <div className="space-y-4">
          <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-800">
            How Each Pathway Directly Enabled Z-WBE Bottleneck Lab
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Pathway 1 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-3.5 items-start">
              <img
                src="/images/badge_nim_gke.png"
                alt="Deploy Faster Generative AI Models with NVIDIA NIM on GKE Badge"
                className="w-14 h-14 object-contain shrink-0 drop-shadow-xs"
              />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <a
                    href="https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=110918189625880989910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-slate-900 text-sm hover:text-blue-600 transition-colors inline-flex items-center space-x-1 group"
                  >
                    <span className="group-hover:underline">1. Deploy Faster Generative AI Models with NVIDIA NIM on GKE</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </a>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
                    Sep 7, 2026
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Architectural Impact:</strong> Taught modern microservice containerization patterns for NVIDIA inference runtimes. Guided our Google Cloud Run TypeScript backend architecture, establishing strict low-latency JSON grounding schemas and deterministic circuit-breaker fallbacks when invoking NVIDIA Nemotron 3 Super.
                </p>
                <div className="flex items-center space-x-3 text-[11px] font-mono pt-1">
                  <a
                    href="https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=110918189625880989910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
                  >
                    <span>✅ Verified Badge Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href="https://developers.google.com/learn/pathways/deploy-faster-gen-ai-models-nvidia-gke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Course Pathway
                  </a>
                </div>
              </div>
            </div>

            {/* Pathway 2 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-3.5 items-start">
              <img
                src="/images/badge_data_analytics.png"
                alt="Speed Up Data Analytics on GPUs Badge"
                className="w-14 h-14 object-contain shrink-0 drop-shadow-xs"
              />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <a
                    href="https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=110918189625880989910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-slate-900 text-sm hover:text-blue-600 transition-colors inline-flex items-center space-x-1 group"
                  >
                    <span className="group-hover:underline">2. Speed Up Data Analytics with GPUs</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </a>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
                    Sep 7, 2026
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Architectural Impact:</strong> Applied GPU acceleration using NVIDIA RAPIDS <code className="font-mono bg-slate-200/70 px-1 py-0.5 rounded text-slate-900">cudf.pandas</code> in Google Cloud Colab Enterprise, unlocking zero-code GPU parallel processing across a 100,000-scenario multi-dimensional parameter exploration sweep.
                </p>
                <div className="flex items-center space-x-3 text-[11px] font-mono pt-1">
                  <a
                    href="https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=110918189625880989910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
                  >
                    <span>✅ Verified Badge Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href="https://developers.google.com/learn/pathways/speed-up-data-analytics-GPUs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Course Pathway
                  </a>
                </div>
              </div>
            </div>

            {/* Pathway 3 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-3.5 items-start">
              <img
                src="/images/badge_accelerated_ml.png"
                alt="Accelerated Machine Learning with Google Cloud and NVIDIA Badge"
                className="w-14 h-14 object-contain shrink-0 drop-shadow-xs"
              />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <a
                    href="https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-slate-900 text-sm hover:text-blue-600 transition-colors inline-flex items-center space-x-1 group"
                  >
                    <span className="group-hover:underline">3. Accelerated Machine Learning with Google Cloud and NVIDIA</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </a>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
                    Sep 7, 2026
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Architectural Impact:</strong> Provided the hardware modeling foundation for our 8-dimensional bottleneck matrix. Taught how memory bandwidth (HBM3e) and interconnect topology (NVLink) become dominant limits when compute operations are scaled across multi-GPU supercomputing nodes.
                </p>
                <div className="flex items-center space-x-3 text-[11px] font-mono pt-1">
                  <a
                    href="https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
                  >
                    <span>✅ Verified Badge Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href="https://developers.google.com/learn/pathways/accelerated-machine-learning-with-google-cloud-and-nvidia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Course Pathway
                  </a>
                </div>
              </div>
            </div>

            {/* Pathway 4 */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-3.5 items-start">
              <img
                src="/images/badge_intro_inference.png"
                alt="Intro to Inference: How to Run AI Models on a GPU Badge"
                className="w-14 h-14 object-contain shrink-0 drop-shadow-xs"
              />
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <a
                    href="https://developers.google.com/profile/badges/playlists/ai-models-on-gpu-intro?u=zhane"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-extrabold text-slate-900 text-sm hover:text-blue-600 transition-colors inline-flex items-center space-x-1 group"
                  >
                    <span className="group-hover:underline">4. Intro to Inference: How to Run AI Models on a GPU</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                  </a>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0 ml-2">
                    Sep 7, 2026
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>Architectural Impact:</strong> Established key knowledge regarding KV-cache memory constraints, latency vs throughput trade-offs, and temperature calibration. Enabled seamless integration of NVIDIA's open model <code className="font-mono bg-slate-200/70 px-1 py-0.5 rounded text-slate-900">nvidia/nemotron-3-super-120b-a12b:free</code> on OpenRouter with zero token bloat.
                </p>
                <div className="flex items-center space-x-3 text-[11px] font-mono pt-1">
                  <a
                    href="https://developers.google.com/profile/badges/playlists/ai-models-on-gpu-intro?u=zhane"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
                  >
                    <span>✅ Verified Badge Credential</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-slate-300">•</span>
                  <a
                    href="https://developers.google.com/learn/pathways/ai-models-on-gpu-intro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    Course Pathway
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alignment with Official Contest Judging Criteria */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="space-y-1 border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-2 text-amber-700 font-mono text-xs uppercase tracking-wider font-bold">
            <Award className="w-4 h-4 text-amber-600" />
            <span>Contest Scoring Alignment</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            How Z-WBE Bottleneck Lab Addresses All 4 Judging Criteria
          </h2>
          <p className="text-xs text-slate-600">
            Each criterion is scored on a 1–10 scale by the panel of Google Cloud and NVIDIA judges. Here is how our architecture explicitly fulfills every standard:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Criterion A */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-200/90 space-y-2">
            <div className="flex items-center space-x-2 text-blue-900 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-mono">A</span>
              <span>Technical Innovation</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Z-WBE Bottleneck Lab is the first open-source Amdahl's Law simulator for Whole Brain Emulation. It unifies 12 formal physical equations spanning nanoscale multi-beam electron microscopy, automated segmentation, PFLOPS compute, HBM memory traffic, and multi-megawatt facilities. Rather than speculative forecasts, it calculates instant mathematical inflection points where bottleneck transitions occur.
            </p>
          </div>

          {/* Criterion B */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-teal-50/30 border border-emerald-200/90 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-mono">B</span>
              <span>Effective Use of NVIDIA & Google Cloud</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Demonstrates deep technical synergy across both ecosystems: Google Cloud Run provides secure serverless microservice execution, Google Cloud Colab Enterprise hosts GPU analytics, NVIDIA RAPIDS cuDF drives 100,000 Monte Carlo sweeps, and the open model NVIDIA Nemotron 3 Super 120B (<code className="font-mono bg-emerald-100 text-emerald-950 px-1 py-0.5 rounded">nvidia/nemotron-3-super-120b-a12b:free</code>) delivers causal reasoning through OpenRouter.
            </p>
          </div>

          {/* Criterion C */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 border border-purple-200/90 space-y-2">
            <div className="flex items-center space-x-2 text-purple-900 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-mono">C</span>
              <span>Potential Impact & Usefulness</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              De-silos computational neuroscience, microscopy, and supercomputing hardware design. When a researcher or policy grantmaker asks <em>"What happens if our imaging throughput increases 100x?"</em>, the lab proves that memory bandwidth and storage immediately bottleneck the system, preventing wasted capital investments on uncoordinated pipeline stages.
            </p>
          </div>

          {/* Criterion D */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/90 space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-mono">D</span>
              <span>Quality of Documentation & Presentation</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              Engineered with production-grade rigor: 71 automated vitest unit tests (100% passing), full WCAG 2.1 AAA high-contrast and dyslexia accessibility modes, sub-millisecond local math execution, comprehensive README with all mathematical derivations, interactive guided tours, scenario permalink sharing, and reproducible deployment scripts.
            </p>
          </div>
        </div>
      </div>

      {/* Core Research Premise */}
      <div className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50/80 border border-blue-200/90 rounded-3xl p-6 sm:p-8 shadow-card space-y-3">
        <div className="flex items-center space-x-2 text-blue-700 text-xs font-mono font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>The Core Research Question</span>
        </div>
        <blockquote className="text-base sm:text-lg font-bold text-slate-900 border-l-4 border-blue-600 pl-4 py-1 italic tracking-tight">
          "Under a specified set of biological, imaging, reconstruction, computing, memory, interconnect, power, and economic assumptions, which technical constraint becomes the dominant bottleneck first?"
        </blockquote>
        <p className="text-xs text-slate-600 leading-relaxed font-sans">
          The purpose of this application is <strong>NOT</strong> to claim that human whole-brain emulation is currently possible or close. Its purpose is to turn speculative timelines into quantitative sensitivity curves.
        </p>
      </div>

      {/* Epistemological & Ethical Guardrails */}
      <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/90 shadow-card text-xs text-amber-950 space-y-2">
        <div className="flex items-center space-x-2 font-bold text-amber-900">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <span className="text-sm">Scientific Ethics and Epistemic Grounding Contract</span>
        </div>
        <p className="leading-relaxed">
          All physical measurements, data rates, memory requirements, and cost projections are computed by deterministic TypeScript mathematical equations. The open language model (NVIDIA Nemotron 3 Super) is strictly bound by contract to explain these pre-computed metrics without altering numbers. Human-scale connectome projections are explicitly labeled as <strong>HYPOTHETICAL SCALE / ESTIMATE</strong>.
        </p>
      </div>

      {/* Social Submission Details */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-amber-400 font-bold">
            <Share2 className="w-4 h-4" />
            <span>Contest Social Submission Channels & Hashtag</span>
          </div>
          <div className="text-slate-300 text-[11px]">
            LinkedIn: Google for Developers, NVIDIA AI, Jen Harvey, Ray Harvey • X: Google for Developers, NVIDIA AI
          </div>
          <div className="text-amber-300 font-bold text-xs">
            #NVIDIAGTC
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black rounded-xl cursor-pointer transition-all shrink-0 active:scale-95 shadow-md"
        >
          View Full Badge Showcase
        </button>
      </div>

      {/* Badges Modal */}
      <ContestBadgesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

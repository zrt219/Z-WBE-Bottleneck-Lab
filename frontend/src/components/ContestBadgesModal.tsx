import React, { useEffect } from 'react';
import { Award, CheckCircle2, ExternalLink, X, Cpu, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContestBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContestBadgesModal: React.FC<ContestBadgesModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="contest-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/70 backdrop-blur-xs"
        >
          {/* Click outside backdrop */}
          <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', duration: 0.25 }}
            className="relative z-10 w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-4 flex items-start justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 backdrop-blur-md flex items-center justify-center text-blue-300 border border-blue-400/30 shadow-inner">
                  <Award className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider font-bold bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded-full border border-blue-400/30">
                      Built for GTC 2026
                    </span>
                    <span className="text-[11px] font-mono text-slate-300">
                      Google Cloud × NVIDIA Developer Challenge 2026
                    </span>
                  </div>
                  <h2 id="contest-modal-title" className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                    Verified Google Cloud & NVIDIA Credentials
                  </h2>
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
              {/* Technical Architecture Overview */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 border border-slate-200/90 shadow-xs space-y-2">
                <div className="flex items-center space-x-2 text-blue-950 font-bold text-xs uppercase tracking-wider font-mono">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Architecture & Foundation Model Integration</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
                  Z-WBE Bottleneck Lab was engineered for the Google Cloud × NVIDIA Developer Challenge, demonstrating rigorous epistemic decoupling: pure deterministic TypeScript scaling equations containerized for <strong>Google Cloud Run</strong> coupled with grounded scientific interpretation via <strong>NVIDIA Nemotron 3 Super 120B</strong> (free on OpenRouter) and large-scale parameter space exploration via <strong>NVIDIA RAPIDS</strong>.
                </p>
              </div>

              {/* Verified Badges Showcase */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      Verified Completed Learning Pathways (Completed Sep 7, 2026)
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    3 Badges + 4 Courses Verified
                  </span>
                </div>

                {/* Google Developers Public Profile Verification Strip */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-700">Official Google Developers Profile:</span>
                    <span className="font-bold text-slate-900">ID: 110918189625880989910</span>
                  </div>
                  <a
                    href="https://developers.google.com/profile/u/110918189625880989910"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-700 rounded-lg border border-slate-300 font-bold transition-colors"
                  >
                    <span>Verify Public Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Screenshot of Badges */}
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 shadow-inner">
                  <img
                    src="/images/google-nvidia-developer-badges.png"
                    alt="Google Cloud and NVIDIA Developer Community Completed Badges - Completed Sep 7, 2026"
                    className="w-full max-h-56 sm:max-h-64 object-contain rounded-lg mx-auto bg-white"
                  />
                  <div className="text-center text-[11px] font-mono text-slate-500 pt-2">
                    Official Developer Badges Earned from Google Cloud & NVIDIA Developer Community
                  </div>
                </div>

                {/* Detailed Pathway Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href="https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=110918189625880989910"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 text-xs hover:text-blue-600 transition-colors inline-flex items-center space-x-1 group"
                      >
                        <span className="group-hover:underline">1. Deploy Faster GenAI Models with NVIDIA NIM on GKE</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </a>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold shrink-0">
                        Sep 7, 2026
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      <strong>Architectural Role:</strong> Informed the high-throughput containerized inference gateway on Google Cloud Run, designing the epistemic grounding schema and deterministic fallback circuit.
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono pt-0.5">
                      <a
                        href="https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=110918189625880989910"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
                      >
                        <span>✅ Verified Badge</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href="https://developers.google.com/learn/pathways/deploy-faster-gen-ai-models-nvidia-gke"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-700"
                      >
                        Pathway
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href="https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=110918189625880989910"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 text-xs hover:text-blue-600 transition-colors inline-flex items-center space-x-1 group"
                      >
                        <span className="group-hover:underline">2. Speed Up Data Analytics on GPUs</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </a>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold shrink-0">
                        Sep 7, 2026
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      <strong>Architectural Role:</strong> Enabled the 100,000-scenario Monte Carlo sweep using NVIDIA RAPIDS <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">cudf.pandas</code> in Google Colab Enterprise, accelerating parameter phase transition discovery.
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono pt-0.5">
                      <a
                        href="https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=110918189625880989910"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
                      >
                        <span>✅ Verified Badge</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href="https://developers.google.com/learn/pathways/speed-up-data-analytics-GPUs"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-700"
                      >
                        Pathway
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href="https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 text-xs hover:text-blue-600 transition-colors inline-flex items-center space-x-1 group"
                      >
                        <span className="group-hover:underline">3. Accelerated ML with Google Cloud & NVIDIA</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </a>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold shrink-0">
                        Sep 7, 2026
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      <strong>Architectural Role:</strong> Formulated the multi-dimensional scaling equations balancing GPU PFLOPS, tensor core throughput, HBM3e bandwidth, and NVLink cluster fabric saturation.
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono pt-0.5">
                      <a
                        href="https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
                      >
                        <span>✅ Verified Badge</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href="https://developers.google.com/learn/pathways/accelerated-machine-learning-with-google-cloud-and-nvidia"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-700"
                      >
                        Pathway
                      </a>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <a
                        href="https://developers.google.com/learn/pathways/ai-models-on-gpu-intro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 text-xs hover:text-blue-600 transition-colors inline-flex items-center space-x-1 group"
                      >
                        <span className="group-hover:underline">4. Intro to Inference: How to Run AI Models on a GPU</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                      </a>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-bold shrink-0">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-normal">
                      <strong>Architectural Role:</strong> Guided token latency budgeting, KV-cache memory sizing, and temperature calibration for NVIDIA Nemotron 3 Super (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono">nvidia/nemotron-3-super-120b-a12b:free</code>) on OpenRouter.
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] font-mono pt-0.5">
                      <a
                        href="https://developers.google.com/learn/pathways/ai-models-on-gpu-intro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center space-x-1"
                      >
                        <span>🔗 Official Pathway</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Open Model Spotlight */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Open Model: NVIDIA Nemotron 3 Super 120B</span>
                  </div>
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    100% Free on OpenRouter
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Z-WBE Bottleneck Lab uses the state-of-the-art open model <code className="font-mono text-amber-300 bg-slate-800 px-1.5 py-0.5 rounded">nvidia/nemotron-3-super-120b-a12b:free</code> to interpret complex biophysical and computational trade-offs. The model operates under a strict Epistemic Grounding Contract: all numbers are calculated by deterministic code within a strict numerical boundary, while Nemotron explains the causal mechanics.
                </p>
              </div>

              {/* 4 Contest Judging Criteria */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-200 pb-2">
                  Alignment with Contest Judging Criteria (Equal 1-10 Scale)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900 block">(a) Technical Innovation</span>
                    <p className="text-slate-600 leading-normal text-[11px]">
                      First interactive Amdahl's Law simulator for Whole Brain Emulation connecting 8 physical dimensions across microscopy, automated segmentation, HPC, and economics in sub-millisecond execution.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900 block">(b) Effective Use of NVIDIA & Google Cloud</span>
                    <p className="text-slate-600 leading-normal text-[11px]">
                      Seamless fusion of Google Cloud Run serverless hosting, Google Colab Enterprise, NVIDIA RAPIDS cuDF parameter sweeps, and NVIDIA Nemotron 3 Super structured causal reasoning.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900 block">(c) Potential Impact & Usefulness</span>
                    <p className="text-slate-600 leading-normal text-[11px]">
                      Gives neuroscientists, hardware designers, and policymakers immediate clarity on where capital and research effort yield maximum leverage vs. hitting immediate downstream walls.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <span className="font-bold text-slate-900 block">(d) Quality of Documentation & Presentation</span>
                    <p className="text-slate-600 leading-normal text-[11px]">
                      Exhaustive documentation of all 12 mathematical equations, 71 automated verification tests, WCAG AAA accessibility, and reproducible deployment scripts.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submission Checklist & Social Card Info */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                <div className="space-y-0.5">
                  <div className="font-bold text-blue-900">Submission Tags & Checklist</div>
                  <div className="text-[11px] text-blue-700">
                    Tagging: <strong>Google for Developers</strong>, <strong>NVIDIA AI</strong>, <strong>Jen Harvey</strong>, <strong>Ray Harvey</strong> • <strong>#NVIDIAGTC</strong>
                  </div>
                </div>
                <a
                  href="https://github.com/zrt219/Z-WBE-Bottleneck-Lab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors shrink-0 shadow-xs"
                >
                  <span>View GitHub Repo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 px-5 py-3 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] font-mono text-slate-500">
                Google Cloud × NVIDIA GTC Berlin 2026 Contest
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

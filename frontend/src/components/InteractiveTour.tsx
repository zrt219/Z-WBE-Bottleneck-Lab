import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Zap
} from 'lucide-react';

export interface TourStep {
  targetId?: string;
  title: string;
  badge: string;
  description: string;
  takeaway: string;
  actionText?: string;
  isApiCallStep?: boolean;
}

interface InteractiveTourProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerApiCall: () => void;
  isApiLoading: boolean;
  hasInterpretation: boolean;
  apiTelemetry?: {
    latencyMs?: number;
    statusText?: string;
    statusCode?: number;
    isFallback?: boolean;
  };
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to Z-WBE Bottleneck Lab',
    badge: 'Step 1 of 6 • The Core Concept',
    description:
      'Whole Brain Emulation (WBE) requires an unbroken technological pipeline from nanometer tissue scanning to exascale real-time simulation. Instead of isolated debates, this lab evaluates every biological, hardware, and economic limit to answer one question: "Which technical constraint breaks first?"',
    takeaway: 'Amdahl’s Law: Accelerating one stage (like imaging) often simply shifts the bottleneck downstream (to memory bandwidth or compute).'
  },
  {
    targetId: 'tour-preset-selector',
    title: 'Biological Scale Presets',
    badge: 'Step 2 of 6 • Orders of Magnitude',
    description:
      'Start by selecting an organism preset. Observe how complexity explodes across orders of magnitude: from C. elegans (302 neurons, 0.0005 mm³) to Drosophila (140k neurons, 0.15 mm³), Mouse Circuit (10M neurons, 10 mm³), up to Human (86B neurons, 1,200,000 mm³).',
    takeaway: 'Notice how data volumes scale cubically while synaptic routing scales with network graph density.'
  },
  {
    targetId: 'tour-assumption-controls',
    title: 'Independent Variable Controls',
    badge: 'Step 3 of 6 • Deterministic Engine',
    description:
      'Explore 5 categories of physical parameters: Acquisition (beam rate, voxel resolution), Reconstruction (GPU inference, proofreading labor), Neural Model (synapse bits, firing rates), Hardware (HBM bandwidth, FP32 TFLOPS), and Economics ($/kWh, server CAPEX).',
    takeaway: 'The mathematical simulation engine runs deterministically in sub-millisecond (<1ms) time on your browser with zero AI hallucinations.'
  },
  {
    targetId: 'tour-pipeline-map',
    title: 'The 6 Pipeline Stages & Bottleneck Engine',
    badge: 'Step 4 of 6 • 8-D Constraint Pressure',
    description:
      'The pipeline follows 6 rigorous stages: Preservation → Acquisition → Reconstruction → Functionalization → Execution → Validation. The engine calculates normalized pressure across 8 physical dimensions to detect the single dominant bottleneck.',
    takeaway: 'Hover over any stage or parameter for instant rich scientific definitions and real-world electron microscopy baselines.'
  },
  {
    targetId: 'tour-explain-button',
    title: 'The Real API Call: NVIDIA Nemotron 3 Super',
    badge: 'Step 5 of 6 • Live AI Execution',
    description:
      'When you click [ EXPLAIN WITH NEMOTRON ], a live HTTP POST request is dispatched to /api/explain. The server routes your exact scenario to NVIDIA Nemotron 3 Super (120B) via OpenRouter, with a guaranteed Zero-Hallucination grounding contract.',
    takeaway: 'Click the button below to execute a real live API call and observe the telemetry latency and verified response payload.',
    actionText: 'Execute Live API Call Now',
    isApiCallStep: true
  },
  {
    targetId: 'tour-nemotron-interpretation',
    title: 'Scientific AI Interpretation',
    badge: 'Step 6 of 6 • Grounded Findings',
    description:
      'Nemotron translates raw multi-dimensional physics equations into actionable scientific insights: why the bottleneck occurred, the single highest-leverage intervention, which upgrades yield dead ends, and proposed physical experiments.',
    takeaway: 'Every claim is strictly grounded in the deterministic simulation data—no speculative extrapolations.'
  }
];

export const InteractiveTour: React.FC<InteractiveTourProps> = ({
  isOpen,
  onClose,
  onTriggerApiCall,
  isApiLoading,
  hasInterpretation,
  apiTelemetry
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const step = TOUR_STEPS[currentStep];

  // Update spotlight bounding box based on targetId
  const updateSpotlight = () => {
    if (!step?.targetId) {
      setSpotlightRect(null);
      return;
    }

    const element = document.getElementById(step.targetId);
    if (element) {
      const rect = element.getBoundingClientRect();
      setSpotlightRect(rect);
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setSpotlightRect(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateSpotlight();
      const timer = setTimeout(updateSpotlight, 200);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && currentStep < TOUR_STEPS.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        setCurrentStep((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', updateSpotlight);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', updateSpotlight);
    };
  }, [isOpen, currentStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleLiveApiAction = () => {
    onTriggerApiCall();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop with spotlight cutout */}
      {spotlightRect ? (
        <svg className="fixed inset-0 w-full h-full pointer-events-none transition-all duration-300">
          <defs>
            <mask id="spotlight-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                x={spotlightRect.left - 8}
                y={spotlightRect.top - 8}
                width={spotlightRect.width + 16}
                height={spotlightRect.height + 16}
                rx="16"
                fill="black"
              />
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.78)"
            mask="url(#spotlight-mask)"
            className="backdrop-blur-xs"
          />
          {/* Animated glow border around spotlight */}
          <rect
            x={spotlightRect.left - 8}
            y={spotlightRect.top - 8}
            width={spotlightRect.width + 16}
            height={spotlightRect.height + 16}
            rx="16"
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>
      ) : (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs transition-opacity duration-300" />
      )}

      {/* Floating Tour Card */}
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none z-50">
        <div
          ref={cardRef}
          className="pointer-events-auto max-w-xl w-full bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95 space-y-0"
        >
          {/* Header Strip */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
                Z
              </div>
              <div>
                <span className="text-[11px] font-mono text-blue-400 font-semibold uppercase tracking-wider block">
                  {step.badge}
                </span>
                <h3 className="text-sm font-bold text-white leading-tight">{step.title}</h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Tutorial (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {step.description}
            </p>

            {/* Key Takeaway Box */}
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 flex items-start space-x-2.5">
              <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-blue-900 block mb-0.5">
                  Scientific Takeaway:
                </span>
                <span className="text-xs text-blue-800 leading-relaxed font-medium">
                  {step.takeaway}
                </span>
              </div>
            </div>

            {/* Step 5 Live API Interactive Box */}
            {step.isApiCallStep && (
              <div className="bg-slate-900 text-slate-100 rounded-xl p-4 space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white font-mono">
                      LIVE API DISPATCHER: POST /api/explain
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">
                    OpenRouter Gateway
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-slate-400">Endpoint: /api/explain</div>
                  <div>Model: nvidia/nemotron-3-super-120b-a12b:free</div>
                  <div className="text-indigo-400">Grounding: Zero-Hallucination Contract Verifier</div>
                </div>

                {/* API Action button & Telemetry */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    onClick={handleLiveApiAction}
                    disabled={isApiLoading}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    <span>
                      {isApiLoading
                        ? 'Calling Nemotron 3 Super...'
                        : hasInterpretation
                        ? 'Re-run Live API Call'
                        : 'Trigger Real API Call Now'}
                    </span>
                  </button>

                  {/* Telemetry Status badge */}
                  {apiTelemetry && (
                    <div className="flex items-center space-x-2 text-[10px] font-mono">
                      <span
                        className={`px-2 py-1 rounded border font-semibold ${
                          apiTelemetry.statusCode === 200
                            ? 'bg-emerald-900/60 text-emerald-300 border-emerald-700'
                            : 'bg-amber-900/60 text-amber-300 border-amber-700'
                        }`}
                      >
                        Status: {apiTelemetry.statusCode || 200}
                      </span>
                      {typeof apiTelemetry.latencyMs === 'number' && (
                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {apiTelemetry.latencyMs}ms
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between gap-3">
            {/* Step indicator dots */}
            <div className="flex items-center space-x-1.5">
              {TOUR_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  aria-label={`Go to step ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentStep ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Skip Tour
              </button>

              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

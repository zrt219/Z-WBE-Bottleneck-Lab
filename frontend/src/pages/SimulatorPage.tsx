import React, { useState, useEffect, useMemo } from 'react';
import {
  ScenarioAssumptions,
  PRESET_DROSOPHILA,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis,
  GroundingContractResponse,
  NemotronInputSchema,
  buildNemotronInputSchema,
  generateGroundedFallback
} from '@z-wbe/shared';
import { encodeScenarioToUrl, decodeScenarioFromUrl } from '../utils/urlParams';
import { PresetSelector } from '../components/PresetSelector';
import { AssumptionControls } from '../components/AssumptionControls';
import { WbePipelineMap } from '../components/WbePipelineMap';
import { DominantBottleneckCard } from '../components/DominantBottleneckCard';
import { ResultStrip } from '../components/ResultStrip';
import { SensitivityLab } from '../components/SensitivityLab';
import { NemotronInterpretation } from '../components/NemotronInterpretation';
import { CompareScenariosModal } from '../components/CompareScenariosModal';
import { GpuExplorationMap } from '../components/GpuExplorationMap';
import { InteractiveTour } from '../components/InteractiveTour';
import { GitCompare, RotateCcw, Share2, Check, Compass, ArrowRight } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  // Check URL query parameters first, then localStorage persistence
  const [assumptions, setAssumptions] = useState<ScenarioAssumptions>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const fromUrl = decodeScenarioFromUrl(window.location.search);
      if (fromUrl) return fromUrl;
    }
    const saved = localStorage.getItem('zwbe_assumptions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return PRESET_DROSOPHILA;
  });

  const [baselineAssumptions, setBaselineAssumptions] = useState<ScenarioAssumptions>(assumptions);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [bottleneckMovedBanner, setBottleneckMovedBanner] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Tutorial / Tour State
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('zwbe_tour_completed');
    }
    return false;
  });
  const [apiTelemetry, setApiTelemetry] = useState<{
    latencyMs?: number;
    statusCode?: number;
    statusText?: string;
    isFallback?: boolean;
  } | undefined>(undefined);

  // Nemotron Interpretation State
  const [interpretation, setInterpretation] = useState<GroundingContractResponse | null>(null);
  const [groundingPayload, setGroundingPayload] = useState<NemotronInputSchema | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [requestsCount, setRequestsCount] = useState<number>(0);

  // Synchronous deterministic calculation (Never relies on network or LLM!)
  const metrics = useMemo(() => calculateAllMetrics(assumptions), [assumptions]);
  const bottleneck = useMemo(() => calculateBottlenecks(assumptions, metrics), [assumptions, metrics]);
  const sensitivity = useMemo(() => runSensitivityAnalysis(assumptions), [assumptions]);

  // Fetch initial session counter on mount
  useEffect(() => {
    fetch('/api/session-requests')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.requestsThisSession === 'number') {
          setRequestsCount(data.requestsThisSession);
        }
      })
      .catch(() => {});
  }, []);

  // Real-time URL query parameter & localStorage sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const query = encodeScenarioToUrl(assumptions);
      const newUrl = `${window.location.pathname}?${query}`;
      window.history.replaceState(null, '', newUrl);
      localStorage.setItem('zwbe_assumptions', JSON.stringify(assumptions));
    }
  }, [assumptions]);

  const handleSelectPreset = (preset: ScenarioAssumptions) => {
    setAssumptions(preset);
    setBaselineAssumptions(preset);
    setBottleneckMovedBanner(false);
    setInterpretation(null);
  };

  const handleHeroDemoTrigger = (accelerated: ScenarioAssumptions) => {
    const prevBottleneck = bottleneck.dominantBottleneck;
    setBaselineAssumptions(assumptions);
    setAssumptions(accelerated);

    const newMetrics = calculateAllMetrics(accelerated);
    const newBottleneck = calculateBottlenecks(accelerated, newMetrics);

    if (newBottleneck.dominantBottleneck !== prevBottleneck) {
      setBottleneckMovedBanner(true);
    }
    // Per Section 5 & 37: Do NOT automatically call Nemotron.
    // Recalculate instantly and show "THE BOTTLENECK MOVED".
    // User explicitly clicks [ EXPLAIN WITH NEMOTRON ].
    setInterpretation(null);
  };

  const handleExplainScenario = async (targetAssumptions: ScenarioAssumptions = assumptions) => {
    setIsLoadingExplanation(true);
    const startTime = performance.now();
    try {
      const targetMetrics = calculateAllMetrics(targetAssumptions);
      const targetBottleneck = calculateBottlenecks(targetAssumptions, targetMetrics);
      const targetSensitivity = runSensitivityAnalysis(targetAssumptions);

      const requestPayload = buildNemotronInputSchema(
        targetAssumptions,
        targetMetrics,
        targetBottleneck,
        targetSensitivity
      );
      setGroundingPayload(requestPayload);

      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assumptions: targetAssumptions,
          metrics: targetMetrics,
          bottleneck: targetBottleneck,
          sensitivity: targetSensitivity
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.interpretation) {
          setInterpretation(data.interpretation);
        } else {
          setInterpretation(
            generateGroundedFallback(
              requestPayload,
              'temporarily_unavailable',
              'AI INTERPRETATION TEMPORARILY UNAVAILABLE\nThe deterministic simulation remains valid.'
            )
          );
        }
        if (typeof data?.requestsThisSession === 'number') {
          setRequestsCount(data.requestsThisSession);
        }
        if (data?.groundingRequest) {
          setGroundingPayload(data.groundingRequest);
        }
      } else if (res.status === 429) {
        setRequestsCount((prev) => prev + 1);
        const rateLimitFallback = generateGroundedFallback(
          requestPayload,
          'rate_limited',
          'FREE API RATE LIMIT REACHED\nYour simulation is still available.\nTry Nemotron again later.'
        );
        setInterpretation(rateLimitFallback);
      } else {
        // Deterministic grounded fallback
        console.warn('Backend returned non-200, using grounded fallback client-side');
        setInterpretation(
          generateGroundedFallback(
            requestPayload,
            'temporarily_unavailable',
            'AI INTERPRETATION TEMPORARILY UNAVAILABLE\nThe deterministic simulation remains valid.'
          )
        );
      }
    } catch (err) {
      console.warn('Error fetching explanation, running local grounded fallback:', err);
      const elapsed = Math.round(performance.now() - startTime);
      setApiTelemetry({
        latencyMs: elapsed,
        statusCode: 500,
        statusText: 'Client-side fallback',
        isFallback: true
      });
      try {
        const safeAssumptions = { ...PRESET_DROSOPHILA, ...targetAssumptions };
        const safeMetrics = calculateAllMetrics(safeAssumptions);
        const safeBottleneck = calculateBottlenecks(safeAssumptions, safeMetrics);
        const safeSensitivity = runSensitivityAnalysis(safeAssumptions);
        const requestPayload = buildNemotronInputSchema(
          safeAssumptions,
          safeMetrics,
          safeBottleneck,
          safeSensitivity
        );
        setGroundingPayload(requestPayload);
        setInterpretation(
          generateGroundedFallback(
            requestPayload,
            'temporarily_unavailable',
            'AI INTERPRETATION TEMPORARILY UNAVAILABLE\nThe deterministic simulation remains valid.'
          )
        );
      } catch (fallbackErr) {
        console.error('Fatal fallback generation failure:', fallbackErr);
      }
    } finally {
      setIsLoadingExplanation(false);
      setTimeout(() => {
        const el = document.getElementById('interpretation-layer');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Optional Welcome & Tutorial Prompt Banner */}
      {showWelcomeBanner && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-200/80 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">New to Z-WBE Bottleneck Lab?</div>
              <div className="text-[11px] text-slate-600">Take a 60-second guided interactive walkthrough to see how Amdahl's Law shifts constraints.</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                setShowWelcomeBanner(false);
                setIsTourOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <span>Start Walkthrough</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setShowWelcomeBanner(false);
                localStorage.setItem('zwbe_tour_completed', 'true');
              }}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 text-xs font-medium cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Top Controls: Preset selector, hero trigger, compare button */}
      <div id="tour-preset-selector" className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <PresetSelector
          currentAssumptions={assumptions}
          onSelectPreset={handleSelectPreset}
          onHeroDemoTrigger={handleHeroDemoTrigger}
          bottleneckMovedBanner={bottleneckMovedBanner}
        />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2.5">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }
          }}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-xs font-semibold text-indigo-800 shadow-xs hover:shadow transition-all cursor-pointer"
          title="Copy permalink with active parameters to clipboard"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-700 font-bold">Link Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Share Scenario Link</span>
            </>
          )}
        </button>
        <button
          onClick={() => {
            setBaselineAssumptions(assumptions);
            setIsCompareOpen(true);
          }}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs hover:shadow transition-all cursor-pointer"
        >
          <GitCompare className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Compare Scenarios (Baseline vs Modified)</span>
        </button>
        <button
          onClick={() => handleSelectPreset(PRESET_DROSOPHILA)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-800 shadow-xs transition-colors cursor-pointer"
          title="Reset to default preset"
        >
          <RotateCcw className="w-3.5 h-3.5 shrink-0" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main 3-Column Layout: Equal-width 1:1:1 Grid, Full-height stretched */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left: Assumptions Controls (1/3 width) */}
        <div id="tour-assumption-controls" className="w-full flex flex-col">
          <AssumptionControls assumptions={assumptions} onChange={setAssumptions} />
        </div>

        {/* Center: WBE Pipeline Stages (1/3 width) */}
        <div id="tour-pipeline-map" className="w-full flex flex-col">
          <WbePipelineMap bottleneck={bottleneck} metrics={metrics} />
        </div>

        {/* Right: Dominant Bottleneck & Trigger (1/3 width) */}
        <div id="tour-explain-button" className="w-full flex flex-col">
          <DominantBottleneckCard
            bottleneck={bottleneck}
            onExplainClick={() => handleExplainScenario(assumptions)}
            isLoadingExplanation={isLoadingExplanation}
            hasInterpretation={Boolean(interpretation)}
            onScrollToInterpretation={() => {
              const el = document.getElementById('interpretation-layer');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />
        </div>
      </div>

      {/* Result Strip */}
      <ResultStrip metrics={metrics} />

      {/* Sensitivity Lab */}
      <SensitivityLab sensitivity={sensitivity} />

      {/* Nemotron Interpretation Layer */}
      <div id="tour-nemotron-interpretation" className="scroll-mt-24">
        <div id="interpretation-layer">
          <NemotronInterpretation
            interpretation={interpretation}
            groundingRequest={groundingPayload}
            isLoading={isLoadingExplanation}
            requestsCount={requestsCount}
            onExplainClick={() => handleExplainScenario(assumptions)}
            apiTelemetry={apiTelemetry}
          />
        </div>
      </div>

      {/* GPU Exploration Map */}
      <GpuExplorationMap />

      {/* Compare Modal */}
      <CompareScenariosModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        baseline={baselineAssumptions}
        modified={assumptions}
        onApplyModifiedAsBaseline={() => setBaselineAssumptions(assumptions)}
      />

      {/* Interactive Guided Tour */}
      <InteractiveTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onTriggerApiCall={() => handleExplainScenario(assumptions)}
        isApiLoading={isLoadingExplanation}
        hasInterpretation={Boolean(interpretation)}
        apiTelemetry={apiTelemetry}
      />
    </div>
  );
};


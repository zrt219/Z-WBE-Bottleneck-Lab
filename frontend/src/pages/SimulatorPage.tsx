import React, { useState, useEffect, useMemo } from 'react';
import {
  ScenarioAssumptions,
  PRESET_DROSOPHILA,
  applyImaging100xDemo,
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
import { MobileStickyActionBar } from '../components/MobileStickyActionBar';
import { useAccessibility } from '../context/AccessibilityContext';
import { GitCompare, RotateCcw, Share2, Check, Compass, ArrowRight, ChevronDown, ChevronUp, Sliders, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export const SimulatorPage: React.FC = () => {
  const { announce } = useAccessibility();
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
  const [isResetting, setIsResetting] = useState(false);

  // Mobile Collapsible Accordion States (collapsed by default on mobile)
  const [isAssumptionsExpanded, setIsAssumptionsExpanded] = useState(false);
  const [isPipelineExpanded, setIsPipelineExpanded] = useState(false);

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
    const quickBottleneck = calculateBottlenecks(preset, calculateAllMetrics(preset));
    announce(`Loaded ${preset.scaleLabel} preset. Dominant bottleneck: ${quickBottleneck.dominantBottleneck}.`);
  };

  const handleHeroDemoTrigger = (accelerated: ScenarioAssumptions) => {
    const prevBottleneck = bottleneck.dominantBottleneck;
    setBaselineAssumptions(assumptions);
    setAssumptions(accelerated);

    const newMetrics = calculateAllMetrics(accelerated);
    const newBottleneck = calculateBottlenecks(accelerated, newMetrics);

    if (newBottleneck.dominantBottleneck !== prevBottleneck) {
      setBottleneckMovedBanner(true);
      announce(`100x imaging acceleration applied. The bottleneck moved from ${prevBottleneck} to ${newBottleneck.dominantBottleneck}!`);
    } else {
      announce(`100x imaging acceleration applied. Current bottleneck remains ${newBottleneck.dominantBottleneck}.`);
    }
    // Per Section 5 & 37: Do NOT automatically call Nemotron.
    // Recalculate instantly and show "THE BOTTLENECK MOVED".
    // User explicitly clicks [ EXPLAIN WITH NEMOTRON ].
    setInterpretation(null);
  };

  const handleOneClickDemo = async () => {
    // 1. Establish baseline from current un-accelerated scenario
    const baseScenario = assumptions.name.includes('(100x')
      ? PRESET_DROSOPHILA
      : assumptions;
    setBaselineAssumptions(baseScenario);

    // 2. Apply 100x imaging acceleration transformation
    const accelerated = applyImaging100xDemo(baseScenario);
    setAssumptions(accelerated);

    // 3. Mark the constraint shift banner
    setBottleneckMovedBanner(true);
    announce('Running 1-Click Hero Demo: 100x acceleration + requesting grounded Nemotron explanation...');

    // 4. Automatically trigger Nemotron/grounded interpretation
    await handleExplainScenario(accelerated);
  };

  // Listen to keyboard shortcuts: Alt+H (100x Demo), Alt+E (Explain), Alt+C (Compare)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.altKey && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        handleOneClickDemo();
      } else if (e.altKey && (e.key === 'e' || e.key === 'E')) {
        e.preventDefault();
        handleExplainScenario(assumptions);
      } else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setIsCompareOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [assumptions]);

  // Listen to global one-click demo events from Header or other navigation components
  useEffect(() => {
    const onDemo = () => {
      handleOneClickDemo();
    };
    window.addEventListener('zwbe:one-click-demo', onDemo);
    return () => window.removeEventListener('zwbe:one-click-demo', onDemo);
  }, [assumptions]);

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
      announce('Scientific interpretation ready. Focused on interpretation layer.');
      setTimeout(() => {
        const el = document.getElementById('interpretation-layer');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  return (
    <div className="space-y-8 pb-32 lg:pb-20">
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
      <div id="tour-preset-selector" className="w-full">
        <PresetSelector
          currentAssumptions={assumptions}
          onSelectPreset={handleSelectPreset}
          onHeroDemoTrigger={handleHeroDemoTrigger}
          onOneClickDemo={handleOneClickDemo}
          bottleneckMovedBanner={bottleneckMovedBanner}
        />
      </div>

      {/* Centered Utility Toolbar: Sharing, Multi-scenario Comparison, and Reset */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-1">
        <motion.button
          onClick={() => {
            if (typeof window !== 'undefined') {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-indigo-300 bg-gradient-to-b from-indigo-50 to-indigo-100/80 hover:from-indigo-100 hover:to-indigo-200/90 text-xs font-bold text-indigo-950 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 select-none"
          title="Copy permalink with active parameters to clipboard"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-emerald-800 font-extrabold">Link Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-indigo-700 shrink-0" />
              <span>Share Scenario Link</span>
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => {
            setBaselineAssumptions(assumptions);
            setIsCompareOpen(true);
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center space-x-2.5 px-6 py-2.5 rounded-xl border border-blue-200 bg-gradient-to-b from-white via-blue-50/40 to-blue-50/80 hover:from-blue-50 hover:to-blue-100 text-xs font-bold text-blue-950 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 select-none"
          title="Compare current scenario against baseline"
        >
          <GitCompare className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Compare Scenarios</span>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md border border-blue-200/80 shrink-0">
            Baseline vs Modified
          </span>
        </motion.button>

        <motion.button
          onClick={() => {
            setIsResetting(true);
            handleSelectPreset(PRESET_DROSOPHILA);
            announce('Reset all assumptions to default Drosophila-Scale scenario.');
            setTimeout(() => setIsResetting(false), 500);
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center space-x-2.5 px-6 py-2.5 rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0 min-w-[110px] justify-center select-none"
          title="Reset to default Drosophila preset"
        >
          <motion.div
            animate={{ rotate: isResetting ? -360 : 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="shrink-0 flex items-center justify-center"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          </motion.div>
          <span className="font-bold tracking-tight">Reset</span>
        </motion.button>
      </div>

      {/* Main 3-Column Layout: Equal-width 1:1:1 Grid on desktop; Collapsible accordions with top bottleneck on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Dominant Bottleneck & Trigger: Shown first on mobile (<lg) so users immediately see key insights and action buttons */}
        <div id="tour-explain-button" className="w-full flex flex-col order-first lg:order-last">
          <DominantBottleneckCard
            bottleneck={bottleneck}
            onExplainClick={() => handleExplainScenario(assumptions)}
            isLoadingExplanation={isLoadingExplanation}
            hasInterpretation={Boolean(interpretation)}
            onScrollToInterpretation={() => {
              const el = document.getElementById('interpretation-layer');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            onOneClickDemo={handleOneClickDemo}
          />
        </div>

        {/* Assumptions Controls: Collapsible accordion on mobile, always visible on desktop */}
        <div id="tour-assumption-controls" className="w-full flex flex-col">
          {/* Mobile Accordion Toggle Header (<lg) */}
          <button
            onClick={() => setIsAssumptionsExpanded(!isAssumptionsExpanded)}
            className="lg:hidden w-full mb-2 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between transition-colors cursor-pointer text-left min-h-[44px]"
            aria-expanded={isAssumptionsExpanded}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Scenario Assumptions
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {assumptions.name}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {isAssumptionsExpanded ? 'Tap to Collapse' : 'Tap to Customize'}
              </span>
              {isAssumptionsExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </button>

          <div className={`${isAssumptionsExpanded ? 'block' : 'hidden'} lg:block h-full`}>
            <AssumptionControls assumptions={assumptions} onChange={setAssumptions} />
          </div>
        </div>

        {/* Center: WBE Pipeline Stages: Collapsible accordion on mobile, always visible on desktop */}
        <div id="tour-pipeline-map" className="w-full flex flex-col">
          {/* Mobile Accordion Toggle Header (<lg) */}
          <button
            onClick={() => setIsPipelineExpanded(!isPipelineExpanded)}
            className="lg:hidden w-full mb-2 p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-card flex items-center justify-between transition-colors cursor-pointer text-left min-h-[44px]"
            aria-expanded={isPipelineExpanded}
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  WBE Pipeline (6 Stages)
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Stage {bottleneck.dominantBottleneck}: {bottleneck.pressures[bottleneck.dominantBottleneck].score.toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                {isPipelineExpanded ? 'Tap to Collapse' : 'Tap to View Stages'}
              </span>
              {isPipelineExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </div>
          </button>

          <div className={`${isPipelineExpanded ? 'block' : 'hidden'} lg:block h-full`}>
            <WbePipelineMap bottleneck={bottleneck} metrics={metrics} />
          </div>
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

      {/* Persistent Mobile Bottom Action Bar (<lg) */}
      <MobileStickyActionBar
        dominantBottleneck={bottleneck.dominantBottleneck}
        dominantScore={bottleneck.dominantScore}
        isLoadingExplanation={isLoadingExplanation}
        hasInterpretation={Boolean(interpretation)}
        onOneClickDemo={handleOneClickDemo}
        onExplainClick={() => handleExplainScenario(assumptions)}
        onScrollToBottleneck={() => {
          const el = document.getElementById('tour-explain-button');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onScrollToInterpretation={() => {
          const el = document.getElementById('interpretation-layer');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </div>
  );
};


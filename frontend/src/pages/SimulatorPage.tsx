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
import { PresetSelector } from '../components/PresetSelector';
import { AssumptionControls } from '../components/AssumptionControls';
import { WbePipelineMap } from '../components/WbePipelineMap';
import { DominantBottleneckCard } from '../components/DominantBottleneckCard';
import { ResultStrip } from '../components/ResultStrip';
import { SensitivityLab } from '../components/SensitivityLab';
import { NemotronInterpretation } from '../components/NemotronInterpretation';
import { CompareScenariosModal } from '../components/CompareScenariosModal';
import { GpuExplorationMap } from '../components/GpuExplorationMap';
import { GitCompare, RotateCcw } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  // Local storage persistence
  const [assumptions, setAssumptions] = useState<ScenarioAssumptions>(() => {
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

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('zwbe_assumptions', JSON.stringify(assumptions));
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
    <div className="space-y-6 pb-16">
      {/* Top Controls: Preset selector, hero trigger, compare button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <PresetSelector
          currentAssumptions={assumptions}
          onSelectPreset={handleSelectPreset}
          onHeroDemoTrigger={handleHeroDemoTrigger}
          bottleneckMovedBanner={bottleneckMovedBanner}
        />
      </div>

      <div className="flex items-center justify-end space-x-2">
        <button
          onClick={() => {
            setBaselineAssumptions(assumptions);
            setIsCompareOpen(true);
          }}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
        >
          <GitCompare className="w-3.5 h-3.5 text-blue-600" />
          <span>Compare Scenarios (Baseline vs Modified)</span>
        </button>
        <button
          onClick={() => handleSelectPreset(PRESET_DROSOPHILA)}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          title="Reset to default preset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Main 3-Column Layout: Left (Assumptions), Center (WBE Pipeline), Right (Dominant Bottleneck) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Assumptions Controls (4 cols) */}
        <div className="lg:col-span-4">
          <AssumptionControls assumptions={assumptions} onChange={setAssumptions} />
        </div>

        {/* Center: WBE Pipeline Stages (5 cols) */}
        <div className="lg:col-span-5">
          <WbePipelineMap bottleneck={bottleneck} metrics={metrics} />
        </div>

        {/* Right: Dominant Bottleneck & Trigger (3 cols) */}
        <div className="lg:col-span-3">
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
      <div id="interpretation-layer" className="scroll-mt-24">
        <NemotronInterpretation
          interpretation={interpretation}
          groundingRequest={groundingPayload}
          isLoading={isLoadingExplanation}
          requestsCount={requestsCount}
          onExplainClick={() => handleExplainScenario(assumptions)}
        />
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
    </div>
  );
};


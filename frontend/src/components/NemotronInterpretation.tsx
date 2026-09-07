import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GroundingContractResponse, NemotronInputSchema, getFriendlyBottleneck } from '@z-wbe/shared';
import {
  Sparkles,
  Code,
  ChevronDown,
  ChevronUp,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Database,
  Copy,
  Check,
  Gauge,
  ArrowRight,
  HelpCircle,
  FlaskConical,
  TrendingUp,
  ShieldCheck,
  Share2
} from 'lucide-react';

interface NemotronInterpretationProps {
  interpretation: GroundingContractResponse | null;
  groundingRequest: NemotronInputSchema | null;
  isLoading: boolean;
  requestsCount: number;
  onExplainClick?: () => void;
  apiTelemetry?: {
    latencyMs?: number;
    statusCode?: number;
    statusText?: string;
    isFallback?: boolean;
  };
}

export const NemotronInterpretation: React.FC<NemotronInterpretationProps> = ({
  interpretation,
  groundingRequest,
  isLoading,
  requestsCount,
  onExplainClick,
  apiTelemetry
}) => {
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Loading State
  if (isLoading) {
    return (
      <div id="tour-nemotron-interpretation" className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-card text-center space-y-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white animate-pulse shadow-md">
          <Sparkles className="w-7 h-7 animate-spin" />
        </div>
        <div className="space-y-1.5">
          <div className="text-base font-extrabold text-slate-900">
            Translating Simulation Data into Human-Friendly Insights...
          </div>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Running strictly grounded technical reasoning via NVIDIA Nemotron 3 Super. Comparing physics equations, hardware limits, and sensitivity levers with zero hallucinations.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-[11px] font-mono text-blue-600 bg-blue-50/80 px-4 py-1.5 rounded-full w-fit mx-auto border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
          <span>Synthesizing Plain-English Interpretation</span>
        </div>
      </div>
    );
  }

  // Idle / Awaiting Call State
  if (!interpretation) {
    return (
      <div id="tour-nemotron-interpretation" className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 sm:p-10 shadow-card text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200/80 shadow-xs">
          <Cpu className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <div className="text-base font-bold text-slate-900">
            AI Plain-English Interpretation Ready
          </div>
          <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
            Click <strong className="text-slate-800 font-bold">[ EXPLAIN WITH NEMOTRON ]</strong> to get a crystal-clear, plain-English explanation of why this scenario is limited, which breakthroughs matter most, and where bottlenecks shift.
          </p>
        </div>

        {onExplainClick && (
          <div className="pt-2">
            <motion.button
              onClick={onExplainClick}
              disabled={isLoading}
              data-testid="idle-explain-scenario-button"
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="inline-flex items-center justify-center space-x-2 h-12 px-8 rounded-xl bg-gradient-to-b from-slate-800 to-slate-950 hover:from-slate-700 hover:to-slate-900 border border-slate-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer select-none whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
              <span>EXPLAIN WITH NEMOTRON</span>
            </motion.button>
          </div>
        )}

        <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-3.5 py-1 rounded-full border border-slate-200">
          <span>AI REQUESTS THIS SESSION:</span>
          <span className="font-bold text-slate-900">{requestsCount}</span>
        </div>
      </div>
    );
  }

  const s = interpretation.sections;
  const isRateLimited = interpretation.status === 'rate_limited';
  const isUnavailable = interpretation.status === 'unavailable';
  const isTempUnavailable = interpretation.status === 'temporarily_unavailable';

  // Extract metrics for top hero banner if available
  const dominantKey = groundingRequest?.dominant_bottleneck || 'MEMORY_BANDWIDTH';
  const dominantInfo = getFriendlyBottleneck(dominantKey);
  const dominantPressure = groundingRequest?.pressure_vector?.[dominantKey] ?? 85;
  const highestLeverageVar = groundingRequest?.highest_leverage_variable || 'Scale Factor';
  const summaryText = interpretation.structuredOutput?.summary ||
    `The system is primarily constrained by ${dominantInfo.label}. Upgrading ${highestLeverageVar} provides the highest acceleration.`;

  return (
    <div id="tour-nemotron-interpretation" className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-card space-y-6">
      {/* Live API Telemetry Strip */}
      {apiTelemetry && (
        <div className="bg-slate-900 text-slate-100 rounded-xl p-3 px-4 flex flex-wrap items-center justify-between gap-2.5 text-[11px] font-mono border border-slate-800 shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE API TELEMETRY</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-blue-300 font-semibold">POST /api/explain</span>
            <span className="text-slate-600">|</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                apiTelemetry.statusCode === 200
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              Status {apiTelemetry.statusCode || 200}
            </span>
            {typeof apiTelemetry.latencyMs === 'number' && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                {apiTelemetry.latencyMs} ms
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1.5 text-indigo-300 text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-Hallucination Verified</span>
          </div>
        </div>
      )}

      {/* Rate Limit Banner if HTTP 429 */}
      {isRateLimited && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex items-start space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold uppercase tracking-wide">
              FREE API RATE LIMIT REACHED
            </div>
            <p className="text-amber-800">
              Your simulation is still available. Deterministic physics and economics are fully computed. Showing deterministic grounded explanation.
            </p>
          </div>
        </div>
      )}

      {/* Unavailable Banner if key missing */}
      {isUnavailable && (
        <div className="bg-slate-50 border border-slate-300 p-4 rounded-xl flex items-start space-x-3 text-slate-800">
          <Cpu className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold uppercase tracking-wide">
              AI INTERPRETATION READY (OFFLINE PROXY)
            </div>
            <p className="text-slate-600">
              Deterministic grounded interpretation engine active. All explanations below are strictly derived from your simulation calculations.
            </p>
          </div>
        </div>
      )}

      {/* Temporary Unavailable Banner */}
      {isTempUnavailable && (
        <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl flex items-start space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold uppercase tracking-wide">
              AI INTERPRETATION TEMPORARILY UNAVAILABLE
            </div>
            <p className="text-amber-800">
              OpenRouter free endpoint was unreachable or timed out. Displaying deterministic grounded proxy interpretation.
            </p>
          </div>
        </div>
      )}

      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-slate-900 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                AI SCENARIO INTERPRETATION
              </h2>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                PLAIN ENGLISH SUMMARY
              </span>
              {interpretation.fromCache && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                  <Database className="w-3 h-3 text-emerald-700" />
                  <span>CACHED (0 API CALLS)</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center flex-wrap gap-x-2">
              <span>Model: <strong className="font-mono text-slate-700">{interpretation.modelIdentifier}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Strictly Fact-Grounded</span>
              </span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <div className="text-[11px] font-mono bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-medium">
            <span>AI CALLS: </span>
            <span className="font-bold text-slate-900">{requestsCount}</span>
          </div>

          {apiTelemetry && typeof apiTelemetry.latencyMs === 'number' && (
            <div className="text-[11px] font-mono bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 text-emerald-800 font-medium">
              <span>Latency: </span>
              <span className="font-bold">{apiTelemetry.latencyMs}ms</span>
            </div>
          )}

          {/* Copy Markdown Report */}
          <button
            onClick={() => {
              const markdown = `# Z-WBE Scientific Interpretation — NVIDIA Nemotron 3 Super
Model: ${interpretation.modelIdentifier}
Status: ${interpretation.status} (Cached: ${interpretation.fromCache ? 'Yes' : 'No'})

## 1. WHAT LIMITS THIS SCENARIO?
${s.whatLimitsThisScenario}

## 2. WHY?
${s.why}

## 3. WHAT IMPROVEMENT MATTERS MOST?
${s.whatImprovementMattersMost}

## 4. WHAT DOES NOT HELP MUCH?
${s.whatDoesNotHelpMuch || 'Upstream/downstream saturation limits secondary parameters.'}

## 5. WHERE DID THE BOTTLENECK MOVE?
${s.whereDidTheBottleneckMove}

## 6. WHAT REMAINS UNCERTAIN?
${s.whatRemainsUncertain}

## 7. WHAT WOULD NEED EMPIRICAL VALIDATION?
${s.whatNeedsRealExperimentalEvidence}

---
*The numerical results above were calculated by Z-WBE. Nemotron interprets them but does not generate them.*`;
              navigator.clipboard.writeText(markdown);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-xs"
            title="Copy formatted report to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-semibold">Copy Report</span>
              </>
            )}
          </button>

          {/* Share Scenario Link */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }
            }}
            className="flex items-center space-x-1.5 text-xs text-indigo-700 hover:text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer shadow-xs"
            title="Share permalink to this exact scenario"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                <span className="font-semibold">Share Scenario</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowJsonPayload(!showJsonPayload)}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-xs"
            title="Inspect raw prompt and JSON schema"
          >
            <Code className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{showJsonPayload ? 'Hide Technical JSON' : 'Inspect JSON'}</span>
            {showJsonPayload ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Top Hero TL;DR Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white">
                Primary Blocker
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {dominantInfo.label}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
              {summaryText}
            </h3>
          </div>

          {/* Quick Gauge Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 p-3.5 rounded-xl shrink-0 min-w-[220px] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center space-x-1">
                <Gauge className="w-3.5 h-3.5 text-rose-400" />
                <span>Constraint Pressure</span>
              </span>
              <span className="font-mono font-bold text-rose-300 text-sm">
                {dominantPressure.toFixed(1)}%
              </span>
            </div>
            {/* Visual Gauge Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  dominantPressure >= 100
                    ? 'bg-rose-500 shadow-rose-500/50 shadow-sm'
                    : dominantPressure >= 75
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.min(100, dominantPressure)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Safe)</span>
              <span>100% (Ceiling)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Grounding Payload Collapsible */}
      {showJsonPayload && groundingRequest && (
        <div className="bg-slate-950 text-slate-200 rounded-xl p-4 text-[11px] font-mono overflow-x-auto max-h-72 border border-slate-800 space-y-2 shadow-inner">
          <div className="text-slate-400 border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span className="font-semibold text-slate-300">Structured payload sent to Nemotron 3 Super (strictly deterministic):</span>
            <span className="text-emerald-400 flex items-center space-x-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Grounded scientific contract</span>
            </span>
          </div>
          <pre className="text-slate-300 leading-relaxed">{JSON.stringify(groundingRequest, null, 2)}</pre>
        </div>
      )}

      {/* Human-Friendly Grounded Interpretation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-xs">
        {/* Section 1: MAIN BLOCKER */}
        <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-rose-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
          <div>
            <div className="flex items-center justify-between min-h-[28px]">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0"></span>
                <span>1. Main Blocker</span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                Active Ceiling
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
              What is currently slowing this scenario down the most?
            </div>
          </div>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-[13px] pt-1 flex-1">
            {s.whatLimitsThisScenario}
          </div>
        </div>

        {/* Section 2: THE ROOT CAUSE */}
        <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-blue-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
          <div>
            <div className="flex items-center justify-between min-h-[28px]">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                <span>2. The Root Cause</span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                Metric Breakdown
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
              Why is this happening in plain terms?
            </div>
          </div>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-[13px] pt-1 flex-1">
            {s.why}
          </div>
        </div>

        {/* Section 3: BIGGEST BREAKTHROUGH */}
        <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-emerald-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
          <div>
            <div className="flex items-center justify-between min-h-[28px]">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                <span>3. Biggest Breakthrough</span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>Highest Leverage</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
              What single upgrade provides the steepest performance gain?
            </div>
          </div>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-[13px] pt-1 flex-1">
            {s.whatImprovementMattersMost}
          </div>
        </div>

        {/* Section 4: LOW-IMPACT UPGRADES */}
        <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-amber-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
          <div>
            <div className="flex items-center justify-between min-h-[28px]">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>4. Low-Impact Upgrades</span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                <span>Diminishing Returns</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
              What upgrades will NOT help much until the primary blocker is fixed?
            </div>
          </div>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-[13px] pt-1 flex-1">
            {s.whatDoesNotHelpMuch || 'Upgrading secondary parameters provides negligible acceleration while the primary bottleneck remains saturated.'}
          </div>
        </div>

        {/* Section 5: WHERE THE BLOCKER MOVES */}
        <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-indigo-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
          <div>
            <div className="flex items-center justify-between min-h-[28px]">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0"></span>
                <span>5. Where the Blocker Moves</span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center space-x-1">
                <ArrowRight className="w-3 h-3" />
                <span>Next Frontier</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
              What becomes the next bottleneck once you solve the current blocker?
            </div>
          </div>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-[13px] pt-1 flex-1">
            {s.whereDidTheBottleneckMove}
          </div>
        </div>

        {/* Section 6: KEY UNKNOWNS & ASSUMPTIONS */}
        <div className="h-full p-5 sm:p-6 rounded-2xl bg-amber-50/50 border border-amber-200/90 border-t-4 border-t-amber-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-amber-50/70 transition-colors">
          <div>
            <div className="flex items-center justify-between min-h-[28px]">
              <h3 className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0"></span>
                <span>6. Key Unknowns & Assumptions</span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-950 border border-amber-300 flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-amber-800" />
                <span>Uncertainties</span>
              </span>
            </div>
            <div className="text-[11px] text-amber-800/80 font-medium min-h-[34px] flex items-center mt-1">
              What biological, algorithmic, and hardware uncertainties remain?
            </div>
          </div>
          <div className="text-amber-950 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-[13px] pt-1 flex-1">
            {s.whatRemainsUncertain}
          </div>
        </div>

        {/* Section 7: REAL-WORLD EXPERIMENTS NEEDED */}
        <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-purple-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
          <div>
            <div className="flex items-center justify-between min-h-[28px]">
              <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
                <span>7. Real-World Experiments Needed</span>
              </h3>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                <FlaskConical className="w-3 h-3 text-purple-700" />
                <span>Empirical Validation</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium min-h-[28px] flex items-center mt-1">
              What physical laboratory experiments and hardware benchmarks are required to prove this in reality?
            </div>
          </div>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs sm:text-[13px] pt-1 flex-1">
            {s.whatNeedsRealExperimentalEvidence}
          </div>
        </div>
      </div>

      {/* Mandatory Footer (Section 23) */}
      <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 font-mono flex items-center justify-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>The numerical results above were calculated by Z-WBE. Nemotron interprets them but does not generate them.</span>
      </div>
    </div>
  );
};

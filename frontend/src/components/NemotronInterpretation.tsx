import React, { useState } from 'react';
import { GroundingContractResponse, NemotronInputSchema } from '@z-wbe/shared';
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
  Check
} from 'lucide-react';

interface NemotronInterpretationProps {
  interpretation: GroundingContractResponse | null;
  groundingRequest: NemotronInputSchema | null;
  isLoading: boolean;
  requestsCount: number;
  onExplainClick?: () => void;
}

export const NemotronInterpretation: React.FC<NemotronInterpretationProps> = ({
  interpretation,
  groundingRequest,
  isLoading,
  requestsCount,
  onExplainClick
}) => {
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const [copied, setCopied] = useState(false);

  // Loading State
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-card text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 animate-spin shadow-xs">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-extrabold text-slate-900">
            Querying NVIDIA Nemotron 3 Super via OpenRouter...
          </div>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Passing verified deterministic scenario metrics into NVIDIA Nemotron 3 Super for strictly grounded technical reasoning. Zero hallucinations contract enforced.
          </p>
        </div>
        <div className="flex items-center justify-center space-x-2 text-[10px] font-mono text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping"></span>
          <span>Awaiting structured reasoning payload from OpenRouter</span>
        </div>
      </div>
    );
  }

  // Idle / Awaiting Call State
  if (!interpretation) {
    return (
      <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 shadow-card text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-200/80">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800">
            AI Interpretation Layer Awaiting Scenario Invocation
          </div>
          <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 leading-relaxed">
            Click <strong className="text-slate-800 font-bold">[ EXPLAIN THIS SCENARIO ]</strong> to invoke NVIDIA Nemotron 3 Super. Nemotron explains deterministic physics and economics without hallucinating numbers or measurements.
          </p>
        </div>

        {onExplainClick && (
          <div className="pt-1">
            <button
              onClick={onExplainClick}
              disabled={isLoading}
              data-testid="idle-explain-scenario-button"
              className="inline-flex items-center space-x-2 py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold uppercase tracking-wider transition-all duration-150 shadow-sm hover:shadow hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>EXPLAIN THIS SCENARIO</span>
            </button>
          </div>
        )}

        <div className="inline-flex items-center space-x-2 text-[11px] font-mono font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
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

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-card space-y-5">
      {/* Rate Limit Banner if HTTP 429 */}
      {isRateLimited && (
        <div className="bg-amber-50 border border-amber-300 p-4 rounded-xl flex items-start space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold uppercase tracking-wide">
              FREE API RATE LIMIT REACHED
            </div>
            <p className="text-amber-800">
              Your simulation is still available. Deterministic physics and economics are fully computed. Try Nemotron again later.
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
              AI INTERPRETATION UNAVAILABLE
            </div>
            <p className="text-slate-600">
              OpenRouter API key is not configured on the server. The deterministic simulation laboratory remains 100% operational. A deterministic grounded fallback interpretation is displayed below.
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
              OpenRouter free endpoint was unreachable or timed out. The deterministic simulation remains valid. Running grounded proxy interpretation.
            </p>
          </div>
        </div>
      )}

      {/* Header & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-900 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                NEMOTRON INTERPRETATION
              </h2>
              <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                AI INTERPRETATION
              </span>
              {interpretation.fromCache && (
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                  <Database className="w-3 h-3 text-emerald-700" />
                  <span>CACHED (0 API CALLS)</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Subheading: <span className="font-semibold text-slate-700">NVIDIA Nemotron 3 Super</span>
              <span className="text-slate-400 mx-1.5">•</span>
              Model: <span className="font-mono text-slate-800 font-bold">{interpretation.modelIdentifier}</span>
            </p>
          </div>
        </div>

        {/* Counter & action buttons */}
        <div className="flex items-center space-x-2">
          <div className="text-[11px] font-mono bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 text-slate-700 font-medium">
            <span>AI REQUESTS: </span>
            <span className="font-bold text-slate-900">{requestsCount}</span>
          </div>

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

## 4. WHERE DID THE BOTTLENECK MOVE?
${s.whereDidTheBottleneckMove}

## 5. WHAT REMAINS UNCERTAIN?
${s.whatRemainsUncertain}

## 6. WHAT NEEDS REAL EXPERIMENTAL EVIDENCE?
${s.whatNeedsRealExperimentalEvidence}

---
*The numerical results above were calculated by Z-WBE. Nemotron interprets them but does not generate them.*`;
              navigator.clipboard.writeText(markdown);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-xs"
            title="Copy formatted markdown report to clipboard"
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

          <button
            onClick={() => setShowJsonPayload(!showJsonPayload)}
            className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-xs"
          >
            <Code className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold">{showJsonPayload ? 'Hide JSON' : 'Inspect JSON'}</span>
            {showJsonPayload ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
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

      {/* 6 Required Editorial Sections (Section 23) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Section 1: WHAT LIMITS THIS SCENARIO? */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/90 border-l-4 border-l-rose-500 space-y-2 shadow-xs hover:bg-slate-50/90 transition-colors">
          <h3 className="font-mono font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <span>WHAT LIMITS THIS SCENARIO?</span>
          </h3>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans">
            {s.whatLimitsThisScenario}
          </div>
        </div>

        {/* Section 2: WHY? */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/90 border-l-4 border-l-blue-500 space-y-2 shadow-xs hover:bg-slate-50/90 transition-colors">
          <h3 className="font-mono font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>WHY?</span>
          </h3>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans">
            {s.why}
          </div>
        </div>

        {/* Section 3: WHAT IMPROVEMENT MATTERS MOST? */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/90 border-l-4 border-l-emerald-500 space-y-2 shadow-xs hover:bg-slate-50/90 transition-colors">
          <h3 className="font-mono font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>WHAT IMPROVEMENT MATTERS MOST?</span>
          </h3>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans">
            {s.whatImprovementMattersMost}
          </div>
        </div>

        {/* Section 4: WHERE DID THE BOTTLENECK MOVE? */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/90 border-l-4 border-l-indigo-500 space-y-2 shadow-xs hover:bg-slate-50/90 transition-colors">
          <h3 className="font-mono font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>WHERE DID THE BOTTLENECK MOVE?</span>
          </h3>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans">
            {s.whereDidTheBottleneckMove}
          </div>
        </div>

        {/* Section 5: WHAT REMAINS UNCERTAIN? */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/90 border-l-4 border-l-amber-500 space-y-2 shadow-xs hover:bg-amber-50/80 transition-colors">
          <h3 className="font-mono font-bold text-amber-950 uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            <span>WHAT REMAINS UNCERTAIN?</span>
          </h3>
          <div className="text-amber-950 whitespace-pre-line leading-relaxed font-sans">
            {s.whatRemainsUncertain}
          </div>
        </div>

        {/* Section 6: WHAT NEEDS REAL EXPERIMENTAL EVIDENCE? */}
        <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/90 border-l-4 border-l-purple-500 space-y-2 shadow-xs hover:bg-slate-50/90 transition-colors">
          <h3 className="font-mono font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            <span>WHAT NEEDS REAL EXPERIMENTAL EVIDENCE?</span>
          </h3>
          <div className="text-slate-700 whitespace-pre-line leading-relaxed font-sans">
            {s.whatNeedsRealExperimentalEvidence}
          </div>
        </div>
      </div>

      {/* Mandatory Footer (Section 23) */}
      <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 font-mono">
        The numerical results above were calculated by Z-WBE. Nemotron interprets them but does not generate them.
      </div>
    </div>
  );
};

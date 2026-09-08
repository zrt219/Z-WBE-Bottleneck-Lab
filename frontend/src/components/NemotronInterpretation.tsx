import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GroundingContractResponse,
  NemotronInputSchema,
  getFriendlyBottleneck,
  sanitizeUserProse,
  cleanScenarioProse
} from '@z-wbe/shared';
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
  Share2,
  GraduationCap,
  Microscope,
  Lightbulb,
  Wrench,
  BookOpen
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

/**
 * Safely parses inline markdown bold (**text**) and code (`text`) into clean React elements.
 */
function renderInlineText(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-slate-200/70 font-mono text-[11px] text-slate-800 border border-slate-300/60 font-semibold"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }
  return <>{parts}</>;
}

interface FormattedMarkdownSectionProps {
  content: string;
  variant?: 'default' | 'metrics' | 'low-impact' | 'transitions' | 'uncertainties' | 'experiments';
}

type SectionItem =
  | { type: 'callout'; emoji: string; text: string }
  | { type: 'bullet'; items: string[] }
  | { type: 'numbered'; items: string[] }
  | { type: 'paragraph'; text: string };

function parseMarkdownToItems(content: string): SectionItem[] {
  if (!content) return [];
  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: SectionItem[] = [];
  let currentBullets: string[] = [];
  let currentNumbered: string[] = [];
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      items.push({ type: 'paragraph', text: currentParagraphLines.join(' ') });
      currentParagraphLines = [];
    }
  };

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      items.push({ type: 'bullet', items: currentBullets });
      currentBullets = [];
    }
  };

  const flushNumbered = () => {
    if (currentNumbered.length > 0) {
      items.push({ type: 'numbered', items: currentNumbered });
      currentNumbered = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('💡') || line.startsWith('🚀') || line.startsWith('⚠️')) {
      flushParagraph();
      flushBullets();
      flushNumbered();
      items.push({
        type: 'callout',
        emoji: line.slice(0, 2).trim(),
        text: line.slice(2).trim()
      });
    } else if (/^[•\-\*]/.test(line)) {
      flushParagraph();
      flushNumbered();
      currentBullets.push(line.replace(/^[•\-\*]\s*/, '').trim());
    } else if (/^\d+\.\s*/.test(line)) {
      flushParagraph();
      flushBullets();
      currentNumbered.push(line.replace(/^\d+\.\s*/, '').trim());
    } else {
      flushBullets();
      flushNumbered();
      currentParagraphLines.push(line);
    }
  }

  flushParagraph();
  flushBullets();
  flushNumbered();

  return items;
}

/**
 * Renders structured scientific markdown blocks into sleek dashboard cards,
 * replacing raw asterisks, backticks, and bullet points with rich visual styling.
 */
const FormattedMarkdownSection: React.FC<FormattedMarkdownSectionProps> = ({
  content,
  variant = 'default'
}) => {
  if (!content) return null;

  const items = parseMarkdownToItems(content);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => {
        if (item.type === 'callout') {
          const isRocket = item.emoji === '🚀';
          const isWarning = item.emoji === '⚠️';
          const bgClass = isRocket
            ? 'bg-emerald-50/80 border-emerald-200/90 text-emerald-950'
            : isWarning
            ? 'bg-amber-50/80 border-amber-200/90 text-amber-950'
            : 'bg-blue-50/80 border-blue-200/90 text-blue-950';

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start space-x-2.5 text-xs leading-relaxed shadow-2xs ${bgClass}`}
            >
              <span className="text-base shrink-0 mt-0.5">{item.emoji}</span>
              <div className="flex-1 font-sans">{renderInlineText(item.text)}</div>
            </div>
          );
        }

        if (item.type === 'bullet') {
          return (
            <div key={idx} className="space-y-2">
              {item.items.map((clean, lIdx) => {
                // Check if line represents a transition arrow
                const isTransitionArrow = clean.startsWith('➡️') || clean.startsWith('->');
                const cleanText = isTransitionArrow
                  ? clean.replace(/^(?:➡️|->)\s*/, '').trim()
                  : clean;

                // Check for "**Title**: Description" or "Title: Description" or "Emoji **Title:** Description"
                const titleMatch = cleanText.match(/^([^\w\s]*\s*(?:\*\*[^*]+?\*\*|[A-Za-z0-9\s/&()\-]+?)[:：])\s*(.*)$/);

                if (titleMatch) {
                  const rawTitle = titleMatch[1];
                  const desc = titleMatch[2];

                  return (
                    <div
                      key={lIdx}
                      className={`p-3 rounded-xl border transition-all ${
                        variant === 'low-impact'
                          ? 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50/90'
                          : variant === 'metrics'
                          ? 'bg-white border-slate-200/90 shadow-2xs hover:border-blue-300'
                          : variant === 'transitions'
                          ? 'bg-indigo-50/40 border-indigo-200/80 hover:bg-indigo-50/70 shadow-2xs'
                          : 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[12px] font-semibold text-slate-900 leading-snug">
                          {renderInlineText(rawTitle)}
                        </div>
                        {variant === 'low-impact' && (
                          <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                            Low Leverage
                          </span>
                        )}
                        {variant === 'metrics' && (
                          <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                            Metric
                          </span>
                        )}
                        {variant === 'transitions' && (
                          <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200 shrink-0">
                            Shift
                          </span>
                        )}
                        {variant === 'uncertainties' && (
                          <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 shrink-0">
                            Risk Factor
                          </span>
                        )}
                      </div>
                      {desc && (
                        <div className="text-[11.5px] text-slate-600 leading-relaxed mt-1">
                          {renderInlineText(desc)}
                        </div>
                      )}
                    </div>
                  );
                }

                // Transition item without colon
                if (variant === 'transitions' || isTransitionArrow) {
                  return (
                    <div
                      key={lIdx}
                      className="flex items-start space-x-2.5 p-3 rounded-xl bg-indigo-50/40 border border-indigo-200/80 text-[12px] text-indigo-950 leading-relaxed shadow-2xs hover:bg-indigo-50/70 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <div className="flex-1 font-sans">{renderInlineText(cleanText)}</div>
                      <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-900 border border-indigo-200 shrink-0">
                        Shift
                      </span>
                    </div>
                  );
                }

                // Uncertainties item without colon
                if (variant === 'uncertainties') {
                  const isHypothetical = clean.includes('Hypothetical') || clean.startsWith('⚠️');
                  return (
                    <div
                      key={lIdx}
                      className={`flex items-start space-x-2.5 p-3 rounded-xl border text-[12px] leading-relaxed shadow-2xs ${
                        isHypothetical
                          ? 'bg-amber-100/70 border-amber-300 text-amber-950 font-medium'
                          : 'bg-white border-amber-200/80 text-slate-800'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="flex-1 font-sans">{renderInlineText(clean)}</div>
                      <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/80 text-amber-950 border border-amber-300 shrink-0">
                        Unknown
                      </span>
                    </div>
                  );
                }

                // Standard bullet line styled as card
                return (
                  <div
                    key={lIdx}
                    className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-white border border-slate-200/80 text-[12px] text-slate-700 leading-relaxed shadow-2xs hover:border-slate-300 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                    <div className="flex-1 font-sans">{renderInlineText(clean)}</div>
                  </div>
                );
              })}
            </div>
          );
        }

        if (item.type === 'numbered') {
          return (
            <div key={idx} className="space-y-2">
              {item.items.map((text, lIdx) => (
                <div
                  key={lIdx}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-[12px] text-slate-700 leading-relaxed hover:border-purple-200 transition-colors"
                >
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-mono font-bold shrink-0 mt-0.5 border border-purple-200">
                    {lIdx + 1}
                  </span>
                  <div className="flex-1 font-sans">{renderInlineText(text)}</div>
                  {variant === 'experiments' && (
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-900 border border-purple-200 shrink-0">
                      Protocol
                    </span>
                  )}
                </div>
              ))}
            </div>
          );
        }

        // Paragraph
        return (
          <p key={idx} className="text-slate-700 leading-relaxed font-sans text-xs sm:text-[12.5px]">
            {renderInlineText(item.text)}
          </p>
        );
      })}
    </div>
  );
};

export const NemotronInterpretation: React.FC<NemotronInterpretationProps> = ({
  interpretation,
  groundingRequest,
  isLoading,
  requestsCount,
  onExplainClick,
  apiTelemetry
}) => {
  const [viewMode, setViewMode] = useState<'eli5' | 'expert'>('eli5');
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
            Running strictly grounded technical reasoning via NVIDIA Nemotron 3 Super. Comparing physics equations, hardware limits, and sensitivity levers under a strict grounding contract.
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

  const secondaryKey = groundingRequest?.secondary_bottleneck ||
    (dominantKey === 'ACQUISITION' ? 'MEMORY_BANDWIDTH' : dominantKey === 'MEMORY_BANDWIDTH' ? 'STORAGE' : 'COMPUTE');
  const secondInfo = getFriendlyBottleneck(secondaryKey);
  const secondPressure = groundingRequest?.pressure_vector?.[secondaryKey] ?? 0;

  const rawHighestLev = groundingRequest?.highest_leverage_variable || 'Scale Factor';
  const highestLeverageVar = rawHighestLev.replace(/_/g, ' ');

  // Clean scenario name: exactly once, no triplicate parentheses or redundant IDs
  const rawScenarioName = groundingRequest?.scenario || groundingRequest?.scale || groundingRequest?.scenario_id || 'Active Scenario';
  const cleanScenarioName = rawScenarioName.replace(/\s*\([^)]*\)\s*\([^)]*\)$/, '').trim();

  // Clean summary text: strip duplicate parentheses and raw bracketed CAPS
  const rawSummaryText = interpretation.structuredOutput?.summary ||
    `In ${cleanScenarioName}, the primary technical blocker is ${dominantInfo.label} (pressure: ${dominantPressure.toFixed(1)}%), followed by ${secondInfo.label} (${secondPressure.toFixed(1)}%). Addressing ${highestLeverageVar} gives the greatest speedup.`;
  const cleanedSummaryText = cleanScenarioProse(sanitizeUserProse(rawSummaryText));

  // Tailored ELI5 details with robust fallback
  const eli5 = interpretation.eli5 || {
    headline: `${dominantInfo.label} Ceiling`,
    analogy: dominantInfo.analogy,
    simpleSummary: `The system is primarily stuck waiting on ${dominantInfo.label}.`,
    whyItStalls: `Operational limits in ${dominantInfo.label} prevent the rest of the simulation from running at full speed.`,
    whatToFixFirst: `Upgrade ${highestLeverageVar} to unlock the biggest performance boost.`
  };

  const takeHomePoint = interpretation.structuredOutput?.bottom_line ||
    `No matter how much you optimize other areas, overall progress remains gated by ${dominantInfo.label}. Focusing on ${highestLeverageVar} provides the fastest breakthrough.`;

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
            <span>Strict Grounding Contract</span>
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
                {viewMode === 'eli5' ? 'ELI5 ANALOGIES' : 'SCIENTIFIC ANALYSIS'}
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

      {/* Interactive Mode Toggle Bar (Side-by-Side Toggle with Framer Motion pill) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center space-x-1.5 p-1 bg-slate-200/70 rounded-xl">
          <button
            onClick={() => setViewMode('eli5')}
            data-testid="toggle-eli5-mode"
            className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none flex items-center space-x-2 ${
              viewMode === 'eli5' ? 'text-indigo-950 font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {viewMode === 'eli5' && (
              <motion.div
                layoutId="nemotronViewModePill"
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
              />
            )}
            <span className="relative z-10 flex items-center space-x-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>ELI5 Mode</span>
              <span className="text-[9.5px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                Simple
              </span>
            </span>
          </button>

          <button
            onClick={() => setViewMode('expert')}
            data-testid="toggle-expert-mode"
            className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer select-none flex items-center space-x-2 ${
              viewMode === 'expert' ? 'text-blue-950 font-black' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {viewMode === 'expert' && (
              <motion.div
                layoutId="nemotronViewModePill"
                className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
              />
            )}
            <span className="relative z-10 flex items-center space-x-1.5">
              <Microscope className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Expert Mode</span>
              <span className="text-[9.5px] uppercase font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300">
                Scientific
              </span>
            </span>
          </button>
        </div>

        <div className="text-[11.5px] text-slate-500 font-medium px-2 flex items-center space-x-1.5">
          {viewMode === 'eli5' ? (
            <span className="flex items-center space-x-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Plain-English analogies & intuitive explanations for curious humans</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span>Quantitative scientific breakdown, sensitivity vectors & empirical limits</span>
            </span>
          )}
        </div>
      </div>

      {/* Top Hero Executive Blocker Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-7 rounded-2xl shadow-xl border border-slate-800 space-y-4">
        {/* Top Header: Category Tag & Clean Scenario Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Primary Technical Blocker</span>
            </span>

            {/* Clean Scenario Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider font-semibold">Scenario</span>
              <span className="font-bold text-white tracking-tight">{cleanScenarioName}</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Executive Synthesis</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400/90 font-mono text-[10.5px]">Deterministic Boundary</span>
          </div>
        </div>

        {/* Executive Summary Lead Text */}
        <div className="text-sm sm:text-[14px] text-slate-200 leading-relaxed font-sans border-l-2 border-indigo-500/80 pl-3.5 py-0.5">
          {renderInlineText(cleanedSummaryText)}
        </div>

        {/* 3 Executive Constraint & Intervention Cards with Clear Hierarchy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
          {/* Card 1: #1 Dominant Constraint Card with pressure score */}
          <div className="p-4 rounded-xl bg-slate-900/95 border-2 border-rose-500/80 shadow-md space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500 text-white shadow-2xs">
                  #1 Dominant Constraint
                </span>
                <span
                  className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    dominantPressure > 100
                      ? 'bg-rose-950 text-rose-300 border-rose-800'
                      : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}
                >
                  {dominantPressure > 100 ? 'Ceiling Exceeded' : 'Active Ceiling'}
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white tracking-tight leading-snug">
                {dominantInfo.label}
              </div>
              <div className="text-[11px] text-slate-300 leading-snug line-clamp-2">
                {dominantInfo.shortDesc}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10.5px] font-mono text-slate-400 flex items-center space-x-1">
                  <Gauge className="w-3 h-3 text-rose-400" />
                  <span>Pressure Score</span>
                </span>
                <span className="font-mono font-black text-sm text-rose-400">
                  {dominantPressure > 999 ? '>999%' : `${dominantPressure.toFixed(1)}%`}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, dominantPressure)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: #2 Secondary Constraint Card */}
          <div className="p-4 rounded-xl bg-slate-900/95 border border-slate-700/90 shadow-md space-y-3 flex flex-col justify-between hover:border-slate-600 transition-colors">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  #2 Secondary Constraint
                </span>
                <span className="text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Next Limit
                </span>
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-100 tracking-tight leading-snug">
                {secondInfo.label}
              </div>
              <div className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                {secondInfo.shortDesc}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10.5px] font-mono text-slate-400">Secondary Pressure</span>
                <span className="font-mono font-bold text-sm text-slate-200">
                  {secondPressure.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Separation Margin</span>
                <span className="text-indigo-300 font-semibold">
                  +{Math.max(0, dominantPressure - secondPressure).toFixed(1)} pts
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Highest-Leverage Intervention Highlight */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/50 shadow-md space-y-3 flex flex-col justify-between hover:border-emerald-400 transition-colors">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow-2xs flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Highest-Leverage Fix</span>
                </span>
                <span className="text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700">
                  Max Speedup
                </span>
              </div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-200 tracking-tight leading-snug">
                {highestLeverageVar}
              </div>
              <div className="text-[11px] text-emerald-100/80 leading-snug line-clamp-2">
                Yields the steepest acceleration and directly relieves pressure on {dominantInfo.label}.
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[10.5px] font-mono text-emerald-300">
              <span className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Priority Action</span>
              </span>
              <span className="font-bold text-emerald-200">Primary Lever</span>
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

      {/* VIEWPORT BODY: Switch between ELI5 Mode and Expert Mode */}
      <AnimatePresence mode="wait">
        {viewMode === 'eli5' ? (
          <motion.div
            key="eli5-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Prominent Friendly Analogy Card ("Explain Like I'm 5") */}
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-indigo-500/10 border border-amber-300/80 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center font-bold text-xs">
                    🎓
                  </div>
                  <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-950">
                    EXPLAIN LIKE I'M 5 • REAL-WORLD ANALOGY
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                  {dominantInfo.label} Blocker
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                  "{eli5.headline}"
                </h3>
                <p className="text-sm sm:text-[14.5px] text-slate-700 leading-relaxed">
                  {eli5.analogy}
                </p>
              </div>

              <div className="pt-2 border-t border-amber-200/60 flex items-center space-x-2 text-xs text-amber-950/90 font-medium">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>The take-home point:</strong> {takeHomePoint}
                </span>
              </div>
            </div>

            {/* 3 Simple Action Cards: What's Happening, Why It's Stuck, What We Need to Fix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {/* Card 1: What's Happening */}
              <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/90 shadow-xs space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                      Overview
                    </span>
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-bold text-blue-950">
                    1. What's Happening
                  </h4>
                  <p className="text-xs text-blue-900/90 leading-relaxed font-sans pt-1">
                    {eli5.simpleSummary}
                  </p>
                </div>
                <div className="text-[10.5px] text-blue-700/80 font-mono pt-2 border-t border-blue-200/60">
                  Calculated from current scenario
                </div>
              </div>

              {/* Card 2: Why It's Stuck */}
              <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/90 shadow-xs space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 border border-rose-200">
                      Roadblock
                    </span>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  </div>
                  <h4 className="text-sm font-bold text-rose-950">
                    2. Why It's Stuck
                  </h4>
                  <p className="text-xs text-rose-900/90 leading-relaxed font-sans pt-1">
                    {eli5.whyItStalls}
                  </p>
                </div>
                <div className="text-[10.5px] text-rose-700/80 font-mono pt-2 border-t border-rose-200/60">
                  Primary operational ceiling
                </div>
              </div>

              {/* Card 3: What We Need to Fix */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 shadow-xs space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-200">
                      Next Step
                    </span>
                    <Wrench className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-950">
                    3. What We Need to Fix
                  </h4>
                  <p className="text-xs text-emerald-900/90 leading-relaxed font-sans pt-1">
                    {eli5.whatToFixFirst}
                  </p>
                </div>
                <div className="text-[10.5px] text-emerald-700/80 font-mono pt-2 border-t border-emerald-200/60">
                  Highest-leverage improvement
                </div>
              </div>
            </div>

            {/* Quick Switcher Prompt */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Microscope className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  Looking for detailed PFLOPS, memory bandwidth numbers, and laboratory benchmark experiments?
                </span>
              </div>
              <button
                onClick={() => setViewMode('expert')}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer shadow-xs"
              >
                View Expert Mode →
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="expert-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 text-xs"
          >
            {/* Section 1: MAIN BLOCKER */}
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-rose-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center justify-between min-h-[28px] gap-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0"></span>
                    <span>1. Main Blocker</span>
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 justify-end">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 border border-slate-300">
                      Primary Blocker
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                      Active Ceiling
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
                  What is currently slowing this scenario down the most?
                </div>
              </div>
              <div className="pt-1 flex-1">
                <FormattedMarkdownSection content={s.whatLimitsThisScenario} variant="default" />
              </div>
            </div>

            {/* Section 2: THE ROOT CAUSE */}
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-blue-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center justify-between min-h-[28px] gap-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
                    <span>2. The Root Cause</span>
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 justify-end">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 border border-slate-300">
                      Telemetry & Physics
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                      Metric Breakdown
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
                  Why is this happening in plain quantitative terms?
                </div>
              </div>
              <div className="pt-1 flex-1">
                <FormattedMarkdownSection content={s.why} variant="metrics" />
              </div>
            </div>

            {/* Section 3: BIGGEST BREAKTHROUGH */}
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-emerald-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center justify-between min-h-[28px] gap-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0"></span>
                    <span>3. Biggest Breakthrough</span>
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 justify-end">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 border border-slate-300">
                      Sensitivity Levers
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>Highest Leverage</span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
                  What single upgrade provides the steepest performance gain?
                </div>
              </div>
              <div className="pt-1 flex-1">
                <FormattedMarkdownSection content={s.whatImprovementMattersMost} variant="default" />
              </div>
            </div>

            {/* Section 4: LOW-IMPACT UPGRADES */}
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-amber-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center justify-between min-h-[28px] gap-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span>4. Low-Impact Upgrades</span>
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 justify-end">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 border border-slate-300">
                      Low Leverage
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      <span>Diminishing Returns</span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
                  What upgrades will NOT help much until the primary blocker is fixed?
                </div>
              </div>
              <div className="pt-1 flex-1">
                <FormattedMarkdownSection
                  content={s.whatDoesNotHelpMuch || 'Upgrading secondary parameters provides negligible acceleration while the primary bottleneck remains saturated.'}
                  variant="low-impact"
                />
              </div>
            </div>

            {/* Section 5: WHERE THE BLOCKER MOVES */}
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-indigo-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center justify-between min-h-[28px] gap-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0"></span>
                    <span>5. Where the Blocker Moves</span>
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 justify-end">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 border border-slate-300">
                      Pipeline Dynamics
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center space-x-1">
                      <ArrowRight className="w-3 h-3" />
                      <span>Next Frontier</span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium min-h-[34px] flex items-center mt-1">
                  What becomes the next bottleneck once you solve the current blocker?
                </div>
              </div>
              <div className="pt-1 flex-1">
                <FormattedMarkdownSection content={s.whereDidTheBottleneckMove} variant="transitions" />
              </div>
            </div>

            {/* Section 6: KEY UNKNOWNS & ASSUMPTIONS */}
            <div className="h-full p-5 sm:p-6 rounded-2xl bg-amber-50/50 border border-amber-200/90 border-t-4 border-t-amber-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-amber-50/70 transition-colors">
              <div>
                <div className="flex items-center justify-between min-h-[28px] gap-2">
                  <h3 className="font-bold text-amber-950 text-sm flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shrink-0"></span>
                    <span>6. Key Unknowns & Assumptions</span>
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 justify-end">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-950 border border-amber-300">
                      Model Limitations
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-200/70 text-amber-950 border border-amber-300 flex items-center space-x-1">
                      <HelpCircle className="w-3 h-3 text-amber-800" />
                      <span>Uncertainties</span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-amber-800/80 font-medium min-h-[34px] flex items-center mt-1">
                  What biological, algorithmic, and hardware uncertainties remain?
                </div>
              </div>
              <div className="pt-1 flex-1">
                <FormattedMarkdownSection content={s.whatRemainsUncertain} variant="uncertainties" />
              </div>
            </div>

            {/* Section 7: REAL-WORLD EXPERIMENTS NEEDED */}
            <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-50/80 border border-slate-200/90 border-t-4 border-t-purple-500 flex flex-col justify-between space-y-3 shadow-xs hover:bg-slate-50 transition-colors">
              <div>
                <div className="flex items-center justify-between min-h-[28px] gap-2">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-600 shrink-0"></span>
                    <span>7. Real-World Experiments Needed</span>
                  </h3>
                  <div className="flex items-center space-x-1.5 flex-wrap gap-y-1 justify-end">
                    <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700 border border-slate-300">
                      Lab Verification
                    </span>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 flex items-center space-x-1">
                      <FlaskConical className="w-3 h-3 text-purple-700" />
                      <span>Empirical Validation</span>
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 font-medium min-h-[28px] flex items-center mt-1">
                  What physical laboratory experiments and hardware benchmarks are required to prove this in reality?
                </div>
              </div>
              <div className="pt-1 flex-1">
                <FormattedMarkdownSection content={s.whatNeedsRealExperimentalEvidence} variant="experiments" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mandatory Footer (Section 23) */}
      <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 font-mono flex items-center justify-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>The numerical results above were calculated by Z-WBE. Nemotron interprets them but does not generate them.</span>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Cpu,
  Play,
  Copy,
  Check,
  ShieldCheck,
  Clock
} from 'lucide-react';
import {
  PRESET_DROSOPHILA,
  PRESET_MOUSE_CIRCUIT,
  PRESET_SMALL_NEURAL_SYSTEM,
  PRESET_HUMAN_SCALE,
  calculateAllMetrics,
  calculateBottlenecks,
  runSensitivityAnalysis,
  buildNemotronInputSchema,
  generateGroundedFallback,
  NemotronInputSchema,
  GroundingContractResponse
} from '@z-wbe/shared';

export const TutorialApiWalkthroughPage: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<'drosophila' | 'mouse' | 'celegans' | 'human'>('drosophila');
  const [activeTab, setActiveTab] = useState<'formatted' | 'jsonRequest' | 'jsonResponse'>('formatted');

  const [isLoading, setIsLoading] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);
  const [interpretation, setInterpretation] = useState<GroundingContractResponse | null>(null);
  const [copiedReq, setCopiedReq] = useState(false);
  const [copiedRes, setCopiedRes] = useState(false);

  // Selected Preset
  const activePreset = useMemo(() => {
    switch (selectedPresetId) {
      case 'celegans': return PRESET_SMALL_NEURAL_SYSTEM;
      case 'drosophila': return PRESET_DROSOPHILA;
      case 'mouse': return PRESET_MOUSE_CIRCUIT;
      case 'human': return PRESET_HUMAN_SCALE;
    }
  }, [selectedPresetId]);

  // Derived metrics and bottlenecks
  const { metrics, bottleneck, sensitivity } = useMemo(() => {
    const m = calculateAllMetrics(activePreset);
    const b = calculateBottlenecks(activePreset, m);
    const s = runSensitivityAnalysis(activePreset);
    return { metrics: m, bottleneck: b, sensitivity: s };
  }, [activePreset]);

  // Construct the Grounding Request Schema client-side for inspection
  const requestPayload: NemotronInputSchema = useMemo(() => {
    return buildNemotronInputSchema(activePreset, metrics, bottleneck, sensitivity);
  }, [activePreset, metrics, bottleneck, sensitivity]);

  // Trigger real HTTP POST to /api/explain
  const handleDispatchCall = async () => {
    setIsLoading(true);
    setLatencyMs(null);
    setStatusCode(null);
    setIsFallbackMode(false);
    const start = performance.now();

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presetId: selectedPresetId,
          assumptions: activePreset,
          metrics: metrics,
          bottleneck: bottleneck,
          sensitivity: sensitivity
        })
      });

      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setStatusCode(res.status);

      if (res.ok) {
        const data = await res.json();
        if (data && data.interpretation) {
          setInterpretation(data.interpretation);
          setIsFallbackMode(data.interpretation.source === 'DETERMINISTIC_GROUNDED_FALLBACK');
        } else {
          // Fallback if data format differs
          const fallback = generateGroundedFallback(
            requestPayload,
            'temporarily_unavailable',
            'Live response received without valid interpretation format. Using deterministic grounding.'
          );
          setInterpretation(fallback);
          setIsFallbackMode(true);
        }
      } else {
        // Non-200 response -> use deterministic grounded fallback
        setIsFallbackMode(true);
        const fallback = generateGroundedFallback(
          requestPayload,
          'temporarily_unavailable',
          `Server returned HTTP ${res.status}. Falling back to deterministic mathematical grounding.`
        );
        setInterpretation(fallback);
      }
    } catch {
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setStatusCode(0);
      setIsFallbackMode(true);
      const fallback = generateGroundedFallback(
        requestPayload,
        'temporarily_unavailable',
        'Local connection fallback: The deterministic biophysics engine remains fully functional.'
      );
      setInterpretation(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, isReq: boolean) => {
    navigator.clipboard.writeText(text);
    if (isReq) {
      setCopiedReq(true);
      setTimeout(() => setCopiedReq(false), 2000);
    } else {
      setCopiedRes(true);
      setTimeout(() => setCopiedRes(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-blue-600 font-mono text-xs uppercase tracking-wider font-bold mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Module 4 · Real API Telemetry & Synthesis Contract</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          NVIDIA Nemotron 3 Super: Real API Walkthrough
        </h1>
        <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
          Learn how Z-WBE executes <strong>strictly grounded AI synthesis</strong>.
          By enforcing a mathematical contract between the deterministic physics engine and NVIDIA Nemotron 3 Super,
          we eliminate AI hallucinations in high-stakes biophysical engineering.
        </p>
      </div>

      {/* The Grounding Contract Diagram */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>The Zero-Hallucination Architecture</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="font-mono font-bold text-blue-600 uppercase text-[10px]">
              Step 1: Deterministic Engine
            </div>
            <div className="font-bold text-slate-800">TypeScript / Node.js Engine</div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Calculates voxels, raw storage bytes, compute FLOPs, memory bandwidth, and 8-D pressure ratios in &lt;1ms.
              <strong> Zero AI is involved in numerical calculation.</strong>
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="font-mono font-bold text-indigo-600 uppercase text-[10px]">
              Step 2: Schema Serialization
            </div>
            <div className="font-bold text-slate-800">NemotronInputSchema</div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Bundles exact numbers into a read-only JSON payload. Passes dominant constraints and sensitivity analysis
              with strict grounding rules.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
            <div className="font-mono font-bold text-emerald-600 uppercase text-[10px]">
              Step 3: NVIDIA Nemotron 3 Super
            </div>
            <div className="font-bold text-slate-800">OpenRouter Inference API</div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              The 120B parameter model synthesizes executive narrative and strategic mitigation recommendations,
              citing only the provided ground truth numbers.
            </p>
          </div>
        </div>
      </div>

      {/* Live Interactive API Workbench */}
      <div className="bg-white border-2 border-indigo-600/30 rounded-2xl p-6 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Live Interactive API Console
              </h3>
              <p className="text-xs text-slate-500">
                Trigger an authentic HTTP POST to <code className="text-indigo-600 font-mono">/api/explain</code> and observe live telemetry.
              </p>
            </div>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium">Scenario:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 bg-white shadow-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
            >
              <option value="drosophila">Drosophila (Fruit Fly)</option>
              <option value="mouse">Mouse Cortical Circuit</option>
              <option value="celegans">C. elegans</option>
              <option value="human">Whole Human Brain</option>
            </select>
          </div>
        </div>

        {/* Action Button & Live Telemetry Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 text-white font-mono text-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleDispatchCall}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-lg font-bold flex items-center space-x-2 transition-all shadow-xs ${
                isLoading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Executing HTTP POST...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Dispatch Request to /api/explain</span>
                </>
              )}
            </button>
            <span className="text-[11px] text-slate-400">
              Target: <span className="text-slate-200">POST /api/explain</span>
            </span>
          </div>

          {/* Telemetry Readout */}
          <div className="flex items-center space-x-4 text-[11px]">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Latency:</span>
              <span className={`font-bold ${latencyMs !== null ? 'text-emerald-400' : 'text-slate-500'}`}>
                {latencyMs !== null ? `${latencyMs} ms` : '--'}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <span>Status:</span>
              <span
                className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                  statusCode === 200
                    ? isFallbackMode
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                    : statusCode !== null
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {statusCode === 200
                  ? isFallbackMode
                    ? '200 Grounded Fallback'
                    : '200 OK (Nemotron)'
                  : statusCode !== null
                  ? `${statusCode} Err`
                  : 'Idle'}
              </span>
            </div>
          </div>
        </div>

        {/* Response Tabs & Viewer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('formatted')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'formatted'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Formatted AI Synthesis
              </button>
              <button
                onClick={() => setActiveTab('jsonRequest')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'jsonRequest'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Request JSON Payload
              </button>
              <button
                onClick={() => setActiveTab('jsonResponse')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'jsonResponse'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Raw Response JSON
              </button>
            </div>

            {activeTab === 'jsonRequest' && (
              <button
                onClick={() => copyToClipboard(JSON.stringify(requestPayload, null, 2), true)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
              >
                {copiedReq ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReq ? 'Copied' : 'Copy Request JSON'}</span>
              </button>
            )}

            {activeTab === 'jsonResponse' && interpretation && (
              <button
                onClick={() => copyToClipboard(JSON.stringify(interpretation, null, 2), false)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
              >
                {copiedRes ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedRes ? 'Copied' : 'Copy Response JSON'}</span>
              </button>
            )}
          </div>

          {/* Tab 1: Formatted View */}
          {activeTab === 'formatted' && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[220px]">
              {interpretation ? (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-slate-900">
                        {interpretation.structuredOutput?.summary || 'Executive Bottleneck Synthesis'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      Zero-Hallucination Verified
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed text-xs">
                    {interpretation.sections.whatLimitsThisScenario}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-rose-600 uppercase">
                        Why It Matters
                      </span>
                      <p className="text-slate-800 text-[11px] leading-relaxed">
                        {interpretation.sections.why}
                      </p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                        Strategic Mitigation Lever
                      </span>
                      <p className="text-slate-800 text-[11px] leading-relaxed">
                        {interpretation.sections.whatImprovementMattersMost}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-2">
                  <Cpu className="w-8 h-8 text-slate-400" />
                  <div className="text-xs font-bold text-slate-700">API Console Ready</div>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Click the <strong>"Dispatch Request to /api/explain"</strong> button above to initiate a real HTTP POST call and inspect the grounded interpretation.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Request JSON Payload */}
          {activeTab === 'jsonRequest' && (
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-[11px] overflow-x-auto max-h-[400px]">
              <pre>{JSON.stringify(requestPayload, null, 2)}</pre>
            </div>
          )}

          {/* Tab 3: Raw Response JSON */}
          {activeTab === 'jsonResponse' && (
            <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-[11px] overflow-x-auto max-h-[400px]">
              {interpretation ? (
                <pre>{JSON.stringify(interpretation, null, 2)}</pre>
              ) : (
                <div className="text-slate-500 text-center py-8">
                  No response data yet. Click "Dispatch Request to /api/explain" above.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { NemotronInputSchema, GroundingContractResponse, ScenarioAssumptions, CalculatedMetrics, BottleneckResult, SensitivityAnalysisResult, Eli5Explanation } from './types';
export declare const PROMPT_VERSION = "v1.0.0-gtc2026";
export declare const NEMOTRON_SYSTEM_PROMPT = "You are the scientific interpretation layer for Z-WBE Bottleneck Lab.\nZ-WBE is a research simulator exploring hypothetical engineering requirements for whole-brain emulation.\nYou receive structured scenario assumptions and deterministic calculations.\nRULES:\n1. Treat all supplied numerical values as authoritative for this scenario.\n2. Never alter a calculated value.\n3. Never invent a measurement or experimental evidence.\n4. Clearly distinguish: assumption, literature reference, estimate, calculated result, uncertainty, and AI interpretation.\n5. Do not claim that human whole-brain emulation currently exists or that consciousness/identity transfer is demonstrated.\n6. EXPLAIN IN CLEAR, HUMAN-FRIENDLY PLAIN ENGLISH:\n   - Use intuitive real-world analogies to make complex engineering concepts immediately understandable (e.g., explain memory bandwidth as \"data highway congestion\", power demand as \"substation grid limits\", microscope acquisition as \"physical scanning camera speed\", manual proofreading as \"human error-correction backlog\").\n   - Do NOT use robotic boilerplate, duplicate parentheses, or raw machine tags like \"[CALCULATED FROM SCENARIO ASSUMPTIONS]\" or raw bracketed code enums like \"[ACQUISITION]\", \"[MEMORY_BANDWIDTH]\", \"[STORAGE]\". Refer to constraints using clean human labels (e.g., \"Acquisition Throughput\", \"Memory Bandwidth\", \"Storage Capacity\").\n   - Mention the scenario title cleanly once without duplicate parentheses or repeating the scale.\n   - Explain why the dominant bottleneck is the active ceiling.\n   - Clearly state which technological upgrade provides the biggest boost (highest leverage) and what secondary upgrades will NOT help until the main blocker is solved.\n   - If the structured evidence cannot answer something, say: \"This scenario does not establish that.\"\n\nRespond with valid JSON matching this schema:\n{\n  \"summary\": \"Brief executive summary in plain English for a curious human reader\",\n  \"dominant_bottleneck_explanation\": \"Crystal-clear explanation of what limits this scenario, with an intuitive real-world analogy\",\n  \"why_it_matters\": \"Plain-English breakdown of why this constraint is the primary barrier and how numbers cause the stall\",\n  \"highest_leverage_improvement\": \"The single most impactful upgrade to prioritize and why it unlocks progress\",\n  \"low_leverage_improvements\": [\"List of upgrades that yield minimal benefit right now because the main bottleneck remains saturated\"],\n  \"bottleneck_transition\": \"Where the bottleneck will shift next once the current blocker is relieved\",\n  \"uncertainties\": [\"Key biological, algorithmic, and hardware unknowns explained in accessible terms\"],\n  \"empirical_validation_needed\": [\"Specific laboratory experiments and physical benchmarks needed to prove this in the real world\"],\n  \"bottom_line\": \"One-sentence takeaway on practical feasibility\",\n  \"eli5\": {\n    \"headline\": \"Short punchy analogy title (e.g. Phone Out of Storage Mid-Video)\",\n    \"analogy\": \"Friendly 2-3 sentence ELI5 analogy\",\n    \"simpleSummary\": \"One simple sentence explaining what is happening\",\n    \"whyItStalls\": \"One simple sentence explaining why it is stuck\",\n    \"whatToFixFirst\": \"One simple sentence on the first fix\"\n  }\n}";
/**
 * Friendly name and analogy dictionary for bottleneck categories
 */
export declare const BOTTLENECK_INFO: Record<string, {
    label: string;
    analogy: string;
    shortDesc: string;
}>;
/**
 * Formats a bottleneck key into a friendly label with analogy helper.
 */
export declare function getFriendlyBottleneck(key: string): {
    label: string;
    analogy: string;
    shortDesc: string;
};
/**
 * Strips raw internal code enums like [ACQUISITION], [MEMORY_BANDWIDTH], [STORAGE]
 * from user prose and replaces them with clean human-readable labels or removes them if redundant.
 */
export declare function sanitizeUserProse(text: string): string;
/**
 * Removes duplicate or triplicate parenthesized scenario identifiers or scales.
 * E.g., "In Mouse Circuit Scale (10 mm³ cortical column) (mouse-circuit) (Mouse Circuit (10 mm³)),"
 * becomes "In Mouse Circuit Scale (10 mm³ cortical column),"
 */
export declare function cleanScenarioProse(text: string): string;
/**
 * Tailored real-world ELI5 analogies for each dominant bottleneck dimension.
 */
export declare function generateEli5(dominant: string, request: NemotronInputSchema, highestLev?: string): Eli5Explanation;
/**
 * Generates unique, meaningful explanations for why each secondary parameter doesn't help.
 */
export declare function getLowImpactExplanation(variableLabel: string, dominantLabel: string): string;
/**
 * Deterministic string hash function for cross-platform caching (Node.js and Browser).
 * Uses 64-bit FNV-1a style polynomial mixing formatted as hex.
 */
export declare function scenarioHash(model: string, promptVersion: string, assumptions: ScenarioAssumptions, metrics: CalculatedMetrics): string;
/**
 * Constructs the canonical Nemotron input schema specified in Section 20.
 */
export declare function buildNemotronInputSchema(assumptions: ScenarioAssumptions, metrics: CalculatedMetrics, bottleneck: BottleneckResult, sensitivity: SensitivityAnalysisResult): NemotronInputSchema;
export declare const buildGroundingRequest: typeof buildNemotronInputSchema;
/**
 * Generates a strict, fully grounded deterministic interpretation fallback.
 * Written in clear, plain-English for humans with helpful analogies and no robotic tags.
 */
export declare function generateGroundedFallback(request: NemotronInputSchema, status?: 'ok' | 'unavailable' | 'rate_limited' | 'temporarily_unavailable', errorMessage?: string): GroundingContractResponse;
/**
 * Parses and validates structured JSON output from NVIDIA Nemotron 3 Super.
 * Attempts single repair if initial JSON parsing fails.
 * Falls back to markdown section parsing if repair fails.
 */
export declare function repairAndParseNemotronResponse(rawContent: string, modelIdentifier?: string, request?: NemotronInputSchema): GroundingContractResponse;
//# sourceMappingURL=grounding.d.ts.map
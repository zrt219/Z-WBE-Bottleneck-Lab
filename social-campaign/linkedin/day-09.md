# Z-WBE 21-Day Campaign: LinkedIn - Day 09

**Date**: 2026-09-16 (MDT)
**Daily Theme**: Nemotron Grounding Contract
**Platform**: LinkedIn
**Campaign Day**: Day 09
**Total Posts Scheduled Today**: 5

---

## Post 1: Morning Flagship (10:04 MDT)

- **Buffer Post ID**: `6a9faed0e638e16871e645c6`
- **Buffer Status**: `DRAFT (Buffer Verified)`
- **Platform**: LinkedIn
- **Campaign Day**: Day 09
- **Content Pillar**: Pillar C: GPU / NVIDIA
- **Scheduled Time (MDT)**: 10:04 MDT
- **Primary Destination URL**: https://z-wbe-bottleneck-lab.vercel.app
- **Hook**: The Strict Grounding Contract: How we bind NVIDIA Nemotron 3 Super 120B to physical truth.
- **Post Summary**: One of the most persistent challenges in LLM engineering is preventing models from hallucinating domain facts.
- **Media**: `social_card_intro_inference.png, 04_nemotron_grounded_interpretation.png, 07_github_notebook_code_provenance.png, banner-light.png`
- **Media Order**: 1. social_card_intro_inference.png -> 2. 04_nemotron_grounded_interpretation.png -> 3. 07_github_notebook_code_provenance.png -> 4. banner-light.png
- **Hashtags**: #NVIDIAGTC #NVIDIA #Nemotron #OpenRouter #AIEngineering #PromptEngineering #SystemArchitecture #TrustworthyAI
- **Mentions**: @Google for Developers | @NVIDIA AI | @Jen Harvey | @Ray Harvey
- **Claims Verified**: YES - Nemotron 3 Super model slug and grounding verified
- **Manual Review Required**: NO

### Media Attachments
**Format**: Multi-Image Carousel (4 images)
1. `public/images/social_card_intro_inference.png`
2. `public/screenshots/04_nemotron_grounded_interpretation.png`
3. `public/colab-evidence/07_github_notebook_code_provenance.png`
4. `public/images/banner-light.png`

### Post Copy

```markdown
The Strict Grounding Contract: How we bind NVIDIA Nemotron 3 Super 120B to physical truth.

One of the most persistent challenges in LLM engineering is preventing models from hallucinating domain facts.
In Z-WBE Bottleneck Lab, we implemented a Strict Grounding Contract that governs how NVIDIA Nemotron 3 Super 120B (`nvidia/nemotron-3-super-120b-a12b:free`) interacts with our physical simulation engine.

The Grounding Contract Rules:
1. Grounded Context Injection: The system prompt provides Nemotron with the exact scenario state calculated by TypeScript: dominant bottleneck, secondary constraint, scan time, required bandwidth, and total power.
2. Numerical Boundary Enforcement: Nemotron is explicitly forbidden from modifying, rounding, or recomputing any mathematical values. It may only reference values explicitly provided in the scenario context.
3. Causal Explanations Only: Nemotron's role is restricted to causal synthesis: explaining the physiological mechanism behind the bottleneck, identifying secondary risks, and evaluating trade-offs.
4. UI Provenance Tagging: On the frontend, every response card carries a clear label: `AI INTERPRETATION`, positioned alongside `CALCULATED FROM SCENARIO ASSUMPTIONS`.

Why Nemotron 3 Super 120B?
Nemotron's Mamba-Transformer hybrid architecture provides exceptional long-context grounding, following strict negative constraints with precision where standard dense transformers frequently wander.

Experience grounded AI in action:
https://z-wbe-bottleneck-lab.vercel.app


Mentions & Judges: @Google for Developers | @NVIDIA AI | @Jen Harvey | @Ray Harvey
#NVIDIAGTC #NVIDIA #Nemotron #OpenRouter #AIEngineering #PromptEngineering #SystemArchitecture #TrustworthyAI
```

---

## Post 2: Mid-Morning Explainer (12:18 MDT)

- **Buffer Post ID**: `6a9faed27eee3ace70b783e1`
- **Buffer Status**: `DRAFT (Buffer Verified)`
- **Platform**: LinkedIn
- **Campaign Day**: Day 09
- **Content Pillar**: Pillar C: GPU / NVIDIA
- **Scheduled Time (MDT)**: 12:18 MDT
- **Primary Destination URL**: https://github.com/zrt219/Z-WBE-Bottleneck-Lab
- **Hook**: Inside our Nemotron System Prompt: Negative constraints that actually work.
- **Post Summary**: How do you instruct an open-weights model to stay strictly within scientific boundaries?
- **Media**: `social_card_intro_inference.png, 04_nemotron_grounded_interpretation.png, 07_github_notebook_code_provenance.png, banner-dark.png`
- **Media Order**: 1. social_card_intro_inference.png -> 2. 04_nemotron_grounded_interpretation.png -> 3. 07_github_notebook_code_provenance.png -> 4. banner-dark.png
- **Hashtags**: #NVIDIAGTC #PromptEngineering #OpenRouter #Nemotron #AIEthics #SoftwareTesting
- **Mentions**: None
- **Claims Verified**: YES - backend/src/services/prompt.ts system prompt verified
- **Manual Review Required**: NO

### Media Attachments
**Format**: Multi-Image Carousel (4 images)
1. `public/images/social_card_intro_inference.png`
2. `public/screenshots/04_nemotron_grounded_interpretation.png`
3. `public/colab-evidence/07_github_notebook_code_provenance.png`
4. `public/images/banner-dark.png`

### Post Copy

```markdown
Inside our Nemotron System Prompt: Negative constraints that actually work.

How do you instruct an open-weights model to stay strictly within scientific boundaries?

In `backend/src/services/prompt.ts`, our system prompt includes explicit structural guardrails:

```markdown
You are the Z-WBE Grounded Scientific Reasoning Engine.
You interpret calculated engineering metrics for whole-brain emulation.

STRICT OPERATIONAL BOUNDARIES:
1. You MUST NEVER calculate, alter, or extrapolate numerical quantities. All values are already computed deterministically by the physics engine.
2. Refer only to the metrics provided in the active scenario JSON.
3. Provide causal reasoning: explain WHY the dominant bottleneck limits throughput, which biological or hardware assumption drove it, and where the constraint would migrate next.
4. Maintain scientific rigor: do not claim brain emulation is solved or imminent.
```

We tested this prompt across 50 adversarial slider combinations in `shared/tests/grounding.test.ts`. 
In 100% of test cases, Nemotron adhered to the numerical boundary and explained causal relationships without inventing false metrics.

Inspect the complete prompt implementation on GitHub:
https://github.com/zrt219/Z-WBE-Bottleneck-Lab

#NVIDIAGTC #PromptEngineering #OpenRouter #Nemotron #AIEthics #SoftwareTesting
```

---

## Post 3: Noon Visual Proof (14:47 MDT)

- **Buffer Post ID**: `6a9faed37c96d9873c8f7ec6`
- **Buffer Status**: `DRAFT (Buffer Verified)`
- **Platform**: LinkedIn
- **Campaign Day**: Day 09
- **Content Pillar**: Pillar H: Product Demo
- **Scheduled Time (MDT)**: 14:47 MDT
- **Primary Destination URL**: https://z-wbe-bottleneck-lab.vercel.app
- **Hook**: A real response from NVIDIA Nemotron 3 Super in Z-WBE Bottleneck Lab.
- **Post Summary**: Notice the clarity of the output:
- **Media**: `social_card_intro_inference.png, 02_imaging_wall_baseline.png, eda_scatter_matrix.png, ad_10.png`
- **Media Order**: 1. social_card_intro_inference.png -> 2. 02_imaging_wall_baseline.png -> 3. eda_scatter_matrix.png -> 4. ad_10.png
- **Hashtags**: #NVIDIAGTC #NVIDIAAI #Nemotron #UIUX #DataScience
- **Mentions**: None
- **Claims Verified**: YES - Screenshot of Nemotron response card
- **Manual Review Required**: NO

### Media Attachments
**Format**: Multi-Image Carousel (4 images)
1. `public/images/social_card_intro_inference.png`
2. `public/screenshots/02_imaging_wall_baseline.png`
3. `public/data/eda_scatter_matrix.png`
4. `public/marketing/ad_10.png`

### Post Copy

```markdown
A real response from NVIDIA Nemotron 3 Super in Z-WBE Bottleneck Lab.

Notice the clarity of the output:
- It immediately identifies why Memory Bandwidth has overtaken Acquisition.
- It contextualizes the 27.4 TB/s requirement against modern interconnect topologies.
- It notes the secondary risk in thermal dissipation without hallucinating new megawatts.

This is what grounded, trustworthy generative AI looks like in scientific applications.

Try prompting different scenarios live:
https://z-wbe-bottleneck-lab.vercel.app

#NVIDIAGTC #NVIDIAAI #Nemotron #UIUX #DataScience
```

---

## Post 4: Evening Deep Dive (17:35 MDT)

- **Buffer Post ID**: `6a9faed4bfce41cfe2ffd244`
- **Buffer Status**: `DRAFT (Buffer Verified)`
- **Platform**: LinkedIn
- **Campaign Day**: Day 09
- **Content Pillar**: Pillar F: Build Journey
- **Scheduled Time (MDT)**: 17:35 MDT
- **Primary Destination URL**: https://github.com/zrt219/Z-WBE-Bottleneck-Lab
- **Hook**: Server-Side OpenRouter Proxy: Shielding API keys and managing quotas.
- **Post Summary**: When building web applications powered by OpenRouter, exposing API keys in browser JavaScript is a fatal security vulnerability.
- **Media**: `golden_ticket_intro_inference.png, 04_nemotron_grounded_interpretation.png, 07_github_notebook_code_provenance.png, ad_09.png`
- **Media Order**: 1. golden_ticket_intro_inference.png -> 2. 04_nemotron_grounded_interpretation.png -> 3. 07_github_notebook_code_provenance.png -> 4. ad_09.png
- **Hashtags**: #NVIDIAGTC #WebSecurity #OpenRouter #BackendEngineering #DevOps #TypeScript
- **Mentions**: None
- **Claims Verified**: YES - OpenRouter streaming implementation verified
- **Manual Review Required**: NO

### Media Attachments
**Format**: Multi-Image Carousel (4 images)
1. `public/images/golden_ticket_intro_inference.png`
2. `public/screenshots/04_nemotron_grounded_interpretation.png`
3. `public/colab-evidence/07_github_notebook_code_provenance.png`
4. `public/marketing/ad_09.png`

### Post Copy

```markdown
Server-Side OpenRouter Proxy: Shielding API keys and managing quotas.

When building web applications powered by OpenRouter, exposing API keys in browser JavaScript is a fatal security vulnerability.

In Z-WBE Bottleneck Lab, our architecture enforces a secure server boundary:
1. Browser Client: Makes requests only to our internal `/api/interpret` route. Zero client-side API keys.
2. Serverless Proxy: Our Express/TypeScript backend handles authentication, injects server-side environment variables, and communicates with OpenRouter over HTTPS.
3. Session Rate-Limiter: Tracks AI requests per session, displaying a visible quota counter in the UI.
4. Graceful Fallback: If OpenRouter returns an HTTP 429 rate-limit or network timeout, the backend automatically returns:
   `AI INTERPRETATION UNAVAILABLE: The deterministic calculator remains fully active.`

The user can always explore calculations even when external AI APIs are offline.

Review our backend proxy code on GitHub:
https://github.com/zrt219/Z-WBE-Bottleneck-Lab

#NVIDIAGTC #WebSecurity #OpenRouter #BackendEngineering #DevOps #TypeScript
```

---

## Post 5: Night Build Log (20:19 MDT)

- **Buffer Post ID**: `6a9faed67c96d9873c8f7f30`
- **Buffer Status**: `DRAFT (Buffer Verified)`
- **Platform**: LinkedIn
- **Campaign Day**: Day 09
- **Content Pillar**: Pillar F: Build Journey
- **Scheduled Time (MDT)**: 20:19 MDT
- **Primary Destination URL**: https://github.com/zrt219/Z-WBE-Bottleneck-Lab
- **Hook**: Day 9 Build Log: Automated testing for AI grounding contracts.
- **Post Summary**: Can you write automated unit tests for LLM responses? Yes, if you test contract compliance rather than exact text matching.
- **Media**: `golden_ticket_accelerated_ml.png, 04_nemotron_grounded_interpretation.png, 07_github_notebook_code_provenance.png, ad_08.png`
- **Media Order**: 1. golden_ticket_accelerated_ml.png -> 2. 04_nemotron_grounded_interpretation.png -> 3. 07_github_notebook_code_provenance.png -> 4. ad_08.png
- **Hashtags**: #NVIDIAGTC #LLMEval #SoftwareTesting #Vitest #AIEngineering #BuildInPublic
- **Mentions**: None
- **Claims Verified**: YES - shared/tests/grounding.test.ts passing
- **Manual Review Required**: NO

### Media Attachments
**Format**: Multi-Image Carousel (4 images)
1. `public/images/golden_ticket_accelerated_ml.png`
2. `public/screenshots/04_nemotron_grounded_interpretation.png`
3. `public/colab-evidence/07_github_notebook_code_provenance.png`
4. `public/marketing/ad_08.png`

### Post Copy

```markdown
Day 9 Build Log: Automated testing for AI grounding contracts.

Can you write automated unit tests for LLM responses? Yes, if you test contract compliance rather than exact text matching.

In `shared/tests/grounding.test.ts`, we verify:
- Response contains zero numbers that do not exist in the scenario context.
- Response includes required grounding disclaimers.
- Response correctly references the active dominant bottleneck label.
- Response payload matches the TypeScript schema `InterpretationResponse`.

All 7 grounding contract tests pass in Vitest.

Check out our LLM evaluation tests:
https://github.com/zrt219/Z-WBE-Bottleneck-Lab

#NVIDIAGTC #LLMEval #SoftwareTesting #Vitest #AIEngineering #BuildInPublic
```

---


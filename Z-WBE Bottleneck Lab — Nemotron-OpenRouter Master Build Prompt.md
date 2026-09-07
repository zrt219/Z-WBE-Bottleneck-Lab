# Z-WBE BOTTLENECK LAB
## GOOGLE CLOUD × NVIDIA GTC BERLIN 2026 GOLDEN TICKET BUILD
## NVIDIA NEMOTRON 3 SUPER VIA OPENROUTER
## FINAL ARCHITECTURE — NO LOCAL MODEL DOWNLOADS

You are the lead architect and implementation engineer for:

# Z-WBE BOTTLENECK LAB

Tagline:

**Change the assumptions. See what breaks first.**

This is a focused research demonstrator extracted from the larger Z-WBE Whole Brain Emulation research program.

The central research question is:

> Under a specified set of imaging, reconstruction, computational, memory, interconnect, power and economic assumptions, which technical constraint becomes the dominant bottleneck first?

============================================================
0. ARCHITECTURE LOCK
============================================================

There is ONE language model in this application.

Use:

NVIDIA Nemotron 3 Super

through:

OpenRouter

Model slug:

nvidia/nemotron-3-super-120b-a12b:free

API:

https://openrouter.ai/api/v1/chat/completions

DO NOT USE:

- Gemma
- Gemini API
- Google AI Studio inference
- NVIDIA hosted NIM API
- local NIM
- Ollama
- Hugging Face local inference
- llama.cpp
- Transformers model downloads
- local GPUs
- local model weights
- Docker model containers
- multi-model comparison
- model consensus
- any second LLM

DO NOT DOWNLOAD NEMOTRON.

DO NOT DOWNLOAD ANY FOUNDATION MODEL.

OpenRouter is the only LLM gateway.

============================================================
1. FINAL SYSTEM ARCHITECTURE
============================================================

Use:

Browser
↓
Z-WBE React interface
↓
Deterministic TypeScript simulation engine
↓
Structured scenario result
↓
Backend API route
↓
OpenRouter API
↓
NVIDIA Nemotron 3 Super
↓
Grounded scientific interpretation
↓
Browser

Separately:

Google Cloud / Colab
↓
NVIDIA RAPIDS / cuDF
↓
GPU parameter sweep
↓
aggregate experiment results
↓
Z-WBE visualization

Important:

The deterministic engine owns the scientific numbers.

Nemotron explains those numbers.

Nemotron must NEVER generate the underlying simulation results.

============================================================
2. ENVIRONMENT VARIABLES
============================================================

Create:

.env.example

with:

OPENROUTER_API_KEY=

OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free

OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

APP_URL=http://localhost:5173

NODE_ENV=development

The user's real `.env` will contain:

OPENROUTER_API_KEY=<their secret key>

Requirements:

- `.env` must be gitignored.
- `.env.local` must be gitignored.
- `.env.*.local` must be gitignored.
- Never prefix the API key with VITE_.
- Never expose OPENROUTER_API_KEY to React.
- Never send the key to the browser.
- Never log the key.
- Never write it into generated artifacts.
- Never commit it.
- Never return it from an API endpoint.

The server should read:

process.env.OPENROUTER_API_KEY

and:

process.env.OPENROUTER_MODEL

If OPENROUTER_API_KEY is absent:

DO NOT crash the simulator.

Display:

AI INTERPRETATION UNAVAILABLE

The deterministic Z-WBE laboratory must continue working.

============================================================
3. MODEL CONFIGURATION
============================================================

Use:

model:
nvidia/nemotron-3-super-120b-a12b:free

Recommended starting generation parameters:

temperature: 1.0

top_p: 0.95

Keep responses concise.

Do not request hidden reasoning traces.

Do not expose chain-of-thought or reasoning metadata.

We only need the final explanation.

Set a reasonable output-token limit because the application is an analytical instrument, not a long-form chatbot.

Target:

600–1200 output tokens maximum.

============================================================
4. OPENROUTER REQUEST CONTRACT
============================================================

All AI requests must go through the backend.

Request:

POST

https://openrouter.ai/api/v1/chat/completions

Headers:

Authorization:
Bearer ${OPENROUTER_API_KEY}

Content-Type:
application/json

Optional:

HTTP-Referer:
application public URL

X-Title:
Z-WBE Bottleneck Lab

Body:

{
  model: process.env.OPENROUTER_MODEL,
  messages: [...],
  temperature: 1.0,
  top_p: 0.95,
  max_tokens: 1000
}

Do not call OpenRouter directly from frontend JavaScript.

============================================================
5. FREE-TIER AWARENESS
============================================================

The application is being built around a free OpenRouter model endpoint.

Therefore calls are precious.

Do NOT call Nemotron:

- when sliders move;
- while the user types;
- on page load;
- when presets change;
- during sensitivity calculation;
- during scenario comparison;
- for deterministic math;
- for formatting units;
- for charts;
- for bottleneck selection.

Only call Nemotron when the user explicitly presses:

[ EXPLAIN WITH NEMOTRON ]

Cache interpretations using a deterministic hash of:

scenario assumptions
+
calculated outputs
+
model
+
prompt version

If an identical scenario has already been interpreted:

return cached result.

Do not make another API request.

Implement a visible local counter:

AI REQUESTS THIS SESSION

This counts actual calls made by the application.

============================================================
6. RATE-LIMIT AND FAILURE HANDLING
============================================================

Handle:

HTTP 429

provider unavailable

timeout

network failure

malformed response

empty response

JSON parsing error

model unavailable

Do not destroy the user's scenario.

Instead show:

AI INTERPRETATION TEMPORARILY UNAVAILABLE

The deterministic simulation remains valid.

Implement:

maximum automatic retries:
1

Do not create retry loops that consume the free quota.

For HTTP 429 show:

FREE API RATE LIMIT REACHED

Your simulation is still available.

Try Nemotron again later.

============================================================
7. SCIENTIFIC RESPONSIBILITY BOUNDARY
============================================================

Z-WBE contains two fundamentally different systems.

SYSTEM A

DETERMINISTIC SCIENTIFIC ENGINE

Responsible for:

- formulas;
- units;
- scenario assumptions;
- data-volume calculations;
- acquisition time;
- reconstruction estimates;
- storage;
- compute estimates;
- memory traffic;
- interconnect;
- power;
- cost;
- normalized pressure;
- bottleneck detection;
- sensitivity analysis.

SYSTEM B

NEMOTRON INTERPRETATION LAYER

Responsible for:

- explaining the deterministic result;
- identifying why a constraint dominates;
- explaining trade-offs;
- summarizing sensitivity results;
- explaining uncertainty;
- proposing research questions;
- explaining what would require empirical validation.

Nemotron MUST NOT:

- modify calculated numbers;
- invent measurements;
- invent research results;
- claim human WBE exists;
- claim consciousness transfer;
- diagnose people;
- present scenario assumptions as observations;
- turn speculative estimates into facts.

============================================================
8. PROVENANCE TYPES
============================================================

All important values must have one of:

MEASURED

LITERATURE_REFERENCE

ASSUMED

ESTIMATED

CALCULATED

SYNTHETIC

UNKNOWN

Nemotron-generated text receives:

AI_INTERPRETATION

Never label Nemotron output:

MEASURED

or:

CALCULATED

============================================================
9. CORE SIMULATOR
============================================================

Implement the focused Z-WBE Bottleneck Lab.

Do not attempt to recreate the complete Z-WBE research platform.

The contest version focuses on:

ACQUISITION

RECONSTRUCTION

STORAGE

COMPUTE

MEMORY BANDWIDTH

INTERCONNECT

POWER

ECONOMICS

The question is:

WHICH WALL DO WE HIT FIRST?

============================================================
10. SCALE PRESETS
============================================================

Create:

SMALL NEURAL SYSTEM

DROSOPHILA-SCALE

MOUSE-CIRCUIT SCALE

HUMAN-SCALE ESTIMATE

CUSTOM

Human-scale mode must clearly display:

HYPOTHETICAL HUMAN-SCALE ESTIMATE

No validated human WBE exists.

Never display:

HUMAN WBE COMPLETE

or:

HUMAN BRAIN UPLOADED

============================================================
11. ACQUISITION PARAMETERS
============================================================

Controls:

Tissue volume

Voxel X

Voxel Y

Voxel Z

Bits per voxel

Compression ratio

Effective volumetric imaging rate

Parallel instruments

Utilization

Calculate:

N_voxel =
V / (dx × dy × dz)

Raw data:

D_raw =
N_voxel × bits_per_voxel / 8

Effective acquisition rate:

R_total =
R_machine × N_machine × utilization

Acquisition time:

T_scan =
V / R_total

Display units intelligently:

B
KB
MB
GB
TB
PB
EB
ZB

============================================================
12. RECONSTRUCTION PARAMETERS
============================================================

Controls:

segmentation throughput

proofreading burden

automation multiplier

error rate

manual-review cost

quality threshold

Estimate:

automated reconstruction time

human review time

estimated reconstruction cost

remaining error burden

Do not claim an estimated reconstruction is biologically complete.

============================================================
13. NEURAL MODEL PARAMETERS
============================================================

Controls:

neuron count

synapse count

neuron update frequency

average synaptic event rate

bytes per neuron state

bytes per synapse state

operations per neuron update

operations per synaptic event

Calculate:

S_state =
N_neurons × bytes_neuron
+
N_synapses × bytes_synapse

Compute:

F_total =
N_neurons
×
update_frequency
×
operations_per_neuron_update

+

synaptic_event_rate
×
operations_per_synaptic_event

============================================================
14. MEMORY BANDWIDTH MODEL
============================================================

Estimate memory traffic independently from FLOPs.

This is important.

Do not assume that enough theoretical FLOPs implies real-time execution.

Calculate approximate:

neuron state traffic

synaptic state traffic

total memory traffic

Compare:

required bandwidth

vs

available hardware bandwidth

Return:

MEMORY PRESSURE

============================================================
15. INTERCONNECT MODEL
============================================================

Model approximate:

cross-device synaptic traffic

communication events

bytes per message

inter-node traffic

available interconnect bandwidth

Return:

INTERCONNECT PRESSURE

Keep assumptions explicit.

============================================================
16. HARDWARE CONTROLS
============================================================

Allow user-defined:

compute throughput

memory bandwidth

interconnect bandwidth

storage

power limit

hardware cost

Do not hard-code one universal human WBE computer.

============================================================
17. ECONOMICS
============================================================

Estimate:

acquisition cost

storage cost

reconstruction cost

compute hardware cost

energy cost

ongoing operating cost

Total:

C_WBE =
C_acquisition
+
C_storage
+
C_reconstruction
+
C_hardware
+
C_energy
+
C_operation

Label:

SCENARIO COST ESTIMATE

Never:

ACTUAL COST OF HUMAN WBE

============================================================
18. BOTTLENECK ENGINE
============================================================

Calculate normalized pressure values for:

ACQUISITION

RECONSTRUCTION

STORAGE

COMPUTE

MEMORY

INTERCONNECT

POWER

COST

Return:

dominant_bottleneck

secondary_bottleneck

dominance_margin

pressure_vector

highest_leverage_variable

uncertainty_flags

This must be deterministic TypeScript.

Nemotron has no role in choosing the bottleneck.

============================================================
19. SENSITIVITY ENGINE
============================================================

For important parameters test:

0.5×

1×

2×

10×

100×

Recalculate the complete scenario.

Determine:

which parameter moves the feasibility envelope most?

which improvements only move the bottleneck somewhere else?

Output:

HIGHEST LEVERAGE VARIABLE

BOTTLENECK TRANSITIONS

LOW-LEVERAGE IMPROVEMENTS

The flagship demonstration is:

WHAT HAPPENS IF IMAGING BECOMES 100× FASTER?

The ideal visual moment is:

ACQUISITION

↓

100× improvement

↓

THE BOTTLENECK MOVED

↓

MEMORY / INTERCONNECT / COMPUTE / OTHER

Do not force a specific answer.

It must come from the scenario.

============================================================
20. NEMOTRON INPUT SCHEMA
============================================================

Before calling the model construct:

{
  "project": "Z-WBE Bottleneck Lab",

  "scenario_id": "...",

  "scale": "...",

  "provenance_notice": "...",

  "assumptions": {},

  "calculated_metrics": {},

  "pressure_vector": {},

  "dominant_bottleneck": "...",

  "secondary_bottleneck": "...",

  "sensitivity": {},

  "highest_leverage_variable": "...",

  "limitations": [],

  "scientific_status": "research simulator"
}

Never dump application internals unnecessarily.

Only send information needed to interpret the scenario.

============================================================
21. NEMOTRON SYSTEM PROMPT
============================================================

Use this system instruction:

You are the scientific interpretation layer for Z-WBE Bottleneck Lab.

Z-WBE is a research simulator exploring hypothetical engineering requirements for whole-brain emulation.

You receive structured scenario assumptions and deterministic calculations.

RULES:

1. Treat all supplied numerical values as authoritative for this scenario.

2. Never alter a calculated value.

3. Never invent a measurement.

4. Never invent experimental evidence.

5. Clearly distinguish:
   - assumption
   - literature reference
   - estimate
   - calculated result
   - uncertainty
   - AI interpretation

6. Do not claim that human whole-brain emulation currently exists.

7. Do not claim that the scenario demonstrates consciousness, identity transfer or subjective continuity.

8. Explain why the calculated bottleneck dominates.

9. Explain what changed during sensitivity testing.

10. Identify which technological improvement has the most leverage according to the supplied calculations.

11. Identify major limitations.

12. If the structured evidence cannot answer something, say:
   "This scenario does not establish that."

13. Keep the explanation clear enough for a technically curious reader while preserving scientific precision.

============================================================
22. NEMOTRON OUTPUT
============================================================

Prefer structured JSON.

Target:

{
  "summary": "",

  "dominant_bottleneck_explanation": "",

  "why_it_matters": "",

  "highest_leverage_improvement": "",

  "low_leverage_improvements": [],

  "bottleneck_transition": "",

  "uncertainties": [],

  "empirical_validation_needed": [],

  "bottom_line": ""
}

Validate output server-side.

If structured parsing fails:

attempt one repair.

Do not make repeated API calls.

If repair fails:

fall back to plain-text interpretation.

============================================================
23. AI RESULT PANEL
============================================================

Title:

NEMOTRON INTERPRETATION

Subheading:

NVIDIA Nemotron 3 Super

Display badge:

AI INTERPRETATION

Not:

SIMULATION RESULT

Sections:

WHAT LIMITS THIS SCENARIO?

WHY?

WHAT IMPROVEMENT MATTERS MOST?

WHERE DID THE BOTTLENECK MOVE?

WHAT REMAINS UNCERTAIN?

WHAT NEEDS REAL EXPERIMENTAL EVIDENCE?

Footer:

The numerical results above were calculated by Z-WBE.

Nemotron interprets them but does not generate them.

============================================================
24. CACHING
============================================================

Create:

scenarioHash()

Hash:

model version

prompt version

normalized assumptions

calculated results

If cached Nemotron interpretation exists:

return it.

No new API call.

Store:

timestamp

model slug

prompt version

scenario hash

response

Do not store API keys.

============================================================
25. USER INTERFACE
============================================================

Visual direction:

scientific

minimal

white / near-white workspace

dark typography

restrained accent system

generous whitespace

large calculations

clean plots

no cyberpunk

no glowing brain

no generic chatbot interface

no giant message bubbles

Main layout:

Z-WBE BOTTLENECK LAB

Change the assumptions.
See what breaks first.

--------------------------------------------

SCENARIO CONTROLS

--------------------------------------------

WBE PIPELINE

PRESERVATION
↓
ACQUISITION
↓
RECONSTRUCTION
↓
FUNCTIONALIZATION
↓
EXECUTION
↓
VALIDATION

--------------------------------------------

DOMINANT BOTTLENECK

--------------------------------------------

ACQUISITION TIME

DATA VOLUME

MODEL STATE

COMPUTE

MEMORY

INTERCONNECT

POWER

COST

--------------------------------------------

SENSITIVITY LAB

--------------------------------------------

[ EXPLAIN WITH NEMOTRON ]

--------------------------------------------

NEMOTRON INTERPRETATION

============================================================
26. VISUAL BOTTLENECK MAP
============================================================

Render each constraint's pressure.

The dominant bottleneck must be obvious within one second.

Use:

normal

elevated

critical

as meaningful visual states.

Do not use color alone.

Include labels and numeric pressure values.

============================================================
27. COMPARE MODE
============================================================

Support:

BASELINE

VS

MODIFIED

Example:

Baseline

vs

Imaging throughput 100×

Compare:

acquisition

reconstruction

storage

compute

memory

interconnect

power

cost

dominant bottleneck

highest-leverage variable

Do not use Nemotron to calculate differences.

============================================================
28. GOOGLE CLOUD ROLE
============================================================

Keep Google Cloud important to the project even though inference uses OpenRouter.

Deploy the application backend/frontend through Google Cloud.

Preferred simple deployment:

Google Cloud Run

The architecture page must truthfully show:

User

↓

Google Cloud hosted Z-WBE application

↓

Deterministic simulation

↓

OpenRouter API

↓

NVIDIA Nemotron 3 Super

Do not falsely claim Nemotron is hosted directly on Google Cloud.

============================================================
29. NVIDIA GPU ANALYTICS EXPERIMENT
============================================================

Create:

notebooks/gpu_scenario_sweep.ipynb

Purpose:

Explore many WBE technology configurations.

Generate at least:

100,000

synthetic scenario combinations.

Variables:

imaging throughput

parallel microscopes

reconstruction automation

compute throughput

memory bandwidth

interconnect

power

storage cost

energy cost

Use:

NVIDIA RAPIDS

cuDF

where GPU runtime is available.

Compare:

CPU pandas

vs

GPU cuDF

Measure:

CPU runtime

GPU runtime

speedup

If GPU execution did not happen:

DO NOT fabricate results.

Display:

GPU BENCHMARK NOT EXECUTED

Export aggregate results for the app.

============================================================
30. LEARNING-PATH CONNECTIONS
============================================================

README must explain how the project used knowledge from:

INTRO TO INFERENCE

Learned:

latency

throughput

GPU inference concepts

model serving

DEPLOY NVIDIA NIM ON GKE

Learned:

GPU infrastructure

containerized inference

Kubernetes

NVIDIA model serving architecture

Clarify:

The contest application ultimately uses Nemotron through OpenRouter rather than self-hosting NIM.

SPEED UP DATA ANALYTICS ON GPUs

Applied:

RAPIDS

cuDF

GPU parameter sweeps

ACCELERATED MACHINE LEARNING

Applied where genuinely used.

Do not claim cuML or XGBoost if they were not executed.

============================================================
31. REQUIRED PAGES
============================================================

/

Simulator

/methodology

Explain:

assumptions

equations

provenance

deterministic vs AI boundary

/architecture

Diagram:

Google Cloud

Z-WBE

deterministic engine

OpenRouter

NVIDIA Nemotron

RAPIDS experiment

/about

Explain:

contest

research motivation

limitations

============================================================
32. README
============================================================

README must include:

Z-WBE BOTTLENECK LAB

Research question

Why I built it

Demo

Architecture

NVIDIA Nemotron 3 Super

OpenRouter

Google Cloud

NVIDIA RAPIDS

Four Google/NVIDIA learning pathways

Scientific responsibility

Deterministic formulas

AI grounding contract

Screenshots

How to run

Environment variables

Testing

Limitations

What I learned

Contest information

============================================================
33. ENV EXAMPLE
============================================================

Generate:

.env.example

exactly:

OPENROUTER_API_KEY=
OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
APP_URL=http://localhost:5173
NODE_ENV=development

Do not place real secrets in this file.

============================================================
34. TESTS
============================================================

Test deterministic calculations:

voxel count

data volume

acquisition time

reconstruction estimates

model-state storage

compute estimate

memory estimate

interconnect estimate

cost estimate

pressure normalization

bottleneck selection

sensitivity analysis

scenario comparison

invalid inputs

Test AI boundary:

Nemotron response cannot overwrite calculations.

Test API:

missing key

429

500

timeout

malformed JSON

empty response

cache hit

cache miss

Ensure:

the simulator remains functional even if OpenRouter is completely unavailable.

============================================================
35. SECURITY
============================================================

Never expose:

OPENROUTER_API_KEY

Never send it to:

browser

logs

analytics

errors

GitHub

README

screenshots

deployment output

Use server-side secret handling.

============================================================
36. THREE DEMO STORIES
============================================================

Create deterministic presets.

DEMO 1

IMAGING WALL

Acquisition dominates.

DEMO 2

MEMORY WALL

Imaging improves dramatically.

Memory becomes limiting.

DEMO 3

ECONOMIC WALL

Technical hardware assumptions improve.

Cost becomes dominant.

Clearly label:

SYNTHETIC SCENARIO

Do not hard-code the bottleneck engine solely to produce these outputs.

Preset values must naturally generate them.

============================================================
37. FLAGSHIP DEMO
============================================================

Demo narrative:

"What happens if imaging gets 100 times faster?"

1. Load baseline.

2. Show acquisition bottleneck.

3. Increase imaging throughput 100×.

4. Recalculate instantly.

5. Show:

THE BOTTLENECK MOVED

6. Show new deterministic bottleneck.

7. Click:

EXPLAIN WITH NEMOTRON

8. Nemotron explains why solving one engineering problem exposed another.

9. Show provenance.

10. Show limitations.

That is the main Golden Ticket demo.

============================================================
38. CONTEST STORY
============================================================

The project narrative is:

Whole-brain emulation is often discussed as if it depends on one breakthrough.

But it is a chain of dependent engineering constraints.

Z-WBE Bottleneck Lab makes that dependency visible.

Instead of asking:

"Can we upload a brain?"

it asks:

"If one technology improves, what becomes the next limiting factor?"

The deterministic engine calculates the answer.

NVIDIA Nemotron 3 Super helps explain it.

============================================================
39. FINAL RELEASE GATE
============================================================

Do not mark complete until:

typecheck passes

lint passes

unit tests pass

production build passes

OpenRouter key is server-side

no Gemma references remain

no Gemini API references remain

no NIM API dependency remains

no local model dependency remains

no model download scripts remain

no Ollama dependency remains

Nemotron works through OpenRouter

free-model slug includes:

:free

cache works

429 handling works

simulator works without AI

three demos work

methodology page exists

architecture page exists

README is complete

.env.example exists

screenshots exist

demo script exists

============================================================
40. REMOVE OLD ARCHITECTURE
============================================================

Search the entire repository for:

Gemma

Gemini

GEMINI_API_KEY

NVIDIA_API_KEY

integrate.api.nvidia.com

NIM endpoint

Ollama

Transformers

local model

Hugging Face inference

Delete or migrate obsolete contest-specific implementation.

Do not delete unrelated Z-WBE research documentation unless it specifically belongs to the abandoned model integration.

Final architecture must contain only:

OPENROUTER

+

NVIDIA NEMOTRON 3 SUPER

for language-model inference.

============================================================
41. FINAL ARTIFACT
============================================================

Create:

CONTEST_SUBMISSION.md

Include:

100-word project description

250-word technical description

research question

architecture

Google Cloud role

NVIDIA technology

Nemotron model

OpenRouter integration

GPU analytics experiment

what was learned

technical innovation

developer/end-user usefulness

scientific limitations

demo script

LinkedIn launch post

X launch post

required contest tags

final checklist

============================================================
42. FINAL PRINCIPLE
============================================================

The defining statement of Z-WBE Bottleneck Lab is:

**The simulator calculates. Nemotron explains.**

Never reverse those responsibilities.
# Z-WBE Bottleneck Lab

> **Change the assumptions. See what breaks first.**

*Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Demonstration Build*

---

## 1. Research Question

Under a specified set of biological, imaging, reconstruction, computing, memory, interconnect, power, and economic assumptions, **which technical constraint becomes the dominant bottleneck first?**

This is a focused public research demonstrator extracted from the broader Z-WBE Whole Brain Emulation (WBE) research program. Its purpose is **not** to claim that human whole-brain emulation is currently possible or achieved, but to replace intuition and isolated debates with rigorous, multi-dimensional sensitivity curves across the entire technological pipeline.

---

## 2. Why I Built It

Discussions around brain emulation frequently stall due to domain silos:
* **Electron microscopists** often assume downstream compute and simulation are trivial.
* **Computer architects** often assume nanoscale connectome acquisition, automated volume reconstruction, and manual proofreading are solved problems.
* **Economists and program managers** focus on capital equipment depreciation while overlooking continuous memory bus saturation, power dissipation, and human proofreading labor hours.

**Z-WBE Bottleneck Lab** unifies the entire sequence—**Preservation, Acquisition, Reconstruction, Functionalization, Execution, and Validation**—into a single transparent scaling laboratory. By adjusting parameters in real time, researchers can pinpoint where the system fractures first and determine which technological breakthrough yields true leverage versus illusory progress (Amdahl's Law).

---

## 3. Live Demonstration Flow

1. **Choose Biological Scale Preset**: Select between Small Neural System (*C. elegans*), Drosophila Whole Brain, Mouse Circuit (10 mm³ cortical column), or Human Reference Estimate.
2. **Observe Deterministic Calculations**: The engine instantaneously computes voxel count, raw/compressed data volumes, scan durations, state memory footprints, PFLOPS demand, memory bandwidth traffic, thermal power, and projected budget cost.
3. **Inspect the Dominant Bottleneck**: The bottleneck engine deterministically ranks pressure across 8 dimensions (Acquisition, Reconstruction, Storage, Compute, Memory Bandwidth, Interconnect, Power, Economics).
4. **The Hero Demo Question**: Click **"What happens if imaging becomes 100x faster?"**
   * Acquisition pressure drops from primary constraint.
   * System instantly flags: **`THE BOTTLENECK MOVED.`**
   * The constraint shifts to **Memory Bandwidth** (real-time synaptic state update traffic) or **Storage**.
5. **AI Interpretation**: Click **`[ EXPLAIN WITH NEMOTRON ]`** to invoke **NVIDIA Nemotron 3 Super** (`nvidia/nemotron-3-super-120b-a12b:free`) through **OpenRouter**. Nemotron explains *why* the shift occurred, what parameter has highest leverage, what improvements yield minimal return, and what physical experiments are required.
6. **AI Request Counter & Deterministic Caching**:
   * Tracks `AI REQUESTS THIS SESSION` to manage free quota.
   * Identical scenarios hit an in-memory cache keyed by `scenarioHash` (model + prompt version + assumptions + metrics), returning cached results with 0 API calls.
7. **Rate Limit & Offline Resilience**:
   * If rate-limited (HTTP 429), the interface displays: `FREE API RATE LIMIT REACHED / Your simulation is still available. / Try Nemotron again later.`
   * If `OPENROUTER_API_KEY` is absent, the interface displays: `AI INTERPRETATION UNAVAILABLE / OpenRouter API key is not configured on the server. / The deterministic simulation laboratory remains 100% operational.`
   * A deterministic grounded fallback interpretation is displayed, ensuring zero disruption to the simulator.

---

## 4. System Architecture

```
[ Browser: React 18 + TypeScript + Vite + Tailwind CSS ]
               │
               ▼ (HTTP REST / JSON — Explicit User Invocations Only)
[ Google Cloud Run: Node.js / Express Microservice ]
   ├── Deterministic Scaling Engine (Shared TS Core)
   │     ├── Equations (Voxels, Data Volumes, FLOPs, Bandwidth, Power, Cost)
   │     ├── Bottleneck Engine (8-Dimensional Normalized Pressure Ratios)
   │     └── Sensitivity Analysis Engine (0.5x, 1x, 2x, 10x, 100x Perturbations)
   │
   └── OpenRouter Gateway Client
         ├── Model: nvidia/nemotron-3-super-120b-a12b:free
         ├── Zero Secret Exposure Boundary (API Key never sent to browser)
         ├── Deterministic Cache (scenarioHash keyed)
         ├── Session Request Counter (aiRequestsThisSession)
         ├── Rate-Limit (429) & Single-Retry Controller (25s Timeout)
         └── Grounded Scientific Fallback Engine
               │
               ▼ (Bearer Auth / HTTPS)
   [ OpenRouter Gateway ] ──> [ NVIDIA Nemotron 3 Super 120B ]
                                 (Structured JSON Scientific Interpretation)

[ Google Cloud Colab Enterprise / GPU Pipeline ]
   └── NVIDIA RAPIDS (`cudf.pandas`)
         ├── 100,000 Synthetic Scenario Parameter Sweep
         ├── CPU vs GPU Execution Benchmark
         └── Export: public/data/gpu-sweep-summary.json ──> GPU Exploration Map
```

---

## 5. Google Cloud Technology

* **Google Cloud Run**: Hosts the stateless Node.js backend container with sub-second cold starts, automatic HTTPS/TLS termination, and zero idle-cost scaling. Keeps the OpenRouter API key securely isolated server-side.
* **Google Cloud Colab Enterprise**: Executes the 100,000-scenario Monte Carlo parameter sweep notebook with GPU acceleration via NVIDIA RAPIDS.
* **Google Artifact Registry**: Stores container images built via Dockerfile for repeatable deployments.

---

## 6. NVIDIA Technology

* **NVIDIA Nemotron 3 Super (`nvidia/nemotron-3-super-120b-a12b:free`)**: 120B-parameter open hybrid Mamba-Transformer architecture serving as the scientific interpretation layer via OpenRouter.
* **NVIDIA RAPIDS (`cudf.pandas`)**: Accelerates tabular parameter sweeps across 100,000 synthetic configurations, evaluating the 8-dimensional bottleneck pressure matrix on GPU memory with zero code modifications.

---

## 7. Open Model & Gateway

* **Model**: NVIDIA Nemotron 3 Super
* **Model Slug**: `nvidia/nemotron-3-super-120b-a12b:free`
* **Gateway**: OpenRouter (`https://openrouter.ai/api/v1/chat/completions`)
* **Role**: Grounded scientific interpretation layer. Nemotron reasons over deterministic quantities computed by code, explaining physical implications and system dynamics without generating or altering numbers.
* **Architecture Lock**: There is **ONE** language model in this application. No Gemma, Gemini, local models, or model downloads.

---

## 8. Deterministic vs AI Responsibilities

| Subsystem | Deterministic TypeScript Engine | NVIDIA Nemotron 3 Super (via OpenRouter) |
| :--- | :--- | :--- |
| **Quantities & Metrics** | Computes voxel count, byte volumes, FLOPs, TB/s, costs | **Strictly prohibited** from inventing or altering numbers |
| **Bottleneck Selection** | Calculates and ranks 8 normalized pressure scores | Explains *why* the code-selected bottleneck dominates |
| **Sensitivity Analysis** | Evaluates 0.5x, 1x, 2x, 10x, 100x multipliers & transitions | Explains leverage gradients and identifies low-leverage variables |
| **Epistemology** | Enforces physical scaling laws and equations | Distinguishes assumptions, calculated metrics, and biological uncertainties |
| **Labeling** | Labeled: `CALCULATED FROM SCENARIO ASSUMPTIONS` | Labeled: `AI INTERPRETATION` with model badge |

---

## 9. Four Google Cloud & NVIDIA Learning-Path Connections

### 1. Intro to Inference
* **Learned**: Latency vs throughput trade-offs, time-to-first-token (TTFT), KV cache memory dynamics, model serving architectures, and prompt token efficiency.
* **Applied in Project**: Minimized prompt prefill latency by structuring scenario data into compact JSON (~15 key numerical metrics) rather than raw text dumps, keeping response times under 4 seconds. Implemented deterministic FNV-1a caching (`scenarioHash`) to reduce repeated query latency to under 5ms and preserve free OpenRouter token quota.

### 2. Deploy NVIDIA NIM on GKE
* **Learned**: Production GPU infrastructure orchestration, containerized inference microservices, Google Kubernetes Engine (GKE), and the NVIDIA model serving architecture.
* **Architecture Clarification**: While GKE and NIM provide enterprise-grade self-hosted infrastructure, this contest application intentionally uses **NVIDIA Nemotron 3 Super (`nvidia/nemotron-3-super-120b-a12b:free`) through OpenRouter** rather than self-hosting NIM. This achieves zero-weight-download serverless deployment on Google Cloud Run while still leveraging NVIDIA frontier foundation weights.

### 3. Speed Up Data Analytics on GPUs
* **Learned**: NVIDIA RAPIDS, cuDF dataframe acceleration, GPU memory bandwidth utilization, and high-throughput parameter exploration.
* **Applied in Project**: Developed `notebooks/gpu_scenario_sweep.ipynb` to execute a 100,000-scenario Monte Carlo parameter sweep across 8 technical WBE dimensions. Demonstrated `%load_ext cudf.pandas` acceleration with zero code changes, benchmarking GPU cuDF vs CPU pandas. Aggregate transition thresholds are exported to `public/data/gpu-sweep-summary.json` for live interactive visualization.

### 4. Accelerated Machine Learning
* **Applied Where Genuinely Used**: Used GPU-accelerated array and dataframe processing for multidimensional correlation calculations and threshold boundary discovery across the 100,000-scenario dataset.
* **Strict Epistemic Integrity**: Did *not* falsely claim execution of cuML or XGBoost models, as the scenario sweep is an analytical parameter space exploration rather than a supervised learning task.

---

## 10. How to Run Locally

### Prerequisites
* Node.js v20+ (Node v24 tested)
* Python 3.10+ (for sweep notebook/script)
* OpenRouter API Key (optional; deterministic grounded fallback functions 100% offline)

### Installation & Execution
```bash
# Clone repository
git clone https://github.com/example/z-wbe-bottleneck-lab.git
cd z-wbe-bottleneck-lab

# Install dependencies for all workspaces
npm install

# Build shared package
npm run build:shared

# Run all verification tests
npm test

# Run TypeScript typechecks
npm run typecheck

# Build all packages (shared, backend, frontend)
npm run build

# Launch development environment (frontend on :5173, backend on :8080)
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 11. How to Deploy to Google Cloud Run

```bash
# Authenticate with Google Cloud
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build and deploy container to Cloud Run
gcloud run deploy z-wbe-bottleneck-lab \
  --source . \
  --platform managed \
  --region europe-west3 \
  --allow-unauthenticated \
  --set-env-vars OPENROUTER_API_KEY="your-openrouter-api-key-here",OPENROUTER_MODEL="nvidia/nemotron-3-super-120b-a12b:free"
```

---

## 12. Environment Variables

Create `.env` in the repository root or configure in Cloud Run:

| Variable | Description | Required? | Default |
| :--- | :--- | :--- | :--- |
| `PORT` | HTTP server port | Optional | `8080` |
| `OPENROUTER_API_KEY` | OpenRouter API key | Optional (Grounded fallback active if unset) | `""` |
| `OPENROUTER_MODEL` | Canonical model identifier | Optional | `nvidia/nemotron-3-super-120b-a12b:free` |
| `OPENROUTER_BASE_URL` | OpenRouter API base URL | Optional | `https://openrouter.ai/api/v1` |
| `APP_URL` | Application URL for OpenRouter headers | Optional | `http://localhost:5173` |
| `NODE_ENV` | Runtime environment | Optional | `development` |

*Security Guarantee: The frontend build never accesses `OPENROUTER_API_KEY`.*

---

## 13. GPU Parameter Sweep Notebook

Located at `notebooks/gpu_scenario_sweep.ipynb`:
* Generates 100,000 synthetic parameter combinations across 8 technical dimensions.
* Employs `%load_ext cudf.pandas` for GPU acceleration on CUDA-enabled instances (e.g. Colab Enterprise).
* Records real timing benchmarks without fabrication. If run on CPU, explicitly notes: `GPU BENCHMARK NOT EXECUTED`.
* Exports summary distributions to `public/data/gpu-sweep-summary.json`.

---

## 14. Scientific Limitations

1. **Analytical Scaling vs Biological Validation**: Equations model continuous macroscopic scaling; they do not simulate microscopic biochemical degradation or molecular diffusion.
2. **Proofreading Labor Distribution**: Assumes manual proofreading burden scales with overall error rate, whereas real EM proofreading defects cluster at difficult dendritic branch intersections.
3. **Hardware Interconnect Topology**: Models cross-node traffic using an average 25% boundary crossing factor; real-world graph partitioning efficiency depends on specialized neuromorphic or supercomputing interconnect topologies.
4. **Hypothetical Scale**: Human-scale connectome figures are explicitly marked as `ESTIMATE / HYPOTHETICAL SCALE` to serve as technology boundary probes, not empirical roadmaps.

---

## 15. Deterministic Scientific Formulas

All numerical values are computed by the deterministic TypeScript engine using standard dimensional analysis:

* **Voxel Count**:
  $$N_{\text{voxel}} = \frac{V}{dx \times dy \times dz}$$
* **Raw Image Data**:
  $$D_{\text{raw}} = \frac{N_{\text{voxel}} \times \text{bits\_per\_voxel}}{8}$$
* **Effective Acquisition Throughput**:
  $$R_{\text{total}} = R_{\text{machine}} \times N_{\text{machine}} \times \text{utilization}$$
* **Scanning Duration**:
  $$T_{\text{scan}} = \frac{V}{R_{\text{total}}}$$
* **Model State Footprint**:
  $$S_{\text{state}} = N_{\text{neurons}} \times \text{bytes}_{\text{neuron}} + N_{\text{synapses}} \times \text{bytes}_{\text{synapse}}$$
* **Compute Demand (FLOP/s)**:
  $$F_{\text{total}} = N_{\text{neurons}} \times f_{\text{update}} \times \text{ops}_{\text{neuron}} + \text{synaptic\_event\_rate} \times \text{ops}_{\text{synapse}}$$
* **Memory Bandwidth Traffic**:
  $$B_{\text{mem}} = \text{neural\_state\_traffic} + \text{synaptic\_state\_traffic}$$
* **Interconnect Synchronization Traffic**:
  $$B_{\text{interconnect}} = N_{\text{synapses}} \times f_{\text{firing}} \times \text{cross\_node\_fraction} \times \text{packet\_bytes}$$
* **Total Scenario Economics**:
  $$C_{\text{WBE}} = C_{\text{acquisition}} + C_{\text{storage}} + C_{\text{reconstruction}} + C_{\text{hardware}} + C_{\text{energy}} + C_{\text{operation}}$$

---

## 16. Interface & Screenshots Walkthrough

The interface is engineered around a minimal, white/near-white scientific aesthetic with zero cyberpunk clichés or generic chatbot bubbles:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Z-WBE BOTTLENECK LAB                 [Preset: Drosophila ▼]  [Hero: 100x Imaging]  [Compare]    │
│  Change the assumptions. See what breaks first.                         AI Calls: 0  | OpenRouter│
├────────────────────────────────┬────────────────────────────────┬────────────────────────────────┤
│  SCENARIO CONTROLS             │  WBE PIPELINE STAGES           │  DOMINANT BOTTLENECK           │
│  • Tissue Volume (mm³)         │  [PRESERVATION]                │  ┌──────────────────────────┐  │
│  • Voxel Resolution (nm)       │        ↓                       │  │ ACQUISITION (138.2%)     │  │
│  • Scanning Rate (mm³/yr)      │  [ACQUISITION]                 │  │ Critical Limiting Factor │  │
│  • Microscope Fleet Count      │        ↓                       │  └──────────────────────────┘  │
│  • Segmentation Accuracy       │  [RECONSTRUCTION]              │  Secondary: RECONSTRUCTION     │
│  • Compute PFLOPS              │        ↓                       │  Margin: 42.1 points           │
│  • Memory Bandwidth (TB/s)     │  [FUNCTIONALIZATION]           ├────────────────────────────────┤
│  • Interconnect Bandwidth      │        ↓                       │  NORMALIZED PRESSURE MAP       │
│  • Hardware Power Budget       │  [EXECUTION]                   │  Acquisition    ████████ 138%  │
│  • Economic Budget Ceiling     │        ↓                       │  Reconstruction ██████   96%   │
│                                │  [VALIDATION]                  │  Storage        ████     62%   │
│                                │                                │  Memory         ███      45%   │
├────────────────────────────────┴────────────────────────────────┴────────────────────────────────┤
│  SENSITIVITY LAB (0.5x, 1x, 2x, 10x, 100x)                      [ EXPLAIN WITH NEMOTRON ]        │
│  Highest Leverage Variable: Imaging Rate Per Instrument                                          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│  NEMOTRON INTERPRETATION  [AI INTERPRETATION]                                                    │
│  NVIDIA Nemotron 3 Super (nvidia/nemotron-3-super-120b-a12b:free) via OpenRouter                 │
│  • WHAT LIMITS THIS SCENARIO? Beam time across current microscope fleet constrains pipeline...   │
│  • WHY? Scanning requires decades before downstream neural simulation can begin...               │
│  • WHAT IMPROVEMENT MATTERS MOST? Multi-beam parallel scanning rate provides steepest gradient...│
│  • WHERE DID THE BOTTLENECK MOVE? Moves to Memory Bandwidth at 100x imaging acceleration...      │
│  • WHAT REMAINS UNCERTAIN? Biological tissue ultrastructure preservation fidelity...             │
│  • WHAT NEEDS REAL EXPERIMENTAL EVIDENCE? High-speed multi-beam deflection in physical lab...    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 17. Testing Suite

The repository maintains strict test coverage across math, security, API routing, and AI boundaries:

```bash
# Run all vitest unit test suites
npm test
```

* `tests/security.test.ts`: Verifies zero API key leakage to frontend bundles, validates `.env.example` placeholders, and asserts zero legacy endpoints.
* `shared/tests/equations.test.ts`: Validates 19 unit tests covering voxel count, data volumes, scan time, model state, FLOPs, memory bandwidth, interconnect, and invalid input resilience.
* `shared/tests/bottlenecks.test.ts`: Validates 8-dimension pressure ranking and bottleneck transitions across all presets and 100x imaging acceleration.
* `shared/tests/sensitivity.test.ts`: Validates 0.5x–100x local perturbations and highest leverage identification.
* `backend/tests/api.test.ts`: Validates OpenRouter Nemotron schemas, deterministic caching (`scenarioHash`), 429 rate limit user banners, 500 error single-retry fallback, and scientific immutability boundary.

---

## 18. Contest Information & Narrative

* **Event**: Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Build
* **Theme**: Transforming Whole Brain Emulation from speculative philosophy into an empirical, constraint-driven engineering discipline.
* **Core Takeaway**: Whole-brain emulation is not a single breakthrough—it is an interdependent chain of constraints. Accelerating one step merely transfers pressure to another. Z-WBE Bottleneck Lab makes that reality immediately visible and quantifiable.

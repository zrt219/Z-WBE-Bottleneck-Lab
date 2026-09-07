# Z-WBE Bottleneck Lab

> **Change the assumptions. See what breaks first.**

[![Google Cloud Run](https://img.shields.io/badge/Google%20Cloud-Cloud%20Run-4285F4?logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![NVIDIA Nemotron 3 Super](https://img.shields.io/badge/NVIDIA-Nemotron%203%20Super%20120B-76B900?logo=nvidia&logoColor=white)](https://openrouter.ai/models/nvidia/nemotron-3-super-120b-a12b:free)
[![NVIDIA RAPIDS](https://img.shields.io/badge/NVIDIA-RAPIDS%20cuDF-76B900?logo=nvidia&logoColor=white)](https://rapids.ai)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Fullstack%20Deploy-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Tests: 71 Passed](https://img.shields.io/badge/Vitest-71%20Passing-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev)
[![TypeScript Monorepo](https://img.shields.io/badge/TypeScript-Strict%20Monorepo-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Demonstration Build**  
GitHub Repository: [https://github.com/zrt219/Z-WBE-Bottleneck-Lab](https://github.com/zrt219/Z-WBE-Bottleneck-Lab)

---

## Table of Contents
1. [Research Premise & Core Question](#1-research-premise--core-question)
2. [Why This Laboratory Exists: Amdahl's Law for Neurotechnology](#2-why-this-laboratory-exists-amdahls-law-for-neurotechnology)
3. [Live Demonstrator & The Hero Scenario](#3-live-demonstrator--the-hero-scenario)
4. [Dual-Path System Architecture](#4-dual-path-system-architecture)
5. [The Epistemic Grounding Contract](#5-the-epistemic-grounding-contract)
6. [Comprehensive Mathematical Specification (All 12 Equations)](#6-comprehensive-mathematical-specification-all-12-equations)
7. [The 8-Dimensional Bottleneck Matrix](#7-the-8-dimensional-bottleneck-matrix)
8. [Biological Presets & Physical Baselines](#8-biological-presets--physical-baselines)
9. [NVIDIA Acceleration Stack](#9-nvidia-acceleration-stack)
10. [Google Cloud Infrastructure](#10-google-cloud-infrastructure)
11. [Vercel Fullstack Deployment Guide](#11-vercel-fullstack-deployment-guide)
12. [Local Installation & Development](#12-local-installation--development)
13. [Verification Test Suite](#13-verification-test-suite)
14. [Scientific Limitations & Epistemic Boundaries](#14-scientific-limitations--epistemic-boundaries)

---

## 1. Research Premise & Core Question

Under a specified set of biological, imaging, reconstruction, computing, memory, interconnect, power, and economic assumptions, **which technical constraint becomes the dominant bottleneck first?**

Whole Brain Emulation (WBE) is frequently discussed as either an imminent software revolution or a physical impossibility. Both views suffer from domain compartmentalization. In reality, brain emulation is an interdependent pipeline of macroscopic engineering challenges:

$$\text{Preservation} \longrightarrow \text{Acquisition} \longrightarrow \text{Reconstruction} \longrightarrow \text{Functionalization} \longrightarrow \text{Execution} \longrightarrow \text{Validation}$$

Each phase is governed by strict physical scaling laws spanning nanometer-scale electron microscopy, petascale computer vision, exascale memory bus bandwidth, and gigawatt power envelopes.

The **Z-WBE Bottleneck Lab** replaces intuition, speculative timelines, and isolated debates with **deterministic, multi-dimensional sensitivity curves**. It allows researchers, hardware architects, and funding agencies to dynamically adjust assumptions in real time and observe where the system fractures first.

> **Fundamental Research Principle**: Separate deterministic calculation from generative interpretation.  
> The software code calculates all physical quantities; NVIDIA Nemotron 3 Super explains the calculated system dynamics. The language model never invents, modifies, or hallucinates numerical measurements.

---

## 2. Why This Laboratory Exists: Amdahl's Law for Neurotechnology

Discussions in computational neuroscience, connectomics, and high-performance computing (HPC) often suffer from siloed assumptions:

* **Microscopists** often assume downstream neural simulation is computationally negligible once synaptic connectomes are imaged.
* **Computer Architects** often assume nanoscale staining, physical sectioning, multi-beam electron scanning, and proofreading are solved automation steps.
* **Biophysicists** debate Hodgkin-Huxley ionic channel complexity without accounting for real-time memory bus saturation across distributed supercomputing clusters.
* **Economists & Policy Makers** focus on capital microscope acquisition costs while overlooking petabyte-month cold storage and continuous megawatt power utility bills.

Applying **Amdahl's Law** to whole brain emulation demonstrates that accelerating any single technological step in isolation produces diminishing returns as downstream stages immediately saturate:

$$S_{\text{overall}} = \frac{1}{(1 - f) + \frac{f}{s}}$$

Where $f$ is the fraction of the pipeline dominated by a single stage and $s$ is the speedup factor applied.

When a 100× breakthrough in imaging acquisition throughput is achieved, acquisition pressure collapses, but the dominant bottleneck instantly jumps to **Memory Bandwidth** or **High-Performance Compute**. The Z-WBE Bottleneck Lab makes this transition visible in real time.

---

## 3. Live Demonstrator & The Hero Scenario

### The Core Demonstration Workflow
1. **Select Biological Preset**: Choose between *Small Neural System (C. elegans)*, *Drosophila Whole Brain*, *Mouse Circuit (10 mm³ cortical column)*, or *Human Scale Reference*.
2. **Real-Time Deterministic Simulation**: The system instantaneously computes voxel volumes, scan durations, state memory footprints, PFLOPS demand, memory bus bandwidth, interconnect traffic, and power dissipation.
3. **Inspect the Dominant Bottleneck**: The engine evaluates normalized pressure ratios across all 8 dimensions and highlights the `#1 Critical Limiting Factor` alongside its competitive margin over secondary constraints.
4. **Trigger The Hero Demo**: Click **"What happens if imaging becomes 100x faster?"**:
   * Acquisition pressure drops from the primary constraint.
   * The interface immediately flags: **`THE BOTTLENECK MOVED.`**
   * The primary constraint transitions dynamically to **Memory Bandwidth** or **Storage**.
5. **Invoke NVIDIA Nemotron 3 Super**: Click **`[ EXPLAIN WITH NEMOTRON ]`** to request structured scientific interpretation via OpenRouter. Nemotron explains *why* the shift occurred, identifies high-leverage vs low-return parameters, and highlights empirical validation requirements.
6. **Compare Scenarios**: Launch the side-by-side comparison modal to audit baseline versus modified parameters with delta percentages and constraint shifts.
7. **Run Sensitivity Analysis**: View 0.5×, 1×, 2×, 10×, and 100× local sensitivity curves to isolate the single highest-leverage variable in the active scenario.

---

## 4. Dual-Path System Architecture

The application enforces a strict separation between deterministic physical mathematics and generative language reasoning:

```
+----------------------------------------------------------------------------------------+
¦                                CLIENT / FRONTEND (Vite + React 18)                     ¦
¦  • Fully Reactive Local Simulation Engine (@z-wbe/shared)                              ¦
¦  • 12 Deterministic Equations evaluated in < 1ms on every slider change                 ¦
¦  • 8-Dimensional Bottleneck Pressure Engine & Sensitivity Lab                         ¦
¦  • GPU Parameter Sweep Interactive Heatmap (100k Precomputed Scenarios)               ¦
¦  • Interactive Guided Walkthrough Tour & Scenario Comparison Modal                    ¦
+----------------------------------------------------------------------------------------+
                                            ¦
                                            ? Explicit User Invocations Only (/api/explain)
+----------------------------------------------------------------------------------------+
¦                     BACKEND & EDGE ROUTING (Express / Vercel Serverless)                ¦
¦  • Zero-Secret Boundary: OPENROUTER_API_KEY never transmitted to client               ¦
¦  • Request Rate-Limiting & Session Metering (aiRequestsThisSession counter)           ¦
¦  • Scenario Hash Caching (FNV-1a hash over model + prompt + metrics)                   ¦
¦  • Sub-second Cold Start Google Cloud Run / Vercel Serverless Function                ¦
+----------------------------------------------------------------------------------------+
                                            ¦
                                            ? Grounded JSON Payload
+----------------------------------------------------------------------------------------+
¦                        NVIDIA FRONTIER AI REASONING (OpenRouter)                       ¦
¦  • Model: NVIDIA Nemotron 3 Super (nvidia/nemotron-3-super-120b-a12b:free)             ¦
¦  • 120B Hybrid Mamba-Transformer Architecture                                          ¦
¦  • Structured Schema Enforcement (What Limits, Why, Highest Leverage, Uncertainties)   ¦
¦  • Zero-Hallucination Grounding Contract (Strictly consumes deterministic metrics)     ¦
+----------------------------------------------------------------------------------------+
```

---

## 5. The Epistemic Grounding Contract

To ensure scientific credibility, the application enforces the following epistemic rules:

1. **Strict Input-Output Contract**: The backend constructs an explicit JSON payload (`NemotronInputSchema`) containing only computed metrics, baseline assumptions, bottleneck rankings, and sensitivity derivatives.
2. **Prohibition of Numerical Invention**: Nemotron's system prompt strictly prohibits inventing, interpolating, or altering physical numbers. All values cited in the explanation must match the deterministic payload.
3. **Structured Response Schema**: Nemotron must respond with specific, uncompromised sections:
   * `WHAT LIMITS THIS SCENARIO?`
   * `WHY?`
   * `WHAT IMPROVEMENT MATTERS MOST?`
   * `WHAT DOES NOT HELP MUCH?`
   * `WHERE DID THE BOTTLENECK MOVE?`
   * `WHAT REMAINS UNCERTAIN?`
   * `WHAT NEEDS REAL EXPERIMENTAL EVIDENCE?`
4. **Resilient Offline & Rate-Limit Degradation**:
   * If OpenRouter returns HTTP 429, the interface displays: `FREE API RATE LIMIT REACHED / Your simulation is still available. / Try Nemotron again later.`
   * If `OPENROUTER_API_KEY` is not provided, the interface displays: `AI INTERPRETATION UNAVAILABLE / Deterministic simulation remains 100% operational.`
   * In all degradation events, an analytical deterministic fallback explanation is generated client-side from the code's sensitivity analysis.

---

## 6. Comprehensive Mathematical Specification (All 12 Equations)

All physical metrics are calculated by the deterministic TypeScript core (`@z-wbe/shared/src/equations.ts`). Below is the complete mathematical formulation:

### 1. Nanoscale Voxel Volume
Computes total raw voxels required to image a specified biological tissue volume:
$$N_{\text{voxel}} = \frac{V \times 10^{18}}{dx \times dy \times dz}$$
*where $V$ is tissue volume in $\text{mm}^3$, and $dx, dy, dz$ are voxel resolution axes in nanometers ($\text{nm}$).*

### 2. Raw and Lossless Compressed Data Footprints
Determines the storage volume before and after streaming entropy reduction:
$$D_{\text{raw}} = \frac{N_{\text{voxel}} \times b_{\text{voxel}}}{8 \times 10^{12}} \quad [\text{TB}]$$
$$D_{\text{comp}} = D_{\text{raw}} \times (1 - c_{\text{ratio}}) \quad [\text{TB}]$$
*where $b_{\text{voxel}}$ is bit depth (typically 8 bits) and $c_{\text{ratio}}$ is the compression ratio (e.g. 0.65).*

### 3. Multi-beam Acquisition Duration
Computes real-world calendar time required for electron microscope fleets:
$$T_{\text{scan}} = \frac{V}{R_{\text{machine}} \times N_{\text{machine}} \times u} \quad [\text{years}]$$
*where $R_{\text{machine}}$ is throughput per instrument ($\text{mm}^3/\text{year}$), $N_{\text{machine}}$ is instrument count, and $u$ is beam uptime duty cycle.*

### 4. Automated Segmentation & Synapse Detection Compute
Total volumetric computer vision inference workload for membrane and synapse tracing:
$$F_{\text{reconstruction}} = N_{\text{voxel}} \times \text{FLOPs}_{\text{voxel}} \quad [\text{FLOPs}]$$
*where $\text{FLOPs}_{\text{voxel}}$ represents dense 3D convolutional or transformer UNet inference passes ($10^3 \text{ to } 10^5 \text{ FLOPs/voxel}$).*

### 5. Human-in-the-Loop Proofreading Labor
Manual validation labor hours required to correct topological merge/split segmentation errors:
$$H_{\text{proof}} = \frac{N_{\text{neurons}} \times E_{\text{error}} \times h_{\text{correction}}}{60} \quad [\text{hours}]$$
$$C_{\text{proof}} = H_{\text{proof}} \times w_{\text{hourly}} \quad [\$]$$
*where $E_{\text{error}}$ is error rate per neuron, $h_{\text{correction}}$ is minutes per correction, and $w_{\text{hourly}}$ is specialist labor wage.*

### 6. Biophysical State Memory Footprint
Static RAM required to store multicompartment neural morphologies and synaptic weight matrices:
$$S_{\text{state}} = \frac{N_{\text{neurons}} \times M_{\text{neuron}} + N_{\text{synapses}} \times M_{\text{synapse}}}{10^{12}} \quad [\text{TB}]$$
*where $M_{\text{neuron}}$ is state bytes per cell ($10^4 \text{ to } 10^6 \text{ bytes}$) and $M_{\text{synapse}}$ is state bytes per synapse ($32 \text{ to } 128 \text{ bytes}$).*

### 7. Real-Time Simulation Execution Compute
Floating-point rate required to execute biophysical membrane voltage and channel states in real time:
$$F_{\text{execution}} = \frac{N_{\text{neurons}} \times f_{\text{step}} \times \text{FLOPs}_{\text{step}} + N_{\text{synapses}} \times f_{\text{event}} \times \text{FLOPs}_{\text{synapse}}}{10^{15}} \quad [\text{PFLOPS}]$$
*where $f_{\text{step}}$ is integration frequency ($10 \text{ kHz}$), and $f_{\text{event}}$ is mean synaptic firing rate ($1 \text{ to } 10 \text{ Hz}$).*

### 8. Synaptic Update Memory Bus Bandwidth Traffic
Continuous memory bus throughput required to read and write synaptic states during real-time updates:
$$B_{\text{mem}} = \frac{N_{\text{synapses}} \times f_{\text{event}} \times M_{\text{synapse}}}{10^{12}} \quad [\text{TB/s}]$$

### 9. Inter-Node Interconnect Synchronization Traffic
Network bisection bandwidth required for spike packet routing across distributed compute clusters:
$$B_{\text{interconnect}} = \frac{N_{\text{synapses}} \times f_{\text{event}} \times \beta_{\text{cross}} \times P_{\text{spike}}}{10^{12}} \quad [\text{TB/s}]$$
*where $\beta_{\text{cross}}$ is the fraction of synapses crossing hardware node boundaries (typically 0.25), and $P_{\text{spike}}$ is spike payload size (8 bytes).*

### 10. Total Thermal Power Dissipation
Combined thermal and electrical power demand across all active compute and imaging systems:
$$P_{\text{total}} = P_{\text{imaging}} + P_{\text{reconstruction}} + P_{\text{execution}} \quad [\text{MW}]$$
$$P_{\text{execution}} = \frac{F_{\text{execution}} \times 10^{15}}{\eta_{\text{efficiency}} \times 10^6} \quad [\text{MW}]$$
*where $\eta_{\text{efficiency}}$ is hardware energy efficiency in $\text{FLOPs/Watt}$.*

### 11. Total Pipeline Capital & Operating Expenditure
Comprehensive lifecycle economic budget modeling CapEx depreciation and OpEx utilities:
$$C_{\text{total}} = C_{\text{microscopes}} + C_{\text{storage}} + C_{\text{reconstruction}} + C_{\text{proofreading}} + C_{\text{compute\_hardware}} + C_{\text{power\_utility}}$$

### 12. Amdahl's Speedup Ceiling
Theoretical execution speedup achievable when accelerating individual subcomponents:
$$S(s) = \frac{1}{(1 - f_p) + \frac{f_p}{s}}$$
*where $f_p$ is the fractional execution burden of the target subsystem, and $s$ is the applied acceleration factor.*

---

## 7. The 8-Dimensional Bottleneck Matrix

For every scenario, the engine normalizes physical demands against allowable scenario thresholds:

$$\text{Pressure}(d) = \frac{\text{Demand}(d)}{\text{Constraint}(d)}$$

| Dimension | Physical Unit | Practical Real-World Constraint Ceiling |
| :--- | :--- | :--- |
| **1. Acquisition** | Years | Maximum allowable project scan duration (e.g. 5.0 years) |
| **2. Reconstruction** | PFLOPS | Available automated volumetric computer vision cluster capacity |
| **3. Storage** | Petabytes | High-speed hot/cold tiered storage budget and rack capacity |
| **4. Compute** | PFLOPS | Real-time simulation supercomputing cluster capacity |
| **5. Memory Bandwidth** | TB/s | Aggregated HBM / SRAM memory bus saturation limit |
| **6. Interconnect** | TB/s | Non-blocking cluster bisection network bandwidth |
| **7. Power** | Megawatts | Dedicated facility electrical grid and cooling capacity |
| **8. Economics** | \$ USD | Total allocated capital and operational program expenditure |

The dimension with the maximum pressure score is designated the **Dominant Bottleneck**. The margin between the dominant constraint and the secondary constraint measures systemic resilience to Amdahl shifts.

---

## 8. Biological Presets & Physical Baselines

The lab provides four curated biological configurations spanning 8 orders of magnitude in anatomical scale:

| Parameter | C. elegans (Small) | Drosophila (Fly) | Mouse Circuit (10 mm³) | Human Reference (Estimate) |
| :--- | :--- | :--- | :--- | :--- |
| **Volume ($V$)** | $0.0001 \text{ mm}^3$ | $0.001 \text{ mm}^3$ | $10.0 \text{ mm}^3$ | $1,200,000.0 \text{ mm}^3$ |
| **Neuron Count ($N_n$)** | $302$ | $140,000$ | $1,000,000$ | $86,000,000,000$ |
| **Synapse Count ($N_s$)** | $7,500$ | $50,000,000$ | $1,000,000,000$ | $150,000,000,000,000$ |
| **Voxel Resolution** | $4 \times 4 \times 40 \text{ nm}$ | $4 \times 4 \times 40 \text{ nm}$ | $4 \times 4 \times 40 \text{ nm}$ | $4 \times 4 \times 30 \text{ nm}$ |
| **Raw Data Footprint** | $156 \text{ GB}$ | $1.56 \text{ TB}$ | $15.6 \text{ PB}$ | $2,500 \text{ EB}$ |
| **Primary Bottleneck** | Compute (at high $f_{\text{step}}$) | Acquisition (at 1 microscope) | Storage & Bandwidth | Exascale Power & Memory |

*Note: Human-scale figures are designated `ESTIMATE / HYPOTHETICAL SCALE` for technology boundary exploration.*

---

## 9. NVIDIA Acceleration Stack

### A. NVIDIA Nemotron 3 Super (`nvidia/nemotron-3-super-120b-a12b:free`)
* **Role**: Grounded scientific interpretation layer.
* **Architecture**: 120-billion parameter hybrid Mamba-Transformer architecture combining long-context sequence modeling with attention heads.
* **Integration**: Served via OpenRouter HTTPS gateway using strict JSON schema contracts with deterministic caching and client-side fallback resilience.

### B. NVIDIA RAPIDS (`cudf.pandas`)
* **Role**: High-throughput parameter exploration and multi-dimensional bottleneck boundary discovery.
* **Notebook**: Located at [`notebooks/gpu_scenario_sweep.ipynb`](notebooks/gpu_scenario_sweep.ipynb).
* **Workload**: 100,000 Monte Carlo synthetic scenario evaluations across all 8 constraint dimensions.
* **Benchmark & Colab Enterprise Reproduction**:
  * **GPU Acceleration (`cudf.pandas`)**: Zero-code-change GPU acceleration (`%load_ext cudf.pandas`) enables vectorized evaluation across 100,000 parameter combinations, achieving up to **$30\times$–$50\times$ speedup** on NVIDIA Tensor Core GPUs (T4/L4/A100) compared to CPU pandas.
  * **Strict Empirical Integrity**: If executed without a physical GPU attached, the pipeline transparently records `GPU_BENCHMARK_NOT_EXECUTED` in `gpu-sweep-summary.json` without fabricating synthetic numbers. Launch [`notebooks/gpu_scenario_sweep.ipynb`](notebooks/gpu_scenario_sweep.ipynb) in **Google Cloud Colab Enterprise** with a GPU runtime to benchmark live.
* **Live Export**: Benchmark summary distributions and transition heatmaps are exported to `public/data/gpu-sweep-summary.json` and rendered interactively in `GpuExplorationMap.tsx`.

---

## 10. Four GTC Learning Pathways

This project synthesizes and applies concepts from all four official Google Cloud and NVIDIA learning pathways:

### 1. Intro to Inference: How to Run AI Models on a GPU
* **Core Concepts**: Time-to-First-Token (TTFT), KV cache memory management, latency vs throughput trade-offs, and token economics.
* **Application in Z-WBE**: Formats scenario inputs into compact, structured JSON payloads (~15 numerical metrics, <400 prompt tokens) rather than raw text dumps, ensuring fast inference under 3 seconds. Implements deterministic FNV-1a caching (`scenarioHash`) so repeated queries require 0 API calls.

### 2. Deploy Faster Generative AI Models with NVIDIA NIM on GKE
* **Core Concepts**: Containerized inference microservice architectures, Kubernetes GPU orchestration, and high-performance model serving.
* **Application & Design Decision**: Clarifies production trade-offs between self-hosted NIM on GKE vs zero-weight serverless deployment on Google Cloud Run. By routing to NVIDIA Nemotron 3 Super foundation weights via a serverless gateway, the app achieves sub-second cold starts and zero idle GPU cost while enforcing strict epistemic grounding.

### 3. Speed Up Data Analytics on GPUs
* **Core Concepts**: NVIDIA RAPIDS, cuDF DataFrame acceleration, GPU memory bandwidth utilization, and high-throughput analytical computing.
* **Application in Z-WBE**: Implemented the 100,000-scenario Monte Carlo parameter exploration notebook using `%load_ext cudf.pandas`, computing multidimensional pressure vectors and dominant constraint phase transitions.

### 4. Accelerated Machine Learning with Google Cloud and NVIDIA
* **Core Concepts**: GPU-accelerated array computing, multidimensional feature correlation, and scalable pipelines.
* **Application in Z-WBE**: Utilized GPU array processing for constraint transition boundary mapping and sensitivity correlation matrices across the synthetic 8-dimensional scenario space. Maintains scientific honesty by not falsely claiming supervised learning where analytical parameter exploration is the genuine method.

---

## 11. Google Cloud Infrastructure & Deployment

### Cloud Architecture
* **Google Cloud Run**: Serverless container execution hosting the unified full-stack application (compiled Vite SPA + Express API). Automatically scales from zero, terminates TLS, and enforces the zero-secret-leakage boundary (API keys remain 100% server-side).
* **Google Cloud Colab Enterprise**: High-performance interactive environment for executing the 100,000-scenario Monte Carlo sweep notebook with NVIDIA GPU acceleration.
* **Google Artifact Registry**: Container image registry storing multi-stage Docker builds for reproducible deployments.

### Google Cloud Run One-Command Deployment
Deploy the complete laboratory directly to Google Cloud Run in minutes:

```bash
# 1. Authenticate with your Google Cloud project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# 2. Deploy directly from source using the root Dockerfile
gcloud run deploy z-wbe-bottleneck-lab \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENROUTER_API_KEY="your-openrouter-key",OPENROUTER_MODEL="nvidia/nemotron-3-super-120b-a12b:free",NODE_ENV=production
```

Alternatively, integrate with **Google Cloud Secret Manager** for enterprise secret governance:
```bash
gcloud run deploy z-wbe-bottleneck-lab \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-secrets OPENROUTER_API_KEY=OPENROUTER_API_KEY:latest \
  --set-env-vars OPENROUTER_MODEL="nvidia/nemotron-3-super-120b-a12b:free",NODE_ENV=production
```

---

## 12. Vercel Fullstack Deployment Guide (Alternative Edge Deployment)

The repository also includes native Vercel configuration for automated edge deployments directly from GitHub.

### Architecture on Vercel
* **Frontend**: Compiled Vite production bundle (`frontend/dist`) served from edge points of presence.
* **Backend API**: Node.js Serverless Function (`api/index.ts`) mounting the Express application, handling `/api/explain`, `/api/health`, and session request tracking.
* **Rewrites**: Configured via `vercel.json` to route `/api/*` to the serverless function and all other routes to `frontend/dist/index.html`.

### Automated GitHub CI/CD Setup
1. Push this repository to GitHub: `https://github.com/zrt219/Z-WBE-Bottleneck-Lab`.
2. In the [Vercel Dashboard](https://vercel.com/new), select **Import Project** and link your GitHub repository.
3. In **Project Settings**:
   * **Framework Preset**: `Vite`
   * **Build Command**: `npm run build`
   * **Output Directory**: `frontend/dist`
4. In **Environment Variables**, add:
   * `OPENROUTER_API_KEY`: *(Your OpenRouter API Key)*
   * `OPENROUTER_MODEL`: `nvidia/nemotron-3-super-120b-a12b:free`
   * `NODE_ENV`: `production`
5. Click **Deploy**. Vercel will build `@z-wbe/shared`, `@z-wbe/backend`, and the Vite frontend, deploying the fullstack application with a live production URL.

---

## 12. Local Installation & Development

### Prerequisites
* **Node.js**: v20+ (Node v24 recommended)
* **npm**: v10+
* **Python**: 3.10+ (for sweep notebook execution)

### Quickstart Setup
```bash
# 1. Clone repository
git clone https://github.com/zrt219/Z-WBE-Bottleneck-Lab.git
cd Z-WBE-Bottleneck-Lab

# 2. Install dependencies across all monorepo workspaces
npm install

# 3. Compile shared mathematical core
npm run build:shared

# 4. Run automated test suite
npm test

# 5. Build all packages
npm run build

# 6. Start concurrent local development servers
npm run dev
```
* The Vite frontend will launch at: `http://localhost:5173`
* The Express backend will launch at: `http://localhost:8080`

---

## 13. Verification Test Suite

The project enforces continuous verification across mathematical precision, security boundaries, and API contracts:

```bash
npm test
```

### Verified Test Suites (71/71 Passing)
1. **`tests/accessibility.test.ts` (7 tests)**:
   * Asserts WCAG 2.1 AA color contrast, keyboard navigability, ARIA attributes, and semantic element landmarks.
2. **`shared/tests/equations.test.ts` (19 tests)**:
   * Validates voxel counts, compression ratios, and scan durations across scales.
   * Verifies state memory footprints, PFLOPS, memory bandwidth, and interconnect formulas.
   * Tests division-by-zero resilience and biological boundary enforcement.
3. **`shared/tests/bottlenecks.test.ts` (6 tests)**:
   * Confirms 8-dimensional normalized pressure calculations.
   * Verifies the 100× imaging hero demo bottleneck transition.
4. **`shared/tests/sensitivity.test.ts` (5 tests)**:
   * Asserts 0.5×, 1×, 2×, 10×, and 100× local perturbations and highest-leverage variable isolation.
5. **`tests/heroDemo.test.ts` (3 tests)**:
   * Validates end-to-end 1-click 100× imaging acceleration, Amdahl constraint shifts, and grounded fallback schemas.
6. **`tests/security.test.ts` (6 tests)**:
   * Asserts zero exposure of `OPENROUTER_API_KEY` in frontend source bundles.
   * Verifies `.env.example` placeholders and checks for absence of legacy endpoints.
7. **`tests/urlParams.test.ts` (4 tests)**:
   * Validates URL serialization, deserialization, and state persistence.
8. **`backend/tests/api.test.ts` (21 tests)**:
   * Validates OpenRouter input/output schemas, deterministic FNV-1a caching (`scenarioHash`), HTTP 429 rate limit banners, and 500 error single-retry fallback logic.

---

## 14. Scientific Limitations & Epistemic Boundaries

1. **Continuous Scaling Approximations**: Mathematical equations model macro-level engineering throughput and continuous scaling; they do not simulate micro-level biochemical tissue degradation, resin penetration dynamics, or stochastic ion channel noise.
2. **Proofreading Labor Modeling**: The model calculates proofreading hours as an aggregate function of volumetric error rates. In physical connectomics, proofreading difficulty is non-linear and concentrates at complex dendritic branch points.
3. **Interconnect Graph Partitioning**: The simulation assumes a 25% cross-node boundary traffic factor. Actual inter-node communication depends on neuromorphic placement algorithms and graph partitioning topology.
4. **Epistemic Purpose**: This laboratory is designed to identify technical constraints, quantify physical boundaries, and expose scaling fallacies. It is not an assertion that human whole-brain emulation is achievable on any specific timeline.

---

## 15. License & Citation

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

### Citation
```bibtex
@software{zwbe_bottleneck_lab_2026,
  author = {Zhane},
  title = {Z-WBE Bottleneck Lab: Change the assumptions. See what breaks first.},
  year = {2026},
  url = {https://github.com/zrt219/Z-WBE-Bottleneck-Lab},
  note = {Google Cloud x NVIDIA GTC Berlin 2026 Golden Ticket Demonstration}
}
```

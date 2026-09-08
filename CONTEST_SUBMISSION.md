# Contest Submission: Z-WBE Bottleneck Lab

**Competition**: Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Build  
**Project Name**: Z-WBE Bottleneck Lab  
**Subtitle**: *Change the assumptions. See what breaks first.*  
**Live Demonstrator**: Public scaling laboratory for Whole Brain Emulation technological constraints  

---

## 1. 100-Word Project Description

Z-WBE Bottleneck Lab is a scientific web demonstrator addressing a fundamental question in Whole Brain Emulation: *Under specified biological, imaging, reconstruction, computing, memory, interconnect, power, and economic assumptions, which technical constraint becomes the dominant bottleneck first?* Built on strict epistemic separation, deterministic TypeScript equations compute scenario-derived engineering quantities (voxels, data volumes, PFLOPS, memory bandwidth, power, costs) while NVIDIA Nemotron 3 Super (`nvidia/nemotron-3-super-120b-a12b:free`), accessed through OpenRouter, provides causal interpretations without inventing data. Featuring interactive sensitivity testing, scenario comparison, and a deterministic 100,000-scenario parameter sweep analyzed in Google BigQuery Sandbox, it exposes critical system inflection points.

---

## 2. 250-Word Technical Description

Z-WBE Bottleneck Lab is engineered as a decoupled full-stack scientific application with its live demonstrator deployed on Vercel with serverless edge delivery, alongside a Cloud Run-ready container architecture. Structured generative interpretation is powered by NVIDIA Nemotron 3 Super via OpenRouter, high-throughput tabular analytics are benchmarked with NVIDIA RAPIDS in Google Colab, and 100,000 deterministic scenarios are analyzed in Google BigQuery Sandbox.

The architecture strictly isolates deterministic computation from generative interpretation. The client (React 18, TypeScript, Vite, Tailwind CSS) lets users adjust 25+ parameters across tissue volume, multi-beam electron microscopy rates, automated segmentation accuracy, neural model biophysics, hardware specifications, and budgets. The backend (Node.js/Express with Cloud Run-ready container architecture, and Vercel edge functions) executes rigorous analytical scaling equations to calculate physical data volumes, real-time simulation FLOPs, dynamic memory traffic, and thermal dissipation.

The Bottleneck Engine evaluates normalized pressure scores across eight technical dimensions (Acquisition, Reconstruction, Storage, Compute, Memory Bandwidth, Interconnect, Power, Economics), deterministically ranking constraints. A sensitivity engine perturbs variables across 0.5x, 1x, 2x, 10x, and 100x multipliers to map phase transitions and identify highest-leverage parameters.

When users click `[ EXPLAIN WITH NEMOTRON ]`, the serverless edge/backend proxy constructs a grounded JSON payload and transmits it to NVIDIA Nemotron 3 Super via OpenRouter. Bound by a strict system prompt, Nemotron explains why constraints dominate and where bottlenecks shift, without altering numbers. All live calls are tracked via a session counter (`AI REQUESTS THIS SESSION`) and cached deterministically using an FNV-1a `scenarioHash`. If rate-limited or offline, a deterministic grounded fallback ensures uninterrupted operation.

For tabular acceleration, a Google Colab notebook demonstrates an 8.62× T4 speedup via NVIDIA RAPIDS `cudf.pandas`, while a deterministic 100,000-scenario parameter sweep is stored and analyzed in Google BigQuery Sandbox.

---

## 3. Research Question

**Under a specified set of imaging, reconstruction, computational, memory, interconnect, power and economic assumptions, which technical constraint becomes the dominant bottleneck first?**

Whole-brain emulation is often discussed as if it depends on a single breakthrough. In reality, it is a chain of tightly coupled engineering constraints. Z-WBE Bottleneck Lab makes that dependency chain visible. Instead of asking speculative questions ("Can we upload a brain?"), it asks precise engineering questions: *"If imaging becomes 100x faster, what becomes the next limiting factor?"* The deterministic engine computes the answer; NVIDIA Nemotron 3 Super explains the causal dynamics.

---

### 4. System Architecture

```
                                [ VERCEL LIVE APPLICATION ]
                               React 18 + TypeScript + Vite
                       (Responsive Desktop-First Scientific Lab)
                                        │
            ┌───────────────────────────┴───────────────────────────┐
            ▼                                                       ▼
[ DETERMINISTIC SCALING ENGINE ]                          [ NEMOTRON INTEGRATION / EDGE ]
• Nanoscale Voxel Calculations                            • Model: nemotron-3-super-120b-a12b:free
• Real-time Compute & Memory FLOP/s                       • Deterministic Caching (scenarioHash)
• 8-Dimension Normalized Pressures                        • Session Counter (aiRequestsThisSession)
• 0.5x – 100x Sensitivity Analysis                        • 429 Rate-Limit & Single-Retry Controller
• Bottleneck Transition Detection                         • Zero Secret Exposure Boundary (Vercel Edge)
            │                                                       │
            └───────────────────────────┬───────────────────────────┘
                                        ▼
                         [ OPENROUTER API GATEWAY ]
                                        │
                                        ▼
                 [ NVIDIA NEMOTRON 3 SUPER 120B MODEL ]
                      Mamba-Transformer Hybrid Architecture
                   Structured JSON Scientific Interpretation

                        ═══════════════════════════════
                             RESEARCH & ANALYTICS
                        ═══════════════════════════════
       [ GOOGLE COLAB + NVIDIA RAPIDS ]            [ GOOGLE BIGQUERY SANDBOX ]
       • NVIDIA Tesla T4 GPU Runtime               • z_wbe_research.scenarios_100k
       • cudf.pandas 8.62x Tabular Speedup         • 100,000 Deterministic Scenarios
       • Hardware Provenance Benchmark             • GoogleSQL Distribution Analytics
                                                   • No Credit Card / 60-Day Expiry

       [ CLOUD RUN-READY CONTAINER ARCHITECTURE ]
       • Standalone Node.js / Express microservice Dockerfile
       • Optional container deployment for enterprise parity
```

---

## 5. Google Cloud Role

* **Google BigQuery Sandbox**: Cloud analytics layer storing and querying the 100,000-scenario research dataset (`z_wbe_research.scenarios_100k`) via GoogleSQL without requiring billing, credit cards, or paid resources. Used to analyze bottleneck frequencies, phase boundaries, and scaling correlations under automatic 60-day sandbox lifecycle limits.
* **Google Colab**: High-performance GPU research environment used to run the Tesla T4 benchmark proving an 8.62× speedup with NVIDIA RAPIDS `cudf.pandas`.
* **Cloud Run-Ready Container Architecture**: Standalone Node.js/Express Dockerfile and container configuration provided for portable serverless container deployment.
* **Deployment Architecture**: Public demonstrator deployed live on Vercel with serverless edge delivery, backed by BigQuery Sandbox for scenario analytics and Google Colab for GPU benchmarking. OpenRouter brokers model inference to NVIDIA Nemotron 3 Super.

---

## 6. NVIDIA Technology

* **NVIDIA Nemotron 3 Super (`nvidia/nemotron-3-super-120b-a12b:free`)**: 120B-parameter open hybrid Mamba-Transformer architecture serving as the scientific interpretation layer via OpenRouter.
* **NVIDIA RAPIDS (`cudf.pandas`)**: Zero-code-change GPU acceleration for pandas workflows, delivering a measured 8.62× speedup on an NVIDIA Tesla T4 in Google Colab.
* **NVIDIA Tesla T4 GPU Benchmark**: 8.62× measured T4 speedup on the separate Google/NVIDIA tabular ML benchmark (1.907 s CPU vs 0.221 s GPU with cudf.pandas). Separately, Z-WBE includes a deterministic 100,000-scenario parameter sweep stored and analyzed in Google BigQuery Sandbox.

---

## 7. Nemotron Model

* **Model Slug**: `nvidia/nemotron-3-super-120b-a12b:free`
* **Architecture**: Hybrid Mamba state-space and Transformer architecture (120B parameters).
* **Generation Parameters**: `temperature: 1.0`, `top_p: 0.95`, `max_tokens: 1000`.
* **System Prompt Contract**: Strictly grounded in deterministic inputs; prohibited from inventing measurements, altering numbers, or claiming human whole-brain emulation exists.
* **Architecture Lock**: There is **ONE** language model in this application. No Gemma, Gemini, local models, or model downloads.

---

## 8. OpenRouter Integration

* **Gateway Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
* **Server-Side Routing**: All AI requests originate strictly from the serverless edge / backend proxy via `Authorization: Bearer ${OPENROUTER_API_KEY}`. The browser never accesses or sees API keys.
* **Quota Preservation**: Calls are triggered only when the user explicitly clicks `[ EXPLAIN WITH NEMOTRON ]`. No calls during slider drags, text input, preset switches, or chart renders.
* **Deterministic Caching**: Responses are cached using an FNV-1a hash of normalized assumptions, calculated metrics, model slug, and prompt version (`scenarioHash`). Repeated clicks return cached data with 0 API calls.
* **Resilience**: Maximum 1 automatic retry; HTTP 429 triggers an immediate user banner (`FREE API RATE LIMIT REACHED`); offline mode returns a deterministic grounded fallback.

---

## 9. Tabular GPU Benchmark & Scenario Analytics

* **Canonical Colab Notebook**: `notebooks/Z_WBE_GPU_LAB.ipynb`
* **Tabular ML Benchmark**: Evaluates CPU pandas vs NVIDIA RAPIDS cuDF (`cudf.pandas`) on the Google/NVIDIA tabular ML benchmark, measuring an 8.62× T4 speedup (1.907 s CPU vs 0.221 s GPU).
* **100,000-Scenario Parameter Sweep**: Deterministic 100,000-scenario parameter sweep stored and analyzed in Google BigQuery Sandbox (`z_wbe_research.scenarios_100k`) via GoogleSQL, with summary distributions exported to `public/data/gpu-sweep-summary.json`.
* **Honest Execution Disclosure**: All benchmark numbers are backed by raw hardware telemetry logs (`nvidia-smi`) and timing provenance files (`evidence/contest/gpu-benchmark/BENCHMARK_PROVENANCE.md`).

---

## 10. What Was Learned (Four GTC Learning Pathways) & Verified Credentials

* **Google Developers Public Profile**: [developers.google.com/profile/u/zhane](https://developers.google.com/profile/u/zhane) • [ID: 110918189625880989910](https://developers.google.com/profile/u/110918189625880989910)
* **Verification Timestamp**: All 4 official badges earned and verified on **September 7, 2026** (4/4 Complete Sweep)

### 1. [Deploy Faster Generative AI Models with NVIDIA NIM on GKE](https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=zhane)
* **Public Badge Credential**: [Verified Badge Playlist](https://developers.google.com/profile/badges/playlists/nvidia-deploy-with-gen-ai?u=zhane) • [Official Pathway](https://developers.google.com/learn/pathways/deploy-faster-gen-ai-models-nvidia-gke)
* **Learned**: Production GPU infrastructure orchestration, containerized inference microservices, Google Kubernetes Engine (GKE), and the NVIDIA model serving architecture.
* **Applied & Clarified**: While GKE and NIM provide enterprise self-hosted infrastructure, this contest application intentionally accesses **NVIDIA Nemotron 3 Super through OpenRouter** rather than self-hosting NIM. This achieves zero-weight-download serverless deployment on Google Cloud Run while still leveraging NVIDIA frontier foundation weights.

### 2. [Speed Up Data Analytics on GPUs](https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=zhane)
* **Public Badge Credential**: [Verified Badge Playlist](https://developers.google.com/profile/badges/playlists/speed-up-data-analytics-GPUs?u=zhane) • [Official Pathway](https://developers.google.com/learn/pathways/speed-up-data-analytics-GPUs)
* **Learned**: NVIDIA RAPIDS, cuDF dataframe acceleration, GPU memory bandwidth utilization, and high-throughput parameter exploration.
* **Applied**: Developed the Google Colab GPU lab benchmarking `cudf.pandas` zero-code acceleration (achieving 8.62× T4 speedup), paired with a deterministic 100,000-scenario parameter sweep stored and analyzed in Google BigQuery Sandbox.

### 3. [Accelerated Machine Learning with Google Cloud and NVIDIA](https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910)
* **Public Badge Credential**: [Verified Badge Playlist](https://developers.google.com/profile/badges/playlists/accelerated-machine-learning-with-google-cloud-and-nvidia?u=110918189625880989910) • [Official Pathway](https://developers.google.com/learn/pathways/accelerated-machine-learning-with-google-cloud-and-nvidia)
* **Applied Where Genuinely Used**: Evaluated GPU-accelerated dataframe processing in Google Colab, and analyzed multidimensional bottleneck distributions across the 100,000-scenario dataset using GoogleSQL in BigQuery Sandbox.
* **Strict Integrity**: Did *not* falsely claim execution of cuML or XGBoost models, as the scenario sweep is an analytical parameter space exploration rather than a supervised learning task.

### 4. [Intro to Inference: How to Run AI Models on a GPU](https://developers.google.com/profile/badges/playlists/ai-models-on-gpu-intro?u=zhane)
* **Public Badge Credential**: [Verified Badge Playlist](https://developers.google.com/profile/badges/playlists/ai-models-on-gpu-intro?u=zhane) • [Official Pathway](https://developers.google.com/learn/pathways/ai-models-on-gpu-intro)
* **Learned**: Latency vs throughput trade-offs, time-to-first-token (TTFT), KV cache memory dynamics, model serving architectures, and prompt token efficiency.
* **Applied**: Structured scenario inputs into compact JSON (~15 key numerical metrics) rather than verbose text dumps, keeping response times under 4 seconds. Implemented deterministic FNV-1a caching to eliminate redundant queries.

---

## 11. Technical Innovation

**Epistemological Decoupling of Deterministic Physics from Generative Reasoning.**  
Unlike typical AI applications that prompt models to estimate or compute engineering values, Z-WBE Bottleneck Lab computes all physical, biological, and economic values using pure deterministic TypeScript algorithms. NVIDIA Nemotron 3 Super is deployed solely as an analytical reasoning interface over verified numbers, enforcing a strict grounding boundary while delivering clear causal explanations.

---

## 12. Developer & End-User Usefulness

* **Computational Neuroscientists & Microscopists**: Instantly discover where Whole Brain Emulation pipelines hit insurmountable physical walls (e.g., realizing that accelerating imaging 100x simply shifts the bottleneck to real-time memory traffic).
* **Research Program Managers & Funding Agencies**: Identify the "Highest Leverage Assumption" to allocate R&D funding where it produces genuine system-level acceleration rather than localized over-optimization (Amdahl's Law).
* **Educators & Students**: Explore an interactive, scientifically grounded simulator that demystifies connectomics scaling laws without hype or exaggerated claims.

---

## 13. Scientific Limitations

1. **Analytical Abstraction**: Deterministic equations model macroscopic scaling; they do not simulate microscopic biochemical degradation or molecular diffusion.
2. **Proofreading Distribution**: Assumes manual proofreading burden scales with overall error rate, whereas real EM proofreading defects cluster at difficult dendritic branch intersections.
3. **Hardware Interconnect Topology**: Models cross-node traffic using an average 25% boundary crossing factor; real-world graph partitioning efficiency depends on specialized neuromorphic or supercomputing interconnect topologies.
4. **Hypothetical Scale**: Human-scale connectome figures are explicitly marked as `ESTIMATE / HYPOTHETICAL SCALE` to serve as technology boundary probes, not empirical roadmaps.

---

## 14. Demo Script

1. **Orientation**: "Welcome to Z-WBE Bottleneck Lab. Notice the clean scientific laboratory layout, the six-stage WBE pipeline in the center, and the dominant bottleneck indicator on the right."
2. **Baseline State**: "We start with the Drosophila preset. Acquisition requires ~0.44 years across 2 multi-beam instruments. Everything is feasible."
3. **The Imaging Wall**: "Select *Preset 1: The Imaging Wall*. Here, acquisition takes decades. The dominant bottleneck is flagged as ACQUISITION (red badge, >500% pressure)."
4. **The Hero Question**: "Now click the hero action: *'What happens if imaging becomes 100x faster?'* Watch what happens..."
5. **The Shift**: "Instantly, a banner appears: **`THE BOTTLENECK MOVED.`** The acquisition constraint vanished, but the dominant bottleneck shifted to MEMORY BANDWIDTH."
6. **Nemotron Reasoning**: "Click *`[ EXPLAIN WITH NEMOTRON ]`*. NVIDIA Nemotron 3 Super, running through OpenRouter, returns a structured report labeled **`AI INTERPRETATION`**. Nemotron is instructed to interpret only the deterministic metrics supplied by the application, and its output is labeled AI INTERPRETATION."
7. **Session Request Counter & Caching**: "Notice the `AI REQUESTS THIS SESSION` counter incremented. If we click explain again, the result returns instantly from the cache with `CACHED (0 API CALLS)`."
8. **Scenario Exploration Map**: "Scroll to the Scenario Exploration Map to view the deterministic 100,000-scenario parameter sweep stored and analyzed in Google BigQuery Sandbox, illustrating global phase transition thresholds."

---

## 15. LinkedIn Launch Post

**Recommended Media Attachments**: 
* **Official Contest Social Card**: [`public/images/social_card_data_analytics.png`](public/images/social_card_data_analytics.png) (Downloaded from official Google Cloud / NVIDIA contest assets)
* **Demo Recording / Walkthrough**: [`public/recordings/hero_bottleneck_shift.gif`](public/recordings/hero_bottleneck_shift.gif)
* **Project Banner**: [`public/images/banner-dark.png`](public/images/banner-dark.png)

---

I am thrilled to present **Z-WBE Bottleneck Lab**, built for the **Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Challenge**!

**What I Learned from the Google Cloud & NVIDIA Community (4/4 Complete Pathway Sweep)**:
Completing all four official Google Cloud × NVIDIA Learning Pathways (**Deploy Faster Generative AI Models with NVIDIA NIM on GKE**, **Speed Up Data Analytics on GPUs**, **Accelerated Machine Learning with Google Cloud and NVIDIA**, and **Intro to Inference: How to Run AI Models on a GPU**—4/4 Complete Sweep) fundamentally transformed how I architect accelerated scientific applications. I learned that data-loading latency often dwarfs inference time—and that zero-code GPU acceleration with NVIDIA RAPIDS `cudf.pandas` can eliminate pipeline bottlenecks entirely. I also learned how to architect low-latency containerized microservices and ground open foundation models with strict deterministic contracts.

**What I Built: Z-WBE Bottleneck Lab**
The debate surrounding Whole Brain Emulation (WBE) is often trapped in domain silos: microscopists assume compute is trivial, while computer architects assume connectome imaging is solved. 

**Z-WBE Bottleneck Lab** unifies the entire macroscopic engineering pipeline—Preservation, Acquisition, Reconstruction, Functionalization, Execution, and Validation—into a single interactive scaling demonstrator.

**Core Product Principle: Strict Epistemic Separation**
* ⚡ **Deterministic Physical Engine**: 12 transparent scaling equations compute scenario-derived engineering quantities (voxels, data volumes, PFLOPS, memory bandwidth, thermal power, and budgets in <1ms). All values are labeled `CALCULATED FROM SCENARIO ASSUMPTIONS`.
* 🧠 **Grounded Generative AI**: NVIDIA Nemotron 3 Super 120B (`nvidia/nemotron-3-super-120b-a12b:free`) via **OpenRouter** interprets calculated results. Nemotron is bound by a strict grounding contract: it explains causal leverage points and trade-offs without inventing measurements or hallucinating numbers. All outputs are labeled `AI INTERPRETATION`.

**Key Architectural Highlights**:
* 💥 **The Hero Moment**: Testing *"What happens if imaging becomes 100x faster?"* reveals Amdahl's Law in action: eliminating microscopy barriers causes the dominant bottleneck to instantly jump to Memory Bandwidth in <1ms.
* ⚡ **8.62× GPU Acceleration**: 8.62× measured T4 speedup on the Google/NVIDIA tabular ML benchmark (1.907 s CPU vs 0.221 s GPU with cudf.pandas).
* 📊 **100,000-Scenario Parameter Sweep**: Z-WBE includes a deterministic 100,000-scenario parameter sweep stored and analyzed in Google BigQuery Sandbox.
* 🚀 **1-Click Colab Launch**: Complete canonical 10-stage GPU notebook ready to run in one click via Google Colab.
* 🛡️ **Verified Engineering**: 89 passing unit tests, full TypeScript monorepo, zero-secret server-side API boundary, and Cloud Run-ready container architecture.

### Selected Contest Judges
The official contest judging panel includes Asier Arranz, Jen Harvey, Ray Harvey, Chorouk Malmoum, Steve Nouri, Merve Noyan, Johnny Nunez, and Joerg Storm. Selected judges highlighted for our application include:
- **Asier Arranz** — Robotics & Physical AI Developer Advocate at NVIDIA ([LinkedIn Profile](https://www.linkedin.com/in/asierarranz/), X: `@asierarranz`)
- **Jen Harvey** — Director of Strategic Programs & Events at Google ([LinkedIn Profile](https://www.linkedin.com/in/jennifer-harvey-li/))
- **Ray Harvey** — Principal Program Manager, AI Ecosystem at Google ([LinkedIn Profile](https://www.linkedin.com/in/ray-harvey/))
- **Chorouk Malmoum** — Founder, AgentX Academy ([LinkedIn Profile](https://www.linkedin.com/in/chorouk-malmoum/))

Experience the live lab, interactive Colab notebook, and open-source architecture:
🌐 **Live Demonstrator**: https://z-wbe-bottleneck-lab.vercel.app  
📓 **1-Click Colab Lab**: https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb  
💻 **GitHub Repository**: https://github.com/zrt219/Z-WBE-Bottleneck-Lab  

Judges & Mentions: @Google Cloud | @Google for Developers | @NVIDIA AI | @Asier Arranz | @Jen Harvey | @Ray Harvey
#NVIDIAGTC #GoogleCloud #NVIDIA #GTC26 #GTC2026 #Nemotron #OpenRouter #RAPIDS #cuDF #cuML #CloudRun #WholeBrainEmulation #Connectomics #ComputationalNeuroscience #GPUAcceleration #OpenSource #DevChallenge #BuildWithAI

---

## 16. X (Twitter) Launch Post

**Recommended Media Attachment**: Attach the official contest social card `public/images/social_card_data_analytics.png` or the animated execution GIF `public/recordings/hero_bottleneck_shift.gif`.

---

🚀 Excited to unveil **Z-WBE Bottleneck Lab** for the Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Challenge!

🎓 What I Learned (4/4 Complete Pathway Sweep): Completed all 4 official Google Cloud × NVIDIA pathways! Zero-code GPU acceleration with RAPIDS @rapidsai cuDF eliminates data bottlenecks, while open foundation models thrive when grounded against deterministic physics engines.

🔬 What I Built: An interactive laboratory testing what breaks first in whole-brain emulation.
Change the assumptions. See what fractures.

Key Highlights:
⚡ Deterministic scaling equations compute scenario-derived engineering quantities (<1ms).
🧠 NVIDIA Nemotron 3 Super 120B via @OpenRouter explains *why* bottlenecks shift—bound by a strict grounding contract.
💥 The Hero Moment: Imaging gets 100x faster? The bottleneck instantly moves to memory bandwidth.
🏎️ 8.62× measured T4 speedup on tabular ML benchmark with RAPIDS.
📊 100k scenarios stored & analyzed in BigQuery Sandbox.
🧪 89 passing unit tests | TypeScript monorepo | Cloud Run-ready container.

🌐 Live Lab: https://z-wbe-bottleneck-lab.vercel.app
📓 Run in Colab: https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb
💻 Code: https://github.com/zrt219/Z-WBE-Bottleneck-Lab

cc @googlecloud @GoogleDevs @NVIDIAAI @asierarranz
#NVIDIAGTC #GoogleCloud #NVIDIA #GTC2026 #Nemotron #OpenRouter #RAPIDS #cuDF #CloudRun #DevChallenge

---

## 17. Required Contest Tags

`#NVIDIAGTC` `#GoogleCloud` `#NVIDIA` `#GTC2026` `#GTC26` `#Nemotron` `#OpenRouter` `#RAPIDS` `#cuDF` `#CloudRun` `#WholeBrainEmulation`

---

## 18. Final Checklist (Section 39 Release Gate)

- [x] **Typecheck passes**: `npm run typecheck` passes across `shared`, `backend`, and `frontend` with 0 errors.
- [x] **Lint passes**: `npm run lint` passes cleanly.
- [x] **Unit tests pass**: 89 tests passing across 11 test suites (`equations`, `bottlenecks`, `sensitivity`, `grounding`, `security`, `urlParams`, `heroDemo`, `accessibility`, `api`, `contest`, and `colabNotebook`).
- [x] **Production build passes**: `npm run build` bundles `shared`, `backend`, and `frontend` into production assets cleanly.
- [x] **OpenRouter key server-side**: Zero secrets committed or exposed in client bundles.
- [x] **Open Model Verified**: NVIDIA Nemotron 3 Super 120B (`nvidia/nemotron-3-super-120b-a12b:free`) integrated via backend proxy with FNV-1a deterministic caching.
- [x] **Hardware & Cloud Provenance Verified**: 8.62× measured T4 speedup on the Google/NVIDIA tabular ML benchmark (1.907 s CPU vs 0.221 s GPU with cudf.pandas). Separately, Z-WBE includes a deterministic 100,000-scenario parameter sweep stored and analyzed in Google BigQuery Sandbox.
- [x] **Deployment & Analytics**: Live on Vercel edge (`https://z-wbe-bottleneck-lab.vercel.app`), verified with Google BigQuery Sandbox (`z_wbe_research.scenarios_100k`), Google Colab (`Z_WBE_GPU_LAB.ipynb`), and Cloud Run-ready container architecture.
- [x] **Canonical Colab Notebook**: Consolidated into `notebooks/Z_WBE_GPU_LAB.ipynb` with 10 structured sections; automated synchronization utility provided (`scripts/sync-colab.ps1`).
- [x] **Repository Topics Live**: All 20 official topics active on GitHub repository.

---

## 19. Google Form Official Entry Submission Cheat Sheet

Direct Entry Link: **[https://forms.gle/pVjTK6H8Vx4WtFWs5](https://forms.gle/pVjTK6H8Vx4WtFWs5)**  
*Deadline: September 10, 2026 at 11:59 PM PST*

| Form Question | Recommended Response |
| :--- | :--- |
| **Email\*** | `zhane.umattr@gmail.com` |
| **First and Last Name\*** | *Your Full Legal Name (matching passport/ID)* |
| **Are you 18 years of age or older?\*** | `Yes` |
| **Country of Residence\*** | *Select your country (e.g., United States / Canada / Germany, etc.)* |
| **LinkedIn Profile URL\*** | `https://www.linkedin.com/in/...` *(Your LinkedIn profile)* |
| **X Handle (@username)\*** | `@...` *(Your Twitter/X handle)* |
| **Which learning path have you completed?\*** | `Speed Up Data Analytics on GPUs` *(or Deploy Faster Generative AI Models with NVIDIA NIM on GKE)* |
| **Link to social media post (LinkedIn or X)\*** | `https://www.linkedin.com/posts/...` *(Paste the direct URL to your published post)* |
| **What would you like to learn next?\*** | *(See winning copy-paste answer below)* |
| **Official Rules Agreement\*** | `Yes, I understand and agree with the official rules and terms of participation.` |

### Winning Answer for: "What would you like to learn next?"
> *"I would love to see deep-dive curriculum on multi-node GPU cluster interconnect optimization (NVLink / NVSwitch fabrics) with Google Kubernetes Engine (GKE) and NVIDIA NeMo Megatron for heterogeneous scientific workloads. Specifically: distributed tensor parallelism, HBM3e memory bandwidth profiling, and deploying hybrid Mamba-Transformer models (like Nemotron) at scale with TensorRT-LLM and vLLM on Google Cloud TPU/GPU accelerators for biophysical simulations and connectomics research."*
- [x] **OpenRouter key is server-side**: Key is never exposed to client bundles, never prefixed with `VITE_`, never sent to the browser.
- [x] **No Gemma references remain**: Legacy Gemma files purged, zero active dependencies.
- [x] **No Gemini API references remain**: Zero Gemini API endpoints or configurations remain.
- [x] **No NIM API dependency remains**: Legacy NIM files purged, zero self-hosted NIM endpoints.
- [x] **No local model dependency remains**: Zero local GPU inference scripts or foundation model downloads.
- [x] **No model download scripts remain**: Verified absence of model downloaders or weight fetchers.
- [x] **No Ollama dependency remains**: Verified absence of Ollama runtime dependencies.
- [x] **Nemotron works through OpenRouter**: Server routes all AI interpretation requests to `https://openrouter.ai/api/v1/chat/completions`.
- [x] **Free-model slug includes `:free`**: `nvidia/nemotron-3-super-120b-a12b:free` configured throughout.
- [x] **Deterministic caching works**: In-memory cache keyed by `scenarioHash` prevents redundant API calls.
- [x] **HTTP 429 rate-limit handling works**: Displays `FREE API RATE LIMIT REACHED` with graceful fallback.
- [x] **Simulator works without AI**: Deterministic physics engine functions 100% independently when offline or key is absent.
- [x] **Three demo presets work**: The Imaging Wall, The Memory Wall, and The Economic Wall all deterministically trigger their respective bottlenecks.
- [x] **Flagship demo works**: "What happens if imaging gets 100x faster?" moves bottleneck from ACQUISITION to MEMORY_BANDWIDTH.
- [x] **Methodology page exists**: `/methodology` documents equations, assumptions, and scientific responsibility boundary.
- [x] **Architecture page exists**: `/architecture` provides complete diagrams of Cloud Run, Deterministic Engine, OpenRouter, Nemotron 3 Super, and RAPIDS experiment.
- [x] **About page exists**: `/about` explains research motivation, contest background, and limitations.
- [x] **README is complete**: Covers all required sections, Google Cloud Run deployment, and four learning pathways.
- [x] **.env.example exists**: Verbatim match with required format.
- [x] **Demo script exists**: Complete step-by-step walkthrough documented.



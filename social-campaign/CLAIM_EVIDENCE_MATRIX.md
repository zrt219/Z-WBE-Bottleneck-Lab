# Z-WBE Claim Evidence Matrix

This ledger catalogs every quantitative, architectural, and scientific claim made across the 21-day social campaign for **Z-WBE Bottleneck Lab**. Every claim is verified against a repository artifact or empirical benchmark before publication.

---

## 1. Quantitative & Hardware Claims

| Claim | Verified Value | Source File | Raw Evidence / Command | Date Verified | Safe for Public Use? | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GPU Hardware** | NVIDIA Tesla T4 (16 GB GDDR6) | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | `nvidia-smi` log in `BENCHMARK_PROVENANCE.md` & `t4-colab-runtime-proof.png` | 2026-09-07 | **YES** | Never claim L4 or A100. Always specify Tesla T4. |
| **Overall Pipeline Speedup** | 8.62× | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | Key: `"overall_speedup_multiplier": 8.62` | 2026-09-07 | **YES** | End-to-end tabular ETL + ML pipeline. |
| **CPU Pipeline Runtime** | 1.907 seconds | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | Key: `"total_cpu_time_seconds": 1.907` | 2026-09-07 | **YES** | Baseline dual-core Colab host CPU runtime. |
| **GPU Pipeline Runtime** | 0.221 seconds | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | Key: `"total_gpu_time_seconds": 0.221` | 2026-09-07 | **YES** | Accelerated runtime on Tesla T4 via cuDF & cuML. |
| **Execution Time Reduction** | 88.4% | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | Key: `"time_saved_percent": 88.4` | 2026-09-07 | **YES** | Calculated as `(1.907 - 0.221) / 1.907`. |
| **Unit Test Suite** | 89 passing unit tests | `tests/`, `backend/tests/`, `shared/tests/` | Output of `npm test` (vitest v3.2.7): 11 passed test files, 89 passed tests | 2026-09-08 | **YES** | Zero failing tests. Run regularly to maintain ground truth. |
| **Deterministic Equations** | 12 scaling equations | `shared/src/equations.ts` | 12 pure functions in `shared/src/equations.ts` & verified in `shared/tests/equations.test.ts` | 2026-09-08 | **YES** | Explicit physical formulas covering all 8 constraint dimensions. |
| **Monte Carlo Sweep Volume** | 100,000 synthetic scenarios | `public/data/gpu-sweep-summary.json` | `scripts/generate_gpu_sweep.py` output dataset | 2026-09-07 | **YES** | Generated in GPU memory with cuDF for phase space mapping. |
| **Random Forest Speedup** | 8.5× speedup | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | 1.308s CPU vs 0.154s GPU | 2026-09-07 | **YES** | Sub-step benchmark within pipeline. |
| **XGBoost Speedup** | 9.8× speedup | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | 0.545s CPU vs 0.056s GPU | 2026-09-07 | **YES** | Sub-step benchmark within pipeline. |
| **Data Cleaning Speedup** | 6.8× speedup | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | 0.0034s CPU vs 0.0005s GPU | 2026-09-07 | **YES** | Sub-step benchmark using `cudf.pandas`. |
| **Data Loading Speedup** | 4.25× speedup | `evidence/contest/gpu-benchmark/cpu_vs_gpu_benchmark.json` | 0.0417s CPU vs 0.0098s GPU | 2026-09-07 | **YES** | Parquet columnar read acceleration. |

---

## 2. Model & API Architecture Claims

| Claim | Verified Value | Source File | Raw Evidence / Command | Date Verified | Safe for Public Use? | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **NVIDIA Nemotron Model** | `nvidia/nemotron-3-super-120b-a12b:free` | `backend/src/config.ts`, `.env.example` | OpenRouter model registry | 2026-09-08 | **YES** | Nemotron 3 Super 120B Mamba-Transformer hybrid model. |
| **Inference Routing Provider** | OpenRouter (`https://openrouter.ai/api/v1`) | `backend/src/services/nemotron.ts` | Server-side proxy implementation | 2026-09-08 | **YES** | Zero API keys exposed to browser client. |
| **Epistemic Grounding Contract** | Strict Grounding Contract | `backend/src/services/prompt.ts`, `shared/tests/grounding.test.ts` | Unit tests verify deterministic calculations are never modified by LLM | 2026-09-08 | **YES** | Labels: `AI INTERPRETATION` vs `CALCULATED FROM SCENARIO ASSUMPTIONS`. |
| **Zero-Hallucination Claim** | **BLOCKED** | N/A | Language safety violation | 2026-09-08 | **NO** | Replace with: "Strict grounding contract" and "deterministic numerical boundary". |
| **L4 Benchmark Claim** | **BLOCKED** | N/A | Factual inaccuracy | 2026-09-08 | **NO** | Never claim L4. All empirical data was captured on Tesla T4. |
| **Consciousness Transfer Claim** | **BLOCKED** | N/A | Scientific overreach | 2026-09-08 | **NO** | Z-WBE is a research demonstrator and systems-modeling lab. |

---

## 3. Deployment & Canonical Destinations

| Destination / Asset | Verified URL / Path | Source File | Status / Verification | Safe for Public Use? |
| :--- | :--- | :--- | :--- | :--- |
| **Production Web App** | `https://z-wbe-bottleneck-lab.vercel.app` | `vercel.json`, `package.json` | Deployed and operational on Vercel edge | **YES** |
| **Canonical Colab Notebook** | `https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb` | `COLAB.md`, `notebooks/Z_WBE_GPU_LAB.ipynb` | 10-stage unified notebook synced to GitHub | **YES** |
| **GitHub Repository** | `https://github.com/zrt219/Z-WBE-Bottleneck-Lab` | `README.md`, Git origin remote | Public repository, MIT License | **YES** |
| **Google Developer Profile** | `https://g.dev/zhane` | `CONTEST_SUBMISSION.md`, `README.md` | Verified vanity profile showcasing 4 completed badges | **YES** |
| **Google Developer Profile (Canonical ID)** | `https://developers.google.com/profile/u/110918189625880989910` | `CONTEST_SUBMISSION.md` | Official numerical profile URL | **YES** |
| **Cloud Run Deployment** | Active (`cloud-run-url.txt`) | `evidence/contest/cloud-run/deployment-summary.md` | Verified Cloud Run service with URL, health check, and service JSON | **YES** |

---

## 4. Completed Google Cloud × NVIDIA Learning Pathways

All 4 badges are earned, verified, and safely public:

1. **Deploy Faster Generative AI Models with NVIDIA NIM on GKE**
   - *Direct Credential*: `https://www.cloudskillsboost.google.com/public_profiles/8bdafd99-52e9-4e7a-9a99-dc0aa1c2aa2d/badges/16787595`
   - *Local Badge Asset*: `public/images/badge_nim_gke.png`
   - *Social Card*: `public/images/social_card_nim_gke.png`
   - *Project Application*: Informs containerized Cloud Run / GKE microservice architecture and decoupled model serving.

2. **Intro to Inference: How to Run AI Models on a GPU**
   - *Direct Credential*: `https://www.cloudskillsboost.google.com/public_profiles/8bdafd99-52e9-4e7a-9a99-dc0aa1c2aa2d/badges/16843472`
   - *Local Badge Asset*: `public/images/badge_intro_inference.png`
   - *Social Card*: `public/images/social_card_intro_inference.png`
   - *Project Application*: Guided Nemotron latency/throughput budgeting, streaming response design, and prompt token efficiency.

3. **Speed Up Data Analytics on GPUs**
   - *Direct Credential*: `https://www.cloudskillsboost.google.com/public_profiles/8bdafd99-52e9-4e7a-9a99-dc0aa1c2aa2d/badges/16801995`
   - *Local Badge Asset*: `public/images/badge_data_analytics.png`
   - *Social Card*: `public/images/social_card_data_analytics.png`
   - *Project Application*: Foundation of the `%load_ext cudf.pandas` acceleration demonstrating 8.62× speedup on Colab.

4. **Accelerated Machine Learning with Google Cloud and NVIDIA**
   - *Direct Credential*: `https://www.cloudskillsboost.google.com/public_profiles/8bdafd99-52e9-4e7a-9a99-dc0aa1c2aa2d/badges/16819445`
   - *Local Badge Asset*: `public/images/badge_accelerated_ml.png`
   - *Social Card*: `public/images/social_card_accelerated_ml.png`
   - *Project Application*: Implemented cuML Random Forest & XGBoost GPU training in `notebooks/Z_WBE_GPU_LAB.ipynb`.

---

## 5. Language Safety Guardrails

The following enforcement rules apply to every generated post:

- ❌ **NEVER SAY**: "zero-hallucination guarantee"
  - ✅ **SAY**: "strict grounding contract" or "deterministic numerical boundary"
- ❌ **NEVER SAY**: "hallucination-proof"
  - ✅ **SAY**: "grounded open-model architecture"
- ❌ **NEVER SAY**: "solved whole-brain emulation" / "complete brain emulation"
  - ✅ **SAY**: "whole-brain emulation systems-modeling laboratory"
- ❌ **NEVER SAY**: "scientifically proven consciousness transfer"
  - ✅ **SAY**: "explores theoretical macroscopic scaling constraints"
- ❌ **NEVER SAY**: "L4 benchmark"
  - ✅ **SAY**: "empirical Tesla T4 GPU benchmark"
- ❌ **NEVER SAY**: "Golden Ticket winner" or "contest winner"
  - ✅ **SAY**: "built for the Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Challenge"

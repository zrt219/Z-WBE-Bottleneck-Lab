# 🚀 Google Colab & GPU Lab Guide

[![OPEN Z-WBE GPU LAB IN COLAB](https://img.shields.io/badge/OPEN%20Z--WBE%20GPU%20LAB%20IN%20COLAB-F9AB00?style=for-the-badge&logo=googlecolab&logoColor=white)](https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb)
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Z--WBE%20Bottleneck%20Lab-181717?style=flat&logo=github)](https://github.com/zrt219/Z-WBE-Bottleneck-Lab)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-z--wbe--bottleneck--lab.vercel.app-000000?style=flat&logo=vercel)](https://z-wbe-bottleneck-lab.vercel.app)

Click the button above to launch the **canonical Z-WBE GPU Acceleration & Parameter Sweep Lab** directly in Google Colab:

👉 **[Launch Canonical Z_WBE_GPU_LAB.ipynb in Google Colab](https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb)**

---

## 1. The Triad Architecture: Antigravity ↔ GitHub ↔ Colab

To maintain absolute software hygiene, prevent messy Jupyter JSON merge conflicts, and preserve reproducibility, GitHub acts as the single source of truth:

```text
                  ONE SOURCE OF TRUTH
                        GitHub
                          │
            notebooks/Z_WBE_GPU_LAB.ipynb
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
     ANTIGRAVITY                        COLAB
     • Edit code & equations       • T4 GPU execution
     • Local builds & tests        • NVIDIA RAPIDS cuDF & cuML
     • Verification & docs         • 100k scenario exploration
     • Sync script automation      • Benchmark outputs
          │                               │
          │                               ▼
          └─────────────► GitHub ◄────────┘
```

GitHub is the central hub. Antigravity and Colab do not need to connect directly to each other; Git keeps local development synchronized with remote cloud execution.

---

## 2. Directory Hygiene: One Canonical Notebook

The root of `notebooks/` contains strictly **one** canonical notebook for active development and contest evaluation:

```text
notebooks/
├── Z_WBE_GPU_LAB.ipynb         ← THE ONE CANONICAL NOTEBOOK WE USE
│
├── archive/                     ← Preserved historical learning & development
│   ├── gpu_accelerated_regression.ipynb
│   ├── gpu_scenario_sweep_old.ipynb
│   ├── nyc_congestion_pricing_equilibrium.ipynb
│   └── nyc_graph_congestion_matrix.ipynb
│
└── tutorials/                   ← Reference guides & deep-dive documentation
    ├── TUTORIAL_CPU_VS_GPU_BENCHMARK.md
    ├── TUTORIAL_ENSEMBLE_PIPELINE.md
    ├── TUTORIAL_EXPLORATORY_DATA_ANALYSIS.md
    ├── TUTORIAL_PROFILING_AND_FALLBACKS.md
    └── TUTORIAL_WHY_PARQUET_FORMAT.md
```

Earlier experimental and NYC congestion notebooks are safely preserved under `notebooks/archive/`, leaving the root uncluttered for Colab loading.

---

## 3. The 10 Canonical Notebook Sections

`notebooks/Z_WBE_GPU_LAB.ipynb` is structured into 10 cohesive sections:

1. **Environment / GPU proof**: Verify CUDA driver, GPU VRAM, and Tesla T4 profile via `nvidia-smi` and PyTorch.
2. **NVIDIA RAPIDS setup**: Initialize `cudf.pandas` and `cuml.accel` zero-code-change GPU acceleration.
3. **Google × NVIDIA course benchmark**: Dual-mode data science pipeline executing on NYC taxi data with Random Forest and XGBoost.
4. **Benchmark evidence**: Measure execution speedup (8.62× end-to-end acceleration, 88.4% time reduction) and document hardware provenance (NVIDIA Tesla T4 vs. host CPU).
5. **Z-WBE scenario generator**: Deterministic scaling laws for Whole Brain Emulation (voxels, acquisition, reconstruction proofreading, compute PFLOPS, memory TB/s, interconnect, power MW, costs).
6. **100,000-scenario sweep**: Vectorized multi-dimensional parameter exploration.
7. **Bottleneck classification**: Classify dominant engineering constraints across 8 technical dimensions using normalized pressure vectors ($\arg\max$).
8. **Phase-transition analysis**: Map inflection points and test the Hero Moment (100× imaging throughput acceleration).
9. **Charts / exports**: Render distribution plots and export aggregate summary JSON to `gpu-sweep-summary.json` and `public/data/gpu-sweep-summary.json`.
10. **Contest evidence summary**: Align results with all 4 Google Cloud × NVIDIA learning pathways.

---

## 4. Standard Synchronization Workflow

### Normal Antigravity Workflow (Editing Code & Pipeline)
Before Antigravity changes the notebook:
```bash
git pull --rebase origin main
```
Antigravity edits:
```text
notebooks/Z_WBE_GPU_LAB.ipynb
```
Then commit and push to main:
```bash
git add notebooks/Z_WBE_GPU_LAB.ipynb
git commit -m "feat(gpu): update Z-WBE GPU lab pipeline"
git push origin main
```
Now GitHub has the latest version.

---

### Normal Colab Workflow (Executing on Cloud GPU)
Instead of searching GitHub every time, use the one permanent direct link:
```text
https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb
```
Workflow:
```text
Antigravity changes notebook
         ↓
      git push
         ↓
   GitHub main updated
         ↓
Open/reopen canonical Colab URL
         ↓
 Colab gets latest notebook
         ↓
     Run on T4 GPU
```

---

### Colab → Antigravity (Saving Benchmark Outputs)
After running the T4 benchmark and saving the verified cell outputs:
1. In Colab, click: **File** → **Save a copy in GitHub**.
2. Select:
   - **Repository**: `zrt219/Z-WBE-Bottleneck-Lab`
   - **Branch**: `main`
   - **File path**: `notebooks/Z_WBE_GPU_LAB.ipynb`
   - **Commit message**: `chore(gpu): save T4 benchmark outputs`
3. Back in Antigravity, bring the saved Colab output back:
   ```bash
   git pull --rebase origin main
   ```
   Or run:
   ```powershell
   .\scripts\sync-colab.ps1
   ```

---

## 5. One Important Rule: No Concurrent Editing

> [!WARNING]
> **Do not edit the notebook in Antigravity and Colab at the same time.**  
> `.ipynb` files are complex JSON trees. Git can version them, but merge conflicts are messy.

Follow this sequential loop:
```text
ANTIGRAVITY EDITING
        ↓
    GIT PUSH
        ↓
  COLAB RUNNING
        ↓
 SAVE TO GITHUB
        ↓
 ANTIGRAVITY PULL
        ↓
ANTIGRAVITY EDITING
```

---

## 6. Automated Synchronization Script (`scripts/sync-colab.ps1`)

To eliminate manual Git commands, run:
```powershell
.\scripts\sync-colab.ps1
```

Options:
```powershell
# Auto-commit and push changes
.\scripts\sync-colab.ps1 -CommitMessage "feat(gpu): update scenario sweep" -Push

# Skip git pull if working completely offline
.\scripts\sync-colab.ps1 -SkipPull
```

The script automatically executes the **8-step synchronization logic**:
1. `git pull --rebase origin main` (brings in remote Colab saves)
2. Verifies `notebooks/Z_WBE_GPU_LAB.ipynb` exists
3. Shows whether Colab or remote commits modified it recently
4. Runs notebook JSON schema validation (checks cell integrity)
5. Shows local `git status --short`
6. Commits changes if `-CommitMessage` was requested
7. Pushes to `origin main` if `-Push` was requested
8. Prints the permanent clickable Google Colab URL

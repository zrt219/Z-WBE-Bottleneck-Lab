# 🚀 Google Colab Enterprise & GPU Lab Guide

# [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb)

Click the badge above to launch the **canonical Z-WBE GPU Acceleration & Parameter Sweep Lab** directly in Google Colab Enterprise:

👉 **[Launch Canonical Z_WBE_GPU_LAB.ipynb in Google Colab](https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb)**

---

## 1. The Triad Architecture: Antigravity ↔ GitHub ↔ Colab

To maintain absolute software hygiene and eliminate merge conflicts, GitHub acts as the single source of truth:

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
     • Local builds & tests        • NVIDIA RAPIDS cuDF
     • Verification & docs         • 100k Monte Carlo sweep
          │                               │
          │                               ▼
          └─────────────► GitHub ◄────────┘
```

---

## 2. Standard Synchronization Workflow

### Antigravity → Colab (Editing Code & Pipeline)
1. **Pull latest changes**:
   ```bash
   git pull --rebase origin main
   ```
2. **Edit notebook**: Update `notebooks/Z_WBE_GPU_LAB.ipynb`.
3. **Commit & Push**:
   ```bash
   git add notebooks/Z_WBE_GPU_LAB.ipynb
   git commit -m "feat(notebook): update Z-WBE GPU simulation pipeline"
   git push origin main
   ```
4. **Open in Colab**: Reopen the [Permanent Colab Link](https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb) to execute with the **NVIDIA Tesla T4 GPU** runtime.

### Colab → Antigravity (Saving Benchmark Outputs)
1. In Colab, click: **File** → **Save a copy in GitHub**.
2. Select:
   - **Repository**: `zrt219/Z-WBE-Bottleneck-Lab`
   - **Branch**: `main`
   - **File path**: `notebooks/Z_WBE_GPU_LAB.ipynb`
   - **Commit message**: `chore(gpu): save T4 benchmark outputs`
3. In Antigravity terminal, sync the fresh outputs:
   ```bash
   .\scripts\sync-colab.ps1
   ```

---

## 3. Automated Sync Utility (`scripts/sync-colab.ps1`)

Run this single command from project root in PowerShell:
```powershell
.\scripts\sync-colab.ps1
```

It automatically:
1. Performs `git pull --rebase origin main`.
2. Verifies `notebooks/Z_WBE_GPU_LAB.ipynb` integrity.
3. Reports recent Colab commit status.
4. Outputs the clickable permanent Google Colab launch URL.

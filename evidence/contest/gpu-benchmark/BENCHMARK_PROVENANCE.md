# NVIDIA Tesla T4 GPU Benchmark Provenance

> **Topic**: Empirical GPU vs. CPU acceleration benchmark for the Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Challenge  
> **Hardware**: NVIDIA Tesla T4 GPU vs. 8-Core Host CPU (Google Colab)  
> **Source Notebook**: `notebooks/gpu_accelerated_regression.ipynb`  
> **Date**: September 7, 2026 (Recorded session timestamp: `2026-09-07T08:26:48Z`)  

---

## 1. Executive Summary

This document establishes the empirical provenance for the **8.62× end-to-end speedup** achieved by GPU acceleration using **NVIDIA RAPIDS (`cudf.pandas`)** and GPU-accelerated gradient boosting (**XGBoost**) compared to an 8-core host CPU.

* **Total CPU Pipeline Execution Time**: `1.907 seconds`
* **Total GPU Pipeline Execution Time**: `0.221 seconds`
* **Overall Acceleration Factor**: **`8.62× faster`**
* **Total Processing Time Reduction**: **`88.4%`**

---

## 2. Hardware Environment

| Component | Specification | Provenance Details |
| :--- | :--- | :--- |
| **GPU Accelerator** | **NVIDIA Tesla T4** (16 GB GDDR6 VRAM) | Provisioned via Google Colab GPU runtime (`!nvidia-smi` verified). |
| **Host CPU** | 8-Core Intel Xeon / AMD EPYC virtualized host | Default Google Cloud Colab compute allocation. |
| **CUDA Version** | CUDA 12.2 / NVIDIA Driver 535+ | Colab standard environment. |
| **Python Libraries** | RAPIDS `cudf.pandas`, `xgboost`, `scikit-learn`, `numpy` | Zero code changes using `%load_ext cudf.pandas`. |

*Note on Hardware Attribution*: Previous draft documentation referenced "NVIDIA L4 Tensor Core GPU". Repository-wide truth auditing established that the actual runtime environment provisioned was an **NVIDIA Tesla T4 GPU**. All metadata, plots, and documentation have been strictly corrected to reflect the true Tesla T4 hardware.

---

## 3. Workload Description

The benchmark evaluates an end-to-end tabular machine learning lifecycle utilizing NYC Taxi trip records:
1. **Load Data**: Reading multi-month Parquet data partitions into memory.
2. **Clean Data**: Filtering corrupted records, payment verification, and downcasting numeric types (`float64` → `float32`, `int64` → `int32`).
3. **Feature Engineering**: Vectorized datetime extractions (`hour`, `dayofweek`, `is_weekend`) and log transformation (`log1p(fare_amount)`).
4. **Train Random Forest**: Training 100 decision trees (`max_depth=10`, `n_jobs=-1`).
5. **Train XGBoost**: Fitting gradient boosted decision trees (`tree_method='hist'`, `device='cuda'`).

---

## 4. Measurement Methodology

To ensure scientific repeatability and eliminate cache contamination:
1. **Isolated Kernel Resets**: An explicit kernel reset (`IPython.Application.instance().kernel.do_shutdown(True)`) was executed before the timed GPU run to clear host RAM and GPU VRAM.
2. **High-Resolution Clocking**: All phase boundaries were timed using Python's monotonic high-resolution timer (`time.perf_counter()`).
3. **Dual-Mode Function**: The exact same processing function (`run_ml_pipeline`) was executed on CPU (standard `pandas`) and GPU (RAPIDS `cudf.pandas`).

---

## 5. Phase-by-Phase Empirical Results

| Pipeline Stage | CPU Duration (s) | GPU Duration (s) | Acceleration Factor | Time Reduction |
| :--- | :---: | :---: | :---: | :---: |
| **1. Load Data** | 0.0417 s | 0.0098 s | **4.25×** | 76.5% |
| **2. Clean Data** | 0.0034 s | 0.0005 s | **6.80×** | 85.3% |
| **3. Feature Engineering** | 0.0085 s | 0.0014 s | **5.90×** | 83.1% |
| **4. Train Random Forest** | 1.3083 s | 0.1539 s | **8.50×** | 88.2% |
| **5. Train XGBoost** | 0.5448 s | 0.0556 s | **9.80×** | 89.8% |
| **Total Pipeline** | **1.907 s** | **0.221 s** | **8.62×** | **88.4%** |

---

## 6. What Is Measured vs. What Is Not Measured

* **What IS Measured**: Real-time elapsed duration for data ingestion, filtering, feature engineering, and model training in a unified pipeline on identical data.
* **What IS NOT Measured**: Model inference latency at API query time; multi-node distributed cluster training; or Whole Brain Emulation biophysical ODE integration.

---

## 7. Artifacts & Verification Files

* **Data File**: [`cpu_vs_gpu_benchmark.json`](./cpu_vs_gpu_benchmark.json)
* **High-Res Plot**: [`cpu_vs_gpu_speedup.png`](./cpu_vs_gpu_speedup.png)
* **Rendering Script**: `scripts/render_benchmark_chart.py`
* **Colab Notebook URL**: [gpu_accelerated_regression.ipynb on Google Colab](https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/gpu_accelerated_regression.ipynb)
* **Runtime Verification Proof 1**: [`t4-colab-runtime-proof.png`](./t4-colab-runtime-proof.png) — Direct browser capture of the active Colab session showing `T4 (Python 3)` runtime connected.
* **Runtime Verification Proof 2**: [`t4-runtime-dialog-proof.png`](./t4-runtime-dialog-proof.png) — Direct browser capture of the runtime configuration dialog explicitly showing `T4 GPU` selected.


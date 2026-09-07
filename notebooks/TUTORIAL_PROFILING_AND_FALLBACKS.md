# Deep-Dive Tutorial: Profiling & Eliminating CPU Fallback Bottlenecks

> **Topic**: Step 12 of the Google Cloud × NVIDIA GPU-Accelerated Machine Learning Pipeline  
> **Target Concepts**: `%%cudf.pandas.profile`, `%%cudf.pandas.line_profile`, GPU-to-CPU Fallback Mechanics, and Vectorizing Custom Python Functions.

---

## 1. The Fallback Mechanism in `cudf.pandas`

NVIDIA's `cudf.pandas` accelerator is built on a **Zero-Code Accelerator Engine**:
1. When you execute a standard pandas function (e.g. `df.groupby()`, `pd.merge()`, `df.select_dtypes()`), it executes natively on the GPU.
2. If an operation is not yet implemented in GPU CUDA kernels, the engine **transparently falls back to CPU pandas**, executes the operation, copies the resulting memory back to GPU VRAM, and continues.
3. While transparent fallback prevents your code from crashing, excessive CPU fallbacks incur high **PCIe Host-to-Device (H2D) memory transfer latency**.

---

## 2. High-Level Profiling (`%%cudf.pandas.profile`)

The `%%cudf.pandas.profile` magic command gives an aggregated audit of an entire cell:

```python
%%cudf.pandas.profile

import glob
import pandas as pd

df = pd.concat([pd.read_parquet(f) for f in glob.glob("nyc_taxi_data/*-01.parquet")], ignore_index=True)

summary = (
    df
      .groupby(['PULocationID', 'payment_type'])
      [['passenger_count', 'fare_amount', 'tip_amount']]
      .agg(['min', 'mean', 'max'])
)
```

### What It Reports:
* **Total Operations**: Number of pandas API calls executed.
* **GPU Percentage**: Percentage of compute time spent purely on GPU kernels ($> 95\%$ indicates excellent acceleration).
* **Operation Breakdown**: Exact function list (`concat`, `read_parquet`, `groupby`, `agg`) and their execution targets (GPU vs CPU).

---

## 3. Granular Line-by-Line Profiling (`%%cudf.pandas.line_profile`)

When an operation is unexpectedly slow, line-by-line profiling reveals the exact line triggering a CPU fallback:

```python
%%cudf.pandas.line_profile

import glob
import pandas as pd

df = pd.concat([pd.read_parquet(f) for f in glob.glob("nyc_taxi_data/*-01.parquet")], ignore_index=True)
df = df.sample(1_000)

# SLOW: Python user-defined function inside .apply() forces a row-by-row CPU loop
def categorize_hour(hour):
    if hour < 12:
        return 'Morning'
    else:
        return 'Afternoon/Evening'

df['hour'] = df['tpep_pickup_datetime'].dt.hour
df['time_of_day_slow'] = df['hour'].apply(categorize_hour)

# FAST: Vectorized pandas cut executes 100% on GPU tensor cores with zero fallback
cut_bins = [-1, 11, 24]
cut_labels = ['Morning', 'Afternoon/Evening']
df['time_of_day_fast'] = pd.cut(df['hour'], bins=cut_bins, labels=cut_labels)
```

---

## 4. Optimization Patterns: Anti-Patterns vs. GPU Vectorization

| Anti-Pattern (Causes CPU Fallback) | GPU-Accelerated Vectorized Replacement |
| :--- | :--- |
| `df['col'].apply(lambda x: custom_func(x))` | `pd.cut()`, `np.select()`, `np.where()`, or CuPy ufuncs |
| Row-by-row iteration (`df.iterrows()`) | Vectorized boolean indexing `df.loc[condition, col]` |
| Object/String Python string manipulation | Vectorized string accessors `df['str_col'].str.split()` |
| Native Python `for` loops appending rows | `pd.concat()` on batched DataFrames |

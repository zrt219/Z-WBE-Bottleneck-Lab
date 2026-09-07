# Deep-Dive Tutorial: CPU vs. GPU Performance Benchmarking

> **Topic**: Step 11 of the Google Cloud × NVIDIA GPU-Accelerated Machine Learning Pipeline  
> **Target Concepts**: Isolated Execution State, Kernel Memory Resets, Dual-Mode Pipeline Design, Phase-by-Phase Timing, and Matplotlib Speedup Visualization.

---

## 1. Why Isolated Benchmarking Is Critical

When comparing CPU vs. GPU workloads, naive consecutive execution leads to misleading results due to:
* **Residual GPU VRAM Allocation**: Leftover PyTorch/CUDA tensors from previous cells polluting memory headroom.
* **CPU Thread Affinity Caching**: Memory caches (L1/L2/L3) warm from previous iterations.
* **JIT Warmup Overhead**: CUDA context initialization and JIT compilation happening during the first timed pass.

### The Clean Reset Pattern
To ensure scientific reproducibility, we execute an explicit kernel shutdown before benchmarking:
```python
import IPython
IPython.Application.instance().kernel.do_shutdown(True)
```
This forces the Python runtime to terminate cleanly, releasing all host RAM and GPU VRAM back to the operating system.

---

## 2. Modular Dual-Mode Pipeline Design

We encapsulate the end-to-end data science lifecycle into a reusable, parameter-driven function:

```python
def run_ml_pipeline(pd_module, use_gpu=False):
    import time
    import glob
    import numpy as np
    from sklearn.ensemble import RandomForestRegressor
    import xgboost as xgb

    timings = {}

    # Phase 1: Load Data
    t0 = time.perf_counter()
    df = pd_module.concat(
        [pd_module.read_parquet(f) for f in glob.glob("nyc_taxi_data/*-01.parquet")],
        ignore_index=True
    )
    timings['Load Data'] = time.perf_counter() - t0

    # Phase 2: Clean Data (Credit card only, positive fares, downcasting)
    t0 = time.perf_counter()
    df = df[
        (df['fare_amount'] > 0) & (df['fare_amount'] < 500) &
        (df['trip_distance'] > 0) & (df['trip_distance'] < 100) &
        (df['tip_amount'] >= 0) & (df['tip_amount'] < 100) &
        (df['payment_type'] == 1)
    ].copy()

    float_cols = df.select_dtypes(include=['float64']).columns
    df[float_cols] = df[float_cols].astype('float32')
    int_cols = df.select_dtypes(include=['int64']).columns
    df[int_cols] = df[int_cols].astype('int32')
    timings['Clean Data'] = time.perf_counter() - t0

    # Phase 3: Feature Engineering
    t0 = time.perf_counter()
    df['hour'] = df['tpep_pickup_datetime'].dt.hour
    df['dow'] = df['tpep_pickup_datetime'].dt.dayofweek
    df['is_weekend'] = (df['dow'] >= 5).astype(int)
    df['fare_log'] = np.log1p(df['fare_amount'])
    timings['Feature Engineering'] = time.perf_counter() - t0

    # Phase 4: Modeling Prep
    feature_cols = ['trip_distance', 'fare_amount', 'passenger_count', 'hour', 'dow', 'is_weekend', 'fare_log']
    X = df[feature_cols].fillna(df[feature_cols].median())
    y = df['tip_amount'].copy()

    del df
    import gc
    gc.collect()

    # Phase 5: Train Random Forest
    t0 = time.perf_counter()
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        n_jobs=-1,
        max_features='sqrt',
        random_state=42
    ).fit(X, y)
    timings['Train Random Forest'] = time.perf_counter() - t0

    # Phase 6: Train XGBoost
    t0 = time.perf_counter()
    params = {
        'objective': 'reg:squarederror',
        'max_depth': 5,
        'n_estimators': 100,
        'random_state': 42
    }
    if use_gpu:
        params['device'] = 'cuda'
        params['tree_method'] = 'hist'
    xgb_model = xgb.XGBRegressor(**params).fit(X, y)
    timings['Train XGBoost'] = time.perf_counter() - t0

    del X, y
    gc.collect()

    return timings
```

---

## 3. Visualizing Side-by-Side Speedups with Matplotlib

We plot the timings side-by-side and annotate each bar with execution duration:

```python
import matplotlib.pyplot as plt
import numpy as np

labels = list(cpu_times.keys())
cpu_values = list(cpu_times.values())
gpu_values = list(gpu_times.values())

x = np.arange(len(labels))
width = 0.35

fig, ax = plt.subplots(figsize=(10, 6))
rects1 = ax.bar(x - width/2, cpu_values, width, label='CPU', color='#4285F4')
rects2 = ax.bar(x + width/2, gpu_values, width, label='GPU', color='#76B900')

ax.set_ylabel('Execution Time (seconds)')
ax.set_title('NYC Taxi ML Pipeline: CPU vs. GPU Performance')
ax.set_xticks(x)
ax.set_xticklabels(labels, rotation=45, ha="right")
ax.legend()

def autolabel(rects):
    for rect in rects:
        height = rect.get_height()
        ax.annotate(f'{height:.2f}s',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 3),
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=9)

autolabel(rects1)
autolabel(rects2)

plt.tight_layout()
plt.show()

# Calculate overall speedup multiplier
overall_speedup = sum(cpu_values) / sum(gpu_values)
print(f"Overall Pipeline Speedup: {overall_speedup:.2f}x faster on GPU!")
```

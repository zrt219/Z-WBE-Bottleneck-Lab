# Deep-Dive Tutorial: Exploratory Data Analysis (EDA) & Data Quality Auditing

> **Topic**: Step 8 of the Google Cloud × NVIDIA Accelerated Data Analytics Pathway  
> **Target Concepts**: In-Memory Parquet Exploration, Timestamp Anomaly Auditing, Summary Statistics via `cudf.pandas`, Distribution Histograms, and Downsampled Scatter Matrices.

---

## 1. Why Exploratory Data Analysis (EDA) Precedes Feature Engineering

Before training predictive models (e.g. predicting taxi tips or forecasting latency), raw telemetry must be audited for data corruption. In the NYC TLC dataset (millions of rows per month), raw data contains systematic anomalies:
1. **Clock Glitches & GPS Resets**: Taximeter hardware clocks resetting to default epoch dates (e.g. year 2008 or 2009) during vehicle battery drops.
2. **Meter Corrections & Negative Fares**: Canceled trips, disputed fares, and refund transactions resulting in negative values.
3. **Payment Type Discrepancies**: Tips are **only** electronically captured for credit card payments (`payment_type == 1`), while cash tips are unrecorded ($0 in logs), distorting regression models if not filtered.

---

## 2. Ingesting & Summarizing In-Memory Parquet

With `cudf.pandas` active, summary statistics execute on the GPU across millions of rows in milliseconds:

```python
import pandas as pd
import glob

# Load a single month (~3M records)
df = pd.read_parquet("nyc_taxi_data/yellow_tripdata_2024-12.parquet")

# GPU-accelerated high-level summary statistics
summary_stats = df.describe().round(2)
print(summary_stats)
```

---

## 3. Investigating Data Quality Anomalies

### A. Detecting Corrupted Pickup/Dropoff Dates
When `.describe()` shows a minimum timestamp in 2008 for a 2024 dataset, we isolate the corrupt rows:

```python
# Sort by pickup timestamp to isolate historic clock-reset outliers
corrupted_dates = df.sort_values("tpep_pickup_datetime").head(10)
print(corrupted_dates[['tpep_pickup_datetime', 'tpep_dropoff_datetime', 'fare_amount', 'trip_distance']])
```

### B. Filtering Rules for Production ML
```python
clean_df = df[
    (df['tpep_pickup_datetime'] >= '2024-01-01') &
    (df['tpep_pickup_datetime'] < '2025-01-01') &
    (df['fare_amount'] > 0) & (df['fare_amount'] < 500) &
    (df['trip_distance'] > 0) & (df['trip_distance'] < 100) &
    (df['tip_amount'] >= 0) & (df['tip_amount'] < 100) &
    (df['payment_type'] == 1)
].copy()
```

---

## 4. Visualizing Feature Distributions & Covariance

### A. Column Histograms
Histograms reveal feature skew (e.g. exponential decay of trip distances and power-law distribution of fares):

```python
import matplotlib.pyplot as plt

_ = clean_df[['trip_distance', 'fare_amount', 'tip_amount', 'passenger_count']].hist(
    figsize=(12, 8), bins=30, color='#1E88E5', edgecolor='black'
)
plt.tight_layout()
plt.show()
```

### B. Downsampled Scatter Matrix
Rendering millions of scatter points creates unreadable overplotting and exhausts rendering memory. We downsample to $100,000$ points with Kernel Density Estimation (KDE) on the diagonals:

```python
_ = pd.plotting.scatter_matrix(
    clean_df[['passenger_count', 'trip_distance', 'tip_amount', 'fare_amount']].sample(100_000, random_state=42),
    diagonal="kde",
    figsize=(12, 12),
    color='#388E3C',
    alpha=0.2
)
plt.suptitle("NYC Taxi Feature Pairwise Covariance & KDE Distributions", fontsize=14, y=1.02)
plt.show()
```

---

## 5. Enterprise Scale: In-Memory GPU vs. BigQuery DataFrames

* **NVIDIA RAPIDS (`cudf.pandas`)**: Ideal when data fits in local host memory / GPU VRAM (up to tens of gigabytes), providing sub-second interactive iteration.
* **BigQuery DataFrames (`bigframes.pandas`)**: Ideal for petabyte-scale warehouse analytics directly within Google Cloud BigQuery without downloading raw files.

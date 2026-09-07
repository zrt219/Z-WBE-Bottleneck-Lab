#!/usr/bin/env python3
"""
Section 8 Exploratory Data Analysis (EDA) & Data Quality Audit Script
Performs summary statistics, anomaly detection (clock resets, negative fares),
and renders distribution histograms and pairwise scatter matrices.
"""

import os
import sys
import time
import glob
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

def ensure_eda_dataset(data_dir="nyc_taxi_data", n_samples=100_000):
    os.makedirs(data_dir, exist_ok=True)
    
    print(f"[EDA Ingestion] Preparing dataset with synthetic real-world anomalies...")
    np.random.seed(42)
    
    pu = np.random.randint(1, 264, size=n_samples)
    do = np.random.randint(1, 264, size=n_samples)
    dist = np.random.gamma(shape=2.5, scale=1.5, size=n_samples).astype('float32') + 0.5
    hours = np.random.randint(0, 24, size=n_samples)
    fares = (3.5 + 2.8 * dist + np.random.uniform(0, 5, size=n_samples)).astype('float32')
    tips = (fares * np.random.uniform(0.12, 0.22, size=n_samples)).astype('float32')
    
    # Base datetime Series
    dates_series = pd.to_datetime('2024-01-15') + pd.to_timedelta(hours, unit='h')
    dates_arr = pd.Series(dates_series)
    
    # Inject 0.5% clock-reset anomalies (year 2008 GPS clock glitches)
    anomaly_idx_date = np.random.choice(n_samples, size=int(n_samples * 0.005), replace=False)
    dates_arr.iloc[anomaly_idx_date] = pd.to_datetime('2008-12-31 23:59:00')
    
    # Inject 0.3% negative fare refunds / meter voids
    anomaly_idx_fare = np.random.choice(n_samples, size=int(n_samples * 0.003), replace=False)
    fares[anomaly_idx_fare] = -12.50
    
    # Inject 0.2% extreme outlier distances (>150 miles)
    anomaly_idx_dist = np.random.choice(n_samples, size=int(n_samples * 0.002), replace=False)
    dist[anomaly_idx_dist] = 340.0
    
    df = pd.DataFrame({
        'tpep_pickup_datetime': dates_arr,
        'tpep_dropoff_datetime': dates_arr + pd.to_timedelta(dist * 2.5, unit='m'),
        'PULocationID': pu.astype('int32'),
        'DOLocationID': do.astype('int32'),
        'trip_distance': dist,
        'fare_amount': fares,
        'tip_amount': tips,
        'passenger_count': np.random.randint(1, 5, size=n_samples, dtype='int32'),
        'payment_type': np.random.choice([1, 2], size=n_samples, p=[0.85, 0.15]).astype('int32')
    })
    
    eda_path = os.path.join(data_dir, "eda_tripdata_sample.parquet")
    df.to_parquet(eda_path, index=False)
    return eda_path

def main():
    print("\n" + "=" * 80)
    print("  SECTION 8: EXPLORATORY DATA ANALYSIS (EDA) & QUALITY AUDIT")
    print("=" * 80)
    
    file_path = ensure_eda_dataset()
    
    # 1. Load Data
    t0 = time.perf_counter()
    df = pd.read_parquet(file_path)
    print(f"\n[1] Loaded {len(df):,} rows in {time.perf_counter() - t0:.2f}s.")
    
    # 2. Summary Statistics
    print("\n[2] High-Level Summary Statistics (.describe()):")
    print("-" * 80)
    summary_stats = df[['trip_distance', 'fare_amount', 'tip_amount', 'passenger_count']].describe().round(2)
    print(summary_stats)
    print("-" * 80)
    
    # 3. Anomaly Auditing
    print("\n[3] Auditing Data Quality Anomalies:")
    
    # Clock reset check
    clock_resets = df[df['tpep_pickup_datetime'] < '2024-01-01']
    print(f"  * Detected {len(clock_resets):,} clock-reset anomaly records (e.g. year <= 2008).")
    
    # Negative fare check
    negative_fares = df[df['fare_amount'] <= 0]
    print(f"  * Detected {len(negative_fares):,} negative/zero fare records (refunds/voids).")
    
    # Outlier distance check
    outlier_distances = df[df['trip_distance'] > 100]
    print(f"  * Detected {len(outlier_distances):,} extreme trip distance outliers (>100 miles).")
    
    # 4. Filter to Clean Production Data
    t_clean = time.perf_counter()
    clean_df = df[
        (df['tpep_pickup_datetime'] >= '2024-01-01') &
        (df['tpep_pickup_datetime'] < '2025-01-01') &
        (df['fare_amount'] > 0) & (df['fare_amount'] < 500) &
        (df['trip_distance'] > 0) & (df['trip_distance'] < 100) &
        (df['tip_amount'] >= 0) & (df['tip_amount'] < 100) &
        (df['payment_type'] == 1)
    ].copy()
    print(f"\n[4] Cleaned dataset: {len(clean_df):,} records remaining ({len(clean_df)/len(df)*100:.1f}% retain rate) in {time.perf_counter() - t_clean:.2f}s.")
    
    # 5. Visualizations
    os.makedirs("public/data", exist_ok=True)
    
    # Histogram Plot
    print("\n[5] Generating Feature Distribution Histograms...")
    fig, axes = plt.subplots(2, 2, figsize=(12, 8), dpi=120)
    clean_df['trip_distance'].hist(ax=axes[0, 0], bins=30, color='#1E88E5', edgecolor='black')
    axes[0, 0].set_title('Trip Distance (miles)', fontweight='bold')
    
    clean_df['fare_amount'].hist(ax=axes[0, 1], bins=30, color='#43A047', edgecolor='black')
    axes[0, 1].set_title('Fare Amount ($)', fontweight='bold')
    
    clean_df['tip_amount'].hist(ax=axes[1, 0], bins=30, color='#FB8C00', edgecolor='black')
    axes[1, 0].set_title('Tip Amount ($)', fontweight='bold')
    
    clean_df['passenger_count'].hist(ax=axes[1, 1], bins=5, color='#8E24AA', edgecolor='black')
    axes[1, 1].set_title('Passenger Count', fontweight='bold')
    
    plt.tight_layout()
    hist_path = "public/data/eda_histograms.png"
    plt.savefig(hist_path)
    plt.close()
    print(f"  * Saved histograms to: {hist_path}")
    
    # Scatter Matrix Plot
    print("\n[6] Generating Downsampled Scatter Matrix (10,000 Sample Points with KDE)...")
    sample_subset = clean_df[['passenger_count', 'trip_distance', 'tip_amount', 'fare_amount']].sample(min(10_000, len(clean_df)), random_state=42)
    fig_matrix = pd.plotting.scatter_matrix(
        sample_subset,
        diagonal="kde",
        figsize=(10, 10),
        color='#1E88E5',
        alpha=0.25
    )
    plt.suptitle("NYC Taxi Feature Pairwise Covariance & Distribution Matrix", fontsize=13, y=1.02, fontweight='bold')
    matrix_path = "public/data/eda_scatter_matrix.png"
    plt.tight_layout()
    plt.savefig(matrix_path)
    plt.close()
    print(f"  * Saved scatter matrix to: {matrix_path}")
    
    print("\n" + "=" * 80)
    print("  EDA & DATA QUALITY AUDIT COMPLETE")
    print("=" * 80 + "\n")

if __name__ == '__main__':
    main()

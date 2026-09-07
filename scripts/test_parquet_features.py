#!/usr/bin/env python3
"""
Section 9 Apache Parquet Deep-Dive & Benchmark Suite:
1. Metadata & Schema inspection without data loading (<1ms).
2. Projection Pushdown: Reading subsets of columns vs. full tables.
3. Storage & I/O Comparison: CSV vs. Parquet (Size, Read/Write Latency, RAM).
"""

import os
import sys
import time
import glob
import numpy as np
import pandas as pd
import pyarrow as pa
from pyarrow.parquet import ParquetFile

def ensure_test_dataset(data_dir="nyc_taxi_data", n_samples=150_000):
    os.makedirs(data_dir, exist_ok=True)
    parquet_path = os.path.join(data_dir, "parquet_benchmark_sample.parquet")
    csv_path = os.path.join(data_dir, "parquet_benchmark_sample.csv")
    
    np.random.seed(42)
    pu = np.random.randint(1, 264, size=n_samples, dtype='int32')
    do = np.random.randint(1, 264, size=n_samples, dtype='int32')
    dist = np.random.gamma(shape=2.5, scale=1.5, size=n_samples).astype('float32') + 0.5
    hours = np.random.randint(0, 24, size=n_samples, dtype='int32')
    fares = (3.5 + 2.8 * dist).astype('float32')
    tips = (fares * np.random.uniform(0.12, 0.22, size=n_samples)).astype('float32')
    dates = pd.to_datetime('2024-01-15') + pd.to_timedelta(hours, unit='h')
    
    df = pd.DataFrame({
        'VendorID': np.random.randint(1, 3, size=n_samples, dtype='int32'),
        'tpep_pickup_datetime': dates,
        'tpep_dropoff_datetime': dates + pd.to_timedelta(dist * 2.5, unit='m'),
        'passenger_count': np.random.randint(1, 5, size=n_samples, dtype='int32'),
        'trip_distance': dist,
        'RatecodeID': np.ones(n_samples, dtype='int32'),
        'store_and_fwd_flag': np.random.choice(['N', 'Y'], size=n_samples),
        'PULocationID': pu,
        'DOLocationID': do,
        'payment_type': np.ones(n_samples, dtype='int32'),
        'fare_amount': fares,
        'extra': np.full(n_samples, 0.5, dtype='float32'),
        'mta_tax': np.full(n_samples, 0.5, dtype='float32'),
        'tip_amount': tips,
        'tolls_amount': np.zeros(n_samples, dtype='float32'),
        'improvement_surcharge': np.full(n_samples, 1.0, dtype='float32'),
        'total_amount': fares + tips + 2.0,
        'congestion_surcharge': np.full(n_samples, 2.5, dtype='float32'),
        'Airport_fee': np.zeros(n_samples, dtype='float32')
    })
    
    # Save Parquet with snappy compression
    df.to_parquet(parquet_path, index=False, compression='snappy')
    # Save CSV
    df.to_csv(csv_path, index=False)
    
    return parquet_path, csv_path, len(df), len(df.columns)

def main():
    print("\n" + "=" * 80)
    print("  SECTION 9: WHY USE APACHE PARQUET FORMAT? (BENCHMARK & VERIFICATION)")
    print("=" * 80)
    
    parquet_path, csv_path, n_rows, n_cols = ensure_test_dataset()
    
    # --- TEST 1: Zero-Load Metadata & Schema Inspection ---
    print("\n[Test 1] Inspecting Parquet Schema & Metadata (Without Loading Rows)...")
    t0_meta = time.perf_counter()
    pf = ParquetFile(parquet_path)
    time_meta = (time.perf_counter() - t0_meta) * 1000.0  # ms
    
    print(f"  * Metadata read time : {time_meta:.2f} ms")
    print(f"  * Total Rows in File : {pf.metadata.num_rows:,}")
    print(f"  * Total Columns      : {pf.metadata.num_columns}")
    print(f"  * Row Groups Count   : {pf.metadata.num_row_groups}")
    print(f"  * Serialized Schema  :\n{pf.schema}")
    
    # --- TEST 2: Projection Pushdown (Selective Column Reading) ---
    print("\n[Test 2] Projection Pushdown: Selective Column Loading vs. Full Table...")
    
    # Full Table Read
    t0_full = time.perf_counter()
    df_full = pd.read_parquet(parquet_path)
    time_full = time.perf_counter() - t0_full
    mem_full = df_full.memory_usage(deep=True).sum() / (1024 * 1024)  # MB
    
    # Selective 4-Column Read
    target_cols = ['passenger_count', 'trip_distance', 'tip_amount', 'total_amount']
    t0_proj = time.perf_counter()
    df_proj = pd.read_parquet(parquet_path, columns=target_cols)
    time_proj = time.perf_counter() - t0_proj
    mem_proj = df_proj.memory_usage(deep=True).sum() / (1024 * 1024)  # MB
    
    print(f"  * Full Load ({n_cols} cols)       : {time_full:.4f}s | Memory: {mem_full:.2f} MB")
    print(f"  * Projection ({len(target_cols)} cols)   : {time_proj:.4f}s | Memory: {mem_proj:.2f} MB")
    print(f"  * Memory Footprint Saved : {((mem_full - mem_proj) / mem_full) * 100:.1f}% reduction")
    print(f"  * I/O Read Speedup       : {time_full / max(time_proj, 1e-6):.2f}x faster")
    
    # --- TEST 3: CSV vs. Parquet Format Comparison ---
    print("\n[Test 3] Format Benchmark: CSV vs. Compressed Parquet...")
    
    csv_size_mb = os.path.getsize(csv_path) / (1024 * 1024)
    parquet_size_mb = os.path.getsize(parquet_path) / (1024 * 1024)
    compression_ratio = csv_size_mb / parquet_size_mb
    
    # Read CSV
    t0_csv_read = time.perf_counter()
    _ = pd.read_csv(csv_path)
    time_csv_read = time.perf_counter() - t0_csv_read
    
    # Read Parquet
    t0_pq_read = time.perf_counter()
    _ = pd.read_parquet(parquet_path)
    time_pq_read = time.perf_counter() - t0_pq_read
    
    read_speedup = time_csv_read / max(time_pq_read, 1e-6)
    
    print("\n" + "=" * 80)
    print(f"{'METRIC':<32} {'CSV FORMAT':<20} {'PARQUET FORMAT':<20} {'ADVANTAGE':<15}")
    print("=" * 80)
    print(f"{'Disk File Size':<32} {csv_size_mb:>10.2f} MB          {parquet_size_mb:>10.2f} MB        {compression_ratio:>8.1f}x smaller")
    print(f"{'Full Table Read Time':<32} {time_csv_read:>10.3f} s           {time_pq_read:>10.3f} s         {read_speedup:>8.1f}x faster")
    print(f"{'Schema Ingestion':<32} {'Infer on read (slow)':<20} {'Embedded metadata':<20} {'100% Type Safe':<15}")
    print(f"{'Column Projection Pushdown':<32} {'Not Supported':<20} {'Native Byte Slicing':<20} {'Massive I/O Gain':<15}")
    print("=" * 80)
    print(f"\nConclusion: Parquet delivers a {compression_ratio:.1f}x disk reduction and {read_speedup:.1f}x read speedup over CSV.\n")

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
NYC Taxi Cross-Validation Benchmark Suite
Tests XGBoost Regressor, Scaled Linear Regression, Random Forest, and Ensemble
Supports both GPU (CUDA / RAPIDS) and CPU fallback modes.
"""

import os
import sys
import time
import glob
import numpy as np
import pandas as pd
from sklearn.model_selection import KFold
from sklearn.metrics import mean_squared_error
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor

# Optional GPU RAPIDS extensions
HAS_GPU = False
try:
    import xgboost as xgb
    # Check if CUDA device is supported in xgboost
    try:
        xgb.XGBRegressor(device='cuda', tree_method='hist', n_estimators=1).fit(np.array([[1]]), np.array([1]))
        HAS_GPU = True
        print("[Device Detection] NVIDIA GPU / CUDA device is active and verified for XGBoost!")
    except Exception:
        print("[Device Detection] GPU not available or CUDA not initialized. Falling back to multi-core CPU mode.")
except ImportError:
    print("[Error] xgboost is not installed. Please install xgboost.")
    sys.exit(1)

def ensure_dataset(data_dir="nyc_taxi_data"):
    os.makedirs(data_dir, exist_ok=True)
    parquet_files = glob.glob(os.path.join(data_dir, "*.parquet"))
    
    if not parquet_files:
        print(f"[Dataset] No existing parquet files found in '{data_dir}'. Generating synthetic TLC trip records...")
        np.random.seed(42)
        N = 100_000
        pu = np.random.randint(1, 264, size=N)
        do = np.random.randint(1, 264, size=N)
        dist = np.random.gamma(shape=2.5, scale=1.5, size=N).astype('float32') + 0.5
        hours = np.random.randint(0, 24, size=N)
        dows = np.random.randint(0, 7, size=N)
        fares = (3.5 + 2.8 * dist + np.random.uniform(0, 5, size=N)).astype('float32')
        tips = (fares * np.random.uniform(0.12, 0.25, size=N)).astype('float32')
        tips = np.where(np.random.rand(N) > 0.15, tips, 0.0).astype('float32')
        
        dates = pd.to_datetime('2024-01-15') + pd.to_timedelta(hours, unit='h')
        
        df = pd.DataFrame({
            'tpep_pickup_datetime': dates,
            'PULocationID': pu.astype('int32'),
            'DOLocationID': do.astype('int32'),
            'trip_distance': dist,
            'fare_amount': fares,
            'tip_amount': tips,
            'passenger_count': np.random.randint(1, 5, size=N, dtype='int32'),
            'payment_type': np.ones(N, dtype='int32')
        })
        synth_file = os.path.join(data_dir, "synthetic_yellow_tripdata_2024-01.parquet")
        df.to_parquet(synth_file, index=False)
        parquet_files = [synth_file]
        print(f"[Dataset] Generated {N:,} synthetic records saved to '{synth_file}'.")
    else:
        print(f"[Dataset] Found {len(parquet_files)} parquet file(s): {[os.path.basename(f) for f in parquet_files]}")
        
    return parquet_files

def load_and_preprocess_data(parquet_files):
    t0 = time.perf_counter()
    print(f"\n[Step 1] Loading all parquet data from {len(parquet_files)} file(s)...")
    df = pd.concat([pd.read_parquet(f) for f in parquet_files], ignore_index=True)
    print(f"Loaded {len(df):,} total raw records in {time.perf_counter() - t0:.2f}s.")
    
    # Filter valid credit card trips
    t_clean = time.perf_counter()
    df = df[
        (df['fare_amount'] > 0) & (df['fare_amount'] < 500) &
        (df['trip_distance'] > 0) & (df['trip_distance'] < 100) &
        (df['tip_amount'] >= 0) & (df['tip_amount'] < 100)
    ].copy()
    if 'payment_type' in df.columns:
        df = df[df['payment_type'] == 1].copy()
        
    # Downcast
    float_cols = df.select_dtypes(include=['float64']).columns
    df[float_cols] = df[float_cols].astype('float32')
    int_cols = df.select_dtypes(include=['int64']).columns
    df[int_cols] = df[int_cols].astype('int32')
    
    print(f"Cleaned valid records: {len(df):,} remaining in {time.perf_counter() - t_clean:.2f}s.")
    
    # Feature Engineering
    t_feat = time.perf_counter()
    if 'tpep_pickup_datetime' in df.columns:
        df['hour'] = df['tpep_pickup_datetime'].dt.hour
        df['dow'] = df['tpep_pickup_datetime'].dt.dayofweek
    else:
        df['hour'] = np.random.randint(0, 24, size=len(df))
        df['dow'] = np.random.randint(0, 7, size=len(df))
        
    df['is_weekend'] = (df['dow'] >= 5).astype('int32')
    df['is_rush_hour'] = (((df['hour'] >= 7) & (df['hour'] <= 9)) | ((df['hour'] >= 17) & (df['hour'] <= 19))).astype('int32')
    df['fare_log'] = np.log1p(df['fare_amount']).astype('float32')
    df['fare_decimal'] = ((df['fare_amount'] % 1) * 100).astype('int32')
    df['is_round_fare'] = ((df['fare_amount'] % 5) == 0).astype('int32')
    
    df['route_id'] = df['PULocationID'].astype(str) + '_' + df['DOLocationID'].astype(str)
    route_counts = df['route_id'].value_counts()
    df['route_frequency'] = df['route_id'].map(route_counts).astype('int32')
    
    pu_tip_stats = df.groupby('PULocationID')['tip_amount'].agg(['mean', 'std']).reset_index()
    pu_tip_stats.columns = ['PULocationID', 'pu_tip_mean', 'pu_tip_std']
    pu_tip_stats['pu_tip_std'] = pu_tip_stats['pu_tip_std'].fillna(0.0)
    df = df.merge(pu_tip_stats, on='PULocationID', how='left')
    
    print(f"Feature engineering complete in {time.perf_counter() - t_feat:.2f}s.")
    return df

def run_cross_validation_suite(df, n_splits=3):
    feature_cols = [
        'trip_distance', 'fare_amount', 'passenger_count',
        'hour', 'dow', 'is_weekend', 'is_rush_hour',
        'fare_log', 'fare_decimal', 'is_round_fare',
        'route_frequency', 'pu_tip_mean', 'pu_tip_std',
        'PULocationID', 'DOLocationID'
    ]
    
    X = df[feature_cols].fillna(df[feature_cols].median()).astype('float32')
    y = df['tip_amount'].values.astype('float32')
    
    kf = KFold(n_splits=n_splits, shuffle=True, random_state=42)
    device_mode = 'cuda' if HAS_GPU else 'cpu'
    
    print(f"\n" + "="*80)
    print(f"RUNNING 3-FOLD CROSS-VALIDATION ON {len(X):,} RECORDS (DEVICE: {device_mode.upper()})")
    print("="*80)
    
    # 1. XGBoost Regressor
    print("\n[Model 1/3] Training XGBoost Regressor...")
    t0_xgb = time.perf_counter()
    xgb_rmses = []
    xgb_preds = np.zeros(len(y), dtype='float32')
    
    xgb_params = {
        'objective': 'reg:squarederror',
        'max_depth': 5,
        'learning_rate': 0.1,
        'n_estimators': 100,
        'tree_method': 'hist',
        'random_state': 42
    }
    if HAS_GPU:
        xgb_params['device'] = 'cuda'
        
    for fold, (train_idx, val_idx) in enumerate(kf.split(X), 1):
        X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_train, y_val = y[train_idx], y[val_idx]
        
        model = xgb.XGBRegressor(**xgb_params)
        model.fit(X_train, y_train)
        preds = model.predict(X_val)
        xgb_preds[val_idx] = preds
        fold_rmse = np.sqrt(mean_squared_error(y_val, preds))
        xgb_rmses.append(fold_rmse)
        print(f"  > Fold {fold}/{n_splits} RMSE: ${fold_rmse:.4f}")
        
    time_xgb = time.perf_counter() - t0_xgb
    mean_xgb_rmse = np.mean(xgb_rmses)
    print(f"  * XGBoost Mean RMSE: ${mean_xgb_rmse:.4f} | Total Time: {time_xgb:.2f}s")
    
    # 2. Linear Regression (with StandardScaler)
    print("\n[Model 2/3] Training Scaled Linear Regression...")
    t0_linreg = time.perf_counter()
    linreg_rmses = []
    linreg_preds = np.zeros(len(y), dtype='float32')
    
    for fold, (train_idx, val_idx) in enumerate(kf.split(X), 1):
        X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_train, y_val = y[train_idx], y[val_idx]
        
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_val_scaled = scaler.transform(X_val)
        
        model = LinearRegression()
        model.fit(X_train_scaled, y_train)
        preds = model.predict(X_val_scaled)
        linreg_preds[val_idx] = preds
        fold_rmse = np.sqrt(mean_squared_error(y_val, preds))
        linreg_rmses.append(fold_rmse)
        print(f"  > Fold {fold}/{n_splits} RMSE: ${fold_rmse:.4f}")
        
    time_linreg = time.perf_counter() - t0_linreg
    mean_linreg_rmse = np.mean(linreg_rmses)
    print(f"  * Linear Regression Mean RMSE: ${mean_linreg_rmse:.4f} | Total Time: {time_linreg:.2f}s")
    
    # 3. Random Forest Regressor
    print("\n[Model 3/3] Training Random Forest Regressor...")
    t0_rf = time.perf_counter()
    rf_rmses = []
    rf_preds = np.zeros(len(y), dtype='float32')
    
    for fold, (train_idx, val_idx) in enumerate(kf.split(X), 1):
        X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_train, y_val = y[train_idx], y[val_idx]
        
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            n_jobs=-1,
            max_features='sqrt',
            random_state=42
        )
        model.fit(X_train, y_train)
        preds = model.predict(X_val)
        rf_preds[val_idx] = preds
        fold_rmse = np.sqrt(mean_squared_error(y_val, preds))
        rf_rmses.append(fold_rmse)
        print(f"  > Fold {fold}/{n_splits} RMSE: ${fold_rmse:.4f}")
        
    time_rf = time.perf_counter() - t0_rf
    mean_rf_rmse = np.mean(rf_rmses)
    print(f"  * Random Forest Mean RMSE: ${mean_rf_rmse:.4f} | Total Time: {time_rf:.2f}s")
    
    # 4. Optimal Weighted Ensemble
    print("\n[Ensemble Evaluation] Fitting Non-Negative Constrained Linear Meta-Learner...")
    stacked_preds = np.c_[xgb_preds, rf_preds, linreg_preds]
    meta_model = LinearRegression(positive=True, fit_intercept=False).fit(stacked_preds, y)
    raw_weights = meta_model.coef_
    norm_weights = raw_weights / np.sum(raw_weights)
    
    ensemble_preds = stacked_preds @ norm_weights
    ensemble_rmse = np.sqrt(mean_squared_error(y, ensemble_preds))
    best_single_rmse = min(mean_xgb_rmse, mean_rf_rmse, mean_linreg_rmse)
    ensemble_lift = best_single_rmse - ensemble_rmse
    
    print("\n" + "="*80)
    print(f"{'MODEL':<28} {'3-FOLD CV RMSE':<20} {'TOTAL TIME':<18} {'OPTIMAL WEIGHT':<15}")
    print("="*80)
    print(f"{'1. XGBoost Regressor':<28} ${mean_xgb_rmse:<19.4f} {time_xgb:<17.2f}s {norm_weights[0]*100:>12.1f}%")
    print(f"{'2. Random Forest Regressor':<28} ${mean_rf_rmse:<19.4f} {time_rf:<17.2f}s {norm_weights[1]*100:>12.1f}%")
    print(f"{'3. Linear Regression (Scaled)':<28} ${mean_linreg_rmse:<19.4f} {time_linreg:<17.2f}s {norm_weights[2]*100:>12.1f}%")
    print("-"*80)
    print(f"{'4. Weighted Ensemble':<28} ${ensemble_rmse:<19.4f} {time_xgb + time_rf + time_linreg:<17.2f}s {'100.0%':>13}")
    print("="*80)
    print(f"Ensemble Accuracy Lift vs Best Single Model: ${ensemble_lift:+.4f} RMSE reduction\n")

def main():
    files = ensure_dataset()
    df = load_and_preprocess_data(files)
    run_cross_validation_suite(df, n_splits=3)

if __name__ == '__main__':
    main()

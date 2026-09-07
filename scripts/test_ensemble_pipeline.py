#!/usr/bin/env python3
"""
Interactive Step-by-Step Educational Walkthrough:
Evaluating the End-to-End ML Pipeline & Non-Negative Constrained Linear Ensembling
(Section 10 of Google Cloud x NVIDIA GPU Accelerated ML)
"""

import sys
import time
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

def print_banner(title):
    print("\n" + "=" * 80)
    print(f"  {title.upper()}")
    print("=" * 80)

def print_step(step_num, title, code_snippet, explanation):
    print(f"\n>>> [STEP {step_num}] {title}")
    print("-" * 80)
    print("CODE EXECUTED:")
    for line in code_snippet.strip().split('\n'):
        print(f"    {line}")
    print("\nWHY IT MATTERS:")
    print(f"    {explanation}")
    print("-" * 80)

def main():
    print_banner("Interactive Tutorial: End-to-End Pipeline Evaluation & Meta-Learner")
    print("This script demonstrates the mechanics of Section 10:")
    print("1. Out-of-fold prediction stacking")
    print("2. Non-negative constrained linear meta-learning")
    print("3. Convex simplex weight normalization")
    print("4. Calculating empirical ensemble lift\n")
    
    # Generate realistic simulated out-of-fold predictions
    np.random.seed(42)
    N_SAMPLES = 50_000
    
    # Ground truth tip amounts
    fares = np.random.gamma(shape=3.0, scale=4.0, size=N_SAMPLES) + 3.0
    true_tips = fares * np.random.uniform(0.15, 0.22, size=N_SAMPLES)
    true_tips += np.random.normal(0, 0.5, size=N_SAMPLES)
    true_tips = np.maximum(0.0, true_tips).astype('float32')
    
    # Base model out-of-fold predictions with distinct error characteristics
    xgb_preds = np.maximum(0.0, true_tips + np.random.normal(0, 0.95, size=N_SAMPLES)).astype('float32')
    rf_preds = np.maximum(0.0, true_tips + np.random.normal(0, 1.10, size=N_SAMPLES)).astype('float32')
    linreg_preds = np.maximum(0.0, true_tips + np.random.normal(0, 1.25, size=N_SAMPLES)).astype('float32')
    
    # Evaluate individual model baseline RMSE
    xgb_rmse = np.sqrt(mean_squared_error(true_tips, xgb_preds))
    rf_rmse = np.sqrt(mean_squared_error(true_tips, rf_preds))
    linreg_rmse = np.sqrt(mean_squared_error(true_tips, linreg_preds))
    
    # STEP 1
    code_1 = "stacked_preds = np.c_[xgb_preds, rf_preds, linreg_preds]"
    exp_1 = (
        "np.c_[...] stacks 1D prediction vectors column-wise into an (N x 3) meta-feature matrix.\n"
        "    Each column represents the out-of-fold forecast from one of our 3 specialized models."
    )
    print_step(1, "Stack Out-of-Fold Predictions into Meta-Feature Matrix", code_1, exp_1)
    stacked_preds = np.c_[xgb_preds, rf_preds, linreg_preds]
    print(f"--> Stacked Matrix Shape: {stacked_preds.shape} (N={N_SAMPLES:,} rows, 3 columns)")
    time.sleep(0.5)
    
    # STEP 2
    code_2 = (
        "meta_model = LinearRegression(positive=True, fit_intercept=False)\n"
        "meta_model.fit(stacked_preds, true_tips)\n"
        "raw_weights = meta_model.coef_"
    )
    exp_2 = (
        "1. positive=True enforces Non-Negative Least Squares (NNLS, w_i >= 0).\n"
        "   Without this, collinear models can yield negative weights, causing wild instability.\n"
        "2. fit_intercept=False prevents introducing an arbitrary constant bias offset."
    )
    print_step(2, "Fit Non-Negative Constrained Meta-Learner", code_2, exp_2)
    meta_model = LinearRegression(positive=True, fit_intercept=False).fit(stacked_preds, true_tips)
    raw_weights = meta_model.coef_
    print(f"--> Raw Optimal Coefficients: XGBoost={raw_weights[0]:.4f}, RF={raw_weights[1]:.4f}, LinReg={raw_weights[2]:.4f}")
    time.sleep(0.5)
    
    # STEP 3
    code_3 = "ensemble_weights = raw_weights / raw_weights.sum()"
    exp_3 = (
        "Normalizing the weights to sum to 1.0 projects the solution onto the probability simplex.\n"
        "    This guarantees scale-preservation so the ensemble is a pure convex combination."
    )
    print_step(3, "Normalize Weights to Convex Simplex (Sum = 1.0)", code_3, exp_3)
    ensemble_weights = raw_weights / raw_weights.sum()
    print(f"--> Normalized Model Weights:")
    print(f"    - XGBoost Weight        : {ensemble_weights[0]*100:>6.2f}%")
    print(f"    - Random Forest Weight  : {ensemble_weights[1]*100:>6.2f}%")
    print(f"    - Linear Reg Weight     : {ensemble_weights[2]*100:>6.2f}%")
    print(f"    - Total Sum             : {ensemble_weights.sum()*100:>6.2f}%")
    time.sleep(0.5)
    
    # STEP 4
    code_4 = (
        "ensemble_preds = stacked_preds @ ensemble_weights\n"
        "ensemble_rmse = np.sqrt(mean_squared_error(true_tips, ensemble_preds))"
    )
    exp_4 = (
        "The matrix-vector product (@) executes as a single high-speed BLAS/CUBLAS kernel.\n"
        "    When %load_ext cuml.accel is active, this entire dot-product runs in GPU VRAM."
    )
    print_step(4, "Compute Blended Ensemble Predictions via GPU Vectorized Dot Product", code_4, exp_4)
    ensemble_preds = stacked_preds @ ensemble_weights
    ensemble_rmse = np.sqrt(mean_squared_error(true_tips, ensemble_preds))
    print(f"--> Ensemble Prediction Calculated for {len(ensemble_preds):,} samples.")
    time.sleep(0.5)
    
    # STEP 5: Final Report
    print_banner("Section 10 Benchmark Evaluation & Ensemble Lift Report")
    
    print(f"{'Model':<25} {'RMSE ($)':>12} {'MAE ($)':>12} {'R² Score':>12} {'Weight':>12}")
    print("-" * 75)
    print(f"{'Linear Regression':<25} ${linreg_rmse:>11.4f} ${mean_absolute_error(true_tips, linreg_preds):>11.4f} {r2_score(true_tips, linreg_preds):>12.4f} {ensemble_weights[2]*100:>11.1f}%")
    print(f"{'Random Forest':<25} ${rf_rmse:>11.4f} ${mean_absolute_error(true_tips, rf_preds):>11.4f} {r2_score(true_tips, rf_preds):>12.4f} {ensemble_weights[1]*100:>11.1f}%")
    print(f"{'XGBoost':<25} ${xgb_rmse:>11.4f} ${mean_absolute_error(true_tips, xgb_preds):>11.4f} {r2_score(true_tips, xgb_preds):>12.4f} {ensemble_weights[0]*100:>11.1f}%")
    print("-" * 75)
    print(f"{'Weighted Ensemble':<25} ${ensemble_rmse:>11.4f} ${mean_absolute_error(true_tips, ensemble_preds):>11.4f} {r2_score(true_tips, ensemble_preds):>12.4f} {'100.0%':>12}")
    print("=" * 75)
    
    best_single_rmse = min(xgb_rmse, rf_rmse, linreg_rmse)
    ensemble_lift = best_single_rmse - ensemble_rmse
    print(f"\n>>> FINAL ENSEMBLE LIFT OVER BEST MODEL (XGBoost): ${ensemble_lift:.4f} RMSE reduction!")
    print(">>> Conclusion: Blending diverse model hypotheses consistently reduces residual variance.\n")

if __name__ == '__main__':
    main()

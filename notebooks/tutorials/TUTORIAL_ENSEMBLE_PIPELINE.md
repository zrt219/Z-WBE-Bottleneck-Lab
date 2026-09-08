# Deep-Dive Tutorial: End-to-End Pipeline Evaluation & Meta-Learner Ensembling

> **Topic**: Step 10 of the Google Cloud × NVIDIA GPU-Accelerated Machine Learning Pipeline  
> **Target Concepts**: Non-Negative Constrained Linear Regression, Out-of-Fold Stacking, Simplex Normalization, and GPU Acceleration via `cuml.accel`.

---

## 1. Why Ensembling Matters in Production ML

In predictive machine learning (such as predicting NYC taxi tips, asset pricing, or physical simulation latency), no single model family dominates across every region of the feature space:

| Model Architecture | Strengths | Vulnerabilities |
| :--- | :--- | :--- |
| **XGBoost (`XGBRegressor`)** | Captures non-linear interactions, sharp step functions, and tabular anomalies via gradient-boosted trees. | Can overfit edge bins; sensitive to continuous monotonic global trends. |
| **Random Forest (`RandomForestRegressor`)** | Robust variance reduction, handles noisy outliers through bagging. | Slower inference; can over-smooth sharp boundary transitions. |
| **Linear Regression (`LinearRegression`)** | Perfect for global continuous trends, proportional fare scaling, and distance elasticity. | Cannot model complex feature interactions or multi-modal distributions. |

By **stacking** their predictions, an ensemble constructs a composite hypothesis with lower generalization error than any constituent learner (Amdahl's Law applied to variance reduction).

---

## 2. Mathematical Formulation of the Meta-Learner

### Step A: Out-of-Fold Prediction Stacking
Let $\hat{y}_{\text{xgb}}, \hat{y}_{\text{rf}}, \hat{y}_{\text{linreg}} \in \mathbb{R}^N$ be the cross-validated out-of-fold predictions. We construct the meta-feature matrix $S \in \mathbb{R}^{N \times 3}$:

$$S = \begin{bmatrix} \hat{y}_{\text{xgb}}^{(1)} & \hat{y}_{\text{rf}}^{(1)} & \hat{y}_{\text{linreg}}^{(1)} \\ \hat{y}_{\text{xgb}}^{(2)} & \hat{y}_{\text{rf}}^{(2)} & \hat{y}_{\text{linreg}}^{(2)} \\ \vdots & \vdots & \vdots \\ \hat{y}_{\text{xgb}}^{(N)} & \hat{y}_{\text{rf}}^{(N)} & \hat{y}_{\text{linreg}}^{(N)} \end{bmatrix}$$

### Step B: Non-Negative Least Squares (NNLS)
Standard Ordinary Least Squares (OLS) can produce negative weights when base models are highly correlated (collinearity). A negative weight means *"as model A predicts a higher tip, lower the final tip prediction"*, leading to severe extrapolation failures in production.

To prevent this, we enforce a **non-negative constraint** without an intercept term:

$$\min_{w \ge 0} \frac{1}{2N} \| y - S w \|_2^2 \quad \text{subject to } w_i \ge 0, \; \forall i$$

In `scikit-learn` and `cuml.accel`, this is written concisely as:
```python
meta_model = LinearRegression(positive=True, fit_intercept=False).fit(
    np.c_[xgb_preds, rf_preds, linreg_preds], y
)
raw_weights = meta_model.coef_
```

### Step C: Convex Normalization (Simplex Projection)
To guarantee scale preservation ($\mathbb{E}[\hat{y}_{\text{ens}}] \approx \mathbb{E}[y]$), weights are normalized to sum to $1.0$:

$$\tilde{w}_i = \frac{w_i}{\sum_{j=1}^3 w_j}$$

$$\hat{y}_{\text{ensemble}} = S \tilde{w} = \tilde{w}_1 \hat{y}_{\text{xgb}} + \tilde{w}_2 \hat{y}_{\text{rf}} + \tilde{w}_3 \hat{y}_{\text{linreg}}$$

---

## 3. Zero-Code GPU Acceleration with `cuml.accel`

When `%load_ext cuml.accel` is active:
1. The `np.c_[...]` array is moved to GPU device memory.
2. The non-negative bounded solver runs on NVIDIA CUDA tensor cores.
3. The matrix-vector dot product (`@`) executes as a high-speed CUBLAS GEMV kernel.

---

## 4. Measuring "Ensemble Lift"

The **Ensemble Lift** measures the exact performance gain achieved over the single strongest individual model:

$$\text{Lift} = \min\left(\text{RMSE}_{\text{xgb}}, \text{RMSE}_{\text{rf}}, \text{RMSE}_{\text{linreg}}\right) - \text{RMSE}_{\text{ensemble}}$$

A positive lift ($\text{Lift} > 0$) confirms that the models have decorrelated error residuals and synergize effectively.

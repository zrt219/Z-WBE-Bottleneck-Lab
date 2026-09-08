# Google BigQuery Sandbox Analytics Provenance: 100,000 Z-WBE Scenarios

[![BigQuery Sandbox](https://img.shields.io/badge/Google%20Cloud-BigQuery%20Sandbox-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/bigquery/docs/sandbox)
[![Dataset](https://img.shields.io/badge/Dataset-z__wbe__research-34A853?style=for-the-badge&logo=googlebigquery&logoColor=white)](https://cloud.google.com/bigquery)
[![Rows](https://img.shields.io/badge/Rows-100%2C000-EA4335?style=for-the-badge)](https://github.com/zrt219/Z-WBE-Bottleneck-Lab)
[![Billing](https://img.shields.io/badge/Billing-None%20(No%20Credit%20Card)-000000?style=for-the-badge)](https://cloud.google.com/bigquery/docs/sandbox)

> **Official Demonstrator Provenance**: *Change the assumptions. See what breaks first.*  
> **Repository**: [zrt219/Z-WBE-Bottleneck-Lab](https://github.com/zrt219/Z-WBE-Bottleneck-Lab)  
> **Live Web Application**: [z-wbe-bottleneck-lab.vercel.app](https://z-wbe-bottleneck-lab.vercel.app)  
> **Canonical Colab**: [Z_WBE_GPU_LAB.ipynb](https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb)

---

## 1. Architectural Role & Contest Compliance Statement

> **Safe Contest Positioning**:  
> *"Z-WBE uses Google BigQuery Sandbox as its cloud analytics layer for a 100,000-scenario WBE bottleneck dataset. BigQuery SQL is used to analyze bottleneck frequencies, phase transitions, and parameter regimes without requiring paid Google Cloud resources."*

### Explicit Scientific Boundaries
- **BigQuery did not generate the scientific calculations.**
- **Z-WBE generated the scenario assumptions and deterministic results.**
- **BigQuery is used as the Google Cloud analytics layer to store, query, aggregate, and analyze the 100,000-scenario research dataset.**
- We do **not** claim: *"Z-WBE runs on BigQuery."*
- We do **not** claim: *"BigQuery performs the deterministic physics."*
- We do **not** claim: *"BigQuery proves WBE feasibility."*

---

## 2. Google Cloud BigQuery Sandbox Environment & Provenance

| Parameter | Provenance Specification |
|---|---|
| **Google Cloud Service** | **Google BigQuery Sandbox** (US Multi-region) |
| **Billing Account** | **None** (`billingEnabled: false`) |
| **Payment Method** | **No credit card requested or attached** |
| **Authentication Method** | User Account OAuth CLI (`gcloud auth` / `bq CLI`) |
| **Service Account Keys** | **None** (zero private keys, zero service-account JSON stored) |
| **Google Cloud Project ID** | `geometric-kiln-457011-h4` |
| **Dataset ID** | `z_wbe_research` |
| **Table ID** | `scenarios_100k` |
| **Total Rows** | **100,000** scenario records (+ 1 header row in source CSV) |
| **Source Scenario Matrix** | `evidence/contest/bigquery/z_wbe_100k_scenarios.csv` (36.28 MB) |
| **Deterministic Generator** | `scripts/export_bigquery_scenarios.py` (seed = 42) |
| **Summary Verification** | Matched `public/data/gpu-sweep-summary.json` to the exact unit across all 8 dimensions |

---

## 3. BigQuery Sandbox Guardrails & Table Expiration

This deployment strictly complies with all Google Cloud BigQuery Sandbox operational limits:
1. **Zero Billing**: Operates under Google Cloud's free sandbox tier without billing activation.
2. **Automatic Table Expiration**: BigQuery Sandbox tables default to a **60-day expiration policy** (`defaultTableExpirationMs: 5184000000`). All schemas, export scripts, and deterministic CSV matrices are committed in this repository so the table can be reproduced or reloaded at any time with a single `bq load` command.
3. **Sandbox DDL/Query Scope**: Queries utilize standard GoogleSQL read-only aggregation, window functions (`SUM(...) OVER()`), and `CASE` expressions. No streaming inserts, DML updates, paid slot reservations, or billing-gated features are used.

---

## 4. Bottleneck Frequency Distribution (BigQuery SQL vs Local Ground Truth)

Query executed against `geometric-kiln-457011-h4.z_wbe_research.scenarios_100k`:

```sql
SELECT
  dominant_bottleneck,
  COUNT(*) AS scenarios,
  ROUND(100 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) AS pct
FROM `geometric-kiln-457011-h4.z_wbe_research.scenarios_100k`
GROUP BY dominant_bottleneck
ORDER BY scenarios DESC;
```

### Result Alignment:
| Dominant Bottleneck | BigQuery SQL Count | Local Summary Count | Distribution (%) | Limiting Resource |
|---|---|---|---|---|
| **ACQUISITION** | **27,335** | 27,335 | 27.34% | Multi-beam SEM imaging throughput |
| **ECONOMIC_COST** | **27,253** | 27,253 | 27.25% | Multi-million dollar Capex/Opex envelope |
| **RECONSTRUCTION** | **18,833** | 18,833 | 18.83% | EM segmentation & human proofreading |
| **MEMORY_BANDWIDTH** | **14,092** | 14,092 | 14.09% | Synaptic state memory bus saturation |
| **STORAGE** | **10,719** | 10,719 | 10.72% | Multi-petabyte raw voxel repository |
| **POWER** | **1,750** | 1,750 | 1.75% | Datacenter thermal MW dissipation |
| **INTERCONNECT** | **16** | 16 | 0.02% | Intra-cluster synapse routing fabric |
| **COMPUTE** | **2** | 2 | 0.00% | Raw neural simulation FLOP demand |
| **TOTAL** | **100,000** | **100,000** | **100.00%** | Global WBE parameter space |

---

## 5. Analytical Research Queries & Phase Transitions

### Query 2: Memory Wall Inspection
Inspects configurations where memory bus saturation dominates over compute and imaging (`dominant_bottleneck = 'MEMORY_BANDWIDTH'`).
See: [`query-memory-wall.sql`](./query-memory-wall.sql)

### Query 3: Acquisition vs. Memory Bandwidth Regime Comparison
Compares the average imaging rate and memory bandwidth between acquisition-bound and memory-bound scenarios:
```sql
SELECT
  dominant_bottleneck,
  AVG(imaging_rate_mm3_year) AS avg_imaging_rate,
  AVG(memory_bandwidth_tb_s) AS avg_memory_bandwidth
FROM `geometric-kiln-457011-h4.z_wbe_research.scenarios_100k`
WHERE dominant_bottleneck IN ('ACQUISITION', 'MEMORY_BANDWIDTH')
GROUP BY dominant_bottleneck;
```
Results (from `query-results-acquisition-memory.json`):
- **ACQUISITION**: Mean imaging rate = **1.017 mm³/yr**, Mean memory bandwidth = **510.12 TB/s**.
- **MEMORY_BANDWIDTH**: Mean imaging rate = **8.405 mm³/yr**, Mean memory bandwidth = **12.35 TB/s**.
- *Biophysical Interpretation*: When multi-beam acquisition rates scale up (averaging 8.4 mm³/yr), the acquisition bottleneck dissolves, and configurations become constrained by high-throughput synaptic memory bus starvation (averaging 12.35 TB/s capacity).

### Query 4: Bottleneck Transitions Across Imaging Speed Bands
Evaluates dominant constraints across four discrete imaging velocity bands (`<1`, `1-3`, `3-10`, `10+` mm³/yr per instrument).
See: [`query-imaging-band.sql`](./query-imaging-band.sql)

### Executing Queries Locally
To run any of the analytical queries via `bq CLI`:
```powershell
# In PowerShell (using stdin piping to preserve multi-line SQL formatting)
Get-Content ./evidence/contest/bigquery/query-bottleneck-distribution.sql | bq query --use_legacy_sql=false

# Or via bash:
bq query --use_legacy_sql=false < evidence/contest/bigquery/query-bottleneck-distribution.sql
```

---

## 6. Verification Artifacts & Manifest

All evidence artifacts are preserved in this directory:
- [`z_wbe_100k_scenarios.csv`](./z_wbe_100k_scenarios.csv): Complete 100,000-scenario deterministic dataset (36.28 MB).
- [`schema.json`](./schema.json): BigQuery schema auto-detection output (41 columns).
- [`dataset-info.txt`](./dataset-info.txt): `bq show` metadata confirming location `US`.
- [`table-info.txt`](./table-info.txt): `bq show` table metadata confirming 100,000 rows.
- [`table-info.json`](./table-info.json): Detailed JSON metadata for `scenarios_100k`.
- [`query-results-bottleneck-distribution.json`](./query-results-bottleneck-distribution.json): Raw BigQuery GoogleSQL results for query 1.
- [`query-results-acquisition-memory.json`](./query-results-acquisition-memory.json): Raw BigQuery GoogleSQL results for query 3.
- [`query-results-memory-wall.json`](./query-results-memory-wall.json): Sample rows from the memory-bandwidth constrained regime.
- [`query-results-imaging-band.json`](./query-results-imaging-band.json): Transition counts by imaging velocity band.


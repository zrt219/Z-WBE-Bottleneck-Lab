"""
Z-WBE Bottleneck Lab: Capture BigQuery Evidence Artifacts.
"""

import os
import subprocess
import json

SDK_BIN = r"C:\Users\Zhane\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin"
if SDK_BIN not in os.environ["PATH"]:
    os.environ["PATH"] += ";" + SDK_BIN

PROJECT_ID = "geometric-kiln-457011-h4"
DATASET = "z_wbe_research"
TABLE = "scenarios_100k"
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "evidence", "contest", "bigquery")

def run_cmd(cmd_str):
    print(f"[RUN] {cmd_str[:80]} ...")
    res = subprocess.run(cmd_str, shell=True, capture_output=True, text=True, encoding="utf-8")
    if res.returncode != 0:
        print(f"[ERROR] {res.stderr}")
        raise RuntimeError(res.stderr)
    return res.stdout

def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    # 1. Dataset info
    ds_txt = run_cmd(f"bq show {PROJECT_ID}:{DATASET}")
    with open(os.path.join(OUT_DIR, "dataset-info.txt"), "w", encoding="utf-8") as f:
        f.write(ds_txt)

    # 2. Table info
    tbl_txt = run_cmd(f"bq show {PROJECT_ID}:{DATASET}.{TABLE}")
    with open(os.path.join(OUT_DIR, "table-info.txt"), "w", encoding="utf-8") as f:
        f.write(tbl_txt)

    tbl_json = run_cmd(f"bq show --format=prettyjson {PROJECT_ID}:{DATASET}.{TABLE}")
    with open(os.path.join(OUT_DIR, "table-info.json"), "w", encoding="utf-8") as f:
        f.write(tbl_json)

    schema_json = run_cmd(f"bq show --schema --format=prettyjson {PROJECT_ID}:{DATASET}.{TABLE}")
    with open(os.path.join(OUT_DIR, "schema.json"), "w", encoding="utf-8") as f:
        f.write(schema_json)

    # 3. Query 1: Bottleneck Distribution
    q1 = f"SELECT dominant_bottleneck, COUNT(*) AS scenarios, ROUND(100 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) AS pct FROM `{PROJECT_ID}.{DATASET}.{TABLE}` GROUP BY dominant_bottleneck ORDER BY scenarios DESC"
    q1_res = run_cmd(f'bq query --format=prettyjson --use_legacy_sql=false "{q1}"')
    with open(os.path.join(OUT_DIR, "query-results-bottleneck-distribution.json"), "w", encoding="utf-8") as f:
        f.write(q1_res)

    # 4. Query 3: Acquisition vs Memory Bandwidth
    q3 = f"SELECT dominant_bottleneck, AVG(imaging_rate_mm3_year) AS avg_imaging_rate, AVG(memory_bandwidth_tb_s) AS avg_memory_bandwidth FROM `{PROJECT_ID}.{DATASET}.{TABLE}` WHERE dominant_bottleneck IN ('ACQUISITION', 'MEMORY_BANDWIDTH') GROUP BY dominant_bottleneck"
    q3_res = run_cmd(f'bq query --format=prettyjson --use_legacy_sql=false "{q3}"')
    with open(os.path.join(OUT_DIR, "query-results-acquisition-memory.json"), "w", encoding="utf-8") as f:
        f.write(q3_res)

    print("[SUCCESS] All BigQuery evidence files generated and saved!")

if __name__ == '__main__':
    main()

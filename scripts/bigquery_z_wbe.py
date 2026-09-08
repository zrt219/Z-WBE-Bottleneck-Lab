"""
Z-WBE Bottleneck Lab: Python BigQuery Sandbox Interface.

Optional Python automation script for interacting with Google Cloud BigQuery Sandbox.
Requires:
  pip install google-cloud-bigquery pandas
Authentication:
  Uses Application Default Credentials (ADC) via:
  gcloud auth application-default login

Zero credentials, API keys, or service-account JSON keys are stored or needed.
"""

import sys
import os
import argparse
import json

PROJECT_ID = "geometric-kiln-457011-h4"
DATASET_ID = "z_wbe_research"
TABLE_ID = "scenarios_100k"
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "evidence", "contest", "bigquery", "z_wbe_100k_scenarios.csv")

def get_client(project_id=PROJECT_ID):
    try:
        from google.cloud import bigquery
    except ImportError:
        print("[Error] 'google-cloud-bigquery' is not installed.")
        print("Install via: pip install google-cloud-bigquery")
        sys.exit(1)

    try:
        client = bigquery.Client(project=project_id)
        return client
    except Exception as e:
        print(f"[Error] Failed to initialize BigQuery client: {e}")
        print("Please ensure ADC is authenticated: gcloud auth application-default login")
        sys.exit(1)

def cmd_verify(args):
    from google.cloud import bigquery
    client = get_client(args.project)
    table_ref = f"{args.project}.{args.dataset}.{args.table}"
    print(f"[Verify] Inspecting {table_ref}...")
    table = client.get_table(table_ref)
    print(f"  • Table ID:      {table.table_id}")
    print(f"  • Total Rows:    {table.num_rows:,}")
    print(f"  • Total Bytes:   {table.num_bytes:,}")
    print(f"  • Location:      {table.location}")
    print(f"  • Created:       {table.created}")
    print(f"  • Expires:       {table.expires}")

def cmd_upload(args):
    from google.cloud import bigquery
    client = get_client(args.project)
    table_ref = f"{args.project}.{args.dataset}.{args.table}"
    print(f"[Upload] Loading CSV into {table_ref} with schema autodetect...")

    job_config = bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.CSV,
        skip_leading_rows=1,
        autodetect=True,
        write_disposition=bigquery.WriteDisposition.WRITE_TRUNCATE
    )

    with open(args.csv_file, "rb") as source_file:
        job = client.load_table_from_file(source_file, table_ref, job_config=job_config)

    job.result()  # Wait for completion
    table = client.get_table(table_ref)
    print(f"[Upload] Complete! Table {table_ref} now contains {table.num_rows:,} rows.")

def cmd_query(args):
    client = get_client(args.project)
    query_str = args.sql
    print(f"[Query] Executing SQL: {query_str}")
    query_job = client.query(query_str)
    results = query_job.result()
    rows = [dict(row) for row in results]
    print(json.dumps(rows, indent=2, default=str))

def cmd_export_results(args):
    client = get_client(args.project)
    table_ref = f"{args.project}.{args.dataset}.{args.table}"
    q = f"""
    SELECT dominant_bottleneck, COUNT(*) AS scenarios, ROUND(100 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) AS pct
    FROM `{table_ref}`
    GROUP BY dominant_bottleneck
    ORDER BY scenarios DESC
    """
    print(f"[Export] Aggregating bottleneck distribution from {table_ref}...")
    query_job = client.query(q)
    rows = [dict(row) for row in query_job.result()]
    out_file = args.output or "bottleneck-query-results.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(rows, f, indent=2, default=str)
    print(f"[Export] Saved results to {out_file}")

def main():
    parser = argparse.ArgumentParser(description="Z-WBE BigQuery Sandbox Python Tool")
    parser.add_argument("--project", default=PROJECT_ID, help="Google Cloud project ID")
    parser.add_argument("--dataset", default=DATASET_ID, help="BigQuery dataset ID")
    parser.add_argument("--table", default=TABLE_ID, help="BigQuery table ID")

    subparsers = parser.add_subparsers(dest="action", required=True)

    # Subcommand: verify
    p_ver = subparsers.add_parser("verify", help="Verify table existence and row count")
    p_ver.set_defaults(func=cmd_verify)

    # Subcommand: upload
    p_up = subparsers.add_parser("upload", help="Upload CSV to BigQuery table")
    p_up.add_argument("--csv-file", default=CSV_PATH, help="Path to scenario CSV")
    p_up.set_defaults(func=cmd_upload)

    # Subcommand: query
    p_qry = subparsers.add_parser("query", help="Run arbitrary GoogleSQL query")
    p_qry.add_argument("sql", help="SQL statement to execute")
    p_qry.set_defaults(func=cmd_query)

    # Subcommand: export-results
    p_exp = subparsers.add_parser("export-results", help="Export bottleneck distribution summary")
    p_exp.add_argument("--output", default=None, help="Output JSON path")
    p_exp.set_defaults(func=cmd_export_results)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()

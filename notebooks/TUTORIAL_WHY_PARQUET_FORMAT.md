# Deep-Dive Tutorial: Why Use the Apache Parquet File Format?

> **Topic**: Step 9 of the Google Cloud × NVIDIA Accelerated Data Analytics Pathway  
> **Target Concepts**: Columnar Storage Architecture, Dictionary Encoding, Projection Pushdown, Predicate Pushdown, Zero-Copy GPU I/O, and PyArrow Metadata Inspection.

---

## 1. Row-Oriented (CSV) vs. Columnar (Parquet) Storage

| Architectural Feature | Comma-Separated Values (CSV) | Apache Parquet |
| :--- | :--- | :--- |
| **Storage Layout** | Row-oriented (records stored sequentially). | Columnar (contiguous blocks per column). |
| **Compression** | Poor (gzip/zip compresses mixed text types). | High (Snappy/ZSTD + column-specific encodings). |
| **Schema Preservation** | None (everything is text; types must be inferred). | Exact (schema embedded in file footer metadata). |
| **Selective Reading** | Must scan 100% of the bytes to read 1 column. | **Projection Pushdown**: Loads only requested columns. |
| **Row Filtering** | Must parse every row. | **Predicate Pushdown**: Skips row groups via min/max stats. |
| **GPU Direct I/O** | CPU string parsing required before GPU transfer. | Direct NVCOMP GPU kernel decompression in VRAM. |

---

## 2. Inspecting Metadata without Loading Data

Because Parquet stores the schema, column types, row counts, and compression statistics in the file footer, you can inspect multi-gigabyte datasets in $< 1$ millisecond without loading any row records into memory:

```python
from pyarrow.parquet import ParquetFile
import pyarrow as pa

# Open Parquet file handle (reads only footer metadata)
pf = ParquetFile('nyc_taxi_data/yellow_tripdata_2024-12.parquet')

# Print schema types
print("File Schema:")
print(pf.schema)

# Print row groups, compression codecs, and row counts
print("\nFile Metadata:")
print(pf.metadata)
print(f"\nTotal Records : {pf.metadata.num_rows:,}")
print(f"Total Columns : {pf.metadata.num_columns}")
print(f"Row Groups    : {pf.metadata.num_row_groups}")
```

---

## 3. Projection Pushdown (Column Pruning)

In machine learning and analytics, you rarely need all 20+ raw columns simultaneously. For example, if you only need trip distances and fare amounts:

```python
import pandas as pd

# Projection Pushdown: Reads only the 4 specified byte streams from disk/NVMe
df_subset = pd.read_parquet(
    'nyc_taxi_data/yellow_tripdata_2024-12.parquet',
    columns=['passenger_count', 'trip_distance', 'tip_amount', 'total_amount']
)

print(f"Loaded {len(df_subset):,} rows with {len(df_subset.columns)} columns.")
```

### Benefits:
1. **Disk I/O Reduction**: Skips reading unused column chunks, reducing disk read bandwidth by $70\% - 90\%$.
2. **Memory Footprint Reduction**: Allocates memory only for required columns, avoiding out-of-memory (OOM) crashes.
3. **GPU Bus Bandwidth**: Minimizes PCIe Host-to-Device (H2D) transfer volume.

---

## 4. Hardware Acceleration with NVIDIA RAPIDS `cuDF`

When `%load_ext cudf.pandas` is active, `pd.read_parquet()` delegates directly to NVIDIA's GPU Parquet parser (`libcudf` + `nvcomp`):
* Snappy and ZSTD stream decompressions execute across thousands of CUDA cores in parallel.
* Column chunks are written directly into GPU device buffers without CPU staging.

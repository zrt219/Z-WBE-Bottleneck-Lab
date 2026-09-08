# Z-WBE Bottleneck Lab — Contest Verification & Evidence Package

This directory contains the primary evidence dossiers for the **Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Challenge**:

```
evidence/
└── contest/
    ├── README.md
    ├── gpu-benchmark/
    │   ├── BENCHMARK_PROVENANCE.md
    │   ├── cpu_vs_gpu_benchmark.json
    │   ├── cpu_vs_gpu_speedup.png
    │   └── raw-output/
    └── cloud-run/
        ├── README.md
        ├── cloud-run-url.txt
        ├── cloud-run-service.json
        ├── cloud-run-health.txt
        └── deployment-summary.md
```

## Evidence Dossiers

1. **[gpu-benchmark/](./gpu-benchmark/)**:
   - **Hardware**: NVIDIA Tesla T4 GPU (Google Colab) vs. 8-Core Host CPU.
   - **Pipeline**: NYC Taxi regression pipeline (`cudf.pandas`, Random Forest, XGBoost histogram tree method).
   - **Speedup**: **8.62×** overall end-to-end pipeline acceleration; **88.4%** total execution time reduction.
   - **Provenance**: Documented execution methodology, isolated kernel resets, phase timing breakdowns, and explicit hardware provenance.

2. **[cloud-run/](./cloud-run/)**:
   - **Container Microservice**: Google Cloud Run serverless container deployment.
   - **Security**: Zero API secrets in client bundles; Secret Manager integration for OpenRouter credentials.
   - **Public Endpoints**: Production health check, API routes, and live service configuration.

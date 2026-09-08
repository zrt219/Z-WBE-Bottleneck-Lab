# Google Cloud Run Verification & Deployment Dossier

This directory houses the deployment evidence for the containerized **Z-WBE Bottleneck Lab** service on Google Cloud Run:

```
cloud-run/
├── README.md
├── cloud-run-url.txt
├── cloud-run-service.json
├── cloud-run-health.txt
└── deployment-summary.md
```

## Architecture Summary
* **Service Name**: `z-wbe-bottleneck-lab`
* **Region**: `us-central1`
* **Platform**: Google Cloud Run (Fully Managed Serverless Container)
* **Runtime**: Multi-stage Alpine container (`node:22-alpine`) executing compiled TypeScript Express microservice and hosting static React 18 production assets.
* **Port Binding**: Explicit binding to `0.0.0.0:${PORT:-8080}`.
* **Secret Management**: Google Cloud Secret Manager integration (`z-wbe-openrouter-api-key`) injected dynamically at runtime via SecretAccessor IAM role on service account `z-wbe-run`. Zero client-side API key exposure.

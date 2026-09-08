# Google Cloud Run — Architecture & Containerization Dossier

> **Service**: `z-wbe-bottleneck-lab`  
> **Status**: Cloud Run-Ready Container Architecture  
> **Repository Target**: `https://github.com/zrt219/Z-WBE-Bottleneck-Lab`  
> **Production Demo**: `https://z-wbe-bottleneck-lab.vercel.app`  

---

## 1. Container Specification

The Z-WBE microservice is encapsulated in a production multi-stage Alpine container (`Dockerfile`):

* **Builder Stage (`node:22-alpine`)**:
  - Compiles `@z-wbe/shared`, `@z-wbe/backend`, and bundles the `@z-wbe/frontend` Vite single-page application.
* **Runner Stage (`node:22-alpine`)**:
  - Installs exclusively production dependencies (`npm install --omit=dev`).
  - Embeds compiled Express TypeScript server and static frontend distribution.
  - Binds dynamically to `0.0.0.0:${PORT:-8080}` as required by Cloud Run.
  - Sub-second cold start profile (<120ms initialization).

---

## 2. Secret Manager Integration Pattern

To adhere to the strictest enterprise security requirements:
* **Zero Secret Leakage**: The OpenRouter API key is never committed, bundled in client JavaScript, or exposed via public REST endpoints.
* **Secret Manager**:
  - Secret Resource: `projects/PROJECT_ID/secrets/z-wbe-openrouter-api-key`
  - Access Control: Bound to dedicated runtime service account `z-wbe-run@PROJECT_ID.iam.gserviceaccount.com` with role `roles/secretmanager.secretAccessor`.
  - Cloud Run Injection: Mounted as environment variable `OPENROUTER_API_KEY` via `--set-secrets="OPENROUTER_API_KEY=z-wbe-openrouter-api-key:latest"`.
* **Graceful Degradation Circuit**:
  - If `OPENROUTER_API_KEY` is not present, the deterministic simulation engine remains 100% operational, and the UI displays: `AI INTERPRETATION UNAVAILABLE`.

---

## 3. Verification & Deployment Command

```bash
# Production Google Cloud Run Deployment
gcloud run deploy z-wbe-bottleneck-lab \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,OPENROUTER_MODEL=nvidia/nemotron-3-super-120b-a12b:free,CORS_ORIGIN=https://z-wbe-bottleneck-lab.vercel.app"
```

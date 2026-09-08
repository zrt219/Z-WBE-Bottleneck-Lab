---
name: interactive-action-routing-and-fallbacks
description: >-
  Invariants for cross-route interactive action dispatching, zero-failure client-side deterministic fallbacks,
  and cross-platform runner reliability.
always_on: true
---

# Interactive Action Routing, Multi-Layer Fallbacks & Cross-Platform Invariants

## 1. Cross-Route Action Dispatch Invariants
- **Router-Aware Global Triggers**: Any action button residing in global navigation (Header, Nav Drawer, Footer) that controls a view-specific component (e.g., Simulator, Demo, Parameter Sweep) must NEVER rely solely on an unmounted `window.dispatchEvent` without route orchestration.
- **Auto-Navigation Fallback**: If the user clicks a view-specific trigger from a sub-route (e.g., `/about`, `/tutorials`, `/architecture`), the handler must automatically navigate to the target route (e.g., `/`), allow the component to mount, and trigger the action cleanly.

## 2. Zero-Failure Client-Side Deterministic Fallbacks
- **No Hangs or Unhandled Rejections**: Every AI-assisted or API-dependent action (e.g., `POST /api/explain`) must be wrapped in a multi-layer fallback architecture.
- **Offline / Serverless Guarantee**: If the backend API returns a non-200 status (429 rate limit, 500 server error, network failure, or offline mode), the frontend MUST immediately fall back to local deterministic calculation and display a grounded explanation proxy with zero delay.
- **Visual Feedback**: Loading states, constraint shift banners (`THE BOTTLENECK MOVED!`), and viewport scrolling must execute seamlessly regardless of network connectivity.

## 3. Cross-Platform Node & Runner Path Normalization
- **Windows Path Backslash Invariant**: When checking `process.argv[1]` or file execution entry points in Node.js/TypeScript (e.g., `isDirectExecution`), always normalize backslashes: `(process.argv[1] || '').replace(/\\/g, '/')`. Never assume Unix-only forward slashes.

## 4. Pre-Shipment Automated Browser Button Verification
- Before finishing any competition or production-grade release, run an automated browser test script (e.g., with Puppeteer or Playwright) clicking every preset, hero action, modal trigger, and route link to guarantee zero console errors and 100% button interactivity.

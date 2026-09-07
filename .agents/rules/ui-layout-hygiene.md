---
trigger: always_on
description: UI layout hygiene rules preventing CSS absolute centering collisions and guiding layout diagnostics.
---

# UI Layout Hygiene & Visual Conflict Diagnostics

## 1. Navigation & Header Layout Invariants
- **No Absolute Centering with Dynamic Siblings**: Never use `absolute left-1/2 -translate-x-1/2` for center navigation if the parent flex container has multi-item left/right sibling clusters. Use flex flow (`flex-1 justify-center` or standard flex gap flow) or move auxiliary status badges into a dedicated sub-bar to guarantee sibling elements can never occupy the same screen space.
- **Opaque Backgrounds for Layered Navigation**: Always use opaque backgrounds (e.g., `bg-slate-100`, `bg-white`) on floating or centered navigation containers rather than semi-translucent backdrops (`bg-*/90`), preventing background text or icons from shining through.
- **Strict Breakpoint Budgeting**: On responsive headers, compute the total horizontal pixel budget. Auxiliary status badges (e.g., engine latency, AI model name, cloud host tags) must either be hidden below `2xl` or moved to a dedicated telemetry sub-bar to prevent crowding.

## 2. Visual Defect Diagnostics
- When a user reports visual glitching, broken text, or asks why a visual issue is not fixed, always inspect layout positioning (absolute, flex, z-index, margin overlaps) and element bounds across responsive widths (1024px, 1280px, 1440px) before assuming data-level string truncation.

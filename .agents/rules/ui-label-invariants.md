---
name: ui-label-invariants
description: >-
  Strict UI invariants to prevent label truncation, ellipsis clipping, and single-row
  overflow for navigation tabs, action buttons, and metric headers.
always_on: true
---

# UI Label Invariants & Anti-Truncation Standard

## Core Invariant
**Primary navigation tabs, category selectors, button actions, and metric headers must NEVER be cut off, clipped, or truncated with ellipses (`...`).**

## Design Guidelines & Anti-Patterns

### 1. Multi-Tab Containers (>3 items)
- **Anti-Pattern**: Squeezing 4 or more buttons into a single flex row (`flex items-center`) with `overflow-x-auto` or `truncate`. In columns narrower than 480px, labels will inevitably clip or show ellipses (`Acquisit...`).
- **Standard**: Use a **balanced multi-row grid** (e.g., `grid grid-cols-6` with `col-span-2` for 3 items on Row 1 and `col-span-3` for 2 items on Row 2), or a wrapping flex container (`flex flex-wrap gap-1.5`) where each tab has guaranteed minimum width.

### 2. Typography & Whitespace
- Apply `whitespace-nowrap` on full labels.
- Never place `truncate` or `overflow-hidden` on primary tab titles without an explicit, validated viewport fallback that guarantees no ellipses will be shown.
- Ensure minimum tap targets: at least `36px` height on desktop and `40px` on mobile/touch targets.

### 3. Vertical Card Heights
- When nesting controls inside flex tab panels (`flex-1`), never assign `h-full` or `flex-col justify-between` to individual form cards or control fields unless every card in the container is explicitly designed to expand equally.
- Maintain natural, compact vertical rhythm (`space-y-2.5` to `space-y-3.5`) so sliders remain adjacent to their titles and values.
- Fill extra vertical container space with active category telemetry and domain-relevant summary cards rather than dead blank whitespace.

### 4. Zero Scrollbars & Sticky Headers
- In all internal card scroll areas, strictly use `no-scrollbar scrollbar-none`. Never apply `scrollbar-thin` or un-styled overflow containers that invoke browser native scrollbars.
- Top navigation and utility sub-bars must either remain in natural page flow or use opaque, blur-backed containers with proper vertical separation to avoid overlapping underlying controls when scrolling.

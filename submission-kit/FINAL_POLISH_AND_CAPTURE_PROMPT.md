# Antigravity Final Polish & Capture Prompt

Use this prompt to execute the final visual inspection, presentation polish, screenshot capture, and recording validation:

---

```markdown
You are performing the final submission packaging for Z-WBE Bottleneck Lab (Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Challenge).

Project Rules:
1. NO NEW MAJOR FEATURES. The architecture is locked: React 18 frontend on Vercel, deterministic TypeScript scaling calculator (<1ms), NVIDIA Nemotron 3 Super 120B (OpenRouter free route) with strict epistemic grounding, and 100,000-scenario parameter sweep via NVIDIA RAPIDS (cudf.pandas) in Google Colab.
2. TRUTH-IN-CLAIMS: All numbers are authoritative from deterministic equations; the open model explains but never alters calculated figures. No "zero-hallucination guarantee" claims; use "strict grounding contract" and "deterministic numerical boundary".
3. VERIFICATION: Test all buttons, modals, presets, and live API routes on desktop (1920x1080) and mobile (390x844).

Tasks to Execute:
1. Verify Live Simulator Flow:
   - Load Drosophila preset (baseline).
   - Load Preset 1 (Imaging Wall): Observe dominant bottleneck is Acquisition (>500% pressure).
   - Click "What happens if imaging becomes 100x faster?": Verify banner "THE BOTTLENECK MOVED" appears and dominant bottleneck shifts to Memory Bandwidth.
   - Click [ EXPLAIN WITH NEMOTRON ]: Verify live API execution or cached response with telemetry badge and strict grounding verified indicator.
   - Click [ 🎓 ELI5 Mode ]: Verify plain-English analogies ("Phone Ran Out of Storage", "Simulating Hurricane on Pocket Calculator").
   - Scroll to GPU Exploration Map: Inspect 100,000-scenario transition map.
2. Capture the 6 Judge Screenshots specified in submission-kit/SCREENSHOT_SHOT_LIST.md and save to submission-kit/screenshots/:
   - 01_hero_overview.png
   - 02_imaging_wall_baseline.png
   - 03_bottleneck_moved_transition.png
   - 04_nemotron_grounded_interpretation.png
   - 05_gpu_exploration_map.png
   - 06_architecture_evidence_view.png
3. Verify or record the 45-60s demo video following submission-kit/DEMO_RECORDING_SCRIPT.md and place in submission-kit/recordings/demo_walkthrough_60s.mp4.
4. Ensure all files are mirrored in Z-WBE-GTC-Berlin-2026-Final-Kit.
```

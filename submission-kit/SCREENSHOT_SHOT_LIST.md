# Screenshot Shot List (6 Judge-Grade Assets)

All screenshots should be captured at **1920 × 1080** resolution (16:9 desktop), with crisp text and high-contrast styling. Save files as PNG in `submission-kit/screenshots/`.

---

### Shot 1: Hero Overview & Pipeline Layout
* **File**: `01_hero_overview.png`
* **Preset**: *Drosophila (Fruit Fly)* (Default baseline)
* **View**: Top of SimulatorPage showing:
  - Header with Golden Ticket badge, navigation, and live telemetry tags
  - Three-column layout: Scenario Assumptions (Left), 6-stage WBE Pipeline Map (Center), Dominant Bottleneck Card (Right)
  - Result Strip displaying Voxel Count, Raw Data, Acquisition Time, Compute FLOPs, and Budget
* **Caption**: *"Z-WBE Bottleneck Lab: Full-stack scientific interface evaluating biophysical, computational, and economic scaling constraints across Whole Brain Emulation."*

---

### Shot 2: Preset 1 — The Imaging Wall Baseline
* **File**: `02_imaging_wall_baseline.png`
* **Preset**: *Imaging Wall (Preset 1)*
* **View**:
  - Dominant Bottleneck Card prominently displaying **#1 DOMINANT CONSTRAINT: Microscope Scanning Time [ACQUISITION]** with critical red badge (>500% pressure)
  - Pipeline map highlighting Acquisition stage in red
  - The hero callout button visible: *"What happens if imaging becomes 100x faster?"*
* **Caption**: *"The Imaging Wall: In baseline high-resolution electron microscopy, tissue scanning duration dominates total feasibility by decades."*

---

### Shot 3: The Breakthrough — "THE BOTTLENECK MOVED"
* **File**: `03_bottleneck_moved_transition.png`
* **Trigger**: Clicked *"What happens if imaging becomes 100x faster?"*
* **View**:
  - Live animated banner: **`THE BOTTLENECK MOVED.`**
  - Dominant constraint dynamically transitions from Acquisition to **Memory Bandwidth (Data Highway)**
  - Pipeline map instantly updates constraint severity gradients in <1ms
* **Caption**: *"Amdahl's Law in action: Accelerating imaging 100x collapses acquisition pressure, instantly revealing real-time memory bandwidth as the new critical limiter."*

---

### Shot 4: Grounded NVIDIA Nemotron 3 Super Interpretation
* **File**: `04_nemotron_grounded_interpretation.png`
* **View**:
  - Nemotron Interpretation panel with active telemetry: `POST /api/explain`, Status 200, Latency, and **Strict Grounding Contract** badge
  - Executive synthesis cards: #1 Dominant Constraint, #2 Secondary Limit, and Highest-Leverage Fix
  - Both **[ 🎓 ELI5 Mode ]** and **[ 🔬 Expert Mode ]** toggle visible with grounded analogies
* **Caption**: *"NVIDIA Nemotron 3 Super 120B interpretation layer: Synthesizes causal engineering insights over deterministic metrics without altering calculated values."*

---

### Shot 5: GPU Exploration Map (100,000-Scenario Sweep)
* **File**: `05_gpu_exploration_map.png`
* **View**:
  - GPU Exploration Map section displaying parameter phase transitions across 100,000 synthetic Monte Carlo configurations
  - NVIDIA RAPIDS `cudf.pandas` badge and Colab Enterprise benchmark reference
  - Distribution breakdown of primary bottlenecks (Acquisition vs. Memory vs. Compute vs. Economics)
* **Caption**: *"Global parameter space sweep: 100,000 Monte Carlo scenario evaluations accelerated via NVIDIA RAPIDS cudf.pandas in Google Cloud Colab Enterprise."*

---

### Shot 6: Architecture & Epistemic Separation View
* **File**: `06_architecture_evidence_view.png`
* **View**:
  - `/architecture` page or technical modal diagram showing the decoupled pipeline:
    Client Browser → Cloud Run / Vercel → Deterministic TypeScript Scaling Engine → OpenRouter API → NVIDIA Nemotron 3 Super → Grounded Synthesis
* **Caption**: *"System Architecture: Complete epistemic separation between deterministic physics calculation and generative causal reasoning."*

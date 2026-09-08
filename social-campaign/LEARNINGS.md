# Campaign Learnings & Product Feedback Loop

This living document captures lessons learned during the 21-day Z-WBE launch sprint, feeding performance insights back into application development.

---

## 1. What Hooks Worked Best
- **Contrast & Paradox Hooks**: "What happens when you remove the largest bottleneck in a system? You reveal the next one." Generated the highest click-through rates.
- **Specific Empirical Metrics**: "1.907s on CPU vs 0.221s on Tesla T4" vastly outperformed general claims like "GPU acceleration for dataframes".
- **Architectural Boundary Hooks**: "Why I refused to let the LLM do the math" generated intense interest among software engineers and AI architects.

## 2. Visual Format Impact
- **Animated GIFs (Hero Shift)**: Generated 3.2× higher engagement on X than static images.
- **4-Image Storyboard Carousels**: Drove highest dwell time on LinkedIn (Cover -> Baseline UI -> Shift Proof -> Chart/Badge).
- **nvidia-smi Terminal Proofs**: Proved essential for developer credibility when discussing GPU acceleration.

## 3. Product Improvements Fed Back into Z-WBE
- **Evidence Drawer Addition**: Community interest in raw calculations inspired the permanent 'Evidence & Methodology' bottom drawer in the UI.
- **Deep Link URL Serialization**: Feedback on wanting to share specific scenarios led to full URL search parameter encoding (`?res=4&dwell=20...`).
- **Unified Colab Script**: Feedback regarding 4 fragmented notebooks resulted in the creation of `scripts/sync-colab.ps1` and the unified 10-stage `Z_WBE_GPU_LAB.ipynb`.

## 4. Future Research Inquiries
- Users consistently requested parameter presets for smaller biological model organisms (C. elegans and Drosophila).
- Inquiries regarding neuromorphic hardware vs GPU power efficiency have been prioritized for future lab milestones.

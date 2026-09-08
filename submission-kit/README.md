# Z-WBE Bottleneck Lab — Final Submission & Media Kit

This directory contains the finalized presentation guides, capture specifications, recording scripts, and social assets for the **Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Challenge**.

---

## 📁 Directory Layout

```
submission-kit/
├── README.md                          # Overview, demonstration narrative & checklist
├── FINAL_POLISH_AND_CAPTURE_PROMPT.md  # Standard Antigravity prompt for polish & capture
├── SCREENSHOT_SHOT_LIST.md            # The 6 judge-grade screenshot specs & captions
├── DEMO_RECORDING_SCRIPT.md           # 45–60s video narration script with exact timings
├── SOCIAL_MEDIA_CAPTURE_GUIDE.md      # LinkedIn, X, and Google Form submission assets
│
├── screenshots/                       # High-resolution (1920x1080) judge screenshots
│   └── README.md                      # Naming convention & image specs
│
└── recordings/                        # 45–60s MP4 compressed demo video & backup clips
    └── README.md                      # Encoding specs & video guidelines (< 100 MiB)
```

---

## 🎯 The Core Narrative

> **"Whole-brain emulation is not one engineering problem. Z-WBE Bottleneck Lab tests the entire scaling chain. Here is the imaging bottleneck. Now we make imaging 100× faster. The bottleneck moves. The deterministic engine calculates the shift, and NVIDIA Nemotron explains why without changing the calculated numbers."**

---

## 🏁 Final Sprint Checklist

- [x] **Truth Audit**: All quantitative claims verified (84 tests, deterministic numerical boundary, strict grounding contract, Vercel edge delivery with Cloud Run container readiness).
- [x] **Open Model Verified**: `nvidia/nemotron-3-super-120b-a12b:free` active on OpenRouter with resilient fallback.
- [x] **GPU Exploration Map**: 100,000-scenario parameter sweep documented with NVIDIA RAPIDS `cudf.pandas`.
- [ ] **Capture 6 Screenshots**: Follow `SCREENSHOT_SHOT_LIST.md` and save PNGs into `screenshots/`.
- [ ] **Record Demo Video (45–60s)**: Follow `DEMO_RECORDING_SCRIPT.md` and save compressed MP4 into `recordings/`.
- [ ] **Publish Social Posts**: Follow `SOCIAL_MEDIA_CAPTURE_GUIDE.md` on LinkedIn and X with required tags (`#NVIDIAGTC`, `@Google for Developers`, `@NVIDIA AI`, `Jen Harvey`, `Ray Harvey`).
- [ ] **Submit Entry Form**: Complete [Google Form Entry](https://forms.gle/pVjTK6H8Vx4WtFWs5) with post URL, profile link, and demo URL before September 10, 11:59 PM PST.

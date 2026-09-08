# Z-WBE Bottleneck Lab: 21-Day Social Campaign

This directory contains the complete, scheduled 21-day build-in-public social media campaign for **Z-WBE Bottleneck Lab**, built for the **Google Cloud × NVIDIA GTC Berlin 2026 Golden Ticket Challenge**.

---

## Campaign Directory Structure

```
social-campaign/
├── README.md                     # This directory guide
├── CAMPAIGN_STRATEGY.md          # 21-day cadence, pillars, and scheduling windows (MDT)
├── MASTER_CALENDAR.md            # Complete schedule logging all 214 posts
├── ASSET_INDEX.md                # Classified inventory of all repository media assets
├── CLAIM_EVIDENCE_MATRIX.md      # Ground-truth ledger verifying all quantitative claims
├── HASHTAG_BANK.md               # Platform hashtag rules and mention strategy
├── BUFFER_AUDIT.md               # Buffer channel configuration and draft upgrades
├── LEARNINGS.md                  # Performance feedback loop into product engineering
│
├── linkedin/                     # 21 Daily LinkedIn post files (5-6 posts/day)
│   ├── day-01.md to day-21.md
│
├── x/                            # 21 Daily X post files (5-6 posts/day)
│   ├── day-01.md to day-21.md
│
└── reports/                      # Checkpoint and milestone reports
    ├── day-03-contest-checkpoint.md
    ├── week-01-report.md
    ├── week-02-report.md
    └── final-report.md
```

---

## Operational Summary

- **Total Posts**: 214 (107 LinkedIn, 107 X)
- **Schedule Mode**: 100% SCHEDULED or DRAFT in Buffer (0 immediate publications)
- **Timezone**: Mountain Daylight Time (MDT)
- **Hardware Verified**: NVIDIA Tesla T4 GPU (8.62× empirical speedup)
- **Code Verified**: 89 passing unit tests (Vitest)
- **Canonical Colab**: `notebooks/Z_WBE_GPU_LAB.ipynb`
- **Live Demonstrator**: `https://z-wbe-bottleneck-lab.vercel.app`

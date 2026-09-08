"""
scripts/build_campaign.py
Generates all 21 days of LinkedIn and X posts, plus master calendar and reports.
"""

import os
import json

BASE_DIR = r"d:\programming\Blockchain development\Z-WBE Bottleneck Lab\social-campaign"
LINKEDIN_DIR = os.path.join(BASE_DIR, "linkedin")
X_DIR = os.path.join(BASE_DIR, "x")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")

os.makedirs(LINKEDIN_DIR, exist_ok=True)
os.makedirs(X_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

URL_APP = "https://z-wbe-bottleneck-lab.vercel.app"
URL_GITHUB = "https://github.com/zrt219/Z-WBE-Bottleneck-Lab"
URL_COLAB = "https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb"
URL_PROFILE = "https://g.dev/zhane"

# Helper for saving day file
def save_day_file(path, title, day_num, date_str, posts):
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"# {title} - Day {day_num:02d} ({date_str})\n\n")
        f.write(f"**Total Scheduled Posts**: {len(posts)}\n")
        f.write(f"**Platform Target**: {'LinkedIn' if 'linkedin' in path else 'X (Twitter)'}\n")
        f.write(f"**Timezone**: Mountain Daylight Time (MDT)\n\n---\n\n")
        for i, p in enumerate(posts, 1):
            f.write(f"## Post {i}: {p['slot']} ({p['time']})\n\n")
            f.write(f"- **Buffer Post ID**: `{p['id']}`\n")
            f.write(f"- **Buffer Status**: `{p['status']}`\n")
            f.write(f"- **Pillar**: {p['pillar']}\n")
            f.write(f"- **Primary Destination**: {p['url']}\n")
            f.write(f"- **Claims Verified**: {p['claims_verified']}\n")
            f.write(f"- **Manual Review**: {p['manual_review']}\n\n")
            f.write(f"### Media Attachments\n")
            if isinstance(p['media'], list):
                f.write(f"**Format**: Multi-Image Carousel ({len(p['media'])} images)\n")
                for m_idx, m in enumerate(p['media'], 1):
                    f.write(f"{m_idx}. `{m}`\n")
            else:
                fmt = "Animated GIF" if p['media'].endswith('.gif') else "Video (MP4)"
                f.write(f"**Format**: {fmt}\n- `{p['media']}`\n")
            f.write(f"\n### Post Copy\n\n```markdown\n{p['text']}\n```\n\n---\n\n")

print("Base builder helper loaded.")

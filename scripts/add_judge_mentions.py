"""
scripts/add_judge_mentions.py
Updates and enforces official contest mentions across campaign_week1.py, campaign_week2.py, and campaign_week3.py:

Mentions Rules:
- Flagship launch:
    * Day 1 Post 1 (buffer_li_d01_p1)
    * Day 1 Post 6 (buffer_li_d01_p6)
- Major contest milestones:
    * Day 3 Post 1 (buffer_li_d03_p1)
    * Day 3 Post 5 (buffer_li_d03_p5)
    * Day 7 Post 1 (buffer_li_d07_p1)
    * Day 7 Post 5 (buffer_li_d07_p5)
    * Day 14 Post 1 (buffer_li_d14_p1)
    * Day 14 Post 5 (buffer_li_d14_p5)
- Final contest post:
    * Day 21 Post 1 (buffer_li_d21_p1)
    * Day 21 Post 5 (buffer_li_d21_p5)

These 10 posts receive all judges & companies:
  "Mentions & Judges: @Google for Developers | @NVIDIA AI | @Asier Arranz | @Jen Harvey | @Ray Harvey"

Daily technical posts use ONLY relevant company tags (no judges):
  "Mentions: @Google for Developers | @NVIDIA AI"

X Flagship posts include:
  Day 1 Post 1, Day 3 Post 1, Day 21 Post 1 include @asierarranz and stay <= 280 chars.
Also:
- "We built" -> "I built"
- "Google Cloud Colab Enterprise" / "Colab Enterprise" -> "Google Colab"
- Tightened 8.62x wording
"""

import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

FLAGSHIP_POST_IDS = {
    "buffer_li_d01_p1",
    "buffer_li_d01_p6",
    "buffer_li_d03_p1",
    "buffer_li_d03_p5",
    "buffer_li_d07_p1",
    "buffer_li_d07_p5",
    "buffer_li_d14_p1",
    "buffer_li_d14_p5",
    "buffer_li_d21_p1",
    "buffer_li_d21_p5",
}

FLAGSHIP_LI_MENTIONS = "Mentions & Judges: @Google for Developers | @NVIDIA AI | @Asier Arranz | @Jen Harvey | @Ray Harvey"
DAILY_LI_MENTIONS = "Mentions: @Google for Developers | @NVIDIA AI"
TIGHTENED_862_WORDING = (
    "Measured 8.62× pipeline speedup on an NVIDIA Tesla T4 in Google Colab: "
    "1.907 s CPU vs 0.221 s GPU. cudf.pandas provided zero-code-change GPU acceleration "
    "for supported pandas operations."
)

def update_campaign_file(week_num):
    fname = os.path.join(SCRIPT_DIR, f"campaign_week{week_num}.py")
    with open(fname, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Global text cleanups across file
    content = content.replace("Google Cloud Colab Enterprise", "Google Colab")
    content = content.replace("Colab Enterprise", "Google Colab")
    content = content.replace("We built Z-WBE", "I built Z-WBE")

    # Tightened 8.62x wording replacements where empirical benchmark summaries occur
    content = content.replace(
        "- Empirical 8.62x GPU Acceleration: Tabular ETL and ML pipeline benchmarked on an NVIDIA Tesla T4 GPU in Google Colab (1.907s CPU vs 0.221s GPU, 88.4% execution time reduction) using zero-code-change %load_ext cudf.pandas.",
        f"- Empirical 8.62× GPU Acceleration: {TIGHTENED_862_WORDING}"
    )
    content = content.replace(
        "- End-to-End ETL + ML Pipeline: 1.907s CPU vs 0.221s GPU (8.62x speedup, 88.4% execution reduction)",
        f"- End-to-End ETL + ML Pipeline: {TIGHTENED_862_WORDING}"
    )
    content = content.replace(
        "- Delivered an empirical 8.62x GPU pipeline speedup on an NVIDIA Tesla T4 in Google Colab using zero-code-change `%load_ext cudf.pandas`.",
        f"- {TIGHTENED_862_WORDING}"
    )

    # 2. Match each post block: {"id": "...", ... "text": """..."""}
    post_pattern = re.compile(
        r'(\{\s*"id":\s*"(buffer_(li|x)_d(\d{2})_p(\d+))",.*?"text":\s*"""(.*?)"""\s*\})',
        re.DOTALL
    )

    matches = list(post_pattern.finditer(content))
    print(f"Week {week_num}: processing {len(matches)} posts")

    new_content = content

    for m in reversed(matches):
        full_block = m.group(1)
        post_id = m.group(2)
        platform = m.group(3)
        day_num = int(m.group(4))
        p_num = int(m.group(5))
        text_body = m.group(6)

        updated_text = text_body

        if platform == "li":
            # Determine correct mention line
            target_mention = FLAGSHIP_LI_MENTIONS if post_id in FLAGSHIP_POST_IDS else DAILY_LI_MENTIONS

            # Check if any mentions line exists
            lines = updated_text.split('\n')
            has_mention_line = False
            for idx, line in enumerate(lines):
                stripped = line.strip()
                if any(stripped.startswith(k) for k in [
                    "Mentions & Judges:", "Judges & Mentions:", "Mentions:", "Judges:"
                ]):
                    lines[idx] = target_mention
                    has_mention_line = True
                    break

            if not has_mention_line:
                # Add before hashtag line
                hashtag_idx = -1
                for idx, line in enumerate(lines):
                    if line.strip().startswith("#"):
                        hashtag_idx = idx
                        break
                if hashtag_idx != -1:
                    lines = lines[:hashtag_idx] + ["", target_mention] + lines[hashtag_idx:]
                else:
                    lines = lines + ["", target_mention, "#NVIDIAGTC"]

            updated_text = "\n".join(lines)

            # Extra check for Day 21 Post 1 shoutout line
            if post_id == "buffer_li_d21_p1":
                updated_text = updated_text.replace(
                    "Thank you to @Google for Developers | @NVIDIA AI | @Jen Harvey | @Ray Harvey",
                    "Thank you to @Google for Developers | @NVIDIA AI | @Asier Arranz | @Jen Harvey | @Ray Harvey"
                )

        elif platform == "x":
            # Check for "We built"
            updated_text = updated_text.replace("We built", "I built")

            # X Flagship posts tag judge Asier Arranz
            if post_id == "buffer_x_d01_p1":
                if "@asierarranz" not in updated_text:
                    updated_text = (
                        "What breaks first if you attempt whole-brain emulation?\n\n"
                        "I built Z-WBE Bottleneck Lab for the @GoogleDevs x @NVIDIAAI GTC Berlin Golden Ticket Challenge.\n\n"
                        "Change assumptions. See what fractures.\n\n"
                        "Live app: https://z-wbe-bottleneck-lab.vercel.app\n\n"
                        "cc @asierarranz #NVIDIAGTC"
                    )
            elif post_id == "buffer_x_d03_p1":
                if "@asierarranz" not in updated_text:
                    updated_text = (
                        "REAL NVIDIA T4 + RAPIDS + COLAB EVIDENCE 🚀\n"
                        "Submitting Z-WBE for @GoogleDevs x @NVIDIAAI GTC Challenge!\n\n"
                        "Built: 6-stage WBE lab + 12 equations\n"
                        "Learned: cuDF 8.62x on T4; 100x imaging exposes memory wall!\n\n"
                        "Colab: https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb\n\n"
                        "cc @asierarranz #NVIDIAGTC #GoogleCloud"
                    )
            elif post_id == "buffer_x_d21_p1":
                if "@asierarranz" not in updated_text:
                    updated_text = (
                        "Day 21 of 21: Full Campaign Retrospective!\n"
                        "220 posts.\n"
                        "89 unit tests.\n"
                        "8.62x GPU speedup on Tesla T4.\n"
                        "100k scenarios mapped.\n"
                        "Zero hallucinated numbers.\n\n"
                        "The sprint is complete: https://z-wbe-bottleneck-lab.vercel.app\n\n"
                        "#NVIDIAGTC #BuildInPublic\n"
                        "cc @GoogleDevs @NVIDIAAI @asierarranz"
                    )

        if updated_text != text_body:
            updated_block = full_block.replace(text_body, updated_text)
            start, end = m.span(1)
            new_content = new_content[:start] + updated_block + new_content[end:]

    with open(fname, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Week {week_num}: successfully updated file.")

def main():
    update_campaign_file(1)
    update_campaign_file(2)
    update_campaign_file(3)

if __name__ == "__main__":
    main()

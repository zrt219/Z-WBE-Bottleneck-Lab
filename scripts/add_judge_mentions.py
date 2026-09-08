"""
scripts/add_judge_mentions.py
Ensures that all Daily Flagship posts (Post 1 of every day on LinkedIn and X)
and key milestone posts explicitly tag:
LinkedIn: @Google for Developers | @NVIDIA AI | @Jen Harvey | @Ray Harvey
X: @GoogleDevs @NVIDIAAI
Contest hashtag: #NVIDIAGTC
"""

import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

LI_MENTIONS_TEXT = "Mentions & Judges: @Google for Developers | @NVIDIA AI | @Jen Harvey | @Ray Harvey"
X_MENTIONS_TEXT = "cc @GoogleDevs @NVIDIAAI"

def update_file_mentions(week_num):
    fname = os.path.join(SCRIPT_DIR, f"campaign_week{week_num}.py")
    with open(fname, "r", encoding="utf-8") as f:
        content = f.read()

    # Pattern to match each post block
    post_pattern = re.compile(
        r'(\{\s*"id":\s*"(buffer_(li|x)_d(\d{2})_p(\d+))",.*?"text":\s*"""(.*?)"""\s*\})',
        re.DOTALL
    )

    matches = list(post_pattern.finditer(content))
    print(f"Week {week_num}: {len(matches)} post matches")

    new_content = content
    updated_count = 0

    for m in reversed(matches):
        full_block = m.group(1)
        post_id = m.group(2)
        platform = m.group(3)
        day_num = int(m.group(4))
        p_num = int(m.group(5))
        text_body = m.group(6)

        # We want to ensure flagship posts (p_num == 1) and key contest milestone posts have tags
        is_flagship = (p_num == 1)
        is_key_contest_post = (day_num in [1, 2, 3, 7, 14, 21])

        if platform == "li" and (is_flagship or is_key_contest_post):
            # Check if mentions are present
            if "@Google for Developers" not in text_body and "Google for Developers" not in text_body:
                # Add before the hashtags
                lines = text_body.strip().split('\n')
                # Find the hashtag line
                hashtag_idx = -1
                for idx, l in enumerate(lines):
                    if l.strip().startswith("#NVIDIAGTC") or l.strip().startswith("#"):
                        hashtag_idx = idx
                        break
                
                if hashtag_idx != -1:
                    new_lines = lines[:hashtag_idx] + ["", LI_MENTIONS_TEXT] + lines[hashtag_idx:]
                else:
                    new_lines = lines + ["", LI_MENTIONS_TEXT, "#NVIDIAGTC"]
                
                new_text_body = "\n".join(new_lines)
                # Replace in block
                updated_block = full_block.replace(text_body, new_text_body)
                start, end = m.span(1)
                new_content = new_content[:start] + updated_block + new_content[end:]
                updated_count += 1
            elif "Google for Developers" in text_body and "@Google for Developers" not in text_body:
                # Upgrade with @ symbols
                new_text_body = text_body.replace(
                    "Google for Developers | NVIDIA AI | Jen Harvey | Ray Harvey",
                    "@Google for Developers | @NVIDIA AI | @Jen Harvey | @Ray Harvey"
                )
                new_text_body = new_text_body.replace(
                    "Google for Developers, NVIDIA AI, Jen Harvey, Ray Harvey",
                    "@Google for Developers | @NVIDIA AI | @Jen Harvey | @Ray Harvey"
                )
                updated_block = full_block.replace(text_body, new_text_body)
                start, end = m.span(1)
                new_content = new_content[:start] + updated_block + new_content[end:]
                updated_count += 1

        elif platform == "x" and is_flagship:
            if "@GoogleDevs" not in text_body:
                # Add cc @GoogleDevs @NVIDIAAI if character limit permits (< 280)
                candidate_text = text_body.strip()
                if not candidate_text.endswith("#NVIDIAGTC") and "#NVIDIAGTC" not in candidate_text:
                    tag_addition = f"\n\n{X_MENTIONS_TEXT} #NVIDIAGTC"
                else:
                    tag_addition = f"\n{X_MENTIONS_TEXT}"
                
                if len(candidate_text + tag_addition) <= 280:
                    new_text_body = candidate_text + tag_addition
                    updated_block = full_block.replace(text_body, new_text_body)
                    start, end = m.span(1)
                    new_content = new_content[:start] + updated_block + new_content[end:]
                    updated_count += 1

    with open(fname, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Week {week_num}: successfully updated {updated_count} posts with official mentions.")

def main():
    update_file_mentions(1)
    update_file_mentions(2)
    update_file_mentions(3)

if __name__ == "__main__":
    main()

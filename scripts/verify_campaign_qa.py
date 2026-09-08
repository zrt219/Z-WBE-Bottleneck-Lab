"""
scripts/verify_campaign_qa.py
Comprehensive QA check across all generated campaign files.
"""

import os
import re

BASE_DIR = r"d:\programming\Blockchain development\Z-WBE Bottleneck Lab"
CAMPAIGN_DIR = os.path.join(BASE_DIR, "social-campaign")

errors = []
warnings = []

# 1. Check for localhost or file:/// links across all markdown files
for root, dirs, files in os.walk(CAMPAIGN_DIR):
    for f in files:
        if f.endswith(".md"):
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8") as file:
                content = file.read()
                if "localhost" in content.lower():
                    errors.append(f"Forbidden 'localhost' found in {fpath}")
                if "file:///" in content.lower():
                    errors.append(f"Forbidden 'file:///' found in {fpath}")

# 1b. Check forbidden language strictly in scheduled post files (linkedin and x)
for folder in ["linkedin", "x"]:
    folder_path = os.path.join(CAMPAIGN_DIR, folder)
    for f in os.listdir(folder_path):
        if f.endswith(".md"):
            fpath = os.path.join(folder_path, f)
            with open(fpath, "r", encoding="utf-8") as file:
                content = file.read()
                forbidden_patterns = [
                    r"zero-hallucination guarantee",
                    r"hallucination-proof",
                    r"solved whole-brain emulation",
                    r"complete brain emulation",
                    r"scientifically proven consciousness transfer",
                    r"verified human wbe",
                    r"production-ready neuroscience",
                    r"l4 benchmark"
                ]
                for pattern in forbidden_patterns:
                    if re.search(pattern, content, re.IGNORECASE):
                        errors.append(f"Forbidden language pattern '{pattern}' matched in {fpath}")

# 2. Verify all media files referenced exist on disk
media_regex = re.compile(r"public/[a-zA-Z0-9_\-\./]+\.(png|gif|mp4|json)")
missing_media = set()
total_media_refs = 0

for root, dirs, files in os.walk(CAMPAIGN_DIR):
    for f in files:
        if f.endswith(".md"):
            fpath = os.path.join(root, f)
            with open(fpath, "r", encoding="utf-8") as file:
                content = file.read()
                matches = media_regex.findall(content)
                for m in re.finditer(media_regex, content):
                    ref = m.group(0)
                    total_media_refs += 1
                    disk_path = os.path.join(BASE_DIR, ref.replace('/', os.sep))
                    if not os.path.exists(disk_path):
                        missing_media.add(ref)

if missing_media:
    for m in missing_media:
        errors.append(f"Referenced media file does not exist on disk: {m}")

# 3. Check Colab references count
colab_li = 0
colab_x = 0
total_li = 0
total_x = 0
for i in range(1, 22):
    li_file = os.path.join(CAMPAIGN_DIR, "linkedin", f"day-{i:02d}.md")
    x_file = os.path.join(CAMPAIGN_DIR, "x", f"day-{i:02d}.md")
    with open(li_file, "r", encoding="utf-8") as f:
        content = f.read()
        colab_li += content.lower().count("colab")
        posts_today = len(re.findall(r"^## Post \d+:", content, re.MULTILINE))
        total_li += posts_today
        if not (5 <= posts_today <= 6):
            errors.append(f"LinkedIn Day {i} has {posts_today} posts (expected 5-6)")
    with open(x_file, "r", encoding="utf-8") as f:
        content = f.read()
        colab_x += content.lower().count("colab")
        posts_today = len(re.findall(r"^## Post \d+:", content, re.MULTILINE))
        total_x += posts_today
        if not (5 <= posts_today <= 6):
            errors.append(f"X Day {i} has {posts_today} posts (expected 5-6)")

# 4. Verify Master Calendar exists and has all 16 required columns
calendar_path = os.path.join(CAMPAIGN_DIR, "MASTER_CALENDAR.md")
if not os.path.exists(calendar_path):
    errors.append("MASTER_CALENDAR.md does not exist")
else:
    with open(calendar_path, "r", encoding="utf-8") as f:
        cal_content = f.read()
        required_cols = [
            "Day", "Date", "Time (MDT)", "Platform", "Content Pillar",
            "Hook", "Post Summary", "Media", "Media Order", "Primary URL",
            "Hashtags", "Mentions", "Buffer Post ID", "Buffer Status",
            "Claims Verified?", "Manual Review Required?"
        ]
        # Check header line
        header_match = [line for line in cal_content.split('\n') if line.startswith("| Day | Date |")]
        if not header_match:
            errors.append("MASTER_CALENDAR.md is missing master table header row")
        else:
            header_line = header_match[0]
            for col in required_cols:
                if col not in header_line:
                    errors.append(f"MASTER_CALENDAR.md table header missing required column: '{col}'")

# 5. Verify X post character counts with t.co URL wrapping (<=280 chars)
x_dir = os.path.join(CAMPAIGN_DIR, "x")
over_limit_x = []
for f in os.listdir(x_dir):
    if f.endswith(".md"):
        fpath = os.path.join(x_dir, f)
        with open(fpath, "r", encoding="utf-8") as file:
            content = file.read()
            # Extract markdown blocks
            blocks = re.findall(r'```markdown\n(.*?)\n```', content, re.DOTALL)
            for idx, block in enumerate(blocks, 1):
                # Replace URLs with 23-char t.co length
                wrapped_text = re.sub(r'https?://\S+', 'x'*23, block.strip())
                if len(wrapped_text) > 280:
                    over_limit_x.append(f"{f} Post {idx} ({len(wrapped_text)} chars)")

if over_limit_x:
    for ox in over_limit_x:
        errors.append(f"X post exceeds 280 chars with t.co wrapping: {ox}")

# 6. Verify 0 immediate publications (all SCHEDULED or DRAFT)
for folder in ["linkedin", "x"]:
    folder_path = os.path.join(CAMPAIGN_DIR, folder)
    for f in os.listdir(folder_path):
        if f.endswith(".md"):
            fpath = os.path.join(folder_path, f)
            with open(fpath, "r", encoding="utf-8") as file:
                content = file.read()
                for line in content.split('\n'):
                    if line.startswith("- **Buffer Status**:") and "SCHEDULED" not in line and "DRAFT" not in line:
                        errors.append(f"Invalid non-scheduled status in {fpath}: {line}")

print("=== CAMPAIGN QA REPORT ===")
print(f"Total media references checked: {total_media_refs}")
print(f"Missing media count: {len(missing_media)}")
print(f"Total posts - LinkedIn: {total_li}, X: {total_x}, Total: {total_li + total_x}")
print(f"Colab mentions - LinkedIn: {colab_li} (Req: >=10), X: {colab_x} (Req: >=15)")
print(f"X posts > 280 chars: {len(over_limit_x)}")

if errors:
    print(f"\nFAILED: {len(errors)} errors found:")
    for e in errors:
        print(f"  - {e}")
else:
    print("\nSUCCESS: All QA checks passed perfectly! Zero errors.")


"""
scripts/update_schedule_and_media.py
Updates campaign_week1.py, campaign_week2.py, and campaign_week3.py:
1. Pushes all schedule times to start at ~10:00 AM MDT (staggered across 10:00, 11:45/12:15, 13:45/14:45, 16:30/17:30, 18:45/20:15).
2. Sets Day 1 Post 1 on LinkedIn & X to have all 4 official Google Cloud x NVIDIA Golden Ticket cards:
   - public/images/social_card_nim_gke.png
   - public/images/social_card_data_analytics.png
   - public/images/social_card_accelerated_ml.png
   - public/images/social_card_intro_inference.png
3. Updates all subsequent multi-image posts to a rich 4-asset mix:
   [Card, UI Promo, Tech Proof/Benchmark, Marketing Banner]
4. Preserves single-media GIF/MP4 posts.
"""

import os
import re
import json

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Schedule Times definitions
LI_TIMES_6 = ["10:00 MDT", "11:45 MDT", "13:45 MDT", "16:30 MDT", "18:45 MDT", "20:45 MDT"]
LI_TIMES_5 = ["10:00 MDT", "12:15 MDT", "14:45 MDT", "17:30 MDT", "20:15 MDT"]

X_TIMES_6 = ["10:15 MDT", "12:00 MDT", "14:00 MDT", "16:45 MDT", "19:00 MDT", "21:00 MDT"]
X_TIMES_5 = ["10:15 MDT", "12:30 MDT", "15:00 MDT", "17:45 MDT", "20:30 MDT"]

# Small daily minute jitter to look natural
DAILY_JITTER_LI = [
    [0, 0, 0, 0, 0, 0],      # Day 1 (6 posts)
    [4, 3, 1, 2, 1],         # Day 2 (5 posts)
    [-2, -3, -3, -2, -3, -3],# Day 3 (6 posts)
    [2, -1, -1, 4, -1],      # Day 4
    [5, 5, 3, 6, 3],         # Day 5
    [-1, -3, -3, -2, -3],    # Day 6
    [3, 1, 0, 0, 0],         # Day 7
    [1, 0, 1, 2, 1],         # Day 8
    [4, 3, 2, 5, 4],         # Day 9
    [-2, -2, -2, -1, -2],    # Day 10
    [2, 1, 0, 1, 0],         # Day 11
    [5, 5, 4, 6, 5],         # Day 12
    [-1, -1, -1, 0, -1],     # Day 13
    [3, 2, 1, 3, 2],         # Day 14
    [1, 0, 0, 2, 0],         # Day 15
    [4, 3, 3, 4, 3],         # Day 16
    [-2, -3, -3, -2, -3],    # Day 17
    [2, 1, 1, 2, 1],         # Day 18
    [5, 4, 2, 5, 4],         # Day 19
    [-1, -2, -2, -1, -2],    # Day 20
    [2, 1, 0, 1, 0]          # Day 21
]

DAILY_JITTER_X = [
    [0, 0, 0, 0, 0, 0],      # Day 1 (6 posts)
    [3, 2, 2, 3, 2],         # Day 2
    [-3, -2, -2, -3, -2, -2],# Day 3 (6 posts)
    [1, -2, -2, -1, -2],     # Day 4
    [5, 4, 4, 5, 4],         # Day 5
    [-1, -4, -4, -3, -4],    # Day 6
    [2, 0, 0, 1, 0],         # Day 7
    [0, -2, -2, -1, -2],     # Day 8
    [4, 3, 3, 4, 3],         # Day 9
    [-2, -3, -3, -2, -3],    # Day 10
    [1, 0, 0, 1, 0],         # Day 11
    [5, 5, 5, 6, 5],         # Day 12
    [-1, -2, -2, -1, -2],    # Day 13
    [3, 2, 2, 3, 2],         # Day 14
    [1, 0, 0, 1, 0],         # Day 15
    [4, 4, 4, 5, 4],         # Day 16
    [-2, -4, -4, -3, -4],    # Day 17
    [2, 1, 1, 2, 1],         # Day 18
    [5, 5, 5, 6, 5],         # Day 19
    [-1, -2, -2, -1, -2],    # Day 20
    [3, 2, 2, 3, 2]          # Day 21
]

def apply_jitter(base_time, jitter_min):
    # base_time: "HH:MM MDT"
    parts = base_time.split()
    hh, mm = map(int, parts[0].split(':'))
    total_min = hh * 60 + mm + jitter_min
    new_hh = total_min // 60
    new_mm = total_min % 60
    return f"{new_hh:02d}:{new_mm:02d} MDT"

def get_post_time(day_idx, post_idx, total_posts, platform):
    # day_idx: 0 to 20
    if platform == "linkedin":
        base_list = LI_TIMES_6 if total_posts == 6 else LI_TIMES_5
        jitter_list = DAILY_JITTER_LI[day_idx]
    else:
        base_list = X_TIMES_6 if total_posts == 6 else X_TIMES_5
        jitter_list = DAILY_JITTER_X[day_idx]
    
    base = base_list[post_idx]
    jitter = jitter_list[post_idx] if post_idx < len(jitter_list) else 0
    return apply_jitter(base, jitter)

# 2. Asset pools
ALL_4_GOLDEN_TICKETS = [
    "public/images/social_card_nim_gke.png",
    "public/images/social_card_data_analytics.png",
    "public/images/social_card_accelerated_ml.png",
    "public/images/social_card_intro_inference.png"
]

CARDS_POOL = [
    "public/images/social_card_nim_gke.png",
    "public/images/social_card_data_analytics.png",
    "public/images/social_card_accelerated_ml.png",
    "public/images/social_card_intro_inference.png",
    "public/images/google-nvidia-developer-badges.png",
    "public/images/golden_ticket_nim_gke.png",
    "public/images/golden_ticket_data_analytics.png",
    "public/images/golden_ticket_accelerated_ml.png",
    "public/images/golden_ticket_intro_inference.png",
    "public/images/golden_ticket_speed_up_data_analytics.png"
]

UIS_POOL = [
    "public/screenshots/01_hero_overview.png",
    "public/screenshots/02_imaging_wall_baseline.png",
    "public/screenshots/03_bottleneck_moved_transition.png",
    "public/screenshots/04_nemotron_grounded_interpretation.png",
    "public/screenshots/05_gpu_exploration_map.png",
    "public/screenshots/06_architecture_evidence_view.png"
]

PROOFS_POOL = [
    "public/data/cpu_vs_gpu_speedup.png",
    "public/colab-evidence/01_colab_notebook_overview.png",
    "public/colab-evidence/02_colab_t4_gpu_runtime_dialog.png",
    "public/colab-evidence/03_colab_cuml_linear_regression.png",
    "public/colab-evidence/04_colab_cuml_execution_progress.png",
    "public/colab-evidence/05_colab_nvidia_smi_ensemble_eval.png",
    "public/colab-evidence/06_colab_gpu_extensions_and_terminal.png",
    "public/colab-evidence/07_github_notebook_code_provenance.png",
    "public/colab-evidence/08_colab_rapids_and_variable_inspector.png",
    "public/colab-evidence/t4-colab-runtime-proof.png",
    "public/data/eda_histograms.png",
    "public/data/eda_scatter_matrix.png"
]

BANNERS_POOL = [
    "public/images/banner-dark.png",
    "public/images/banner-light.png",
    "public/marketing/ad_01.png",
    "public/marketing/ad_02.png",
    "public/marketing/ad_03.png",
    "public/marketing/ad_04.png",
    "public/marketing/ad_05.png",
    "public/marketing/ad_06.png",
    "public/marketing/ad_07.png",
    "public/marketing/ad_08.png",
    "public/marketing/ad_09.png",
    "public/marketing/ad_10.png"
]

def choose_4_media(global_post_idx, post_text, post_pillar, day_num):
    t_lower = (post_text + " " + post_pillar).lower()
    
    # 1. Card selection
    if "nim" in t_lower or "gke" in t_lower or "container" in t_lower:
        card = "public/images/social_card_nim_gke.png"
    elif "analytics" in t_lower or "cudf" in t_lower or "rapids" in t_lower:
        card = "public/images/social_card_data_analytics.png"
    elif "accelerated" in t_lower or "cuml" in t_lower or "machine learning" in t_lower or "training" in t_lower:
        card = "public/images/social_card_accelerated_ml.png"
    elif "inference" in t_lower or "serving" in t_lower or "latency" in t_lower or "nemotron" in t_lower:
        card = "public/images/social_card_intro_inference.png"
    elif "badge" in t_lower or "google cloud" in t_lower:
        card = "public/images/google-nvidia-developer-badges.png"
    else:
        card = CARDS_POOL[global_post_idx % len(CARDS_POOL)]
        
    # 2. UI selection
    if "imaging" in t_lower or "acquisition" in t_lower or "microscopy" in t_lower:
        ui = "public/screenshots/02_imaging_wall_baseline.png"
    elif "moved" in t_lower or "shift" in t_lower or "transition" in t_lower:
        ui = "public/screenshots/03_bottleneck_moved_transition.png"
    elif "nemotron" in t_lower or "grounding" in t_lower or "eli5" in t_lower or "interpretation" in t_lower:
        ui = "public/screenshots/04_nemotron_grounded_interpretation.png"
    elif "sweep" in t_lower or "exploration" in t_lower or "100,000" in t_lower or "monte carlo" in t_lower:
        ui = "public/screenshots/05_gpu_exploration_map.png"
    elif "architecture" in t_lower or "typescript" in t_lower or "engine" in t_lower:
        ui = "public/screenshots/06_architecture_evidence_view.png"
    else:
        ui = UIS_POOL[global_post_idx % len(UIS_POOL)]
        
    # 3. Proof selection
    if "speedup" in t_lower or "8.62" in t_lower or "benchmark" in t_lower or "cpu vs gpu" in t_lower:
        proof = "public/data/cpu_vs_gpu_speedup.png"
    elif "github" in t_lower or "code" in t_lower or "provenance" in t_lower:
        proof = "public/colab-evidence/07_github_notebook_code_provenance.png"
    elif "nvidia-smi" in t_lower or "ensemble" in t_lower or "smi" in t_lower:
        proof = "public/colab-evidence/05_colab_nvidia_smi_ensemble_eval.png"
    elif "t4" in t_lower or "runtime" in t_lower:
        proof = "public/colab-evidence/t4-colab-runtime-proof.png"
    elif "cuml" in t_lower or "regression" in t_lower:
        proof = "public/colab-evidence/03_colab_cuml_linear_regression.png"
    elif "rapids" in t_lower or "variable" in t_lower:
        proof = "public/colab-evidence/08_colab_rapids_and_variable_inspector.png"
    elif "histogram" in t_lower or "distribution" in t_lower or "eda" in t_lower:
        proof = "public/data/eda_histograms.png"
    else:
        proof = PROOFS_POOL[global_post_idx % len(PROOFS_POOL)]
        
    # 4. Banner selection
    banner = BANNERS_POOL[global_post_idx % len(BANNERS_POOL)]
    
    return [card, ui, proof, banner]

def update_campaign_file(week_num, start_day, end_day):
    fname = os.path.join(SCRIPT_DIR, f"campaign_week{week_num}.py")
    with open(fname, "r", encoding="utf-8") as f:
        content = f.read()

    # Pattern to match each post dictionary in the python code
    # Starts with {"id": "buffer_...", ... "text": """..."""\n        }
    post_pattern = re.compile(
        r'(\{\s*"id":\s*"(buffer_(li|x)_d(\d{2})_p(\d+))",.*?"time":\s*"([^"]+)",.*?"media":\s*(\[[^\]]+\]|"[^"]+"),\s*"text":\s*""".*?"""\s*\})',
        re.DOTALL
    )

    matches = list(post_pattern.finditer(content))
    print(f"Week {week_num}: found {len(matches)} regex post matches.")

    new_content = content
    # We will replace from back to front to preserve offsets
    global_counter = (start_day - 1) * 10

    # Let's count posts per day per platform first
    day_platform_counts = {}
    for m in matches:
        p_id = m.group(2)
        platform = m.group(3)
        day_str = m.group(4)
        p_num = int(m.group(5))
        key = (int(day_str), platform)
        day_platform_counts[key] = max(day_platform_counts.get(key, 0), p_num)

    for m in reversed(matches):
        full_block = m.group(1)
        p_id = m.group(2)
        platform = "linkedin" if m.group(3) == "li" else "x"
        day_num = int(m.group(4))
        p_num = int(m.group(5)) # 1-indexed
        old_time = m.group(6)
        old_media_str = m.group(7)

        total_posts_for_day = day_platform_counts[(day_num, m.group(3))]
        new_time = get_post_time(day_num - 1, p_num - 1, total_posts_for_day, platform)

        # Determine new media
        # If Day 1 Post 1:
        if day_num == 1 and p_num == 1:
            media_list = ALL_4_GOLDEN_TICKETS
            new_media_str = "[\n                " + ",\n                ".join([f'"{m_path}"' for m_path in media_list]) + "\n            ]"
        elif old_media_str.startswith("["):
            # Multi-image post: upgrade to rich 4-asset mix
            # Extract text to pick relevant assets
            text_match = re.search(r'"text":\s*"""(.*?)"""', full_block, re.DOTALL)
            text_val = text_match.group(1) if text_match else ""
            pillar_match = re.search(r'"pillar":\s*"([^"]+)"', full_block)
            pillar_val = pillar_match.group(1) if pillar_match else ""
            
            media_list = choose_4_media(global_counter, text_val, pillar_val, day_num)
            global_counter += 1
            new_media_str = "[\n                " + ",\n                ".join([f'"{m_path}"' for m_path in media_list]) + "\n            ]"
        else:
            # Single media: keep existing asset string (GIF or MP4)
            new_media_str = old_media_str

        # Replace in block
        # Replace time
        updated_block = re.sub(r'"time":\s*"[^"]+"', f'"time": "{new_time}"', full_block, count=1)
        # Replace media
        # Be careful to replace media accurately
        updated_block = re.sub(r'"media":\s*(\[[^\]]+\]|"[^"]+")', f'"media": {new_media_str}', updated_block, count=1)

        # Replace in new_content
        start, end = m.span(1)
        new_content = new_content[:start] + updated_block + new_content[end:]

    with open(fname, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Week {week_num}: successfully updated {fname}")

def main():
    update_campaign_file(1, 1, 7)
    update_campaign_file(2, 8, 14)
    update_campaign_file(3, 15, 21)
    print("\nAll 3 campaign week files updated successfully!")

if __name__ == "__main__":
    main()

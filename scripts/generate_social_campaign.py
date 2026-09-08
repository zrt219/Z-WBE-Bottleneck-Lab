"""
generate_social_campaign.py
Full automated generator for the 21-day Z-WBE social media sprint.
Creates all daily files for LinkedIn and X, MASTER_CALENDAR.md, reports, and strategy documents.
"""

import os
import json
import re

BASE_DIR = r"d:\programming\Blockchain development\Z-WBE Bottleneck Lab\social-campaign"
LINKEDIN_DIR = os.path.join(BASE_DIR, "linkedin")
X_DIR = os.path.join(BASE_DIR, "x")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")

os.makedirs(LINKEDIN_DIR, exist_ok=True)
os.makedirs(X_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

# Define Canonical URLs
URL_APP = "https://z-wbe-bottleneck-lab.vercel.app"
URL_GITHUB = "https://github.com/zrt219/Z-WBE-Bottleneck-Lab"
URL_COLAB = "https://colab.research.google.com/github/zrt219/Z-WBE-Bottleneck-Lab/blob/main/notebooks/Z_WBE_GPU_LAB.ipynb"
URL_PROFILE = "https://g.dev/zhane"

# Media definitions
MEDIA_AD_01 = "public/marketing/ad_01.png"
MEDIA_AD_02 = "public/marketing/ad_02.png"
MEDIA_AD_03 = "public/marketing/ad_03.png"
MEDIA_AD_04 = "public/marketing/ad_04.png"
MEDIA_AD_05 = "public/marketing/ad_05.png"
MEDIA_AD_06 = "public/marketing/ad_06.png"
MEDIA_AD_07 = "public/marketing/ad_07.png"
MEDIA_AD_08 = "public/marketing/ad_08.png"
MEDIA_AD_09 = "public/marketing/ad_09.png"
MEDIA_AD_10 = "public/marketing/ad_10.png"

MEDIA_BANNER_DARK = "public/images/banner-dark.png"
MEDIA_BANNER_LIGHT = "public/images/banner-light.png"
MEDIA_BADGES_ALL = "public/images/google-nvidia-developer-badges.png"
MEDIA_CARD_NIM = "public/images/social_card_nim_gke.png"
MEDIA_CARD_INFER = "public/images/social_card_intro_inference.png"
MEDIA_CARD_ANALYTICS = "public/images/social_card_data_analytics.png"
MEDIA_CARD_ACCEL = "public/images/social_card_accelerated_ml.png"

MEDIA_UI_HERO = "public/screenshots/01_hero_overview.png"
MEDIA_UI_IMAGING = "public/screenshots/02_imaging_wall_baseline.png"
MEDIA_UI_TRANSITION = "public/screenshots/03_bottleneck_moved_transition.png"
MEDIA_UI_NEMOTRON = "public/screenshots/04_nemotron_grounded_interpretation.png"
MEDIA_UI_HEATMAP = "public/screenshots/05_gpu_exploration_map.png"
MEDIA_UI_ARCH = "public/screenshots/06_architecture_evidence_view.png"

MEDIA_COLAB_OVERVIEW = "public/colab-evidence/01_colab_notebook_overview.png"
MEDIA_COLAB_T4_DIALOG = "public/colab-evidence/02_colab_t4_gpu_runtime_dialog.png"
MEDIA_COLAB_CUML = "public/colab-evidence/03_colab_cuml_linear_regression.png"
MEDIA_COLAB_PROGRESS = "public/colab-evidence/04_colab_cuml_execution_progress.png"
MEDIA_COLAB_NVIDIA_SMI = "public/colab-evidence/05_colab_nvidia_smi_ensemble_eval.png"
MEDIA_COLAB_EXT = "public/colab-evidence/06_colab_gpu_extensions_and_terminal.png"
MEDIA_GITHUB_PROVENANCE = "public/colab-evidence/07_github_notebook_code_provenance.png"

MEDIA_CHART_SPEEDUP = "public/data/cpu_vs_gpu_speedup.png"
MEDIA_CHART_HIST = "public/data/eda_histograms.png"
MEDIA_CHART_SCATTER = "public/data/eda_scatter_matrix.png"

MEDIA_GIF_HERO = "public/recordings/hero_bottleneck_shift.gif"
MEDIA_GIF_COLAB = "public/recordings/colab_t4_live_execution.gif"
MEDIA_GIF_TOUR = "public/recordings/guided_tour_walkthrough.gif"
MEDIA_GIF_ELI5 = "public/recordings/nemotron_eli5_toggle.gif"

MEDIA_MP4_HERO = "public/recordings/hero_bottleneck_shift.mp4"
MEDIA_MP4_TOUR = "public/recordings/guided_tour_walkthrough.mp4"
MEDIA_MP4_ELI5 = "public/recordings/nemotron_eli5_toggle.mp4"

print("Constants initialized.")

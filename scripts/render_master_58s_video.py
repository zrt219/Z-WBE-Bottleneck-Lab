"""
scripts/render_master_58s_video.py
Renders the broadcast-quality 58.5-second 1080p 60fps Master Walkthrough Video
implementing the exact 7-scene timeline, precise overlay text, and slow deliberate kinetic zooms:

0–6s — Breakthrough
  Zoom directly onto the 100× action. Show Acquisition -> trigger -> THE BOTTLENECK MOVED -> Memory Bandwidth.
  Overlay: 100× FASTER IMAGING → NEW BOTTLENECK
  Kinetic Zoom 1: 100x button
  Cursor: Small click ripple on 100x button trigger
  Kinetic Zoom 2: Memory Wall result (<1ms HBM Bandwidth constraint)

6–17s — Deterministic engine
  Show the scenario controls and calculated values.
  Overlay: 12 DETERMINISTIC SCALING EQUATIONS

17–27s — Nemotron
  Show the AI interpretation flow and the label boundary.
  Overlay: NVIDIA NEMOTRON 3 SUPER 120B

27–38s — Research proof
  Methodology -> architecture -> Colab/T4.
  Overlay: 8.62× MEASURED T4 BENCHMARK
  Kinetic Zoom 3: T4 benchmark speedup

38–47s — BigQuery
  Show the 100,000-scenario analytics.
  Overlay: 100,000 SCENARIOS · GOOGLE BIGQUERY

47–55s — Open system
  GitHub / architecture / reproducibility.
  Overlay: OPEN SOURCE · REPRODUCIBLE

55–58.5s — Credentials
  Finish with the four Golden Ticket learning cards.
  Overlay:
  4 LEARNING PATHS → 1 WORKING PROJECT
  #NVIDIAGTC
  Kinetic Zoom 4: Four Golden Ticket cards

Sound design (synthesized in master_audio_58.5s.wav):
  Restrained: soft click at 2.4s, short transition swell at 2.5s-3.2s,
  one stronger hit when THE BOTTLENECK MOVED appears at 3.2s,
  restrained ambient synth pad, confirmation chime at 34.5s, golden chord at 55.2s.

Outputs:
  - 1080p 60fps MP4 (1920x1080, 58.5s)
  - Highly-optimized social animated GIF (< 15MB)
  - Exported and mirrored to all required project directories.
"""

import os
import sys
import math
import shutil
import subprocess
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

FPS = 60
DURATION_SEC = 58.5
TOTAL_FRAMES = int(FPS * DURATION_SEC)  # 3510 frames
WIDTH = 1920
HEIGHT = 1080

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW_DIR = os.path.join(os.path.dirname(__file__), "master_scenes_raw")
AUDIO_FILE = os.path.join(os.path.dirname(__file__), "master_audio_58.5s.wav")

# Distribution Target Directories
MASTER_POST_DIR = os.path.join(BASE_DIR, "master-launch-post")
PUBLIC_RECORDINGS = os.path.join(BASE_DIR, "public", "recordings")
PUBLIC_IMAGES = os.path.join(BASE_DIR, "public", "images")
SUBMISSION_RECORDINGS = os.path.join(BASE_DIR, "submission-kit", "recordings")
FRONTEND_RECORDINGS = os.path.join(BASE_DIR, "frontend", "public", "recordings")
FRONTEND_IMAGES = os.path.join(BASE_DIR, "frontend", "public", "images")
DIST_RECORDINGS = os.path.join(BASE_DIR, "dist", "recordings")
FRONTEND_DIST_RECORDINGS = os.path.join(BASE_DIR, "frontend", "dist", "recordings")

for d in [MASTER_POST_DIR, PUBLIC_RECORDINGS, PUBLIC_IMAGES, SUBMISSION_RECORDINGS, FRONTEND_RECORDINGS, FRONTEND_IMAGES, DIST_RECORDINGS, FRONTEND_DIST_RECORDINGS]:
    os.makedirs(d, exist_ok=True)


def smootherstep(t):
    """C2 continuous quintic smootherstep easing."""
    t = np.clip(t, 0.0, 1.0)
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)


def fit_image_to_1080p(img_path, bg_color=(11, 17, 32)):
    """Fit any image into a 1920x1080 canvas preserving aspect ratio."""
    img = cv2.imread(img_path)
    if img is None:
        return np.full((HEIGHT, WIDTH, 3), bg_color, dtype=np.uint8)
    h, w = img.shape[:2]
    canvas = np.full((HEIGHT, WIDTH, 3), bg_color, dtype=np.uint8)
    scale = min(WIDTH / float(w), HEIGHT / float(h))
    nw, nh = int(round(w * scale)), int(round(h * scale))
    resized = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_LANCZOS4)
    ox = (WIDTH - nw) // 2
    oy = (HEIGHT - nh) // 2
    canvas[oy:oy + nh, ox:ox + nw] = resized
    return canvas


def load_scene_image(filename, fallback_color=(15, 23, 42)):
    fpath = os.path.join(RAW_DIR, filename)
    if os.path.exists(fpath):
        img = cv2.imread(fpath)
        if img is not None:
            if img.shape[0] != HEIGHT or img.shape[1] != WIDTH:
                return cv2.resize(img, (WIDTH, HEIGHT), interpolation=cv2.INTER_LANCZOS4)
            return img
    print(f"Warning: {filename} not found, generating fallback canvas.")
    return np.full((HEIGHT, WIDTH, 3), fallback_color, dtype=np.uint8)


def create_callout_badge(tag_text, title_text, title_line2, subtitle_text, accent_color, border_color):
    """
    Renders an ultra-clean, broadcast lower-third card on a 1920x1080 RGBA canvas.
    """
    canvas = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    
    bh = 142 if title_line2 else 126
    bx, by, bw = 56, HEIGHT - 56 - bh, 830
    r = 16
    
    # Shadow
    for i in range(8, 0, -2):
        s_alpha = int(45 * (1.0 - i / 10.0))
        draw.rounded_rectangle([bx - i, by - i + 6, bx + bw + i, by + bh + i + 8], radius=r + i // 2, fill=(0, 0, 0, s_alpha))
    
    # Card Background (Slate 950 Glassmorphism)
    card_bg = (11, 17, 32, 238)
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=r, fill=card_bg)
    # Left accent line
    draw.rounded_rectangle([bx, by, bx + 6, by + bh], radius=3, fill=accent_color)
    # Card Border
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=r, outline=border_color, width=2)
    
    try:
        font_tag = ImageFont.truetype("arialbd.ttf", 13)
        font_title = ImageFont.truetype("arialbd.ttf", 22)
        font_title2 = ImageFont.truetype("arialbd.ttf", 20)
        font_sub = ImageFont.truetype("arial.ttf", 13)
    except Exception:
        font_tag = font_title = font_title2 = font_sub = ImageFont.load_default()
        
    # Tag Row
    dot_x, dot_y = bx + 26, by + 19
    draw.ellipse([dot_x - 4, dot_y - 4, dot_x + 4, dot_y + 4], fill=accent_color)
    draw.ellipse([dot_x - 7, dot_y - 7, dot_x + 7, dot_y + 7], outline=accent_color + (110,), width=1)
    draw.text((bx + 38, by + 11), tag_text.upper(), font=font_tag, fill=accent_color)
    
    # Title
    draw.text((bx + 26, by + 37), title_text, font=font_title, fill=(255, 255, 255, 255))
    if title_line2:
        draw.text((bx + 26, by + 69), title_line2, font=font_title2, fill=accent_color)
        draw.text((bx + 26, by + 104), subtitle_text, font=font_sub, fill=(186, 201, 224, 255))
    else:
        draw.text((bx + 26, by + 77), subtitle_text, font=font_sub, fill=(186, 201, 224, 255))
        
    return np.array(canvas)


def get_cursor_rgba():
    """Renders a sleek, high-precision cursor arrow with cyan accent."""
    c = Image.new('RGBA', (40, 40), (0, 0, 0, 0))
    d = ImageDraw.Draw(c)
    pts_shadow = [(6, 5), (14, 25), (17, 17), (25, 14)]
    d.polygon(pts_shadow, fill=(0, 0, 0, 90))
    pts_border = [(5, 4), (13, 24), (16, 16), (24, 13)]
    d.polygon(pts_border, fill=(11, 17, 32, 255))
    pts_fill = [(6, 6), (12, 22), (15, 15), (22, 13)]
    d.polygon(pts_fill, fill=(255, 255, 255, 255))
    d.ellipse([6, 6, 9, 9], fill=(56, 189, 248, 255))
    return np.array(c)


def render_cursor_and_ripple(frame_bgr, cur_rgba, cur_x, cur_y, cur_alpha, ripple_prog):
    """Draws cursor and small click ripple onto the frame."""
    h, w = frame_bgr.shape[:2]
    
    # Draw small click ripple if active (ripple_prog in [0.0, 1.0])
    if 0.0 <= ripple_prog <= 1.0:
        radius = int(4 + 22 * smootherstep(ripple_prog))
        alpha = (1.0 - smootherstep(ripple_prog)) * 0.85
        if alpha > 0.01:
            overlay = frame_bgr.copy()
            cv2.circle(overlay, (int(cur_x), int(cur_y)), radius, (248, 189, 56), 2, lineType=cv2.LINE_AA)
            cv2.circle(overlay, (int(cur_x), int(cur_y)), max(1, radius - 2), (248, 220, 100), 1, lineType=cv2.LINE_AA)
            cv2.addWeighted(overlay, alpha, frame_bgr, 1.0 - alpha, 0, frame_bgr)
            
    # Draw cursor
    if cur_alpha > 0.01:
        cx, cy = int(cur_x), int(cur_y)
        ch, cw = cur_rgba.shape[:2]
        x1, y1 = cx, cy
        x2, y2 = cx + cw, cy + ch
        if 0 <= x1 < w and 0 <= y1 < h:
            x2 = min(w, x2)
            y2 = min(h, y2)
            cw_clip = x2 - x1
            ch_clip = y2 - y1
            
            c_patch = cur_rgba[:ch_clip, :cw_clip]
            c_alpha = (c_patch[:, :, 3] / 255.0) * cur_alpha
            c_bgr = c_patch[:, :, :3][:, :, ::-1]  # RGB to BGR
            
            for c_idx in range(3):
                frame_bgr[y1:y2, x1:x2, c_idx] = (
                    frame_bgr[y1:y2, x1:x2, c_idx] * (1.0 - c_alpha) +
                    c_bgr[:, :, c_idx] * c_alpha
                ).astype(np.uint8)


def apply_kinetic_zoom(img_bgr, zoom, cx, cy):
    """Sub-pixel kinetic camera zoom & pan with bounds clamping."""
    h, w = img_bgr.shape[:2]
    if zoom <= 1.002:
        return img_bgr
    
    w_crop = w / float(zoom)
    h_crop = h / float(zoom)
    
    x1 = cx - w_crop / 2.0
    y1 = cy - h_crop / 2.0
    
    if x1 < 0:
        x1 = 0
    elif x1 + w_crop > w:
        x1 = w - w_crop
        
    if y1 < 0:
        y1 = 0
    elif y1 + h_crop > h:
        y1 = h - h_crop
        
    x2 = x1 + w_crop
    y2 = y1 + h_crop
    
    src_pts = np.float32([[x1, y1], [x2, y1], [x1, y2]])
    dst_pts = np.float32([[0, 0], [w, 0], [0, h]])
    matrix = cv2.getAffineTransform(src_pts, dst_pts)
    return cv2.warpAffine(img_bgr, matrix, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)


def create_vignette(h=1080, w=1920):
    kernel_x = cv2.getGaussianKernel(w, w * 0.78)
    kernel_y = cv2.getGaussianKernel(h, h * 0.78)
    kernel = kernel_y * kernel_x.T
    mask = kernel / kernel.max()
    vignette = 0.90 + 0.10 * mask
    return np.repeat(vignette[:, :, np.newaxis], 3, axis=2)


def main():
    print(f"=== RENDERING BROADCAST-GRADE 58.5s 1080P 60FPS MASTER VIDEO ===")
    print(f"FPS: {FPS}, Duration: {DURATION_SEC}s, Total Frames: {TOTAL_FRAMES}")

    if not os.path.exists(AUDIO_FILE):
        print("Synthesizing master audio first...")
        from compose_master_audio import main as comp_audio
        comp_audio()

    # 1. Load Pre-captured Assets
    print("\n[1/6] Loading scene assets...")
    s1_base = load_scene_image("scene1_baseline.png")
    s1_shift = load_scene_image("scene1_shifted.png")
    s2_controls = load_scene_image("scene2_controls.png")
    s2_metrics = load_scene_image("scene2_metrics.png")
    s3_nemotron = load_scene_image("scene3_nemotron.png")
    s4_method = load_scene_image("scene4_methodology_equations.png")
    s4_arch = load_scene_image("scene4_architecture_top.png")
    
    # Research Proof: T4 Benchmark Speedup Chart
    t4_chart_path = os.path.join(MASTER_POST_DIR, "03_tesla_t4_gpu_speedup.png")
    s4_t4_bench = fit_image_to_1080p(t4_chart_path)
    
    # BigQuery Analytics
    s5_bq_top = load_scene_image("scene5_bigquery_top.png")
    s5_bq_chart = load_scene_image("scene5_bigquery_chart.png")
    
    # Open System (Architecture + GitHub Code Provenance)
    s6_open_arch = load_scene_image("scene6_open_architecture.png")
    github_prov_path = os.path.join(BASE_DIR, "public", "colab-evidence", "07_github_notebook_code_provenance.png")
    s6_github_prov = fit_image_to_1080p(github_prov_path)
    
    # Credentials (Four Golden Ticket Learning Cards Collage)
    cards_collage_path = os.path.join(MASTER_POST_DIR, "01_google_nvidia_golden_ticket_collage.png")
    s7_cards = fit_image_to_1080p(cards_collage_path)

    # 2. Pre-render Exact Callout Badges
    print("[2/6] Pre-rendering 7 broadcast lower-third callout badges...")
    # Scene 1: 0 - 6s
    badge1 = create_callout_badge(
        "BREAKTHROUGH DEMO",
        "100× FASTER IMAGING → NEW BOTTLENECK",
        None,
        "Acquisition Wall Collapses 3,125% → 31% · Instant Bottleneck Shift",
        (56, 189, 248),
        (56, 189, 248, 140)
    )
    # Scene 2: 6 - 17s
    badge2 = create_callout_badge(
        "DETERMINISTIC ENGINE",
        "12 DETERMINISTIC SCALING EQUATIONS",
        None,
        "Closed-Form Biophysical Scaling Laws · Zero Hallucination Math",
        (129, 140, 248),
        (129, 140, 248, 140)
    )
    # Scene 3: 17 - 27s
    badge3 = create_callout_badge(
        "AI CAUSAL INTERPRETATION",
        "NVIDIA NEMOTRON 3 SUPER 120B",
        None,
        "Strict Epistemic Separation · Model Interprets Verified Numeric Vectors",
        (16, 185, 129),
        (16, 185, 129, 150)
    )
    # Scene 4: 27 - 38s
    badge4 = create_callout_badge(
        "RESEARCH PROOF",
        "8.62× MEASURED T4 BENCHMARK",
        None,
        "Google Colab GPU Workflow · Tesla T4 Acceleration via cudf.pandas",
        (118, 185, 0),
        (118, 185, 0, 150)
    )
    # Scene 5: 38 - 47s
    badge5 = create_callout_badge(
        "BIGQUERY ANALYTICS",
        "100,000 SCENARIOS · GOOGLE BIGQUERY",
        None,
        "Deterministic Parameter Sweep Analyzed in BigQuery Sandbox with GoogleSQL",
        (59, 130, 246),
        (59, 130, 246, 140)
    )
    # Scene 6: 47 - 55s
    badge6 = create_callout_badge(
        "OPEN SYSTEM",
        "OPEN SOURCE · REPRODUCIBLE",
        None,
        "Apache 2.0 Codebase · Full Architecture · One-Click Colab Workflow",
        (168, 85, 247),
        (168, 85, 247, 140)
    )
    # Scene 7: 55 - 58.5s
    badge7 = create_callout_badge(
        "VERIFIED CREDENTIALS",
        "4 LEARNING PATHS → 1 WORKING PROJECT",
        "#NVIDIAGTC",
        "Official Google Cloud × NVIDIA Badges · ID: 110918189625880989910",
        (245, 158, 11),
        (245, 158, 11, 160)
    )

    BADGES_TIMELINE = [
        (0, 360, badge1),        # 0s - 6s
        (360, 1020, badge2),     # 6s - 17s
        (1020, 1620, badge3),    # 17s - 27s
        (1620, 2280, badge4),    # 27s - 38s
        (2280, 2820, badge5),    # 38s - 47s
        (2820, 3300, badge6),    # 47s - 55s
        (3300, 3510, badge7),    # 55s - 58.5s
    ]

    cursor_rgba = get_cursor_rgba()
    vignette_mask = create_vignette(HEIGHT, WIDTH)

    # 3. Setup FFmpeg Video Stream Encoder Pipe (Step 1 of 2: lossless MKV container)
    temp_video_only = os.path.join(RAW_DIR, "temp_video_only.mkv")
    final_master_mp4 = os.path.join(RAW_DIR, "master_rendered_58.5s.mp4")

    ffmpeg_video_cmd = [
        "ffmpeg", "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "bgr24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        temp_video_only
    ]

    print(f"\n[3/6] Starting FFmpeg 60fps video encoder: {temp_video_only}...")
    pipe = subprocess.Popen(
        ffmpeg_video_cmd,
        stdin=subprocess.PIPE,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )

    # 4. Render All 3510 Frames
    print("[4/6] Rendering 3510 silky-smooth 60fps frames...")
    
    # 100x Button location in Scene 1
    BTN_X, BTN_Y = 1308, 909
    MEM_X, MEM_Y = 960.0, 560.0

    for f_idx in range(TOTAL_FRAMES):
        t_sec = f_idx / float(FPS)
        
        # --- Base Frame Selection & Crossfade ---
        if t_sec < 6.0:
            # Scene 1: Breakthrough (0 - 6s)
            # Switch to shifted state at t = 3.20s (Frame 192) when audio hit plays
            if f_idx < 192:
                base_frame = s1_base.copy()
            else:
                base_frame = s1_shift.copy()
                
        elif t_sec < 17.0:
            # Scene 2: Deterministic Engine (6 - 17s)
            # 6s - 11.2s: controls; 11.2s - 12.0s: crossfade; 12.0s - 17s: calculated metrics
            if t_sec < 11.2:
                base_frame = s2_controls.copy()
            elif t_sec < 12.0:
                alpha = smootherstep((t_sec - 11.2) / 0.8)
                base_frame = cv2.addWeighted(s2_controls, 1.0 - alpha, s2_metrics, alpha, 0)
            else:
                base_frame = s2_metrics.copy()
                
        elif t_sec < 27.0:
            # Scene 3: Nemotron (17 - 27s)
            base_frame = s3_nemotron.copy()
            
        elif t_sec < 38.0:
            # Scene 4: Research Proof (27 - 38s)
            # 27s - 30.2s: methodology; 30.2s - 33.5s: architecture; 33.5s - 38s: T4 benchmark
            if t_sec < 30.2:
                base_frame = s4_method.copy()
            elif t_sec < 33.5:
                if t_sec < 30.8:
                    alpha = smootherstep((t_sec - 30.2) / 0.6)
                    base_frame = cv2.addWeighted(s4_method, 1.0 - alpha, s4_arch, alpha, 0)
                else:
                    base_frame = s4_arch.copy()
            else:
                if t_sec < 34.0:
                    alpha = smootherstep((t_sec - 33.5) / 0.5)
                    base_frame = cv2.addWeighted(s4_arch, 1.0 - alpha, s4_t4_bench, alpha, 0)
                else:
                    base_frame = s4_t4_bench.copy()
                    
        elif t_sec < 47.0:
            # Scene 5: BigQuery (38 - 47s)
            # 100k-scenario parameter exploration map & GoogleSQL distribution analytics
            base_frame = s5_bq_top.copy()
                
        elif t_sec < 55.0:
            # Scene 6: Open System (47 - 55s)
            # 47s - 51s: architecture; 51s - 55s: GitHub code provenance
            if t_sec < 51.0:
                base_frame = s6_open_arch.copy()
            elif t_sec < 51.8:
                alpha = smootherstep((t_sec - 51.0) / 0.8)
                base_frame = cv2.addWeighted(s6_open_arch, 1.0 - alpha, s6_github_prov, alpha, 0)
            else:
                base_frame = s6_github_prov.copy()
                
        else:
            # Scene 7: Credentials (55 - 58.5s)
            base_frame = s7_cards.copy()

        # --- Exact 4 Kinetic Zooms ---
        # Rule: Only 4 slow, deliberate kinetic zooms. Everywhere else: 1.00x zoom.
        zoom = 1.00
        cx, cy = 960.0, 540.0
        
        # Kinetic Zoom 1: 100x button (Scene 1)
        if 1.0 <= t_sec < 3.2:
            if t_sec < 2.2:
                e = smootherstep((t_sec - 1.0) / 1.2)
                zoom = 1.00 + 0.28 * e
                cx = 960.0 + (BTN_X - 960.0) * e
                cy = 540.0 + (BTN_Y - 540.0) * e
            else:
                zoom = 1.28
                cx, cy = float(BTN_X), float(BTN_Y)
                
        # Kinetic Zoom 2: Memory Wall result (Scene 1)
        elif 3.2 <= t_sec < 6.0:
            if t_sec < 4.2:
                e = smootherstep((t_sec - 3.2) / 1.0)
                zoom = 1.28 - 0.03 * e  # 1.28 -> 1.25
                cx = float(BTN_X) + (MEM_X - float(BTN_X)) * e
                cy = float(BTN_Y) + (MEM_Y - float(BTN_Y)) * e
            elif t_sec < 5.4:
                zoom = 1.25
                cx, cy = float(MEM_X), float(MEM_Y)
            else:
                e = smootherstep((t_sec - 5.4) / 0.6)
                zoom = 1.25 - 0.25 * e
                cx = float(MEM_X) + (960.0 - float(MEM_X)) * e
                cy = float(MEM_Y) + (540.0 - float(MEM_Y)) * e
                
        # Kinetic Zoom 3: T4 Benchmark (Scene 4, 33.5s - 38s)
        elif 33.5 <= t_sec < 38.0:
            if t_sec < 35.0:
                e = smootherstep((t_sec - 33.5) / 1.5)
                zoom = 1.00 + 0.25 * e
                cx = 960.0
                cy = 540.0 - 30.0 * e
            elif t_sec < 37.3:
                zoom = 1.25
                cx, cy = 960.0, 510.0
            else:
                e = smootherstep((t_sec - 37.3) / 0.7)
                zoom = 1.25 - 0.25 * e
                cx = 960.0
                cy = 510.0 + 30.0 * e
                
        # Kinetic Zoom 4: Four Cards (Scene 7, 55.0s - 58.5s)
        elif 55.0 <= t_sec:
            if t_sec < 56.6:
                e = smootherstep((t_sec - 55.0) / 1.6)
                zoom = 1.00 + 0.22 * e
                cx, cy = 960.0, 540.0
            else:
                zoom = 1.22
                cx, cy = 960.0, 540.0
                
        # Apply Zoom & Pan
        frame = apply_kinetic_zoom(base_frame, zoom, cx, cy)

        # --- Cursor & Small Click Ripple (Scene 1) ---
        if t_sec < 3.2:
            if t_sec < 1.0:
                cur_x, cur_y = 1080.0, 720.0
                cur_alpha = smootherstep(t_sec / 0.6)
                ripple_prog = -1.0
            elif t_sec < 2.4:
                e = smootherstep((t_sec - 1.0) / 1.4)
                cur_x = 1080.0 + (BTN_X - 1080.0) * e
                cur_y = 720.0 + (BTN_Y - 720.0) * e
                cur_alpha = 1.0
                ripple_prog = -1.0
            else:
                cur_x, cur_y = float(BTN_X), float(BTN_Y)
                ripple_prog = (t_sec - 2.4) / 0.45
                cur_alpha = max(0.0, 1.0 - (t_sec - 2.6) / 0.5)
                
            if zoom > 1.002:
                w_crop = WIDTH / float(zoom)
                h_crop = HEIGHT / float(zoom)
                cam_x1 = cx - w_crop / 2.0
                cam_y1 = cy - h_crop / 2.0
                cam_x1 = max(0, min(WIDTH - w_crop, cam_x1))
                cam_y1 = max(0, min(HEIGHT - h_crop, cam_y1))
                scr_cur_x = (cur_x - cam_x1) * zoom
                scr_cur_y = (cur_y - cam_y1) * zoom
            else:
                scr_cur_x, scr_cur_y = cur_x, cur_y

            render_cursor_and_ripple(frame, cursor_rgba, scr_cur_x, scr_cur_y, cur_alpha, ripple_prog)

        # --- Composite Callout Overlays ---
        for b_start, b_end, b_rgba in BADGES_TIMELINE:
            if b_start <= f_idx < b_end:
                trans_len = 18
                if f_idx < b_start + trans_len:
                    b_factor = smootherstep((f_idx - b_start) / float(trans_len))
                    y_shift = int(24 * (1.0 - b_factor))
                elif f_idx > b_end - trans_len:
                    b_factor = smootherstep((b_end - f_idx) / float(trans_len))
                    y_shift = int(24 * (1.0 - b_factor))
                else:
                    b_factor = 1.0
                    y_shift = 0
                    
                b_alpha = (b_rgba[:, :, 3] / 255.0) * b_factor
                b_rgb = b_rgba[:, :, :3]
                
                if y_shift > 0:
                    sh_alpha = np.zeros_like(b_alpha)
                    sh_rgb = np.zeros_like(b_rgb)
                    sh_alpha[y_shift:, :] = b_alpha[:-y_shift, :]
                    sh_rgb[y_shift:, :] = b_rgb[:-y_shift, :]
                    b_alpha, b_rgb = sh_alpha, sh_rgb
                    
                b_bgr = b_rgb[:, :, ::-1]  # RGB to BGR
                mask_3d = np.repeat(b_alpha[:, :, np.newaxis], 3, axis=2)
                frame = (frame * (1.0 - mask_3d) + b_bgr * mask_3d).astype(np.uint8)
                break

        # --- Subtle Vignette ---
        frame = (frame * vignette_mask).astype(np.uint8)

        # --- Seamless 58.5s Loop Cut: Fade to black on final 30 frames (58.0s - 58.5s) ---
        fade_frames = 30
        if f_idx >= TOTAL_FRAMES - fade_frames:
            fade_prog = (TOTAL_FRAMES - 1 - f_idx) / float(fade_frames)
            fade_factor = smootherstep(fade_prog)
            frame = (frame * fade_factor).astype(np.uint8)

        # Write frame to FFmpeg pipe
        pipe.stdin.write(frame.tobytes())

        if f_idx % 300 == 0 or f_idx == TOTAL_FRAMES - 1:
            pct = ((f_idx + 1) / float(TOTAL_FRAMES)) * 100.0
            print(f"   [{pct:5.1f}%] Rendered frame {f_idx + 1}/{TOTAL_FRAMES} (t={t_sec:.2f}s, zoom={zoom:.2f}x)")

    pipe.stdin.close()
    pipe.wait()
    print(f"Video stream encoding complete! Return code: {pipe.returncode}")
    print(f"Intermediate video size: {os.path.getsize(temp_video_only) / (1024*1024):.2f} MB")

    # Step 2 of 2: Mux Audio with Video
    print(f"\n[5/6] Muxing master audio ({AUDIO_FILE}) into final MP4: {final_master_mp4}...")
    mux_cmd = [
        "ffmpeg", "-y",
        "-i", temp_video_only,
        "-i", AUDIO_FILE,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "256k",
        "-shortest",
        "-movflags", "+faststart",
        final_master_mp4
    ]
    mux_res = subprocess.run(mux_cmd, capture_output=True)
    if mux_res.returncode != 0:
        print("Mux error:", mux_res.stderr.decode('utf-8', errors='ignore'))
        raise RuntimeError(f"Audio muxing failed with return code {mux_res.returncode}")
    if os.path.exists(temp_video_only):
        os.remove(temp_video_only)

    # Validate final MP4 with ffprobe
    probe_res = subprocess.run(["ffprobe", "-hide_banner", final_master_mp4], capture_output=True)
    if probe_res.returncode != 0:
        print("Probe error:", probe_res.stderr.decode('utf-8', errors='ignore'))
        raise RuntimeError(f"Final MP4 verification failed with return code {probe_res.returncode}")
    print("Probe output:\n", probe_res.stderr.decode('utf-8', errors='ignore'))

    # 5. Generate High-Quality Animated GIF
    temp_gif = os.path.join(RAW_DIR, "master_rendered.gif")
    print(f"\n[6/6] Encoding social-optimized animated GIF (< 15MB)...")
    gif_cmd = [
        "ffmpeg", "-y",
        "-i", final_master_mp4,
        "-vf", "fps=8,scale=600:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=64:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3",
        temp_gif
    ]
    subprocess.run(gif_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Verify generated sizes
    mp4_size_mb = os.path.getsize(final_master_mp4) / (1024 * 1024)
    gif_size_mb = os.path.getsize(temp_gif) / (1024 * 1024)
    print(f"Rendered Master MP4: {mp4_size_mb:.2f} MB")
    print(f"Rendered Master GIF: {gif_size_mb:.2f} MB")

    # 6. Distribute Assets to Target Folders
    print("\nDistributing master video and animation across project directories...")
    
    distribution_targets = [
        # Root Workspace
        (BASE_DIR, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (BASE_DIR, "60s_full_workflow_walkthrough.gif", temp_gif),

        # Master Launch Post
        (MASTER_POST_DIR, "02_hero_bottleneck_shift.mp4", final_master_mp4),
        (MASTER_POST_DIR, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (MASTER_POST_DIR, "02_hero_bottleneck_shift.gif", temp_gif),
        (MASTER_POST_DIR, "60s_full_workflow_walkthrough.gif", temp_gif),

        # Public Images
        (PUBLIC_IMAGES, "02_hero_bottleneck_shift.mp4", final_master_mp4),
        (PUBLIC_IMAGES, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (PUBLIC_IMAGES, "02_hero_bottleneck_shift.gif", temp_gif),
        (PUBLIC_IMAGES, "hero_bottleneck_shift.gif", temp_gif),

        # Public Recordings
        (PUBLIC_RECORDINGS, "02_hero_bottleneck_shift.mp4", final_master_mp4),
        (PUBLIC_RECORDINGS, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (PUBLIC_RECORDINGS, "60s_full_workflow_walkthrough.gif", temp_gif),
        (PUBLIC_RECORDINGS, "hero_bottleneck_shift.mp4", final_master_mp4),
        (PUBLIC_RECORDINGS, "hero_bottleneck_shift.gif", temp_gif),

        # Submission Kit Recordings
        (SUBMISSION_RECORDINGS, "02_hero_bottleneck_shift.mp4", final_master_mp4),
        (SUBMISSION_RECORDINGS, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (SUBMISSION_RECORDINGS, "60s_full_workflow_walkthrough.gif", temp_gif),
        (SUBMISSION_RECORDINGS, "hero_bottleneck_shift.mp4", final_master_mp4),
        (SUBMISSION_RECORDINGS, "hero_bottleneck_shift.gif", temp_gif),

        # Frontend Recordings
        (FRONTEND_RECORDINGS, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (FRONTEND_RECORDINGS, "60s_full_workflow_walkthrough.gif", temp_gif),
        (FRONTEND_RECORDINGS, "02_hero_bottleneck_shift.mp4", final_master_mp4),
        (FRONTEND_RECORDINGS, "hero_bottleneck_shift.mp4", final_master_mp4),
        (FRONTEND_RECORDINGS, "hero_bottleneck_shift.gif", temp_gif),

        # Frontend Images
        (FRONTEND_IMAGES, "02_hero_bottleneck_shift.mp4", final_master_mp4),
        (FRONTEND_IMAGES, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (FRONTEND_IMAGES, "02_hero_bottleneck_shift.gif", temp_gif),

        # Build Distribution Folders
        (DIST_RECORDINGS, "02_hero_bottleneck_shift.mp4", final_master_mp4),
        (DIST_RECORDINGS, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (DIST_RECORDINGS, "60s_full_workflow_walkthrough.gif", temp_gif),
        (DIST_RECORDINGS, "hero_bottleneck_shift.mp4", final_master_mp4),
        (DIST_RECORDINGS, "hero_bottleneck_shift.gif", temp_gif),

        (FRONTEND_DIST_RECORDINGS, "02_hero_bottleneck_shift.mp4", final_master_mp4),
        (FRONTEND_DIST_RECORDINGS, "60s_full_workflow_walkthrough.mp4", final_master_mp4),
        (FRONTEND_DIST_RECORDINGS, "60s_full_workflow_walkthrough.gif", temp_gif),
        (FRONTEND_DIST_RECORDINGS, "hero_bottleneck_shift.mp4", final_master_mp4),
        (FRONTEND_DIST_RECORDINGS, "hero_bottleneck_shift.gif", temp_gif),
    ]

    for target_dir, target_name, src_file in distribution_targets:
        if os.path.exists(target_dir):
            dest_path = os.path.join(target_dir, target_name)
            shutil.copyfile(src_file, dest_path)
            print(f"   Copied -> {dest_path}")

    print("\nSUCCESS! All assets rendered, verified, and distributed across all project locations.")


if __name__ == "__main__":
    main()

"""
scripts/postprocess_master_video.py
Post-processes captured video frames to implement:
1. Dynamic Kinetic Zoom & Pan (smooth gimbal camera movement with smootherstep easing)
2. Sleek Lower-Third Badges & Callout Overlays:
   - THE BREAKTHROUGH: 100x Imaging Speedup
   - BOTTLENECK SHIFT: Memory Wall Dominance (<1ms)
   - 12 DETERMINISTIC EQUATIONS: Epistemic Grounding
   - EMPIRICAL PROOF: 8.62x GPU Acceleration (T4 + cuDF)
   - VERIFIED CREDENTIALS: 4/4 Google Cloud x NVIDIA Pathways
3. Cinematic vignette, subtle contrast grading, and seamless 59.0s loop fade-out.
"""

import os
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont


def smootherstep(t):
    """C2 continuous quintic smootherstep easing."""
    t = np.clip(t, 0.0, 1.0)
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0)


def create_callout_badge(tag_text, title_text, subtitle_text, accent_color, border_color):
    """
    Renders a broadcast lower-third card on a transparent 1920x1080 RGBA canvas.
    Dimensions: 740x118px positioned at (left=56, bottom=56 -> y=906)
    """
    canvas = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    
    bx, by, bw, bh = 56, 896, 760, 126
    r = 16
    
    # Backdrop shadow
    for i in range(8, 0, -2):
        s_alpha = int(45 * (1.0 - i / 10.0))
        draw.rounded_rectangle(
            [bx - i, by - i + 6, bx + bw + i, by + bh + i + 8],
            radius=r + i // 2,
            fill=(0, 0, 0, s_alpha)
        )
    
    # Glassmorphism dark card container
    card_bg = (10, 16, 30, 235)  # 92% opaque deep slate
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=r, fill=card_bg)
    
    # Subtle accent gradient line on left edge
    draw.rounded_rectangle([bx, by, bx + 6, by + bh], radius=3, fill=accent_color)
    
    # Card glowing border
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=r, outline=border_color, width=2)
    
    # Load fonts (system fallback)
    try:
        font_tag = ImageFont.truetype("arialbd.ttf", 14)
        font_title = ImageFont.truetype("arialbd.ttf", 22)
        font_sub = ImageFont.truetype("arial.ttf", 14)
    except Exception:
        font_tag = ImageFont.load_default()
        font_title = ImageFont.load_default()
        font_sub = ImageFont.load_default()
    
    # Top Tag Row: Glowing dot + Tag text
    dot_x, dot_y = bx + 26, by + 18
    draw.ellipse([dot_x - 4, dot_y - 4, dot_x + 4, dot_y + 4], fill=accent_color)
    # Outer dot glow
    draw.ellipse([dot_x - 7, dot_y - 7, dot_x + 7, dot_y + 7], outline=accent_color + (120,), width=1)
    
    draw.text((bx + 38, by + 10), tag_text.upper(), font=font_tag, fill=accent_color)
    
    # Title
    draw.text((bx + 26, by + 36), title_text, font=font_title, fill=(255, 255, 255, 255))
    
    # Subtitle
    draw.text((bx + 26, by + 74), subtitle_text, font=font_sub, fill=(186, 201, 224, 255))
    
    return np.array(canvas)


# Pre-render the 5 callout overlays
CALLOUT_DATA = [
    # 1. Breakthrough
    {
        "start": 35, "end": 80,
        "tag": "Architectural Breakthrough",
        "title": "THE BREAKTHROUGH: 100x Imaging Speedup",
        "sub": "Acquisition Wall Collapses 3,125% -> 31% Load • Instant Bottleneck Migration",
        "accent": (56, 189, 248),  # Cyan
        "border": (56, 189, 248, 140)
    },
    # 2. Bottleneck Shift
    {
        "start": 85, "end": 135,
        "tag": "Governing Constraint Shift",
        "title": "BOTTLENECK SHIFT: Memory Wall Dominance (<1ms)",
        "sub": "Stage Pressures Rebalance • Pipeline Latency Governed by HBM Bandwidth",
        "accent": (245, 158, 11),  # Amber
        "border": (245, 158, 11, 140)
    },
    # 3. 12 Equations
    {
        "start": 145, "end": 205,
        "tag": "Mathematical Rigor",
        "title": "12 DETERMINISTIC EQUATIONS: Epistemic Grounding",
        "sub": "Formal Biophysical Scaling Laws • Zero Hallucination Closed-Form Math",
        "accent": (129, 140, 248),  # Indigo
        "border": (129, 140, 248, 140)
    },
    # 4. Empirical Proof
    {
        "start": 305, "end": 410,
        "tag": "Hardware Evidence • Tesla T4",
        "title": "EMPIRICAL PROOF: 8.62x GPU Acceleration (T4 + cuDF)",
        "sub": "100,000-Scenario Monte Carlo Sweep • Zero Code Change via %load_ext cudf.pandas",
        "accent": (16, 185, 129),  # Emerald NVIDIA
        "border": (16, 185, 129, 150)
    },
    # 5. Verified Credentials
    {
        "start": 470, "end": 575,
        "tag": "Google Cloud x NVIDIA Verified",
        "title": "VERIFIED CREDENTIALS: 4/4 Google Cloud x NVIDIA Pathways",
        "sub": "All 4 Golden Tickets Completed • Developer ID: 110918189625880989910",
        "accent": (234, 179, 8),  # Gold
        "border": (234, 179, 8, 160)
    }
]

# Keyframe trajectory for kinetic zoom & pan: (frame, zoom, cx, cy)
KEYFRAMES = [
    (0, 1.00, 960, 540),
    (30, 1.00, 960, 540),
    # Zoom in to 100x Breakthrough button
    (42, 1.28, 680, 360),
    (74, 1.28, 680, 360),
    # Pan down to Memory Wall chart and stage pressures
    (90, 1.22, 960, 520),
    (125, 1.15, 960, 520),
    (130, 1.00, 960, 540),
    # Methodology & 12 Equations
    (145, 1.00, 960, 540),
    (160, 1.20, 940, 500),
    (200, 1.20, 940, 500),
    (209, 1.00, 960, 540),
    # Architecture
    (210, 1.00, 960, 540),
    (225, 1.15, 960, 480),
    (270, 1.15, 960, 480),
    (279, 1.00, 960, 540),
    # Colab T4 GPU Workflow & 8.62x benchmark
    (280, 1.00, 960, 540),
    (305, 1.25, 960, 580),
    (350, 1.25, 960, 580),
    (410, 1.08, 960, 540),
    (419, 1.00, 960, 540),
    # About Page & Verified Credentials
    (420, 1.00, 960, 540),
    (445, 1.15, 860, 420),
    (465, 1.15, 860, 420),
    # Modal opens: zoom into the 4 Golden Ticket cards
    (480, 1.24, 960, 540),
    (575, 1.24, 960, 540),
    (589, 1.24, 960, 540)
]


def interpolate_camera(frame_idx):
    """Interpolates zoom, cx, cy for frame_idx."""
    for i in range(len(KEYFRAMES) - 1):
        f1, z1, x1, y1 = KEYFRAMES[i]
        f2, z2, x2, y2 = KEYFRAMES[i + 1]
        if f1 <= frame_idx <= f2:
            if f1 == f2:
                return z1, x1, y1
            t = (frame_idx - f1) / float(f2 - f1)
            e = smootherstep(t)
            z = z1 + (z2 - z1) * e
            cx = x1 + (x2 - x1) * e
            cy = y1 + (y2 - y1) * e
            return z, cx, cy
    return KEYFRAMES[-1][1], KEYFRAMES[-1][2], KEYFRAMES[-1][3]


def apply_kinetic_zoom(img_bgr, zoom, cx, cy):
    """Sub-pixel kinetic camera crop & resize."""
    h, w = img_bgr.shape[:2]
    if zoom <= 1.002:
        return img_bgr
    
    w_crop = w / zoom
    h_crop = h / zoom
    
    x1 = cx - w_crop / 2.0
    y1 = cy - h_crop / 2.0
    
    # Clamp bounds
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
    
    zoomed = cv2.warpAffine(img_bgr, matrix, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return zoomed


def create_vignette(h=1080, w=1920):
    """Creates a subtle, high-end cinematic vignette."""
    kernel_x = cv2.getGaussianKernel(w, w * 0.75)
    kernel_y = cv2.getGaussianKernel(h, h * 0.75)
    kernel = kernel_y * kernel_x.T
    mask = kernel / kernel.max()
    vignette = 0.88 + 0.12 * mask
    return np.repeat(vignette[:, :, np.newaxis], 3, axis=2)


def process_frames(input_dir, output_dir, total_frames=590):
    print(f"Post-processing {total_frames} frames for 59.0s master recording...")
    os.makedirs(output_dir, exist_ok=True)
    
    # Pre-render badges
    pre_rendered_badges = []
    for c in CALLOUT_DATA:
        badge_rgba = create_callout_badge(c["tag"], c["title"], c["sub"], c["accent"], c["border"])
        pre_rendered_badges.append((c["start"], c["end"], badge_rgba))
    
    vignette_mask = create_vignette(1080, 1920)
    
    for f_idx in range(total_frames):
        src_name = f"frame_{f_idx:05d}.png"
        src_path = os.path.join(input_dir, src_name)
        if not os.path.exists(src_path):
            # Fallback to last available
            src_path = os.path.join(input_dir, f"frame_{max(0, f_idx - 1):05d}.png")
        
        frame = cv2.imread(src_path)
        if frame is None:
            frame = np.zeros((1080, 1920, 3), dtype=np.uint8)
        
        # Ensure 1920x1080
        if frame.shape[0] != 1080 or frame.shape[1] != 1920:
            frame = cv2.resize(frame, (1920, 1080), interpolation=cv2.INTER_LANCZOS4)
        
        # 1. Dynamic Kinetic Zoom & Pan
        zoom, cx, cy = interpolate_camera(f_idx)
        frame = apply_kinetic_zoom(frame, zoom, cx, cy)
        
        # 2. Sleek Lower-Third Badges & Callout Overlays
        for start_f, end_f, badge_rgba in pre_rendered_badges:
            if start_f <= f_idx <= end_f:
                # Transition easing: 7 frames in, 7 frames out
                trans_len = 7
                if f_idx < start_f + trans_len:
                    alpha_factor = smootherstep((f_idx - start_f) / float(trans_len))
                    y_offset = int(18 * (1.0 - alpha_factor))
                elif f_idx > end_f - trans_len:
                    alpha_factor = smootherstep((end_f - f_idx) / float(trans_len))
                    y_offset = int(18 * (1.0 - alpha_factor))
                else:
                    alpha_factor = 1.0
                    y_offset = 0
                
                # Composite with alpha factor and y_offset
                b_alpha = (badge_rgba[:, :, 3] / 255.0) * alpha_factor
                b_rgb = badge_rgba[:, :, :3]
                
                if y_offset > 0:
                    shifted_alpha = np.zeros_like(b_alpha)
                    shifted_rgb = np.zeros_like(b_rgb)
                    shifted_alpha[y_offset:, :] = b_alpha[:-y_offset, :]
                    shifted_rgb[y_offset:, :] = b_rgb[:-y_offset, :]
                    b_alpha = shifted_alpha
                    b_rgb = shifted_rgb
                
                # Convert BGR/RGB for compositing (PIL output is RGB, OpenCV frame is BGR)
                b_bgr = b_rgb[:, :, ::-1]
                
                # Alpha blend
                mask_3d = np.repeat(b_alpha[:, :, np.newaxis], 3, axis=2)
                frame = (frame * (1.0 - mask_3d) + b_bgr * mask_3d).astype(np.uint8)
                break
        
        # 3. Subtle Vignette
        frame = (frame * vignette_mask).astype(np.uint8)
        
        # 4. Seamless 59.0s Loop Cut: Smooth fade-out to black on the final 12 frames (578 to 590)
        fade_frames = 12
        if f_idx >= total_frames - fade_frames:
            fade_progress = (total_frames - 1 - f_idx) / float(fade_frames)
            fade_factor = smootherstep(fade_progress)
            frame = (frame * fade_factor).astype(np.uint8)
        
        out_path = os.path.join(output_dir, f"frame_{f_idx:05d}.png")
        cv2.imwrite(out_path, frame)
        
        if f_idx % 60 == 0 or f_idx == total_frames - 1:
            print(f"Processed frame {f_idx + 1}/{total_frames} (zoom={zoom:.2f}, callout active={any(s <= f_idx <= e for s, e, _ in pre_rendered_badges)})")
            
    print(f"SUCCESS: All {total_frames} frames post-processed and saved to {output_dir}")


if __name__ == "__main__":
    in_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "temp_raw_frames")
    out_dir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(__file__), "temp_processed_frames")
    process_frames(in_dir, out_dir, total_frames=590)

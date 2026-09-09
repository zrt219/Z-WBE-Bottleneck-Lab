"""
scripts/compose_master_audio.py
Synthesizes a master-grade 58.5-second stereo audio track (48kHz 16-bit WAV)
featuring:
1. Restrained, elegant, evolving ambient synth pad bed with chord progression.
2. Sound design matching exact final edit logic:
   - 2.4s: Soft haptic click (100x Breakthrough trigger)
   - 2.5s - 3.2s: Short transition swell
   - 3.2s: Stronger hit when THE BOTTLENECK MOVED appears (sub-bass impact + resonant chime)
   - 17.0s: Soft scene swell (NVIDIA Nemotron 3 Super)
   - 27.0s: Soft transition swell (Research Proof)
   - 34.5s: Soft confirmation chime (8.62x Measured T4 Benchmark)
   - 38.0s: Soft transition swell (BigQuery 100,000 Scenarios)
   - 47.0s: Soft transition swell (Open System / GitHub)
   - 55.2s: Golden chord chime (4 Learning Paths / Credentials)
   - 58.0s - 58.5s: Seamless fade-out to silence
"""

import math
import os
import numpy as np
import scipy.io.wavfile as wavfile

SAMPLE_RATE = 48000
DURATION = 58.5
TOTAL_SAMPLES = int(SAMPLE_RATE * DURATION)


def create_reverb(signal, sample_rate, delays_ms=[47, 73, 113, 167], decays=[0.4, 0.3, 0.2, 0.15]):
    """Apply Schroeder-style multi-tap comb reverb for spatial depth."""
    out = np.copy(signal)
    for d_ms, g in zip(delays_ms, decays):
        d_samples = int(sample_rate * d_ms / 1000.0)
        delayed = np.zeros_like(signal)
        delayed[d_samples:] = signal[:-d_samples] * g
        out += delayed
    return out


def generate_click(sample_rate):
    """Clean, soft haptic click transient: sine pitch drop + gentle thud."""
    dur = 0.03
    n = int(sample_rate * dur)
    t = np.linspace(0, dur, n, False)
    freq = 3200 * np.exp(-t * 110) + 160
    phase = 2 * np.pi * np.cumsum(freq) / sample_rate
    click = np.sin(phase) * np.exp(-t * 140)
    thud = 0.3 * np.sin(2 * np.pi * 140 * t) * np.exp(-t * 80)
    sig = click + thud
    return sig / (np.max(np.abs(sig)) + 1e-6)


def generate_whoosh(sample_rate, dur=0.7, reverse=False):
    """Restrained, smooth transition swell / noise sweep."""
    n = int(sample_rate * dur)
    t = np.linspace(0, dur, n, False)
    noise = np.random.randn(n)
    
    sweep = np.sin(np.pi * t / dur) ** 2
    carrier_freq = 350 + 1600 * (t / dur)
    carrier = np.sin(2 * np.pi * carrier_freq * t)
    whoosh = noise * sweep * 0.4 + carrier * sweep * 0.25
    env = np.sin(np.pi * t / dur) ** 1.6
    sig = whoosh * env
    return sig / (np.max(np.abs(sig)) + 1e-6)


def generate_strong_hit(sample_rate, dur=2.2):
    """
    Stronger hit for 'THE BOTTLENECK MOVED':
    Combines sub-bass impact transient (55Hz drop) + resonant harmonic strike + reverb tail.
    """
    n = int(sample_rate * dur)
    t = np.linspace(0, dur, n, False)
    
    # Sub punch
    sub_freq = 65 * np.exp(-t * 3.5) + 35
    sub_phase = 2 * np.pi * np.cumsum(sub_freq) / sample_rate
    sub_punch = np.sin(sub_phase) * np.exp(-t * 2.8)
    
    # Body impact
    impact_freq = 130 * np.exp(-t * 5.0) + 55
    impact = 0.6 * np.sin(2 * np.pi * impact_freq * t) * np.exp(-t * 4.5)
    
    # Harmonic ring / gong resonance
    ring_freqs = [220.0, 329.6, 440.0, 659.2]
    ring = np.zeros(n)
    for i, f in enumerate(ring_freqs):
        ring += (0.4 / (i + 1)) * np.sin(2 * np.pi * f * t) * np.exp(-t * (1.8 + i * 0.3))
        
    combined = sub_punch * 0.8 + impact * 0.5 + ring * 0.4
    reverbed = create_reverb(combined, sample_rate, delays_ms=[53, 91, 149, 211], decays=[0.45, 0.35, 0.25, 0.18])
    return reverbed / (np.max(np.abs(reverbed)) + 1e-6)


def generate_chime(sample_rate, freqs=[587.33, 739.99, 880.0, 1174.66], dur=2.2):
    """Soft, crystalline harmonic chime."""
    n = int(sample_rate * dur)
    t = np.linspace(0, dur, n, False)
    sig = np.zeros(n)
    for i, f in enumerate(freqs):
        amp = (1.0 / (i + 1) ** 0.65)
        wave = amp * (
            0.6 * np.sin(2 * np.pi * f * t) +
            0.4 * np.sin(2 * np.pi * (f * 1.002) * t)
        )
        env = np.exp(-t * (1.8 + i * 0.4))
        sig += wave * env
    sig = create_reverb(sig, sample_rate)
    return sig / (np.max(np.abs(sig)) + 1e-6)


def generate_golden_chime(sample_rate, freqs=[523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98], dur=3.2):
    """Rich, golden major-chord chime for Credentials modal."""
    n = int(sample_rate * dur)
    t = np.linspace(0, dur, n, False)
    sig = np.zeros(n)
    for i, f in enumerate(freqs):
        amp = (1.0 / (i + 1) ** 0.5)
        wave = amp * np.sin(2 * np.pi * f * t)
        env = np.exp(-t * (1.2 + i * 0.3))
        sig += wave * env
    sig = create_reverb(sig, sample_rate, delays_ms=[61, 107, 173, 241], decays=[0.5, 0.4, 0.28, 0.2])
    return sig / (np.max(np.abs(sig)) + 1e-6)


def main():
    print(f"Synthesizing 58.5s master audio track ({SAMPLE_RATE} Hz stereo)...")
    t = np.linspace(0, DURATION, TOTAL_SAMPLES, False)
    
    left = np.zeros(TOTAL_SAMPLES)
    right = np.zeros(TOTAL_SAMPLES)
    
    # 4 Harmonic Chord Sections (Atmospheric Synth Pad)
    chords = [
        (0.0, 14.0, [65.41, 130.81, 155.56, 196.00, 293.66]),       # C minor 9 (Mystery/Breakthrough)
        (14.0, 28.0, [58.27, 116.54, 146.83, 174.61, 233.08]),     # Bb major / Deterministic & Nemotron
        (28.0, 42.0, [51.91, 103.83, 155.56, 207.65, 261.63]),     # Ab major / Proof & Benchmark
        (42.0, 58.5, [65.41, 130.81, 164.81, 196.00, 246.94]),     # C major 9 / Golden Resolution
    ]
    
    ambient_l = np.zeros(TOTAL_SAMPLES)
    ambient_r = np.zeros(TOTAL_SAMPLES)
    
    pulse = 0.88 + 0.12 * (np.sin(2 * np.pi * 1.5 * t - np.pi / 2) ** 4)
    
    for start_s, end_s, freqs in chords:
        start_idx = int(start_s * SAMPLE_RATE)
        end_idx = min(TOTAL_SAMPLES, int(end_s * SAMPLE_RATE))
        seg_len = end_idx - start_idx
        seg_t = np.linspace(0, end_s - start_s, seg_len, False)
        
        seg_l = np.zeros(seg_len)
        seg_r = np.zeros(seg_len)
        
        for i, f in enumerate(freqs):
            detune = 0.4 * (i + 1)
            amp = 0.20 / (i + 1) ** 0.5
            w_l = np.sin(2 * np.pi * (f - detune * 0.5) * seg_t) + 0.25 * np.sin(4 * np.pi * (f - detune * 0.5) * seg_t)
            w_r = np.sin(2 * np.pi * (f + detune * 0.5) * seg_t) + 0.25 * np.sin(4 * np.pi * (f + detune * 0.5) * seg_t)
            
            lfo = 0.75 + 0.25 * np.sin(2 * np.pi * 0.12 * seg_t + i)
            seg_l += w_l * amp * lfo
            seg_r += w_r * amp * lfo
        
        crossfade_dur = 1.0
        cf_len = min(seg_len // 2, int(crossfade_dur * SAMPLE_RATE))
        fade_in = np.linspace(0, 1, cf_len)
        fade_out = np.linspace(1, 0, cf_len)
        
        env = np.ones(seg_len)
        env[:cf_len] = fade_in
        env[-cf_len:] = fade_out
        
        ambient_l[start_idx:end_idx] += seg_l * env
        ambient_r[start_idx:end_idx] += seg_r * env
    
    # Sub-bass foundation
    sub_bass = 0.15 * np.sin(2 * np.pi * 48.0 * t) + 0.10 * np.sin(2 * np.pi * 65.41 * t)
    ambient_l += sub_bass
    ambient_r += sub_bass
    
    ambient_l *= pulse
    ambient_r *= pulse
    
    # Master Envelope
    master_env = np.ones(TOTAL_SAMPLES)
    fade_in_len = int(0.8 * SAMPLE_RATE)
    master_env[:fade_in_len] = np.linspace(0, 1, fade_in_len)
    
    # Final fade-out at 57.5s - 58.5s
    fade_out_start = int(57.5 * SAMPLE_RATE)
    fade_out_len = TOTAL_SAMPLES - fade_out_start
    master_env[fade_out_start:] = np.linspace(1, 0, fade_out_len) ** 1.8
    
    ambient_l *= master_env * 0.32
    ambient_r *= master_env * 0.32
    
    left += ambient_l
    right += ambient_r
    
    def overlay_sfx(sfx_sig, timestamp_s, pan=0.0, gain=0.6):
        start_idx = int(timestamp_s * SAMPLE_RATE)
        sig_len = len(sfx_sig)
        if start_idx >= TOTAL_SAMPLES:
            return
        end_idx = min(TOTAL_SAMPLES, start_idx + sig_len)
        chunk = sfx_sig[:end_idx - start_idx] * gain
        
        gain_l = math.cos((pan + 1) * math.pi / 4)
        gain_r = math.sin((pan + 1) * math.pi / 4)
        
        left[start_idx:end_idx] += chunk * gain_l
        right[start_idx:end_idx] += chunk * gain_r

    # UI Sound Design (Restrained)
    # 1. 100x button soft click at 2.4s
    click = generate_click(SAMPLE_RATE)
    overlay_sfx(click, timestamp_s=2.4, pan=-0.15, gain=0.45)
    
    # 2. Short transition swell at 2.5s - 3.2s
    swell = generate_whoosh(SAMPLE_RATE, dur=0.7)
    overlay_sfx(swell, timestamp_s=2.5, pan=0.0, gain=0.35)
    
    # 3. ONE STRONGER HIT when THE BOTTLENECK MOVED appears at 3.2s
    strong_hit = generate_strong_hit(SAMPLE_RATE, dur=2.4)
    overlay_sfx(strong_hit, timestamp_s=3.2, pan=0.0, gain=0.85)
    
    # 4. Soft scene transitions (restrained, no arcade bleeps)
    transition_swell = generate_whoosh(SAMPLE_RATE, dur=0.6)
    overlay_sfx(transition_swell, timestamp_s=6.0, pan=0.1, gain=0.25)
    overlay_sfx(transition_swell, timestamp_s=17.0, pan=-0.1, gain=0.28)
    overlay_sfx(transition_swell, timestamp_s=27.0, pan=0.1, gain=0.30)
    
    # 5. Confirmation chime on 8.62x Measured T4 Benchmark at 34.5s
    bench_chime = generate_chime(SAMPLE_RATE, freqs=[659.25, 830.61, 987.77, 1318.51], dur=2.2)
    overlay_sfx(bench_chime, timestamp_s=34.5, pan=0.15, gain=0.55)
    
    # 6. Subtle swells for BigQuery and Open System
    overlay_sfx(transition_swell, timestamp_s=38.0, pan=-0.1, gain=0.28)
    overlay_sfx(transition_swell, timestamp_s=47.0, pan=0.1, gain=0.28)
    
    # 7. Golden resolution chord chime for 4 Learning Paths / Credentials at 55.2s
    golden_chime = generate_golden_chime(SAMPLE_RATE, dur=3.0)
    overlay_sfx(golden_chime, timestamp_s=55.2, pan=0.0, gain=0.75)
    
    # Peak Normalization
    max_peak = max(np.max(np.abs(left)), np.max(np.abs(right)))
    target_peak = 0.89
    if max_peak > 0:
        left = left * (target_peak / max_peak)
        right = right * (target_peak / max_peak)
    
    audio_data = np.vstack((left, right)).T
    out_dir = os.path.dirname(os.path.abspath(__file__))
    out_wav = os.path.join(out_dir, "master_audio_58.5s.wav")
    
    wavfile.write(out_wav, SAMPLE_RATE, (audio_data * 32767).astype(np.int16))
    size_mb = os.path.getsize(out_wav) / (1024 * 1024)
    print(f"SUCCESS: Master audio generated: {out_wav} ({size_mb:.2f} MB, {DURATION}s @ 48kHz stereo)")
    return out_wav


if __name__ == "__main__":
    main()

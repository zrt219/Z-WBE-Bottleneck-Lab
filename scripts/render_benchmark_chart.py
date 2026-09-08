import json
import os
import matplotlib.pyplot as plt
import numpy as np

# Load benchmark data
json_path = 'public/data/cpu_vs_gpu_benchmark.json'
with open(json_path, 'r') as f:
    data = json.load(f)

stages = list(data['cpu_times'].keys())
cpu_times = [data['cpu_times'][s] for s in stages]
gpu_times = [data['gpu_times'][s] for s in stages]
speedups = [data['speedups'][s] for s in stages]

# Style configuration
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6), gridspec_kw={'width_ratios': [2, 1.2]})

# Plot 1: Execution Time Comparison (Log Scale for clarity)
x = np.arange(len(stages))
width = 0.35

rects1 = ax1.bar(x - width/2, cpu_times, width, label='CPU (Host 8-Core)', color='#64748b', edgecolor='#334155', linewidth=1.2)
rects2 = ax1.bar(x + width/2, gpu_times, width, label='GPU (NVIDIA Tesla T4 cuDF)', color='#10b981', edgecolor='#047857', linewidth=1.2)

ax1.set_ylabel('Execution Time (seconds, log scale)', fontsize=12, fontweight='bold', color='#1e293b')
ax1.set_title('Pipeline Stage Execution Time (Lower is Better)\nNVIDIA T4 GPU vs Host CPU', fontsize=13, fontweight='bold', color='#0f172a', pad=12)
ax1.set_xticks(x)
ax1.set_xticklabels(stages, rotation=15, ha='right', fontsize=10, fontweight='bold')
ax1.set_yscale('log')
ax1.legend(loc='upper left', frameon=True, facecolor='#ffffff', edgecolor='#cbd5e1', fontsize=10)
ax1.grid(True, linestyle='--', alpha=0.5, axis='y')

# Annotate speedup badges on Plot 1
for i, (cpu, gpu, spd) in enumerate(zip(cpu_times, gpu_times, speedups)):
    ax1.annotate(f"{spd:.1f}x faster",
                 xy=(i + width/2, gpu),
                 xytext=(0, 6),
                 textcoords="offset points",
                 ha='center', va='bottom',
                 fontsize=9, fontweight='heavy',
                 color='#047857',
                 bbox=dict(boxstyle="round,pad=0.2", fc="#d1fae5", ec="#10b981", lw=1))

# Plot 2: Speedup Multiplier by Stage & Total
stages_with_total = stages + ['Total Pipeline']
all_speedups = speedups + [data['overall_speedup_multiplier']]
colors = ['#0ea5e9' for _ in stages] + ['#7c3aed']

y_pos = np.arange(len(stages_with_total))
rects3 = ax2.barh(y_pos, all_speedups, color=colors, edgecolor='#1e293b', linewidth=1.1)

ax2.set_xlabel('Speedup Multiplier (Higher is Better)', fontsize=12, fontweight='bold', color='#1e293b')
ax2.set_title('Acceleration Factor\n(RAPIDS cuDF & GPU ML)', fontsize=13, fontweight='bold', color='#0f172a', pad=12)
ax2.set_yticks(y_pos)
ax2.set_yticklabels(stages_with_total, fontsize=10, fontweight='bold')
ax2.grid(True, linestyle='--', alpha=0.5, axis='x')

# Annotate speedup values
for i, spd in enumerate(all_speedups):
    ax2.text(spd + 0.2, i, f"{spd:.2f}x" if i == len(stages) else f"{spd:.1f}x",
             va='center', fontsize=10, fontweight='bold',
             color='#7c3aed' if i == len(stages) else '#0284c7')

ax2.set_xlim(0, max(all_speedups) * 1.25)

# Overall Callout Box
callout_text = f"Overall Speedup: {data['overall_speedup_multiplier']:.2f}x\nTotal Time Saved: {data['time_saved_percent']}%\nHardware: NVIDIA Tesla T4"
fig.text(0.5, 0.02, callout_text, ha='center', fontsize=11, fontweight='bold',
         color='#0f172a', bbox=dict(boxstyle="round,pad=0.5", fc="#f8fafc", ec="#94a3b8", lw=1.5))

plt.tight_layout(rect=[0, 0.08, 1, 0.98])

# Save to public destinations
out_paths = [
    'public/data/cpu_vs_gpu_speedup.png',
    'frontend/public/data/cpu_vs_gpu_speedup.png'
]

for p in out_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    plt.savefig(p, dpi=200)
    print(f"Saved benchmark chart to {p}")

plt.close()

import os
import sys

sys.path.append(r"d:\programming\Blockchain development\Z-WBE Bottleneck Lab\scripts")

from campaign_week1 import get_week1_data
from campaign_week2 import get_week2_data
from campaign_week3 import get_week3_data

all_days = get_week1_data() + get_week2_data() + get_week3_data()
for d in all_days:
    li_times = [p['time'] for p in d['linkedin']]
    x_times = [p['time'] for p in d['x']]
    print(f"Day {d['day']:02d}: LI ({len(li_times)}): {li_times}")
    print(f"        X  ({len(x_times)}): {x_times}")

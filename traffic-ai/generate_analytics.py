import json
import matplotlib.pyplot as plt
import os
import time

# --- CONFIGURATION ---
json_file = 'features.json'
# 🟢 NEW: Unique filename based on current time
timestamp = int(time.time())
output_chart = f'analytics_{timestamp}.png'

# 1. Load Data
try:
    with open(json_file, 'r') as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"❌ Error: Could not find '{json_file}'.")
    exit()

# 2. Calculate Stats
total_images = len(data)
stats = {
    'Safe (No Accident)': 0,
    'Severe Accident': 0,
    'Moderate Accident': 0
}

for entry in data:
    detections = entry.get('detections', [])
    if not detections:
        stats['Safe (No Accident)'] += 1
    else:
        classes = [d['class'].lower() for d in detections]
        if 'severe' in classes:
            stats['Severe Accident'] += 1
        elif 'moderate' in classes:
            stats['Moderate Accident'] += 1

# 3. Create Charts
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
fig.suptitle(f'AI Analysis Batch #{timestamp}', fontsize=16, fontweight='bold')

# Pie Chart
labels = list(stats.keys())
sizes = list(stats.values())
colors = ['#4CAF50', '#F44336', '#FF9800'] 
explode = (0.05, 0.05, 0.05)

ax1.pie(sizes, explode=explode, labels=labels, colors=colors, autopct='%1.1f%%',
        shadow=True, startangle=140)
ax1.set_title('Severity Distribution')

# Bar Chart
bars = ax2.bar(labels, sizes, color=colors)
ax2.set_title('Event Counts')
ax2.grid(axis='y', linestyle='--', alpha=0.7)

for bar in bars:
    height = bar.get_height()
    ax2.text(bar.get_x() + bar.get_width()/2., height,
             f'{int(height)}', ha='center', va='bottom', fontweight='bold')

# 4. Save
plt.tight_layout()
plt.savefig(output_chart, dpi=300)
print(f"✅ New Analytics Graph Saved: {output_chart}")
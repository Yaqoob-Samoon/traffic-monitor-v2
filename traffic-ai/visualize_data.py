import json
import cv2
import os
import random

# CONFIGURATION
json_file = 'features.json'
input_folder = 'uploads'
output_folder = 'visual_proof'
os.makedirs(output_folder, exist_ok=True)

# Load the data
with open(json_file, 'r') as f:
    data = json.load(f)

print(f"🎨 Generating visual proof for {len(data)} images...")

# Define colors: (Blue, Green, Red)
COLORS = {
    'severe': (0, 0, 255),    # Red for Severe
    'moderate': (0, 165, 255), # Orange for Moderate
    'default': (0, 255, 0)     # Green for others
}

for entry in data:
    filename = entry['filename']
    filepath = os.path.join(input_folder, filename)
    
    # Check if image exists
    if not os.path.exists(filepath):
        continue
        
    # Read image
    img = cv2.imread(filepath)
    if img is None: continue
    
    h, w, _ = img.shape
    detections = entry['detections']
    
    # If no detections, just save the original (Safe Image)
    if not detections:
        cv2.putText(img, "SAFE / NO DETECTION", (30, 50), 
                   cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    
    # Draw boxes from JSON data
    for det in detections:
        cls = det['class']
        conf = det['confidence']
        bbox = det['bbox']
        
        # Convert Normalized (0-1) to Pixels
        x_center, y_center = bbox['x_center'] * w, bbox['y_center'] * h
        box_w, box_h = bbox['width'] * w, bbox['height'] * h
        
        x1 = int(x_center - (box_w / 2))
        y1 = int(y_center - (box_h / 2))
        x2 = int(x_center + (box_w / 2))
        y2 = int(y_center + (box_h / 2))
        
        # Pick Color
        color = COLORS.get(cls.lower(), COLORS['default'])
        
        # Draw Box & Label
        cv2.rectangle(img, (x1, y1), (x2, y2), color, 3)
        label = f"{cls.upper()} ({int(conf*100)}%)"
        cv2.putText(img, label, (x1, y1 - 10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # Save to visual proof folder
    output_path = os.path.join(output_folder, f"proof_{filename}")
    cv2.imwrite(output_path, img)

print(f"✅ Visual proofs saved to folder: '{output_folder}'")
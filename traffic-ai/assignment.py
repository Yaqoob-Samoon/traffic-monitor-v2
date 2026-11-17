import json
import os
import glob
from ultralytics import YOLO

# --- CONFIGURATION ---
# 1. Path to your local model
model_path = 'best.pt' 

# 2. Path to the images you want to test
# We will use your 'uploads' folder since you already have images/videos there.
# If you want to test specific images, put them in a folder and change this path.
image_folder = 'uploads'
image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.mp4']

# ---------------------

# Load your custom model
try:
    model = YOLO(model_path)
    print(f"✅ Loaded model from {model_path}")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    exit()

# Find all images in the folder
image_files = []
for ext in image_extensions:
    image_files.extend(glob.glob(os.path.join(image_folder, ext)))

structured_data = []

print(f"⚡ Processing {len(image_files)} files from '{image_folder}'...")

# Run inference and extract data
for img_file in image_files:
    # Run the model
    results = model(img_file, verbose=False, conf=0.25)
    
    for r in results:
        # Basic file info
        file_data = {
            "filename": os.path.basename(img_file),
            "original_width": r.orig_shape[1],
            "original_height": r.orig_shape[0],
            "detections": []
        }
        
        # Loop through detected objects
        for box in r.boxes:
            # Get Class Name (e.g., 'Severe', 'Moderate')
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            
            # Get Confidence
            conf = float(box.conf[0])
            
            # Get Box Coordinates (Normalized 0-1)
            x, y, w, h = box.xywhn[0].tolist()
            
            detection_entry = {
                "class": class_name,
                "confidence": round(conf, 4),
                "bbox": {
                    "x_center": round(x, 4),
                    "y_center": round(y, 4),
                    "width": round(w, 4),
                    "height": round(h, 4)
                }
            }
            file_data["detections"].append(detection_entry)
        
        structured_data.append(file_data)

# Save to features.json
output_file = 'features.json'
with open(output_file, 'w') as f:
    json.dump(structured_data, f, indent=4)

print(f"\n✅ Assignment Complete! Data saved to: {os.path.abspath(output_file)}")
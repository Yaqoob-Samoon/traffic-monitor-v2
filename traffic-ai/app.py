import os
import cv2
import math
import time
import numpy as np
import copy

# ==========================================
# MATPLOTLIB CONFIGURATION (FOR BACKEND GRAPH)
# ==========================================
import matplotlib
matplotlib.use('Agg')  # Required for headless backend chart generation
import matplotlib.pyplot as plt

from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)

# ==========================================
# 1. HIGH-PRECISION CONFIGURATION
# ==========================================
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Smart Class Filter to reduce sensor background noise
CLASS_NAMES = {
    0: "Person", 1: "Cyclist", 2: "Car", 3: "Bike", 5: "Bus", 7: "Truck",
    15: "Cat", 16: "Dog", 17: "Horse", 18: "Sheep", 19: "Cow" 
}

# --- ADVANCED PRECISION TUNING ---
ACCIDENT_CONFIDENCE = 0.25       # Base threshold for accident engine (lowered to catch edge cases)
CONFIDENCE_THRESHOLD = 0.45      # Base threshold for standard traffic engine
IOU_VALIDATION_THRESHOLD = 0.40  # Overlap limit before triggering suppression logic
NEAR_MISS_THRESHOLD_PX = 60      # Spatial proximity threshold for near-miss warnings

# --- VISUAL ENHANCEMENT (NIGHT MODE CLAHE) ---
clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))

# ==========================================
# 2. OPTIMIZED ENGINE LOADING
# ==========================================
print("\n⏳ LOADING ARTIFICIAL INTELLIGENCE ENGINES...")
model_accidents = None

try:
    # 🔴 Pointing to the new V2 trained filename
    if os.path.exists('best (1).pt'):
        model_accidents = YOLO('best (1).pt')
        print("✅ [ACCIDENT] Custom Structural Damage Model (v2) Loaded.")
    else:
        print("⚠️ [WARNING] 'best (1).pt' missing. Running without accident validation.")
except Exception as e:
    print(f"❌ Error loading accident model: {e}")

try:
    # Switched to yolov8s.pt to ensure standard vehicles are detected properly
    model_objects = YOLO('yolov8s.pt')
    print("✅ [TRAFFIC] Standard Verification YOLO Model Loaded.")
except Exception as e:
    print(f"❌ Error loading YOLO model: {e}")
    exit(1)

# ==========================================
# 3. MATHEMATICAL & ANALYTICAL HELPERS
# ==========================================
def apply_clahe(frame):
    """Enhances visibility under low light environments."""
    lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    l_enhanced = clahe.apply(l)
    lab_enhanced = cv2.merge((l_enhanced, a, b))
    return cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)

def calculate_iou(box1, box2):
    """Calculates Intersection over Union (IoU) between two bounding boxes."""
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])
    
    intersection = max(0, x2 - x1) * max(0, y2 - y1)
    area1 = (box1[2] - box1[0]) * (box1[3] - box1[1])
    area2 = (box2[2] - box2[0]) * (box2[3] - box2[1])
    
    if area1 == 0 or area2 == 0: 
        return 0
    return intersection / float(area1 + area2 - intersection + 1e-6)

def generate_analytics_chart(counts, accident_info):
    """Generates a presentation-ready analytical report chart saved as PNG."""
    timestamp = int(time.time())
    output_filename = f'analytics_{timestamp}.png'
    output_path = os.path.join(RESULTS_FOLDER, output_filename) 
    
    # Severity Distribution Data
    severity_labels = ['Safe Traffic', 'Accident Scene']
    severity_counts = [
        1 if not accident_info['detected'] else 0, 
        1 if accident_info['detected'] else 0
    ]
    
    # Vehicle Counting Data
    veh_labels = [k.capitalize() for k in counts.keys() if k != 'total' and counts[k] > 0]
    veh_values = [counts[k.lower()] for k in veh_labels]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
    fig.suptitle(f'FYP System Intelligence Analysis Summary #{timestamp}', fontsize=14, fontweight='bold', color='#333333')

    # Chart A: Pie Chart for Road Condition Status
    colors_pie = ['#4CAF50', '#F44336'] if not accident_info['detected'] else ['#DDDDDD', '#F44336']
    ax1.pie(severity_counts, labels=severity_labels, autopct='%1.1f%%', colors=colors_pie, startangle=140)
    ax1.set_title("Real-Time Safety Evaluation")

    # Chart B: Bar Graph for Object Volume Distribution
    if veh_labels:
        bars = ax2.bar(veh_labels, veh_values, color='#2196F3')
        ax2.set_title("Traffic Distribution Inventory")
        ax2.grid(axis='y', linestyle='--', alpha=0.3)
        for bar in bars:
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height, f'{int(height)}', ha='center', va='bottom')
    else:
        ax2.text(0.5, 0.5, 'No Active Moving Elements Detected', ha='center', va='center')

    plt.tight_layout()
    plt.savefig(output_path, dpi=100)
    plt.close()
    return output_filename

# ==========================================
# 4. CROSS-VALIDATION COMPUTER VISION ENGINE
# ==========================================
def process_frame(frame, counts, accident_info, risk_events, draw_overlays=True):
    raw_traffic_detections = []
    validated_accident_boxes = []

    # --- STEP 1: COMPUTE STANDARD TRAFFIC DENSITY ---
    results_obj = model_objects(frame, conf=CONFIDENCE_THRESHOLD, verbose=False)
    
    pedestrians = []
    vehicles = []

    for r in results_obj:
        for box in r.boxes:
            cls = int(box.cls[0])
            if cls not in CLASS_NAMES: 
                continue

            x1, y1, x2, y2 = map(int, box.xyxy[0])
            label = CLASS_NAMES[cls]
            conf = float(box.conf[0])
            
            raw_traffic_detections.append({
                "box": [x1, y1, x2, y2],
                "label": label,
                "confidence": conf
            })

            db_key = label.lower() if label.lower() in counts else "other"
            counts[db_key] = counts.get(db_key, 0) + 1
            center = ((x1+x2)//2, (y1+y2)//2)
            
            if label in ["Person", "Cyclist"]: 
                pedestrians.append(center)
            else:
                vehicles.append(center)

    # --- STEP 2: ACCIDENT DETECTION & SMART FILTERING ---
    if model_accidents:
        results_acc = model_accidents(frame, conf=ACCIDENT_CONFIDENCE, verbose=False)
        for r in results_acc:
            for box in r.boxes:
                acc_conf = float(box.conf[0])
                acc_cls = int(box.cls[0])
                ax1, ay1, ax2, ay2 = map(int, box.xyxy[0])
                acc_label = model_accidents.names[acc_cls]

                is_false_alarm = False
                for target in raw_traffic_detections:
                    overlap = calculate_iou([ax1, ay1, ax2, ay2], target["box"])
                    
                    if overlap > IOU_VALIDATION_THRESHOLD:
                        # 🔴 NEW DEBUG LINE: See exactly what the AI thinks
                        print(f"🧐 [DEBUG] AI sees a crash overlapping a '{target['label']}' with {int(acc_conf*100)}% confidence.")
                        
                        # 🔴 LOWERED THRESHOLD: Real accidents around 65-90% will now pass through
                        if acc_conf < 0.65:
                            is_false_alarm = True
                            print(f"🛡️ [AI FILTER] Suppressed False Positive.")
                            break
                
                if is_false_alarm:
                    continue  

                # Update official structure if it passes the filter
                accident_info["detected"] = True
                if acc_conf > accident_info["confidence"]:
                    accident_info["severity"] = acc_label
                    accident_info["confidence"] = round(acc_conf * 100, 2)
                
                validated_accident_boxes.append([ax1, ay1, ax2, ay2])

                if draw_overlays:
                    # Reduced box thickness from 4 to 2
                    cv2.rectangle(frame, (ax1, ay1), (ax2, ay2), (0, 0, 255), 2)
                    label_text = f"CRASH ALERT {int(acc_conf*100)}%"
                    # Reduced font scale to 0.5 and thickness to 1
                    (tw, th), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                    cv2.rectangle(frame, (ax1, ay1-20), (ax1+tw+10, ay1), (0, 0, 255), -1)
                    cv2.putText(frame, label_text, (ax1+5, ay1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    # --- STEP 3: DRAW STANDARD TRAFFIC OVERLAYS ---
    if draw_overlays:
        for element in raw_traffic_detections:
            bx1, by1, bx2, by2 = element["box"]
            lbl = element["label"]
            
            has_accident_mask = False
            for a_box in validated_accident_boxes:
                if calculate_iou([bx1, by1, bx2, by2], a_box) > 0.30:
                    has_accident_mask = True
                    break
                    
            if has_accident_mask:
                continue

            color = (255, 255, 0) if lbl in ["Person", "Cyclist"] else ((255, 0, 255) if lbl in ["Cat", "Dog", "Cow", "Horse"] else (0, 255, 0))
            # Reduced box thickness to 1
            cv2.rectangle(frame, (bx1, by1), (bx2, by2), color, 1)
            # Reduced font thickness to 1
            cv2.putText(frame, f"{lbl} {int(element['confidence']*100)}%", (bx1, by1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)

    # --- STEP 4: RISK ASSESSMENT ENGINE ---
    for p in pedestrians:
        for v in vehicles:
            dist = math.sqrt((p[0]-v[0])**2 + (p[1]-v[1])**2)
            if dist < NEAR_MISS_THRESHOLD_PX:
                if draw_overlays:
                    cv2.line(frame, p, v, (0, 165, 255), 2)
                if "Near Miss: Pedestrian Proximity" not in risk_events:
                    risk_events.append("Near Miss: Pedestrian Proximity")

    return counts

# ==========================================
# 5. SERVER INFRASTRUCTURE & API ROUTES
# ==========================================
def generate_frames(comparison_mode=False):
    camera = cv2.VideoCapture(0) 
    
    while True:
        success, frame = camera.read()
        if not success: 
            break
        
        counts = {"car": 0, "person": 0}
        acc_info = {"detected": False, "confidence": 0, "severity": "None"}
        
        if comparison_mode:
            frame = cv2.resize(frame, (640, 480))
            frame_std = frame.copy()
            process_frame(frame_std, counts.copy(), acc_info.copy(), [], draw_overlays=True)
            cv2.putText(frame_std, "Standard Stream", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            frame_enh = apply_clahe(frame.copy())
            process_frame(frame_enh, counts.copy(), acc_info.copy(), [], draw_overlays=True)
            cv2.putText(frame_enh, "Enhanced Vision Mode", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            
            combined = cv2.hconcat([frame_std, frame_enh])
            ret, buffer = cv2.imencode('.jpg', combined)
        else:
            process_frame(frame, counts, acc_info, [], draw_overlays=True)
            ret, buffer = cv2.imencode('.jpg', frame)

        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(comparison_mode=False), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed_comparison')
def video_feed_comparison():
    return Response(generate_frames(comparison_mode=True), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files: 
        return jsonify({"error": "No processing asset parsed"}), 400
    
    file = request.files['file']
    filename = file.filename
    path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(path)
    
    print(f"⚡ [CORE DISPATCHER] Actively processing target: {filename}")
    
    counts = {k.lower(): 0 for k in CLASS_NAMES.values()}
    counts["total"] = 0
    acc_info = {"detected": False, "severity": "None", "confidence": 0.0}
    risks = []
    
    ext = filename.split('.')[-1].lower()
    out_name = f"proc_{filename}"
    out_path = os.path.join(RESULTS_FOLDER, out_name)

    if ext in ['jpg', 'jpeg', 'png', 'webp']:
        frame = cv2.imread(path)
        process_frame(frame, counts, acc_info, risks, draw_overlays=True)
        cv2.imwrite(out_path, frame)
    else:
        cap = cv2.VideoCapture(path)
        w, h = int(cap.get(3)), int(cap.get(4))
        fps = int(cap.get(cv2.CAP_PROP_FPS)) or 30
        out = cv2.VideoWriter(out_path, cv2.VideoWriter_fourcc(*'avc1'), fps, (w, h))
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret: 
                break
            process_frame(frame, counts, acc_info, risks, draw_overlays=True)
            out.write(frame)
        cap.release()
        out.release()

    counts["total"] = sum(v for k, v in counts.items() if k != "total")
    density = "High Grid" if counts["total"] > 15 else ("Moderate Volume" if counts["total"] > 5 else "Fluid/Low Stream")
    
    if acc_info["detected"]:
        risks.insert(0, f"CRASH SENSOR EXCEEDED: {acc_info['severity'].upper()}")

    graph_filename = generate_analytics_chart(counts, acc_info)

    return jsonify({
        "message": "Analysis Completed Safely",
        "counts": counts,
        "density": density,
        "accident": acc_info,
        "riskEvents": list(set(risks)),
        "processedPath": out_name,
        "graphPath": graph_filename,
        "fileType": "video" if ext in ['mp4', 'avi', 'mov'] else "image"
    })

@app.route('/results/<filename>')
def serve_result(filename):
    return send_from_directory(RESULTS_FOLDER, filename)

if __name__ == '__main__':
    app.run(port=5000, debug=True, threaded=True)
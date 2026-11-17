🚦 Traffic Intelligence System V2.0

An advanced, full-stack computer vision application designed to monitor traffic, detect vehicles, and generate actionable analytics. This project integrates a powerful Python-based AI engine using YOLOv8 with a modern web ecosystem to provide a seamless user interface for traffic data visualization.

🚀 Key Features

🧠 AI Object Detection: Utilizes PyTorch and YOLOv8 custom-trained weights (best.pt) to accurately detect and track vehicles in traffic footage.

📊 Analytics Generation: Processes detection data to generate insightful analytics and visual reports (graphs, charts).

🌐 Full-Stack Architecture: Decoupled microservice architecture featuring a Python AI engine, a Node.js backend API, and a React frontend.

📈 Data Visualization: Interactive dashboard to view processed results, bounding boxes, and traffic flow metrics.

🛠️ Tech Stack

AI Engine (Computer Vision):

Python 3

PyTorch

Ultralytics (YOLOv8)

OpenCV & Matplotlib (Data Visualization)

Frontend (Client):

React.js (Vite)

Tailwind CSS / Standard CSS

Backend (API):

Node.js

Express.js

💻 Installation & Setup

Because this project utilizes a microservice architecture, you will need to run the AI engine, Backend, and Frontend separately.

1. Clone the repository

git clone https://github.com/Yaqoob-Samoon/traffic-monitor-v2.git
cd traffic-monitor-v2


2. Setup AI Engine (Python)

Ensure you have Python installed, then open a terminal in the traffic-ai folder:

cd traffic-ai
# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the AI server/script
python app.py


3. Setup Backend (Node.js)

Open a new terminal in the traffic-backend folder:

cd traffic-backend
npm install
npm start


4. Setup Frontend (React)

Open a third terminal in the traffic-monitor folder:

cd traffic-monitor
npm install
npm run dev


(Note: Depending on your specific file sizes, you may need to download the .pt YOLO model weights separately if they were excluded via .gitignore to comply with GitHub's file size limits.)

👨‍💻 Author

Yaqoob Samoon

Role: MERN Stack & AI Developer

LinkedIn: linkedin.com/in/yaqoob-samoon

GitHub: github.com/Yaqoob-Samoon


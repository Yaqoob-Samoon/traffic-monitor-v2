const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// Function to call Python YOLOv8 API
const processWithYOLO = async (filePath, fileType) => {
  try {
    // Ensure this matches your Python Port (5000)
// Add "/detect" at the end
const pythonServiceUrl = process.env.PYTHON_AI_URL ? `${process.env.PYTHON_AI_URL}/detect` : 'http://localhost:5000/detect';
    
    // Prepare form data to send file to Python
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));
    form.append('type', fileType); 

    console.log(`📡 Sending ${fileType} to Python Service at ${pythonServiceUrl}...`);

    const response = await axios.post(pythonServiceUrl, form, {
      headers: { ...form.getHeaders() },
      timeout: 60000 // 60s timeout for huge files
    });

    // ✅ SUCCESS: Return the exact data from Python
    return response.data; 

  } catch (error) {
    console.error("⚠️ AI Service Error:", error.message);
    
    // ⚠️ FALLBACK: Return SAFE dummy data so the Controller doesn't crash
    // This matches the structure expected by your new Controller & Model
    return {
        counts: { 
            car: 0, 
            truck: 0, 
            bike: 0, 
            bus: 0, 
            person: 0, 
            total: 0 
        },
        density: "Unknown",
        // Crucial: Add 'accident' so controller doesn't break
        accident: { 
            detected: false, 
            severity: "None", 
            confidence: 0 
        },
        riskEvents: ["AI Service Offline - Check Python Console"],
        processedPath: null 
    };
  }
};

module.exports = { processWithYOLO };
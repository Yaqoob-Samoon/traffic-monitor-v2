const TrafficData = require('../models/TrafficData');
const { processWithYOLO } = require('../services/aiService');

// @desc    Upload Image/Video for Processing
// @route   POST /api/upload
exports.uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileType = req.file.mimetype.startsWith('image') ? 'image' : 'video';
    
    // 1. Create DB Record
    const newRecord = await TrafficData.create({
      filename: req.file.filename,
      originalPath: req.file.path,
      fileType: fileType,
      status: 'processing'
    });

    // 2. Call Python AI Service
    const aiResult = await processWithYOLO(req.file.path, fileType);
    console.log("AI Response:", aiResult); 

    // 3. Update DB with AI Results
    
    // Convert Python counts object to Mongoose Map
    const distributionMap = new Map();
    if (aiResult.counts) {
        Object.keys(aiResult.counts).forEach(key => {
            if (key !== 'total') {
                distributionMap.set(key, aiResult.counts[key]);
            }
        });
    }

    newRecord.stats = {
      totalVehicles: aiResult.counts.total || 0,
      trafficDensity: aiResult.density || "Low",
      vehicleDistribution: distributionMap
    };

    if (aiResult.accident) {
      newRecord.accident = {
        isDetected: aiResult.accident.detected,
        severity: aiResult.accident.severity,
        confidence: aiResult.accident.confidence
      };
    }

    if (aiResult.riskEvents && Array.isArray(aiResult.riskEvents)) {
      newRecord.riskEvents = aiResult.riskEvents.map(event => ({
        details: event
      }));
    }

    if (aiResult.processedPath) {
      newRecord.processedPath = `http://localhost:5000/results/${aiResult.processedPath}`;
    }

    newRecord.status = 'processed';
    await newRecord.save();

    res.status(200).json({
      success: true,
      data: newRecord
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during processing' });
  }
};

// Keep existing exports for analytics/history
exports.getAnalytics = async (req, res) => { /* existing code */ };
exports.getHistory = async (req, res) => { /* existing code */ };
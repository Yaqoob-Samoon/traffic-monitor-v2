const mongoose = require('mongoose');

const TrafficDataSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalPath: { type: String, required: true },
  processedPath: { type: String }, 
  fileType: { type: String, enum: ['image', 'video'], required: true },
  uploadDate: { type: Date, default: Date.now },
  
  // STATS: Using Map for flexibility (Rickshaw, Cow, Dog, etc.)
  stats: {
    totalVehicles: { type: Number, default: 0 },
    trafficDensity: { type: String, default: 'Low' },
    // This allows storing any key-value pair Python sends
    vehicleDistribution: {
      type: Map,
      of: Number, 
      default: {} 
    }
  },

  // ACCIDENT DATA
  accident: {
    isDetected: { type: Boolean, default: false },
    severity: { type: String, default: "None" }, 
    confidence: { type: Number, default: 0 }
  },

  // RISK EVENTS
  riskEvents: [{
    details: String
  }],
  
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('TrafficData', TrafficDataSchema);
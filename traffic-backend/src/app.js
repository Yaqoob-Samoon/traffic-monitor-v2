const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const trafficRoutes = require('./routes/trafficRoutes');
const fs = require('fs'); // <--- ADD THIS LINE



// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow frontend access
app.use(express.json());
app.use(morgan('dev')); // Logger

// Static Folders (to serve images/videos to frontend)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/processed', express.static(path.join(__dirname, '../processed')));


// API A: Get Images for "Verification Gallery" (SORTED BY DATE)
app.get('/api/proofs', (req, res) => {
    const folderPath = path.join(__dirname, '../../traffic-ai/results');

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error("Scanning Error:", err);
            return res.json([]);
        }

        // 1. Filter: Only 'proc_' or 'proof_' images
        const imageFiles = files.filter(file => 
            (file.startsWith('proc_') || file.startsWith('proof_')) &&
            (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg'))
        );

        // 2. Sort: Get the creation time of each file and sort Newest -> Oldest
        const sortedFiles = imageFiles
            .map(fileName => ({
                name: fileName,
                time: fs.statSync(path.join(folderPath, fileName)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time) // b - a means Newest First
            .map(file => file.name);

        res.json(sortedFiles);
    });
});

// API B: Get Graphs for "Intelligence Dashboard"
app.get('/api/charts', (req, res) => {
    // Look inside 'results' folder
    const folderPath = path.join(__dirname, '../../traffic-ai/results');

    fs.readdir(folderPath, (err, files) => {
        if (err) return res.json([]);

        // Filter: Only 'analytics_' PNG charts
        const charts = files.filter(file => 
            file.startsWith('analytics_') && file.endsWith('.png')
        );

        res.json(charts.reverse());
    });
});


// ============================================
// 1. STATIC FILE SERVERS (The "Doors")
// ============================================

// DOOR A: For the Gallery (Direct access to results)
// Usage: http://localhost:4000/proofs/proc_car.jpg
app.use('/proofs', express.static(path.join(__dirname, '../../traffic-ai/results')));

// DOOR B: For the Charts & General Data (Access to root folder)
// Usage: http://localhost:4000/ai-data/results/analytics_123.png
app.use('/ai-data', express.static(path.join(__dirname, '../../traffic-ai')));

// Routes
app.use('/api', trafficRoutes);

module.exports = app;
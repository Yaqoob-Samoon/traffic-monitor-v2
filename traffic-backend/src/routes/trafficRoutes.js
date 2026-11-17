const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadMedia, getAnalytics, getHistory } = require('../controllers/trafficController');

// Define Routes
router.post('/upload', upload.single('file'), uploadMedia); // Accepts key "file"
router.get('/analytics', getAnalytics);
router.get('/history', getHistory);

router.get('/proofs', (req, res) => {
  const directoryPath = path.join(__dirname, '../../traffic-ai/visual_proof');
  fs.readdir(directoryPath, (err, files) => {
    if (err) return res.status(500).send('Unable to scan directory');
    // Filter only images
    const images = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
    res.json(images);
  });
});

module.exports = router;
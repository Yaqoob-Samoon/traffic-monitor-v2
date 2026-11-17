require('dotenv').config();
const app = require('./src/app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Node.js Backend running on http://localhost:${PORT}`);
  console.log(`📂 Serving files from /uploads and /processed`);
});
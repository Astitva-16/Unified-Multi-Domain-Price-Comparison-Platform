const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const searchRoutes = require('./routes/search');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const distPath = path.join(__dirname, '../frontend/price-prism/dist');
const hasFrontendBuild = fs.existsSync(distPath);

app.use(cors());  // Allows cross-origin requests from frontend
app.use(express.json());  // Parses JSON bodies

app.use('/api', searchRoutes);

if (hasFrontendBuild) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'MOL BHAO Backend API running' });
  });
}


app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Search API: http://localhost:${PORT}/api/search?query=laptop`);
});

module.exports = app;
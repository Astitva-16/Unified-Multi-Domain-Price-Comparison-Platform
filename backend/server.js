const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const searchRoutes = require('./routes/search');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());  // Allows cross-origin requests from frontend
app.use(express.json());  // Parses JSON bodies

let supabase = null;
const hasValidSupabase = 
  process.env.SUPABASE_URL && 
  process.env.SUPABASE_ANON_KEY &&
  process.env.SUPABASE_URL.startsWith('http');

if (hasValidSupabase) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  console.log('✓ Supabase connected');
} else {
  console.log('⚠ Supabase not configured. Using mock data for MVP.');
}

app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

app.use('/api', searchRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MOL BHAO Backend API running' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Search API: http://localhost:${PORT}/api/search?query=laptop`);
});

module.exports = app;
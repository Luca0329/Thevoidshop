const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*'
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mystical status endpoint
app.get('/mystical-status', (req, res) => {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const constellationIndex = Math.floor((dayOfYear / 2.5) % 12);
  const constellations = ['Capricorn ♑', 'Aquarius ♒', 'Pisces ♓', 'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋', 'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐'];
  
  // Calculate moon phase
  const fullMoonCycle = 29.53059 * 24 * 60 * 60 * 1000;
  const referenceNewMoon = new Date('2024-01-11T11:57:00Z');
  const timeSinceReference = now.getTime() - referenceNewMoon.getTime();
  const cyclePosition = (timeSinceReference % fullMoonCycle) / fullMoonCycle;
  
  let currentPhase;
  if (cyclePosition < 0.125) currentPhase = 'new-moon';
  else if (cyclePosition < 0.375) currentPhase = 'waxing-crescent';
  else if (cyclePosition < 0.625) currentPhase = 'full-moon';
  else currentPhase = 'waning-crescent';
  
  res.json({
    currentMoonPhase: currentPhase,
    mysticalEnergy: constellations[constellationIndex],
    status: 'channeling cosmic energies',
    timestamp: now.toISOString(),
    voidLevel: Math.floor(Math.random() * 100) + 1
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌙 Mystical backend running on port ${PORT}`);
});
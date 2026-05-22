require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5555;

// Initialize Firebase Admin if serviceAccountKey.json exists
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json';
if (fs.existsSync(serviceAccountPath)) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin SDK initialized successfully.');
  } catch (err) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', err.message);
  }
} else {
  console.warn('⚠️  serviceAccountKey.json not found. Firebase features will be disabled.');
}

// Enable CORS for all routes (allows Flutter web/app to access it)
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Target API URL
const TARGET_API_URL = process.env.TARGET_API_URL || 'https://www.gfiotsolutions.com/api/sensordata';

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Ricemill Server is running' });
});

// Proxy endpoint for sensor data
app.get('/api/sensordata', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Fetching data from external API...`);
    
    const response = await axios.get(TARGET_API_URL);
    
    // Return the exact data structure to the client
    res.status(200).json(response.data);
    
    console.log(`[${new Date().toISOString()}] Successfully fetched and served data.`);
  } catch (error) {
    console.error('Error fetching sensor data:', error.message);
    
    res.status(500).json({
      error: 'Failed to fetch sensor data',
      details: error.message
    });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(`🚀 Ricemill Server running on port ${PORT}`);
  console.log(`➡️  Health Check: http://localhost:${PORT}/health`);
  console.log(`➡️  Sensor Data:  http://localhost:${PORT}/api/sensordata`);
  console.log(`========================================`);
});

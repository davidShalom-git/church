const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const eventRouter = require('./router/EventRouter.js');
const tamilRouter = require('./router/TamilRouter.js');
const englishRouter = require('./router/EnglishRoute.js');
const audioRouter = require('./router/AudioRoute.js');

const app = express();

// Verify MongoDB URL
if (!process.env.MONGODB_URL) {
  console.error('MONGODB_URL environment variable is not set!');
  process.exit(1);
}

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Create upload directories
const baseUploadPath = process.env.NODE_ENV === 'production'
  ? '/tmp'
  : path.join(__dirname, 'uploads');
const uploadDirs = ['general', 'tamil', 'english', 'audio'].map((dir) =>
  path.join(baseUploadPath, dir)
);

uploadDirs.forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
    // Verify writability
    const testFile = path.join(dir, '.testwrite');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log(`Directory ${dir} is writable`);
  } catch (error) {
    console.error(`Error creating or verifying directory ${dir}:`, error);
  }
});

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4000',
      'http://localhost:4100',
      'http://localhost:1000',
      'https://www.revivalprayerhouse.online',
      'https://church-data-56lv.vercel.app',
      'https://church-76ju.vercel.app',
      'https://church-data-age.vercel.app'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Origin', 
    'X-Requested-With', 
    'Accept',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  credentials: false,
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Apply CORS globally - must be before routes
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  console.log('Preflight request from:', req.headers.origin);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,X-Requested-With,Accept');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  res.sendStatus(200);
});

// Debug middleware - place after CORS
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  
  // Add CORS headers manually as backup
  if (req.headers.origin) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4000', 
      'http://localhost:4100',
      'http://localhost:1000',
      'https://www.revivalprayerhouse.online',
      'https://church-data-56lv.vercel.app',
      'https://church-76ju.vercel.app',
      'https://church-data-age.vercel.app'
    ];
    
    if (allowedOrigins.includes(req.headers.origin)) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Origin,X-Requested-With,Accept');
    }
  }
  
  next();
});

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes - Use distinct paths to avoid conflicts
app.use('/api/church', eventRouter);
app.use('/api/church', tamilRouter);
app.use('/api/church', englishRouter);
app.use('/api/audio', audioRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    endpoints: {
      church: '/api/church',
      audio: '/api/audio'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    url: req.originalUrl,
    availableRoutes: [
      'GET /health',
      'POST /api/audio/upload',
      'GET /api/audio',
      'GET /api/audio/:id',
      'DELETE /api/audio/:id'
    ]
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    origin: req.headers.origin
  });
  
  // Ensure CORS headers are set even on errors
  if (req.headers.origin) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:4000',
      'http://localhost:4100', 
      'http://localhost:1000',
      'https://www.revivalprayerhouse.online',
      'https://church-data-56lv.vercel.app',
      'https://church-76ju.vercel.app',
      'https://church-data-age.vercel.app'
    ];
    
    if (allowedOrigins.includes(req.headers.origin)) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
  }
  
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('CORS enabled for origins:', [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:4100',
    'http://localhost:1000',
    'https://www.revivalprayerhouse.online',
    'https://church-data-56lv.vercel.app',
    'https://church-76ju.vercel.app',
    'https://church-data-age.vercel.app'
  ]);
  console.log('Available endpoints:');
  console.log('  - Audio API: /api/audio');
  console.log('  - Church API: /api/church');
  console.log('  - Health check: /health');
});
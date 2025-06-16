const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const eventRouter = require('./router/EventRouter.js');
const tamilRouter = require('./router/TamilRouter.js');
const englishRouter = require('./router/EnglishRoute.js');

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
  : path.join(__dirname, 'Uploads');
const uploadDirs = ['general', 'tamil', 'english'].map((dir) =>
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

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:4000',
    'http://localhost:4100',
    'http://localhost:1000',
    'https://www.revivalprayerhouse.online',
    'https://church-data-56lv.vercel.app',
    'https://church-76ju.vercel.app',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  credentials: false, // Set to true if cookies/auth are needed
  optionsSuccessStatus: 200,
};

// Apply CORS globally
app.use(cors(corsOptions));

// Explicit OPTIONS handling
app.options('*', cors(corsOptions));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  res.on('finish', () => {
    console.log(`Response Headers for ${req.url}:`, res.getHeaders());
  });
  next();
});

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes - Use distinct paths to avoid conflicts
app.use('/api/church/event', eventRouter);
app.use('/api/church/tamil', tamilRouter);
app.use('/api/church/english', englishRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS enabled for origins:', corsOptions.origin);
});
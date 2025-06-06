const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./router/User');
const images = require('./router/Route')
const eng = require('./router/EnglishRouter')
const tam = require('./router/TamilRouter');
const path = require('path');

const app = express();  

// Allowed frontend domains

// Update the allowedOrigins array and CORS configuration

const allowedOrigins = [
    'https://church-grace.vercel.app',
    'https://church-data-56lv.vercel.app',
    'https://church-data.vercel.app',
    'https://church-fire.vercel.app',
    'https://www.revivalprayerhouse.online',
    'http://localhost:4000',
    'http://localhost:1200',
    'http://localhost:1000',
    'http://localhost:2000'
];

// Update CORS configuration
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Add headers middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Remove this line since we have CORS configured above
// app.options('*', cors());

// Handle CORS preflight requests


// Middleware
app.use(bodyParser.json());

// Enhanced debugging middleware
app.use((req, res, next) => {
    console.log(`🔍 ${req.method} ${req.path}`);
    console.log(`📍 Origin: ${req.headers.origin}`);
    console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
    console.log('---');
    next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
    console.log('🧪 Test endpoint hit!');
    res.json({ 
        message: 'Server is working!',
        timestamp: new Date().toISOString(),
        origin: req.headers.origin,
        method: req.method,
        path: req.path
    });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB Connected");
}).catch((error) => {
    console.log("❌ MongoDB Connection Error:", error);
});

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/uploads_English', express.static(path.join(__dirname, 'uploads_English')))
app.use('/uploads_Tamil', express.static(path.join(__dirname, 'uploads_Tamil')))

// Routes
console.log('🛣️  Setting up routes...');
app.use('/api/auth', auth);
app.use('/api/image', images);
app.use('/api/image', eng);
app.use('/api/image', tam);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        error: 'API route not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Church Backend API',
        version: '1.0.0',
        endpoints: [
            'GET /api/test',
            'POST /api/auth/*',
            'POST /api/image/*'
        ]
    });
});

// Start Server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 MongoDB: ${process.env.MONGODB_URL ? 'Configured' : 'Missing'}`);
});
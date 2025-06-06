const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import routes
const auth = require('./router/User');
const images = require('./router/Route');
const eng = require('./router/EnglishRouter');
const tam = require('./router/TamilRouter');

const app = express();

// Allowed origins for CORS
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

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(bodyParser.json());

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl} - Origin: ${req.headers.origin}`);
    next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ MongoDB connected");
}).catch((err) => {
    console.error("❌ MongoDB connection error:", err);
});

// Static file routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads_English', express.static(path.join(__dirname, 'uploads_English')));
app.use('/uploads_Tamil', express.static(path.join(__dirname, 'uploads_Tamil')));

// API routes
app.use('/api/auth', auth);
app.use('/api/image', images);
app.use('/api/image', eng);
app.use('/api/image', tam);

// Default route
app.get('/', (req, res) => {
    res.json({
        message: '🕊️ Church Backend API Running',
        status: 'OK',
        version: '1.0.0'
    });
});

// Start server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

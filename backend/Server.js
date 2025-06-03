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
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            console.log('Blocked origin:', origin);
            return callback(new Error('CORS not allowed'));
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // Cache CORS preflight response for 24 hours
}));


// Handle CORS preflight requests
app.options('*', cors());

// Middleware
app.use(bodyParser.json());

// Debugging: Log incoming request origins
app.use((req, res, next) => {
    console.log("Request Origin:", req.headers.origin);
    next();
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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/uploads_English', express.static(path.join(__dirname, 'uploads_English')))
app.use('/uploads_Tamil', express.static(path.join(__dirname, 'uploads_Tamil')))


// Routes
app.use('/api/auth', auth);
app.use('/api/image', images)
app.use('/api/image', eng)
app.use('/api/image', tam)


// Start Server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

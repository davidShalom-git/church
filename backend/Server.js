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
    'https://church-rosy-rho.vercel.app',
    'http://localhost:4000',
    'https://www.revivalprayerhouse.online',
    'https://revivalprayerhouse.netlify.app',
    'http://localhost:1200',
    'http://localhost:1000',
    'http://localhost:2000',
    'https://church-ten-silk.vercel.app',
    'https://church-fire.vercel.app',
    'https://church-data-56lv.vercel.app'
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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
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

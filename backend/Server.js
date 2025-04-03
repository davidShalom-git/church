const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const auth = require('./router/User');

const app = express();  

// Allowed frontend domains
const allowedOrigins = [
    'https://church-grace.vercel.app',
    'https://church-rosy-rho.vercel.app'
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

// Routes
app.use('/api/auth', auth);

// Start Server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

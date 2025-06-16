const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()
const event = require('./router/EventRouter.js')
const Tamil = require('./router/TamilRouter.js')
const English = require('./router/EnglishRoute.js')
const fs = require('fs')
const cors = require('cors')

// Verify MongoDB URL
if (!process.env.MONGODB_URL) {
    console.error('MONGODB_URL environment variable is not set!')
    process.exit(1)
}

// MongoDB connection with enhanced error handling
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log('Connected to MongoDB successfully')
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1) // Exit the process if connection fails
})

// Use /tmp for uploads in production (Vercel), local directory in development
const baseUploadPath = process.env.NODE_ENV === 'production' ? '/tmp' : path.join(__dirname, 'uploads')
const uploadDirs = ['general', 'tamil', 'english'].map(dir => path.join(baseUploadPath, dir))

// Create upload directories
uploadDirs.forEach(dir => {
    try {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
            console.log(`Created directory: ${dir}`)
        }
    } catch (error) {
        console.error(`Error creating directory ${dir}:`, error)
        // Don't exit process, just log the error
    }
})

// CORS configuration - FIXED
const corsOptions = {
    origin: [
        'https://www.revivalprayerhouse.online',
        'http://localhost:4000',
        'http://localhost:4100', // Changed from https to http for localhost
        'http://localhost:1000', // Changed from https to http for localhost
        'https://church-data-56lv.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
    optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions))

// Add explicit OPTIONS handling for preflight requests
app.options('*', cors(corsOptions))

// Middleware setup
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Add logging middleware to debug CORS issues
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    console.log('Origin:', req.headers.origin)
    next()
})

// Routes
app.use('/api/church', event)
app.use('/api/church', Tamil)
app.use('/api/church', English)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({ error: 'Internal Server Error' })
})

const PORT = process.env.PORT || 4100
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log('CORS enabled for origins:', corsOptions.origin)
})
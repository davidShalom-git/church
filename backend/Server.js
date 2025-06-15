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

// CORS and middleware setup
app.use(cors({
  origin: ['http://localhost:3000', 'https://www.revivalprayerhouse.online','http://localhost:4000','https://localhost:4100', 'https://church-data-56lv.vercel.app',

  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// Routes
app.use('/api/church', event)
app.use('/api/church', Tamil)
app.use('/api/church', English)

const PORT = process.env.PORT || 4100
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
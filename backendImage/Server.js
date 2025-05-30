const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()
const images = require('./Routes/Route')
const eng = require('./Routes/EnglishRouter')
const tam = require('./Routes/TamilRouter')

const app = express()

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:1200', 'https://www.revivalprayerhouse.online','http://localhost:4000','http://localhost:1000','https://church-ten-silk.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/uploads_English', express.static(path.join(__dirname, 'uploads_English')))
app.use('/uploads_Tamil', express.static(path.join(__dirname, 'uploads_Tamil')))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('MongoDB Connected Successfully')
    })
    .catch((error) => {
        console.error('MongoDB Connection Error:', error)
        process.exit(1) // Exit if database connection fails
    })

// Routes
app.use('/api/image', images)
app.use('/api/image', eng)
app.use('/api/image', tam)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    })
})

// Start server
const PORT = process.env.PORT || 1200
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
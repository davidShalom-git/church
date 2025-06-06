const express = require('express');
const multer = require('multer');
const path = require('path');
const TamilModel = require('../models/Tamil');
const router = express.Router();

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Use memory storage for Vercel compatibility
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        try {
            const allowedTypes = /jpeg|jpg|png|gif/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (extname && mimetype) {
                return cb(null, true);
            }
            cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed!'));
        } catch (error) {
            cb(error);
        }
    }
}).single('image');

// Upload route - Modified for Vercel
router.post('/upload/tam', (req, res) => {
    console.log('🔥 Tamil upload endpoint hit!'); // Debug log
    
    upload(req, res, async function(err) {
        try {
            console.log('📤 Processing upload...'); // Debug log
            
            if (err instanceof multer.MulterError) {
                console.error('❌ Multer error:', err);
                return res.status(400).json({
                    success: false,
                    message: "Multer error",
                    error: err.message
                });
            } else if (err) {
                console.error('❌ Upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: "Error uploading file",
                    error: err.message
                });
            }

            if (!req.file) {
                console.log('❌ No file provided');
                return res.status(400).json({ 
                    success: false, 
                    message: "Please upload an image" 
                });
            }

            console.log('✅ File received:', req.file.originalname);

            // For Vercel: Store file buffer as base64 in database
            // or upload to cloud storage (Cloudinary, AWS S3, etc.)
            const fileData = {
                buffer: req.file.buffer.toString('base64'),
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size
            };

            const newImage = await TamilModel.create({
                image: fileData.buffer, // Store base64 data
                fileName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                uploadDate: new Date()
            });

            console.log('✅ Image saved to database');

            res.status(201).json({
                success: true,
                message: "Image uploaded successfully",
                data: {
                    id: newImage._id,
                    fileName: newImage.fileName,
                    mimeType: newImage.mimeType,
                    size: newImage.size,
                    uploadDate: newImage.uploadDate
                }
            });
        } catch (error) {
            console.error('❌ Server error:', error);
            res.status(500).json({
                success: false,
                message: "Error uploading image",
                error: error.message
            });
        }
    });
});

// Get all images route
router.get('/tam', async (req, res) => {
    try {
        console.log('📋 Fetching Tamil images...');
        const images = await TamilModel.find({}).select('-image'); // Exclude base64 data for list view
        
        res.status(200).json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        console.error('❌ Error fetching images:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching images",
            error: error.message
        });
    }
});

// Get single image by ID (including image data)
router.get('/tam/:id', async (req, res) => {
    try {
        console.log('🖼️  Fetching image:', req.params.id);
        const image = await TamilModel.findById(req.params.id);
        
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }
        
        res.status(200).json({
            success: true,
            data: image
        });
    } catch (error) {
        console.error('❌ Error fetching image:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching image",
            error: error.message
        });
    }
});

// Serve image route (convert base64 back to image)
router.get('/tam/serve/:id', async (req, res) => {
    try {
        const image = await TamilModel.findById(req.params.id);
        
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            });
        }

        // Convert base64 back to buffer and serve as image
        const imageBuffer = Buffer.from(image.image, 'base64');
        
        res.set({
            'Content-Type': image.mimeType,
            'Content-Length': imageBuffer.length,
            'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
        });
        
        res.send(imageBuffer);
    } catch (error) {
        console.error('❌ Error serving image:', error);
        res.status(500).json({
            success: false,
            message: "Error serving image",
            error: error.message
        });
    }
});

module.exports = router;
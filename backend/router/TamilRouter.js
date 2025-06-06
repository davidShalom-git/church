const express = require('express');
const multer = require('multer');
const path = require('path');
const TamilModel = require('../models/Tamil');
const router = express.Router();

// DO NOT set CORS headers here manually — let the main app handle it

// Memory storage for Vercel compatibility
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
}).single('image');

// Upload endpoint
router.post('/upload/tam', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: 'Upload error',
                error: err.message
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        try {
            const fileData = {
                buffer: req.file.buffer.toString('base64'),
                originalName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size
            };

            const newImage = await TamilModel.create({
                image: fileData.buffer,
                fileName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
                uploadDate: new Date()
            });

            res.status(201).json({
                success: true,
                message: 'Image uploaded',
                data: {
                    id: newImage._id,
                    fileName: newImage.fileName,
                    mimeType: newImage.mimeType,
                    size: newImage.size
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    });
});

// Get all image metadata
router.get('/tam', async (req, res) => {
    try {
        const images = await TamilModel.find({}).select('-image');
        res.status(200).json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching images',
            error: error.message
        });
    }
});

// Get full image by ID
router.get('/tam/:id', async (req, res) => {
    try {
        const image = await TamilModel.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }
        res.status(200).json({ success: true, data: image });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching image',
            error: error.message
        });
    }
});

// Serve image
router.get('/tam/serve/:id', async (req, res) => {
    try {
        const image = await TamilModel.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        const imageBuffer = Buffer.from(image.image, 'base64');
        res.set({
            'Content-Type': image.mimeType,
            'Content-Length': imageBuffer.length,
            'Cache-Control': 'public, max-age=31536000'
        });

        res.send(imageBuffer);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error serving image',
            error: error.message
        });
    }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const ImageModel = require('../models/models');
const fs = require('fs');
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

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});




const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

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

// Upload route
// filepath: c:\Users\david\OneDrive\Desktop\NS-Web\backend\router\Route.js
router.post('/upload', (req, res) => {
    upload(req, res, async function(err) {
        try {
            if (err instanceof multer.MulterError) {
                console.error('Multer error:', err);
                return res.status(400).json({
                    success: false,
                    message: "Multer error",
                    error: err.message
                });
            } else if (err) {
                console.error('Upload error:', err);
                return res.status(400).json({
                    success: false,
                    message: "Error uploading file",
                    error: err.message
                });
            }

            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    message: "Please upload an image" 
                });
            }

            const filePath = path.join('uploads', req.file.filename);

            const newImage = await ImageModel.create({
                image: filePath,
                fileName: req.file.originalname,
                mimeType: req.file.mimetype
            });

            res.status(201).json({
                success: true,
                message: "Image uploaded successfully",
                data: newImage
            });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({
                success: false,
                message: "Error uploading image",
                error: error.message
            });
        }
    });
});




// Get all images route
router.get('/images', async (req, res) => {
    try {
        const images = await ImageModel.find({});
        res.status(200).json({
            success: true,
            count: images.length,
            data: images
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching images",
            error: error.message
        });
    }
});

// Get single image by ID
router.get('/images/:id', async (req, res) => {
    try {
        const image = await ImageModel.findById(req.params.id);
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
        res.status(500).json({
            success: false,
            message: "Error fetching image",
            error: error.message
        });
    }
});

module.exports = router;
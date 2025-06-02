const express = require('express');
const multer = require('multer');
const path = require('path');
const ImageModel = require('../models/models');
const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Upload route
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "Please upload an image" 
            });
        }

        const newImage = await ImageModel.create({
            image: req.file.path,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype
        });

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: newImage
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error uploading image",
            error: error.message
        });
    }
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
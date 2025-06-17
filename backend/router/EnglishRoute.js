const express = require('express');
const multer = require('multer');
const path = require('path');
const English = require('../models/English.js');

const router = express.Router();

// Use memory storage - no file system involvement
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// POST /api/images/eng - Store image
router.post('/eng', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    
    // Convert buffer to base64
    const base64Data = file.buffer.toString('base64');

    const newImage = new English({
      name: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      base64Data: base64Data,
      uploadPath: `memory-${fileName}` // Placeholder path since it's required
    });

    const savedImage = await newImage.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: savedImage._id,
        name: savedImage.name,
        originalName: savedImage.originalName,
        mimeType: savedImage.mimeType,
        size: savedImage.size,
        uploadedAt: savedImage.uploadedAt
      }
    });
  } catch (error) {
    console.error('Error storing image:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to store image',
      error: error.message
    });
  }
});

// GET /api/images/eng - Get all images
router.get('/eng', async (req, res) => {
  try {
    const images = await English.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch images',
      error: error.message
    });
  }
});

// GET /api/images/eng/:id - Get single image
router.get('/eng/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await English.findById(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid image ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image',
      error: error.message
    });
  }
});

// GET /api/images/serve/:id - Serve image directly
router.get('/serve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await English.findById(id);
    
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }
    
    // Convert base64 back to buffer and serve
    const imageBuffer = Buffer.from(image.base64Data, 'base64');
    
    res.setHeader('Content-Type', image.mimeType);
    res.setHeader('Content-Length', imageBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.send(imageBuffer);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to serve image',
      error: error.message
    });
  }
});

module.exports = router;
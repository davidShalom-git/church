const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const English = require('../models/English');

const router = express.Router();

// Memory storage (no files saved to disk)
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Upload Route
router.post('/eng', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;

    // Generate hash from file buffer
    const fileHash = crypto.createHash('md5').update(file.buffer).digest('hex');

    // Check for duplicate image content
    const existingImage = await English.findOne({ base64Hash: fileHash });
    if (existingImage) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate image not allowed'
      });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);

    const base64Data = file.buffer.toString('base64');

    const newImage = new English({
      name: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      base64Data: base64Data,
      base64Hash: fileHash,
      uploadPath: `memory-${fileName}`
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
    console.error('Error uploading image:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});


// GET /api/english/event - Get all images
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

// GET /api/english/event/:id - Get single image
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

// GET /api/english/serve/:id - Serve image directly
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
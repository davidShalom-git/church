const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Event');

const router = express.Router();

// Set upload path based on environment
const baseUploadPath = process.env.NODE_ENV === 'production'
  ? '/tmp/general'
  : path.join(__dirname, '..', 'uploads', 'general');

// Ensure directory exists
if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, baseUploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/church/upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = path.join(baseUploadPath, req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    const newImage = new Image({
      name: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      base64Data,
      uploadPath: path.relative(path.join(__dirname, '..'), filePath)
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

    const faultyFilePath = path.join(baseUploadPath, req.file?.filename || '');
    if (fs.existsSync(faultyFilePath)) {
      fs.unlinkSync(faultyFilePath);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// GET /api/church/event — Fetch all images
router.get('/event', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
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

// GET /api/church/event/:id — Fetch single image by ID
router.get('/event/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);

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

module.exports = router;
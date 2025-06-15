const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TamilImage = require('../models/Tamil');

const router = express.Router();

// Dynamically decide upload directory
const baseUploadPath = process.env.NODE_ENV === 'production'
  ? '/tmp/tamil'
  : path.join(__dirname, '..', 'uploads', 'tamil');

// Ensure directory exists
if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, baseUploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'tamil-' + file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

// POST /api/church/tam — Upload Tamil image
router.post('/tam', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = path.join(baseUploadPath, req.file.filename);
    const base64Data = fs.readFileSync(filePath).toString('base64');

    const newTamilImage = new TamilImage({
      name: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      base64Data,
      uploadPath: path.relative(path.join(__dirname, '..'), filePath)
    });

    const savedImage = await newTamilImage.save();

    res.status(201).json({
      success: true,
      message: 'Tamil image uploaded successfully',
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
    console.error('Error storing Tamil image:', error);

    const failedPath = path.join(baseUploadPath, req.file?.filename || '');
    if (fs.existsSync(failedPath)) {
      fs.unlinkSync(failedPath);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to store Tamil image',
      error: error.message
    });
  }
});

// GET /api/church/tam — Fetch all Tamil images
router.get('/tam', async (req, res) => {
  try {
    const images = await TamilImage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Error fetching Tamil images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Tamil images',
      error: error.message
    });
  }
});

// GET /api/church/tam/:id — Fetch single Tamil image by ID
router.get('/tam/:id', async (req, res) => {
  try {
    const image = await TamilImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Tamil image not found'
      });
    }

    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error fetching Tamil image:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Tamil image ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch Tamil image',
      error: error.message
    });
  }
});

module.exports = router;
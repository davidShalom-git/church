const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const EnglishImage = require('../models/English');

const router = express.Router();

// Set upload path based on environment
const baseUploadPath = process.env.NODE_ENV === 'production'
  ? '/tmp/english'
  : path.join(__dirname, '..', 'uploads', 'english');

// Ensure the directory exists
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
    cb(null, 'english-' + file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// POST /api/church/eng — Upload English image
router.post('/eng', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = path.join(baseUploadPath, req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    const newEnglishImage = new EnglishImage({
      name: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      base64Data,
      uploadPath: path.relative(path.join(__dirname, '..'), filePath)
    });

    const savedImage = await newEnglishImage.save();

    res.status(201).json({
      success: true,
      message: 'English image uploaded successfully',
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
    console.error('Error storing English image:', error);

    const failedPath = path.join(baseUploadPath, req.file?.filename || '');
    if (fs.existsSync(failedPath)) {
      fs.unlinkSync(failedPath);
    }

    res.status(500).json({
      success: false,
      message: 'Failed to store English image',
      error: error.message
    });
  }
});

// GET /api/church/eng — Fetch all English images
router.get('/eng', async (req, res) => {
  try {
    const images = await EnglishImage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
  } catch (error) {
    console.error('Error fetching English images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch English images',
      error: error.message
    });
  }
});

// GET /api/church/eng/:id — Fetch single image by ID
router.get('/eng/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await EnglishImage.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'English image not found'
      });
    }

    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('Error fetching English image:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid English image ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch English image',
      error: error.message
    });
  }
});

module.exports = router;
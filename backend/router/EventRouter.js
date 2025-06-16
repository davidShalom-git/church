const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Event'); // Adjust path if needed

const router = express.Router();

// Set base upload path
const baseUploadPath = process.env.NODE_ENV === 'production'
  ? '/tmp/general'
  : path.join(__dirname, '..', 'uploads', 'general');

// Ensure directory exists
if (!fs.existsSync(baseUploadPath)) {
  fs.mkdirSync(baseUploadPath, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, baseUploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueName = `${base}-${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// POST /api/church/upload
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Use "image" field.'
      });
    }

    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const base64Data = buffer.toString('base64');

    const newImage = new Image({
      name: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      base64Data,
      uploadPath: path.relative(path.join(__dirname, '..'), filePath),
      category: req.body.category || 'general',
      description: req.body.description || req.file.originalname
    });

    const savedImage = await newImage.save();

    // Delete the file after saving
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully!',
      data: {
        id: savedImage._id,
        name: savedImage.name,
        mimeType: savedImage.mimeType,
        uploadedAt: savedImage.createdAt,
        category: savedImage.category,
        description: savedImage.description
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});

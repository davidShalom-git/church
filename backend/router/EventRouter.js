const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Event.js');

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

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

// POST /api/images/upload - Store image
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const file = req.file;
    const filePath = path.join(__dirname, '..', file.path);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    const newImage = new Image({
      name: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      base64Data: base64Data,
      uploadPath: file.path
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

    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to store image',
      error: error.message
    });
  }
});

router.get('/event',async (req,res)=> {
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
})

router.get('/event/:id', async (req,res)=> {
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
})


module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TamilImage = require('../models/Tamil.js');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/tamil/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'tamil-' + file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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
    fileSize: 10 * 1024 * 1024
  }
});

// POST /api/tamil-images/upload
router.post('/tam', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { tamilName } = req.body;

   

    const file = req.file;
    const filePath = path.join(__dirname, '..', file.path);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    const newTamilImage = new TamilImage({
      name: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      base64Data: base64Data,
      uploadPath: file.path
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

    if (req.file) {
      const filePath = path.join(__dirname, '..', req.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.status(500).json({
      success: false,
      message: 'Failed to store Tamil image',
      error: error.message
    });
  }
});

router.get('/tam',async(req,res)=> {
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
})

router.get('/tam/:id',async(req,res)=>{
    try {
    const { id } = req.params;
    
    const image = await TamilImage.findById(id);
    
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
})

module.exports = router;
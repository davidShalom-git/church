const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Image = require('../models/Event'); // Make sure this path is correct

const router = express.Router();

// Set upload path based on environment
const baseUploadPath = process.env.NODE_ENV === 'production'
  ? '/tmp/general'
  : path.join(__dirname, '..', 'uploads', 'general');

// Ensure directory exists
const createUploadDir = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  } catch (error) {
    console.error(`Error creating directory ${dir}:`, error);
  }
};

createUploadDir(baseUploadPath);

// Multer setup with better error handling
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure directory exists before each upload
    createUploadDir(baseUploadPath);
    cb(null, baseUploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const filename = `${baseName}-${uniqueSuffix}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    console.log('File filter check:', file.mimetype);
    
    // More comprehensive image type checking
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/svg+xml'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase()) || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Only image files are allowed!`), false);
    }
  },
  limits: { 
    fileSize: 50 * 1024 * 1024, // Increased to 50MB
    files: 1 // Only allow single file
  }
});

// Add middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 50MB.'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Only 1 file allowed.'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field. Use "image" as the field name.'
      });
    }
  }
  
  if (err.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

// POST /api/church/upload

// POST /api/church/upload
router.post('/upload', (req, res) => {
  console.log('Upload endpoint hit');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.get('Content-Type'));

  // Change from .single to .array
  upload.array('images', 10)(req, res, async (err) => {
    let uploadedFilePaths = [];

    try {
      if (err) {
        console.error('Multer error:', err);
        return handleMulterError(err, req, res, () => {
          return res.status(400).json({
            success: false,
            message: 'File upload error: ' + err.message
          });
        });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No files uploaded. Make sure to use "images" as the field name.'
        });
      }

      console.log('Uploaded files:', req.files);

      const savedImages = [];

      for (const file of req.files) {
        const filePath = file.path;
        uploadedFilePaths.push(filePath);

        if (!fs.existsSync(filePath)) {
          throw new Error(`Uploaded file not found on disk: ${filePath}`);
        }

        const fileBuffer = fs.readFileSync(filePath);
        const base64Data = fileBuffer.toString('base64');

        const imageData = {
          name: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          base64Data,
          uploadPath: path.relative(path.join(__dirname, '..'), filePath),
          category: req.body.category || 'general',
          description: req.body.description || file.originalname
        };

        const newImage = new Image(imageData);
        const savedImage = await newImage.save();
        savedImages.push({
          id: savedImage._id,
          name: savedImage.name,
          originalName: savedImage.originalName,
          mimeType: savedImage.mimeType,
          size: savedImage.size,
          uploadedAt: savedImage.createdAt,
          category: savedImage.category,
          description: savedImage.description
        });

        // Clean up file
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupErr) {
          console.warn(`Cleanup failed for ${filePath}:`, cleanupErr.message);
        }
      }

      return res.status(201).json({
        success: true,
        message: 'Images uploaded successfully',
        count: savedImages.length,
        data: savedImages
      });

    } catch (error) {
      console.error('Error uploading images:', error);

      // Cleanup in case of error
      for (const filePath of uploadedFilePaths) {
        try {
          if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }

      return res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  });
});


// Test endpoint to check if router is working
router.get('/upload/test', (req, res) => {
  res.json({
    success: true,
    message: 'Upload router is working',
    timestamp: new Date().toISOString(),
    uploadPath: baseUploadPath,
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET /api/church/event — Fetch all images
router.get('/event', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-base64Data'); // Exclude base64Data from list view for performance

    const total = await Image.countDocuments(query);

    res.status(200).json({
      success: true,
      count: images.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
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
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image ID format'
      });
    }

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
});

// DELETE /api/church/event/:id — Delete image by ID
router.delete('/event/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid image ID format'
      });
    }

    const image = await Image.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
      data: { id }
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid image ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
});

module.exports = router;
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
router.post('/upload', (req, res) => {
  console.log('Upload endpoint hit');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.get('Content-Type'));
  
  // Use upload middleware
  upload.single('image')(req, res, async (err) => {
    let uploadedFilePath = null;
    
    try {
      // Handle multer errors first
      if (err) {
        console.error('Multer error:', err);
        return handleMulterError(err, req, res, () => {
          return res.status(400).json({
            success: false,
            message: 'File upload error: ' + err.message
          });
        });
      }

      console.log('File info:', req.file);
      console.log('Body:', req.body);

      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded. Make sure to use "image" as the field name.' 
        });
      }

      uploadedFilePath = req.file.path;
      
      // Verify file exists
      if (!fs.existsSync(uploadedFilePath)) {
        throw new Error('Uploaded file not found on disk');
      }

      // Read file and convert to base64
      const fileBuffer = fs.readFileSync(uploadedFilePath);
      const base64Data = fileBuffer.toString('base64');

      // Create image document with all necessary fields
      const imageData = {
        name: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        base64Data: base64Data, // Store just the base64 string, not with data URL prefix
        uploadPath: path.relative(path.join(__dirname, '..'), uploadedFilePath),
        category: req.body.category || 'general',
        description: req.body.description || req.file.originalname
      };

      console.log('Attempting to save image data...');
      const newImage = new Image(imageData);
      const savedImage = await newImage.save();
      console.log('Image saved successfully:', savedImage._id);

      // Clean up physical file after saving to database
      try {
        if (fs.existsSync(uploadedFilePath)) {
          fs.unlinkSync(uploadedFilePath);
          console.log('Physical file cleaned up');
        }
      } catch (cleanupError) {
        console.warn('Warning: Could not clean up physical file:', cleanupError.message);
      }

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: {
          id: savedImage._id,
          name: savedImage.name,
          originalName: savedImage.originalName,
          mimeType: savedImage.mimeType,
          size: savedImage.size,
          uploadedAt: savedImage.createdAt,
          category: savedImage.category,
          description: savedImage.description
        }
      });

    } catch (error) {
      console.error('Error uploading image:', error);

      // Clean up uploaded file on error
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        try {
          fs.unlinkSync(uploadedFilePath);
          console.log('Cleaned up file after error');
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }

      // Handle specific MongoDB errors
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern || {})[0];
        return res.status(400).json({
          success: false,
          message: `Duplicate value for field: ${duplicateField}`,
          error: 'A record with this value already exists'
        });
      }

      // Handle validation errors
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationErrors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Failed to upload image',
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
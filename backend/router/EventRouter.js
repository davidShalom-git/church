const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Add CORS
const Image = require('../models/Image'); // Correct import

const router = express.Router();

// Enable CORS
router.use(cors({
  origin: ['http://localhost:3000', 'https://church-76ju.vercel.app','https://church-data-age.vercel.app','https://church-data-56lv.vercel.app'], // Adjust to your frontend origins
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Accept']
}));

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
    // Verify directory is writable
    const testFile = path.join(dir, '.testwrite');
    fs.writeFileSync(testFile, 'test');
    fs.unlinkSync(testFile);
    console.log(`Directory ${dir} is writable`);
  } catch (error) {
    console.error(`Error creating or verifying directory ${dir}:`, error);
    throw error;
  }
};

createUploadDir(baseUploadPath);

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    createUploadDir(baseUploadPath);
    cb(null, baseUploadPath);
  },
  filename: function (req, file, cb) {
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
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/bmp',
      'image/svg+xml'
    ];
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${file.mimetype}. Only image files are allowed!`), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB to match client
    files: 1
  }
});

// Multer error handler
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
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
router.post('/upload', upload.single('image'), async (req, res) => {
  console.log('Upload endpoint hit');
  console.log('Headers:', req.headers);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Body:', req.body);
  console.log('File:', req.file);

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Make sure to use "image" as the field name.'
      });
    }

    const filePath = req.file.path;
    if (!fs.existsSync(filePath)) {
      throw new Error(`Uploaded file not found on disk: ${filePath}`);
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    const imageData = {
      name: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      base64Data,
      uploadPath: path.relative(path.join(__dirname, '..'), filePath),
      category: req.body.category || 'general',
      description: req.body.description || req.file.originalname
    };

    const newImage = new Image(imageData);
    const savedImage = await newImage.save();

    // Clean up file
    try {
      fs.unlinkSync(filePath);
    } catch (cleanupErr) {
      console.warn(`Cleanup failed for ${filePath}:`, cleanupErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        id: savedImage._id,
        name: savedImage.name,
        originalName: savedImage.originalName,
        mimeType: savedImage.mimetype,
        size: savedImage.size,
        uploadedAt: savedImage.createdAt,
        category: savedImage.category,
        description: savedImage.description
      }
    });
  } catch (error) {
    console.error('Error uploading image:', {
      message: error.message,
      stack: error.stack,
      file: req.file,
      body: req.body
    });

    // Cleanup in case of error
    try {
      if (fs.existsSync(req.file?.path)) fs.unlinkSync(req.file.path);
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Test endpoint
router.get('/upload/test', (req, res) => {
  res.json({
    success: true,
    message: 'Upload router is working',
    timestamp: new Date().toISOString(),
    uploadPath: baseUploadPath,
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET /api/church/event
router.get('/event', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const skip = (page - 1) * limit;

    let query = {};
    if (category && category !== 'all') {
      query.category = category;
    }

    const images = await Image.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-base64Data');

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

// GET /api/church/event/:id
router.get('/event/:id', async (req, res) => {
  try {
    const { id } = req.params;
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

// DELETE /api/church/event/:id
router.delete('/event/:id', async (req, res) => {
  try {
    const { id } = req.params;
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
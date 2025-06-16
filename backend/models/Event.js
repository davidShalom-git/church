const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  originalName: {
    type: String,
    required: true,
    trim: true
  },
  mimeType: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^image\/(jpeg|jpg|png|gif|webp|bmp|svg\+xml)$/i.test(v);
      },
      message: 'Invalid mime type. Only image files are allowed.'
    }
  },
  size: {
    type: Number,
    required: true,
    min: [1, 'File size must be greater than 0'],
    max: [50 * 1024 * 1024, 'File size cannot exceed 50MB'] // 50MB limit
  },
  base64Data: {
    type: String,
    required: true
  },
  uploadPath: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general',
    enum: {
      values: ['general', 'tamil', 'english', 'event'],
      message: '{VALUE} is not a valid category'
    }
  },
  description: {
    type: String,
    default: '',
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Add indexes for better performance
ImageSchema.index({ createdAt: -1 });
ImageSchema.index({ category: 1 });
ImageSchema.index({ name: 1 }, { unique: false }); // Remove unique constraint if causing issues

// Add a method to get file URL
ImageSchema.methods.getFileUrl = function() {
  return `data:${this.mimeType};base64,${this.base64Data}`;
};

// Add a virtual for file info
ImageSchema.virtual('fileInfo').get(function() {
  return {
    name: this.name,
    originalName: this.originalName,
    size: this.size,
    mimeType: this.mimeType,
    category: this.category
  };
});

module.exports = mongoose.model('Image', ImageSchema);
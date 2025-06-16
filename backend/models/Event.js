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
    max: [5 * 1024 * 1024, 'File size cannot exceed 5MB'] // Align with client
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
  timestamps: true
});

// Add indexes for performance
ImageSchema.index({ createdAt: -1 });
ImageSchema.index({ category: 1 });
// Removed unique index on name to allow duplicates
ImageSchema.index({ name: 1 });

// Method to get file URL
ImageSchema.methods.getFileUrl = function() {
  return `data:${this.mimeType};base64,${this.base64Data}`;
};

// Virtual for file info
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
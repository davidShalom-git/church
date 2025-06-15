const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // This ensures each filename is unique
  },
  originalName: {
    type: String,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
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
    enum: ['general', 'tamil', 'english', 'event']
  },
  description: {
    type: String,
    default: ''
  },
  // Remove or fix the problematic 'image' field
  // If you need it, define it properly:
  // image: {
  //   type: String,
  //   sparse: true // This allows multiple null values
  // }
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

// Add indexes for better performance
imageSchema.index({ createdAt: -1 });
imageSchema.index({ category: 1 });
imageSchema.index({ name: 1 });

// If you had an 'image' field with unique constraint, remove it:
// imageSchema.index({ image: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Image', ImageSchema);
const mongoose = require('mongoose');

const EnglishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
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
    required: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
  // Removed the 'image' field since it's not used in the router
}, {
  timestamps: true, // This adds createdAt and updatedAt automatically
  collection: 'english' // Explicitly set collection name
});

// Ensure indexes are properly set
EnglishSchema.index({ name: 1 });
EnglishSchema.index({ uploadedAt: -1 });
EnglishSchema.index({ createdAt: -1 });

module.exports = mongoose.model('English', EnglishSchema);
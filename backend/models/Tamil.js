const mongoose = require('mongoose');

const TamilSchema = new mongoose.Schema({
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
  collection: 'tamil' // Explicitly set collection name
});

// Ensure indexes are properly set
TamilSchema.index({ name: 1 });
TamilSchema.index({ uploadedAt: -1 });
TamilSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Tamil', TamilSchema);
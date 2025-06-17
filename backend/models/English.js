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
    // Keep this optional for backward compatibility, but it's not used in memory storage
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
  // REMOVED: The problematic 'image' field that was causing file path issues
}, {
  timestamps: true,
  collection: 'english'
});

// Indexes for better query performance
EnglishSchema.index({ name: 1 });
EnglishSchema.index({ uploadedAt: -1 });
EnglishSchema.index({ createdAt: -1 });

// Virtual field for getting the image URL (optional but helpful)
EnglishSchema.virtual('imageUrl').get(function() {
  return `/api/english/serve/${this._id}`;
});

// Include virtual fields when converting to JSON
EnglishSchema.set('toJSON', { virtuals: true });
EnglishSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('English', EnglishSchema);
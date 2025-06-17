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
    // Keep this optional for backward compatibility, but it's not used in memory storage
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'tamil'
});

// Indexes for better query performance
TamilSchema.index({ name: 1 });
TamilSchema.index({ uploadedAt: -1 });
TamilSchema.index({ createdAt: -1 });

// Virtual field for getting the image URL
TamilSchema.virtual('imageUrl').get(function() {
  return `/api/tamil/serve/${this._id}`;
});

// Include virtual fields when converting to JSON
TamilSchema.set('toJSON', { virtuals: true });
TamilSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Tamil', TamilSchema);
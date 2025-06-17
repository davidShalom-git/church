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
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  collection: 'tamil' // Explicitly set collection name
});

// Ensure indexes are properly set for efficient queries
TamilSchema.index({ name: 1 });
TamilSchema.index({ originalName: 1 });
TamilSchema.index({ mimeType: 1 });
TamilSchema.index({ uploadedAt: -1 });
TamilSchema.index({ createdAt: -1 });

// Exclude `base64Data` from default queries for performance
TamilSchema.set('toJSON', { transform: (doc, ret) => { delete ret.base64Data; return ret; } });
TamilSchema.set('toObject', { transform: (doc, ret) => { delete ret.base64Data; return ret; } });

module.exports = mongoose.model('Tamil', TamilSchema);
const mongoose = require('mongoose');

const EnglishSchema = new mongoose.Schema({
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
  base64Hash: {
    type: String,
    required: true,
    index: true // For fast lookup
  },
  uploadPath: {
    type: String,
    required: false
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'english'
});

// Virtual URL field
EnglishSchema.virtual('imageUrl').get(function () {
  return `/api/english/serve/${this._id}`;
});

EnglishSchema.set('toJSON', { virtuals: true });
EnglishSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.English || mongoose.model('English', EnglishSchema);

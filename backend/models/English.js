const mongoose = require('mongoose');

const EnglishImageSchema = new mongoose.Schema({
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
    required: true
  },
  category: {
    type: String,
    default: 'english'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EnglishImage', EnglishImageSchema);
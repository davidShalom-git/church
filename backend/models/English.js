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
  },
  // Add the problematic field that's causing the duplicate error
  image: {
    type: String,
    default: function() {
      // Generate a unique value instead of null
      return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    unique: true // Keep it unique but with actual unique values
  }
}, {
  timestamps: true,
  collection: 'english' // Explicitly set collection name
});

// Ensure indexes are properly set
EnglishSchema.index({ name: 1 });
EnglishSchema.index({ uploadedAt: -1 });
EnglishSchema.index({ createdAt: -1 });

// Pre-save middleware to ensure unique image field
EnglishSchema.pre('save', function(next) {
  if (!this.image || this.image === null) {
    this.image = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${this._id}`;
  }
  next();
});

module.exports = mongoose.model('English', EnglishSchema);
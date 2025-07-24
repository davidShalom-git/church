const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
    unique: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  data: {
    type: String,
    required: true // This stores the complete base64 data URL
  }
}, {
  timestamps: true // This automatically adds createdAt and updatedAt fields
});

// Add index for faster queries
audioSchema.index({ createdAt: -1 });
audioSchema.index({ filename: 1 });

// Virtual for getting upload date (alias for createdAt)
audioSchema.virtual('uploadDate').get(function() {
  return this.createdAt;
});

// Method to get file size in human readable format
audioSchema.methods.getFormattedSize = function() {
  const bytes = this.size;
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Method to get base64 data without data URL prefix
audioSchema.methods.getBase64Data = function() {
  if (this.data.includes(',')) {
    return this.data.split(',')[1];
  }
  return this.data;
};

// Method to get data URL
audioSchema.methods.getDataUrl = function() {
  const base64Data = this.getBase64Data();
  return `data:${this.mimetype};base64,${base64Data}`;
};

const Audio = mongoose.model('Audio', audioSchema);

module.exports = Audio;
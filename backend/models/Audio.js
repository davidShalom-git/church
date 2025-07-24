const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true,
    enum: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/webm', 'audio/flac']
  },
  size: {
    type: Number,
    required: true
  },
  filePath: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Audio', audioSchema);
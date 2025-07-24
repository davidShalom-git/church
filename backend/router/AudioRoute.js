const express = require('express');
const Audio = require('../models/Audio');
const router = express.Router();

// Upload audio file (Base64) - Database only
router.post('/upload', async (req, res) => {
  try {
    const { audioData, filename, originalName, mimetype } = req.body;

    if (!audioData || !filename || !mimetype) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    if (!mimetype.startsWith('audio/')) {
      return res.status(400).json({ 
        error: 'Only audio files are allowed' 
      });
    }

    // Calculate file size
    let base64Data = audioData;
    if (audioData.includes(',')) {
      base64Data = audioData.split(',')[1];
    }
    
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Check size limit (e.g., 10MB for database storage)
    const maxSize = 10 * 1024 * 1024;
    if (buffer.length > maxSize) {
      return res.status(400).json({ 
        error: 'File too large for database storage (max 10MB)' 
      });
    }

    // Create new audio document
    const audio = new Audio({
      filename: `audio-${Date.now()}-${Math.round(Math.random() * 1E9)}`,
      originalName: originalName || filename,
      mimetype: mimetype,
      size: buffer.length,
      data: audioData // Store the complete base64 data with data URL prefix
    });

    // Save to database
    await audio.save();

    console.log('Audio saved to database:', audio.filename);

    res.status(201).json({
      message: 'Audio uploaded successfully',
      audio: {
        id: audio._id,
        filename: audio.filename,
        originalName: audio.originalName,
        mimetype: audio.mimetype,
        size: audio.size,
        uploadDate: audio.createdAt || audio.uploadDate
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload audio file: ' + error.message 
    });
  }
});

// Get all audio files (metadata only, no base64 data)
router.get('/', async (req, res) => {
  try {
    const audioFiles = await Audio.find()
      .select('-data') // Exclude the large base64 data field
      .sort({ createdAt: -1 });
    
    res.json(audioFiles);
  } catch (error) {
    console.error('Get audio error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio files' });
  }
});

// Get single audio file metadata by ID (no base64 data)
router.get('/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id).select('-data');
    
    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    res.json(audio);
  } catch (error) {
    console.error('Get audio error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio file' });
  }
});

// Get audio file as base64 data URL
router.get('/base64/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Extract base64 data (remove data URL prefix if present)
    let base64Data = audio.data;
    if (audio.data.includes(',')) {
      base64Data = audio.data.split(',')[1];
    }

    // Create data URL
    const dataUrl = `data:${audio.mimetype};base64,${base64Data}`;

    res.json({
      audio: {
        id: audio._id,
        filename: audio.filename,
        originalName: audio.originalName,
        mimetype: audio.mimetype,
        size: audio.size,
        uploadDate: audio.createdAt || audio.uploadDate
      },
      base64Data: base64Data,
      dataUrl: dataUrl
    });
  } catch (error) {
    console.error('Get base64 audio error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio file as base64' });
  }
});

// Stream audio file directly from database
router.get('/stream/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Extract base64 data and convert to buffer
    let base64Data = audio.data;
    if (audio.data.includes(',')) {
      base64Data = audio.data.split(',')[1];
    }
    
    const buffer = Buffer.from(base64Data, 'base64');

    // Set headers for audio streaming
    res.set({
      'Content-Type': audio.mimetype,
      'Content-Length': buffer.length,
      'Accept-Ranges': 'bytes',
      'Content-Disposition': `inline; filename="${audio.originalName}"`
    });

    // Handle range requests for audio seeking
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : buffer.length - 1;
      const chunkSize = (end - start) + 1;

      res.status(206).set({
        'Content-Range': `bytes ${start}-${end}/${buffer.length}`,
        'Content-Length': chunkSize
      });

      // Send the requested chunk
      res.send(buffer.slice(start, end + 1));
    } else {
      // Send the entire file
      res.send(buffer);
    }
  } catch (error) {
    console.error('Stream audio error:', error);
    res.status(500).json({ error: 'Failed to stream audio file' });
  }
});

// Download audio file
router.get('/download/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Extract base64 data and convert to buffer
    let base64Data = audio.data;
    if (audio.data.includes(',')) {
      base64Data = audio.data.split(',')[1];
    }
    
    const buffer = Buffer.from(base64Data, 'base64');

    // Set headers for file download
    res.set({
      'Content-Type': audio.mimetype,
      'Content-Length': buffer.length,
      'Content-Disposition': `attachment; filename="${audio.originalName}"`
    });

    res.send(buffer);
  } catch (error) {
    console.error('Download audio error:', error);
    res.status(500).json({ error: 'Failed to download audio file' });
  }
});

// Delete audio file from database
router.delete('/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Delete from database
    await Audio.findByIdAndDelete(req.params.id);

    res.json({ 
      message: 'Audio file deleted successfully',
      deletedFile: {
        id: audio._id,
        filename: audio.filename,
        originalName: audio.originalName
      }
    });
  } catch (error) {
    console.error('Delete audio error:', error);
    res.status(500).json({ error: 'Failed to delete audio file' });
  }
});

// Update audio metadata
router.put('/:id', async (req, res) => {
  try {
    const { originalName } = req.body;
    
    const audio = await Audio.findById(req.params.id);
    
    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Update only metadata (not the audio data)
    if (originalName) audio.originalName = originalName;
    
    await audio.save();

    res.json({
      message: 'Audio file updated successfully',
      audio: {
        id: audio._id,
        filename: audio.filename,
        originalName: audio.originalName,
        mimetype: audio.mimetype,
        size: audio.size,
        uploadDate: audio.createdAt || audio.uploadDate
      }
    });
  } catch (error) {
    console.error('Update audio error:', error);
    res.status(500).json({ error: 'Failed to update audio file' });
  }
});

module.exports = router;
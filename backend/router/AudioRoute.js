const express = require('express');
const path = require('path');
const fs = require('fs');
const Audio = require('../models/Audio');
const router = express.Router();

// Upload audio file (Base64)
router.post('/upload', async (req, res) => {
  try {
    const { audioData, filename, originalName, mimetype } = req.body;

    if (!audioData || !filename || !mimetype) {
      return res.status(400).json({ error: 'Missing required fields: audioData, filename, mimetype' });
    }

    // Validate file type
    if (!mimetype.startsWith('audio/')) {
      return res.status(400).json({ error: 'Only audio files are allowed' });
    }

    // Remove data URL prefix if present (data:audio/mp3;base64,)
    let base64Data = audioData;
    if (audioData.includes(',')) {
      base64Data = audioData.split(',')[1];
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Create upload directory
    const uploadDir = 'uploads/audio';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(originalName || filename) || '.mp3';
    const savedFilename = 'audio-' + uniqueSuffix + ext;
    const filePath = path.join(uploadDir, savedFilename);

    // Write file to disk
    fs.writeFileSync(filePath, buffer);

    const audio = new Audio({
      filename: savedFilename,
      originalName: originalName || filename,
      mimetype: mimetype,
      size: buffer.length,
      filePath: filePath
    });

    await audio.save();

    res.status(201).json({
      message: 'Audio uploaded successfully',
      audio: audio
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload audio file' });
  }
});

// Get all audio files
router.get('/', async (req, res) => {
  try {
    const audio = await Audio.find().sort({ createdAt: -1 });
    res.json(audio);
  } catch (error) {
    console.error('Get audio error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio files' });
  }
});

// Get single audio file by ID
router.get('/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);
    
    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    res.json(audio);
  } catch (error) {
    console.error('Get audio error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio file' });
  }
});

// Get audio file as base64
router.get('/base64/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    const filePath = audio.filePath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Audio file not found on disk' });
    }

    // Read file and convert to base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');
    const dataUrl = `data:${audio.mimetype};base64,${base64Data}`;

    res.json({
      audio: audio,
      base64Data: base64Data,
      dataUrl: dataUrl
    });
  } catch (error) {
    console.error('Get base64 audio error:', error);
    res.status(500).json({ error: 'Failed to retrieve audio file as base64' });
  }
});

// Stream audio file
router.get('/stream/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    const filePath = audio.filePath;

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Audio file not found on disk' });
    }

    res.set({
      'Content-Type': audio.mimetype,
      'Content-Length': audio.size,
      'Accept-Ranges': 'bytes'
    });

    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : audio.size - 1;
      const chunkSize = (end - start) + 1;

      res.status(206).set({
        'Content-Range': `bytes ${start}-${end}/${audio.size}`,
        'Content-Length': chunkSize
      });

      const stream = fs.createReadStream(filePath, { start, end });
      stream.pipe(res);
    } else {
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error('Stream audio error:', error);
    res.status(500).json({ error: 'Failed to stream audio file' });
  }
});

// Delete audio file
router.delete('/:id', async (req, res) => {
  try {
    const audio = await Audio.findById(req.params.id);

    if (!audio) {
      return res.status(404).json({ error: 'Audio file not found' });
    }

    // Delete file from disk
    if (fs.existsSync(audio.filePath)) {
      fs.unlinkSync(audio.filePath);
    }

    // Delete from database
    await Audio.findByIdAndDelete(req.params.id);

    res.json({ message: 'Audio file deleted successfully' });
  } catch (error) {
    console.error('Delete audio error:', error);
    res.status(500).json({ error: 'Failed to delete audio file' });
  }
});

module.exports = router;




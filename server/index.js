const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Increase request timeout for large file uploads
app.use((req, res, next) => {
  req.setTimeout(600000); // 10 minutes
  res.setTimeout(600000);
  next();
});

// Enable CORS for frontend
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['POST', 'GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: '/tmp/uploads',
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm'];
    if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(mp4|webm|mov|avi|mkv|mp3|wav|ogg|m4a)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Supported: mp4, webm, mov, avi, mkv, mp3, wav, ogg, m4a'));
    }
  }
});

// Ensure upload directory exists
if (!fs.existsSync('/tmp/uploads')) {
  fs.mkdirSync('/tmp/uploads', { recursive: true });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'audio-extraction' });
});

// Audio extraction endpoint
app.post('/extract-audio', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const inputPath = req.file.path;
  const outputPath = inputPath.replace(/\.[^.]+$/, '.m4a');

  console.log(`[FFmpeg] Processing: ${req.file.originalname}`);
  console.log(`[FFmpeg] Input: ${inputPath}`);
  console.log(`[FFmpeg] Output: ${outputPath}`);

  try {
    await extractAudio(inputPath, outputPath);

    // Read the output file
    const audioBuffer = fs.readFileSync(outputPath);

    // Clean up files
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    console.log(`[FFmpeg] Success! Audio size: ${audioBuffer.length} bytes`);

    // Send audio file
    res.set({
      'Content-Type': 'audio/mp4',
      'Content-Length': audioBuffer.length,
      'Content-Disposition': 'attachment; filename="audio.m4a"'
    });
    res.send(audioBuffer);

  } catch (error) {
    console.error('[FFmpeg] Error:', error.message);

    // Clean up on error
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    res.status(500).json({ error: error.message });
  }
});

function extractAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    // First try fast stream copy, fall back to re-encode if it fails
    const fastArgs = [
      '-i', inputPath,
      '-vn',              // No video
      '-c:a', 'copy',     // Copy audio stream (no re-encode - FAST!)
      '-y',               // Overwrite output
      outputPath
    ];

    console.log(`[FFmpeg] Trying fast copy: ffmpeg ${fastArgs.join(' ')}`);

    const ffmpegFast = spawn('ffmpeg', fastArgs);
    let stderrFast = '';

    ffmpegFast.stderr.on('data', (data) => {
      stderrFast += data.toString();
    });

    ffmpegFast.on('close', (code) => {
      if (code === 0) {
        console.log('[FFmpeg] Fast copy succeeded!');
        resolve();
      } else {
        console.log('[FFmpeg] Fast copy failed, falling back to re-encode...');
        // Fall back to re-encoding
        const slowArgs = [
          '-i', inputPath,
          '-vn',              // No video
          '-acodec', 'aac',   // AAC codec
          '-b:a', '64k',      // 64kbps bitrate
          '-ar', '22050',     // 22.05kHz sample rate
          '-y',               // Overwrite output
          outputPath
        ];

        console.log(`[FFmpeg] Running: ffmpeg ${slowArgs.join(' ')}`);

        const ffmpegSlow = spawn('ffmpeg', slowArgs);
        let stderrSlow = '';

        ffmpegSlow.stderr.on('data', (data) => {
          stderrSlow += data.toString();
        });

        ffmpegSlow.on('close', (codeSlow) => {
          if (codeSlow === 0) {
            console.log('[FFmpeg] Re-encode succeeded!');
            resolve();
          } else {
            reject(new Error(`FFmpeg exited with code ${codeSlow}: ${stderrSlow.slice(-500)}`));
          }
        });

        ffmpegSlow.on('error', (err) => {
          reject(new Error(`Failed to start FFmpeg: ${err.message}`));
        });
      }
    });

    ffmpegFast.on('error', (err) => {
      reject(new Error(`Failed to start FFmpeg: ${err.message}`));
    });
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 500MB.' });
    }
  }
  console.error('[Server] Error:', error.message);
  res.status(500).json({ error: error.message });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Audio extraction server running on port ${PORT}`);
});

// Set server timeouts for large file processing
server.timeout = 600000; // 10 minutes
server.keepAliveTimeout = 620000;

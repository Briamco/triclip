import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '../middleware/upload.js';
import { getVideoDuration, trimVideo } from '../utils/ffmpeg.js';
import { validateTrimParams } from '../utils/validators.js';

const router = Router();
const UPLOADS_DIR = path.resolve('uploads');

// ─── POST /api/upload ────────────────────────────────────────────────
// Upload a video file via multipart form data.
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { filename, originalname } = req.file;
    const filePath = path.join(UPLOADS_DIR, filename);
    const duration = await getVideoDuration(filePath);

    res.json({
      id: uuidv4(),
      filename,
      originalName: originalname,
      duration,
      path: filePath,
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ error: 'Failed to process uploaded video' });
  }
});

// ─── POST /api/trim ──────────────────────────────────────────────────
// Trim a previously uploaded video.
router.post('/trim', async (req, res) => {
  try {
    const { filename, startTime, endTime } = req.body;

    const validation = validateTrimParams(filename, startTime, endTime);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const inputPath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(inputPath)) {
      return res.status(404).json({ error: 'Source video not found' });
    }

    const id = uuidv4();
    const ext = path.extname(filename) || '.mp4';
    const outputFilename = `trimmed-${id}${ext}`;
    const outputPath = path.join(UPLOADS_DIR, outputFilename);

    await trimVideo(inputPath, outputPath, startTime, endTime);

    const duration = await getVideoDuration(outputPath);

    res.json({
      id,
      filename: outputFilename,
      duration,
    });
  } catch (error) {
    console.error('Trim error:', error.message);
    res.status(500).json({ error: 'Failed to trim video' });
  }
});

// ─── GET /api/video/:filename ────────────────────────────────────────
// Stream video with range request support.
router.get('/video/:filename', (req, res) => {
  try {
    const { filename } = req.params;

    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4',
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      });

      fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error('Stream error:', error.message);
    res.status(500).json({ error: 'Failed to stream video' });
  }
});

// ─── DELETE & POST /api/cleanup/:filename ────────────────────────────
// Delete a specific file from uploads. Supports DELETE and POST (for beacon)
router.route('/cleanup/:filename')
  .delete(cleanupHandler)
  .post(cleanupHandler);

function cleanupHandler(req, res) {
  try {
    const { filename } = req.params;

    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({ error: 'Invalid filename' });
    }

    const filePath = path.join(UPLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Cleanup error:', error.message);
    res.status(500).json({ error: 'Failed to delete file' });
  }
}

export default router;

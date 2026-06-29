import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import videoRoutes from './routes/video.js';

const app = express();
const PORT = process.env.PORT || 3001;
const UPLOADS_DIR = path.resolve('uploads');

// ─── Ensure uploads directory exists ─────────────────────────────────
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// ─── Middleware ───────────────────────────────────────────────────────
app.use(cors());

app.use(express.json());

// Request logging
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Helper to format bytes to human readable format
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ─── Routes ──────────────────────────────────────────────────────────
app.use('/api', videoRoutes);

// Config endpoint
app.get('/api/config', (_req, res) => {
  const maxFileSize = parseInt(process.env.MAX_FILE_SIZE_BYTES, 10) || 1024 * 1024 * 1024;
  const dailyUsageLimit = parseInt(process.env.DAILY_USAGE_LIMIT, 10) || 5;
  res.json({
    maxFileSize,
    maxFileSizeReadable: formatBytes(maxFileSize),
    dailyUsageLimit
  });
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// ─── Error handling ──────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    const limitBytes = parseInt(process.env.MAX_FILE_SIZE_BYTES, 10) || 1024 * 1024 * 1024;
    return res.status(413).json({ error: `File too large. Maximum size is ${formatBytes(limitBytes)}.` });
  }

  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ─── Periodic cleanup (files older than 1 hour) ─────────────────────
const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
const MAX_FILE_AGE = 60 * 60 * 1000; // 1 hour

function cleanupOldFiles() {
  try {
    const files = fs.readdirSync(UPLOADS_DIR);
    const now = Date.now();
    let cleaned = 0;

    for (const file of files) {
      const filePath = path.join(UPLOADS_DIR, file);
      const stat = fs.statSync(filePath);

      if (now - stat.mtimeMs > MAX_FILE_AGE) {
        fs.unlinkSync(filePath);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`[Cleanup] Removed ${cleaned} expired file(s)`);
    }
  } catch (error) {
    console.error('[Cleanup] Error:', error.message);
  }
}

setInterval(cleanupOldFiles, CLEANUP_INTERVAL);

// ─── Start server ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎬 Triclip server running on http://localhost:${PORT}`);
  console.log(`   CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`   Uploads dir: ${UPLOADS_DIR}\n`);
});

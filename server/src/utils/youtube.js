import { execFile, spawn } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFileAsync = promisify(execFile);

// Resolve local bin path relative to server root
const BIN_DIR = path.resolve(process.cwd(), '../bin');

const YT_DLP_PATH = fs.existsSync(path.join(BIN_DIR, 'yt-dlp'))
  ? path.join(BIN_DIR, 'yt-dlp')
  : 'yt-dlp';

/**
 * Downloads a YouTube video using yt-dlp.
 * Downloads best quality up to 1080p in MP4 format.
 *
 * @param {string} url - The YouTube video URL.
 * @param {string} outputPath - Absolute path for the output file.
 * @param {Function} [onProgress] - Callback function called with percentage (0-100).
 * @returns {Promise<void>}
 */
// Helper to get cookies arguments based on environment variables
function getCookiesArgs() {
  const args = [];
  if (process.env.YTDLP_COOKIES_FILE) {
    args.push('--cookies', process.env.YTDLP_COOKIES_FILE);
  } else if (process.env.YTDLP_COOKIES_BROWSER) {
    args.push('--cookies-from-browser', process.env.YTDLP_COOKIES_BROWSER);
  }
  return args;
}

/**
 * Downloads a YouTube video using yt-dlp.
 * Downloads best quality up to 1080p in MP4 format.
 *
 * @param {string} url - The YouTube video URL.
 * @param {string} outputPath - Absolute path for the output file.
 * @param {Function} [onProgress] - Callback function called with percentage (0-100).
 * @returns {Promise<void>}
 */
export function downloadYouTubeVideo(url, outputPath, onProgress) {
  return new Promise((resolve, reject) => {
    const args = [
      '--ffmpeg-location', BIN_DIR,
      '-f',
      'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best',
      '--merge-output-format', 'mp4',
      '--newline',
      ...getCookiesArgs(),
      '-o', outputPath,
      url,
    ];

    const child = spawn(YT_DLP_PATH, args);

    let errorOutput = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      // Match "[download]  xx.x%"
      const match = output.match(/\[download\]\s+(\d+(?:\.\d+)?)%/);
      if (match) {
        const percent = parseFloat(match[1]);
        onProgress?.(percent);
      }
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`yt-dlp exited with code ${code}. Error: ${errorOutput}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Gets the title of a YouTube video using yt-dlp.
 *
 * @param {string} url - The YouTube video URL.
 * @returns {Promise<string>} The video title.
 */
export async function getYouTubeTitle(url) {
  const args = [
    '--get-title',
    '--no-warnings',
    ...getCookiesArgs(),
    url,
  ];

  const { stdout } = await execFileAsync(YT_DLP_PATH, args, {
    timeout: 30_000,
  });

  return stdout.trim() || 'YouTube Video';
}

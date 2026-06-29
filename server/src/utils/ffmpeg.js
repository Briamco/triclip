import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execFileAsync = promisify(execFile);

// Resolve local bin paths relative to the server root
const BIN_DIR = path.resolve(process.cwd(), '../bin');

const FFPROBE_PATH = fs.existsSync(path.join(BIN_DIR, 'ffprobe'))
  ? path.join(BIN_DIR, 'ffprobe')
  : 'ffprobe';

const FFMPEG_PATH = fs.existsSync(path.join(BIN_DIR, 'ffmpeg'))
  ? path.join(BIN_DIR, 'ffmpeg')
  : 'ffmpeg';

/**
 * Gets the duration of a video file using ffprobe.
 *
 * @param {string} filePath - Absolute path to the video file.
 * @returns {Promise<number>} Duration in seconds.
 */
export async function getVideoDuration(filePath) {
  const { stdout } = await execFileAsync(FFPROBE_PATH, [
    '-v', 'quiet',
    '-print_format', 'json',
    '-show_format',
    filePath,
  ]);

  const metadata = JSON.parse(stdout);
  const duration = parseFloat(metadata.format?.duration);

  if (isNaN(duration)) {
    throw new Error('Could not determine video duration');
  }

  return Math.round(duration * 100) / 100;
}

/**
 * Trims a video using ffmpeg with stream copy (no re-encoding).
 *
 * @param {string} inputPath - Absolute path to the input video.
 * @param {string} outputPath - Absolute path for the trimmed output.
 * @param {number} startTime - Start time in seconds.
 * @param {number} endTime - End time in seconds.
 * @returns {Promise<void>}
 */
export async function trimVideo(inputPath, outputPath, startTime, endTime) {
  const duration = endTime - startTime;

  await execFileAsync(FFMPEG_PATH, [
    '-ss', String(startTime),
    '-i', inputPath,
    '-to', String(duration),
    '-c', 'copy',
    '-avoid_negative_ts', 'make_zero',
    outputPath,
  ]);
}

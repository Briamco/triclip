/**
 * Validates that a given URL is a valid supported external video URL.
 * Supports YouTube, TikTok, and Instagram Reels.
 *
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if the URL is valid.
 */
export function isValidExternalUrl(url) {
  if (!url || typeof url !== 'string') return false;

  const patterns = [
    // YouTube
    /^(https?:\/\/)?((www|m|music|gaming)\.)?youtube\.com\/watch\?v=[\w-]{11}/,
    /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]{11}/,
    /^(https?:\/\/)?((www|m)\.)?youtube\.com\/embed\/[\w-]{11}/,
    /^(https?:\/\/)?((www|m)\.)?youtube-nocookie\.com\/embed\/[\w-]{11}/,
    /^(https?:\/\/)?((www|m)\.)?youtube\.com\/shorts\/[\w-]{11}/,
    /^(https?:\/\/)?((www|m)\.)?youtube\.com\/live\/[\w-]{11}/,

    // TikTok
    /^(https?:\/\/)?((www|m)\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
    /^(https?:\/\/)?(vm|vt)\.tiktok\.com\/[\w-]+/,

    // Instagram Reels / Posts
    /^(https?:\/\/)?((www|m)\.)?instagram\.com\/(reel|reels|p)\/[\w-]+/,
  ];

  return patterns.some((pattern) => pattern.test(url));
}

/**
 * Validates trim parameters.
 *
 * @param {string} filename - The video filename to trim.
 * @param {number} startTime - Start time in seconds.
 * @param {number} endTime - End time in seconds.
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateTrimParams(filename, startTime, endTime) {
  if (!filename || typeof filename !== 'string') {
    return { valid: false, error: 'Filename is required' };
  }

  if (typeof startTime !== 'number' || isNaN(startTime) || startTime < 0) {
    return { valid: false, error: 'startTime must be a non-negative number' };
  }

  if (typeof endTime !== 'number' || isNaN(endTime) || endTime <= 0) {
    return { valid: false, error: 'endTime must be a positive number' };
  }

  if (startTime >= endTime) {
    return { valid: false, error: 'startTime must be less than endTime' };
  }

  // Prevent path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return { valid: false, error: 'Invalid filename' };
  }

  return { valid: true };
}

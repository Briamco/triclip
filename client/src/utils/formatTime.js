/**
 * Format seconds into HH:MM:SS.ms display string
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatTime(totalSeconds) {
  if (!isFinite(totalSeconds) || totalSeconds < 0) return '00:00:00';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const ms = Math.floor((totalSeconds % 1) * 10);

  const pad = (n) => String(n).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${ms}`;
  }
  return `${pad(minutes)}:${pad(seconds)}.${ms}`;
}

/**
 * Parse a time string (HH:MM:SS or MM:SS or SS) into seconds
 * @param {string} timeStr
 * @returns {number}
 */
export function parseTime(timeStr) {
  if (!timeStr) return NaN;

  // Remove any trailing .X decimal
  const cleanStr = timeStr.replace(/\.\d+$/, '');
  const parts = cleanStr.split(':').map(Number);

  if (parts.some(isNaN)) return NaN;

  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    return parts[0];
  }

  return NaN;
}

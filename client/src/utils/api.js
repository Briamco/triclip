import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
});

/**
 * Fetch application limits and configurations from backend
 * @returns {Promise<{maxFileSize: number, maxFileSizeReadable: string, dailyUsageLimit: number}>}
 */
export async function fetchAppConfig() {
  const response = await api.get('/api/config');
  return response.data;
}

/**
 * Upload a video file
 * @param {File} file
 * @param {Function} onProgress - progress callback (0-100)
 * @returns {Promise<{filename: string, duration: number}>}
 */
export async function uploadVideo(file, onProgress) {
  const formData = new FormData();
  formData.append('video', file);

  const response = await api.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress?.(percent);
      }
    },
  });

  return response.data;
}

/**
 * Trim a video
 * @param {string} filename
 * @param {number} startTime
 * @param {number} endTime
 * @returns {Promise<{filename: string, duration: number}>}
 */
export async function trimVideo(filename, startTime, endTime) {
  const response = await api.post('/api/trim', {
    filename,
    startTime,
    endTime,
  });
  return response.data;
}

/**
 * Get video stream URL
 * @param {string} filename
 * @returns {string}
 */
export function getVideoUrl(filename) {
  return `${API_BASE_URL}/api/video/${encodeURIComponent(filename)}`;
}

/**
 * Delete/cleanup a file on the server
 * @param {string} filename
 * @returns {Promise<any>}
 */
export async function deleteVideo(filename) {
  const response = await api.delete(`/api/cleanup/${encodeURIComponent(filename)}`);
  return response.data;
}

export default api;

import { useState, useCallback, useRef, useEffect } from 'react';
import { uploadVideo, trimVideo, getVideoUrl, deleteVideo, fetchAppConfig, API_BASE_URL } from '../utils/api';

let toastId = 0;

const getDailyTrimQuota = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    const raw = localStorage.getItem('triclip_daily_trims');
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === todayStr) {
        return data.count || 0;
      }
    }
  } catch (e) {
    console.error('Error reading quota from localStorage', e);
  }
  return 0;
};

const incrementDailyTrimQuota = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentCount = getDailyTrimQuota();
  const nextCount = currentCount + 1;
  try {
    localStorage.setItem('triclip_daily_trims', JSON.stringify({ date: todayStr, count: nextCount }));
  } catch (e) {
    console.error('Error saving quota to localStorage', e);
  }
  return nextCount;
};

export default function useVideoTrimmer() {
  const [video, setVideo] = useState(null);
  const [trimRange, setTrimRange] = useState({ start: 0, end: 0 });
  const [currentTime, setCurrentTime] = useState(0);
  const [dailyTrims, setDailyTrims] = useState(getDailyTrimQuota());
  const [config, setConfig] = useState({
    maxFileSize: 1073741824, // fallback 1GB
    maxFileSizeReadable: '1 GB',
    dailyUsageLimit: 5 // fallback 5
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const [trimProgress, setTrimProgress] = useState(0);
  const [trimResult, setTrimResult] = useState(null);
  const [lastExportedRange, setLastExportedRange] = useState(null);
  const [toasts, setToasts] = useState([]);
  const videoRef = useRef(null);

  // Load backend configuration limits on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const data = await fetchAppConfig();
        setConfig({
          maxFileSize: data.maxFileSize,
          maxFileSizeReadable: data.maxFileSizeReadable,
          dailyUsageLimit: data.dailyUsageLimit
        });
      } catch (err) {
        console.error('Failed to load application config, using defaults:', err);
      }
    }
    loadConfig();
  }, []);

  const addToast = useCallback((message, type = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleUploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const data = await uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });
      const src = getVideoUrl(data.filename);
      setVideo({ filename: data.filename, src, duration: data.duration || 0 });
      setTrimRange({ start: 0, end: data.duration || 0 });
      setTrimResult(null);
      addToast('Video uploaded successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Upload failed', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [addToast]);

  const handleTrimVideo = useCallback(async () => {
    if (dailyTrims >= config.dailyUsageLimit) {
      addToast(`Daily limit reached. You can only trim ${config.dailyUsageLimit} videos per day.`, 'error');
      return;
    }

    setIsTrimming(true);
    setTrimProgress(0);

    const interval = setInterval(() => {
      setTrimProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    try {
      const data = await trimVideo(video.filename, trimRange.start, trimRange.end);
      clearInterval(interval);
      setTrimProgress(100);
      setTrimResult(data);
      setLastExportedRange({ start: trimRange.start, end: trimRange.end });
      
      // Increment and update local quota state
      const nextCount = incrementDailyTrimQuota();
      setDailyTrims(nextCount);

      addToast('Video trimmed successfully!', 'success');
    } catch (err) {
      clearInterval(interval);
      addToast(err.response?.data?.error || 'Trimming failed', 'error');
    } finally {
      setIsTrimming(false);
      setTrimProgress(0);
    }
  }, [video, trimRange, addToast]);

  const handleTrimChange = useCallback((start, end) => {
    setTrimRange({ start: Math.max(0, start), end: Math.min(end, video?.duration || end) });
  }, [video]);

  const handleTimeUpdate = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  const handleLoadedMetadata = useCallback((dur, videoEl) => {
    videoRef.current = videoEl;
    if (video && (!video.duration || video.duration === 0)) {
      setVideo((prev) => ({ ...prev, duration: dur }));
      setTrimRange({ start: 0, end: dur });
    }
  }, [video]);

  const handlePreview = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = trimRange.start;
      videoRef.current.play();
      addToast('Previewing from trim start', 'info');
    }
  }, [trimRange, addToast]);

  // Automatic cleanup of video files when user closes the browser/tab
  useEffect(() => {
    const handleUnloadCleanup = () => {
      // Use navigator.sendBeacon as it is guaranteed to complete before page unload
      if (video?.filename) {
        navigator.sendBeacon(`${API_BASE_URL}/api/cleanup/${encodeURIComponent(video.filename)}`);
      }
      if (trimResult?.filename) {
        navigator.sendBeacon(`${API_BASE_URL}/api/cleanup/${encodeURIComponent(trimResult.filename)}`);
      }
    };

    window.addEventListener('unload', handleUnloadCleanup);
    return () => {
      window.removeEventListener('unload', handleUnloadCleanup);
    };
  }, [video, trimResult]);

  const resetState = useCallback(() => {
    // Perform cleanup on the server for the current files asynchronously
    if (video?.filename) {
      deleteVideo(video.filename).catch((err) => {
        console.error('Failed to cleanup original video:', err);
      });
    }
    if (trimResult?.filename) {
      deleteVideo(trimResult.filename).catch((err) => {
        console.error('Failed to cleanup trimmed video:', err);
      });
    }

    setVideo(null);
    setTrimRange({ start: 0, end: 0 });
    setCurrentTime(0);
    setIsUploading(false);
    setUploadProgress(0);
    setIsTrimming(false);
    setTrimProgress(0);
    setTrimResult(null);
    setLastExportedRange(null);
    addToast('Ready for a new video', 'info');
  }, [video, trimResult, addToast]);

  return {
    video,
    trimRange,
    currentTime,
    isUploading,
    uploadProgress,
    isTrimming,
    trimProgress,
    trimResult,
    lastExportedRange,
    dailyTrims,
    config,
    toasts,
    addToast,
    removeToast,
    handleUploadFile,
    handleTrimVideo,
    handleTrimChange,
    handleTimeUpdate,
    handleLoadedMetadata,
    handlePreview,
    resetState,
  };
}

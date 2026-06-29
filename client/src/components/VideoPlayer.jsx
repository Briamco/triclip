import { useRef, useState, useEffect, useCallback } from 'react';
import {
  FiPlay, FiPause, FiVolume2, FiVolumeX,
  FiMaximize, FiMinimize, FiMonitor, FiClock
} from 'react-icons/fi';
import { formatTime } from '../utils/formatTime';
import './VideoPlayer.css';

export default function VideoPlayer({ videoSrc, onTimeUpdate, onLoadedMetadata, trimmedDuration }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    onTimeUpdate?.(video.currentTime);

    if (video.buffered.length > 0) {
      setBuffered(video.buffered.end(video.buffered.length - 1));
    }
  }, [onTimeUpdate]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    onLoadedMetadata?.(video.duration, video);
  }, [onLoadedMetadata]);

  const handleProgressClick = useCallback((e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const video = videoRef.current;
    if (video) {
      video.currentTime = pos * video.duration;
    }
  }, []);

  const handleVolumeChange = useCallback((e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    video.muted = newMuted;
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    const wrapper = videoRef.current?.parentElement;
    if (!wrapper) return;
    if (!document.fullscreenElement) {
      wrapper.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current._seekTo = (time) => {
        videoRef.current.currentTime = time;
      };
    }
  }, [videoSrc]);

  if (!videoSrc) {
    return (
      <div className="video-player glass-card fade-up fade-up-delay-2">
        <div className="video-player-header">
          <div className="section-title"><FiMonitor /> Preview</div>
        </div>
        <div className="video-placeholder">
          <FiPlay className="video-placeholder-icon" />
          <p className="video-placeholder-text">Upload a video to start trimming</p>
        </div>
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div className="video-player glass-card fade-up fade-up-delay-2">
      <div className="video-player-header">
        <div className="section-title"><FiMonitor /> Preview</div>
        {trimmedDuration !== undefined && (
          <div className="trimmed-duration-badge">
            <FiClock /> Trimmed Duration: <strong>{formatTime(trimmedDuration)}</strong>
          </div>
        )}
      </div>
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-element"
          src={videoSrc}
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnd}
          preload="metadata"
        />
        <div className="video-controls">
          <div
            className="video-progress"
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div
              className="video-progress-buffered"
              style={{ width: `${bufferedPercent}%` }}
            />
            <div
              className="video-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="video-controls-bar">
            {/* Left Controls Group */}
            <div className="video-controls-left">
              <button className="video-btn play-btn" onClick={togglePlay}>
                {isPlaying ? <FiPause /> : <FiPlay />}
              </button>
              <div className="video-time">
                <span>{formatTime(currentTime)}</span>
                <span className="video-time-separator">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls Group */}
            <div className="video-controls-right">
              <div className="video-volume-group">
                <button className="video-btn" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
                </button>
                <input
                  type="range"
                  className="video-volume-slider"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                />
              </div>
              <button className="video-btn" onClick={toggleFullscreen}>
                {isFullscreen ? <FiMinimize /> : <FiMaximize />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

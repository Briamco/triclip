import React from 'react';
import { FiInfo, FiHelpCircle } from 'react-icons/fi';
import { formatTime } from '../utils/formatTime';
import './VideoDetailsCard.css';

export default function VideoDetailsCard({ video }) {
  if (!video) return null;

  return (
    <div className="video-details-card glass-card fade-up">
      <div className="section-title"><FiInfo /> Media Info</div>
      <div className="details-grid">
        <div className="details-row">
          <span className="details-label">File Name</span>
          <span className="details-val" title={video.originalName}>{video.originalName}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Original Length</span>
          <span className="details-val">{formatTime(video.duration)}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Codec / Container</span>
          <span className="details-val">H.264 / MP4</span>
        </div>
        <div className="details-row">
          <span className="details-label">Process Mode</span>
          <span className="details-val">Direct Stream Copy</span>
        </div>
      </div>

      <div className="details-divider" />

      <div className="section-title"><FiHelpCircle /> Hotkeys</div>
      <div className="shortcuts-list">
        <div className="shortcut-item">
          <span className="shortcut-keys"><kbd>Space</kbd></span>
          <span className="shortcut-desc">Play / Pause video preview</span>
        </div>
        <div className="shortcut-item">
          <span className="shortcut-keys"><kbd>←</kbd> or <kbd>→</kbd></span>
          <span className="shortcut-desc">Move Start marker ±0.1s</span>
        </div>
        <div className="shortcut-item">
          <span className="shortcut-keys"><kbd>Shift</kbd> + <kbd>←</kbd> / <kbd>→</kbd></span>
          <span className="shortcut-desc">Move End marker ±0.1s</span>
        </div>
      </div>
    </div>
  );
}

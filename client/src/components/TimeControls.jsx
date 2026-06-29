import { useState, useEffect, useCallback } from 'react';
import { FiClock, FiPlay, FiScissors } from 'react-icons/fi';
import { formatTime, parseTime } from '../utils/formatTime';
import './TimeControls.css';

export default function TimeControls({
  duration,
  trimStart,
  trimEnd,
  onTrimChange,
  onPreview
}) {
  // Local state for raw inputs to allow user typing freely
  const [startInput, setStartInput] = useState(formatTime(trimStart));
  const [endInput, setEndInput] = useState(formatTime(trimEnd));

  // Sync local inputs when parent values change
  useEffect(() => {
    setStartInput(formatTime(trimStart));
  }, [trimStart]);

  useEffect(() => {
    setEndInput(formatTime(trimEnd));
  }, [trimEnd]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const step = 0.1;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (e.shiftKey) {
          onTrimChange(trimStart, Math.max(trimEnd - step, trimStart + 0.1));
        } else {
          onTrimChange(Math.max(trimStart - step, 0), trimEnd);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (e.shiftKey) {
          onTrimChange(trimStart, Math.min(trimEnd + step, duration));
        } else {
          onTrimChange(Math.min(trimStart + step, trimEnd - 0.1), trimEnd);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trimStart, trimEnd, duration, onTrimChange]);

  const handleStartTimeInput = useCallback(() => {
    const time = parseTime(startInput);
    if (!isNaN(time) && time >= 0 && time < trimEnd) {
      onTrimChange(time, trimEnd);
    } else {
      setStartInput(formatTime(trimStart));
    }
  }, [startInput, trimStart, trimEnd, onTrimChange]);

  const handleEndTimeInput = useCallback(() => {
    const time = parseTime(endInput);
    if (!isNaN(time) && time > trimStart && time <= duration) {
      onTrimChange(trimStart, time);
    } else {
      setEndInput(formatTime(trimEnd));
    }
  }, [endInput, trimStart, trimEnd, duration, onTrimChange]);

  return (
    <div className="time-controls glass-card fade-up">
      <div className="section-title"><FiScissors /> Selection Settings</div>
      
      <div className="time-inputs-grid">
        <div className="time-field">
          <label className="time-label">Start Position</label>
          <input
            type="text"
            className="time-input"
            value={startInput}
            onBlur={handleStartTimeInput}
            onKeyDown={(e) => e.key === 'Enter' && handleStartTimeInput()}
            onChange={(e) => setStartInput(e.target.value)}
          />
        </div>
        <div className="time-field">
          <label className="time-label">End Position</label>
          <input
            type="text"
            className="time-input"
            value={endInput}
            onBlur={handleEndTimeInput}
            onKeyDown={(e) => e.key === 'Enter' && handleEndTimeInput()}
            onChange={(e) => setEndInput(e.target.value)}
          />
        </div>
      </div>

      <div className="time-actions-row">
        <button className="time-preview-btn" onClick={onPreview}>
          <FiPlay /> Preview Trim Range
        </button>
      </div>

      <p className="time-hint-text">
        Press <kbd>←</kbd> <kbd>→</kbd> to shift Start • Hold <kbd>Shift</kbd> to shift End
      </p>
    </div>
  );
}

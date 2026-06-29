import { useState, useRef, useCallback, useEffect } from 'react';
import { FiScissors, FiPlay, FiClock } from 'react-icons/fi';
import { formatTime, parseTime } from '../utils/formatTime';
import './TrimControls.css';

export default function TrimControls({
  duration,
  trimStart,
  trimEnd,
  currentTime,
  onTrimChange,
  onPreview,
}) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  // Local state for raw inputs to allow user typing freely
  const [startInput, setStartInput] = useState(formatTime(trimStart));
  const [endInput, setEndInput] = useState(formatTime(trimEnd));

  // Sync local inputs when parent values change (e.g. from slider dragging)
  useEffect(() => {
    setStartInput(formatTime(trimStart));
  }, [trimStart]);

  useEffect(() => {
    setEndInput(formatTime(trimEnd));
  }, [trimEnd]);

  const getPositionPercent = useCallback((time) => {
    if (duration <= 0) return 0;
    return (time / duration) * 100;
  }, [duration]);

  const getTimeFromPosition = useCallback((clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return pos * duration;
  }, [duration]);

  const handleMouseDown = useCallback((handle) => (e) => {
    e.preventDefault();
    setDragging(handle);
  }, []);

  const handleTouchStart = useCallback((handle) => (e) => {
    // Avoid default scrolling behavior when dragging sliders
    e.preventDefault();
    setDragging(handle);
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e) => {
      const time = getTimeFromPosition(e.clientX);
      if (dragging === 'start') {
        onTrimChange(Math.min(time, trimEnd - 0.1), trimEnd);
      } else {
        onTrimChange(trimStart, Math.max(time, trimStart + 0.1));
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 0) return;
      const time = getTimeFromPosition(e.touches[0].clientX);
      if (dragging === 'start') {
        onTrimChange(Math.min(time, trimEnd - 0.1), trimEnd);
      } else {
        onTrimChange(trimStart, Math.max(time, trimStart + 0.1));
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, trimStart, trimEnd, getTimeFromPosition, onTrimChange]);

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
      // Revert if invalid
      setStartInput(formatTime(trimStart));
    }
  }, [startInput, trimStart, trimEnd, onTrimChange]);

  const handleEndTimeInput = useCallback(() => {
    const time = parseTime(endInput);
    if (!isNaN(time) && time > trimStart && time <= duration) {
      onTrimChange(trimStart, time);
    } else {
      // Revert if invalid
      setEndInput(formatTime(trimEnd));
    }
  }, [endInput, trimStart, trimEnd, duration, onTrimChange]);

  const trimmedDuration = trimEnd - trimStart;
  const startPercent = getPositionPercent(trimStart);
  const endPercent = getPositionPercent(trimEnd);
  const playheadPercent = getPositionPercent(currentTime);

  return (
    <div className="trim-timeline-wrapper">
      <div className="trim-timeline">
        <div className="trim-timeline-track" ref={trackRef}>
          <div
            className="trim-timeline-dimmed-left"
            style={{ width: `${startPercent}%` }}
          />
          <div
            className="trim-timeline-dimmed-right"
            style={{ width: `${100 - endPercent}%` }}
          />

          <div
            className="trim-timeline-fill"
            style={{
              left: `${startPercent}%`,
              width: `${endPercent - startPercent}%`,
            }}
          />
        </div>

        <div
          className="trim-playhead"
          style={{ left: `${playheadPercent}%` }}
        />

        <div
          className={`trim-handle ${dragging === 'start' ? 'dragging' : ''}`}
          style={{ left: `calc(${startPercent}% - 7px)` }}
          onMouseDown={handleMouseDown('start')}
          onTouchStart={handleTouchStart('start')}
        >
          <span className="trim-handle-label">{formatTime(trimStart)}</span>
        </div>

        <div
          className={`trim-handle ${dragging === 'end' ? 'dragging' : ''}`}
          style={{ left: `calc(${endPercent}% - 7px)` }}
          onMouseDown={handleMouseDown('end')}
          onTouchStart={handleTouchStart('end')}
        >
          <span className="trim-handle-label">{formatTime(trimEnd)}</span>
        </div>
      </div>
    </div>
  );
}

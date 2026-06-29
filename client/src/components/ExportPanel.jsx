import { FiDownload, FiScissors, FiRotateCcw, FiClock, FiFilm, FiZap } from 'react-icons/fi';
import { formatTime } from '../utils/formatTime';
import './ExportPanel.css';

export default function ExportPanel({
  videoFilename,
  trimStart,
  trimEnd,
  isTrimming,
  trimProgress,
  trimResult,
  lastExportedRange,
  onTrim,
  onDownload,
  onReset,
}) {
  const trimmedDuration = trimEnd - trimStart;
  const hasRangeChanged = lastExportedRange && (trimStart !== lastExportedRange.start || trimEnd !== lastExportedRange.end);

  if (isTrimming) {
    return (
      <div className="export-panel glass-card fade-up fade-up-delay-4">
        <div className="section-title"><FiZap /> Export</div>
        <div className="export-processing">
          <div className="export-processing-ring">
            <div className="export-processing-pulse"></div>
          </div>
          <p className="export-processing-text">Trimming your video...</p>
          {trimProgress > 0 && (
            <div className="export-processing-progress">
              <div className="export-processing-bar-track">
                <div
                  className="export-processing-bar-fill"
                  style={{ width: `${trimProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (trimResult) {
    return (
      <div className="export-panel glass-card fade-up fade-up-delay-4">
        <div className="section-title"><FiZap /> Export</div>
        <div className="export-download">
          <button className="export-download-btn" onClick={onDownload}>
            <FiDownload /> Download Trimmed Video
          </button>

          {hasRangeChanged && (
            <>
              <div className="export-divider" />
              <div className="export-warning-notice">
                Selected range was modified since last export.
              </div>
              <button className="export-btn-secondary" onClick={onTrim}>
                <FiScissors /> Trim & Export New Range
              </button>
            </>
          )}

          <div className="export-divider" />

          <button className="export-reset-btn" onClick={onReset}>
            <FiRotateCcw /> Trim Another Video
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="export-panel glass-card fade-up fade-up-delay-4">
      <div className="section-title"><FiZap /> Export</div>

      <button
        className="export-btn"
        onClick={onTrim}
        disabled={!videoFilename}
      >
        <FiScissors /> Trim & Export
      </button>

      {videoFilename && (
        <div className="export-info">
          <div className="export-info-row">
            <span className="export-info-label"><FiClock /> Duration</span>
            <span className="export-info-value">{formatTime(trimmedDuration)}</span>
          </div>
          <div className="export-info-row">
            <span className="export-info-label"><FiFilm /> Source</span>
            <span className="export-info-value" title={videoFilename}>
              {videoFilename.length > 20
                ? videoFilename.slice(0, 20) + '…'
                : videoFilename}
            </span>
          </div>
          <div className="export-info-row">
            <span className="export-info-label"><FiScissors /> Range</span>
            <span className="export-info-value">
              {formatTime(trimStart)} → {formatTime(trimEnd)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

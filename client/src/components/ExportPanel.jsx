import { FiScissors, FiRotateCcw, FiZap } from 'react-icons/fi';
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
  onReset,
}) {
  const hasRangeChanged = lastExportedRange && (trimStart !== lastExportedRange.start || trimEnd !== lastExportedRange.end);

  // If currently trimming, show compact processing indicator
  if (isTrimming) {
    return (
      <div className="export-panel glass-card fade-up">
        <div className="section-title"><FiZap /> Export</div>
        <div className="export-processing">
          <div className="export-processing-ring">
            <div className="export-processing-pulse"></div>
          </div>
          <p className="export-processing-text">
            Trimming {trimProgress > 0 ? `(${Math.round(trimProgress)}%)` : '...'}
          </p>
        </div>
      </div>
    );
  }

  // Show "Trim Another" reset button after a successful trim
  const showReset = trimResult && !hasRangeChanged;

  return (
    <div className="export-panel glass-card fade-up">
      <div className="section-title"><FiZap /> Export</div>

      {showReset ? (
        <div className="export-actions-group">
          <p className="export-success-note">Trim complete. Preview it in the player.</p>
          <button className="export-reset-btn" onClick={onReset}>
            <FiRotateCcw /> Trim Another
          </button>
        </div>
      ) : (
        <button
          className="export-btn"
          onClick={onTrim}
          disabled={!videoFilename}
        >
          <FiScissors /> {lastExportedRange ? 'Trim New Range' : 'Trim'}
        </button>
      )}
    </div>
  );
}

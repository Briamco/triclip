import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoTrimmer } from '../context/VideoTrimmerContext';
import VideoPlayer from '../components/VideoPlayer';
import TrimControls from '../components/TrimControls';
import TimeControls from '../components/TimeControls';
import VideoDetailsCard from '../components/VideoDetailsCard';
import ExportPanel from '../components/ExportPanel';
import { FiScissors, FiDownload, FiArrowLeft, FiLock } from 'react-icons/fi';
import './EditorPage.css';

export default function EditorPage() {
  const {
    video,
    trimRange,
    currentTime,
    isTrimming,
    trimProgress,
    trimResult,
    lastExportedRange,
    dailyTrims,
    config,
    handleTrimVideo,
    handleDownload,
    handleTrimChange,
    handleTimeUpdate,
    handleLoadedMetadata,
    handlePreview,
    resetState,
  } = useVideoTrimmer();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trim'); // 'trim' or 'export'
  const isLimitReached = dailyTrims >= config.dailyUsageLimit;

  // Auto-redirect to home if no video is loaded
  useEffect(() => {
    if (!video) {
      navigate('/');
    }
  }, [video, navigate]);

  if (!video) {
    return null; // Will navigate away
  }

  const handleBackToHome = () => {
    resetState();
    navigate('/');
  };

  return (
    <div className="editor-page fade-up">
      {/* Minimalist Editor Toolbar */}
      <div className="editor-toolbar">
        <div className="editor-toolbar-brand" onClick={() => {
          resetState();
          navigate('/');
        }}>
          <img src="/logo.svg" alt="Triclip" className="editor-toolbar-logo" />
          <div className="editor-brand-text-group">
            <span className="editor-toolbar-title">Triclip Editor</span>
            <div className="editor-toolbar-quota mobile-only-quota">
              Quota: <strong>{dailyTrims} / {config.dailyUsageLimit || 5}</strong>
            </div>
          </div>
        </div>

        {/* Desktop Quota Indicator */}
        <div className="editor-toolbar-quota desktop-only-quota">
          Quota: <strong>{dailyTrims} / {config.dailyUsageLimit || 5}</strong> used today
        </div>

        <div className="editor-toolbar-actions">
          <button className="editor-toolbar-btn" onClick={() => {
            resetState();
            navigate('/');
          }}>
            <FiArrowLeft /> Change Video
          </button>
        </div>
      </div>

      {/* ─── MAIN WORKSPACE (CapCut-style Layout) ─── */}
      <div className="workspace-container">
        <div className="workspace-upper">
          {/* Left Panel: Video Preview */}
          
            <VideoPlayer
              videoSrc={video.src}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              trimmedDuration={trimRange.end - trimRange.start}
            />

          {/* Right Panel: Side Controls (Time & Export Options) */}
          <div className="workspace-export-panel">
            {/* Selection Time Fields (Inputs & Buttons) */}
            <div className={`sidebar-block ${activeTab === 'trim' ? 'mobile-active' : 'mobile-hidden'}`}>
              <TimeControls
                duration={video.duration}
                trimStart={trimRange.start}
                trimEnd={trimRange.end}
                onTrimChange={handleTrimChange}
                onPreview={handlePreview}
              />
            </div>

            {/* Render Trim & Export actions */}
            <div className={`sidebar-block ${activeTab === 'export' ? 'mobile-active' : 'mobile-hidden'}`}>
              <ExportPanel
                videoFilename={video.filename}
                trimStart={trimRange.start}
                trimEnd={trimRange.end}
                isTrimming={isTrimming}
                trimProgress={trimProgress}
                trimResult={trimResult}
                lastExportedRange={lastExportedRange}
                onTrim={handleTrimVideo}
                onDownload={handleDownload}
                onReset={() => {
                  resetState();
                  navigate('/');
                }}
              />
              <div className="mobile-actions-nav">
                <button className="mobile-back-btn" onClick={() => setActiveTab('trim')}>
                  <FiScissors /> Back to Trimming
                </button>
              </div>
            </div>

            {/* Media Details & Hotkeys always visible on desktop, tied to trim tab on mobile */}
            <div className={`sidebar-block ${activeTab === 'trim' ? 'mobile-active' : 'mobile-hidden'}`}>
              <VideoDetailsCard video={video} />
            </div>
          </div>
        </div>

        {/* Bottom Panel: Full Width Timeline Track */}
        <div className={`workspace-lower ${activeTab === 'trim' ? 'mobile-active' : 'mobile-hidden'}`}>
          <TrimControls
            duration={video.duration}
            trimStart={trimRange.start}
            trimEnd={trimRange.end}
            currentTime={currentTime}
            onTrimChange={handleTrimChange}
            onPreview={handlePreview}
          />
          <div className="mobile-actions-nav">
            <button className="mobile-next-btn" onClick={() => setActiveTab('export')}>
              Continue to Export <FiDownload />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

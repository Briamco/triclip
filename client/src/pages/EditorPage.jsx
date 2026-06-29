import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoTrimmer } from '../context/VideoTrimmerContext';
import VideoPlayer from '../components/VideoPlayer';
import TrimControls from '../components/TrimControls';
import TimeControls from '../components/TimeControls';
import VideoDetailsCard from '../components/VideoDetailsCard';
import ExportPanel from '../components/ExportPanel';
import { FiArrowLeft } from 'react-icons/fi';
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
    handleTrimChange,
    handleTimeUpdate,
    handleLoadedMetadata,
    handlePreview,
    resetState,
  } = useVideoTrimmer();

  const navigate = useNavigate();
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
          <div className="workspace-player-panel">
            <VideoPlayer
              videoSrc={video.src}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              trimmedDuration={trimRange.end - trimRange.start}
            />
          </div>

          {/* Right Panel: Side Controls (Time & Export Options) */}
          <div className="workspace-export-panel">
            {/* Selection Time Fields (Inputs & Buttons) */}
            <div className="sidebar-block">
              <TimeControls
                duration={video.duration}
                trimStart={trimRange.start}
                trimEnd={trimRange.end}
                onTrimChange={handleTrimChange}
                onPreview={handlePreview}
              />
            </div>

            {/* Export Panel (Desktop & Tablet only) */}
            <div className="sidebar-block desktop-tablet-only-export">
              <ExportPanel
                videoFilename={video.filename}
                trimStart={trimRange.start}
                trimEnd={trimRange.end}
                isTrimming={isTrimming}
                trimProgress={trimProgress}
                trimResult={trimResult}
                lastExportedRange={lastExportedRange}
                onTrim={handleTrimVideo}
                onReset={() => {
                  resetState();
                  navigate('/');
                }}
              />
            </div>

            {/* Media Details & Hotkeys always visible on desktop, hidden on mobile */}
            <div className="sidebar-block">
              <VideoDetailsCard video={video} />
            </div>
          </div>
        </div>

        {/* Bottom Panel: Full Width Timeline Track & Export */}
        <div className="workspace-lower">
          <div className="timeline-workspace-wrapper">
            <div className="timeline-track-container">
              <TrimControls
                duration={video.duration}
                trimStart={trimRange.start}
                trimEnd={trimRange.end}
                currentTime={currentTime}
                onTrimChange={handleTrimChange}
                onPreview={handlePreview}
              />
            </div>
            
            {/* Export Panel (Mobile only) */}
            <div className="timeline-export-container mobile-only-export">
              <ExportPanel
                videoFilename={video.filename}
                trimStart={trimRange.start}
                trimEnd={trimRange.end}
                isTrimming={isTrimming}
                trimProgress={trimProgress}
                trimResult={trimResult}
                lastExportedRange={lastExportedRange}
                onTrim={handleTrimVideo}
                onReset={() => {
                  resetState();
                  navigate('/');
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

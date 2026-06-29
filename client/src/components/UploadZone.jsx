import { useState, useRef, useCallback } from 'react';
import { FiUploadCloud, FiLink, FiFilm, FiFile } from 'react-icons/fi';
import './UploadZone.css';

export default function UploadZone({ onUpload, onYoutube, isUploading, uploadProgress }) {
  const [activeTab, setActiveTab] = useState('file');
  const [isDragOver, setIsDragOver] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      onUpload(file);
    }
  }, [onUpload]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onUpload(file);
    }
  }, [onUpload]);

  const handleYoutubeSubmit = useCallback((e) => {
    e.preventDefault();
    if (youtubeUrl.trim()) {
      onYoutube(youtubeUrl.trim());
    }
  }, [youtubeUrl, onYoutube]);

  const isValidYoutubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)[\w-]+/;
    return pattern.test(url);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (isUploading) {
    const isFile = activeTab === 'file';
    return (
      <div className="upload-zone glass-card fade-up">
        <div className="section-title">
          <FiUploadCloud /> {isFile ? 'Uploading Local File' : 'Downloading YouTube Video'}
        </div>
        <div className="upload-loading">
          <div className="upload-loading-spinner"></div>
          <p className="upload-loading-text">
            {isFile 
              ? 'Sending video file to server...' 
              : uploadProgress > 0 
                ? `Downloading from YouTube: ${Math.round(uploadProgress)}%`
                : 'Connecting to YouTube and starting download...'}
          </p>
        </div>
        <div className="upload-progress">
          <div className="upload-progress-label">
            <span>{isFile ? 'Uploading' : 'Downloading'}</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="upload-progress-bar-track">
            <div
              className="upload-progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-zone glass-card fade-up">
      <div className="section-title"><FiUploadCloud /> Source</div>

      <div className="upload-tabs">
        <button
          className={`upload-tab ${activeTab === 'file' ? 'active' : ''}`}
          onClick={() => setActiveTab('file')}
        >
          <FiUploadCloud /> File Upload
        </button>
        <button
          className={`upload-tab ${activeTab === 'youtube' ? 'active' : ''}`}
          onClick={() => setActiveTab('youtube')}
        >
          <FiLink /> YouTube URL
        </button>
      </div>

      {activeTab === 'file' ? (
        <>
          <div
            className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FiUploadCloud className="dropzone-icon" />
            <p className="dropzone-text">
              Drop your video here or <strong>browse</strong>
            </p>
            <p className="dropzone-hint">MP4, MOV, AVI, MKV — up to 1GB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="dropzone-input"
              onChange={handleFileSelect}
            />
          </div>
          {selectedFile && (
            <div className="file-info">
              <FiFile className="file-info-icon" />
              <span className="file-info-name">{selectedFile.name}</span>
              <span className="file-info-size">{formatFileSize(selectedFile.size)}</span>
            </div>
          )}
        </>
      ) : (
        <form className="youtube-form" onSubmit={handleYoutubeSubmit}>
          <div className="youtube-input-group">
            <input
              type="url"
              className="youtube-input"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />
            <button
              type="submit"
              className="youtube-submit"
              disabled={!isValidYoutubeUrl(youtubeUrl)}
            >
              <FiFilm style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Fetch
            </button>
          </div>
          <p className="youtube-hint">
            <FiLink /> Paste a YouTube video URL to download and trim
          </p>
        </form>
      )}
    </div>
  );
}

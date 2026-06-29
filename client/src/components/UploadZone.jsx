import { useState, useRef, useCallback } from 'react';
import { FiUploadCloud, FiFile } from 'react-icons/fi';
import './UploadZone.css';

export default function UploadZone({ onUpload, isUploading, uploadProgress }) {
  const [isDragOver, setIsDragOver] = useState(false);
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  if (isUploading) {
    return (
      <div className="upload-zone glass-card fade-up">
        <div className="section-title">
          <FiUploadCloud /> Uploading
        </div>
        <div className="upload-loading">
          <div className="upload-loading-spinner"></div>
          <p className="upload-loading-text">Sending video file to server...</p>
        </div>
        <div className="upload-progress">
          <div className="upload-progress-label">
            <span>Uploading</span>
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
    </div>
  );
}

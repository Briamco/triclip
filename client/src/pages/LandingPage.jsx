import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVideoTrimmer } from '../context/VideoTrimmerContext';
import UploadZone from '../components/UploadZone';
import { FiScissors, FiVideo, FiZap, FiLock, FiShield, FiClock } from 'react-icons/fi';
import './LandingPage.css';

export default function LandingPage() {
  const {
    video,
    isUploading,
    uploadProgress,
    handleUploadFile,
    handleFetchYoutube,
    dailyTrims,
    config
  } = useVideoTrimmer();
  
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();
  const uploadSectionRef = useRef(null);

  const isLimitReached = dailyTrims >= config.dailyUsageLimit;

  // Auto-redirect to editor once a video is successfully loaded
  useEffect(() => {
    if (video) {
      navigate('/editor');
    }
  }, [video, navigate]);

  const faqs = [
    {
      question: "What video formats are supported?",
      answer: "Triclip supports all popular video formats including MP4, WebM, MOV, AVI, and MKV. For online links, just paste any YouTube video (including Shorts and finished Lives), TikTok video, or Instagram Reel, and it will load instantly."
    },
    {
      question: "Will my trimmed videos lose quality?",
      answer: "Absolutely not. Most online editors re-compress your video, which takes time and reduces visual clarity. Triclip copies the exact audio and video streams between your selected timestamps, saving the file in seconds with zero quality loss."
    },
    {
      question: "Is there a file size limit?",
      answer: `Yes, you can upload local video files up to ${config.maxFileSizeReadable || '1 GB'}. For YouTube links, we fetch the best resolution available up to 1080p to keep processing fast and responsive.`
    },
    {
      question: "Are my files safe? Does Triclip store them?",
      answer: "Your privacy is our priority. All uploaded video files are temporarily saved in a secure directory on our server and automatically deleted when you close the tab, reset the editor, or begin trimming a new video. We do not keep copies, logs, or share your data."
    },
    {
      question: "Why is there a daily usage limit?",
      answer: `To keep Triclip 100% free of annoying ads for everyone, we limit the usage to ${config.dailyUsageLimit || 5} video exports per user per calendar day. This prevents server strain and ensures the highest speeds for all users.`
    },
    {
      question: "Can I use the exported videos on TikTok, Reels, or YouTube Shorts?",
      answer: "Yes! The exported video downloads directly to your device as a standard, high-quality MP4 file with no watermarks, ready to upload directly to any social media platform."
    }
  ];

  const handleStartEditing = () => {
    if (!isLimitReached) {
      uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing fade-up">
      {/* HERO SECTION */}
      <header className="landing-hero-section">
        <div className="landing-badge-promo">
          <FiZap /> Powered by High-Speed Stream Copy Technology
        </div>
        <h1 className="landing-title">
          Cut & Crop Videos <br />
          <span className="gradient-text">In Under Two Seconds.</span>
        </h1>
        <p className="landing-subtitle">
          The ultimate tool to trim local media files or download YouTube links. 
          No rendering lag, no watermark, and absolutely free.
        </p>

        <div className="hero-cta-group">
          {isLimitReached ? (
            <div className="quota-alert-box">
              <FiLock /> You have reached your daily quota limit of {config.dailyUsageLimit} trims. Come back tomorrow!
            </div>
          ) : (
            <button className="landing-btn-primary" onClick={handleStartEditing}>
              Start Trimming Now (Free)
            </button>
          )}
          <div className="hero-stats">
            <span>Daily Quota Remaining: <strong>{Math.max(0, config.dailyUsageLimit - dailyTrims)} / {config.dailyUsageLimit}</strong> videos today</span>
          </div>
        </div>
      </header>

      {/* UPLOADER INTEGRATION ON LANDING */}
      <section ref={uploadSectionRef} className="landing-upload-section">
        {isLimitReached ? (
          <div className="quota-blocked-card glass-card fade-up">
            <FiLock className="quota-blocked-icon" />
            <h2>Daily Limit Reached</h2>
            <p>You have reached your daily quota of {config.dailyUsageLimit} video trims. Please come back tomorrow to trim more videos.</p>
          </div>
        ) : (
          <div className="landing-uploader-wrap">
            <div className="uploader-header">
              <h2>Upload or Paste Link to Begin</h2>
              <p>Supports MP4, WebM, MOV, YouTube, TikTok and Instagram links up to {config.maxFileSizeReadable}</p>
            </div>
            <UploadZone
              onUpload={handleUploadFile}
              onYoutube={handleFetchYoutube}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>
        )}
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="landing-section">
        <h2 className="section-main-title">How It Works</h2>
        <p className="section-main-subtitle">Surgical trimming in 3 simple steps.</p>
        
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Select Source</h3>
            <p>Drag & drop your local video (up to 1GB) or paste a YouTube / live stream link to download it automatically.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Pinpoint Timeline</h3>
            <p>Use our draggable slider handles or write precise timestamps manually down to milliseconds to crop the exact segment.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Export & Download</h3>
            <p>Hit 'Trim & Export'. Our engine copies the video stream directly and downloads the clip instantly to your device.</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="landing-section bg-surface">
        <h2 className="section-main-title">Key Features</h2>
        <p className="section-main-subtitle">Everything you need to crop video files seamlessly.</p>
        
        <div className="landing-grid">
          <div className="landing-card">
            <div className="landing-card-icon"><FiZap /></div>
            <h3>Instant Stream Copying</h3>
            <p>Bypasses normal rendering. Extracts and packages the video directly between keyframes in seconds.</p>
          </div>
          <div className="landing-card">
            <div className="landing-card-icon"><FiVideo /></div>
            <h3>YouTube & Live Support</h3>
            <p>Supports YouTube Shorts, standard videos, and live broadcasts. Works automatically on the fly.</p>
          </div>
          <div className="landing-card">
            <div className="landing-card-icon"><FiShield /></div>
            <h3>Privacy Assured</h3>
            <p>Files are cached temporarily during trimming and instantly deleted on reset or tab close. We keep no logs.</p>
          </div>
          <div className="landing-card">
            <div className="landing-card-icon"><FiClock /></div>
            <h3>Millisecond Precision</h3>
            <p>Type manual timestamps or use keyframe seek shortcuts (arrow keys) to get frame-accurate segments.</p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="landing-section">
        <h2 className="section-main-title">Frequently Asked Questions</h2>
        <p className="section-main-subtitle">Clear answers to common questions about Triclip.</p>
        
        <div className="faq-accordion">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${activeFaq === index ? 'active' : ''}`}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-toggle-icon">{activeFaq === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer-wrapper">
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <img src="/logo.svg" alt="Triclip Logo" className="footer-logo-img" style={{ width: 24, height: 24 }} />
            <span>Triclip</span>
          </div>
          <p>High-fidelity, zero-lag video cropping tool. Developed locally using React, Express, and FFmpeg.</p>
          <div className="footer-copyright">
            © 2026 Triclip. MIT License. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

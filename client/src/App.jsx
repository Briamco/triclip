import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ToastContainer from './components/Toast';
import { useVideoTrimmer } from './context/VideoTrimmerContext';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import { FiScissors, FiZap, FiLock } from 'react-icons/fi';
import './App.css';

export default function App() {
  const {
    video,
    dailyTrims,
    toasts,
    removeToast,
    resetState
  } = useVideoTrimmer();

  const navigate = useNavigate();
  const location = useLocation();
  const isLimitReached = dailyTrims >= 5;

  const handleBrandClick = () => {
    resetState();
    navigate('/');
  };

  const handleOpenEditor = () => {
    if (video) {
      navigate('/editor');
    } else {
      navigate('/');
      // Wait for navigation then scroll to upload section
      setTimeout(() => {
        const uploadEl = document.querySelector('.landing-upload-section');
        uploadEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="app">
      {/* ─── APP GLOBAL NAVBAR (Hidden in Editor) ─── */}
      {location.pathname !== '/editor' && (
        <nav className="navbar">
          <div className="navbar-container">
            <div className="navbar-brand" onClick={handleBrandClick}>
              <img src="/logo.svg" alt="Triclip Logo" className="navbar-logo-img" />
              <span>Triclip</span>
            </div>
            <div className="navbar-links">
              <Link to="/" onClick={() => {
                if (location.pathname !== '/') return;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>Home</Link>
              <a href="#how-it-works" onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}>How it works</a>
              <a href="#features" onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}>Features</a>
              <a href="#faq" onClick={(e) => {
                if (location.pathname !== '/') {
                  e.preventDefault();
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}>FAQ</a>
            </div>
            <div className="navbar-actions">
              {isLimitReached ? (
                <button className="navbar-btn disabled" disabled>
                  <FiLock /> Limit Reached
                </button>
              ) : (
                <button className="navbar-btn" onClick={handleOpenEditor}>
                  {video ? 'Open Editor' : 'Upload Video'}
                </button>
              )}
            </div>
          </div>
        </nav>
      )}

      <div className={`app-container ${location.pathname === '/editor' ? 'editor-mode-container' : ''}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

import { FiFilm, FiScissors } from 'react-icons/fi';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand">
          <img src="/logo.svg" alt="Triclip Logo" style={{ width: 32, height: 32, marginRight: 8 }} />
          <div>
            <h1 className="header-title">Triclip</h1>
            <p className="header-tagline">
              <FiFilm style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Precision Video Trimming
            </p>
          </div>
        </div>
        <div className="header-badge">
          <span className="header-badge-dot"></span>
          v1.0.0
        </div>
      </div>
    </header>
  );
}

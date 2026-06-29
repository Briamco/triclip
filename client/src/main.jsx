import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { VideoTrimmerProvider } from './context/VideoTrimmerContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <VideoTrimmerProvider>
        <App />
      </VideoTrimmerProvider>
    </BrowserRouter>
  </StrictMode>,
);

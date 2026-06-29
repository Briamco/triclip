import { createContext, useContext } from 'react';
import useVideoTrimmerHook from '../hooks/useVideoTrimmer';

const VideoTrimmerContext = createContext(null);

export function VideoTrimmerProvider({ children }) {
  const trimmer = useVideoTrimmerHook();

  return (
    <VideoTrimmerContext.Provider value={trimmer}>
      {children}
    </VideoTrimmerContext.Provider>
  );
}

export function useVideoTrimmer() {
  const context = useContext(VideoTrimmerContext);
  if (!context) {
    throw new Error('useVideoTrimmer must be used within a VideoTrimmerProvider');
  }
  return context;
}

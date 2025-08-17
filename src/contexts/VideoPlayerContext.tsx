import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VideoPlayerState {
  isOpen: boolean;
  videoUrl: string;
  title: string;
  isMinimized: boolean;
}

interface VideoPlayerContextType {
  videoPlayer: VideoPlayerState;
  openVideo: (url: string, title: string) => void;
  closeVideo: () => void;
  toggleMinimize: () => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(undefined);

export const VideoPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [videoPlayer, setVideoPlayer] = useState<VideoPlayerState>({
    isOpen: false,
    videoUrl: '',
    title: '',
    isMinimized: false,
  });

  const openVideo = (url: string, title: string) => {
    setVideoPlayer({
      isOpen: true,
      videoUrl: url,
      title,
      isMinimized: false,
    });
  };

  const closeVideo = () => {
    setVideoPlayer(prev => ({
      ...prev,
      isOpen: false,
    }));
  };

  const toggleMinimize = () => {
    setVideoPlayer(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  };

  return (
    <VideoPlayerContext.Provider value={{
      videoPlayer,
      openVideo,
      closeVideo,
      toggleMinimize,
    }}>
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (context === undefined) {
    throw new Error('useVideoPlayer must be used within a VideoPlayerProvider');
  }
  return context;
};
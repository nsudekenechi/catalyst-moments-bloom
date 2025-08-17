import React from 'react';
import InlineVideoPlayer from '@/components/ui/inline-video-player';
import { useVideoPlayer } from '@/contexts/VideoPlayerContext';

const GlobalVideoPlayer = () => {
  const { videoPlayer, closeVideo, toggleMinimize } = useVideoPlayer();

  return (
    <InlineVideoPlayer
      isOpen={videoPlayer.isOpen}
      onClose={closeVideo}
      videoUrl={videoPlayer.videoUrl}
      title={videoPlayer.title}
      isMinimized={videoPlayer.isMinimized}
      onToggleMinimize={toggleMinimize}
    />
  );
};

export default GlobalVideoPlayer;
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useVideoPlayer } from "@/contexts/VideoPlayerContext";
import { VideoPlayerProps } from './types';

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const { openVideo } = useVideoPlayer();
  console.log('VideoPlayer - URL:', videoUrl, 'Title:', title);

  if (!videoUrl) {
    return (
      <div className="w-full mb-6">
        <h4 className="font-medium mb-2">Exercise Video:</h4>
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">No video available for this exercise</p>
        </div>
      </div>
    );
  }

  const handlePlayVideo = () => {
    openVideo(videoUrl, title || 'Workout Video');
  };

  return (
    <div className="w-full mb-6">
      <h4 className="font-medium mb-2">Exercise Video:</h4>
      <div className="aspect-video bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
        <Button
          onClick={handlePlayVideo}
          size="lg"
          className="bg-white/90 text-primary hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <Play className="h-6 w-6 mr-2" />
          Play Workout Video
        </Button>
      </div>
    </div>
  );
}

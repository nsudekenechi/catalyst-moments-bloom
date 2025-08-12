import { VideoPlayerProps } from './types';

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  console.log('VideoPlayer - URL:', videoUrl, 'Title:', title);
  
  const isMp4 = /\.mp4($|[?])/i.test(videoUrl || '');

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

  return (
    <div className="w-full mb-6">
      <h4 className="font-medium mb-2">Exercise Video:</h4>
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        {isMp4 ? (
          <video
            src={videoUrl}
            controls
            playsInline
            className="w-full h-full"
            title={title}
          />
        ) : (
          <iframe
            src={videoUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}

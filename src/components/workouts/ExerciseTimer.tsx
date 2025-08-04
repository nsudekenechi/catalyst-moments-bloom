import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward, Clock } from "lucide-react";
import { ExerciseTimerProps } from './types';

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function ExerciseTimer({ 
  duration, 
  timeRemaining, 
  isPlaying, 
  isCompleted,
  onStartPause, 
  onSkip, 
  canSkip 
}: ExerciseTimerProps) {
  return (
    <div className="text-center space-y-4">
      {/* Timer Display */}
      <div className="text-6xl font-bold text-primary mb-2">
        {formatTime(timeRemaining)}
      </div>
      
      {/* Duration Info */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>{formatTime(duration)} total</span>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onStartPause}
          size="lg"
          className="px-8"
          disabled={isCompleted || timeRemaining === 0}
        >
          {isPlaying ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start
            </>
          )}
        </Button>
        
        {canSkip && (
          <Button
            variant="outline"
            onClick={onSkip}
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
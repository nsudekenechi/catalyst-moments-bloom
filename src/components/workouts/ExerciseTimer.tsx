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
  const progressPercentage = ((duration - timeRemaining) / duration) * 100;
  
  return (
    <div className="text-center space-y-6">
      {/* Timer Display */}
      <div className="space-y-4">
        <div className="text-6xl font-bold text-primary">
          {formatTime(timeRemaining)}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full max-w-xs mx-auto">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Duration Info */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatTime(duration)} total</span>
        </div>
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
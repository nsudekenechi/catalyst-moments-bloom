import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Timer, AlertTriangle, TrendingUp, Baby } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contraction {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  intensity: number; // 1-10 scale
}

export const ContractionTracker = () => {
  const { toast } = useToast();
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [currentContraction, setCurrentContraction] = useState<Contraction | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const startContraction = () => {
    const now = new Date();
    const newContraction: Contraction = {
      id: Date.now().toString(),
      startTime: now,
      duration: 0,
      intensity: 5
    };
    setCurrentContraction(newContraction);
    setIsTracking(true);
    
    toast({
      title: "Contraction started",
      description: "Tap 'End' when the contraction finishes",
    });
  };

  const endContraction = (intensity: number = 5) => {
    if (!currentContraction) return;
    
    const now = new Date();
    const duration = Math.floor((now.getTime() - currentContraction.startTime.getTime()) / 1000);
    
    const completedContraction: Contraction = {
      ...currentContraction,
      endTime: now,
      duration,
      intensity
    };

    setContractions(prev => [completedContraction, ...prev].slice(0, 20)); // Keep last 20
    setCurrentContraction(null);
    setIsTracking(false);
    
    // Check if labor is approaching
    checkLaborSigns([completedContraction, ...contractions]);
    
    toast({
      title: "Contraction logged",
      description: `Duration: ${formatDuration(duration)} • Intensity: ${intensity}/10`,
    });
  };

  const checkLaborSigns = (allContractions: Contraction[]) => {
    if (allContractions.length < 3) return;
    
    const recent = allContractions.slice(0, 5);
    const intervals = [];
    
    for (let i = 0; i < recent.length - 1; i++) {
      const interval = (recent[i].startTime.getTime() - recent[i + 1].startTime.getTime()) / 1000 / 60;
      intervals.push(interval);
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const avgDuration = recent.reduce((sum, c) => sum + c.duration, 0) / recent.length;
    const avgIntensity = recent.reduce((sum, c) => sum + c.intensity, 0) / recent.length;
    
    // Labor warning signs
    if (avgInterval <= 5 && avgDuration >= 60 && avgIntensity >= 7) {
      toast({
        title: "⚠️ Possible Labor",
        description: "Contractions are 5 minutes apart, lasting 1+ minute. Contact your provider!",
        variant: "destructive",
      });
    } else if (avgInterval <= 10 && avgDuration >= 45) {
      toast({
        title: "🚨 Early Labor Signs",
        description: "Contractions are getting regular. Monitor closely and prepare.",
      });
    }
  };

  const deleteContraction = (id: string) => {
    setContractions(prev => prev.filter(c => c.id !== id));
  };

  const getCurrentDuration = () => {
    if (!currentContraction) return 0;
    return Math.floor((currentTime.getTime() - currentContraction.startTime.getTime()) / 1000);
  };

  const getAverageInterval = () => {
    if (contractions.length < 2) return null;
    const recent = contractions.slice(0, 5);
    const intervals = [];
    
    for (let i = 0; i < recent.length - 1; i++) {
      const interval = (recent[i].startTime.getTime() - recent[i + 1].startTime.getTime()) / 1000 / 60;
      intervals.push(interval);
    }
    
    return intervals.length > 0 ? intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length : null;
  };

  const getAverageDuration = () => {
    if (contractions.length === 0) return null;
    const recent = contractions.slice(0, 5);
    return recent.reduce((sum, c) => sum + c.duration, 0) / recent.length;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return 'bg-green-500';
    if (intensity <= 6) return 'bg-yellow-500';
    if (intensity <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getLaborStatus = () => {
    const avgInterval = getAverageInterval();
    const avgDuration = getAverageDuration();
    
    if (!avgInterval || !avgDuration) return { status: 'monitoring', color: 'blue', message: 'Keep tracking contractions' };
    
    if (avgInterval <= 5 && avgDuration >= 60) {
      return { status: 'active-labor', color: 'red', message: 'Possible active labor - contact provider!' };
    } else if (avgInterval <= 10 && avgDuration >= 45) {
      return { status: 'early-labor', color: 'orange', message: 'Early labor signs - monitor closely' };
    } else if (avgInterval <= 20) {
      return { status: 'pre-labor', color: 'yellow', message: 'Pre-labor contractions' };
    }
    
    return { status: 'monitoring', color: 'blue', message: 'Continue monitoring' };
  };

  const laborStatus = getLaborStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Timer className="mr-2 h-5 w-5 text-purple-500" />
            Contraction Tracker
          </div>
          <Badge variant="outline" className={`bg-${laborStatus.color}-50 border-${laborStatus.color}-200`}>
            {laborStatus.status}
          </Badge>
        </CardTitle>
        <CardDescription>
          Track timing and intensity to identify labor patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Contraction */}
        {isTracking ? (
          <div className="text-center space-y-4 p-4 bg-purple-50 rounded-lg">
            <div className="text-4xl font-bold text-purple-600">
              {formatDuration(getCurrentDuration())}
            </div>
            <div className="text-sm text-purple-700">Contraction in progress...</div>
            
            {/* Intensity Selection */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Rate intensity (1-10):</p>
              <div className="flex justify-center space-x-1">
                {[1,2,3,4,5,6,7,8,9,10].map(num => (
                  <Button
                    key={num}
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 text-xs"
                    onClick={() => endContraction(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => endContraction(5)}
              className="bg-purple-500 hover:bg-purple-600"
            >
              End Contraction
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <Button 
              onClick={startContraction}
              className="bg-purple-500 hover:bg-purple-600"
              size="lg"
            >
              Start Contraction
            </Button>
          </div>
        )}

        {/* Labor Status */}
        {contractions.length > 0 && (
          <div className={`p-3 bg-${laborStatus.color}-50 rounded-lg border border-${laborStatus.color}-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {laborStatus.status === 'active-labor' ? (
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                ) : laborStatus.status === 'early-labor' ? (
                  <Baby className="h-4 w-4 text-orange-600 mr-2" />
                ) : (
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                )}
                <span className="font-medium text-sm">{laborStatus.message}</span>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {contractions.length > 1 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-medium">
                {getAverageInterval() ? `${Math.round(getAverageInterval()!)}m` : '-'}
              </div>
              <p className="text-xs text-muted-foreground">Avg interval</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-medium">
                {getAverageDuration() ? formatDuration(Math.round(getAverageDuration()!)) : '-'}
              </div>
              <p className="text-xs text-muted-foreground">Avg duration</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-medium">{contractions.length}</div>
              <p className="text-xs text-muted-foreground">Total logged</p>
            </div>
          </div>
        )}

        {/* Recent Contractions */}
        {contractions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Contractions</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {contractions.slice(0, 8).map((contraction, index) => {
                const nextContraction = contractions[index + 1];
                const interval = nextContraction 
                  ? Math.round((contraction.startTime.getTime() - nextContraction.startTime.getTime()) / 1000 / 60)
                  : null;
                
                return (
                  <div key={contraction.id} className="flex justify-between items-center p-2 bg-muted/20 rounded text-xs">
                    <div className="flex items-center space-x-2">
                      <span>{formatTime(contraction.startTime)}</span>
                      <span>•</span>
                      <span>{formatDuration(contraction.duration)}</span>
                      <div className={`w-2 h-2 rounded-full ${getIntensityColor(contraction.intensity)}`} />
                      <span>{contraction.intensity}/10</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {interval && <span className="text-muted-foreground">{interval}m apart</span>}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => deleteContraction(contraction.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Labor Guidelines */}
        <div className="p-3 bg-orange-50 rounded-lg text-sm">
          <p className="font-medium mb-1">🚨 When to call your provider:</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Contractions 5 minutes apart for 1 hour</li>
            <li>• Contractions lasting 60+ seconds</li>
            <li>• Water breaks or bleeding</li>
            <li>• Severe pain or decreased baby movement</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
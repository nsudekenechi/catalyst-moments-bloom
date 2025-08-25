import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Heart, Timer, RotateCcw, TrendingUp, AlertTriangle, Calendar, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface KickSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  kickCount: number;
  duration: number; // in minutes
}

interface DailyData {
  date: string;
  totalKicks: number;
  sessions: number;
  avgDuration: number;
}

export const BabyKickCounter = () => {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(false);
  const [kickCount, setKickCount] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0);
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [showCharts, setShowCharts] = useState(false);

  // Load saved sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('kickCounterSessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
  }, []);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('kickCounterSessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Timer for tracking duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000 / 60);
        setDuration(diff);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const startTracking = () => {
    const now = new Date();
    setIsTracking(true);
    setStartTime(now);
    setKickCount(0);
    setDuration(0);
    toast({
      title: "Kick counting started",
      description: "Tap the heart when you feel baby move!",
    });
  };

  const stopTracking = () => {
    if (!startTime) return;
    
    const endTime = new Date();
    const sessionDuration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);
    
    const newSession: KickSession = {
      id: Date.now().toString(),
      date: startTime.toDateString(),
      startTime: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      kickCount,
      duration: sessionDuration
    };

    setSessions(prev => [newSession, ...prev].slice(0, 10)); // Keep last 10 sessions
    setIsTracking(false);
    setStartTime(null);
    setDuration(0);
    
    // Provide feedback based on results
    if (kickCount >= 10) {
      toast({
        title: "Great session!",
        description: `Counted ${kickCount} movements in ${sessionDuration} minutes. Baby is active!`,
      });
    } else if (sessionDuration >= 60) {
      toast({
        title: "Session completed",
        description: `${kickCount} movements in 1 hour. This is within normal range.`,
      });
    } else {
      toast({
        title: "Session saved",
        description: `${kickCount} movements tracked. Continue monitoring as recommended.`,
      });
    }
  };

  const recordKick = () => {
    if (!isTracking) return;
    setKickCount(prev => prev + 1);
    
    // Check if we've reached 10 kicks
    if (kickCount + 1 === 10 && duration < 60) {
      toast({
        title: "10 kicks reached!",
        description: `Great! Baby reached 10 movements in ${duration} minutes.`,
      });
    }
  };

  const resetSession = () => {
    setIsTracking(false);
    setKickCount(0);
    setStartTime(null);
    setDuration(0);
  };

  const getAverageKicks = () => {
    if (sessions.length === 0) return 0;
    const total = sessions.reduce((sum, session) => sum + session.kickCount, 0);
    return Math.round(total / sessions.length);
  };

  const getProgressColor = () => {
    if (kickCount >= 10) return "bg-green-500";
    if (kickCount >= 6) return "bg-yellow-500";
    return "bg-blue-500";
  };

  // Prepare chart data
  const getDailyData = (): DailyData[] => {
    const dailyMap = new Map<string, { kicks: number; sessions: number; totalDuration: number }>();
    
    sessions.forEach(session => {
      const date = new Date(session.date).toLocaleDateString();
      const existing = dailyMap.get(date) || { kicks: 0, sessions: 0, totalDuration: 0 };
      dailyMap.set(date, {
        kicks: existing.kicks + session.kickCount,
        sessions: existing.sessions + 1,
        totalDuration: existing.totalDuration + session.duration
      });
    });

    return Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date: date.split('/').slice(0, 2).join('/'), // MM/DD format
        totalKicks: data.kicks,
        sessions: data.sessions,
        avgDuration: Math.round(data.totalDuration / data.sessions)
      }))
      .slice(-7); // Last 7 days
  };

  const checkMovementPattern = () => {
    const recentSessions = sessions.slice(0, 3);
    const lowMovementSessions = recentSessions.filter(s => s.kickCount < 10);
    
    if (lowMovementSessions.length >= 2) {
      return 'concern';
    } else if (recentSessions.length > 0 && recentSessions.every(s => s.kickCount >= 10)) {
      return 'excellent';
    }
    return 'normal';
  };

  const chartConfig = {
    totalKicks: {
      label: "Total Kicks",
      color: "hsl(var(--primary))",
    },
    sessions: {
      label: "Sessions",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-pink-500" />
            Baby Kick Counter
          </div>
          {isTracking && (
            <Badge variant="outline" className="bg-pink-50 border-pink-200">
              <Timer className="mr-1 h-3 w-3" />
              {duration}m
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Track your baby's movements. Aim for 10 kicks in 2 hours or less.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Session */}
        <div className="text-center space-y-4">
          <div className="text-6xl font-bold text-pink-500">
            {kickCount}
          </div>
          <div className="text-sm text-muted-foreground">
            {isTracking ? "Movements counted" : "Ready to start counting"}
          </div>
          
          {isTracking && (
            <div className="space-y-2">
              <Progress 
                value={(kickCount / 10) * 100} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                {kickCount}/10 movements • {duration} minutes
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isTracking ? (
            <Button 
              onClick={startTracking}
              className="w-full bg-pink-500 hover:bg-pink-600"
              size="lg"
            >
              Start Kick Counting
            </Button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={recordKick}
                className="bg-pink-500 hover:bg-pink-600"
                size="lg"
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                onClick={stopTracking}
                variant="outline"
                size="lg"
              >
                Stop
              </Button>
              <Button
                onClick={resetSession}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Charts Toggle */}
        {sessions.length > 3 && (
          <div className="flex justify-center pt-4 border-t">
            <Button
              onClick={() => setShowCharts(!showCharts)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              {showCharts ? 'Hide Charts' : 'View Trends'}
            </Button>
          </div>
        )}

        {/* Movement Pattern Alert */}
        {sessions.length > 2 && (
          <div className={`p-3 rounded-lg text-sm ${
            checkMovementPattern() === 'concern' 
              ? 'bg-red-50 border border-red-200' 
              : checkMovementPattern() === 'excellent'
              ? 'bg-green-50 border border-green-200'
              : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center mb-1">
              {checkMovementPattern() === 'concern' && (
                <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
              )}
              <p className="font-medium">
                {checkMovementPattern() === 'concern' && 'Movement Pattern Notice'}
                {checkMovementPattern() === 'excellent' && 'Excellent Movement Pattern!'}
                {checkMovementPattern() === 'normal' && 'Normal Movement Pattern'}
              </p>
            </div>
            <div className="text-xs">
              {checkMovementPattern() === 'concern' && (
                <span className="text-red-700">
                  Your recent sessions show fewer movements than usual. Consider contacting your healthcare provider if this pattern continues.
                </span>
              )}
              {checkMovementPattern() === 'excellent' && (
                <span className="text-green-700">
                  Your baby is showing consistent, healthy movement patterns. Keep up the great monitoring!
                </span>
              )}
              {checkMovementPattern() === 'normal' && (
                <span className="text-blue-700">
                  Your baby's movement pattern appears normal. Continue regular monitoring as recommended.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Charts Section */}
        {showCharts && sessions.length > 3 && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Daily Movement Trends (Last 7 Days)
              </h4>
              <ChartContainer config={chartConfig} className="h-[200px]">
                <LineChart data={getDailyData()}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="totalKicks" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ChartContainer>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Sessions Per Day</h4>
              <ChartContainer config={chartConfig} className="h-[150px]">
                <BarChart data={getDailyData()}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="sessions" 
                    fill="hsl(var(--secondary))" 
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-3 pt-4 border-t">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                <span className="font-medium">{getAverageKicks()}</span>
              </div>
              <p className="text-xs text-muted-foreground">Avg kicks</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-medium">{sessions.length}</div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="font-medium">
                {sessions.reduce((sum, s) => sum + s.kickCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total kicks</p>
            </div>
          </div>
        )}

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Sessions</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {sessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex justify-between items-center p-2 bg-muted/20 rounded text-xs">
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                  <span>{session.kickCount} kicks in {session.duration}m</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <p className="font-medium mb-1">💡 Tips for kick counting:</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Count when baby is usually active (after meals/evening)</li>
            <li>• Lie on your side in a quiet place</li>
            <li>• Count movements, kicks, flutters, or rolls</li>
            <li>• Contact your provider if fewer than 10 in 2 hours</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
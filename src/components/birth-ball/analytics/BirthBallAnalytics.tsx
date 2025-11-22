import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { TopExercisesChart } from './TopExercisesChart';
import { WeeklyStreakCalendar } from './WeeklyStreakCalendar';
import { TimeSpentChart } from './TimeSpentChart';
import { AnalyticsStats } from './AnalyticsStats';
import { format, subDays, startOfDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export const BirthBallAnalytics = () => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topExercises, setTopExercises] = useState<Array<{ name: string; count: number }>>([]);
  const [practiceDays, setPracticeDays] = useState<Date[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [timeData, setTimeData] = useState<Array<{ date: string; minutes: number }>>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [avgSessionMinutes, setAvgSessionMinutes] = useState(0);
  const [totalExercises, setTotalExercises] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [favoriteTrimester, setFavoriteTrimester] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      loadAnalytics();
      
      // Setup realtime subscription
      const channel = supabase
        .channel('birth-ball-analytics')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'birth_ball_exercise_logs',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            loadAnalytics();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: logs } = await supabase
        .from('birth_ball_exercise_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (logs && logs.length > 0) {
        // Calculate top exercises
        const exerciseCounts: Record<string, number> = {};
        logs.forEach(log => {
          exerciseCounts[log.exercise_name] = (exerciseCounts[log.exercise_name] || 0) + 1;
        });
        const top = Object.entries(exerciseCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));
        setTopExercises(top);

        // Calculate practice days and streaks
        const uniqueDays = Array.from(new Set(
          logs.map(log => startOfDay(new Date(log.completed_at)).toISOString())
        )).map(date => new Date(date));
        setPracticeDays(uniqueDays);

        const { current, longest } = calculateStreaks(uniqueDays);
        setCurrentStreak(current);
        setLongestStreak(longest);

        // Calculate time data for last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));
        const timeByDay = last7Days.map(day => {
          const dayStart = startOfDay(day);
          const dayLogs = logs.filter(log => {
            const logDay = startOfDay(new Date(log.completed_at));
            return logDay.getTime() === dayStart.getTime();
          });
          const minutes = Math.round(dayLogs.reduce((sum, log) => sum + (log.duration_seconds || 0), 0) / 60);
          return {
            date: format(day, 'MM/dd'),
            minutes
          };
        });
        setTimeData(timeByDay);

        // Calculate total time and average
        const totalSeconds = logs.reduce((sum, log) => sum + (log.duration_seconds || 0), 0);
        const totalMins = Math.round(totalSeconds / 60);
        setTotalMinutes(totalMins);

        const uniqueSessions = new Set(logs.map(log => log.session_id)).size;
        setTotalSessions(uniqueSessions);
        const avgMins = uniqueSessions > 0 ? Math.round(totalMins / uniqueSessions) : 0;
        setAvgSessionMinutes(avgMins);

        // Calculate stats
        setTotalExercises(logs.length);

        // Calculate favorite trimester
        const trimesterCounts: Record<number, number> = {};
        logs.forEach(log => {
          if (log.trimester) {
            trimesterCounts[log.trimester] = (trimesterCounts[log.trimester] || 0) + 1;
          }
        });
        const favorite = Object.entries(trimesterCounts).sort(([, a], [, b]) => b - a)[0];
        setFavoriteTrimester(favorite ? parseInt(favorite[0]) : null);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStreaks = (days: Date[]) => {
    if (days.length === 0) return { current: 0, longest: 0 };

    const sorted = days.sort((a, b) => b.getTime() - a.getTime());
    let current = 0;
    let longest = 0;
    let tempStreak = 1;

    const today = startOfDay(new Date());
    const yesterday = startOfDay(subDays(today, 1));

    // Check if current streak is active
    if (
      startOfDay(sorted[0]).getTime() === today.getTime() ||
      startOfDay(sorted[0]).getTime() === yesterday.getTime()
    ) {
      current = 1;
      for (let i = 1; i < sorted.length; i++) {
        const diff = Math.round((sorted[i - 1].getTime() - sorted[i].getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          current++;
        } else {
          break;
        }
      }
    }

    // Calculate longest streak
    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.round((sorted[i - 1].getTime() - sorted[i].getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        tempStreak++;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 1;
      }
    }
    longest = Math.max(longest, tempStreak);

    return { current, longest };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Progress Analytics
            </CardTitle>
            <Button variant="ghost" size="sm">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{totalExercises}</div>
              <div className="text-xs text-muted-foreground">Exercises</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{totalMinutes}</div>
              <div className="text-xs text-muted-foreground">Minutes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analytics */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <AnalyticsStats
              totalExercises={totalExercises}
              totalSessions={totalSessions}
              favoriteTrimester={favoriteTrimester}
              badges={[]} // Can add badge logic later
            />

            <div className="grid md:grid-cols-2 gap-4">
              <TopExercisesChart data={topExercises} />
              <WeeklyStreakCalendar
                practiceDays={practiceDays}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
              />
            </div>

            <TimeSpentChart
              data={timeData}
              totalMinutes={totalMinutes}
              avgSessionMinutes={avgSessionMinutes}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
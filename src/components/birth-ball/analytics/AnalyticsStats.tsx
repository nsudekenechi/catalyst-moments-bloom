import { Card, CardContent } from '@/components/ui/card';
import { Award, Calendar, Target, Trophy } from 'lucide-react';

interface AnalyticsStatsProps {
  totalExercises: number;
  totalSessions: number;
  favoriteTrimester: number | null;
  badges: string[];
}

export const AnalyticsStats = ({ 
  totalExercises, 
  totalSessions, 
  favoriteTrimester,
  badges 
}: AnalyticsStatsProps) => {
  const stats = [
    {
      icon: Target,
      label: 'Exercises Completed',
      value: totalExercises,
      color: 'text-blue-500'
    },
    {
      icon: Calendar,
      label: 'Total Sessions',
      value: totalSessions,
      color: 'text-green-500'
    },
    {
      icon: Trophy,
      label: 'Favorite Trimester',
      value: favoriteTrimester ? `T${favoriteTrimester}` : 'N/A',
      color: 'text-purple-500'
    },
    {
      icon: Award,
      label: 'Badges Earned',
      value: badges.length,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4 flex flex-col items-center text-center">
            <stat.icon className={`w-8 h-8 mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
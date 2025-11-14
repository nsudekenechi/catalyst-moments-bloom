import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Calendar, Crown } from 'lucide-react';
import { format } from 'date-fns';

interface ProgressCardProps {
  stats: {
    totalCheckIns: number;
    daysActive: number;
    weightChange: number;
    measurementChanges: {
      waist?: number;
      hip?: number;
      chest?: number;
      thigh?: number;
    };
    startDate?: string;
    currentStreak?: number;
  };
  userName?: string;
  size?: 'sm' | 'md' | 'lg';
  showBranding?: boolean;
}

export const ProgressCard = ({ 
  stats, 
  userName = "Catalyst Mom Member",
  size = 'md',
  showBranding = true 
}: ProgressCardProps) => {
  const sizeClasses = {
    sm: 'w-80 h-96',
    md: 'w-96 h-[32rem]',
    lg: 'w-[28rem] h-[36rem]'
  };

  const totalInchesLost = Object.values(stats.measurementChanges).reduce(
    (sum, val) => sum + Math.abs(val || 0), 
    0
  );

  return (
    <Card className={`${sizeClasses[size]} relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-2 border-primary/20`}>
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold mb-1">Transformation Journey</h3>
            <p className="text-sm opacity-90">{userName}</p>
          </div>
          <Badge className="bg-primary-foreground text-primary">
            {stats.daysActive} Days
          </Badge>
        </div>
        
        {stats.startDate && (
          <div className="flex items-center gap-2 text-xs opacity-90 mt-3">
            <Calendar className="w-3 h-3" />
            Started {format(new Date(stats.startDate), 'MMM d, yyyy')}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="p-6 space-y-4">
        {/* Weight Change - Hero Stat */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Weight Change</span>
            {stats.weightChange < 0 ? (
              <TrendingDown className="w-5 h-5 text-primary" />
            ) : (
              <TrendingUp className="w-5 h-5 text-secondary" />
            )}
          </div>
          <div className="text-4xl font-bold gradient-text">
            {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)} lbs
          </div>
        </div>

        {/* Measurement Changes Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {totalInchesLost.toFixed(1)}"
            </div>
            <div className="text-xs text-muted-foreground">Total Inches Lost</div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">
              {stats.totalCheckIns}
            </div>
            <div className="text-xs text-muted-foreground">Check-Ins</div>
          </div>
        </div>

        {/* Individual Measurements */}
        {Object.keys(stats.measurementChanges).length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(stats.measurementChanges).map(([key, value]) => (
              value !== 0 && (
                <div key={key} className="bg-background rounded-lg p-3 border border-border/50">
                  <div className="text-xs text-muted-foreground capitalize mb-1">{key}</div>
                  <div className={`text-lg font-semibold ${value < 0 ? 'text-primary' : 'text-foreground'}`}>
                    {value > 0 ? '+' : ''}{value.toFixed(1)}"
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Current Streak */}
        {stats.currentStreak && stats.currentStreak > 0 && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-accent/50 rounded-lg border border-accent">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-bold text-accent-foreground">{stats.currentStreak} Week Streak!</div>
              <div className="text-xs text-muted-foreground">Keep it going!</div>
            </div>
          </div>
        )}
      </div>

      {/* Branding Footer */}
      {showBranding && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-border/50 p-4">
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Catalyst Mom</span>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-1">
            Your transformation starts here
          </p>
        </div>
      )}
    </Card>
  );
};

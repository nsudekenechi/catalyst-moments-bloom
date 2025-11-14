import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Award, Target, Crown, Sparkles } from 'lucide-react';

interface AchievementBadgeProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
    date?: string;
    level?: number;
  };
  size?: 'sm' | 'md' | 'lg';
  showBranding?: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  trophy: <Trophy className="w-full h-full" />,
  star: <Star className="w-full h-full" />,
  flame: <Flame className="w-full h-full" />,
  award: <Award className="w-full h-full" />,
  target: <Target className="w-full h-full" />,
  crown: <Crown className="w-full h-full" />,
  sparkles: <Sparkles className="w-full h-full" />,
};

export const AchievementBadge = ({ 
  achievement, 
  size = 'md',
  showBranding = true 
}: AchievementBadgeProps) => {
  const sizeClasses = {
    sm: 'w-64 h-80',
    md: 'w-80 h-96',
    lg: 'w-96 h-[28rem]'
  };

  const iconSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <Card className={`${sizeClasses[size]} relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20`}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
        {/* Icon */}
        <div className={`${iconSizes[size]} mb-6 text-primary bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full p-6 shadow-lg`}>
          {iconMap[achievement.icon] || <Trophy className="w-full h-full" />}
        </div>

        {/* Level Badge */}
        {achievement.level && (
          <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-1">
            Level {achievement.level}
          </Badge>
        )}

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3 gradient-text">
          {achievement.title}
        </h3>

        {/* Description */}
        <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-xs">
          {achievement.description}
        </p>

        {/* Date */}
        {achievement.date && (
          <p className="text-xs text-muted-foreground mb-6">
            Earned on {achievement.date}
          </p>
        )}

        {/* Branding */}
        {showBranding && (
          <div className="mt-auto pt-6 border-t border-border/50 w-full">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">Catalyst Mom</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Join the transformation journey
            </p>
          </div>
        )}
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-secondary/30 rounded-bl-lg" />
    </Card>
  );
};

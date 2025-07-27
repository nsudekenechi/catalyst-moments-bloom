import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Thermometer, Droplets, Moon, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CycleCalendar } from './CycleCalendar';

export const TTCTracker = () => {
  const { toast } = useToast();
  const [currentCycle, setCurrentCycle] = useState({
    day: 14,
    phase: 'fertile' as 'menstrual' | 'follicular' | 'fertile' | 'luteal'
  });

  const handleLogCycleData = (type: string) => {
    toast({
      title: "Cycle data logged",
      description: `${type} has been recorded in your TTC tracker`,
    });
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'bg-red-100 text-red-800';
      case 'follicular': return 'bg-blue-100 text-blue-800';
      case 'fertile': return 'bg-green-100 text-green-800';
      case 'luteal': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2 h-5 w-5" />
          TTC Cycle Tracker
        </CardTitle>
        <CardDescription>
          Track your cycle and fertility signs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold mb-1">Day {currentCycle.day}</div>
          <Badge className={getPhaseColor(currentCycle.phase)}>
            {currentCycle.phase.charAt(0).toUpperCase() + currentCycle.phase.slice(1)} Window
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            {currentCycle.phase === 'fertile' ? 'High fertility - optimal time for conception' : 
             currentCycle.phase === 'luteal' ? 'Post-ovulation phase' :
             currentCycle.phase === 'follicular' ? 'Pre-ovulation phase' :
             'Menstrual phase'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleLogCycleData('Temperature')}
            className="flex items-center gap-2"
          >
            <Thermometer className="h-4 w-4" />
            Log Temp
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleLogCycleData('Cervical Mucus')}
            className="flex items-center gap-2"
          >
            <Droplets className="h-4 w-4" />
            Log CM
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleLogCycleData('Mood')}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Log Mood
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleLogCycleData('Sleep')}
            className="flex items-center gap-2"
          >
            <Moon className="h-4 w-4" />
            Log Sleep
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium text-sm">Today's Fertility Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Stay hydrated and maintain a balanced diet</li>
            <li>• Consider prenatal vitamins with folic acid</li>
            <li>• Practice stress-reduction techniques</li>
          </ul>
        </div>

        <CycleCalendar />
      </CardContent>
    </Card>
  );
};
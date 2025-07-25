import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Heart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TTCWorkoutCard = () => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1506629905589-5d5b48f62a6a" 
          alt="TTC Fertility Yoga"
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            TTC Focus
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className="bg-pink-500 hover:bg-pink-600">
            Fertility
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Fertility Flow Yoga</CardTitle>
        <CardDescription>
          Gentle yoga sequence designed to support reproductive health and reduce stress
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex space-x-4 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">20 min</span>
          </div>
          <div className="flex items-center">
            <Heart className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Gentle</span>
          </div>
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Fertility</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground">
            Stress Relief
          </span>
          <span className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground">
            Hip Opening
          </span>
          <span className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground">
            Circulation
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/workouts/fertility-flow-yoga">
            Start Practice
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
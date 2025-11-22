import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Heart, CheckCircle } from 'lucide-react';
import { birthBallExercises } from '@/data/birthBallGuideData';
import { toast } from 'sonner';
import VideoPlayer from '@/components/workouts/VideoPlayer';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const BirthBallExercise = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const exercise = birthBallExercises.find(ex => ex.id === exerciseId);
  
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!exercise) return;
    const saved = localStorage.getItem('birthBallProgress');
    if (saved) {
      const data = JSON.parse(saved);
      setIsCompleted(data.completed?.includes(exercise.id) || false);
      setIsSaved(data.saved?.includes(exercise.id) || false);
    }
    // Start timer when page loads
    setStartTime(new Date());
  }, [exercise]);

  const toggleComplete = async () => {
    if (!exercise) return;
    const saved = localStorage.getItem('birthBallProgress');
    const data = saved ? JSON.parse(saved) : { completed: [], saved: [] };
    
    const newCompleted = isCompleted
      ? data.completed.filter((id: string) => id !== exercise.id)
      : [...data.completed, exercise.id];
    
    localStorage.setItem('birthBallProgress', JSON.stringify({
      completed: newCompleted,
      saved: data.saved
    }));
    
    setIsCompleted(!isCompleted);

    // Log to database if completing exercise and user is logged in
    if (!isCompleted && user && startTime) {
      const durationSeconds = Math.round((new Date().getTime() - startTime.getTime()) / 1000);
      const sessionId = crypto.randomUUID();

      try {
        await supabase.from('birth_ball_exercise_logs').insert({
          user_id: user.id,
          exercise_id: exercise.id,
          exercise_name: exercise.name,
          trimester: exercise.trimester,
          duration_seconds: durationSeconds,
          session_id: sessionId,
        });
      } catch (error) {
        console.error('Error logging exercise:', error);
      }
    }
    
    toast.success(isCompleted ? 'Marked as incomplete' : 'Exercise completed! 🎉');
  };

  const toggleSaved = () => {
    if (!exercise) return;
    const saved = localStorage.getItem('birthBallProgress');
    const data = saved ? JSON.parse(saved) : { completed: [], saved: [] };
    
    const newSaved = isSaved
      ? data.saved.filter((id: string) => id !== exercise.id)
      : [...data.saved, exercise.id];
    
    localStorage.setItem('birthBallProgress', JSON.stringify({
      completed: data.completed,
      saved: newSaved
    }));
    
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from favorites' : 'Added to favorites');
  };

  if (!exercise) {
    return (
      <PageLayout>
        <div className="container px-4 mx-auto py-8">
          <p>Exercise not found</p>
          <Button asChild>
            <Link to="/birth-ball-guide">Back to Guide</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container px-4 mx-auto py-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/birth-ball-guide/trimester-${exercise.trimester}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Trimester {exercise.trimester}
          </Link>
        </Button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Trimester {exercise.trimester}</Badge>
            <Badge variant="outline">{exercise.category}</Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">{exercise.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{exercise.duration}</span>
          </div>
        </div>

        {/* Visual Guide - Prominent Image Display */}
        {exercise.imageUrl && (
          <Card className="mb-8 overflow-hidden">
            <div className="relative">
              <img 
                src={exercise.imageUrl} 
                alt={`${exercise.name} demonstration`}
                className="w-full h-auto object-cover"
              />
              <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {exercise.duration}
              </div>
            </div>
          </Card>
        )}

        <div className="flex gap-3 mb-8">
          <Button onClick={toggleComplete} className="flex-1">
            <CheckCircle className="mr-2 h-4 w-4" />
            {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
          </Button>
          <Button onClick={toggleSaved} variant="outline" size="icon">
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-muted-foreground">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {exercise.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default BirthBallExercise;

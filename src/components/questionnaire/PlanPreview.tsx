import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, ArrowRight, Clock, Target, Utensils, Dumbbell, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuestionnaireState {
  motherhoodStage: string;
  fitnessGoal: string;
  workoutDays: string;
  dietaryPreferences: string[];
  planType: string;
  additionalNotes: string;
}

interface PlanPreviewProps {
  answers: QuestionnaireState;
  onStartOver: () => void;
}

export const PlanPreview = ({ answers, onStartOver }: PlanPreviewProps) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const { toast } = useToast();

  const generateDetailedPlan = () => {
    const goalText = {
      'lose-baby-weight': 'gentle weight loss',
      'build-strength': 'strength building', 
      'sculpt-tone': 'toning and sculpting',
      'maintain-fitness': 'fitness maintenance',
      'improve-stamina': 'stamina improvement',
      'prepare-birth': 'birth preparation',
      'recover-strength': 'postpartum recovery'
    }[answers.fitnessGoal] || 'wellness';

    const stageText = {
      'ttc': 'fertility-focused',
      'pregnant': 'pregnancy-safe',
      'postpartum-0-3': 'gentle recovery',
      'postpartum-3-12': 'rebuilding strength', 
      'general': 'mom-friendly'
    }[answers.motherhoodStage] || 'personalized';

    return {
      workoutPlan: {
        title: `${answers.workoutDays}-Day ${stageText.charAt(0).toUpperCase() + stageText.slice(1)} Workout Plan`,
        description: `Focused on ${goalText} with ${answers.motherhoodStage === 'pregnant' ? 'prenatal-safe' : 'effective'} exercises`,
        weeks: [
          {
            week: 1,
            theme: 'Foundation Building',
            workouts: [
              { day: 'Monday', type: 'Full Body Strength', duration: '20 min', exercises: ['Modified Squats', 'Wall Push-ups', 'Seated Rows', 'Plank Hold'] },
              { day: 'Wednesday', type: 'Cardio & Core', duration: '15 min', exercises: ['Walking/Marching', 'Modified Crunches', 'Glute Bridges', 'Breathing Exercises'] },
              { day: 'Friday', type: 'Flexibility & Recovery', duration: '25 min', exercises: ['Prenatal Yoga', 'Hip Flexor Stretches', 'Shoulder Rolls', 'Meditation'] }
            ]
          },
          {
            week: 2,
            theme: 'Building Momentum',
            workouts: [
              { day: 'Monday', type: 'Strength Training', duration: '25 min', exercises: ['Goblet Squats', 'Modified Push-ups', 'Resistance Band Rows', 'Side Plank'] },
              { day: 'Wednesday', type: 'Active Recovery', duration: '20 min', exercises: ['Gentle Walking', 'Foam Rolling', 'Stretching', 'Mindfulness'] },
              { day: 'Friday', type: 'Full Body Circuit', duration: '30 min', exercises: ['Bodyweight Squats', 'Mountain Climbers', 'Tricep Dips', 'Cool Down'] }
            ]
          }
        ]
      },
      mealPlan: {
        title: `7-Day ${answers.dietaryPreferences.length > 0 ? answers.dietaryPreferences.join(' & ') + ' ' : ''}Mom-Friendly Meal Plan`,
        description: 'Nutritious, easy-to-prepare meals that support your wellness goals',
        days: [
          {
            day: 'Monday',
            meals: {
              breakfast: 'Overnight Oats with Berries & Almonds',
              lunch: 'Quinoa Bowl with Roasted Vegetables',
              dinner: 'Baked Salmon with Sweet Potato & Greens',
              snacks: ['Greek Yogurt with Honey', 'Apple with Almond Butter']
            }
          },
          {
            day: 'Tuesday', 
            meals: {
              breakfast: 'Veggie Scramble with Whole Grain Toast',
              lunch: 'Lentil Soup with Side Salad',
              dinner: 'Herb-Crusted Chicken with Brown Rice',
              snacks: ['Hummus with Carrots', 'Mixed Nuts']
            }
          },
          {
            day: 'Wednesday',
            meals: {
              breakfast: 'Smoothie Bowl with Spinach & Banana',
              lunch: 'Turkey & Avocado Wrap',
              dinner: 'Vegetarian Stir-Fry with Tofu',
              snacks: ['Cheese & Whole Grain Crackers', 'Herbal Tea']
            }
          }
        ]
      }
    };
  };

  const plan = generateDetailedPlan();

  const handleAccessPlan = () => {
    toast({
      title: "Plan Access Demo",
      description: "This is where you'd implement your subscription/payment flow. Plan has been saved to your account!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Personalized Plan is Ready!</h1>
          <p className="text-muted-foreground">A complete wellness program designed just for you</p>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workout">Workout Plan</TabsTrigger>
            <TabsTrigger value="nutrition">Meal Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Plan Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {(answers.planType === 'workout' || answers.planType === 'both') && (
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Dumbbell className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Workout Plan</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{plan.workoutPlan.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>15-30 minutes per session</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{answers.workoutDays} days per week</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Progressive difficulty</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(answers.planType === 'meal' || answers.planType === 'both') && (
                    <div className="p-4 bg-accent/5 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Utensils className="w-5 h-5 text-accent" />
                        <h3 className="font-semibold">Meal Plan</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{plan.mealPlan.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>7 days of meals</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Shopping lists included</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Prep-ahead options</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Personalized For:</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{answers.motherhoodStage.replace('-', ' ').toUpperCase()}</Badge>
                    <Badge variant="outline">{answers.fitnessGoal.replace('-', ' ')}</Badge>
                    {answers.dietaryPreferences.length > 0 && 
                      answers.dietaryPreferences.map(pref => (
                        <Badge key={pref} variant="outline">{pref}</Badge>
                      ))
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workout" className="space-y-6">
            {answers.planType === 'workout' || answers.planType === 'both' ? (
              <Card>
                <CardHeader>
                  <CardTitle>{plan.workoutPlan.title}</CardTitle>
                  <p className="text-muted-foreground">{plan.workoutPlan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    {plan.workoutPlan.weeks.map((week) => (
                      <Button
                        key={week.week}
                        variant={selectedWeek === week.week ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedWeek(week.week)}
                      >
                        Week {week.week}
                      </Button>
                    ))}
                  </div>

                  {plan.workoutPlan.weeks
                    .filter(week => week.week === selectedWeek)
                    .map((week) => (
                      <div key={week.week} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">Week {week.week}: {week.theme}</h3>
                        </div>
                        
                        <div className="grid gap-4">
                          {week.workouts.map((workout, idx) => (
                            <div key={idx} className="p-4 border rounded-lg">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-medium">{workout.day} - {workout.type}</h4>
                                  <p className="text-sm text-muted-foreground">{workout.duration}</p>
                                </div>
                                <Badge variant="secondary">{workout.duration}</Badge>
                              </div>
                              <div className="space-y-1">
                                <h5 className="text-sm font-medium">Exercises:</h5>
                                <ul className="text-sm text-muted-foreground space-y-1">
                                  {workout.exercises.map((exercise, exerciseIdx) => (
                                    <li key={exerciseIdx}>• {exercise}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground">Workout plan not included in your selection</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            {answers.planType === 'meal' || answers.planType === 'both' ? (
              <Card>
                <CardHeader>
                  <CardTitle>{plan.mealPlan.title}</CardTitle>
                  <p className="text-muted-foreground">{plan.mealPlan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    {plan.mealPlan.days.map((day, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-3">{day.day}</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Main Meals</h5>
                            <ul className="space-y-1 text-sm">
                              <li><span className="font-medium">Breakfast:</span> {day.meals.breakfast}</li>
                              <li><span className="font-medium">Lunch:</span> {day.meals.lunch}</li>
                              <li><span className="font-medium">Dinner:</span> {day.meals.dinner}</li>
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium mb-2">Snacks</h5>
                            <ul className="space-y-1 text-sm">
                              {day.meals.snacks.map((snack, snackIdx) => (
                                <li key={snackIdx}>• {snack}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-10">
                  <p className="text-muted-foreground">Meal plan not included in your selection</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center space-y-4">
          <Button size="lg" className="w-full md:w-auto" onClick={handleAccessPlan}>
            Start My Journey Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          
          <div className="flex justify-center gap-4">
            <Button variant="ghost" onClick={onStartOver} className="text-sm">
              Create Different Plan
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground max-w-md mx-auto">
            Your plan has been automatically saved and you can access it anytime from your dashboard. Make adjustments as needed as your journey progresses.
          </div>
        </div>
      </div>
    </div>
  );
};
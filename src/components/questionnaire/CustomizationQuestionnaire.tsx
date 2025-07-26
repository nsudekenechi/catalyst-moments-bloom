import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Edit, Utensils, Dumbbell } from 'lucide-react';

const questionnaireSchema = z.object({
  fitnessGoal: z.string().min(1, "Please select a fitness goal"),
  dietaryRestrictions: z.array(z.string()).optional(),
  workoutDaysPerWeek: z.string().min(1, "Please select workout frequency"),
  fitnessLevel: z.string().min(1, "Please select your fitness level"),
  planType: z.string().min(1, "Please select plan type"),
  mealPreferences: z.array(z.string()).optional(),
  additionalNotes: z.string().optional(),
});

type QuestionnaireData = z.infer<typeof questionnaireSchema>;

interface WorkoutPlan {
  title: string;
  description: string;
  exercises: string[];
  duration: string;
  frequency: string;
}

interface MealPlan {
  title: string;
  description: string;
  meals: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  }[];
}

const CustomizationQuestionnaire: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'results'>('questionnaire');
  const [generatedWorkoutPlan, setGeneratedWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [generatedMealPlan, setGeneratedMealPlan] = useState<MealPlan | null>(null);
  const [submittedData, setSubmittedData] = useState<QuestionnaireData | null>(null);

  const form = useForm<QuestionnaireData>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      dietaryRestrictions: [],
      mealPreferences: [],
      additionalNotes: "",
    },
  });

  const generateWorkoutPlan = (data: QuestionnaireData): WorkoutPlan => {
    const workoutPlans = {
      beginner: {
        "lose weight": {
          title: "Beginner Weight Loss Plan",
          description: "A gentle introduction to fitness focused on burning calories and building healthy habits.",
          exercises: ["20-minute walks", "Bodyweight squats", "Modified push-ups", "Planks (15-30 seconds)", "Stretching"],
          duration: "30-45 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
        "build muscle": {
          title: "Beginner Muscle Building Plan",
          description: "Foundation exercises to start building strength and muscle mass safely.",
          exercises: ["Bodyweight squats", "Wall push-ups", "Glute bridges", "Dead bugs", "Resistance band exercises"],
          duration: "30-40 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
        "tone": {
          title: "Beginner Toning Plan",
          description: "Light exercises to improve muscle definition and overall fitness.",
          exercises: ["Light weights", "Bodyweight movements", "Yoga poses", "Pilates exercises", "Cardio intervals"],
          duration: "30-45 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
      },
      intermediate: {
        "lose weight": {
          title: "Intermediate Fat Burn Plan",
          description: "Challenging workouts combining cardio and strength training for effective weight loss.",
          exercises: ["HIIT workouts", "Circuit training", "Strength training", "Running/cycling", "Core work"],
          duration: "45-60 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
        "build muscle": {
          title: "Intermediate Strength Plan",
          description: "Progressive strength training to build lean muscle mass and increase power.",
          exercises: ["Compound movements", "Progressive overload", "Split training", "Core strengthening", "Flexibility work"],
          duration: "50-70 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
        "tone": {
          title: "Intermediate Sculpting Plan",
          description: "Targeted exercises to define muscles and improve overall body composition.",
          exercises: ["Resistance training", "Functional movements", "Isolation exercises", "Cardio intervals", "Flexibility"],
          duration: "45-60 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
      },
      advanced: {
        "lose weight": {
          title: "Advanced Performance Plan",
          description: "High-intensity training for experienced athletes focused on fat loss and performance.",
          exercises: ["Advanced HIIT", "Olympic lifts", "Plyometrics", "Sport-specific training", "Recovery protocols"],
          duration: "60-90 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
        "build muscle": {
          title: "Advanced Muscle Building Plan",
          description: "Sophisticated training protocols for maximizing muscle growth and strength gains.",
          exercises: ["Heavy compound lifts", "Advanced techniques", "Periodization", "Accessory work", "Recovery focus"],
          duration: "70-90 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
        "tone": {
          title: "Advanced Body Sculpting Plan",
          description: "Precision training for advanced muscle definition and athletic performance.",
          exercises: ["Complex movements", "Supersets", "Drop sets", "Athletic conditioning", "Mobility work"],
          duration: "60-80 minutes",
          frequency: `${data.workoutDaysPerWeek} days per week`,
        },
      },
    };

    return workoutPlans[data.fitnessLevel as keyof typeof workoutPlans]?.[data.fitnessGoal as keyof typeof workoutPlans.beginner] || workoutPlans.beginner["lose weight"];
  };

  const generateMealPlan = (data: QuestionnaireData): MealPlan => {
    const isVegetarian = data.dietaryRestrictions?.includes('vegetarian');
    const isGlutenFree = data.dietaryRestrictions?.includes('gluten-free');
    const isQuickMeals = data.mealPreferences?.includes('quick-meals');

    const mealPlan: MealPlan = {
      title: `Personalized ${data.fitnessGoal} Meal Plan`,
      description: `A 7-day meal plan tailored to your ${data.fitnessGoal} goals with your dietary preferences.`,
      meals: [
        {
          day: "Monday",
          breakfast: isVegetarian ? "Overnight oats with berries" : "Scrambled eggs with spinach",
          lunch: isVegetarian ? "Quinoa Buddha bowl" : "Grilled chicken salad",
          dinner: isVegetarian ? "Lentil curry with brown rice" : "Baked salmon with vegetables",
          snacks: isGlutenFree ? ["Rice cakes with almond butter", "Greek yogurt"] : ["Whole grain crackers", "Mixed nuts"],
        },
        {
          day: "Tuesday",
          breakfast: isQuickMeals ? "Protein smoothie" : "Greek yogurt parfait",
          lunch: isVegetarian ? "Black bean wrap" : "Turkey and avocado wrap",
          dinner: isVegetarian ? "Stuffed bell peppers" : "Lean beef stir-fry",
          snacks: ["Apple slices", "Hummus with vegetables"],
        },
        {
          day: "Wednesday",
          breakfast: isGlutenFree ? "Chia pudding" : "Whole grain toast with avocado",
          lunch: isVegetarian ? "Chickpea salad" : "Tuna salad",
          dinner: isVegetarian ? "Vegetable pasta" : "Grilled chicken breast",
          snacks: ["Berries", "Protein bar"],
        },
        {
          day: "Thursday",
          breakfast: "Green smoothie bowl",
          lunch: isVegetarian ? "Veggie burger" : "Salmon salad",
          dinner: isVegetarian ? "Tofu stir-fry" : "Lean pork tenderloin",
          snacks: ["Trail mix", "Cottage cheese"],
        },
        {
          day: "Friday",
          breakfast: isQuickMeals ? "Protein shake" : "Egg white omelet",
          lunch: isVegetarian ? "Quinoa salad" : "Chicken wrap",
          dinner: isVegetarian ? "Bean and vegetable soup" : "Baked cod with quinoa",
          snacks: ["Dark chocolate", "Almonds"],
        },
        {
          day: "Saturday",
          breakfast: "Weekend pancakes (healthy version)",
          lunch: isVegetarian ? "Caprese salad" : "Grilled chicken Caesar",
          dinner: isVegetarian ? "Eggplant parmesan" : "Grass-fed steak",
          snacks: ["Fresh fruit", "Yogurt"],
        },
        {
          day: "Sunday",
          breakfast: "Brunch bowl",
          lunch: isVegetarian ? "Vegetable soup" : "Fish tacos",
          dinner: isVegetarian ? "Mushroom risotto" : "Roasted chicken",
          snacks: ["Smoothie", "Nuts and seeds"],
        },
      ],
    };

    return mealPlan;
  };

  const onSubmit = (data: QuestionnaireData) => {
    setSubmittedData(data);
    
    if (data.planType === 'workout' || data.planType === 'both') {
      setGeneratedWorkoutPlan(generateWorkoutPlan(data));
    }
    
    if (data.planType === 'meal' || data.planType === 'both') {
      setGeneratedMealPlan(generateMealPlan(data));
    }
    
    setCurrentStep('results');
  };

  const handleRevision = () => {
    setCurrentStep('questionnaire');
  };

  if (currentStep === 'results') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Your Personalized Plans</h2>
          <Button onClick={handleRevision} variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Revise Answers
          </Button>
        </div>

        {generatedWorkoutPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="w-5 h-5 mr-2" />
                {generatedWorkoutPlan.title}
              </CardTitle>
              <CardDescription>{generatedWorkoutPlan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Workout Details:</h4>
                  <p><strong>Duration:</strong> {generatedWorkoutPlan.duration}</p>
                  <p><strong>Frequency:</strong> {generatedWorkoutPlan.frequency}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Exercise Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {generatedWorkoutPlan.exercises.map((exercise, index) => (
                      <Badge key={index} variant="secondary">{exercise}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {generatedMealPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Utensils className="w-5 h-5 mr-2" />
                {generatedMealPlan.title}
              </CardTitle>
              <CardDescription>{generatedMealPlan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {generatedMealPlan.meals.map((dayMeal, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">{dayMeal.day}</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <p className="font-medium text-sm">Breakfast</p>
                        <p className="text-sm text-muted-foreground">{dayMeal.breakfast}</p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Lunch</p>
                        <p className="text-sm text-muted-foreground">{dayMeal.lunch}</p>
                      </div>
                      <div>
                        <p className="font-medium text-sm">Dinner</p>
                        <p className="text-sm text-muted-foreground">{dayMeal.dinner}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="font-medium text-sm">Snacks</p>
                      <div className="flex flex-wrap gap-1">
                        {dayMeal.snacks.map((snack, snackIndex) => (
                          <Badge key={snackIndex} variant="outline" className="text-xs">{snack}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Personalized Workout & Meal Plan Questionnaire</CardTitle>
          <CardDescription>
            Answer these questions to receive a customized plan tailored to your goals and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fitnessGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your fitness goal?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="lose weight" id="lose-weight" />
                          <label htmlFor="lose-weight">Lose weight</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="build muscle" id="build-muscle" />
                          <label htmlFor="build-muscle">Build muscle</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="tone" id="tone" />
                          <label htmlFor="tone">Tone and sculpt</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="maintain" id="maintain" />
                          <label htmlFor="maintain">Maintain current fitness</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="improve endurance" id="endurance" />
                          <label htmlFor="endurance">Improve endurance</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={() => (
                  <FormItem>
                    <FormLabel>Do you have any dietary preferences/restrictions?</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'keto', 'paleo', 'low-carb', 'low-fat'].map((restriction) => (
                          <div key={restriction} className="flex items-center space-x-2">
                            <Checkbox
                              id={restriction}
                              checked={form.watch('dietaryRestrictions')?.includes(restriction)}
                              onCheckedChange={(checked) => {
                                const current = form.getValues('dietaryRestrictions') || [];
                                if (checked) {
                                  form.setValue('dietaryRestrictions', [...current, restriction]);
                                } else {
                                  form.setValue('dietaryRestrictions', current.filter(r => r !== restriction));
                                }
                              }}
                            />
                            <label htmlFor={restriction} className="capitalize">{restriction.replace('-', ' ')}</label>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workoutDaysPerWeek"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How many days per week would you like to work out?</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select workout frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2-3">2-3 days</SelectItem>
                        <SelectItem value="3-4">3-4 days</SelectItem>
                        <SelectItem value="4-5">4-5 days</SelectItem>
                        <SelectItem value="5-6">5-6 days</SelectItem>
                        <SelectItem value="6-7">6-7 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fitnessLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>What is your current fitness level?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="beginner" id="beginner" />
                          <label htmlFor="beginner">Beginner (new to exercise)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="intermediate" id="intermediate" />
                          <label htmlFor="intermediate">Intermediate (exercise 2-3 times/week)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="advanced" id="advanced" />
                          <label htmlFor="advanced">Advanced (exercise 4+ times/week)</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="planType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Do you want a workout plan, meal plan, or both?</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} value={field.value}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="workout" id="workout-only" />
                          <label htmlFor="workout-only">Workout plan only</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="meal" id="meal-only" />
                          <label htmlFor="meal-only">Meal plan only</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="both" id="both-plans" />
                          <label htmlFor="both-plans">Both workout and meal plan</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(form.watch('planType') === 'meal' || form.watch('planType') === 'both') && (
                <FormField
                  control={form.control}
                  name="mealPreferences"
                  render={() => (
                    <FormItem>
                      <FormLabel>Meal plan preferences:</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-2">
                          {['quick-meals', 'prep-ahead', 'family-friendly', 'budget-friendly', 'gourmet', 'one-pot-meals'].map((preference) => (
                            <div key={preference} className="flex items-center space-x-2">
                              <Checkbox
                                id={preference}
                                checked={form.watch('mealPreferences')?.includes(preference)}
                                onCheckedChange={(checked) => {
                                  const current = form.getValues('mealPreferences') || [];
                                  if (checked) {
                                    form.setValue('mealPreferences', [...current, preference]);
                                  } else {
                                    form.setValue('mealPreferences', current.filter(p => p !== preference));
                                  }
                                }}
                              />
                              <label htmlFor={preference} className="capitalize">{preference.replace('-', ' ')}</label>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional notes or specific requirements (optional):</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any injuries, time constraints, or specific preferences..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Generate My Personalized Plan
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomizationQuestionnaire;
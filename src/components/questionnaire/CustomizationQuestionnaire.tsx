import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PlanPreview } from './PlanPreview';

interface QuestionnaireState {
  motherhoodStage: string;
  fitnessGoal: string;
  workoutDays: string;
  dietaryPreferences: string[];
  planType: string;
  additionalNotes: string;
}

const CustomizationQuestionnaire = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireState>({
    motherhoodStage: '',
    fitnessGoal: '',
    workoutDays: '',
    dietaryPreferences: [],
    planType: '',
    additionalNotes: ''
  });
  const [showPreview, setShowPreview] = useState(false);

  const totalSteps = 6;

  const handleOptionSelect = (field: keyof QuestionnaireState, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleDietaryToggle = (preference: string) => {
    setAnswers(prev => ({
      ...prev,
      dietaryPreferences: prev.dietaryPreferences.includes(preference)
        ? prev.dietaryPreferences.filter(p => p !== preference)
        : [...prev.dietaryPreferences, preference]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreview(true);
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return answers.motherhoodStage !== '';
      case 1: return answers.fitnessGoal !== '';
      case 2: return answers.workoutDays !== '';
      case 3: return true; // dietary preferences are optional
      case 4: return answers.planType !== '';
      case 5: return true; // notes are optional
      default: return false;
    }
  };

  const generatePlanPreview = () => {
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
      workout: `${answers.workoutDays}-day ${stageText} workout plan focused on ${goalText}`,
      meal: `7-day meal plan with ${answers.dietaryPreferences.length > 0 ? answers.dietaryPreferences.join(', ') + ' ' : ''}mom-friendly recipes`
    };
  };

  if (showPreview) {
    return (
      <PlanPreview 
        answers={answers} 
        onStartOver={() => {
          setShowPreview(false);
          setCurrentStep(0);
          setAnswers({
            motherhoodStage: '',
            fitnessGoal: '',
            workoutDays: '',
            dietaryPreferences: [],
            planType: '',
            additionalNotes: ''
          });
        }} 
      />
    );
  }

  const questions = [
    {
      title: "What's your current stage?",
      subtitle: "We'll tailor everything to where you are in your journey",
      options: [
        { value: 'ttc', label: 'Trying to Conceive', emoji: '💕' },
        { value: 'pregnant', label: 'Currently Pregnant', emoji: '🤱' },
        { value: 'postpartum-0-3', label: 'Postpartum (0-3 months)', emoji: '👶' },
        { value: 'postpartum-3-12', label: 'Postpartum (3-12 months)', emoji: '🍼' },
        { value: 'general', label: 'General Mom Wellness', emoji: '💪' }
      ],
      field: 'motherhoodStage' as keyof QuestionnaireState
    },
    {
      title: "What's your main goal?",
      subtitle: "Let's focus on what matters most to you right now",
      options: [
        { value: 'lose-baby-weight', label: 'Lose baby weight', emoji: '⚖️' },
        { value: 'build-strength', label: 'Build strength', emoji: '💪' },
        { value: 'sculpt-tone', label: 'Sculpt + tone', emoji: '✨' },
        { value: 'maintain-fitness', label: 'Maintain fitness', emoji: '🎯' },
        { value: 'improve-stamina', label: 'Improve stamina', emoji: '🔋' },
        { value: 'prepare-birth', label: 'Prepare for birth', emoji: '🌸' },
        { value: 'recover-strength', label: 'Recover + regain strength', emoji: '🌱' }
      ],
      field: 'fitnessGoal' as keyof QuestionnaireState
    },
    {
      title: "How many days can you commit?",
      subtitle: "Be honest - we'll make it work with your schedule",
      options: [
        { value: '2', label: '2 days', emoji: '🗓️' },
        { value: '3-4', label: '3-4 days', emoji: '📅' },
        { value: '5+', label: '5+ days', emoji: '🔥' },
        { value: 'flexible', label: 'It depends', emoji: '🤷‍♀️' }
      ],
      field: 'workoutDays' as keyof QuestionnaireState
    },
    {
      title: "Any dietary preferences?",
      subtitle: "Select all that apply (or skip if none)",
      options: [
        { value: 'vegan', label: 'Vegan', emoji: '🌱' },
        { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
        { value: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
        { value: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
        { value: 'none', label: 'No preference', emoji: '🍽️' }
      ],
      field: 'dietaryPreferences' as keyof QuestionnaireState,
      multiple: true
    },
    {
      title: "What type of plan?",
      subtitle: "Choose what you need most right now",
      options: [
        { value: 'workout', label: 'Workout plan only', emoji: '🏋️‍♀️' },
        { value: 'meal', label: 'Meal plan only', emoji: '🍽️' },
        { value: 'both', label: 'Both workout + meal plan', emoji: '💯' }
      ],
      field: 'planType' as keyof QuestionnaireState
    },
    {
      title: "Anything else?",
      subtitle: "Any special notes we should know about?",
      isTextInput: true,
      field: 'additionalNotes' as keyof QuestionnaireState
    }
  ];

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="max-w-md mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">
              Question {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {currentQuestion.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {currentQuestion.subtitle}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.isTextInput ? (
            <Card>
              <CardContent className="p-4">
                <textarea
                  className="w-full p-3 border-none outline-none resize-none bg-transparent"
                  rows={4}
                  placeholder="Tell us anything that might help us create your perfect plan..."
                  value={answers.additionalNotes}
                  onChange={(e) => handleOptionSelect('additionalNotes', e.target.value)}
                />
              </CardContent>
            </Card>
          ) : (
            currentQuestion.options?.map((option) => (
              <Card 
                key={option.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  currentQuestion.multiple 
                    ? (answers[currentQuestion.field] as string[])?.includes(option.value)
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                    : answers[currentQuestion.field] === option.value
                      ? 'ring-2 ring-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                }`}
                onClick={() => {
                  if (currentQuestion.multiple) {
                    handleDietaryToggle(option.value);
                  } else {
                    handleOptionSelect(currentQuestion.field, option.value);
                  }
                }}
              >
                <CardContent className="p-4 flex items-center">
                  <span className="text-2xl mr-3">{option.emoji}</span>
                  <span className="font-medium">{option.label}</span>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={!canProceed()}
            className="flex items-center"
          >
            {currentStep === totalSteps - 1 ? 'Create Plan' : 'Next'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationQuestionnaire;
import { useContentFilter, ContentItem } from '@/hooks/useContentFilter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock } from 'lucide-react';

interface MealPlan extends ContentItem {
  duration: string;
  recipeCount: number;
  avgPrepTime: string;
  image: string;
}

interface JourneySpecificMealPlansProps {
  mealPlans: MealPlan[];
}

const JourneySpecificMealPlans = ({ mealPlans }: JourneySpecificMealPlansProps) => {
  const { filterContent, stageInfo } = useContentFilter();
  
  const filteredMealPlans = filterContent(mealPlans) as MealPlan[];

  if (!stageInfo) {
    return null;
  }

  const getJourneyTitle = () => {
    switch (stageInfo.journey) {
      case 'ttc':
        return 'Fertility-Focused Meal Plans';
      case 'pregnant':
        return 'Pregnancy Nutrition Plans';
      case 'postpartum':
        return 'Postpartum Recovery Plans';
      case 'toddler':
        return 'Family Meal Plans';
      default:
        return 'Personalized Meal Plans';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{getJourneyTitle()}</h2>
        <Badge variant="outline">
          {stageInfo.phase}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMealPlans.map((plan) => (
          <MealPlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {filteredMealPlans.length === 0 && (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            No meal plans available for your current journey stage.
          </p>
          <Button className="mt-4" asChild>
            <a href="/meal-plan">Create Custom Meal Plan</a>
          </Button>
        </div>
      )}
    </div>
  );
};

const MealPlanCard = ({ plan }: { plan: MealPlan }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <AspectRatio ratio={16/9}>
          <img 
            src={plan.image} 
            alt={plan.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </AspectRatio>
        <div className="absolute bottom-4 left-4 z-20">
          <Badge className="bg-primary hover:bg-primary">{plan.duration}</Badge>
        </div>
      </div>
      <CardContent className="pt-4">
        <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
        <p className="text-muted-foreground mb-4">{plan.description}</p>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{plan.recipeCount} recipes</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{plan.avgPrepTime}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Plan</Button>
      </CardFooter>
    </Card>
  );
};

export default JourneySpecificMealPlans;
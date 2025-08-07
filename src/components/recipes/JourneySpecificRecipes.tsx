import { useContentFilter, ContentItem } from '@/hooks/useContentFilter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Recipe extends ContentItem {
  prepTime: string;
  image: string;
  servings?: number;
  difficulty?: string;
}

interface JourneySpecificRecipesProps {
  recipes: Recipe[];
}

const JourneySpecificRecipes = ({ recipes }: JourneySpecificRecipesProps) => {
  const { filterContent, stageInfo } = useContentFilter();
  
  const filteredRecipes = filterContent(recipes) as Recipe[];

  if (!stageInfo) {
    return null;
  }

  const getJourneyTitle = () => {
    switch (stageInfo.journey) {
      case 'ttc':
        return 'Fertility-Boosting Recipes';
      case 'pregnant':
        return 'Pregnancy-Safe Recipes';
      case 'postpartum':
        return 'Postpartum Recovery Recipes';
      case 'toddler':
        return 'Family-Friendly Recipes';
      default:
        return 'Nourishing Recipes';
    }
  };

  const getJourneyDescription = () => {
    switch (stageInfo.journey) {
      case 'ttc':
        return 'Nutrient-dense recipes designed to support fertility and hormone balance';
      case 'pregnant':
        return 'Safe, nutritious meals for you and your growing baby';
      case 'postpartum':
        return 'Healing recipes to support recovery and energy';
      case 'toddler':
        return 'Wholesome meals that work for the whole family';
      default:
        return 'Delicious and nutritious meals designed for your motherhood journey';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{getJourneyTitle()}</h2>
        <p className="text-muted-foreground">{getJourneyDescription()}</p>
        <Badge variant="outline" className="mt-2">
          {stageInfo.phase}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-8 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            No recipes available for your current journey stage.
          </p>
        </div>
      )}
    </div>
  );
};

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <AspectRatio ratio={16/9}>
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </AspectRatio>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
            {recipe.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1">{recipe.title}</h3>
        <p className="text-muted-foreground text-sm mb-3">{recipe.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{recipe.prepTime}</span>
          </div>
          <div className="flex space-x-1">
            {recipe.tags.slice(0, 2).map(tag => (
              <span 
                key={tag}
                className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="ghost" className="w-full hover:bg-catalyst-copper/5 text-catalyst-copper">
          <Link to={`/recipes/${recipe.title.toLowerCase().replace(/\s+/g, '-')}`}>
            View Recipe
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JourneySpecificRecipes;
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, ArrowLeft } from "lucide-react";
import { recipes, mealPlans } from "@/data/recipeData";
import defaultCover from "@/assets/30-days-glow-up-cover.jpg";

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const MealPlanDetail = () => {
  const { slug } = useParams();

  const plan = useMemo(() => mealPlans.find((p) => toSlug(p.title) === slug), [slug]);

  const relatedRecipes = useMemo(() => {
    if (!plan) return [] as typeof recipes;
    return recipes
      .filter((r) => r.journey.some((j) => plan.journey.includes(j)))
      .slice(0, 6);
  }, [plan]);

  if (!plan) {
    return (
      <PageLayout>
        <div className="container px-4 mx-auto py-10 text-center">
          <h1 className="text-2xl font-bold mb-2">Meal plan not found</h1>
          <p className="text-muted-foreground mb-6">Please go back and pick a plan.</p>
          <Button asChild>
            <Link to="/meal-plan">Back to Meal Plans</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container px-4 mx-auto py-6">
        <header className="mb-6">
          <Button asChild variant="ghost" className="mb-4 px-0">
            <Link to="/meal-plan">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to all plans
            </Link>
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{plan.category}</Badge>
                <Badge variant="outline">{plan.duration}</Badge>
              </div>
              <h1 className="text-3xl font-bold mb-2">{plan.title}</h1>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{plan.recipeCount} recipes</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{plan.avgPrepTime}</span>
                </div>
              </div>
            </div>
            <div>
              <AspectRatio ratio={16 / 9}>
                <img
                  src={plan.image || (defaultCover as string)}
                  alt={plan.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = defaultCover as string;
                  }}
                />
              </AspectRatio>
            </div>
          </div>
        </header>

        <main className="space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">What you'll get</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <li>• Week-by-week structure tailored to your journey</li>
              <li>• Balanced meals with simple prep</li>
              <li>• Grocery-friendly ingredients</li>
              <li>• Tips for swaps and dietary needs</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Included recipes</h2>
              <Button asChild variant="outline" size="sm">
                <Link to="/recipes">Browse all recipes</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRecipes.map((r) => (
                <Card key={r.id} className="overflow-hidden">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-1 text-base">{r.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button asChild variant="ghost" className="w-full">
                      <Link to={`/recipes/${toSlug(r.title)}`}>View Recipe</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
};

export default MealPlanDetail;

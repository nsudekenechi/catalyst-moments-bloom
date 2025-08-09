import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ChefHat, Heart, BookOpen, Bookmark, Printer, Share2, CheckCircle, Utensils } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { recipes as allRecipes } from "@/data/recipeData";

const toSlug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

const defaultNutrition = {
  calories: "350",
  protein: "18g",
  carbs: "36g",
  fat: "14g",
  fiber: "6g",
};

const buildFallbackIngredients = (title: string) => [
  "1 tbsp olive oil",
  "1 cup leafy greens (spinach/kale)",
  "1 cup chopped veggies of choice",
  "1 source of protein",
  "Season with salt, pepper, and herbs",
];

const buildFallbackInstructions = (title: string) => [
  "Prep ingredients: wash and chop produce.",
  "Heat oil in a pan or preheat oven as needed.",
  "Cook protein until done; add veggies and season.",
  "Assemble and adjust seasoning to taste.",
  "Serve warm and enjoy.",
];

const RecipeDetail = () => {
  const { slug } = useParams();

  const recipe = useMemo(() => allRecipes.find((r) => toSlug(r.title) === slug), [slug]);

  // Build extended content (fallbacks if not provided in data)
  const extended = useMemo(() => {
    if (!recipe) return null;
    const title = recipe.title;

    // Category-specific simple defaults
    const categoryDefaults: Record<string, { ingredients: string[]; instructions: string[]; benefits: string[]; nutrition: typeof defaultNutrition }> = {
      Breakfast: {
        ingredients: [
          "1/2 cup rolled oats",
          "1 tbsp chia seeds",
          "1 cup milk of choice",
          "1/2 cup berries",
          "1 tbsp nut butter",
        ],
        instructions: [
          "Combine oats, chia, and milk; soak 15 minutes or overnight.",
          "Stir in berries and nut butter.",
          "Adjust thickness with a splash of milk and serve.",
        ],
        benefits: [
          "Steady energy for mornings",
          "Fiber to support digestion",
          "Balanced carbs, protein, and healthy fats",
        ],
        nutrition: defaultNutrition,
      },
      Lunch: {
        ingredients: [
          "1 cup cooked quinoa",
          "1 cup mixed roasted veggies",
          "1/2 cup beans or grilled chicken",
          "2 tbsp lemon-tahini dressing",
        ],
        instructions: [
          "Roast or reheat veggies until warm.",
          "Combine quinoa, protein, and veggies in a bowl.",
          "Drizzle with dressing and toss.",
        ],
        benefits: ["Iron- and protein-forward", "Colorful, nutrient-dense", "Satiating and balanced"],
        nutrition: defaultNutrition,
      },
      Dinner: {
        ingredients: [
          "2 salmon fillets (or preferred protein)",
          "2 cups greens (spinach/kale)",
          "1 medium sweet potato, sliced",
          "1 tbsp olive oil, lemon, herbs",
        ],
        instructions: [
          "Bake salmon at 400°F (200°C) for ~12-15 minutes.",
          "Roast sweet potato until tender.",
          "Sauté greens with olive oil; finish with lemon.",
          "Plate salmon with greens and sweet potato.",
        ],
        benefits: ["Omega-3s for brain and nervous system", "Protein for growth/recovery", "Micronutrients for overall health"],
        nutrition: defaultNutrition,
      },
      Snacks: {
        ingredients: ["Greek yogurt", "Handful of nuts", "Fruit of choice", "Drizzle honey (optional)"],
        instructions: ["Layer yogurt, fruit, and nuts.", "Drizzle honey and serve."],
        benefits: ["Quick protein and healthy fats", "Stable blood sugar", "Satisfying between meals"],
        nutrition: defaultNutrition,
      },
    };

    const defaults = categoryDefaults[recipe.category] ?? {
      ingredients: buildFallbackIngredients(title),
      instructions: buildFallbackInstructions(title),
      benefits: ["Nutrient-focused and simple", "Flexible for preferences", "Family-friendly"],
      nutrition: defaultNutrition,
    };

    return {
      title,
      description: recipe.description,
      prepTime: recipe.prepTime,
      totalTime: recipe.prepTime,
      servings: recipe.servings ?? 1,
      image: recipe.image,
      category: recipe.category,
      tags: recipe.tags,
      difficulty: recipe.difficulty ?? "Easy",
      ingredients: defaults.ingredients,
      instructions: defaults.instructions,
      nutrition: defaults.nutrition,
      benefits: defaults.benefits,
      notes: "Adjust portions based on appetite and energy needs. Swap ingredients to match dietary preferences.",
    };
  }, [recipe]);

  useEffect(() => {
    if (extended) {
      document.title = `${extended.title} | Recipes`;
    }
  }, [extended]);

  if (!extended) {
    return (
      <PageLayout>
        <div className="container px-4 mx-auto py-10 text-center">
          <h1 className="text-2xl font-bold mb-2">Recipe not found</h1>
          <p className="text-muted-foreground mb-6">Try browsing all recipes and pick another one.</p>
          <Button asChild>
            <Link to="/recipes">Browse Recipes</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const r = extended;

  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="order-2 lg:order-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge>{r.category}</Badge>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" /> {r.prepTime} prep
                </Badge>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{r.title}</h1>
              <p className="text-muted-foreground mb-6">{r.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Time</p>
                    <p className="font-medium">{r.totalTime}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Utensils className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Servings</p>
                    <p className="font-medium">{r.servings}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <ChefHat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                    <p className="font-medium">{r.difficulty}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {r.tags.map((tag) => (
                  <span key={tag} className="text-xs py-1 px-3 bg-muted rounded-full text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex space-x-3">
                <Button>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save Recipe
                </Button>
                <Button variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-md">
                <AspectRatio ratio={4 / 3}>
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="recipe" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="recipe">Recipe</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="recipe">
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                          <BookOpen className="mr-2 h-5 w-5 text-primary" />
                          Ingredients
                        </h2>
                        <ul className="space-y-2">
                          {r.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start pb-2 border-b border-muted">
                              <div className="w-5 h-5 rounded border border-muted flex-shrink-0 mt-0.5 mr-3"></div>
                              <span>{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center">
                          <ChefHat className="mr-2 h-5 w-5 text-primary" />
                          Instructions
                        </h2>
                        <ol className="space-y-4">
                          {r.instructions.map((step, index) => (
                            <li key={index} className="flex">
                              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                {index + 1}
                              </div>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nutrition">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4">Nutrition Information</h2>
                    <p className="text-sm text-muted-foreground mb-4">Per serving</p>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Calories</p>
                        <p className="font-bold text-xl">{r.nutrition.calories}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Protein</p>
                        <p className="font-bold text-xl">{r.nutrition.protein}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Carbs</p>
                        <p className="font-bold text-xl">{r.nutrition.carbs}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Fat</p>
                        <p className="font-bold text-xl">{r.nutrition.fat}</p>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg text-center">
                        <p className="text-sm text-muted-foreground">Fiber</p>
                        <p className="font-bold text-xl">{r.nutrition.fiber}</p>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="font-bold mb-3">Motherhood Benefits</h3>
                    <ul className="space-y-2">
                      {r.benefits.map((benefit, index) => (
                        <li key={index} className="flex">
                          <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4">Recipe Notes</h2>
                    <p className="mb-4">{r.notes}</p>

                    <Separator className="my-6" />

                    <h3 className="font-bold mb-3">Storage Instructions</h3>
                    <p>Store leftovers in an airtight container in the refrigerator for up to 3–4 days. Reheat gently and adjust seasoning as needed.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-4">You Might Also Like</h3>
                <div className="space-y-4">
                  {allRecipes
                    .filter((rr) => rr.id !== recipe?.id && rr.journey.some((j) => recipe?.journey.includes(j)))
                    .slice(0, 3)
                    .map((rr) => (
                      <div className="flex gap-3" key={rr.id}>
                        <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden">
                          <img src={rr.image} alt={rr.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{rr.title}</h4>
                          <p className="text-muted-foreground text-xs mb-1">{rr.category}</p>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{rr.prepTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <Separator className="my-6" />

                <div className="text-center">
                  <Button className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Save to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RecipeDetail;

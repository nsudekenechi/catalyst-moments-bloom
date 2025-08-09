import PageLayout from '@/components/layout/PageLayout';
import { MealPlanCard } from '@/components/recipes/JourneySpecificMealPlans';
import { mealPlans } from '@/data/recipeData';

const MealPlan = () => {
  return (
    <PageLayout>
      <div className="container px-4 mx-auto py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-2">All Meal Plans</h1>
          <p className="text-muted-foreground">Browse every plan across journeys. Select one to get started.</p>
        </header>

        <main>
          <section aria-labelledby="all-plans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mealPlans.map((plan) => (
                <MealPlanCard key={plan.id} plan={plan as any} />
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  );
};

export default MealPlan;
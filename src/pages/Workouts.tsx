import PageLayout from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Dumbbell, Filter, Baby, Heart, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import WellnessCoachButton from '@/components/wellness-coach/WellnessCoachButton';
import GlowAndGoPrenatalCard from '@/components/workouts/GlowAndGoPrenatalCard';
import PostpartumRecoveryCard from '@/components/workouts/PostpartumRecoveryCard';
import EnergyStrengthCard from '@/components/workouts/EnergyStrengthCard';
import { TTCWorkoutCard } from '@/components/ttc/TTCWorkoutCard';
import { useAuth } from '@/contexts/AuthContext';

interface WorkoutCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  image: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

const Workouts = () => {
  const { user, profile } = useAuth();
  const isTTC = profile?.motherhood_stage === 'ttc';
  
  return (
    <PageLayout>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workouts</h1>
            <p className="text-muted-foreground mb-4 md:mb-0">
              Exercise designed for your current motherhood stage: {
                isTTC ? 'Trying to Conceive' :
                profile?.motherhood_stage === 'pregnant' ? 'Pregnant' :
                profile?.motherhood_stage === 'postpartum' ? 'Postpartum' :
                profile?.motherhood_stage === 'toddler' ? 'Toddler Mom' : 'Postpartum (8 weeks)'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <WellnessCoachButton variant="secondary" size="sm" showLabel={false} className="mr-1" />
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search workouts..." 
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="recommended" className="mb-8">
          <TabsList>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value={isTTC ? "fertility" : "postpartum"}>
              {isTTC ? "Fertility" : "Postpartum"}
            </TabsTrigger>
            <TabsTrigger value="quickWorkouts">Quick Workouts</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {isTTC ? (
                <>
                  <TTCWorkoutCard />
                  <WorkoutCard 
                    title="Fertility-Boosting Strength Training"
                    description="Gentle strength exercises to support reproductive health"
                    duration="25 min"
                    level="Beginner"
                    image="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
                    category="TTC"
                    tags={["Strength", "Fertility"]}
                    featured={true}
                  />
                  <WorkoutCard 
                    title="Stress-Relief Walking Meditation"
                    description="Mindful movement to reduce stress and promote conception"
                    duration="15 min"
                    level="All Levels"
                    image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
                    category="TTC"
                    tags={["Mindfulness", "Stress Relief"]}
                  />
                  <WorkoutCard 
                    title="Hip-Opening Flow"
                    description="Gentle yoga to improve circulation and flexibility"
                    duration="20 min"
                    level="Beginner"
                    image="https://images.unsplash.com/photo-1540206395-68808572332f"
                    category="TTC"
                    tags={["Yoga", "Flexibility"]}
                  />
                </>
              ) : (
                <>
                  <WorkoutCard 
                    title="Gentle Postpartum Core Recovery"
                    description="Safe, effective exercises to rebuild core strength after childbirth"
                    duration="15 min"
                    level="Beginner"
                    image="https://images.unsplash.com/photo-1518495973542-4542c06a5843"
                    category="Postpartum"
                    tags={["Core", "Recovery"]}
                    featured={true}
                  />
                  <WorkoutCard 
                    title="Energy Boost: Quick Standing Workout"
                    description="No equipment needed - perfect for when baby is napping"
                    duration="10 min"
                    level="Beginner"
                    image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                    category="Quick"
                    tags={["Energy", "No Equipment"]}
                  />
                  <WorkoutCard 
                    title="Diastasis Recti Healing Sequence"
                    description="Targeted moves to help heal abdominal separation"
                    duration="20 min"
                    level="Beginner"
                    image="https://images.unsplash.com/photo-1521322800607-8c38375eef04"
                    category="Postpartum"
                    tags={["Recovery", "Core"]}
                  />
                  <WorkoutCard 
                    title="Pelvic Floor Restoration"
                    description="Strengthen your pelvic floor with these gentle exercises"
                    duration="15 min"
                    level="Beginner"
                    image="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
                    category="Postpartum"
                    tags={["Recovery", "Strength"]}
                  />
                  <WorkoutCard 
                    title="Baby & Me: Bonding Workout"
                    description="Include your baby in this gentle workout routine"
                    duration="20 min"
                    level="Beginner"
                    image="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                    category="Baby & Me"
                    tags={["Bonding", "Gentle"]}
                  />
                </>
              )}
              <Card className="border border-dashed flex flex-col items-center justify-center p-6 h-full">
                <div className="text-center">
                  <div className="bg-primary/10 rounded-full p-3 mx-auto mb-4 w-fit">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Discover More Workouts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isTTC ? 'We have 30+ fertility-focused workouts designed to support your TTC journey' : 'We have 50+ workouts designed for every stage of motherhood'}
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="/library">View Library</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value={isTTC ? "fertility" : "postpartum"}>
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Baby className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">{isTTC ? 'Fertility Collection' : 'Postpartum Collection'}</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                {isTTC ? 
                  'Specialized workouts to support fertility and reproductive health will appear here.' :
                  'Specialized workouts for your postpartum recovery will appear here as you continue your journey.'
                }
              </p>
              <Button asChild>
                <Link to="/library">{isTTC ? 'Explore Fertility Workouts' : 'Explore Postpartum Workouts'}</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="quickWorkouts">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Quick Workouts</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Short, effective workouts designed for busy moms will appear here.
              </p>
              <Button asChild>
                <Link to="/library">Explore Quick Workouts</Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="text-center py-8 border rounded-lg bg-muted/30">
              <Heart className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h3 className="font-medium mb-1">Your Favorites</h3>
              <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                Save your favorite workouts for easy access. They'll appear here.
              </p>
              <Button asChild>
                <Link to="/workouts">Browse Workouts</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Workout Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GlowAndGoPrenatalCard />
            <PostpartumRecoveryCard />
            <EnergyStrengthCard />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const WorkoutCard = ({ 
  title, 
  description, 
  duration, 
  level, 
  image,
  category,
  tags,
  featured = false
}: WorkoutCardProps) => {
  return (
    <Card className={`overflow-hidden ${featured ? 'ring-2 ring-primary/50' : ''}`}>
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-40 object-cover"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground">
            {category}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-primary hover:bg-primary">Featured</Badge>
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex space-x-4 mb-3">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{duration}</span>
          </div>
          <div className="flex items-center">
            <Dumbbell className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{level}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span 
              key={tag}
              className="text-xs py-1 px-2 bg-muted rounded-full text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/workouts/${title.toLowerCase().replace(/\s+/g, '-')}`}>
            Start Workout
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Workouts;

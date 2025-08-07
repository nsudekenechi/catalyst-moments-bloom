
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/common/ScrollToTop";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import WorkoutDetail from "./pages/WorkoutDetail";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Wellness from "./pages/Wellness";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import CheckoutModal from "./components/subscription/CheckoutModal";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/auth/PrivateRoute";
import SubscriptionGuard from "./components/auth/SubscriptionGuard";
import FoodCalorieChecker from "./pages/FoodCalorieChecker";
import Questionnaire from "./pages/Questionnaire";
import MealPlan from "./pages/MealPlan";
import WorkoutPlan from "./pages/WorkoutPlan";
import Blog from "./pages/Blog";
import Experts from "./pages/Experts";
import Research from "./pages/Research";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";

// Create a client
const queryClient = new QueryClient();

function AppContent() {
  const { showCheckoutModal, setShowCheckoutModal } = useAuth();
  
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/food-calories" element={<FoodCalorieChecker />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/experts" element={<Experts />} />
          <Route path="/research" element={<Research />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <Dashboard />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/workouts" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <Workouts />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/workouts/:slug" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <WorkoutDetail />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/recipes" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <Recipes />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/recipes/:slug" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <RecipeDetail />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/wellness" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <Wellness />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/questionnaire" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <Questionnaire />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/meal-plan" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <MealPlan />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/workout-plan" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <WorkoutPlan />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/courses" element={
            <PrivateRoute>
              <SubscriptionGuard>
                <Courses />
              </SubscriptionGuard>
            </PrivateRoute>
          } />
          <Route path="/course/:id" element={
            <PrivateRoute>
              <CourseDetail />
            </PrivateRoute>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

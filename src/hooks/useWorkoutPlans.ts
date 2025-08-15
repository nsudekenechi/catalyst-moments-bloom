import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface SavedWorkoutPlan {
  id: string;
  title: string;
  description: string;
  timePerSession: string;
  frequency: string;
  intensity: string;
  stage: string;
  preferences: string[];
  additionalNotes: string;
  createdAt: string;
}

export const useWorkoutPlans = () => {
  const { user } = useAuth();
  const [savedPlans, setSavedPlans] = useState<SavedWorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSavedPlans = () => {
    if (!user) {
      setSavedPlans([]);
      setIsLoading(false);
      return;
    }

    try {
      const saved = localStorage.getItem(`workout_plans_${user.id}`);
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved workout plans:', error);
    }
    setIsLoading(false);
  };

  const savePlan = (plan: Omit<SavedWorkoutPlan, 'id' | 'createdAt'>) => {
    if (!user) return null;

    const newPlan: SavedWorkoutPlan = {
      ...plan,
      id: `plan_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    try {
      const existingPlans = savedPlans;
      const updatedPlans = [newPlan, ...existingPlans];
      localStorage.setItem(`workout_plans_${user.id}`, JSON.stringify(updatedPlans));
      setSavedPlans(updatedPlans);
      return newPlan.id;
    } catch (error) {
      console.error('Error saving workout plan:', error);
      return null;
    }
  };

  const deletePlan = (planId: string) => {
    if (!user) return;

    try {
      const updatedPlans = savedPlans.filter(plan => plan.id !== planId);
      localStorage.setItem(`workout_plans_${user.id}`, JSON.stringify(updatedPlans));
      setSavedPlans(updatedPlans);
    } catch (error) {
      console.error('Error deleting workout plan:', error);
    }
  };

  const getPlan = (planId: string) => {
    return savedPlans.find(plan => plan.id === planId);
  };

  useEffect(() => {
    loadSavedPlans();
  }, [user]);

  return {
    savedPlans,
    isLoading,
    savePlan,
    deletePlan,
    getPlan,
    loadSavedPlans
  };
};
-- Create custom meal plans table
CREATE TABLE public.custom_meal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL DEFAULT 7,
  plan_data JSONB NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'coach_sarah',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.custom_meal_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_meal_plans
CREATE POLICY "Users can view their own meal plans"
  ON public.custom_meal_plans
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meal plans"
  ON public.custom_meal_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans"
  ON public.custom_meal_plans
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans"
  ON public.custom_meal_plans
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create custom workout programs table
CREATE TABLE public.custom_workout_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_weeks INTEGER NOT NULL DEFAULT 4,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner',
  program_data JSONB NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'coach_sarah',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.custom_workout_programs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_workout_programs
CREATE POLICY "Users can view their own workout programs"
  ON public.custom_workout_programs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workout programs"
  ON public.custom_workout_programs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workout programs"
  ON public.custom_workout_programs
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout programs"
  ON public.custom_workout_programs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_custom_meal_plans_user_id ON public.custom_meal_plans(user_id);
CREATE INDEX idx_custom_meal_plans_active ON public.custom_meal_plans(user_id, is_active) WHERE is_active = true;

CREATE INDEX idx_custom_workout_programs_user_id ON public.custom_workout_programs(user_id);
CREATE INDEX idx_custom_workout_programs_active ON public.custom_workout_programs(user_id, is_active) WHERE is_active = true;

-- Create trigger functions for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_custom_meal_plans_updated_at
  BEFORE UPDATE ON public.custom_meal_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_custom_workout_programs_updated_at
  BEFORE UPDATE ON public.custom_workout_programs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
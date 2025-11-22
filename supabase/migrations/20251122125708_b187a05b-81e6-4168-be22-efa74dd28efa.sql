-- Create birth ball exercise logs table for analytics
CREATE TABLE public.birth_ball_exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  trimester INTEGER,
  duration_seconds INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.birth_ball_exercise_logs ENABLE ROW LEVEL SECURITY;

-- Users can insert their own logs
CREATE POLICY "Users can insert their own exercise logs"
ON public.birth_ball_exercise_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own logs
CREATE POLICY "Users can view their own exercise logs"
ON public.birth_ball_exercise_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can update their own logs
CREATE POLICY "Users can update their own exercise logs"
ON public.birth_ball_exercise_logs
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own logs
CREATE POLICY "Users can delete their own exercise logs"
ON public.birth_ball_exercise_logs
FOR DELETE
USING (auth.uid() = user_id);

-- Add index for faster queries
CREATE INDEX idx_birth_ball_logs_user_id ON public.birth_ball_exercise_logs(user_id);
CREATE INDEX idx_birth_ball_logs_completed_at ON public.birth_ball_exercise_logs(completed_at DESC);
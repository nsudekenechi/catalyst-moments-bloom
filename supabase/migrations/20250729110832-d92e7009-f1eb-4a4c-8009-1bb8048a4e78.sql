-- Create weekly check-ins table
CREATE TABLE public.weekly_checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  week_date DATE NOT NULL,
  weight DECIMAL(5,2),
  chest_measurement DECIMAL(5,2),
  upper_arm_measurement DECIMAL(5,2),
  hip_measurement DECIMAL(5,2),
  progress_image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own check-ins" 
ON public.weekly_checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own check-ins" 
ON public.weekly_checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own check-ins" 
ON public.weekly_checkins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own check-ins" 
ON public.weekly_checkins 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_weekly_checkins_updated_at
BEFORE UPDATE ON public.weekly_checkins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for progress photos
INSERT INTO storage.buckets (id, name, public) VALUES ('progress-photos', 'progress-photos', false);

-- Create policies for progress photo uploads
CREATE POLICY "Users can view their own progress photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own progress photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own progress photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own progress photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'progress-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
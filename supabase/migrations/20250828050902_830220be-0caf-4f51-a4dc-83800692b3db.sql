-- Create premium_users table for payment protection
CREATE TABLE public.premium_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  subscription_type TEXT,
  subscription_start TIMESTAMP WITH TIME ZONE,
  subscription_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.premium_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own premium status" 
ON public.premium_users 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage premium status" 
ON public.premium_users 
FOR ALL 
USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert admin as premium user (using your user ID)
INSERT INTO public.premium_users (user_id, is_premium, subscription_type, subscription_start)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'catalystmom@outlook.com' LIMIT 1),
  true,
  'admin',
  now()
) ON CONFLICT (user_id) DO UPDATE SET 
  is_premium = true,
  subscription_type = 'admin',
  subscription_start = now();

-- Create function to check premium status
CREATE OR REPLACE FUNCTION public.is_premium_user()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.premium_users 
    WHERE user_id = auth.uid() 
    AND is_premium = true 
    AND (subscription_end IS NULL OR subscription_end > now())
  );
END;
$$;
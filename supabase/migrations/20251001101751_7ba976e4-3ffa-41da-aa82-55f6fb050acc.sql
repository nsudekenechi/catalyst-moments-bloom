-- Add approved status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS approved BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster queries on approved users
CREATE INDEX IF NOT EXISTS idx_profiles_approved ON public.profiles(approved);

-- Create function to approve users
CREATE OR REPLACE FUNCTION public.approve_user(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to approve users
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  UPDATE public.profiles
  SET approved = true, updated_at = now()
  WHERE user_id = user_id_param;
  
  -- Award welcome points to newly approved user
  PERFORM public.add_user_points(
    user_id_param,
    50,
    'welcome_bonus',
    'Welcome to Catalyst Mom! Here are your first 50 points.'
  );
END;
$$;

-- Create function to get pending users
CREATE OR REPLACE FUNCTION public.get_pending_users()
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  display_name TEXT,
  motherhood_stage TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    p.user_id,
    au.email,
    p.display_name,
    p.motherhood_stage,
    p.created_at
  FROM public.profiles p
  LEFT JOIN auth.users au ON p.user_id = au.id
  WHERE p.approved = false
  ORDER BY p.created_at DESC;
END;
$$;

-- Auto-approve admin users
UPDATE public.profiles
SET approved = true
WHERE user_id IN (SELECT user_id FROM public.admin_roles);

-- Update existing users to be approved (grandfather them in)
UPDATE public.profiles
SET approved = true
WHERE approved = false;
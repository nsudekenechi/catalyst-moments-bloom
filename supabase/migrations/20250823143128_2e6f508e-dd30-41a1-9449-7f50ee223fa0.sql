-- Create admin role system and management functions

-- Create admin roles table
CREATE TABLE public.admin_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for admin roles (only viewable by the admin themselves)
CREATE POLICY "Users can view their own admin role" 
ON public.admin_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE user_id = user_id_param 
    AND role = 'admin'
  );
END;
$$;

-- Create function to get all users with their points
CREATE OR REPLACE FUNCTION public.get_all_users_with_points()
RETURNS TABLE(
  user_id uuid,
  email text,
  display_name text,
  total_points integer,
  level integer,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
    COALESCE(up.total_points, 0) as total_points,
    COALESCE(up.level, 1) as level,
    p.created_at
  FROM public.profiles p
  LEFT JOIN public.user_points up ON p.user_id = up.user_id
  LEFT JOIN auth.users au ON p.user_id = au.id
  ORDER BY COALESCE(up.total_points, 0) DESC;
END;
$$;

-- Create function to get all affiliate applications for admin review
CREATE OR REPLACE FUNCTION public.get_all_affiliate_applications()
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  full_name text,
  social_media_handles text,
  audience_size text,
  experience text,
  motivation text,
  status text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  RETURN QUERY
  SELECT 
    aa.id,
    aa.user_id,
    aa.email,
    aa.full_name,
    aa.social_media_handles,
    aa.audience_size,
    aa.experience,
    aa.motivation,
    aa.status,
    aa.created_at,
    aa.updated_at
  FROM public.affiliate_applications aa
  ORDER BY aa.created_at DESC;
END;
$$;

-- Create function to update affiliate application status
CREATE OR REPLACE FUNCTION public.update_affiliate_status(
  application_id uuid,
  new_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Validate status
  IF new_status NOT IN ('pending', 'approved', 'rejected') THEN
    RAISE EXCEPTION 'Invalid status. Must be pending, approved, or rejected.';
  END IF;

  UPDATE public.affiliate_applications
  SET 
    status = new_status,
    updated_at = now()
  WHERE id = application_id;
END;
$$;

-- Create function to manually adjust user points (admin only)
CREATE OR REPLACE FUNCTION public.admin_adjust_user_points(
  target_user_id uuid,
  points_adjustment integer,
  reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow admins to access this function
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Use existing add_user_points function with admin reason
  PERFORM public.add_user_points(
    target_user_id, 
    points_adjustment, 
    'admin_adjustment', 
    CONCAT('Admin adjustment: ', reason)
  );
END;
$$;

-- Create audit log table for admin actions
CREATE TABLE public.admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id uuid NOT NULL,
  action text NOT NULL,
  target_user_id uuid,
  details text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admin audit log (only viewable by admins)
CREATE POLICY "Admins can view audit log" 
ON public.admin_audit_log 
FOR SELECT 
USING (public.is_admin(auth.uid()));

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_name text,
  target_user_id uuid DEFAULT NULL,
  action_details text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only allow admins to log actions
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  INSERT INTO public.admin_audit_log (admin_user_id, action, target_user_id, details)
  VALUES (auth.uid(), action_name, target_user_id, action_details);
END;
$$;
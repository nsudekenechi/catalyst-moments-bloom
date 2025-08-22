-- Fix search path security warning for subscription function

DROP FUNCTION IF EXISTS public.user_has_active_subscription();

CREATE OR REPLACE FUNCTION public.user_has_active_subscription()
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER 
STABLE
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscribers 
    WHERE user_id = auth.uid() 
    AND subscribed = true 
    AND (subscription_end IS NULL OR subscription_end > now())
  );
END;
$$;
-- Fix RLS policies for affiliate_applications without problematic CHECK constraint

-- Drop existing policies to recreate them with stronger security
DROP POLICY IF EXISTS "Users can create their own application" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Users can update their own application" ON public.affiliate_applications;
DROP POLICY IF EXISTS "Users can view their own application" ON public.affiliate_applications;

-- Create secure policies that require authentication and strict user_id matching
-- Policy for users to create their own application (authenticated users only)
CREATE POLICY "authenticated_users_create_own_application" ON public.affiliate_applications
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy for users to view only their own application (authenticated users only)
CREATE POLICY "authenticated_users_view_own_application" ON public.affiliate_applications
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy for users to update only their own application (authenticated users only)
CREATE POLICY "authenticated_users_update_own_application" ON public.affiliate_applications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure user_id cannot be null to prevent orphaned records
ALTER TABLE public.affiliate_applications 
ALTER COLUMN user_id SET NOT NULL;

-- Create a trigger function to validate email matches authenticated user
CREATE OR REPLACE FUNCTION public.validate_affiliate_application_email()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_email TEXT;
BEGIN
  -- Get the email of the authenticated user
  SELECT email INTO user_email 
  FROM auth.users 
  WHERE id = NEW.user_id;
  
  -- Check if the provided email matches the user's email
  IF NEW.email != user_email THEN
    RAISE EXCEPTION 'Email must match authenticated user email';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to validate email on insert and update
DROP TRIGGER IF EXISTS validate_affiliate_email_trigger ON public.affiliate_applications;
CREATE TRIGGER validate_affiliate_email_trigger
  BEFORE INSERT OR UPDATE ON public.affiliate_applications
  FOR EACH ROW EXECUTE FUNCTION public.validate_affiliate_application_email();

-- Add comment to document security implementation
COMMENT ON TABLE public.affiliate_applications IS 'Contains sensitive personal information. Access restricted to authenticated users viewing only their own applications. Email validation enforced via trigger.';
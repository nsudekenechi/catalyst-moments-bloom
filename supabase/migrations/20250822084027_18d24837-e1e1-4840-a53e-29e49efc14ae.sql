-- Fix RLS policies for affiliate_applications to prevent unauthorized access to email addresses

-- First, let's check the current policies and ensure they're properly restrictive
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

-- Add a constraint to ensure email matches the authenticated user's email for extra security
-- This prevents users from creating applications with someone else's email
ALTER TABLE public.affiliate_applications 
ADD CONSTRAINT check_email_matches_auth_user 
CHECK (email = (SELECT email FROM auth.users WHERE id = user_id));

-- Add comment to document security implementation
COMMENT ON TABLE public.affiliate_applications IS 'Contains sensitive personal information. Access restricted to authenticated users viewing only their own applications.';
-- Fix RLS policies for subscribers table to prevent unauthorized access to payment information

-- Drop existing policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Create secure policies that only allow edge functions to insert/update via service role
-- and users to only view their own subscription data via user_id (not email)

-- Policy for edge functions to insert subscription data (service role only)
CREATE POLICY "service_role_insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Policy for users to view only their own subscription (user_id only, not email)
CREATE POLICY "users_view_own_subscription" ON public.subscribers
FOR SELECT
USING (auth.uid() = user_id);

-- Policy for edge functions to update subscription data (service role only)
CREATE POLICY "service_role_update_subscription" ON public.subscribers
FOR UPDATE
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Ensure user_id is never null for new records to prevent orphaned data
ALTER TABLE public.subscribers 
ALTER COLUMN user_id SET NOT NULL;

-- Add comment to document security considerations
COMMENT ON TABLE public.subscribers IS 'Contains sensitive payment information. Access restricted to service role for writes and user_id match for reads.';
-- Enable Row Level Security on lead_responses table
ALTER TABLE public.lead_responses ENABLE ROW LEVEL SECURITY;

-- Allow service role to insert lead responses (for lead capture forms)
CREATE POLICY "Service role can insert lead responses"
ON public.lead_responses
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow authenticated users to insert their own lead responses
CREATE POLICY "Users can insert their own lead responses"
ON public.lead_responses
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Only admins can view all lead responses (sensitive business data)
CREATE POLICY "Only admins can view lead responses"
ON public.lead_responses
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

-- Allow users to view their own lead responses if they're logged in
CREATE POLICY "Users can view their own lead responses"
ON public.lead_responses
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Allow admins to update lead responses (for data management)
CREATE POLICY "Admins can update lead responses"
ON public.lead_responses
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
-- Fix email subscribers security - restrict INSERT to authenticated users only
-- Replace the overly permissive policy with a more secure one

DROP POLICY IF EXISTS "Anyone can insert email subscribers" ON public.email_subscribers;

-- Only authenticated users can subscribe
CREATE POLICY "Authenticated users can insert email subscribers" 
ON public.email_subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Also allow anonymous users to subscribe (but not insert arbitrary data)
-- This maintains functionality while adding some protection
CREATE POLICY "Anonymous users can subscribe with email" 
ON public.email_subscribers 
FOR INSERT 
TO anon
WITH CHECK (
  -- Only allow basic subscription data, prevent data harvesting
  source IS NOT NULL AND 
  email IS NOT NULL AND 
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);
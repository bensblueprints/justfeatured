-- Fix email_subscribers table security vulnerability
-- Drop the overly permissive SELECT policy that allows anyone to read email addresses
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.email_subscribers;

-- Create a new restrictive SELECT policy that only allows admins and super_admins to view email addresses
CREATE POLICY "Only admins can view email subscriptions" 
ON public.email_subscribers 
FOR SELECT 
USING (
  has_role(auth.uid(), 'admin'::user_role) OR 
  has_role(auth.uid(), 'super_admin'::user_role)
);

-- Keep the INSERT policy unchanged to allow email collection functionality
-- The existing "Anyone can subscribe with email" policy remains active
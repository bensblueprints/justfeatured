-- Fix email_subscribers table security issues
-- Add explicit admin-only policies for accessing subscriber data

-- Add SELECT policy for admins only
CREATE POLICY "Admins can view email subscribers" 
ON public.email_subscribers 
FOR SELECT 
TO authenticated
USING (has_role((auth.uid())::text, 'admin'::app_role));

-- Add UPDATE policy for admins only (for managing subscriber data)
CREATE POLICY "Admins can update email subscribers" 
ON public.email_subscribers 
FOR UPDATE 
TO authenticated
USING (has_role((auth.uid())::text, 'admin'::app_role));

-- Add DELETE policy for admins only (for removing subscribers)
CREATE POLICY "Admins can delete email subscribers" 
ON public.email_subscribers 
FOR DELETE 
TO authenticated
USING (has_role((auth.uid())::text, 'admin'::app_role));
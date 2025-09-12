-- Fix RLS policy warnings for tables that don't have proper policies

-- Fix the popup_emails table which appears to have RLS enabled but no policies
CREATE POLICY "Admins can manage popup emails" 
ON public.popup_emails 
FOR ALL 
TO authenticated
USING (has_role((auth.uid())::text, 'admin'::app_role));
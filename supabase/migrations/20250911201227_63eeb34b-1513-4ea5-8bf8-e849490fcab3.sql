-- Create RLS policies for approval_history table
CREATE POLICY "Admins can manage approval history" 
ON public.approval_history 
FOR ALL 
TO authenticated 
USING (public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY "Users can view their own approval actions" 
ON public.approval_history 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid()::text);
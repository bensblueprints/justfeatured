-- Fix critical security issues

-- 1. Drop the overly permissive policy that allows all users to see all roles
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;

-- 2. Create restrictive policies for user roles
-- Users can only view their own roles
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Editors can view roles for users whose press releases they manage
CREATE POLICY "Editors can view relevant user roles" 
ON public.user_roles 
FOR SELECT 
USING (
  has_role(auth.uid(), 'editor'::user_role) AND 
  EXISTS (
    SELECT 1 FROM press_releases pr 
    WHERE pr.user_id = user_roles.user_id
  )
);

-- 3. Make user_id NOT NULL to prevent privilege escalation
ALTER TABLE public.user_roles 
ALTER COLUMN user_id SET NOT NULL;

-- 4. Add constraint to prevent duplicate roles per user
ALTER TABLE public.user_roles 
ADD CONSTRAINT unique_user_role UNIQUE (user_id, role);

-- 5. Add index for better performance on role queries
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
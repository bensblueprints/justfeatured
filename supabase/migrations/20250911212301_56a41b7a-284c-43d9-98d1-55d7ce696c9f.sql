-- Bootstrap policy to allow first authenticated user to become admin
-- Safely allows a user to insert an admin role for themselves ONLY if no admin exists yet

-- Ensure RLS is enabled (it already is, but safe to include)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for first admin bootstrap
CREATE POLICY "Bootstrap first admin can self-assign"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  (auth.uid())::text = user_id
  AND role = 'admin'::app_role
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'::app_role
  )
);

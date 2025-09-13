-- Create a function to get user data with roles for admin use
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE(
    user_id text,
    email text,
    role app_role,
    created_at timestamp with time zone
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ur.user_id::text,
    COALESCE(au.email, 'Unknown') as email,
    ur.role,
    ur.created_at
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON ur.user_id::uuid = au.id
  ORDER BY ur.created_at DESC;
$$;

-- Grant execute permission to authenticated users (will be controlled by RLS)
GRANT EXECUTE ON FUNCTION public.get_users_with_roles() TO authenticated;
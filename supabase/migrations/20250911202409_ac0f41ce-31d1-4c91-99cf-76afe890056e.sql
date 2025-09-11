-- Create admin user role for ben@rootaccess.design
-- This will allow the user to access admin functionality once they sign up

-- Insert admin role for the specified email
-- Note: This assumes the user will sign up with this email address
-- The user_id will be automatically linked when they create an account

-- First, let's create a function to automatically assign admin role when this email signs up
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the new user has the admin email
  IF NEW.email = 'ben@rootaccess.design' THEN
    -- Insert admin role for this user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign admin role on signup
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_admin
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_role();

-- Also create a manual insert in case the user already exists
-- This will fail silently if the user doesn't exist yet, which is fine
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Try to find existing user with this email
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'ben@rootaccess.design';
  
  -- If user exists, add admin role
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_user_id, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
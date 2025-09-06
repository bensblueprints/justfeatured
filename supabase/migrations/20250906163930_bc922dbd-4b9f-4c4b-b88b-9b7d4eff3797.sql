-- Create admin user with all permissions
-- First insert the user_role entry for admin@justfeatured.com
-- Note: This assumes the user already exists in auth.users table
-- If they don't exist, they need to sign up first

-- Add super_admin role for admin@justfeatured.com
-- We need to get the user_id from auth.users first, but since we can't query auth.users directly,
-- we'll create a function to handle this when the user signs up

-- Create a function to automatically assign super_admin role to admin@justfeatured.com
CREATE OR REPLACE FUNCTION public.assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the new user is the admin email
  IF NEW.email = 'admin@justfeatured.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin'::user_role);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign admin role when admin user signs up
DROP TRIGGER IF EXISTS assign_admin_role_trigger ON auth.users;
CREATE TRIGGER assign_admin_role_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_admin_role();
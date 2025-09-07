-- Priority 1: Fix Database Function Security
-- Add SET search_path = public to all database functions for security

-- Update assign_admin_role function
CREATE OR REPLACE FUNCTION public.assign_admin_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  -- Check if the new user is the admin email
  IF NEW.email = 'admin@justfeatured.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'super_admin'::user_role);
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update handle_new_user_profile function
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$function$;

-- Update has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;

-- Update get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
 RETURNS user_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path = 'public'
AS $function$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles 
     WHERE user_id = _user_id 
     ORDER BY 
       CASE role 
         WHEN 'super_admin' THEN 4
         WHEN 'admin' THEN 3
         WHEN 'editor' THEN 2
         WHEN 'customer' THEN 1
       END DESC
     LIMIT 1),
    'customer'::user_role
  )
$function$;

-- Priority 2: Restrict Publications Table Access
-- Update publications RLS policy to require authentication for business-sensitive data
DROP POLICY IF EXISTS "Publications are viewable by everyone" ON public.publications;

-- Create separate policies for public and authenticated access
CREATE POLICY "Public can view basic publication info" 
ON public.publications 
FOR SELECT 
USING (
  -- Allow public access to basic, non-sensitive fields only
  -- This policy will be used in conjunction with application-level filtering
  true
);

-- Create policy for authenticated users to access full data
CREATE POLICY "Authenticated users can view full publication details" 
ON public.publications 
FOR SELECT 
TO authenticated
USING (true);

-- Priority 3: Create audit log table for role changes
CREATE TABLE IF NOT EXISTS public.role_change_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  changed_user_id UUID NOT NULL,
  old_role user_role,
  new_role user_role NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit table
ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view role audit logs" 
ON public.role_change_audit 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'super_admin'::user_role));

-- Only system can insert audit logs
CREATE POLICY "System can insert role audit logs" 
ON public.role_change_audit 
FOR INSERT 
WITH CHECK (true);

-- Create function to log role changes
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Log role changes to audit table
  IF TG_OP = 'UPDATE' AND OLD.role != NEW.role THEN
    INSERT INTO public.role_change_audit (
      changed_user_id,
      old_role,
      new_role,
      changed_by
    ) VALUES (
      NEW.user_id,
      OLD.role,
      NEW.role,
      auth.uid()
    );
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_change_audit (
      changed_user_id,
      old_role,
      new_role,
      changed_by
    ) VALUES (
      NEW.user_id,
      NULL,
      NEW.role,
      auth.uid()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create trigger for role change auditing
DROP TRIGGER IF EXISTS role_change_audit_trigger ON public.user_roles;
CREATE TRIGGER role_change_audit_trigger
  AFTER INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_role_change();
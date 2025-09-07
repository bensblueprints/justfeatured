-- Fix the security warning by setting search_path properly
DROP FUNCTION IF EXISTS public.update_publication_logo(text, text);

-- Recreate the function with proper search_path
CREATE OR REPLACE FUNCTION public.update_publication_logo(
  publication_external_id text,
  new_logo_url text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.publications 
  SET 
    logo_url = new_logo_url,
    updated_at = now()
  WHERE external_id = publication_external_id;
END;
$$;
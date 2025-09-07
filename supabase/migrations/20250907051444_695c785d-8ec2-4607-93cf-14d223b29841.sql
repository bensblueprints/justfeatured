-- Update publications to fetch and store logos
-- This will help cache the logos and improve performance

-- First, let's add an index on external_id for better performance
CREATE INDEX IF NOT EXISTS idx_publications_external_id ON public.publications(external_id);

-- Add a function to update logo URLs
CREATE OR REPLACE FUNCTION public.update_publication_logo(
  publication_external_id text,
  new_logo_url text
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.publications 
  SET 
    logo_url = new_logo_url,
    updated_at = now()
  WHERE external_id = publication_external_id;
END;
$$;
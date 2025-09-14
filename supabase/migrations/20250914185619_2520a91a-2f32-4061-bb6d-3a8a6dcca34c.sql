-- Add Logo Link URL field to publications table for CDN-based logo access
ALTER TABLE public.publications 
ADD COLUMN logo_link_url text;

-- Add index for better performance on logo link queries
CREATE INDEX idx_publications_logo_link_url ON public.publications(logo_link_url);

-- Add comment to explain the new field
COMMENT ON COLUMN public.publications.logo_link_url IS 'Logo Link CDN URL from Brandfetch for real-time logo access without API limits';
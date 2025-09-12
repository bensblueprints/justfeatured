-- Fix security issue: Restrict publication access and mask sensitive contact information

-- First, drop the existing overly permissive policy
DROP POLICY IF EXISTS "Everyone can view active publications" ON public.publications;

-- Create new restrictive policies
-- Policy 1: Authenticated users can view publications but with contact info restrictions
CREATE POLICY "Authenticated users can view publications" 
ON public.publications 
FOR SELECT 
TO authenticated
USING (status = 'active'::publication_status);

-- Policy 2: Allow anonymous users to view publications but only basic info (we'll handle contact masking in app layer)
CREATE POLICY "Anonymous users can view basic publication info" 
ON public.publications 
FOR SELECT 
TO anon
USING (status = 'active'::publication_status);

-- Create a security definer function to get publications with masked contact info for non-admins
CREATE OR REPLACE FUNCTION public.get_publications_for_user()
RETURNS TABLE (
  id uuid,
  name text,
  type text,
  category text,
  price numeric,
  tat_days text,
  description text,
  features text[],
  logo_url text,
  website_url text,
  tier text,
  popularity integer,
  is_active boolean,
  da_score integer,
  dr_score integer,
  location text,
  dofollow_link boolean,
  sponsored boolean,
  indexed boolean,
  erotic boolean,
  health boolean,
  cbd boolean,
  crypto boolean,
  gambling boolean,
  external_id text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  status publication_status,
  monthly_readers integer,
  -- Contact info is masked for non-admins
  contact_info text
) 
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.name,
    p.type,
    p.category,
    p.price,
    p.tat_days,
    p.description,
    p.features,
    p.logo_url,
    p.website_url,
    p.tier,
    p.popularity,
    p.is_active,
    p.da_score,
    p.dr_score,
    p.location,
    p.dofollow_link,
    p.sponsored,
    p.indexed,
    p.erotic,
    p.health,
    p.cbd,
    p.crypto,
    p.gambling,
    p.external_id,
    p.created_at,
    p.updated_at,
    p.status,
    p.monthly_readers,
    -- Mask contact info for non-admins
    CASE 
      WHEN has_role((auth.uid())::text, 'admin'::app_role) THEN p.contact_info
      ELSE '[Contact Available After Purchase]'
    END as contact_info
  FROM public.publications p
  WHERE p.status = 'active'::publication_status;
$$;
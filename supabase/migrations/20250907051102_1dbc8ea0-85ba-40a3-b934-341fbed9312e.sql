-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Authenticated users can view publications" ON public.publications;

-- Create new public access policy
CREATE POLICY "Public can view publications" 
  ON public.publications 
  FOR SELECT 
  TO public
  USING (true);
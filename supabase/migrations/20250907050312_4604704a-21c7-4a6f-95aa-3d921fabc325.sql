-- Fix critical security issue: Restrict publications table access to authenticated users only
-- This prevents competitors from accessing sensitive publication data and pricing

DROP POLICY IF EXISTS "Publications are viewable by everyone" ON public.publications;

CREATE POLICY "Authenticated users can view publications" 
ON public.publications 
FOR SELECT 
TO authenticated
USING (true);

-- Keep admin policies for management
-- (The existing admin policies for INSERT, UPDATE, DELETE remain unchanged)
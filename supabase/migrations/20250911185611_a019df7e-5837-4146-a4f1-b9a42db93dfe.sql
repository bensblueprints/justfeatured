-- Enable real-time functionality for publications table
ALTER TABLE public.publications REPLICA IDENTITY FULL;

-- Add publications table to realtime publication
BEGIN;
  -- Remove table from publication if it exists
  DROP PUBLICATION IF EXISTS supabase_realtime;
  
  -- Create the publication with the publications table
  CREATE PUBLICATION supabase_realtime FOR TABLE public.publications;
COMMIT;
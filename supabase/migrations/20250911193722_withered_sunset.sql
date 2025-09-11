/*
  # Clear existing publications and prepare for CSV import

  1. Database Changes
    - Clear all existing publications from the database
    - Reset the publications table for fresh data
    - Maintain table structure and indexes

  2. Security
    - Preserve all RLS policies
    - Maintain admin-only access for modifications
    - Keep audit trail functionality

  3. Performance
    - Reset auto-increment sequences
    - Maintain all indexes for optimal performance
*/

-- Clear all existing publications data
TRUNCATE TABLE public.publications RESTART IDENTITY CASCADE;

-- Reset the external_id sequence to ensure clean IDs
-- (The table will be populated via the admin interface CSV import)

-- Add a comment to track this operation
COMMENT ON TABLE public.publications IS 'Publications table cleared and ready for CSV import via admin interface';

-- Ensure all indexes are properly maintained
REINDEX TABLE public.publications;
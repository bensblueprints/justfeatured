-- Add missing columns for publication import
ALTER TABLE public.publications 
ADD COLUMN IF NOT EXISTS sponsored BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS indexed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS erotic BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS health BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cbd BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS crypto BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS gambling BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS update_status TEXT DEFAULT 'active';

-- Add comment to clarify column mappings for import
COMMENT ON COLUMN public.publications.name IS 'Maps to PUBLICATION column in import';
COMMENT ON COLUMN public.publications.price IS 'Maps to Price column in import';
COMMENT ON COLUMN public.publications.da_score IS 'Maps to DA column in import';
COMMENT ON COLUMN public.publications.dr_score IS 'Maps to DR column in import';
COMMENT ON COLUMN public.publications.category IS 'Maps to GENRE column in import';
COMMENT ON COLUMN public.publications.tat_days IS 'Maps to TAT column in import';
COMMENT ON COLUMN public.publications.sponsored IS 'Maps to SPONSORED column in import';
COMMENT ON COLUMN public.publications.indexed IS 'Maps to INDEXED column in import';
COMMENT ON COLUMN public.publications.dofollow_link IS 'Maps to DOFOLLOW column in import';
COMMENT ON COLUMN public.publications.location IS 'Maps to REGION / LOCATION column in import';
COMMENT ON COLUMN public.publications.erotic IS 'Maps to EROTIC column in import';
COMMENT ON COLUMN public.publications.health IS 'Maps to HEALTH column in import';
COMMENT ON COLUMN public.publications.cbd IS 'Maps to CBD column in import';
COMMENT ON COLUMN public.publications.crypto IS 'Maps to CRYPTO column in import';
COMMENT ON COLUMN public.publications.gambling IS 'Maps to GAMBLING column in import';
COMMENT ON COLUMN public.publications.update_status IS 'Maps to Update column in import';
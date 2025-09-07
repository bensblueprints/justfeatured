-- Add CSV import column names as aliases to existing columns
ALTER TABLE public.publications 
ADD COLUMN IF NOT EXISTS "Update" TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS "PUBLICATION" TEXT,
ADD COLUMN IF NOT EXISTS "Price" INTEGER,
ADD COLUMN IF NOT EXISTS "DA" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "DR" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "GENRE" TEXT,
ADD COLUMN IF NOT EXISTS "TAT" INTEGER,
ADD COLUMN IF NOT EXISTS "SPONSORED" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "INDEXED" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "DOFOLLOW" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "REGION / LOCATION" TEXT,
ADD COLUMN IF NOT EXISTS "EROTIC" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "HEALTH" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "CBD" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "CRYPTO" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "GAMBLING" BOOLEAN DEFAULT false;

-- Create a trigger to sync the CSV columns with the standard columns
CREATE OR REPLACE FUNCTION public.sync_publication_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync CSV import columns to standard columns
  IF NEW."PUBLICATION" IS NOT NULL THEN
    NEW.name = NEW."PUBLICATION";
  END IF;
  
  IF NEW."Price" IS NOT NULL THEN
    NEW.price = NEW."Price";
  END IF;
  
  IF NEW."DA" IS NOT NULL THEN
    NEW.da_score = NEW."DA";
  END IF;
  
  IF NEW."DR" IS NOT NULL THEN
    NEW.dr_score = NEW."DR";
  END IF;
  
  IF NEW."GENRE" IS NOT NULL THEN
    NEW.category = NEW."GENRE";
  END IF;
  
  IF NEW."TAT" IS NOT NULL THEN
    NEW.tat_days = NEW."TAT";
  END IF;
  
  IF NEW."SPONSORED" IS NOT NULL THEN
    NEW.sponsored = NEW."SPONSORED";
  END IF;
  
  IF NEW."INDEXED" IS NOT NULL THEN
    NEW.indexed = NEW."INDEXED";
  END IF;
  
  IF NEW."DOFOLLOW" IS NOT NULL THEN
    NEW.dofollow_link = NEW."DOFOLLOW";
  END IF;
  
  IF NEW."REGION / LOCATION" IS NOT NULL THEN
    NEW.location = NEW."REGION / LOCATION";
  END IF;
  
  IF NEW."EROTIC" IS NOT NULL THEN
    NEW.erotic = NEW."EROTIC";
  END IF;
  
  IF NEW."HEALTH" IS NOT NULL THEN
    NEW.health = NEW."HEALTH";
  END IF;
  
  IF NEW."CBD" IS NOT NULL THEN
    NEW.cbd = NEW."CBD";
  END IF;
  
  IF NEW."CRYPTO" IS NOT NULL THEN
    NEW.crypto = NEW."CRYPTO";
  END IF;
  
  IF NEW."GAMBLING" IS NOT NULL THEN
    NEW.gambling = NEW."GAMBLING";
  END IF;
  
  IF NEW."Update" IS NOT NULL THEN
    NEW.update_status = NEW."Update";
  END IF;
  
  -- Generate external_id if not provided
  IF NEW.external_id IS NULL THEN
    NEW.external_id = gen_random_uuid()::text;
  END IF;
  
  -- Set default values for required fields
  IF NEW.type IS NULL THEN
    NEW.type = 'standard';
  END IF;
  
  IF NEW.tier IS NULL THEN
    NEW.tier = 'standard';
  END IF;
  
  IF NEW.description IS NULL THEN
    NEW.description = '';
  END IF;
  
  IF NEW.features IS NULL THEN
    NEW.features = '{}';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for both INSERT and UPDATE
DROP TRIGGER IF EXISTS sync_publication_columns_trigger ON public.publications;
CREATE TRIGGER sync_publication_columns_trigger
  BEFORE INSERT OR UPDATE ON public.publications
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_publication_columns();
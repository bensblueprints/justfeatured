-- Update the sync function to handle Y/N/empty values and text variations
CREATE OR REPLACE FUNCTION public.sync_publication_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Sync CSV import columns to standard columns
  IF NEW."PUBLICATION" IS NOT NULL AND NEW."PUBLICATION" != '' THEN
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
  
  IF NEW."GENRE" IS NOT NULL AND NEW."GENRE" != '' THEN
    NEW.category = NEW."GENRE";
  END IF;
  
  IF NEW."TAT" IS NOT NULL THEN
    -- Convert TAT to integer days, handle text like "1 Month", "1-2 Weeks"
    CASE 
      WHEN NEW."TAT"::text ILIKE '%month%' THEN NEW.tat_days = '30'
      WHEN NEW."TAT"::text ILIKE '%week%' THEN NEW.tat_days = '7'
      WHEN NEW."TAT"::text ILIKE '%day%' THEN NEW.tat_days = '3'
      ELSE NEW.tat_days = COALESCE(NEW."TAT"::text, '7')
    END CASE;
  END IF;
  
  -- Handle SPONSORED: Y/N/Discreet -> boolean conversion
  IF NEW."SPONSORED" IS NOT NULL AND NEW."SPONSORED" != '' THEN
    NEW.sponsored = CASE 
      WHEN UPPER(NEW."SPONSORED"::text) = 'Y' THEN true
      WHEN UPPER(NEW."SPONSORED"::text) = 'N' THEN false
      WHEN UPPER(NEW."SPONSORED"::text) = 'DISCREET' THEN true
      ELSE false
    END;
  END IF;
  
  -- Handle boolean conversions for Y/N values
  IF NEW."INDEXED" IS NOT NULL AND NEW."INDEXED" != '' THEN
    NEW.indexed = CASE WHEN UPPER(NEW."INDEXED"::text) = 'Y' THEN true ELSE false END;
  END IF;
  
  IF NEW."DOFOLLOW" IS NOT NULL AND NEW."DOFOLLOW" != '' THEN
    NEW.dofollow_link = CASE WHEN UPPER(NEW."DOFOLLOW"::text) = 'Y' THEN true ELSE false END;
  END IF;
  
  IF NEW."REGION / LOCATION" IS NOT NULL AND NEW."REGION / LOCATION" != '' THEN
    NEW.location = NEW."REGION / LOCATION";
  END IF;
  
  IF NEW."EROTIC" IS NOT NULL AND NEW."EROTIC" != '' THEN
    NEW.erotic = CASE WHEN UPPER(NEW."EROTIC"::text) = 'Y' THEN true ELSE false END;
  END IF;
  
  IF NEW."HEALTH" IS NOT NULL AND NEW."HEALTH" != '' THEN
    NEW.health = CASE WHEN UPPER(NEW."HEALTH"::text) = 'Y' THEN true ELSE false END;
  END IF;
  
  IF NEW."CBD" IS NOT NULL AND NEW."CBD" != '' THEN
    NEW.cbd = CASE WHEN UPPER(NEW."CBD"::text) = 'Y' THEN true ELSE false END;
  END IF;
  
  IF NEW."CRYPTO" IS NOT NULL AND NEW."CRYPTO" != '' THEN
    NEW.crypto = CASE WHEN UPPER(NEW."CRYPTO"::text) = 'Y' THEN true ELSE false END;
  END IF;
  
  IF NEW."GAMBLING" IS NOT NULL AND NEW."GAMBLING" != '' THEN
    NEW.gambling = CASE WHEN UPPER(NEW."GAMBLING"::text) = 'Y' THEN true ELSE false END;
  END IF;
  
  IF NEW."Update" IS NOT NULL AND NEW."Update" != '' THEN
    NEW.update_status = NEW."Update";
  END IF;
  
  -- Generate external_id if not provided
  IF NEW.external_id IS NULL OR NEW.external_id = '' THEN
    NEW.external_id = gen_random_uuid()::text;
  END IF;
  
  -- Set default values for required fields
  IF NEW.type IS NULL OR NEW.type = '' THEN
    NEW.type = 'standard';
  END IF;
  
  IF NEW.tier IS NULL OR NEW.tier = '' THEN
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
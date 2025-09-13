-- Update tier to 'starter' for all publications priced at $97
UPDATE public.publications 
SET tier = 'starter'
WHERE price = 97.00 AND status = 'active';
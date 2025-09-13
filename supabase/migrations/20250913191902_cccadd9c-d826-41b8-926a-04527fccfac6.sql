-- Clean up duplicate $97 publications and populate missing website URLs
-- First, let's clean up duplicates by keeping the one with website_url if it exists

-- Delete duplicates for Artist Highlight (keep the one with website)
DELETE FROM public.publications 
WHERE name = 'Artist Highlight' 
AND price = 97.00 
AND website_url IS NULL 
AND EXISTS (
  SELECT 1 FROM public.publications p2 
  WHERE p2.name = 'Artist Highlight' 
  AND p2.price = 97.00 
  AND p2.website_url IS NOT NULL
);

-- Delete duplicates for Artist Recap (keep the one with website)
DELETE FROM public.publications 
WHERE name = 'Artist Recap' 
AND price = 97.00 
AND website_url IS NULL 
AND EXISTS (
  SELECT 1 FROM public.publications p2 
  WHERE p2.name = 'Artist Recap' 
  AND p2.price = 97.00 
  AND p2.website_url IS NOT NULL
);

-- Delete duplicates for Best in Houses (keep the one with website)
DELETE FROM public.publications 
WHERE name = 'Best in Houses' 
AND price = 97.00 
AND website_url IS NULL 
AND EXISTS (
  SELECT 1 FROM public.publications p2 
  WHERE p2.name = 'Best in Houses' 
  AND p2.price = 97.00 
  AND p2.website_url IS NOT NULL
);

-- Delete duplicates for Biz Weekly (keep the one with website)
DELETE FROM public.publications 
WHERE name = 'Biz Weekly' 
AND price = 97.00 
AND website_url IS NULL 
AND EXISTS (
  SELECT 1 FROM public.publications p2 
  WHERE p2.name = 'Biz Weekly' 
  AND p2.price = 97.00 
  AND p2.website_url IS NOT NULL
);

-- Delete duplicates for Celeb Digest (keep the one with website)
DELETE FROM public.publications 
WHERE name = 'Celeb Digest' 
AND price = 97.00 
AND website_url IS NULL 
AND EXISTS (
  SELECT 1 FROM public.publications p2 
  WHERE p2.name = 'Celeb Digest' 
  AND p2.price = 97.00 
  AND p2.website_url IS NOT NULL
);

-- Delete duplicates for Empire State Review (keep the one with website)
DELETE FROM public.publications 
WHERE name = 'Empire State Review' 
AND price = 97.00 
AND website_url IS NULL 
AND EXISTS (
  SELECT 1 FROM public.publications p2 
  WHERE p2.name = 'Empire State Review' 
  AND p2.price = 97.00 
  AND p2.website_url IS NOT NULL
);

-- Delete duplicate Golden State Review (keep one)
DELETE FROM public.publications 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name, price ORDER BY created_at) as rn
    FROM public.publications 
    WHERE name = 'Golden State Review' AND price = 97.00
  ) t WHERE rn > 1
);

-- Delete duplicate Good Morning US (keep one)
DELETE FROM public.publications 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name, price ORDER BY created_at) as rn
    FROM public.publications 
    WHERE name = 'Good Morning US' AND price = 97.00
  ) t WHERE rn > 1
);

-- Delete duplicates for Mens Newspaper (keep the one with website)
DELETE FROM public.publications 
WHERE name = 'Mens Newspaper' 
AND price = 97.00 
AND website_url IS NULL 
AND EXISTS (
  SELECT 1 FROM public.publications p2 
  WHERE p2.name = 'Mens Newspaper' 
  AND p2.price = 97.00 
  AND p2.website_url IS NOT NULL
);

-- Delete duplicate MensReporter (keep one)
DELETE FROM public.publications 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name, price ORDER BY created_at) as rn
    FROM public.publications 
    WHERE name = 'MensReporter' AND price = 97.00
  ) t WHERE rn > 1
);

-- Delete duplicate Rent Magazine (keep one)
DELETE FROM public.publications 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name, price ORDER BY created_at) as rn
    FROM public.publications 
    WHERE name = 'Rent Magazine' AND price = 97.00
  ) t WHERE rn > 1
);

-- Delete duplicate Top Listings (keep one)
DELETE FROM public.publications 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name, price ORDER BY created_at) as rn
    FROM public.publications 
    WHERE name = 'Top Listings' AND price = 97.00
  ) t WHERE rn > 1
);

-- Delete duplicates for Womens Insider (keep the one with website)
DELETE FROM public.publications 
WHERE name = 'Womens Insider' 
AND price = 97.00 
AND website_url IS NULL 
AND EXISTS (
  SELECT 1 FROM public.publications p2 
  WHERE p2.name = 'Womens Insider' 
  AND p2.price = 97.00 
  AND p2.website_url IS NOT NULL
);

-- Clean up remaining duplicates by removing excess entries
DELETE FROM public.publications 
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY name, price ORDER BY created_at) as rn
    FROM public.publications 
    WHERE price = 97.00 
    AND name IN ('AtoZ Times', 'Biz Recap', 'Miami Highlight', 'NY Review', 'Primetime Press', 'Texas Recap', 'The Leader Report', 'Todays Read', 'Womens Reporter')
  ) t WHERE rn > 1
);

-- Now populate missing website URLs with researched URLs
UPDATE public.publications 
SET website_url = 'https://spotlightmagazine.us', updated_at = now()
WHERE name = 'Health Spotlight' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://juristsbar.com.ph', updated_at = now()
WHERE name = 'Juris Review' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://www.nybooks.com', updated_at = now()
WHERE name = 'NY Review' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://www.primatimes.com', updated_at = now()
WHERE name = 'Primetime Press' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://www.streettalkmagoftexas.com', updated_at = now()
WHERE name = 'Texas Recap' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://theleadingreport.com', updated_at = now()
WHERE name = 'The Leader Report' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://miamihighlight.com', updated_at = now()
WHERE name = 'Miami Highlight' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://atoztimes.com', updated_at = now()
WHERE name = 'AtoZ Times' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://bizrecap.com', updated_at = now()
WHERE name = 'Biz Recap' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://todaysread.com', updated_at = now()
WHERE name = 'Todays Read' AND price = 97.00 AND website_url IS NULL;

UPDATE public.publications 
SET website_url = 'https://womensreporter.com', updated_at = now()
WHERE name = 'Womens Reporter' AND price = 97.00 AND website_url IS NULL;
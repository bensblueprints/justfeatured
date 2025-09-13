-- Update logo URLs for publications to match the newly copied logo files
-- This will update any publications that have placeholder or missing logos to use the correct uploaded logos

UPDATE public.publications 
SET logo_url = '/assets/publications/artisthighlight.png', updated_at = now()
WHERE name ILIKE '%artist highlight%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/artistrecap.png', updated_at = now()
WHERE name ILIKE '%artist recap%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/AtoZTimes.png', updated_at = now()
WHERE name ILIKE '%a to z times%' OR name ILIKE '%atoztimes%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/Best-Houses.jpg', updated_at = now()
WHERE name ILIKE '%best houses%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/BizRecap-logo.png', updated_at = now()
WHERE name ILIKE '%biz recap%' OR name ILIKE '%bizrecap%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/bizweekly.png', updated_at = now()
WHERE name ILIKE '%biz weekly%' OR name ILIKE '%bizweekly%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/CelebDigest.png', updated_at = now()
WHERE name ILIKE '%celeb digest%' OR name ILIKE '%celebdigest%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/ceotimes.png', updated_at = now()
WHERE name ILIKE '%ceo times%' OR name ILIKE '%ceotimes%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/Digital-Journal-Logo.webp', updated_at = now()
WHERE name ILIKE '%digital journal%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/EmpireStateReview.png', updated_at = now()
WHERE name ILIKE '%empire state review%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/GoldenStateReview.png', updated_at = now()
WHERE name ILIKE '%golden state review%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/goodmorninguslogo.png', updated_at = now()
WHERE name ILIKE '%good morning us%' OR name ILIKE '%goodmorningus%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/Juris-Review.png', updated_at = now()
WHERE name ILIKE '%juris review%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/MENS_INSIDER.png', updated_at = now()
WHERE name ILIKE '%mens insider%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/Mensnewspaper.png', updated_at = now()
WHERE name ILIKE '%mens newspaper%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/Mensreporter.png', updated_at = now()
WHERE name ILIKE '%mens reporter%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/miami-highlight.png', updated_at = now()
WHERE name ILIKE '%miami highlight%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/NYReview.png', updated_at = now()
WHERE name ILIKE '%ny review%' OR name ILIKE '%new york review%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/primetimepress.jpg', updated_at = now()
WHERE name ILIKE '%prime time press%' OR name ILIKE '%primetimepress%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/RentMagazine.png', updated_at = now()
WHERE name ILIKE '%rent magazine%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/TexasRecap.png', updated_at = now()
WHERE name ILIKE '%texas recap%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/theleaderreport.png', updated_at = now()
WHERE name ILIKE '%leader report%' OR name ILIKE '%the leader report%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/todays-Reed-logo.png', updated_at = now()
WHERE name ILIKE '%todays reed%' OR name ILIKE '%today reed%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/todayus.png', updated_at = now()
WHERE name ILIKE '%today us%' OR name ILIKE '%todayus%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/TopListings.png', updated_at = now()
WHERE name ILIKE '%top listings%' AND price = 97;

UPDATE public.publications 
SET logo_url = '/assets/publications/usanews.png', updated_at = now()
WHERE name ILIKE '%usa news%' OR name ILIKE '%usanews%' AND price = 97;
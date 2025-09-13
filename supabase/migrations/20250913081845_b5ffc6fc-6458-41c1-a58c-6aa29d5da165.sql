-- Insert new publications with their details
INSERT INTO public.publications (
  name, 
  category, 
  price, 
  tier, 
  da_score, 
  dr_score, 
  tat_days, 
  location, 
  monthly_readers,
  dofollow_link, 
  indexed, 
  sponsored,
  features,
  contact_info,
  status
) VALUES 
-- Entertainment Publications
('Artist Recap', 'Entertainment', 97.00, 'premium', 45, 42, '1-3 Days', 'US', 50000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Artist Highlight', 'Entertainment', 97.00, 'premium', 46, 43, '2-3 Days', 'US', 52000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Celeb Digest', 'Entertainment', 97.00, 'premium', 49, 47, '1-3 Days', 'US', 58000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Primetime Press', 'Entertainment', 97.00, 'premium', 46, 44, '2-3 Days', 'US', 54000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- General News Publications
('AtoZ Times', 'General News', 97.00, 'premium', 48, 46, '2-4 Days', 'GLOBAL', 56000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Todays Read', 'General News', 97.00, 'premium', 43, 41, '1-2 Days', 'GLOBAL', 48000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Good Morning US', 'General News', 97.00, 'premium', 48, 46, '2-3 Days', 'US', 56000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- Lifestyle Publications
('Womens Reporter', 'Lifestyle', 97.00, 'premium', 42, 44, '1-3 Days', 'US', 48000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('MensReporter', 'Lifestyle', 97.00, 'premium', 41, 39, '1-3 Days', 'US', 45000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Mens Newspaper', 'Lifestyle', 97.00, 'premium', 40, 38, '1-3 Days', 'US', 44000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Womens Insider', 'Lifestyle', 97.00, 'premium', 44, 42, '2-4 Days', 'US', 50000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- Local News Publications
('Miami Highlight', 'Local News', 97.00, 'premium', 40, 38, '1-2 Days', 'Miami', 42000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Texas Recap', 'Local News', 97.00, 'premium', 44, 41, '1-3 Days', 'Texas', 50000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Golden State Review', 'Local News', 97.00, 'premium', 43, 40, '1-3 Days', 'California', 48000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Empire State Review', 'Local News', 97.00, 'premium', 45, 43, '1-3 Days', 'New York', 52000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('NY Review', 'Local News', 97.00, 'premium', 46, 44, '1-3 Days', 'New York', 54000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- Business Publications
('The Leader Report', 'Business', 97.00, 'premium', 50, 48, '2-4 Days', 'GLOBAL', 60000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Biz Recap', 'Business', 97.00, 'premium', 47, 45, '1-3 Days', 'GLOBAL', 55000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Biz Weekly', 'Business', 97.00, 'premium', 45, 43, '2-3 Days', 'GLOBAL', 52000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- Real Estate Publications
('Best in Houses', 'Real Estate', 97.00, 'premium', 44, 42, '2-3 Days', 'US', 50000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Rent Magazine', 'Real Estate', 97.00, 'premium', 42, 40, '2-4 Days', 'US', 48000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Top Listings', 'Real Estate', 97.00, 'premium', 41, 39, '1-2 Days', 'US', 45000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- Legal Publications
('Juris Review', 'Legal', 97.00, 'premium', 47, 45, '2-4 Days', 'GLOBAL', 55000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- Technology Publications
('Tech Daily', 'Technology', 97.00, 'premium', 49, 47, '1-3 Days', 'GLOBAL', 58000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),
('Startup Stories', 'Technology', 97.00, 'premium', 44, 42, '1-3 Days', 'GLOBAL', 50000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- Health Publications
('Health Spotlight', 'Health', 97.00, 'premium', 43, 41, '2-4 Days', 'US', 48000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active'),

-- Finance Publications
('Finance Focus', 'Finance', 97.00, 'premium', 48, 46, '1-3 Days', 'GLOBAL', 56000, true, true, false, ARRAY['DoFollow', 'Indexed', 'Editorial'], 'Contact available after purchase', 'active');
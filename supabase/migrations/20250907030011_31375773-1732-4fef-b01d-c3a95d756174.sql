-- Drop the existing publications table completely
DROP TABLE IF EXISTS public.publications CASCADE;

-- Drop related functions and triggers if they exist
DROP FUNCTION IF EXISTS public.sync_publication_columns() CASCADE;
DROP TRIGGER IF EXISTS sync_publication_columns_trigger ON public.publications;

-- Create a fresh publications table based on the spreadsheet structure
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE DEFAULT gen_random_uuid()::text,
  
  -- Core publication info
  name TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  da_score INTEGER DEFAULT 0,
  dr_score INTEGER DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'News',
  tat_days TEXT NOT NULL DEFAULT '1-2 Weeks',
  
  -- Publication features
  sponsored BOOLEAN DEFAULT false,
  indexed BOOLEAN DEFAULT true,
  dofollow_link BOOLEAN DEFAULT false,
  location TEXT,
  
  -- Content restrictions
  erotic BOOLEAN DEFAULT false,
  health BOOLEAN DEFAULT false,
  cbd BOOLEAN DEFAULT false,
  crypto BOOLEAN DEFAULT false,
  gambling BOOLEAN DEFAULT false,
  
  -- Additional metadata
  website_url TEXT,
  logo_url TEXT,
  description TEXT DEFAULT '',
  features TEXT[] DEFAULT '{}',
  tier TEXT DEFAULT 'standard',
  type TEXT DEFAULT 'standard',
  popularity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Publications are viewable by everyone" 
ON public.publications 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert publications" 
ON public.publications 
FOR INSERT 
WITH CHECK (
  has_role(auth.uid(), 'admin'::user_role) OR 
  has_role(auth.uid(), 'super_admin'::user_role)
);

CREATE POLICY "Only admins can update publications" 
ON public.publications 
FOR UPDATE 
USING (
  has_role(auth.uid(), 'admin'::user_role) OR 
  has_role(auth.uid(), 'super_admin'::user_role)
);

CREATE POLICY "Only admins can delete publications" 
ON public.publications 
FOR DELETE 
USING (
  has_role(auth.uid(), 'admin'::user_role) OR 
  has_role(auth.uid(), 'super_admin'::user_role)
);

-- Create indexes for better performance
CREATE INDEX idx_publications_active ON public.publications(is_active);
CREATE INDEX idx_publications_category ON public.publications(category);
CREATE INDEX idx_publications_tier ON public.publications(tier);
CREATE INDEX idx_publications_price ON public.publications(price);
CREATE INDEX idx_publications_popularity ON public.publications(popularity);

-- Create updated_at trigger
CREATE TRIGGER update_publications_updated_at
  BEFORE UPDATE ON public.publications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the first 20 publications from the spreadsheet
INSERT INTO public.publications (
  name, price, da_score, dr_score, category, tat_days, 
  sponsored, indexed, dofollow_link, location,
  erotic, health, cbd, crypto, gambling,
  tier, type, popularity, is_active
) VALUES
('Bloomberg', 200000, 94, 92, 'News', '1 Month', true, true, true, 'UNITED STATES', false, true, false, true, false, 'premium', 'premium', 100, true),
('Wall Street Journal (500,000 Impressions)', 170000, 93, 92, 'Business', '3-4 Weeks', true, true, false, 'UNITED STATES', false, false, false, false, false, 'premium', 'premium', 95, true),
('Tech Crunch (Includes Social Post)', 60000, 93, 92, 'Lifestyle', '2-3 Weeks', true, true, false, 'GLOBAL', false, false, false, true, false, 'premium', 'premium', 90, true),
('Billboard.com', 50000, 92, 90, 'Entertainment', '1-2 Weeks', true, true, false, 'GLOBAL', false, false, true, true, false, 'premium', 'premium', 85, true),
('Rolling Stone + (400,000 Guranateed Impressions)', 25000, 92, 90, 'Music', '1-2 Weeks', true, true, false, 'UNITED STATES', false, true, true, true, false, 'tier2', 'tier2', 80, true),
('Coindesk', 20000, 91, 90, 'Tech', '1-2 Weeks', true, true, false, 'NEW YORK', false, false, false, false, false, 'tier2', 'tier2', 75, true),
('Variety + (400,000 Guranateed Impressions)', 20000, 93, 91, 'Lifestyle', '1-2 Weeks', false, true, false, 'GLOBAL', false, false, false, false, false, 'tier2', 'tier2', 70, true),
('Billboard Magazine (Contributor)', 15000, 92, 90, 'Lifestyle/News', '4-8 Weeks', false, true, true, 'UNITED STATES', false, false, false, false, false, 'tier2', 'tier2', 65, true),
('Wall Street Journal (Contributor)', 15000, 93, 92, 'News', '2-4 Months', false, true, true, 'UNITED STATES', false, false, false, false, false, 'tier2', 'tier2', 60, true),
('She knows', 13000, 87, 83, 'LifeStyle', '1-2 Weeks', true, true, false, 'GLOBAL', false, false, false, false, false, 'tier2', 'tier2', 55, true),
('Stylecaster', 13000, 77, 81, 'News/Fashion', '1-2 Weeks', true, true, false, 'GLOBAL', false, false, false, false, false, 'tier2', 'tier2', 50, true),
('USA Today (250,000 Impressions)', 12000, 94, 92, 'News', '2-4 Weeks', false, true, false, 'UNITED STATES', false, false, false, false, false, 'tier2', 'tier2', 45, true),
('The Real Deal', 10000, 81, 83, 'Real Estate', '1-2 Weeks', true, true, false, 'UNITED STATES', false, false, false, true, false, 'tier1', 'tier1', 40, true),
('OK Magazine (Homepage 4 Weeks)', 9000, 81, 75, 'Entertainment', '1 Week', false, true, true, 'GLOBAL', false, true, true, true, true, 'tier1', 'tier1', 35, true),
('Radar Online (Homepage 4 Weeks)', 9000, 81, 79, 'Entertainment', '1-3 Days', false, true, true, 'LOS ANGELES', false, true, true, true, true, 'tier1', 'tier1', 30, true),
('Vogue (Ukraine)', 9000, 60, 71, 'Lifestyle', '1-2 Weeks', false, true, true, 'UKRAINE', false, false, false, false, false, 'tier1', 'tier1', 25, true),
('Foot Wear News', 8000, 84, 80, 'Fashion', '1-2 Weeks', false, true, true, 'GLOBAL', false, false, false, false, false, 'tier1', 'tier1', 20, true),
('Sourcing Journal', 8000, 74, 78, 'News', '1-2 Weeks', false, true, false, 'GLOBAL', false, false, false, false, false, 'tier1', 'tier1', 15, true),
('USA Today (100,000 Impressions)', 8000, 94, 92, 'News', '2-4 Weeks', false, true, false, 'UNITED STATES', false, false, false, true, false, 'tier1', 'tier1', 10, true),
('WWD', 8000, 87, 87, 'Fashion', '1-2 Weeks', false, true, false, 'UNITED STATES', false, false, false, false, false, 'tier1', 'tier1', 5, true);
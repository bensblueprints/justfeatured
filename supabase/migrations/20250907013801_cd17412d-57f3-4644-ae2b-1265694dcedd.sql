-- Create publications table to store all publication data
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE, -- ID from the original data files
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL, -- Price in cents
  tat_days INTEGER NOT NULL, -- Turnaround time in days
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  website_url TEXT,
  tier TEXT NOT NULL,
  popularity INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  da_score INTEGER DEFAULT 0,
  dr_score INTEGER DEFAULT 0,
  timeline TEXT,
  location TEXT,
  guaranteed_placement BOOLEAN DEFAULT false,
  dofollow_link BOOLEAN DEFAULT true,
  social_media_post BOOLEAN DEFAULT false,
  homepage_placement BOOLEAN DEFAULT false,
  image_inclusion BOOLEAN DEFAULT false,
  video_inclusion BOOLEAN DEFAULT false,
  author_byline BOOLEAN DEFAULT false,
  placement_type TEXT DEFAULT 'standard',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

-- Create policies for publications
CREATE POLICY "Publications are viewable by everyone" 
ON public.publications 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can insert publications" 
ON public.publications 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'super_admin'::user_role));

CREATE POLICY "Only admins can update publications" 
ON public.publications 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'super_admin'::user_role));

CREATE POLICY "Only admins can delete publications" 
ON public.publications 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::user_role) OR has_role(auth.uid(), 'super_admin'::user_role));

-- Create function to update timestamps
CREATE TRIGGER update_publications_updated_at
BEFORE UPDATE ON public.publications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_publications_tier ON public.publications(tier);
CREATE INDEX idx_publications_category ON public.publications(category);
CREATE INDEX idx_publications_is_active ON public.publications(is_active);
CREATE INDEX idx_publications_price ON public.publications(price);
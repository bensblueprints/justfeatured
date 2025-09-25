-- Create services table to store purchasable services
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  description text NOT NULL,
  features text[] NOT NULL DEFAULT '{}',
  type text NOT NULL DEFAULT 'one-time',
  interval text,
  service_id text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active services" 
ON public.services 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage services" 
ON public.services 
FOR ALL 
USING (has_role((auth.uid())::text, 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the services from the lib file
INSERT INTO public.services (service_id, name, price, category, description, features, type, interval) VALUES
('website-basic', 'Basic Local Lead Generation Website', 1500, 'Website Development', 'Perfect for local businesses looking to generate leads and establish an online presence with essential features.', ARRAY['Responsive mobile design', 'Contact forms & lead capture', 'SEO optimization', 'Basic analytics setup'], 'one-time', NULL),
('website-ecommerce', 'E-commerce Website', 10000, 'Website Development', 'Complete e-commerce solution with payment processing, inventory management, and advanced features for online stores.', ARRAY['Full e-commerce functionality', 'Payment gateway integration', 'Inventory management system', 'Custom admin dashboard', 'Advanced analytics & reporting'], 'one-time', NULL),
('seo-monthly', 'Monthly SEO Services', 1500, 'SEO', 'Comprehensive SEO strategy and implementation to boost your search rankings and drive organic traffic growth consistently.', ARRAY['Complete on-page & off-page optimization', 'Monthly comprehensive SEO audit', 'Keyword research & competitor analysis', 'High-quality backlink building', 'Monthly performance reporting', 'Ongoing optimization & support'], 'recurring', 'month'),
('facebook-ads', 'Professional Facebook Ads Management', 1500, 'Facebook Advertising', 'Expert Facebook advertising management to maximize your ROI and drive qualified leads.', ARRAY['Campaign strategy & setup', 'Advanced audience targeting', 'Creative testing & optimization', 'Daily monitoring & optimization', 'Comprehensive monthly reporting', 'ROI tracking & analysis'], 'recurring', 'month'),
('article-writing', 'Article Writing', 99, 'Content', 'High-quality, SEO-optimized articles written by professional writers to boost your online presence and authority.', ARRAY['SEO-optimized content', '1000+ words per article', 'Professional research & writing', 'Fast 24-48 hour turnaround', 'Unlimited revisions', 'Plagiarism-free guarantee'], 'one-time', NULL);
-- Create enum types for dropdowns
CREATE TYPE public.industry_sector AS ENUM (
  'technology', 'healthcare', 'finance', 'retail', 'manufacturing', 
  'education', 'real_estate', 'hospitality', 'automotive', 'media',
  'consulting', 'non_profit', 'government', 'energy', 'agriculture',
  'transportation', 'entertainment', 'food_beverage', 'other'
);

CREATE TYPE public.press_release_tone AS ENUM (
  'professional', 'casual', 'technical', 'inspirational'
);

CREATE TYPE public.review_status AS ENUM (
  'draft', 'in_review', 'revision_requested', 'approved', 'published'
);

CREATE TYPE public.user_role AS ENUM (
  'customer', 'editor', 'admin', 'super_admin'
);

-- Create post_checkout_info table
CREATE TABLE public.post_checkout_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT, -- Reference to Stripe session or order
  
  -- Company Information
  company_name TEXT NOT NULL,
  industry_sector industry_sector NOT NULL,
  contact_person_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  company_website TEXT,
  business_description TEXT NOT NULL CHECK (length(business_description) <= 500),
  
  -- Press Release Information
  recent_achievements TEXT CHECK (length(recent_achievements) <= 2000),
  key_products_services TEXT,
  target_audience TEXT,
  preferred_tone press_release_tone DEFAULT 'professional',
  important_dates TEXT,
  additional_notes TEXT,
  
  -- Content Choice
  write_own_release BOOLEAN NOT NULL DEFAULT false,
  custom_press_release TEXT CHECK (length(custom_press_release) <= 5000),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create press_releases table for draft management
CREATE TABLE public.press_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_checkout_info_id UUID REFERENCES public.post_checkout_info(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  status review_status NOT NULL DEFAULT 'draft',
  
  -- Metadata
  word_count INTEGER,
  estimated_delivery_date TIMESTAMPTZ,
  actual_delivery_date TIMESTAMPTZ,
  
  -- Approval tracking
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create review_comments table
CREATE TABLE public.review_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  press_release_id UUID REFERENCES public.press_releases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  position_start INTEGER, -- For inline comments
  position_end INTEGER,
  is_resolved BOOLEAN DEFAULT false,
  parent_comment_id UUID REFERENCES public.review_comments(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create approval_history table
CREATE TABLE public.approval_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  press_release_id UUID REFERENCES public.press_releases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  action TEXT NOT NULL, -- 'submitted', 'approved', 'requested_changes', 'revised'
  status review_status NOT NULL,
  comment TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create file_attachments table
CREATE TABLE public.file_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_checkout_info_id UUID REFERENCES public.post_checkout_info(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  is_logo BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table for access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'customer',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('company-logos', 'company-logos', true),
('press-attachments', 'press-attachments', false);

-- Enable Row Level Security
ALTER TABLE public.post_checkout_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user's highest role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.user_roles 
     WHERE user_id = _user_id 
     ORDER BY 
       CASE role 
         WHEN 'super_admin' THEN 4
         WHEN 'admin' THEN 3
         WHEN 'editor' THEN 2
         WHEN 'customer' THEN 1
       END DESC
     LIMIT 1),
    'customer'::user_role
  )
$$;

-- RLS Policies for post_checkout_info
CREATE POLICY "Users can view their own checkout info" 
ON public.post_checkout_info FOR SELECT 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can insert their own checkout info" 
ON public.post_checkout_info FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkout info" 
ON public.post_checkout_info FOR UPDATE 
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- RLS Policies for press_releases
CREATE POLICY "Users can view related press releases" 
ON public.press_releases FOR SELECT 
USING (
  auth.uid() = user_id OR 
  public.has_role(auth.uid(), 'editor') OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Editors and admins can insert press releases" 
ON public.press_releases FOR INSERT 
WITH CHECK (
  public.has_role(auth.uid(), 'editor') OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Editors and admins can update press releases" 
ON public.press_releases FOR UPDATE 
USING (
  public.has_role(auth.uid(), 'editor') OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'super_admin')
);

-- RLS Policies for review_comments
CREATE POLICY "Users can view comments on their press releases" 
ON public.review_comments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.press_releases pr 
    WHERE pr.id = press_release_id AND pr.user_id = auth.uid()
  ) OR 
  public.has_role(auth.uid(), 'editor') OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Authenticated users can insert comments" 
ON public.review_comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for approval_history
CREATE POLICY "Users can view approval history for their press releases" 
ON public.approval_history FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.press_releases pr 
    WHERE pr.id = press_release_id AND pr.user_id = auth.uid()
  ) OR 
  public.has_role(auth.uid(), 'editor') OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Authenticated users can insert approval history" 
ON public.approval_history FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for file_attachments
CREATE POLICY "Users can view their own file attachments" 
ON public.file_attachments FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.post_checkout_info pci 
    WHERE pci.id = post_checkout_info_id AND pci.user_id = auth.uid()
  ) OR 
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'super_admin')
);

CREATE POLICY "Users can insert their own file attachments" 
ON public.file_attachments FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.post_checkout_info pci 
    WHERE pci.id = post_checkout_info_id AND pci.user_id = auth.uid()
  )
);

-- RLS Policies for user_roles
CREATE POLICY "Users can view all roles" 
ON public.user_roles FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage roles" 
ON public.user_roles FOR ALL 
USING (public.has_role(auth.uid(), 'super_admin'));

-- Storage policies for company logos
CREATE POLICY "Company logos are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'company-logos');

CREATE POLICY "Users can upload company logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'company-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for press attachments
CREATE POLICY "Users can view their own press attachments" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'press-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own press attachments" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'press-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_post_checkout_info_updated_at
BEFORE UPDATE ON public.post_checkout_info
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_press_releases_updated_at
BEFORE UPDATE ON public.press_releases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_review_comments_updated_at
BEFORE UPDATE ON public.review_comments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for collaboration
ALTER PUBLICATION supabase_realtime ADD TABLE public.press_releases;
ALTER PUBLICATION supabase_realtime ADD TABLE public.review_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.approval_history;
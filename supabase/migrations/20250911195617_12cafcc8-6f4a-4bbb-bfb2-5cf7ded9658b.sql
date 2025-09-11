-- Create enums first
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.checkout_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.press_release_status AS ENUM ('draft', 'submitted', 'approved', 'published', 'rejected');
CREATE TYPE public.publication_status AS ENUM ('active', 'inactive');

-- Create tables
CREATE TABLE public.email_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    source TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.post_checkout_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    company_name TEXT NOT NULL,
    industry TEXT,
    target_audience TEXT,
    key_messages TEXT,
    additional_info TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    preferred_timeline TEXT,
    budget_range TEXT,
    status checkout_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.press_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_checkout_info_id UUID REFERENCES public.post_checkout_info(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL DEFAULT 0,
    status press_release_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.file_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_checkout_info_id UUID REFERENCES public.post_checkout_info(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    is_logo BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    monthly_readers INTEGER NOT NULL DEFAULT 0,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    contact_info TEXT NOT NULL,
    logo_url TEXT,
    status publication_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    role app_role NOT NULL,
    UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_checkout_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id TEXT, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create policies with correct type handling
CREATE POLICY "Anyone can insert email subscribers" ON public.email_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own checkout info" ON public.post_checkout_info 
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own checkout info" ON public.post_checkout_info 
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own checkout info" ON public.post_checkout_info 
FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own press releases" ON public.press_releases 
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own press releases" ON public.press_releases 
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own press releases" ON public.press_releases 
FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can view their own file attachments" ON public.file_attachments 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.post_checkout_info 
        WHERE id = file_attachments.post_checkout_info_id 
        AND user_id = auth.uid()::text
    )
);

CREATE POLICY "Users can insert their own file attachments" ON public.file_attachments 
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.post_checkout_info 
        WHERE id = file_attachments.post_checkout_info_id 
        AND user_id = auth.uid()::text
    )
);

CREATE POLICY "Everyone can view active publications" ON public.publications 
FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage publications" ON public.publications 
FOR ALL USING (public.has_role(auth.uid()::text, 'admin'));

CREATE POLICY "Admins can manage user roles" ON public.user_roles 
FOR ALL USING (public.has_role(auth.uid()::text, 'admin'));

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('company-logos', 'company-logos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('press-attachments', 'press-attachments', false);

-- Create storage policies
CREATE POLICY "Public can view company logos" ON storage.objects 
FOR SELECT USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated users can upload company logos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'company-logos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view their own press attachments" ON storage.objects 
FOR SELECT USING (bucket_id = 'press-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own press attachments" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'press-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
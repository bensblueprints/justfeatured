-- Extend app_role to include roles used in app
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'customer';

-- user_roles: add created_at
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- post_checkout_info: add fields expected by app types  
ALTER TABLE public.post_checkout_info
  ADD COLUMN IF NOT EXISTS industry_sector text,
  ADD COLUMN IF NOT EXISTS contact_person_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS company_website text,
  ADD COLUMN IF NOT EXISTS business_description text,
  ADD COLUMN IF NOT EXISTS recent_achievements text,
  ADD COLUMN IF NOT EXISTS key_products_services text,
  ADD COLUMN IF NOT EXISTS preferred_tone text,
  ADD COLUMN IF NOT EXISTS important_dates text,
  ADD COLUMN IF NOT EXISTS additional_notes text,
  ADD COLUMN IF NOT EXISTS write_own_release boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS custom_press_release text;

-- press_releases: add version_number
ALTER TABLE public.press_releases
  ADD COLUMN IF NOT EXISTS version_number integer DEFAULT 1;

-- Extend press_release_status enum
ALTER TYPE public.press_release_status ADD VALUE IF NOT EXISTS 'in_review';
ALTER TYPE public.press_release_status ADD VALUE IF NOT EXISTS 'revision_requested';

-- approval_history table for press release workflow
CREATE TABLE IF NOT EXISTS public.approval_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  press_release_id uuid REFERENCES public.press_releases(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  action text NOT NULL,
  status public.press_release_status NOT NULL,
  comment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.approval_history ENABLE ROW LEVEL SECURITY;
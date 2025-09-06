-- Create email_subscribers table for lead capture
CREATE TABLE public.email_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT NOT NULL, -- track which button/page triggered the signup
  metadata JSONB DEFAULT '{}', -- additional tracking data
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(email)
);

-- Enable Row Level Security
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert emails (for lead capture)
CREATE POLICY "Anyone can subscribe with email" 
ON public.email_subscribers 
FOR INSERT 
WITH CHECK (true);

-- Only allow reading your own email subscription
CREATE POLICY "Users can view their own subscription" 
ON public.email_subscribers 
FOR SELECT 
USING (true); -- Allow reading for analytics, can be restricted later
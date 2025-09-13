-- Create invoices table for persistent storage
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number text NOT NULL UNIQUE,
  client_name text NOT NULL,
  client_email text NOT NULL,
  client_company text,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  due_date date,
  notes text,
  payment_token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_by text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create invoice_items table for publication details
CREATE TABLE public.invoice_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  publication_id uuid REFERENCES public.publications(id),
  publication_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  custom_price numeric,
  category text,
  tier text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for invoices
CREATE POLICY "Admins can manage all invoices"
ON public.invoices
FOR ALL
USING (has_role((auth.uid())::text, 'admin'::app_role));

CREATE POLICY "Anyone can view invoices with valid payment token"
ON public.invoices
FOR SELECT
USING (true);

-- RLS policies for invoice_items
CREATE POLICY "Admins can manage all invoice items"
ON public.invoice_items
FOR ALL
USING (has_role((auth.uid())::text, 'admin'::app_role));

CREATE POLICY "Anyone can view invoice items for accessible invoices"
ON public.invoice_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.invoices
    WHERE invoices.id = invoice_items.invoice_id
  )
);

-- Create indexes for performance
CREATE INDEX idx_invoices_payment_token ON public.invoices(payment_token);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
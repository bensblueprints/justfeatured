export interface Publication {
  id: string;
  name: string;
  type: 'tier2' | 'premium' | 'tier1' | 'exclusive' | 'starter';
  category: string;
  price: number;
  tat_days: number;
  description?: string;
  features: string[];
  image_url?: string;
  logo_url?: string;
  website_url?: string;
  tier: string;
  popularity: number;
  is_active: boolean;
}

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  industry: string;
  phone?: string;
  website?: string;
}

export interface Order {
  id: string;
  customer_id: string;
  status: 'pending' | 'confirmed' | 'completed';
  total_amount: number;
  base_price: number;
  order_bumps: any[];
  upsells: any[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  publication_id?: string;
  item_type: 'publication' | 'service' | 'upsell';
  name: string;
  price: number;
  quantity: number;
}

export interface CartItem {
  publication: Publication;
  selected: boolean;
}
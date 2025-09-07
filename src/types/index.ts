export interface Publication {
  id: string;
  name: string;
  type: string;
  category: string;
  price: number;
  tat_days: string;
  description?: string;
  features: string[];
  logo_url?: string;
  website_url?: string;
  tier: string;
  popularity: number;
  is_active: boolean;
  // Database fields
  da_score?: number;
  dr_score?: number;
  location?: string;
  dofollow_link?: boolean;
  sponsored?: boolean;
  indexed?: boolean;
  erotic?: boolean;
  health?: boolean;
  cbd?: boolean;
  crypto?: boolean;
  gambling?: boolean;
  external_id?: string;
  created_at?: string;
  updated_at?: string;
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
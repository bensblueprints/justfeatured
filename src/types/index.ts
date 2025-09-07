export interface Publication {
  id: string;
  name: string;
  type: 'tier2' | 'premium' | 'tier1' | 'exclusive' | 'starter' | 'standard';
  category: string;
  price: number;
  tat_days: string | number;
  description?: string;
  features: string[];
  image_url?: string;
  logo_url?: string;
  website_url?: string;
  tier: string;
  popularity: number;
  is_active: boolean;
  // New detailed fields
  da_score?: number;
  dr_score?: number;
  timeline?: string;
  location?: string;
  guaranteed_placement?: boolean;
  dofollow_link?: boolean;
  social_media_post?: boolean;
  homepage_placement?: boolean;
  dedicated_article?: boolean;
  press_release_distribution?: boolean;
  author_byline?: boolean;
  image_inclusion?: boolean;
  video_inclusion?: boolean;
  placement_type?: 'discreet' | 'branded' | 'standard';
  // Additional fields from database
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
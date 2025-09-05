export interface PostCheckoutInfo {
  id: string;
  user_id: string;
  order_id?: string;
  company_name: string;
  industry_sector: IndustrySector;
  contact_person_name: string;
  email: string;
  phone_number: string;
  company_website?: string;
  business_description: string;
  recent_achievements?: string;
  key_products_services?: string;
  target_audience?: string;
  preferred_tone: PressReleaseTone;
  important_dates?: string;
  additional_notes?: string;
  write_own_release: boolean;
  custom_press_release?: string;
  created_at: string;
  updated_at: string;
}

export interface PressRelease {
  id: string;
  post_checkout_info_id: string;
  user_id: string;
  title: string;
  content: string;
  version_number: number;
  status: ReviewStatus;
  word_count?: number;
  estimated_delivery_date?: string;
  actual_delivery_date?: string;
  approved_by?: string;
  approved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewComment {
  id: string;
  press_release_id: string;
  user_id: string;
  content: string;
  position_start?: number;
  position_end?: number;
  is_resolved: boolean;
  parent_comment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ApprovalHistory {
  id: string;
  press_release_id: string;
  user_id: string;
  action: string;
  status: ReviewStatus;
  comment?: string;
  created_at: string;
}

export interface FileAttachment {
  id: string;
  post_checkout_info_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  is_logo: boolean;
  created_at: string;
}

export type IndustrySector = 
  | 'technology' 
  | 'healthcare' 
  | 'finance' 
  | 'retail' 
  | 'manufacturing'
  | 'education' 
  | 'real_estate' 
  | 'hospitality' 
  | 'automotive' 
  | 'media'
  | 'consulting' 
  | 'non_profit' 
  | 'government' 
  | 'energy' 
  | 'agriculture'
  | 'transportation' 
  | 'entertainment' 
  | 'food_beverage' 
  | 'other';

export type PressReleaseTone = 'professional' | 'casual' | 'technical' | 'inspirational';

export type ReviewStatus = 'draft' | 'in_review' | 'revision_requested' | 'approved' | 'published';

export type UserRole = 'customer' | 'editor' | 'admin' | 'super_admin';

export const INDUSTRY_SECTORS: { value: IndustrySector; label: string }[] = [
  { value: 'technology', label: 'Technology' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'finance', label: 'Finance' },
  { value: 'retail', label: 'Retail' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'media', label: 'Media' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'non_profit', label: 'Non-Profit' },
  { value: 'government', label: 'Government' },
  { value: 'energy', label: 'Energy' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'other', label: 'Other' },
];

export const PRESS_RELEASE_TONES: { value: PressReleaseTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'technical', label: 'Technical' },
  { value: 'inspirational', label: 'Inspirational' },
];
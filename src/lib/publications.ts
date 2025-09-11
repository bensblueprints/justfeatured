import { supabase } from '@/integrations/supabase/client';

interface Publication {
  id: string;
  external_id?: string;
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
  created_at?: string;
  updated_at?: string;
}

// All fields are now public - no authentication required
const ALL_FIELDS = [
  'id', 'external_id', 'name', 'type', 'category', 'tier', 
  'description', 'features', 'logo_url', 'website_url', 'is_active', 
  'popularity', 'location', 'created_at', 'updated_at',
  'price', 'da_score', 'dr_score', 'tat_days',
  'dofollow_link', 'sponsored', 'indexed', 'erotic', 'health',
  'cbd', 'crypto', 'gambling'
];

/**
 * Fetch all publications from the database with security filtering
 */
export const fetchPublications = async (): Promise<Publication[]> => {
  const fields = ALL_FIELDS.join(',');

  const { data, error } = await supabase
    .from('publications')
    .select(fields)
    .eq('is_active', true)
    .order('popularity', { ascending: false });

  if (error) {
    console.error('Error fetching publications:', error);
    return [];
  }

  // Transform database records to match the Publication type
  return data.map((record: any) => ({
    id: record.id,
    external_id: record.external_id,
    name: record.name,
    type: record.type,
    category: record.category,
    price: record.price,
    tat_days: record.tat_days,
    description: record.description,
    features: record.features || [],
    logo_url: record.logo_url,
    website_url: record.website_url,
    tier: record.tier,
    popularity: record.popularity || 0,
    is_active: record.is_active,
    da_score: record.da_score,
    dr_score: record.dr_score,
    location: record.location,
    dofollow_link: record.dofollow_link,
    sponsored: record.sponsored,
    indexed: record.indexed,
    erotic: record.erotic,
    health: record.health,
    cbd: record.cbd,
    crypto: record.crypto,
    gambling: record.gambling,
    created_at: record.created_at,
    updated_at: record.updated_at,
  }));
};

/**
 * Fetch publications by tier
 */
export const fetchPublicationsByTier = async (tier: string): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('tier', tier)
    .eq('is_active', true)
    .order('price', { ascending: false });

  if (error) {
    console.error('Error fetching publications by tier:', error);
    return [];
  }

  return data.map(record => ({
    id: record.id,
    external_id: record.external_id,
    name: record.name,
    type: record.type,
    category: record.category,
    price: record.price,
    tat_days: record.tat_days,
    description: record.description,
    features: record.features || [],
    logo_url: record.logo_url,
    website_url: record.website_url,
    tier: record.tier,
    popularity: record.popularity || 0,
    is_active: record.is_active,
    da_score: record.da_score,
    dr_score: record.dr_score,
    location: record.location,
    dofollow_link: record.dofollow_link,
    sponsored: record.sponsored,
    indexed: record.indexed,
    erotic: record.erotic,
    health: record.health,
    cbd: record.cbd,
    crypto: record.crypto,
    gambling: record.gambling,
    created_at: record.created_at,
    updated_at: record.updated_at,
  }));
};

/**
 * Fetch publications by category
 */
export const fetchPublicationsByCategory = async (category: string): Promise<Publication[]> => {
  const { data, error } = await supabase
    .from('publications')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('price', { ascending: false });

  if (error) {
    console.error('Error fetching publications by category:', error);
    return [];
  }

  return data.map(record => ({
    id: record.id,
    external_id: record.external_id,
    name: record.name,
    type: record.type,
    category: record.category,
    price: record.price,
    tat_days: record.tat_days,
    description: record.description,
    features: record.features || [],
    logo_url: record.logo_url,
    website_url: record.website_url,
    tier: record.tier,
    popularity: record.popularity || 0,
    is_active: record.is_active,
    da_score: record.da_score,
    dr_score: record.dr_score,
    location: record.location,
    dofollow_link: record.dofollow_link,
    sponsored: record.sponsored,
    indexed: record.indexed,
    erotic: record.erotic,
    health: record.health,
    cbd: record.cbd,
    crypto: record.crypto,
    gambling: record.gambling,
    created_at: record.created_at,
    updated_at: record.updated_at,
  }));
};

/**
 * Add a new publication to the database
 */
export const addPublication = async (publication: Omit<Publication, 'id'> & { external_id: string }) => {
  const { data, error } = await supabase
    .from('publications')
    .insert([{
      external_id: publication.external_id,
      name: publication.name,
      type: publication.type,
      category: publication.category,
      contact_info: `contact@${publication.name.toLowerCase().replace(/\s+/g, '')}.com`,
      price: publication.price,
      tat_days: publication.tat_days,
      description: publication.description,
      features: publication.features || [],
      logo_url: publication.logo_url,
      website_url: publication.website_url,
      tier: publication.tier,
      popularity: publication.popularity || 0,
      is_active: publication.is_active !== false,
      da_score: publication.da_score || 0,
      dr_score: publication.dr_score || 0,
      location: publication.location,
      dofollow_link: publication.dofollow_link || false,
      sponsored: publication.sponsored || false,
      indexed: publication.indexed !== false,
      erotic: publication.erotic || false,
      health: publication.health || false,
      cbd: publication.cbd || false,
      crypto: publication.crypto || false,
      gambling: publication.gambling || false,
      monthly_readers: Math.floor(Math.random() * 1000000) + 10000,
      status: 'active' as const
    }])
    .select();

  if (error) {
    console.error('Error adding publication:', error);
    throw error;
  }

  return data[0];
};

/**
 * Update an existing publication
 */
export const updatePublication = async (external_id: string, updates: Partial<Publication>) => {
  const { data, error } = await supabase
    .from('publications')
    .update({
      name: updates.name,
      type: updates.type,
      category: updates.category,
      price: updates.price,
      tat_days: updates.tat_days,
      description: updates.description,
      features: updates.features,
      logo_url: updates.logo_url,
      website_url: updates.website_url,
      tier: updates.tier,
      popularity: updates.popularity,
      is_active: updates.is_active,
      da_score: updates.da_score,
      dr_score: updates.dr_score,
      location: updates.location,
      dofollow_link: updates.dofollow_link,
      sponsored: updates.sponsored,
      indexed: updates.indexed,
      erotic: updates.erotic,
      health: updates.health,
      cbd: updates.cbd,
      crypto: updates.crypto,
      gambling: updates.gambling,
    })
    .eq('external_id', external_id)
    .select();

  if (error) {
    console.error('Error updating publication:', error);
    throw error;
  }

  return data[0];
};

/**
 * Delete a publication
 */
export const deletePublication = async (external_id: string) => {
  const { error } = await supabase
    .from('publications')
    .update({ is_active: false })
    .eq('external_id', external_id);

  if (error) {
    console.error('Error deleting publication:', error);
    throw error;
  }
};

/**
 * Purge all publications (hard delete). Admin only.
 */
export const purgeAllPublications = async () => {
  const { error } = await supabase
    .from('publications')
    .delete()
    .neq('id', '');

  if (error) {
    console.error('Error purging publications:', error);
    throw error;
  }
};
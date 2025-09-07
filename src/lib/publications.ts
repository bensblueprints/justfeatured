import { supabase } from '@/integrations/supabase/client';
import { Publication } from '@/types';

// Public fields that can be shown to unauthenticated users
const PUBLIC_FIELDS = [
  'external_id', 'name', 'website_url', 'type', 'tier', 
  'category', 'description', 'features', 'is_active', 'popularity',
  'timeline', 'location'
];

// Sensitive business fields that require authentication
const AUTHENTICATED_FIELDS = [
  ...PUBLIC_FIELDS,
  'price', 'da_score', 'dr_score', 'tat_days', 'placement_type',
  'guaranteed_placement', 'dofollow_link', 'social_media_post',
  'homepage_placement', 'image_inclusion', 'video_inclusion',
  'author_byline', 'sponsored', 'indexed', 'erotic', 'health',
  'cbd', 'crypto', 'gambling'
];

/**
 * Fetch all publications from the database with security filtering
 */
export const fetchPublications = async (): Promise<Publication[]> => {
  // Check if user is authenticated to determine fields to select
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  const fields = isAuthenticated ? AUTHENTICATED_FIELDS.join(',') : PUBLIC_FIELDS.join(',');

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
    id: record.external_id,
    name: record.name,
    type: record.type as Publication['type'],
    category: record.category,
    price: isAuthenticated ? record.price : undefined,
    tat_days: isAuthenticated ? record.tat_days : undefined,
    description: record.description,
    features: record.features || [],
    website_url: record.website_url,
    tier: record.tier,
    popularity: record.popularity || 0,
    is_active: record.is_active,
    // Additional fields for premium publications (only if authenticated)
    da_score: isAuthenticated ? record.da_score : undefined,
    dr_score: isAuthenticated ? record.dr_score : undefined,
    timeline: record.timeline,
    location: record.location,
    guaranteed_placement: isAuthenticated ? record.guaranteed_placement : undefined,
    dofollow_link: isAuthenticated ? record.dofollow_link : undefined,
    social_media_post: isAuthenticated ? record.social_media_post : undefined,
    homepage_placement: isAuthenticated ? record.homepage_placement : undefined,
    image_inclusion: isAuthenticated ? record.image_inclusion : undefined,
    video_inclusion: isAuthenticated ? record.video_inclusion : undefined,
    author_byline: isAuthenticated ? record.author_byline : undefined,
    placement_type: isAuthenticated ? (record.placement_type as Publication['placement_type']) || 'standard' : undefined
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
    id: record.external_id,
    name: record.name,
    type: record.type as Publication['type'],
    category: record.category,
    price: record.price,
    tat_days: record.tat_days,
    description: record.description,
    features: record.features || [],
    website_url: record.website_url,
    tier: record.tier,
    popularity: record.popularity || 0,
    is_active: record.is_active,
    da_score: record.da_score,
    dr_score: record.dr_score,
    timeline: record.timeline,
    location: record.location,
    guaranteed_placement: record.guaranteed_placement,
    dofollow_link: record.dofollow_link,
    social_media_post: record.social_media_post,
    homepage_placement: record.homepage_placement,
    image_inclusion: record.image_inclusion,
    video_inclusion: record.video_inclusion,
    author_byline: record.author_byline,
    placement_type: (record.placement_type as Publication['placement_type']) || 'standard'
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
    id: record.external_id,
    name: record.name,
    type: record.type as Publication['type'],
    category: record.category,
    price: record.price,
    tat_days: record.tat_days,
    description: record.description,
    features: record.features || [],
    website_url: record.website_url,
    tier: record.tier,
    popularity: record.popularity || 0,
    is_active: record.is_active,
    da_score: record.da_score,
    dr_score: record.dr_score,
    timeline: record.timeline,
    location: record.location,
    guaranteed_placement: record.guaranteed_placement,
    dofollow_link: record.dofollow_link,
    social_media_post: record.social_media_post,
    homepage_placement: record.homepage_placement,
    image_inclusion: record.image_inclusion,
    video_inclusion: record.video_inclusion,
    author_byline: record.author_byline,
    placement_type: (record.placement_type as Publication['placement_type']) || 'standard'
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
      price: publication.price,
      tat_days: publication.tat_days?.toString() || "7",
      description: publication.description,
      features: publication.features || [],
      website_url: publication.website_url,
      tier: publication.tier,
      popularity: publication.popularity || 0,
      is_active: publication.is_active !== false,
      da_score: publication.da_score || 0,
      dr_score: publication.dr_score || 0,
      timeline: publication.timeline,
      location: publication.location,
      guaranteed_placement: publication.guaranteed_placement || false,
      dofollow_link: publication.dofollow_link !== false,
      social_media_post: publication.social_media_post || false,
      homepage_placement: publication.homepage_placement || false,
      image_inclusion: publication.image_inclusion || false,
      video_inclusion: publication.video_inclusion || false,
      author_byline: publication.author_byline || false,
      placement_type: publication.placement_type || 'standard'
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
      tat_days: updates.tat_days?.toString(),
      description: updates.description,
      features: updates.features,
      website_url: updates.website_url,
      tier: updates.tier,
      popularity: updates.popularity,
      is_active: updates.is_active,
      da_score: updates.da_score,
      dr_score: updates.dr_score,
      timeline: updates.timeline,
      location: updates.location,
      guaranteed_placement: updates.guaranteed_placement,
      dofollow_link: updates.dofollow_link,
      social_media_post: updates.social_media_post,
      homepage_placement: updates.homepage_placement,
      image_inclusion: updates.image_inclusion,
      video_inclusion: updates.video_inclusion,
      author_byline: updates.author_byline,
      placement_type: updates.placement_type
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
    .delete()
    .eq('external_id', external_id);

  if (error) {
    console.error('Error deleting publication:', error);
    throw error;
  }
};
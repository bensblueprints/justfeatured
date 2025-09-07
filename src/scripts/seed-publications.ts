import { supabase } from '@/integrations/supabase/client';
import { PUBLICATIONS } from '@/data/publications';
import { EXTENDED_PUBLICATIONS } from '@/data/publications-extended';
import { PREMIUM_PUBLICATIONS } from '@/data/premium-publications';

/**
 * Seed the publications table with data from the static files
 */
export const seedPublications = async () => {
  console.log('Starting to seed publications...');
  
  // Combine all publication data
  const allPublications = [
    ...PUBLICATIONS,
    ...EXTENDED_PUBLICATIONS,
    ...PREMIUM_PUBLICATIONS
  ];

  console.log(`Found ${allPublications.length} publications to seed`);

  // Clear existing data
  const { error: deleteError } = await supabase
    .from('publications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

  if (deleteError) {
    console.error('Error clearing publications table:', deleteError);
    return;
  }

  console.log('Cleared existing publications');

  // Insert publications in batches
  const batchSize = 50;
  const batches = [];
  
  for (let i = 0; i < allPublications.length; i += batchSize) {
    batches.push(allPublications.slice(i, i + batchSize));
  }

  let totalInserted = 0;

  for (const batch of batches) {
    const records = batch.map(pub => ({
      external_id: pub.id,
      name: pub.name,
      type: pub.type,
      category: pub.category,
      price: pub.price,
      tat_days: pub.tat_days,
      description: pub.description || '',
      features: pub.features || [],
      website_url: pub.website_url,
      tier: pub.tier,
      popularity: pub.popularity || 0,
      is_active: pub.is_active !== false,
      da_score: pub.da_score || 0,
      dr_score: pub.dr_score || 0,
      timeline: pub.timeline,
      location: pub.location,
      guaranteed_placement: pub.guaranteed_placement || false,
      dofollow_link: pub.dofollow_link !== false,
      social_media_post: pub.social_media_post || false,
      homepage_placement: pub.homepage_placement || false,
      image_inclusion: pub.image_inclusion || false,
      video_inclusion: pub.video_inclusion || false,
      author_byline: pub.author_byline || false,
      placement_type: pub.placement_type || 'standard'
    }));

    const { data, error } = await supabase
      .from('publications')
      .insert(records)
      .select('id');

    if (error) {
      console.error('Error inserting batch:', error);
      continue;
    }

    totalInserted += data.length;
    console.log(`Inserted batch of ${data.length} publications (Total: ${totalInserted})`);
  }

  console.log(`✅ Successfully seeded ${totalInserted} publications`);
  return totalInserted;
};

// Helper function to run seeding from the browser console
(window as any).seedPublications = seedPublications;
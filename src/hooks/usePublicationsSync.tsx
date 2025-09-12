import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Publication } from '@/types';
import { fetchPublications } from '@/lib/publications';
import { BrandFetchService } from '@/utils/brandFetch';

export const usePublicationsSync = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await fetchPublications();
        setPublications(data);
        // Kick off background logo fetch for items missing logos (will also update DB in edge function)
        const missing = data.filter(p => !p.logo_url && p.website_url).map(p => p.website_url!)
        if (missing.length) {
          BrandFetchService.prefetchLogos(missing).catch(() => {/* ignore */});
        }
      } catch (error) {
        console.error('Error loading publications:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('publications-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'publications'
        },
        async (payload) => {
          console.log('Publications table changed:', payload);
          
          // Refresh the publications list when changes occur
          try {
            const data = await fetchPublications();
            setPublications(data);
          } catch (error) {
            console.error('Error refreshing publications:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refreshPublications = async () => {
    setLoading(true);
    try {
      const data = await fetchPublications();
      setPublications(data);
    } catch (error) {
      console.error('Error refreshing publications:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    publications,
    loading,
    refreshPublications
  };
};
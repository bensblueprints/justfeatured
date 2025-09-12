import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Publication } from '@/types';
import { fetchPublications } from '@/lib/publications';
import { useLogoEnhancement } from './useLogoEnhancement';

export const usePublicationsSync = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Use logo enhancement hook
  useLogoEnhancement(publications);

  // Initial load
  useEffect(() => {
    const loadPublications = async () => {
      try {
        const data = await fetchPublications();
        setPublications(data);
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
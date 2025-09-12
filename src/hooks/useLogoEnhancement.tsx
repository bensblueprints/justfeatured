import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Publication } from '@/types';

/**
 * Hook to enhance publication logos using BrandFetch API
 * Runs background jobs to improve logo quality for publications
 */
export const useLogoEnhancement = (publications: Publication[]) => {
  useEffect(() => {
    const enhanceLogos = async () => {
      // Find publications that need better logos
      const needsBetterLogos = publications.filter(pub => {
        // Prioritize publications without logos or with low-quality logos
        const hasNoLogo = !pub.logo_url;
        const hasLowQualityLogo = pub.logo_url && (
          pub.logo_url.includes('favicon') || 
          pub.logo_url.includes('google.com/s2/favicons') ||
          pub.logo_url.includes('clearbit.com')
        );
        const isPremium = pub.tier === 'Premium';
        
        return (hasNoLogo || hasLowQualityLogo) && isPremium;
      });

      // Process in batches of 10 to avoid overwhelming the API
      const batchSize = 10;
      for (let i = 0; i < Math.min(needsBetterLogos.length, 50); i += batchSize) {
        const batch = needsBetterLogos.slice(i, i + batchSize);
        
        const promises = batch.map(pub => 
          supabase.functions.invoke('fetch-brand-logo', {
            body: { 
              publicationId: pub.id, 
              websiteUrl: pub.website_url, 
              name: pub.name 
            }
          }).catch(error => {
            console.log(`Logo fetch failed for ${pub.name}:`, error);
            return null;
          })
        );

        // Wait for batch to complete before starting next batch
        await Promise.allSettled(promises);
        
        // Small delay between batches to be respectful to the API
        if (i + batchSize < needsBetterLogos.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    };

    // Only run if we have publications
    if (publications.length > 0) {
      // Delay the enhancement to not block initial render
      const timeoutId = setTimeout(enhanceLogos, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [publications]);
};
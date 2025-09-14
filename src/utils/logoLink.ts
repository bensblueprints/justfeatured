// Logo Link service for Brandfetch CDN-based logo access
// Provides unlimited logo access without API rate limits

interface LogoLinkOptions {
  theme?: 'light' | 'dark' | 'auto';
  type?: 'icon' | 'symbol' | 'logo';
  size?: number;
  width?: number;
  height?: number;
  format?: 'png' | 'svg' | 'jpg';
  fallback?: boolean;
}

export class LogoLinkService {
  private static readonly CDN_BASE = 'https://cdn.brandfetch.io';
  private static readonly CLIENT_ID = '1idElq-c5ECzI_p2pRG'; // Your Brandfetch client ID
  private static logoCache = new Map<string, string>();

  /**
   * Extract domain from a website URL
   */
  private static extractDomain(url: string | undefined): string {
    if (!url) {
      return '';
    }
    
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url.toLowerCase().replace(/[^a-z0-9.-]/g, '');
    }
  }

  /**
   * Build Logo Link URL with options
   */
  private static buildLogoLinkUrl(domain: string, options: LogoLinkOptions = {}): string {
    const params = new URLSearchParams();
    
    // Add client ID
    params.set('c', this.CLIENT_ID);
    
    // Add options as query parameters
    if (options.theme && options.theme !== 'auto') {
      params.set('theme', options.theme);
    }
    
    if (options.type) {
      params.set('type', options.type);
    }
    
    if (options.size) {
      params.set('size', options.size.toString());
    }
    
    if (options.width) {
      params.set('w', options.width.toString());
    }
    
    if (options.height) {
      params.set('h', options.height.toString());
    }
    
    if (options.format) {
      params.set('format', options.format);
    }
    
    if (options.fallback === false) {
      params.set('fallback', 'false');
    }

    return `${this.CDN_BASE}/${domain}?${params.toString()}`;
  }

  /**
   * Generate Logo Link URL for a website
   */
  static getLogoLinkUrl(websiteUrl: string | undefined, options: LogoLinkOptions = {}): string | null {
    if (!websiteUrl) {
      return null;
    }
    
    const domain = this.extractDomain(websiteUrl);
    if (!domain) {
      return null;
    }
    
    const cacheKey = `${domain}_${JSON.stringify(options)}`;
    
    // Check cache first
    if (this.logoCache.has(cacheKey)) {
      return this.logoCache.get(cacheKey) || null;
    }
    
    const logoUrl = this.buildLogoLinkUrl(domain, options);
    
    // Cache the result
    this.logoCache.set(cacheKey, logoUrl);
    
    return logoUrl;
  }

  /**
   * Generate multiple Logo Link URLs with different options
   */
  static getMultipleLogoLinks(websiteUrl: string | undefined): {
    icon: string | null;
    symbol: string | null;
    logo: string | null;
    iconDark: string | null;
    symbolDark: string | null;
    logoDark: string | null;
  } {
    return {
      icon: this.getLogoLinkUrl(websiteUrl, { type: 'icon', theme: 'light' }),
      symbol: this.getLogoLinkUrl(websiteUrl, { type: 'symbol', theme: 'light' }),
      logo: this.getLogoLinkUrl(websiteUrl, { type: 'logo', theme: 'light' }),
      iconDark: this.getLogoLinkUrl(websiteUrl, { type: 'icon', theme: 'dark' }),
      symbolDark: this.getLogoLinkUrl(websiteUrl, { type: 'symbol', theme: 'dark' }),
      logoDark: this.getLogoLinkUrl(websiteUrl, { type: 'logo', theme: 'dark' }),
    };
  }

  /**
   * Update publication with Logo Link URL
   */
  static async updatePublicationLogoLink(publicationId: string, websiteUrl: string): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const logoLinkUrl = this.getLogoLinkUrl(websiteUrl, { 
        type: 'icon', 
        theme: 'light',
        fallback: true 
      });
      
      if (!logoLinkUrl) {
        return false;
      }
      
      const { error } = await supabase
        .from('publications')
        .update({ logo_link_url: logoLinkUrl })
        .eq('id', publicationId);
      
      if (error) {
        console.error('Error updating publication Logo Link URL:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to update publication Logo Link URL:', error);
      return false;
    }
  }

  /**
   * Batch update Logo Link URLs for all publications with website URLs
   */
  static async batchUpdateLogoLinks(): Promise<{ updated: number; failed: number }> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Get all publications with website URLs but no Logo Link URL
      const { data: publications, error: fetchError } = await supabase
        .from('publications')
        .select('id, website_url')
        .not('website_url', 'is', null)
        .is('logo_link_url', null);
      
      if (fetchError) {
        console.error('Error fetching publications:', fetchError);
        return { updated: 0, failed: 1 };
      }
      
      let updated = 0;
      let failed = 0;
      
      // Process in batches of 10
      const batchSize = 10;
      for (let i = 0; i < publications.length; i += batchSize) {
        const batch = publications.slice(i, i + batchSize);
        
        const updates = batch.map(pub => {
          const logoLinkUrl = this.getLogoLinkUrl(pub.website_url, {
            type: 'icon',
            theme: 'light',
            fallback: true
          });
          
          return {
            id: pub.id,
            logo_link_url: logoLinkUrl
          };
        }).filter(update => update.logo_link_url);
        
        if (updates.length > 0) {
          // Update each publication individually to avoid type conflicts
          for (const update of updates) {
            const { error: updateError } = await supabase
              .from('publications')
              .update({ logo_link_url: update.logo_link_url })
              .eq('id', update.id);
            
            if (updateError) {
              console.error('Update error for publication:', update.id, updateError);
              failed++;
            } else {
              updated++;
            }
          }
          
        }
        
        // Small delay between batches
        if (i + batchSize < publications.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      return { updated, failed };
    } catch (error) {
      console.error('Failed to batch update Logo Link URLs:', error);
      return { updated: 0, failed: 1 };
    }
  }

  /**
   * Get the best logo URL with fallback chain
   * Priority: Logo Link URL -> API-fetched logo -> Fallback
   */
  static getBestLogoUrl(
    logoLinkUrl: string | undefined,
    logoUrl: string | undefined,
    websiteUrl: string | undefined,
    options: LogoLinkOptions = {}
  ): string {
    // Prioritize Logo Link - generate new URL if needed
    const logoLink = logoLinkUrl || this.getLogoLinkUrl(websiteUrl, options);
    if (logoLink) {
      return logoLink;
    }
    
    // Fall back to API-fetched logo only if Logo Link fails
    if (logoUrl) {
      return logoUrl;
    }
    
    // Final fallback using favicon
    const domain = this.extractDomain(websiteUrl);
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    }
    
    // Ultimate fallback
    return `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f3f4f6"/><text x="32" y="32" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="24" fill="#6b7280">?</text></svg>')}`;
  }
}
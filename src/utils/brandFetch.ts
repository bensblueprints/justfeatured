// Utility for fetching brand logos from Brandfetch API
// Free tier allows 100 requests per month

interface BrandLogo {
  type: string;
  theme: string;
  formats: Array<{
    src: string;
    background: string;
    format: string;
    height: number;
    width: number;
    size: number;
  }>;
}

interface BrandResponse {
  name: string;
  domain: string;
  logos: BrandLogo[];
}

export class BrandFetchService {
  private static readonly API_BASE = 'https://api.brandfetch.io/v2';
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
      return url.toLowerCase().replace(/[^a-z0-9]/g, '');
    }
  }

  /**
   * Get the best logo from the brand response
   */
  private static getBestLogo(logos: BrandLogo[]): string | null {
    if (!logos || logos.length === 0) return null;

    // Prefer icon type, then symbol, then logo
    const typePreference = ['icon', 'symbol', 'logo'];
    
    for (const type of typePreference) {
      const logo = logos.find(l => l.type === type);
      if (logo && logo.formats && logo.formats.length > 0) {
        // Prefer transparent background, then white, then any
        const format = logo.formats.find(f => f.background === 'transparent') ||
                     logo.formats.find(f => f.background === 'white') ||
                     logo.formats[0];
        
        if (format && format.src) {
          return format.src;
        }
      }
    }

    return null;
  }

  /**
   * Fetch brand logo for a given website URL using secure edge function
   */
  static async fetchLogo(websiteUrl: string | undefined): Promise<string | null> {
    if (!websiteUrl) {
      return null;
    }
    
    const domain = this.extractDomain(websiteUrl);
    if (!domain) {
      return null;
    }
    
    // Check cache first
    if (this.logoCache.has(domain)) {
      return this.logoCache.get(domain) || null;
    }

    try {
      // Use secure edge function instead of direct API call
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('fetch-brand-logo', {
        body: { websiteUrl }
      });

      if (error) {
        console.warn(`Failed to fetch logo for ${domain} via edge function:`, error);
        this.logoCache.set(domain, '');
        return null;
      }

      const logoUrl = data?.logoUrl;
      
      // Cache the result (even if null to avoid repeated failures)
      this.logoCache.set(domain, logoUrl || '');
      
      // Try to save to database for future use (fire and forget)
      if (logoUrl) {
        this.saveLogo(websiteUrl, logoUrl).catch(error => 
          console.log('Failed to save logo to database:', error)
        );
      }
      
      return logoUrl || null;
    } catch (error) {
      console.error(`Error fetching logo for ${domain}:`, error);
      this.logoCache.set(domain, '');
      return null;
    }
  }

  /**
   * Generate fallback logo URL using external services
   */
  static getFallbackLogo(websiteUrl: string | undefined): string {
    if (!websiteUrl) {
      return `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f3f4f6"/><text x="32" y="32" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="24" fill="#6b7280">?</text></svg>')}`;
    }
    
    const domain = this.extractDomain(websiteUrl);
    if (!domain) {
      return `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f3f4f6"/><text x="32" y="32" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="24" fill="#6b7280">?</text></svg>')}`;
    }
    
    // Use favicon service as fallback
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }

  /**
   * Get logo with fallback support - always returns a logo URL
   */
  static async getLogoWithFallback(websiteUrl: string | undefined): Promise<string> {
    try {
      const logo = await this.fetchLogo(websiteUrl);
      return logo || this.getFallbackLogo(websiteUrl);
    } catch (error) {
      console.warn(`Error in getLogoWithFallback for ${websiteUrl}:`, error);
      return this.getFallbackLogo(websiteUrl);
    }
  }

  /**
   * Get multiple fallback options for better reliability
   */
  static getMultipleFallbackLogos(websiteUrl: string | undefined): string[] {
    if (!websiteUrl) {
      return [`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f3f4f6"/><text x="32" y="32" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="24" fill="#6b7280">?</text></svg>')}`];
    }
    
    const domain = this.extractDomain(websiteUrl);
    if (!domain) {
      return [`data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#f3f4f6"/><text x="32" y="32" text-anchor="middle" dy="0.3em" font-family="Arial" font-size="24" fill="#6b7280">?</text></svg>')}`];
    }
    
    return [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      `https://favicon.yandex.net/favicon/${domain}`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://logo.clearbit.com/${domain}?size=64&fallback=true`,
    ];
  }

  /**
   * Save fetched logo to database for caching
   */
  private static async saveLogo(websiteUrl: string, logoUrl: string): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Find publication by website URL and update logo
      const { error } = await supabase
        .from('publications')
        .update({ logo_url: logoUrl })
        .eq('website_url', websiteUrl);

      if (error) {
        console.error('Error saving logo to database:', error);
      }
    } catch (error) {
      console.error('Failed to save logo to database:', error);
    }
  }

  /**
   * Prefetch logos for multiple websites
   */
  static async prefetchLogos(websites: string[]): Promise<void> {
    const promises = websites.map(url => this.fetchLogo(url));
    await Promise.allSettled(promises);
  }
}
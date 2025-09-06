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
  private static extractDomain(url: string): string {
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
   * Fetch brand logo for a given website URL
   */
  static async fetchLogo(websiteUrl: string): Promise<string | null> {
    const domain = this.extractDomain(websiteUrl);
    
    // Check cache first
    if (this.logoCache.has(domain)) {
      return this.logoCache.get(domain) || null;
    }

    try {
      const response = await fetch(`${this.API_BASE}/brands/${domain}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        console.warn(`Failed to fetch logo for ${domain}:`, response.status);
        return null;
      }

      const data: BrandResponse = await response.json();
      const logoUrl = this.getBestLogo(data.logos);
      
      // Cache the result (even if null to avoid repeated failures)
      this.logoCache.set(domain, logoUrl || '');
      
      return logoUrl;
    } catch (error) {
      console.error(`Error fetching logo for ${domain}:`, error);
      this.logoCache.set(domain, '');
      return null;
    }
  }

  /**
   * Generate fallback logo URL using external services
   */
  static getFallbackLogo(websiteUrl: string): string {
    const domain = this.extractDomain(websiteUrl);
    
    // Use favicon service as fallback
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }

  /**
   * Get logo with fallback support - always returns a logo URL
   */
  static async getLogoWithFallback(websiteUrl: string): Promise<string> {
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
  static getMultipleFallbackLogos(websiteUrl: string): string[] {
    const domain = this.extractDomain(websiteUrl);
    return [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      `https://favicon.yandex.net/favicon/${domain}`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://logo.clearbit.com/${domain}?size=64&fallback=true`,
    ];
  }

  /**
   * Prefetch logos for multiple websites
   */
  static async prefetchLogos(websites: string[]): Promise<void> {
    const promises = websites.map(url => this.fetchLogo(url));
    await Promise.allSettled(promises);
  }
}
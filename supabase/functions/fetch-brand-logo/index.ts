import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase admin client (service role) for DB updates
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

interface BrandLogo {
  type: string;
  theme: string;
  formats: Array<{
    src: string;
    background: string;
    format: string;
    size: number;
  }>;
}

interface BrandResponse {
  name: string;
  domain: string;
  claimed: boolean;
  description: string;
  logos: BrandLogo[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { websiteUrl } = await req.json();
    
    if (!websiteUrl) {
      return new Response(
        JSON.stringify({ error: 'Website URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const domain = extractDomain(websiteUrl);
    const brandfetchApiKey = Deno.env.get('BRANDFETCH_API_KEY');
    
    if (!brandfetchApiKey) {
      console.error('BRANDFETCH_API_KEY not configured');
      return new Response(
        JSON.stringify({ logoUrl: getFallbackLogo(websiteUrl) }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching brand logo for domain: ${domain}`);

    const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
      headers: {
        'Authorization': `Bearer ${brandfetchApiKey}`,
      },
    });

    if (!response.ok) {
      console.log(`Brandfetch API failed with status: ${response.status}`);
      return new Response(
        JSON.stringify({ logoUrl: getFallbackLogo(websiteUrl) }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data: BrandResponse = await response.json();
    const bestLogo = getBestLogo(data.logos);

    // Attempt to persist logo to publications table (service role)
    if (bestLogo) {
      try {
        await updatePublicationLogo(websiteUrl, domain, bestLogo);
      } catch (e) {
        console.error('Failed to update publication logo in DB:', e);
      }
    }

    return new Response(
      JSON.stringify({ 
        logoUrl: bestLogo || getFallbackLogo(websiteUrl) 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-brand-logo function:', error);
    
    // Return fallback logo on any error
    const { websiteUrl } = await req.json().catch(() => ({}));
    return new Response(
      JSON.stringify({ 
        logoUrl: getFallbackLogo(websiteUrl) 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function extractDomain(url: string | undefined): string {
  if (!url) return '';
  
  try {
    // Remove protocol if present
    let domain = url.replace(/^https?:\/\//, '');
    // Remove www. if present
    domain = domain.replace(/^www\./, '');
    // Remove path, query, and fragment
    domain = domain.split('/')[0].split('?')[0].split('#')[0];
    return domain.toLowerCase();
  } catch {
    return '';
  }
}

function getBestLogo(logos: BrandLogo[]): string | null {
  if (!logos || logos.length === 0) {
    return null;
  }

  // Preference order: symbol > icon > logo
  const typePreference = ['symbol', 'icon', 'logo'];
  
  for (const preferredType of typePreference) {
    const logosOfType = logos.filter(logo => logo.type === preferredType);
    
    if (logosOfType.length > 0) {
      // Prefer 'light' theme, then 'dark', then any
      const lightLogo = logosOfType.find(logo => logo.theme === 'light');
      const darkLogo = logosOfType.find(logo => logo.theme === 'dark');
      const anyLogo = logosOfType[0];
      
      const selectedLogo = lightLogo || darkLogo || anyLogo;
      
      if (selectedLogo.formats && selectedLogo.formats.length > 0) {
        // Prefer PNG format, then SVG, then any
        const pngFormat = selectedLogo.formats.find(format => format.format === 'png');
        const svgFormat = selectedLogo.formats.find(format => format.format === 'svg');
        const anyFormat = selectedLogo.formats[0];
        
        const selectedFormat = pngFormat || svgFormat || anyFormat;
        return selectedFormat.src;
      }
    }
  }

  return null;
}

function getFallbackLogo(websiteUrl: string | undefined): string {
  if (!websiteUrl) {
    return `https://ui-avatars.com/api/?name=Website&background=e2e8f0&color=475569&size=64`;
  }
  
  const domain = extractDomain(websiteUrl);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

async function updatePublicationLogo(websiteUrl: string, domain: string, logoUrl: string) {
  try {
    // First try exact match on website_url
    const { error: exactError } = await supabase
      .from('publications')
      .update({ logo_url: logoUrl })
      .eq('website_url', websiteUrl);

    if (exactError) {
      console.error('Exact match update error:', exactError);
    }

    // Also try domain match if exact didn't affect rows or URLs stored differ
    const { error: domainError } = await supabase
      .from('publications')
      .update({ logo_url: logoUrl })
      .ilike('website_url', `%${domain}%`);

    if (domainError) {
      console.error('Domain match update error:', domainError);
    }
  } catch (err) {
    console.error('Unexpected error updating publication logo:', err);
  }
}

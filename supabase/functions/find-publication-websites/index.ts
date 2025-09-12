import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { mode = 'single', continueProcessing = false } = await req.json();
    
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      return new Response(
        JSON.stringify({ error: 'Perplexity API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (mode === 'count') {
      // Just return the count of publications that need websites
      const { count, error } = await supabase
        .from('publications')
        .select('*', { count: 'exact', head: true })
        .or('website_url.is.null,website_url.eq.');
      
      return new Response(
        JSON.stringify({ remaining: count || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get ONE publication that needs a website
    const { data: publications, error } = await supabase
      .from('publications')
      .select('id, name, website_url')
      .or('website_url.is.null,website_url.eq.')
      .limit(1);

    if (error) {
      console.error('Error fetching publications:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch publications' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!publications || publications.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'All publications have website URLs', 
          completed: true,
          processed: 0 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const publication = publications[0];
    console.log(`Processing publication: ${publication.name}`);

    let result = null;

    try {
      console.log(`Searching for website of: ${publication.name}`);
      
      const searchPrompt = `Search Google for the official website of the publication "${publication.name}". 
      This could be a newspaper, magazine, blog, or news website. 
      Return only the main website URL (like https://example.com) without any additional text. 
      If you cannot find a reliable website, respond with "NOT_FOUND".`;

      // Add delay before API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a search assistant that finds official websites for publications and media outlets. Always search for current, active websites. Respond only with the URL or "NOT_FOUND".'
            },
            {
              role: 'user',
              content: searchPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 100,
          return_related_questions: false,
          search_recency_filter: 'month'
        }),
      });

      if (!response.ok) {
        console.error(`Perplexity API error for ${publication.name}:`, response.status);
        result = { id: publication.id, name: publication.name, status: 'api_error', error: `API returned ${response.status}` };
      } else {
        const data = await response.json();
        const websiteText = data.choices[0]?.message?.content?.trim();
        
        if (!websiteText || websiteText === 'NOT_FOUND') {
          console.log(`No website found for: ${publication.name}`);
          result = { id: publication.id, name: publication.name, status: 'not_found' };
        } else {
          // Extract URL from response and validate
          const urlMatch = websiteText.match(/(https?:\/\/[^\s]+)/);
          let websiteUrl = urlMatch ? urlMatch[1] : websiteText;
          
          // Clean up the URL
          websiteUrl = websiteUrl.replace(/[.,;!?]+$/, ''); // Remove trailing punctuation
          
          // Validate URL format
          try {
            new URL(websiteUrl);
          } catch {
            console.log(`Invalid URL format for ${publication.name}: ${websiteUrl}`);
            result = { id: publication.id, name: publication.name, status: 'invalid_url', url: websiteUrl };
          }

          if (!result) {
            // Update the publication with the found website
            console.log(`Updating ${publication.name} with website: ${websiteUrl}`);
            const { error: updateError } = await supabase
              .from('publications')
              .update({ website_url: websiteUrl })
              .eq('id', publication.id);

            if (updateError) {
              console.error(`Error updating ${publication.name}:`, updateError);
              result = { id: publication.id, name: publication.name, status: 'update_error', url: websiteUrl };
            } else {
              console.log(`Successfully updated ${publication.name} with ${websiteUrl}`);
              
              // Add delay before logo fetch
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              // Now fetch the logo using the brand fetch API
              try {
                console.log(`Fetching logo for ${publication.name} using ${websiteUrl}`);
                const logoResponse = await fetch(`${supabaseUrl}/functions/v1/fetch-brand-logo`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${supabaseServiceRoleKey}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    publicationId: publication.id,
                    websiteUrl: websiteUrl,
                    name: publication.name
                  }),
                });

                let logoFetched = false;
                if (logoResponse.ok) {
                  const logoData = await logoResponse.json();
                  logoFetched = !!logoData.logoUrl;
                  console.log(`Logo fetch completed for ${publication.name}:`, logoFetched ? 'success' : 'fallback');
                } else {
                  console.log(`Logo fetch failed for ${publication.name}, but website was saved`);
                }

                result = { 
                  id: publication.id, 
                  name: publication.name, 
                  status: 'success', 
                  url: websiteUrl,
                  logoFetched: logoFetched 
                };
              } catch (logoError) {
                console.error(`Error fetching logo for ${publication.name}:`, logoError);
                result = { id: publication.id, name: publication.name, status: 'success', url: websiteUrl, logoFetched: false };
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error processing ${publication.name}:`, error);
      result = { id: publication.id, name: publication.name, status: 'error', error: error.message };
    }

    // Check how many publications still need processing
    const { count: remainingCount } = await supabase
      .from('publications')
      .select('*', { count: 'exact', head: true })
      .or('website_url.is.null,website_url.eq.');

    const hasMore = (remainingCount || 0) > 0;

    // Add final delay before response
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(
      JSON.stringify({ 
        processed: 1,
        result: result,
        hasMore: hasMore,
        remaining: remainingCount || 0,
        completed: !hasMore
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in find-publication-websites function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
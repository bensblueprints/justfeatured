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
    const { publicationIds, batchSize = 5 } = await req.json();
    
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (!perplexityApiKey) {
      return new Response(
        JSON.stringify({ error: 'Perplexity API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get publications that need websites
    let query = supabase
      .from('publications')
      .select('id, name, website_url')
      .or('website_url.is.null,website_url.eq.');

    if (publicationIds && publicationIds.length > 0) {
      query = query.in('id', publicationIds);
    }

    const { data: publications, error } = await query.limit(batchSize);

    if (error) {
      console.error('Error fetching publications:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch publications' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!publications || publications.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No publications need website URLs', processed: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${publications.length} publications for website discovery`);

    const results = [];
    for (const publication of publications) {
      try {
        console.log(`Searching for website of: ${publication.name}`);
        
        const searchPrompt = `Find the official website URL for the publication "${publication.name}". 
        Return only the main website URL (like https://example.com) without any additional text or explanation. 
        If you cannot find a reliable website, respond with "NOT_FOUND".`;

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
                content: 'You are a helpful assistant that finds official websites for publications. Respond only with the URL or "NOT_FOUND".'
              },
              {
                role: 'user',
                content: searchPrompt
              }
            ],
            temperature: 0.1,
            max_tokens: 100,
            return_related_questions: false
          }),
        });

        if (!response.ok) {
          console.error(`Perplexity API error for ${publication.name}:`, response.status);
          results.push({ id: publication.id, name: publication.name, status: 'error', error: 'API error' });
          continue;
        }

        const data = await response.json();
        const websiteText = data.choices[0]?.message?.content?.trim();
        
        if (!websiteText || websiteText === 'NOT_FOUND') {
          console.log(`No website found for: ${publication.name}`);
          results.push({ id: publication.id, name: publication.name, status: 'not_found' });
          continue;
        }

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
          results.push({ id: publication.id, name: publication.name, status: 'invalid_url', url: websiteUrl });
          continue;
        }

        // Update the publication with the found website
        const { error: updateError } = await supabase
          .from('publications')
          .update({ website_url: websiteUrl })
          .eq('id', publication.id);

        if (updateError) {
          console.error(`Error updating ${publication.name}:`, updateError);
          results.push({ id: publication.id, name: publication.name, status: 'update_error', url: websiteUrl });
        } else {
          console.log(`Successfully updated ${publication.name} with ${websiteUrl}`);
          
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

            if (logoResponse.ok) {
              const logoData = await logoResponse.json();
              console.log(`Logo fetch completed for ${publication.name}:`, logoData.logoUrl ? 'success' : 'fallback');
              results.push({ 
                id: publication.id, 
                name: publication.name, 
                status: 'success', 
                url: websiteUrl,
                logoFetched: !!logoData.logoUrl 
              });
            } else {
              console.log(`Logo fetch failed for ${publication.name}, but website was saved`);
              results.push({ id: publication.id, name: publication.name, status: 'success', url: websiteUrl, logoFetched: false });
            }
          } catch (logoError) {
            console.error(`Error fetching logo for ${publication.name}:`, logoError);
            results.push({ id: publication.id, name: publication.name, status: 'success', url: websiteUrl, logoFetched: false });
          }
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`Error processing ${publication.name}:`, error);
        results.push({ id: publication.id, name: publication.name, status: 'error', error: error.message });
      }
    }

    const successCount = results.filter(r => r.status === 'success').length;
    
    return new Response(
      JSON.stringify({ 
        processed: publications.length,
        successful: successCount,
        results: results
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
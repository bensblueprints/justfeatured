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
    const { batchSize = 50 } = await req.json();
    
    // Get publications that need website URLs and have contact info
    const { data: publications, error } = await supabase
      .from('publications')
      .select('id, name, website_url, contact_info')
      .or('website_url.is.null,website_url.eq.')
      .not('contact_info', 'is', null)
      .not('contact_info', 'eq', '')
      .limit(batchSize);

    if (error) {
      console.error('Error fetching publications:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch publications' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!publications || publications.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No publications need website URLs', processed: 0, results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${publications.length} publications for domain extraction`);

    const results = [];
    let successCount = 0;

    for (const publication of publications) {
      try {
        console.log(`Processing: ${publication.name}`);
        
        // Extract email addresses from contact_info
        const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        const emails = publication.contact_info.match(emailRegex);
        
        if (!emails || emails.length === 0) {
          console.log(`No email found in contact info for: ${publication.name}`);
          results.push({ 
            id: publication.id, 
            name: publication.name, 
            status: 'no_email_found',
            contact_info: publication.contact_info 
          });
          continue;
        }

        // Extract domain from the first email
        const email = emails[0];
        const domain = email.split('@')[1];
        
        if (!domain) {
          console.log(`Invalid email format for: ${publication.name} - ${email}`);
          results.push({ 
            id: publication.id, 
            name: publication.name, 
            status: 'invalid_email',
            email: email 
          });
          continue;
        }

        // Create website URL
        const websiteUrl = `https://${domain}`;
        
        console.log(`Extracted domain for ${publication.name}: ${domain} -> ${websiteUrl}`);

        // Update the publication with the extracted website URL
        const { error: updateError } = await supabase
          .from('publications')
          .update({ website_url: websiteUrl })
          .eq('id', publication.id);

        if (updateError) {
          console.error(`Error updating ${publication.name}:`, updateError);
          results.push({ 
            id: publication.id, 
            name: publication.name, 
            status: 'update_error', 
            url: websiteUrl,
            error: updateError.message 
          });
        } else {
          console.log(`Successfully updated ${publication.name} with ${websiteUrl}`);
          successCount++;
          
          // Now try to fetch the logo
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

            results.push({ 
              id: publication.id, 
              name: publication.name, 
              status: 'success', 
              url: websiteUrl,
              email: email,
              logoFetched: logoFetched
            });
          } catch (logoError) {
            console.error(`Error fetching logo for ${publication.name}:`, logoError);
            results.push({ 
              id: publication.id, 
              name: publication.name, 
              status: 'success', 
              url: websiteUrl,
              email: email,
              logoFetched: false
            });
          }
        }
        
      } catch (error) {
        console.error(`Error processing ${publication.name}:`, error);
        results.push({ 
          id: publication.id, 
          name: publication.name, 
          status: 'error', 
          error: error.message 
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        processed: publications.length,
        successful: successCount,
        results: results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in extract-domains-from-contact function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
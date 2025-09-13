import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MailChimpContact {
  email_address: string;
  status: string;
  merge_fields?: {
    FNAME?: string;
    LNAME?: string;
    SOURCE?: string;
  };
  tags?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const mailchimpApiKey = Deno.env.get('MAILCHIMP_API_KEY');

    if (!mailchimpApiKey) {
      console.error('MailChimp API key not found');
      return new Response(
        JSON.stringify({ error: 'MailChimp API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract datacenter from API key (e.g., us1, us2, etc.)
    const datacenter = mailchimpApiKey.split('-')[1];
    if (!datacenter) {
      console.error('Invalid MailChimp API key format');
      return new Response(
        JSON.stringify({ error: 'Invalid MailChimp API key format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, source, listId } = await req.json();

    if (!email || !listId) {
      return new Response(
        JSON.stringify({ error: 'Email and listId are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Syncing email ${email} to MailChimp list ${listId} from source: ${source}`);

    // Prepare MailChimp contact data
    const contactData: MailChimpContact = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        SOURCE: source || 'website'
      }
    };

    // Add tags based on source
    if (source) {
      contactData.tags = [source];
    }

    // Add contact to MailChimp
    const mailchimpResponse = await fetch(
      `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mailchimpApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      }
    );

    const mailchimpResult = await mailchimpResponse.json();

    if (!mailchimpResponse.ok) {
      console.error('MailChimp API error:', mailchimpResult);
      
      // If contact already exists, update instead
      if (mailchimpResult.title === 'Member Exists') {
        console.log('Contact exists, attempting to update...');
        
        const updateResponse = await fetch(
          `https://${datacenter}.api.mailchimp.com/3.0/lists/${listId}/members/${email}`,
          {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${mailchimpApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              merge_fields: contactData.merge_fields,
              tags: contactData.tags
            }),
          }
        );

        if (!updateResponse.ok) {
          const updateError = await updateResponse.json();
          console.error('MailChimp update error:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update contact in MailChimp', details: updateError }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Contact updated successfully in MailChimp');
      } else {
        return new Response(
          JSON.stringify({ error: 'Failed to sync with MailChimp', details: mailchimpResult }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.log('Contact added successfully to MailChimp');
    }

    // Store the sync record in Supabase
    const { error: supabaseError } = await supabase
      .from('email_subscribers')
      .insert({
        email,
        source: source || 'website',
        metadata: {
          mailchimp_list_id: listId,
          mailchimp_sync: true,
          sync_timestamp: new Date().toISOString()
        }
      });

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      // Don't fail the request if MailChimp sync was successful
      console.log('MailChimp sync successful, but Supabase storage failed');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email successfully synced to MailChimp',
        mailchimp_id: mailchimpResult.id || 'updated'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in sync-mailchimp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);
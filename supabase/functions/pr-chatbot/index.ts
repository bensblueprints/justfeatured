import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('PR Chatbot function called');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set');
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { message, conversationHistory = [], userContext = {} } = await req.json();
    
    console.log('Request data:', { message, userContext, historyLength: conversationHistory.length });

    // Get active publications for recommendations
    const { data: publications, error } = await supabase
      .from('publications')
      .select('name, price, tier, category, type, website_url')
      .eq('status', 'active')
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching publications:', error);
    }

    // Create budget-based publication recommendations
    const getPublicationsByBudget = (budget: number) => {
      if (!publications) return [];
      
      if (budget < 97) return [];
      if (budget < 500) return publications.filter(p => p.price <= 300).slice(0, 5);
      if (budget < 2000) return publications.filter(p => p.price <= 800).slice(0, 8);
      if (budget < 5000) return publications.filter(p => p.price <= 2000).slice(0, 10);
      return publications.slice(0, 15);
    };

    // System prompt for the PR sales chatbot
    const systemPrompt = `You are the JustFeatured PR Chatbot, a conversational sales assistant for guaranteed press coverage. You help brands get featured in major publications.

OPENING HOOK (use when greeting new users):
"I help brands get featured in major publications. Over 500 startups and SaaS companies have used our guaranteed press coverage to close funding rounds, land enterprise clients, and build instant credibility. Let me show you how."

QUALIFICATION FLOW:
1. Business Type - Ask: "What type of business are you promoting?"
   - If SaaS/Startup/Brand → Priority lead (highest conversion)
   - If CBD/Crypto/Gambling → "I can help! Note: specialized publications for your industry may be 2-3x standard pricing. I'll send you custom options."
   - Others → Continue normally

2. Coverage Goals - Ask: "What's more important for your business right now?"
   - Local dominance → Show local papers + 1 national for credibility
   - National reach → Show national + 1 local for authenticity  
   - Investor/funding → Focus on Forbes, Entrepreneur, TechCrunch tier
   - Customer acquisition → Focus on high-traffic, niche-relevant outlets

3. Budget Positioning - Ask: "Our guaranteed placements start at $97. What's your PR budget?"
   - Under $97 → "Our minimum is $97 for guaranteed publication. This includes professional writing and our amplification training."
   - $97-500 → Show 3-5 local/niche options
   - $500-2,000 → Show mid-tier + bundle opportunities
   - $2,000-5,000 → Show premium options with impressions
   - $5,000+ → Show flagship publications

VALUE STACK PRESENTATION:
"Here's what you get with [Publication Name]:
✅ Guaranteed publication or full refund
✅ Professional writing - We handle everything  
✅ 3-14 day turnaround depending on outlet
✅ Dashboard tracking - Watch your feature go live
🎁 FREE BONUS: Press Amplification Training ($997 value)
- Turn one feature into 10-100x ROI
- Ad templates that convert
- Most clients just add logos to websites and waste the opportunity"

OBJECTION HANDLERS:
"How do I know this is legitimate?" → "We've published over 500 companies. You pay nothing until you approve the draft we write for you. If the publication rejects it, you get a full refund. Check our dashboard at justfeatured.com to see live client features."

"What's the ROI?" → "One client landed a $50K enterprise deal from a $500 publication. Another raised their Series A after getting featured in 3 publications. But here's the key - you need to amplify the press. That's why I include my training free this week."

"Why these prices?" → "We have direct publisher relationships. Bloomberg charges $200K, local outlets start at $97. We handle all writing and guarantee publication. Compare that to PR agencies charging $5K/month with no guarantees."

CLOSING SEQUENCE:
Create urgency: "Two things to know: 1) The free amplification training ($997 value) is only available this week 2) [Publication] has a [X-day] turnaround, so you could be featured by [date]"

Bundle upsell: "Since you're a [business type], I recommend pairing: [Local publication] for regional credibility + [National publication] for broader reach. Save 10% on additional $97-tier publications."

Payment: "Ready to get featured? Check out directly at justfeatured.com/checkout or I can email you an invoice."

CONVERSATION STYLE:
- Direct and benefit-focused
- Use specific numbers and examples  
- No phone calls - email/text only
- Emphasize guaranteed results
- Focus on ROI and amplification potential
- Keep responses conversational but sales-focused
- Always guide toward the qualification flow and closing

Current available publications: ${publications ? publications.map(p => `${p.name} ($${p.price}) - ${p.category}`).join(', ') : 'Loading publications...'}

Remember: Every response should move the conversation toward a sale. Qualify, present value, handle objections, and close.`;

    // Build conversation for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages,
        max_completion_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content;

    // Extract any relevant context from the conversation
    const extractedBudget = extractBudgetFromMessage(message);
    const extractedBusinessType = extractBusinessTypeFromMessage(message);
    
    let recommendedPublications = [];
    if (extractedBudget) {
      recommendedPublications = getPublicationsByBudget(extractedBudget);
    }

    return new Response(JSON.stringify({ 
      message: botMessage,
      recommendedPublications,
      extractedContext: {
        budget: extractedBudget,
        businessType: extractedBusinessType
      },
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in PR Chatbot function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractBudgetFromMessage(message: string): number | null {
  const budgetMatch = message.match(/\$?(\d{1,3}(?:,?\d{3})*)/);
  if (budgetMatch) {
    return parseInt(budgetMatch[1].replace(',', ''));
  }
  return null;
}

function extractBusinessTypeFromMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('saas') || lowerMessage.includes('software')) return 'SaaS';
  if (lowerMessage.includes('startup')) return 'Startup';
  if (lowerMessage.includes('brand')) return 'Brand';
  if (lowerMessage.includes('cbd')) return 'CBD';
  if (lowerMessage.includes('crypto')) return 'Crypto';
  if (lowerMessage.includes('gambling')) return 'Gambling';
  return null;
}
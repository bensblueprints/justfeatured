import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    const { budget, businessType, industry, goals, targetAudience } = await req.json();

    const systemPrompt = `You are an expert press release strategist. Your job is to analyze a client's budget and business needs to recommend the optimal mix of publications for maximum PR impact.

Consider these factors:
1. Budget allocation across different tiers for maximum ROI
2. Industry relevance and target audience reach
3. Geographic coverage needs
4. Timeline and frequency of releases
5. Authority and credibility building

Publication tiers available:
- Exclusive ($50k-$200k): Bloomberg, WSJ, TechCrunch - Maximum authority, global reach
- Tier 1 ($7k-$60k): Premium publications like USA Today, The Hill, GamesBeat
- Premium ($3k-$15k): Industry-specific and regional authorities
- Tier 2 ($1k-$4k): Targeted industry and local publications  
- Starter ($400-$2.5k): Cost-effective reach and volume

Provide specific recommendations with:
1. Budget breakdown by tier
2. Number of releases recommended
3. Specific publication types to target
4. Timeline strategy
5. Expected outcomes

Be concise but comprehensive in your recommendations.`;

    const userPrompt = `Please analyze this client's needs and provide publication recommendations:

Budget: $${budget}
Business Type: ${businessType}
Industry: ${industry}
Goals: ${goals}
Target Audience: ${targetAudience}

Provide a strategic recommendation including specific budget allocation, number of releases, and expected timeline.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const recommendation = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      recommendation,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI Press Agent function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
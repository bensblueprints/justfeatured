import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const supabase = createClient(supabaseUrl!, supabaseKey!);

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
    console.log('AI Press Agent function called');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY is not set');
      throw new Error('OPENAI_API_KEY is not set');
    }

    if (!perplexityApiKey) {
      console.error('PERPLEXITY_API_KEY is not set');
      throw new Error('PERPLEXITY_API_KEY is not set');
    }

    const requestData = await req.json();
    const { action } = requestData;
    
    console.log('Request data:', requestData);

    switch (action) {
      case 'strategy':
        return await handleStrategy(requestData);
      case 'research':
        return await handleResearch(requestData);
      case 'draft':
        return await handleDraft(requestData);
      default:
        throw new Error('Invalid action specified');
    }

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

async function handleStrategy(data: any) {
  const { budget, businessType, industry, goals, targetAudience } = data;

  // Get actual publications from database to inform strategy
  const { data: publications, error } = await supabase
    .from('publications')
    .select('name, price, tier, category, type')
    .eq('status', 'active')
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching publications:', error);
  }

  // Create intelligent budget distribution based on budget size
  const budgetNum = parseInt(budget);
  let budgetStrategy = '';
  
  if (budgetNum >= 10000) {
    budgetStrategy = `
**Smart Budget Distribution for $${budget}:**
• 1 Premium Publication ($4,000-$6,000): Major national outlet for maximum credibility
• 5-6 Mid-Tier Publications ($500-$1,000 each): Industry-specific and regional coverage  
• 2-3 Niche Publications ($200-$500 each): Targeted audience reach
• Reserve 10-15% for follow-up campaigns and content amplification
    `;
  } else if (budgetNum >= 5000) {
    budgetStrategy = `
**Smart Budget Distribution for $${budget}:**
• 1 High-Impact Publication ($2,500-$3,500): Strong national or industry leader
• 3-4 Mid-Tier Publications ($400-$800 each): Regional and industry coverage
• 2-3 Targeted Publications ($200-$500 each): Niche audience focus
    `;
  } else if (budgetNum >= 2500) {
    budgetStrategy = `
**Smart Budget Distribution for $${budget}:**
• 2-3 Mid-Tier Publications ($600-$1,000 each): Focus on industry relevance
• 3-4 Smaller Publications ($200-$500 each): Regional and niche coverage
    `;
  } else {
    budgetStrategy = `
**Smart Budget Distribution for $${budget}:**
• 4-6 Targeted Publications ($200-$600 each): Maximize coverage within budget
• Focus on niche and regional outlets for cost-effective impact
    `;
  }

  const systemPrompt = `You are an expert press release strategist who specializes in smart budget allocation across publication tiers. Your job is to create realistic, actionable strategies that maximize ROI by mixing high-impact and volume publications.

Key principles:
1. Always include at least one "anchor" publication for credibility
2. Balance reach vs. authority based on budget constraints  
3. Consider industry-specific publications for targeted impact
4. Factor in geographic relevance for the business
5. Provide realistic timelines and measurable outcomes

Publication tiers available:
- Exclusive ($50k-$200k): Bloomberg, WSJ, TechCrunch - Maximum authority, global reach
- Tier 1 ($7k-$60k): Premium publications like USA Today, The Hill, GamesBeat
- Premium ($3k-$15k): Industry-specific and regional authorities
- Tier 2 ($1k-$4k): Targeted industry and local publications  
- Starter ($400-$2.5k): Cost-effective reach and volume

Always provide specific budget breakdowns that add up to the total budget.`;

  const userPrompt = `Create a strategic press release plan for this client:

Budget: $${budget}
Business Type: ${businessType}
Industry: ${industry}
Goals: ${goals}
Target Audience: ${targetAudience}

${budgetStrategy}

Based on this budget distribution, provide:
1. **Specific Publication Recommendations** - actual tiers and estimated costs
2. **Timeline Strategy** - when to publish each release for maximum impact
3. **Key Messaging Strategy** - how to tailor content for different publication types
4. **Success Metrics** - specific KPIs to track ROI
5. **Expected Outcomes** - realistic projections for reach and engagement

Make the strategy actionable with specific next steps.`;

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

  const data_response = await response.json();
  const recommendation = data_response.choices[0].message.content;

  return new Response(JSON.stringify({ 
    recommendation,
    success: true 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleResearch(data: any) {
  const { industry, businessType, announcement, companyName } = data;

  // First, search for existing press releases in our database
  const { data: existingPressReleases, error } = await supabase
    .rpc('get_publications_for_user');

  if (error) {
    console.error('Error fetching publications:', error);
  }

  // Use Perplexity to research industry trends and similar announcements
  const researchPrompt = `Research the ${industry} industry for recent press releases and announcements similar to: "${announcement}" by companies like ${companyName}. 

Focus on:
1. Recent similar announcements in the ${industry} industry
2. Current industry trends and hot topics
3. Key messaging strategies that worked well
4. Target publications and media outlets for this type of news
5. Best practices for ${businessType} companies in this space

Provide insights that will help craft a compelling press release.`;

  const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${perplexityApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are a press release research specialist. Provide detailed industry insights and competitive analysis for press release strategy.'
        },
        {
          role: 'user',
          content: researchPrompt
        }
      ],
      temperature: 0.2,
      top_p: 0.9,
      max_tokens: 1500,
      return_related_questions: false,
      search_recency_filter: 'month',
    }),
  });

  if (!perplexityResponse.ok) {
    const errorData = await perplexityResponse.json();
    console.error('Perplexity API error:', errorData);
    throw new Error(`Perplexity API error: ${perplexityResponse.status}`);
  }

  const perplexityData = await perplexityResponse.json();
  const research = perplexityData.choices[0].message.content;

  // Combine database insights with Perplexity research
  const publicationTypes = existingPressReleases ? 
    existingPressReleases.slice(0, 10).map((pub: any) => `${pub.name} (${pub.category})`) : [];

  const combinedResearch = `## Industry Research Results

${research}

## Available Publications in Our Database
Based on your industry (${industry}), here are some relevant publication options:
${publicationTypes.length > 0 ? publicationTypes.join('\n- ') : 'Publications available after strategy completion'}

## Next Steps
Use this research to craft your press release with current industry context and competitive positioning.`;

  return new Response(JSON.stringify({ 
    research: combinedResearch,
    success: true 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleDraft(data: any) {
  const { 
    companyName, 
    announcement, 
    keyBenefits, 
    targetMarket, 
    quotes, 
    companyBackground, 
    industry, 
    researchData 
  } = data;

  const draftPrompt = `Create a professional press release based on the following information:

Company: ${companyName}
Industry: ${industry}
Announcement: ${announcement}
Key Benefits: ${keyBenefits}
Target Market: ${targetMarket}
Company Background: ${companyBackground}
${quotes ? `Quotes: ${quotes}` : ''}

Research Context:
${researchData}

Format the press release with:
1. Compelling headline
2. Dateline and location
3. Strong opening paragraph with key news
4. Supporting paragraphs with details and benefits
5. Quote(s) from leadership
6. Company boilerplate
7. Contact information placeholder

Make it newsworthy, professional, and industry-appropriate. Follow AP style guidelines.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-2025-08-07',
      messages: [
        { 
          role: 'system', 
          content: 'You are a professional press release writer with expertise in AP style and corporate communications. Create compelling, newsworthy press releases that journalists will want to cover.' 
        },
        { role: 'user', content: draftPrompt }
      ],
      max_completion_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('OpenAI API error:', errorData);
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const responseData = await response.json();
  const pressRelease = responseData.choices[0].message.content;

  return new Response(JSON.stringify({ 
    pressRelease,
    success: true 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
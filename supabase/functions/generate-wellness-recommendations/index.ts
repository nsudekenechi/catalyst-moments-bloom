import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, profile } = await req.json();

    if (!openAIApiKey) {
      console.error('OpenAI API key not found');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are a specialized wellness AI coach for mothers and women on their motherhood journey. 
    Generate personalized, actionable wellness recommendations based on the user's current state and journey stage.
    
    Focus on:
    - Journey-specific advice (TTC, pregnancy, postpartum, parenting)
    - Current wellness metrics (mood, energy, stress, sleep)
    - Actionable steps they can take immediately
    - Evidence-based recommendations
    
    Return a JSON object with a "recommendations" array containing exactly 5 recommendations.
    Each recommendation should have: type, title, description, action, priority, reasoning, timeframe, category, icon.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let recommendations;
    try {
      recommendations = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Invalid JSON response from AI');
    }

    return new Response(JSON.stringify(recommendations), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-wellness-recommendations function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      recommendations: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
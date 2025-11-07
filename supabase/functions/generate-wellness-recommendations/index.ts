import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, profile, action } = await req.json();

    if (!lovableApiKey) {
      console.error('Lovable API key not found. Available env vars:', Object.keys(Deno.env.toObject()));
      return new Response(JSON.stringify({ error: 'Lovable API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Lovable API key found, generating recommendations...');

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'insights') {
      systemPrompt = `You are a wellness AI coach. Generate 2-3 personalized wellness insights based on the user's profile.`;
      userPrompt = `Based on this wellness profile: ${JSON.stringify(profile)}
      
Generate 2-3 personalized wellness insights. Each insight should be specific, actionable, and encouraging. Focus on patterns, improvements, or gentle guidance.

Return as JSON: {"insights": ["insight 1", "insight 2", "insight 3"]}`;
    } else if (action === 'selfcare') {
      systemPrompt = `You are a wellness AI coach. Generate personalized self-care ideas for quick wellness boosts.`;
      userPrompt = `Based on this wellness profile: ${JSON.stringify(profile)}
      
Generate 3-4 personalized self-care ideas for quick wellness boosts. Each should include:
- Specific title and description
- Duration (2-10 minutes)
- Category (breathing, movement, mindfulness, relaxation, energy)
- Simple step-by-step instructions
- Clear benefits
- Relevant emoji icon

Consider their current mood, energy, stress levels, and journey stage. Focus on activities that can be done anywhere, anytime.

Return as JSON: {"ideas": [array of idea objects with fields: id, title, description, duration, category, instructions, benefits, icon]}`;
    } else {
      systemPrompt = `You are a specialized wellness AI coach for mothers and women on their motherhood journey. 
      Generate personalized, actionable wellness recommendations based on the user's current state and journey stage.
      
      Focus on:
      - Journey-specific advice (TTC, pregnancy, postpartum, parenting)
      - Current wellness metrics (mood, energy, stress, sleep)
      - Actionable steps they can take immediately
      - Evidence-based recommendations
      
      Return a JSON object with a "recommendations" array containing exactly 5 recommendations.
      Each recommendation should have: type, title, description, action, priority, reasoning, timeframe, category, icon.`;
      userPrompt = prompt;
    }

    // Retry logic with exponential backoff
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Retry attempt ${attempt} after ${delay}ms delay`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: "json_object" }
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            return new Response(JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }), {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          if (response.status === 402) {
            return new Response(JSON.stringify({ error: 'Payment required, please add credits to your Lovable AI workspace.' }), {
              status: 402,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
          const errorData = await response.text();
          console.error('Lovable AI error:', errorData);
          throw new Error(`Lovable AI error: ${response.status}`);
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
        lastError = error;
        console.error(`Attempt ${attempt + 1} failed:`, error.message);
        if (attempt === maxRetries - 1) break;
      }
    }

    throw lastError;

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
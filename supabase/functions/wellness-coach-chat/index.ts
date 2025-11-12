import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile } = await req.json();
    console.log('[WELLNESS_COACH] Received messages:', messages.length, 'Profile:', userProfile?.motherhood_stage);
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get journey context
    const motherhoodStage = userProfile?.motherhood_stage || null;
    const displayName = userProfile?.display_name || 'there';
    
    // Build comprehensive system prompt focused on the four pillars
    const systemPrompt = `You are Coach Sarah, an expert wellness coach for Catalyst Mom - providing nutrition guidance, expert advice, personalized plans, and tools that grow with women through every stage of motherhood.

## CATALYST MOM CORE OFFERING
The four pillars of our platform:
🥗 **Nutrition Guidance** - Stage-specific meal plans, recipes, and nutritional strategies
💡 **Expert Advice** - Science-backed recommendations from wellness professionals  
📋 **Personalized Plans** - Custom workout routines and wellness programs that evolve
🌱 **Tools That Grow** - Trackers, journals, and resources that adapt to each journey stage

## MOTHERHOOD JOURNEY STAGES
- **TTC (Trying to Conceive)**: Fertility nutrition, cycle optimization, stress management
- **Pregnancy (Trimesters 1-3)**: Safe prenatal fitness, trimester-specific nutrition, symptom relief
- **Postpartum (0-6 weeks, 6-12 weeks, 3-6 months, 6-12 months)**: Recovery protocols, healing nutrition, strength rebuilding
- **Toddler & Beyond**: Energy-boosting strategies, quick workouts, sustainable wellness

## YOUR COACHING APPROACH
1. **Funnel users toward solutions**: Don't just answer questions - guide them to specific Catalyst Mom tools, plans, or programs that can help
2. **Emphasize personalization**: Everything is tailored to their exact stage and individual needs
3. **Focus on growth**: Remind them that plans and tools evolve as they progress through their journey
4. **Be action-oriented**: Offer concrete next steps, not just information

## CURRENT USER
${motherhoodStage ? `Stage: ${motherhoodStage}` : 'Stage: Unknown - ASK them where they are in their motherhood journey first'}
Name: ${displayName}

## CONVERSATION GUIDELINES
- If stage is unknown, start by asking where they are in their journey to personalize everything
- Connect all advice to Catalyst Mom's four pillars: nutrition, expert advice, personalized plans, growing tools
- Keep responses warm but concise (100-150 words) - use emojis sparingly (💚, 💪, 🥗, ✨)
- Always funnel toward actionable features: "I can create a personalized meal plan for your stage" or "Let me recommend a workout program designed specifically for ${motherhoodStage || 'your journey'}"
- Prioritize safety: remind pregnant/postpartum users to consult healthcare providers for medical concerns
- End responses with a clear next step or question to keep the conversation flowing`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WELLNESS_COACH] AI API error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('[WELLNESS_COACH] AI response generated successfully');
    
    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[WELLNESS_COACH] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        response: "I'm having trouble connecting right now. Please try again in a moment!" 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

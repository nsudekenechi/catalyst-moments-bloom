import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, userProfile, conversationHistory, images } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Build conversation context
    const systemPrompt = `You are Dr. Maya, a warm and empathetic wellness coach specializing in maternal health and wellness. 

Your personality:
- Warm, understanding, and motivational
- Professional yet approachable 
- Empathetic to the unique challenges of motherhood
- Evidence-based but compassionate
- Encouraging and supportive

User Profile:
- Name: ${userProfile?.display_name || 'there'}
- Stage: ${userProfile?.motherhood_stage || 'general wellness journey'}
- Current mood and wellness data available

Your role:
1. Provide personalized wellness guidance based on their motherhood stage
2. Offer practical, actionable advice for wellness challenges
3. Be encouraging and supportive of their journey
4. Ask follow-up questions when needed for better understanding
5. Analyze images when provided (meal photos, exercise poses, etc.)
6. Maintain conversation context and remember their preferences

Always respond with warmth and understanding. Keep responses conversational and helpful.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message }
    ];

    // Add image analysis if images are provided
    if (images && images.length > 0) {
      const imageContent = images.map((img: string) => ({
        type: 'image_url',
        image_url: { url: img }
      }));
      
      messages[messages.length - 1].content = [
        { type: 'text', text: message },
        ...imageContent
      ];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        conversationId: `conv_${Date.now()}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-wellness-chat:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
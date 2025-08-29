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
    const { message, userContext, conversationHistory, images } = await req.json();
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Enhanced system prompt with comprehensive user context
    let systemPrompt = `You are Dr. Maya, a warm, empathetic AI wellness coach specializing in maternal health. You have deep knowledge about pregnancy, postpartum recovery, TTC (trying to conceive), and general maternal wellness. You're having a personalized conversation with ${userContext?.displayName || 'a mom'}.

USER PROFILE & BACKGROUND:
- Name: ${userContext?.displayName || 'Mom'}
- Motherhood stage: ${userContext?.motherhood_stage || 'general wellness'}
- Conversation mode: Voice chat (keep responses conversational and natural)

COMPREHENSIVE WELLNESS DATA:
${userContext?.wellnessEntries?.length ? `
Recent Wellness Check-ins (${userContext.wellnessEntries.length} entries):
${userContext.wellnessEntries.slice(0, 5).map((entry, i) => 
  `${i + 1}. Mood: ${entry.mood_score || 'N/A'}/10, Energy: ${entry.energy_level || 'N/A'}/10${entry.notes ? `, Notes: "${entry.notes}"` : ''}`
).join('\n')}` : '- No recent wellness check-ins recorded'}

WELLNESS PATTERNS & INSIGHTS:
${userContext?.avgEnergyLevel ? `- Average energy level: ${userContext.avgEnergyLevel.toFixed(1)}/10` : ''}
${userContext?.recentMoods?.length ? `- Recent mood trend: ${userContext.recentMoods.join(', ')}/10` : ''}
${userContext?.commonConcerns?.length ? `- Common concerns mentioned: ${userContext.commonConcerns.slice(0, 5).join('; ')}` : ''}
${userContext?.recentSymptoms?.length ? `
Recent symptoms/patterns:
${userContext.recentSymptoms.slice(0, 3).map(s => 
  `• Mood ${s.mood}/10, Energy ${s.energy}/10${s.notes ? ` - ${s.notes}` : ''}`
).join('\n')}` : ''}

CONVERSATION HISTORY:
${conversationHistory?.length ? conversationHistory.slice(-8).map(msg => `${msg.sender === 'user' ? userContext?.displayName : 'Dr. Maya'}: ${msg.content}`).join('\n') : 'This is the start of our conversation'}

INSTRUCTIONS:
- Be warm, supportive, and encouraging
- Reference their specific wellness data when relevant
- Ask follow-up questions to understand their needs better
- Provide actionable, personalized advice
- Stay focused on wellness, nutrition, fitness, and mental health
- Use their name naturally in conversation
- If they have low scores in any area, address it compassionately
- Remember previous conversation context
- Be conversational and avoid being overly clinical

STAGE-SPECIFIC GUIDANCE:
${userContext?.motherhood_stage === 'pregnant' ? '- Focus on pregnancy-safe exercises, prenatal nutrition, and managing pregnancy symptoms' : ''}
${userContext?.motherhood_stage === 'postpartum' ? '- Focus on recovery, postpartum depression support, and energy management' : ''}
${userContext?.motherhood_stage === 'ttc' ? '- Focus on fertility nutrition, stress management, and emotional support during TTC' : ''}
${userContext?.motherhood_stage === 'general' || !userContext?.motherhood_stage ? '- Focus on general maternal wellness, stress management, and self-care' : ''}

Respond in a natural, conversational way as if you're talking to a friend who trusts you with their wellness journey.`;

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
        max_completion_tokens: 500,
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
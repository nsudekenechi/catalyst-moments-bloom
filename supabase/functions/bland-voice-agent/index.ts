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
    const BLAND_API_KEY = Deno.env.get('BLAND_API_KEY');
    if (!BLAND_API_KEY) {
      throw new Error('BLAND_API_KEY not configured');
    }

    const { action, phone_number, callId } = await req.json();

    switch (action) {
      case 'start_call':
        // Start a new call
        const callResponse = await fetch('https://api.bland.ai/v1/calls', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${BLAND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number: phone_number,
            task: "You are Dr. Maya, a warm and empathetic wellness coach specializing in maternal health. Provide personalized wellness guidance, be encouraging and supportive. Ask about their wellness goals and current challenges. Keep the conversation natural and flowing.",
            voice: "maya",
            model: "enhanced",
            max_duration: 10,
            answered_by_enabled: true,
            wait_for_greeting: true,
            record: true,
            language: "en"
          }),
        });

        if (!callResponse.ok) {
          const error = await callResponse.text();
          throw new Error(`Bland API error: ${error}`);
        }

        const callData = await callResponse.json();
        console.log('Call started:', callData);

        return new Response(JSON.stringify(callData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'get_call_status':
        // Get call status
        const statusResponse = await fetch(`https://api.bland.ai/v1/calls/${callId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${BLAND_API_KEY}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to get call status');
        }

        const statusData = await statusResponse.json();
        return new Response(JSON.stringify(statusData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      case 'end_call':
        // End the call
        const endResponse = await fetch(`https://api.bland.ai/v1/calls/${callId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${BLAND_API_KEY}`,
          },
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in bland-voice-agent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
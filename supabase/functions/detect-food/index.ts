import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Rate limiting helper (simplified in-memory tracking)
const requestTracker = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientData = requestTracker.get(clientId);
  
  if (!clientData || (now - clientData.lastReset) > RATE_LIMIT_WINDOW) {
    requestTracker.set(clientId, { count: 1, lastReset: now });
    return true;
  }
  
  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  clientData.count++;
  return true;
}

function validateImageData(image: string): { valid: boolean; error?: string } {
  if (!image || typeof image !== 'string') {
    return { valid: false, error: 'Invalid image data type' };
  }

  if (!image.startsWith('data:image/')) {
    return { valid: false, error: 'Invalid image format - must be data URL' };
  }

  // Extract MIME type
  const mimeMatch = image.match(/^data:(image\/[a-z]+);base64,/);
  if (!mimeMatch) {
    return { valid: false, error: 'Invalid image data URL format' };
  }

  const mimeType = mimeMatch[1];
  if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return { valid: false, error: `Unsupported image type: ${mimeType}` };
  }

  // Check base64 data size
  const base64Data = image.split(',')[1];
  if (!base64Data) {
    return { valid: false, error: 'Missing base64 data' };
  }

  const estimatedSize = (base64Data.length * 3) / 4;
  if (estimatedSize > MAX_IMAGE_SIZE) {
    return { valid: false, error: `Image too large. Max size: ${MAX_IMAGE_SIZE / (1024 * 1024)}MB` };
  }

  return { valid: true };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const clientId = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'anonymous';
  
  try {
    // Rate limiting check
    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 429 
        }
      );
    }

    // Parse and validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { image } = requestBody;
    
    // Validate image data
    const validation = validateImageData(image);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Extract the base64 part safely
    const base64Data = image.split(',')[1];
    
    // Convert base64 to blob for the API request
    let blob: Blob;
    try {
      const binaryData = atob(base64Data);
      const bytes = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        bytes[i] = binaryData.charCodeAt(i);
      }
      blob = new Blob([bytes], { type: 'image/jpeg' });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to process image data" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Create FormData to send to the Hugging Face API
    const formData = new FormData();
    formData.append('file', blob, 'food.jpg');

    // Call Hugging Face API for food detection with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response: Response;
    try {
      response = await fetch(
        "https://api-inference.huggingface.co/models/Salesforce/blip-food",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Deno.env.get("HUGGING_FACE_ACCESS_TOKEN")}`,
          },
          body: formData,
          signal: controller.signal,
        }
      );
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: "Request timeout. Please try again." }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 408 }
        );
      }
      throw error;
    }
    
    clearTimeout(timeoutId);

    // Process the response from the Hugging Face API
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error("Hugging Face API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily overloaded. Please try again later." }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Food detection service temporarily unavailable" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 503 }
      );
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      console.error("Failed to parse Hugging Face response:", error);
      return new Response(
        JSON.stringify({ error: "Invalid response from food detection service" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query our food database to find nutritional information
    let detectedFood = result?.generated_text || "Unknown food";
    
    // Clean and simplify the food name for better matching
    const simplifiedFoodName = detectedFood
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .split(' ')[0] // Take first word
      .trim();
    
    let foodData = null;
    if (simplifiedFoodName.length > 2) { // Only search if name is meaningful
      try {
        const { data, error: foodError } = await supabase
          .from('food_items')
          .select('*')
          .ilike('name', `%${simplifiedFoodName}%`)
          .limit(1);

        if (foodError) {
          console.error("Database query error:", foodError);
        } else if (data && data.length > 0) {
          foodData = data[0];
        }
      } catch (dbError) {
        console.error("Database connection error:", dbError);
        // Continue without nutritional info rather than failing completely
      }
    }

    // Prepare response with food detection and nutritional info
    const responseData = {
      detectedFood: detectedFood.substring(0, 100), // Limit response length
      nutritionalInfo: foodData,
      message: foodData ? 
        `Detected: ${detectedFood}. Found nutritional information.` : 
        `Detected: ${detectedFood}. No precise nutritional information available.`,
      confidence: result?.confidence || null
    };

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in detect-food function:", {
      message: error.message,
      stack: error.stack,
      clientId
    });
    
    // Return generic error message to avoid information disclosure
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
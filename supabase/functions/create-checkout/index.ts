import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    // Get request body for price IDs (monthly and yearly)
    const { monthly_price_id, yearly_price_id } = await req.json().catch(() => ({}));

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      logStep("ERROR: STRIPE_SECRET_KEY not found");
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    
    // Check for existing customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found, will create during checkout");
    }

    // Build line items with both monthly and yearly options if provided
    const lineItems = [];
    
    if (monthly_price_id) {
      lineItems.push({ price: monthly_price_id, quantity: 1 });
      logStep("Added monthly price", { monthly_price_id });
    }
    
    if (yearly_price_id) {
      lineItems.push({ price: yearly_price_id, quantity: 1 });
      logStep("Added yearly price", { yearly_price_id });
    }
    
    // Fallback: if no prices provided, use env or find first active recurring price
    if (lineItems.length === 0) {
      const fallbackPriceId = Deno.env.get('STRIPE_PRICE_ID');
      if (fallbackPriceId) {
        lineItems.push({ price: fallbackPriceId, quantity: 1 });
        logStep("Using fallback price from env", { fallbackPriceId });
      } else {
        const prices = await stripe.prices.list({ active: true, type: 'recurring', limit: 1 });
        if (prices.data.length === 0) {
          throw new Error('No active recurring Stripe prices found. Pass monthly_price_id and yearly_price_id or set STRIPE_PRICE_ID');
        }
        lineItems.push({ price: prices.data[0].id, quantity: 1 });
        logStep("Using first active recurring price", { priceId: prices.data[0].id });
      }
    }
    
    logStep("Created line items", { count: lineItems.length });

    // Build a reliable base URL for redirects
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") ?? "https";
    const origin = req.headers.get("origin") ?? (host ? `${protocol}://${host}` : undefined);
    if (!origin) {
      throw new Error("Unable to determine app origin for redirect URLs");
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/`,
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
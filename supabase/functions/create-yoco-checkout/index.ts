import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Server-side pricing - NEVER trust client for amounts
const PLANS: Record<string, { amount: number; name: string }> = {
  'pro': { amount: 300, name: 'Pro Plan' }, // R3.00 = 300 cents
};

// Secure CORS helper
const getAllowedOrigin = (requestOrigin: string | null): string | null => {
  const allowedOrigin = Deno.env.get('ALLOWED_ORIGIN');
  
  if (!requestOrigin) return null;
  
  // Allow localhost for development
  if (requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1')) {
    return requestOrigin;
  }
  
  // Check against configured allowed origin
  if (allowedOrigin && requestOrigin === allowedOrigin) {
    return requestOrigin;
  }
  
  // Also allow Lovable preview URLs
  if (requestOrigin.includes('.lovableproject.com') || requestOrigin.includes('.lovable.app')) {
    return requestOrigin;
  }
  
  return null;
};

const getCorsHeaders = (origin: string | null): Record<string, string> => {
  const allowedOrigin = getAllowedOrigin(origin);
  
  if (!allowedOrigin) {
    return {
      'Access-Control-Allow-Origin': '',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
  }
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
};

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  // Block requests from disallowed origins
  if (!corsHeaders['Access-Control-Allow-Origin']) {
    console.error('CORS blocked: origin not allowed', origin);
    return new Response(
      JSON.stringify({ error: 'Origin not allowed' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const yocoSecretKey = Deno.env.get("YOCO_SECRET_KEY");
    if (!yocoSecretKey) {
      throw new Error("YOCO_SECRET_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    const { successUrl, cancelUrl, planId = 'pro' } = await req.json();

    // Server-side price lookup - NEVER trust client amount
    const plan = PLANS[planId];
    if (!plan) {
      console.error(`Invalid plan requested: ${planId}`);
      throw new Error(`Invalid plan: ${planId}. Available plans: ${Object.keys(PLANS).join(', ')}`);
    }

    const amount = plan.amount;
    console.log(`Creating Yoco checkout for user: ${user.id}, plan: ${planId}, amount: ${amount}`);

    // Create Yoco checkout
    const yocoResponse = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${yocoSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount, // Amount in cents from server-side lookup
        currency: "ZAR",
        successUrl: successUrl || `${origin}/payment-success`,
        cancelUrl: cancelUrl || `${origin}/`,
        metadata: {
          user_id: user.id,
          plan: planId,
        },
      }),
    });

    if (!yocoResponse.ok) {
      const errorText = await yocoResponse.text();
      console.error("Yoco API error:", errorText);
      throw new Error(`Yoco API error: ${errorText}`);
    }

    const yocoData = await yocoResponse.json();
    console.log("Yoco checkout created:", yocoData.id);

    // Create pending subscription record
    const { error: insertError } = await supabase
      .from("subscriptions")
      .insert({
        user_id: user.id,
        status: "pending",
        plan: planId,
        amount: amount,
        currency: "ZAR",
        yoco_checkout_id: yocoData.id,
      });

    if (insertError) {
      console.error("Failed to create subscription record:", insertError);
    }

    return new Response(
      JSON.stringify({
        checkoutUrl: yocoData.redirectUrl,
        checkoutId: yocoData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating checkout:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

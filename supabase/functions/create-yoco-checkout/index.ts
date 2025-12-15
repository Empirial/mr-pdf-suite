import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
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

    const { successUrl, cancelUrl, amount = 300 } = await req.json();

    console.log("Creating Yoco checkout for user:", user.id);

    // Create Yoco checkout
    const yocoResponse = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${yocoSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: amount, // Amount in cents (R3.00 = 300 cents)
        currency: "ZAR",
        successUrl: successUrl || `${req.headers.get("origin")}/payment-success`,
        cancelUrl: cancelUrl || `${req.headers.get("origin")}/`,
        metadata: {
          user_id: user.id,
          plan: "pro",
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
        plan: "pro",
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

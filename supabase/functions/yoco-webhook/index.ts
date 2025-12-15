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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log("Yoco webhook received:", JSON.stringify(payload));

    const { type, payload: eventPayload } = payload;

    if (type === "payment.succeeded") {
      const { metadata, id: paymentId } = eventPayload;
      const userId = metadata?.user_id;
      const checkoutId = eventPayload.checkout?.id;

      console.log("Payment succeeded for user:", userId, "checkoutId:", checkoutId);

      if (checkoutId) {
        // Calculate expiry date (1 month from now)
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        // Update subscription status
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            yoco_payment_id: paymentId,
            expires_at: expiresAt.toISOString(),
          })
          .eq("yoco_checkout_id", checkoutId);

        if (updateError) {
          console.error("Failed to update subscription:", updateError);
          throw updateError;
        }

        console.log("Subscription activated for checkoutId:", checkoutId);
      }
    } else if (type === "payment.failed") {
      const checkoutId = payload.payload?.checkout?.id;
      
      if (checkoutId) {
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("yoco_checkout_id", checkoutId);

        if (updateError) {
          console.error("Failed to update failed subscription:", updateError);
        }
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Webhook error:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

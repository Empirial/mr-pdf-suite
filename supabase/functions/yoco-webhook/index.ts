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
    console.log("========== YOCO WEBHOOK RECEIVED ==========");
    console.log("Full payload:", JSON.stringify(payload, null, 2));
    console.log("Event type:", payload.type);
    console.log("Timestamp:", new Date().toISOString());

    const { type, payload: eventPayload } = payload;

    if (type === "payment.succeeded") {
      console.log("========== PAYMENT SUCCEEDED ==========");
      
      const { metadata, id: paymentId } = eventPayload;
      const checkoutId = eventPayload.checkout?.id;
      const userId = metadata?.user_id;
      
      console.log("Payment ID:", paymentId);
      console.log("Checkout ID:", checkoutId);
      console.log("User ID from metadata:", userId);
      console.log("Full metadata:", JSON.stringify(metadata, null, 2));

      if (!checkoutId) {
        console.error("ERROR: No checkout ID found in payload");
        console.log("eventPayload.checkout:", eventPayload.checkout);
        throw new Error("No checkout ID in payment payload");
      }

      // First, let's find the subscription by checkout ID
      const { data: existingSubscription, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("yoco_checkout_id", checkoutId)
        .single();

      if (fetchError) {
        console.error("ERROR: Failed to find subscription:", fetchError);
        console.log("Looking for checkout ID:", checkoutId);
        
        // List all pending subscriptions for debugging
        const { data: allPending } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("status", "pending")
          .limit(10);
        console.log("All pending subscriptions:", JSON.stringify(allPending, null, 2));
        
        throw new Error(`Subscription not found for checkout: ${checkoutId}`);
      }

      console.log("Found existing subscription:", JSON.stringify(existingSubscription, null, 2));

      // Calculate trial end date (3 days from now)
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 3);
      
      // Calculate full expiry date (3 days trial + 1 month subscription = ~34 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 3); // Add trial days
      expiresAt.setMonth(expiresAt.getMonth() + 1); // Add 1 month
      
      console.log("Setting trial end date to:", trialEndsAt.toISOString());
      console.log("Setting expiry date to:", expiresAt.toISOString());

      // Update subscription status - start with trial
      const { data: updatedSubscription, error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: "trial",
          yoco_payment_id: paymentId,
          trial_ends_at: trialEndsAt.toISOString(),
          expires_at: expiresAt.toISOString(),
        })
        .eq("yoco_checkout_id", checkoutId)
        .select()
        .single();

      if (updateError) {
        console.error("ERROR: Failed to update subscription:", updateError);
        throw updateError;
      }

      console.log("========== TRIAL STARTED ==========");
      console.log("Updated subscription:", JSON.stringify(updatedSubscription, null, 2));
      
    } else if (type === "payment.failed") {
      console.log("========== PAYMENT FAILED ==========");
      const checkoutId = eventPayload?.checkout?.id;
      console.log("Failed checkout ID:", checkoutId);
      
      if (checkoutId) {
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("yoco_checkout_id", checkoutId);

        if (updateError) {
          console.error("Failed to update failed subscription:", updateError);
        } else {
          console.log("Subscription marked as cancelled");
        }
      }
    } else {
      console.log("Unhandled webhook event type:", type);
    }

    return new Response(
      JSON.stringify({ received: true, type }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("========== WEBHOOK ERROR ==========");
    console.error("Error:", errorMessage);
    console.error("Stack:", error instanceof Error ? error.stack : "N/A");
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

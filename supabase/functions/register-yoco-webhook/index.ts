import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const yocoSecretKey = Deno.env.get('YOCO_SECRET_KEY');
    
    if (!yocoSecretKey) {
      console.error('YOCO_SECRET_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'YOCO_SECRET_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const webhookUrl = 'https://mxvybugxuavrjlpjowsb.supabase.co/functions/v1/yoco-webhook';
    
    console.log('Registering Yoco webhook...');
    console.log('Webhook URL:', webhookUrl);

    const response = await fetch('https://payments.yoco.com/api/webhooks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${yocoSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'mr-pdf-payments',
        url: webhookUrl,
      }),
    });

    const responseText = await response.text();
    console.log('Yoco API response status:', response.status);
    console.log('Yoco API response:', responseText);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'Failed to register webhook', 
          status: response.status,
          details: responseText 
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const webhookData = JSON.parse(responseText);
    
    console.log('Webhook registered successfully!');
    console.log('Webhook ID:', webhookData.id);
    console.log('⚠️ IMPORTANT: Save the webhook secret below as YOCO_WEBHOOK_SECRET in Supabase secrets!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook registered successfully! Save the secret below as YOCO_WEBHOOK_SECRET in Supabase secrets.',
        webhook: webhookData,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error registering webhook:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

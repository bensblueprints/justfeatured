import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, customerInfo, packageType } = await req.json();

    // Initialize Stripe with secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Calculate total amount
    let totalAmount = 0;
    const lineItems = [];

    if (packageType === 'starter') {
      // Calculate from selected items just like custom package
      const subtotal = items.reduce((sum: number, item: any) => sum + item.price, 0);
      const processingFee = Math.round(subtotal * 0.029); // 2.9% processing fee
      totalAmount = subtotal + processingFee; // Convert to cents

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { 
            name: `Starter Package - ${items.length} Publication${items.length > 1 ? 's' : ''}`,
            description: `Selected publications: ${items.map((item: any) => item.name).join(', ')}`
          },
          unit_amount: totalAmount,
        },
        quantity: 1,
      });
    } else {
      // Calculate from selected items
      const subtotal = items.reduce((sum: number, item: any) => sum + item.price, 0);
      const processingFee = Math.max(subtotal * 0.05, 25);
      totalAmount = Math.round((subtotal + processingFee) * 100); // Convert to cents

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { 
            name: `Custom Package - ${items.length} Publications`,
            description: `Selected publications: ${items.map((item: any) => item.name).join(', ')}`
          },
          unit_amount: totalAmount,
        },
        quantity: 1,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: customerInfo.email,
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/checkout`,
      metadata: {
        customer_name: customerInfo.fullName,
        business_name: customerInfo.businessName || '',
        industry: customerInfo.industry || '',
        package_type: packageType || 'custom',
        items_count: packageType === 'starter' ? '3' : items.length.toString(),
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
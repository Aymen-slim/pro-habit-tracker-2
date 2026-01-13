// Lemon Squeezy Webhook Handler for Supabase Edge Functions
// Receives payment notifications and upgrades users to premium

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1";

// HMAC signature verification
async function verifySignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBytes = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const digest = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Timing-safe comparison
  if (digest.length !== signature.length) return false;
  let result = 0;
  for (let i = 0; i < digest.length; i++) {
    result |= digest.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
}

Deno.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const webhookSecret = Deno.env.get("LEMONSQUEEZY_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    console.error("Missing environment variables");
    return new Response("Server configuration error", { status: 500 });
  }

  // Get raw body and signature
  const rawBody = await req.text();
  const signature = req.headers.get("x-signature") || "";

  // Verify signature
  const isValid = await verifySignature(rawBody, signature, webhookSecret);
  if (!isValid) {
    console.error("Invalid signature");
    return new Response("Invalid signature", { status: 401 });
  }

  try {
    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data;
    const userId = customData?.user_id;

    console.log(`Received event: ${eventName} for User ID: ${userId}`);

    if (eventName === "order_created" || eventName === "order_paid") {
      if (userId) {
        console.log(`Upgrading user ${userId} to premium...`);

        // Create Supabase client with service role key
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const { error } = await supabase
          .from("profiles")
          .update({ tier: "premium" })
          .eq("id", userId);

        if (error) {
          console.error("Supabase update error:", error);
          return new Response("Database update failed", { status: 500 });
        }

        console.log(`User ${userId} upgraded successfully.`);
        return new Response("Webhook processed", { status: 200 });
      } else {
        console.warn("No user_id found in custom_data. Skipping update.");
        return new Response("No user_id provided", { status: 200 });
      }
    }

    return new Response("Event ignored", { status: 200 });
  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response("Invalid JSON", { status: 400 });
  }
});

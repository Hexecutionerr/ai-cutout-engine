// Razorpay webhook handler — verifies HMAC signature and processes payment events.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyWebhookSignature, PLAN_CATALOG, type PlanKey } from "@/rpc/razorpay.server";

export const Route = createFileRoute("/api/public/webhooks/razorpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const sig = request.headers.get("x-razorpay-signature");
        const raw = await request.text();

        if (!verifyWebhookSignature(raw, sig)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        const eventId: string = payload.id ?? payload.event ?? `${Date.now()}`;
        const eventType: string = payload.event ?? "unknown";

        // Idempotency
        const { data: dupe } = await supabaseAdmin
          .from("webhook_events")
          .select("id")
          .eq("provider", "razorpay")
          .eq("event_id", eventId)
          .maybeSingle();
        if (dupe) return new Response("ok (duplicate)", { status: 200 });

        await supabaseAdmin.from("webhook_events").insert({
          provider: "razorpay",
          event_id: eventId,
          event_type: eventType,
          payload,
        });

        // Handle payment.captured
        if (eventType === "payment.captured") {
          const p = payload.payload?.payment?.entity;
          if (p) {
            const orderId: string = p.order_id;
            const paymentId: string = p.id;
            const userId: string | undefined = p.notes?.user_id;
            const plan = (p.notes?.plan ?? "starter") as PlanKey;
            const cfg = PLAN_CATALOG[plan];

            await supabaseAdmin
              .from("payments")
              .update({ status: "captured", razorpay_payment_id: paymentId })
              .eq("razorpay_order_id", orderId);

            if (userId && cfg) {
              await supabaseAdmin.from("credits").insert({
                user_id: userId,
                delta: cfg.credits,
                reason: "purchase",
                reference: paymentId,
              });

              await supabaseAdmin
                .from("subscriptions")
                .upsert(
                  {
                    user_id: userId,
                    plan,
                    status: "active",
                    monthly_credits: cfg.credits,
                    current_period_start: new Date().toISOString(),
                    current_period_end: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
                  },
                  { onConflict: "user_id" },
                );
            }
          }
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});

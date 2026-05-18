// n8n webhook receiver — accepts batch-processing callbacks.
// Verify with shared secret. Use to trigger downstream automations.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/public/webhooks/n8n")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = request.headers.get("x-n8n-secret");
        if (!secret || secret !== (process.env.N8N_WEBHOOK_SECRET ?? "")) {
          return new Response("Unauthorized", { status: 401 });
        }
        let payload: unknown;
        try { payload = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }

        await supabaseAdmin.from("webhook_events").insert({
          provider: "n8n",
          event_id: `n8n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          event_type: "n8n_callback",
          payload: payload as never,
        } as never);

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});

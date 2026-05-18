// 24h cleanup hook — deletes Cloudinary assets and rows whose expires_at has passed.
// Called by pg_cron via pg_net every hour.
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { deleteFromCloudinary } from "@/rpc/cloudinary.server";

export const Route = createFileRoute("/api/public/hooks/cleanup-expired")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = request.headers.get("x-cron-secret");
        if (!secret || secret !== (process.env.CRON_SECRET ?? "")) {
          return new Response("Unauthorized", { status: 401 });
        }

        const { data: expired } = await supabaseAdmin
          .from("uploads")
          .select("id, cloudinary_public_id")
          .lt("expires_at", new Date().toISOString())
          .limit(500);

        let deleted = 0;
        for (const row of expired ?? []) {
          if (row.cloudinary_public_id) {
            try {
              await deleteFromCloudinary(row.cloudinary_public_id);
            } catch (e) {
              console.error("[cleanup] cloudinary delete", e);
            }
          }
          await supabaseAdmin.from("uploads").delete().eq("id", row.id);
          deleted++;
        }

        return new Response(JSON.stringify({ ok: true, deleted }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});

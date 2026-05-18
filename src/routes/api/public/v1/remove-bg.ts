// Public REST endpoint for API-key authenticated background removal.
// POST /api/public/v1/remove-bg with header: Authorization: Bearer ck_live_xxx
// Body: { image_url: string }  OR  multipart/form-data with field "image"
import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sha256Hex } from "@/rpc/api-keys.server";
import { uploadToCloudinary } from "@/rpc/cloudinary.server";
import { removeBackground } from "@/rpc/ai-bg.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const Route = createFileRoute("/api/public/v1/remove-bg")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        const auth = request.headers.get("authorization") ?? "";
        const token = auth.replace(/^Bearer\s+/i, "").trim();
        if (!token) return json({ error: "Missing API key" }, 401);

        const hash = await sha256Hex(token);
        const { data: keyRow } = await supabaseAdmin
          .from("api_keys")
          .select("id, user_id, revoked_at, request_count")
          .eq("key_hash", hash)
          .maybeSingle();

        if (!keyRow || keyRow.revoked_at) return json({ error: "Invalid or revoked API key" }, 401);

        // Credit check
        const { data: balance } = await supabaseAdmin.rpc("credit_balance", { _user_id: keyRow.user_id });
        if (Number(balance ?? 0) <= 0) return json({ error: "Insufficient credits" }, 402);

        // Parse input
        let imageInput: string | null = null;
        const ct = request.headers.get("content-type") ?? "";
        try {
          if (ct.includes("application/json")) {
            const body = (await request.json()) as { image_url?: string; image_base64?: string };
            if (body.image_url) imageInput = body.image_url;
            else if (body.image_base64) imageInput = `data:image/png;base64,${body.image_base64}`;
          } else if (ct.includes("multipart/form-data")) {
            const fd = await request.formData();
            const file = fd.get("image");
            if (file instanceof Blob) {
              const buf = new Uint8Array(await file.arrayBuffer());
              const b64 = btoa(String.fromCharCode(...buf));
              imageInput = `data:${file.type || "image/png"};base64,${b64}`;
            } else if (typeof fd.get("image_url") === "string") {
              imageInput = fd.get("image_url") as string;
            }
          }
        } catch (e) {
          return json({ error: "Invalid request body" }, 400);
        }
        if (!imageInput) return json({ error: "Provide image_url, image_base64, or multipart 'image'" }, 400);

        try {
          const original = await uploadToCloudinary(imageInput, `cutly/api/${keyRow.user_id}`);
          const { data: upload } = await supabaseAdmin
            .from("uploads")
            .insert({
              user_id: keyRow.user_id,
              original_url: original.secure_url,
              cloudinary_public_id: original.public_id,
              status: "processing",
              source: "api",
              api_key_id: keyRow.id,
              width: original.width,
              height: original.height,
              size_bytes: original.bytes,
            })
            .select("id")
            .single();

          const result = await removeBackground(original.secure_url);
          const out = await uploadToCloudinary(`data:image/png;base64,${result.base64}`, `cutly/api-results/${keyRow.user_id}`);

          await Promise.all([
            supabaseAdmin
              .from("uploads")
              .update({ result_url: out.secure_url, status: "completed", completed_at: new Date().toISOString() })
              .eq("id", upload!.id),
            supabaseAdmin.from("credits").insert({
              user_id: keyRow.user_id,
              delta: -1,
              reason: "usage",
              reference: upload!.id,
            }),
            supabaseAdmin
              .from("api_keys")
              .update({ request_count: keyRow.request_count + 1, last_used_at: new Date().toISOString() })
              .eq("id", keyRow.id),
          ]);

          return json({
            id: upload!.id,
            original_url: original.secure_url,
            result_url: out.secure_url,
            width: original.width,
            height: original.height,
          }, 200);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Processing failed";
          console.error("[api/remove-bg] failed", e);
          return json({ error: msg }, 500);
        }
      },
    },
  },
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CREDITS, defaultCreditsForPlan, NO_CREDITS_MESSAGE } from "@/lib/credits";

const inputSchema = z.object({
  imageDataUrl: z.string().min(10).max(15_000_000),
  filename: z.string().trim().min(1).max(255).optional(),
});

const saveUploadSchema = z.object({
  id: z.string().uuid().optional(),
  filename: z.string().nullable().optional(),
  original_url: z.string().min(1),
  result_url: z.string().nullable().optional(),
  status: z.enum(["queued", "processing", "completed", "failed"]).default("completed"),
  created_at: z.string().optional(),
  size_bytes: z.number().nullable().optional(),
  mime_type: z.string().nullable().optional(),
  processing_duration_ms: z.number().int().nonnegative().optional(),
});

export type UploadHistoryRow = {
  id: string;
  filename: string | null;
  original_url: string;
  result_url: string | null;
  status: string;
  created_at: string;
  size_bytes: number | null;
  processing_duration_ms: number | null;
  download_count: number;
};

export type HistoryAnalytics = {
  creditsRemaining: number;
  creditsUsed: number;
  creditsAllocated: number;
  totalProcessed: number;
  avgProcessingMs: number | null;
  totalDownloads: number;
};

function storeUrl(url: string, maxLen = 400_000): string {
  if (url.length <= maxLen) return url;
  if (url.startsWith("data:")) return "";
  return url.slice(0, maxLen);
}

function computeAnalytics(
  uploads: UploadHistoryRow[],
  creditsRemaining: number,
  plan: string | null | undefined,
): HistoryAnalytics {
  const completed = uploads.filter((u) => u.status === "completed");
  const durations = completed
    .map((u) => u.processing_duration_ms)
    .filter((ms): ms is number => ms != null && ms > 0);
  const avgProcessingMs =
    durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : null;
  const creditsUsed = completed.length;
  const creditsAllocated = Math.max(creditsRemaining + creditsUsed, defaultCreditsForPlan(plan));

  return {
    creditsRemaining,
    creditsUsed,
    creditsAllocated,
    totalProcessed: completed.length,
    avgProcessingMs,
    totalDownloads: uploads.reduce((sum, u) => sum + (u.download_count ?? 0), 0),
  };
}

export const processBackgroundRemoval = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI service not configured (LOVABLE_API_KEY missing)." };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          modalities: ["image", "text"],
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Remove the background from this image completely. Return ONLY the foreground subject on a fully transparent background as a PNG. Preserve all subject detail, edges, hair, and fine details. Do not add anything new.",
                },
                { type: "image_url", image_url: { url: data.imageDataUrl } },
              ],
            },
          ],
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("[bg-remove] gateway error", res.status, txt);
        if (res.status === 429) return { ok: false as const, error: "Rate limit reached. Please try again shortly." };
        if (res.status === 402) return { ok: false as const, error: "AI credits exhausted. Please add credits in Settings." };
        return { ok: false as const, error: `AI service error (${res.status}).` };
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }>;
      };
      const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (!url) {
        console.error("[bg-remove] no image in response", JSON.stringify(json).slice(0, 500));
        return { ok: false as const, error: "No image returned from AI." };
      }

      return {
        ok: true as const,
        uploadId: crypto.randomUUID(),
        originalUrl: data.imageDataUrl,
        resultUrl: url,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Processing failed";
      console.error("[bg-remove] failed", e);
      return { ok: false as const, error: msg };
    }
  });

export const saveUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => saveUploadSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context;
    const status = data.status ?? "completed";

    const { data: balance, error: balanceError } = await supabase.rpc("credit_balance", {
      _user_id: userId,
    });
    if (balanceError) {
      console.error("[saveUpload] balance error", balanceError);
      return { ok: false as const, error: "Could not verify credits." };
    }
    if (status === "completed" && Number(balance ?? 0) < 1) {
      return { ok: false as const, error: NO_CREDITS_MESSAGE };
    }

    const id = data.id ?? crypto.randomUUID();
    const now = new Date().toISOString();

    const row = {
      id,
      user_id: userId,
      filename: data.filename ?? null,
      original_url: storeUrl(data.original_url) || storeUrl(data.result_url ?? "") || "https://cutly.ai/placeholder",
      result_url: data.result_url ? storeUrl(data.result_url) : null,
      status,
      size_bytes: data.size_bytes ?? null,
      mime_type: data.mime_type ?? null,
      source: "web" as const,
      credits_used: 1,
      completed_at: status === "completed" ? now : null,
      processing_duration_ms: data.processing_duration_ms ?? null,
      download_count: 0,
    };

    const { error } = await supabase.from("uploads").upsert(row, { onConflict: "id" });

    if (error) {
      console.error("[saveUpload] db error", error);
      return { ok: false as const, error: error.message };
    }

    if (status === "completed") {
      const { error: deductError } = await supabase.from("credits").insert({
        user_id: userId,
        delta: -1,
        reason: "usage",
        reference: id,
      });
      if (deductError) {
        console.error("[saveUpload] deduct error", deductError);
        await supabase.from("uploads").delete().eq("id", id);
        return { ok: false as const, error: "Could not deduct credit. Try again." };
      }
    }

    return {
      ok: true as const,
      upload: {
        id,
        filename: row.filename,
        original_url: row.original_url,
        result_url: row.result_url,
        status: row.status,
        created_at: data.created_at ?? now,
        size_bytes: row.size_bytes,
        processing_duration_ms: row.processing_duration_ms,
        download_count: 0,
      } satisfies UploadHistoryRow,
    };
  });

export const renameUpload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ id: z.string().uuid(), filename: z.string().trim().min(1).max(255) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context;
    const { data: updated, error } = await supabase
      .from("uploads")
      .update({ filename: data.filename })
      .eq("id", data.id)
      .eq("user_id", userId)
      .select("id, filename")
      .maybeSingle();

    if (error) return { ok: false as const, error: error.message };
    if (!updated) return { ok: false as const, error: "Upload not found." };
    return { ok: true as const, filename: updated.filename };
  });

export const recordDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { userId, supabase } = context;

    const { data: row, error: fetchError } = await supabase
      .from("uploads")
      .select("download_count")
      .eq("id", data.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError || !row) {
      return { ok: false as const, error: "Upload not found." };
    }

    const next = (row.download_count ?? 0) + 1;
    const { error: updateError } = await supabase
      .from("uploads")
      .update({ download_count: next })
      .eq("id", data.id)
      .eq("user_id", userId);

    if (updateError) return { ok: false as const, error: updateError.message };
    return { ok: true as const, download_count: next };
  });

export const getDashboardSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId, supabase } = context;

    const { data: creditsData } = await supabase.from("credits").select("delta").eq("user_id", userId);

    const totalDeltas = (creditsData ?? []).reduce((acc, curr) => acc + (curr.delta ?? 0), 0);

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("plan, status, monthly_credits, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    const plan = sub?.plan ?? "free";
    const credits =
      creditsData && creditsData.length > 0 ? totalDeltas : defaultCreditsForPlan(plan);

    const { data: uploads, error: uploadsError } = await supabase
      .from("uploads")
      .select(
        "id, filename, original_url, result_url, status, created_at, size_bytes, processing_duration_ms, download_count",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    if (uploadsError) {
      console.error("[getDashboardSummary] uploads error", uploadsError);
    }

    const history: UploadHistoryRow[] = (uploads ?? []).map((u) => ({
      id: u.id,
      filename: u.filename,
      original_url: u.original_url,
      result_url: u.result_url,
      status: u.status,
      created_at: u.created_at,
      size_bytes: u.size_bytes,
      processing_duration_ms: u.processing_duration_ms,
      download_count: u.download_count ?? 0,
    }));

    const analytics = computeAnalytics(history, credits, plan);

    return {
      credits,
      uploads: history,
      analytics,
      subscription: sub as null | {
        plan: string;
        status: string;
        monthly_credits: number;
        current_period_end: string | null;
      },
    };
  });

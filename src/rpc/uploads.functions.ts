import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import fs from "fs";
import path from "path";


const inputSchema = z.object({
  imageDataUrl: z.string().min(10).max(15_000_000),
  filename: z.string().trim().min(1).max(255).optional(),
});

// Public background removal via Lovable AI Gateway (Gemini image edit).
// No Cloudinary / external storage required — returns a base64 PNG data URL.
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

const inMemoryUploads: Array<{
  id: string;
  filename: string | null;
  original_url: string;
  result_url: string | null;
  status: string;
  created_at: string;
  size_bytes: number | null;
}> = [];

export const saveUpload = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as typeof inMemoryUploads[0])
  .handler(async ({ data }) => {
    inMemoryUploads.unshift(data);
    // Keep max 50 recent items to avoid memory bloat
    if (inMemoryUploads.length > 50) {
      inMemoryUploads.pop();
    }
    
    // Save the image to the local filesystem
    try {
      const outputDir = path.join(process.cwd(), "processed_images");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      if (data.result_url) {
        let ext = data.filename ? path.extname(data.filename) : ".png";
        if (!ext) ext = ".png";
        
        // Remove existing extension from filename to append proper suffix
        const baseName = data.filename ? path.basename(data.filename, ext) : "image";
        const fileName = `${baseName}_bg_removed_${data.id.slice(0,6)}${ext}`;
        const filePath = path.join(outputDir, fileName);

        if (data.result_url.startsWith("data:image")) {
          // It's a base64 string
          const base64Data = data.result_url.replace(/^data:image\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          fs.writeFileSync(filePath, buffer);
        } else if (data.result_url.startsWith("http")) {
          // It's a URL (e.g. from webhook)
          const res = await fetch(data.result_url);
          if (res.ok) {
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fs.writeFileSync(filePath, buffer);
          }
        }
      }
    } catch (err) {
      console.error("[bg-remove] Failed to write image to local folder", err);
    }

    return { ok: true };
  });

export const getDashboardSummary = createServerFn({ method: "GET" })
  .handler(async () => {
    return {
      credits: 999,
      uploads: inMemoryUploads,
      subscription: null as null | { plan: string; status: string; monthly_credits: number; current_period_end: string | null },
    };
  });

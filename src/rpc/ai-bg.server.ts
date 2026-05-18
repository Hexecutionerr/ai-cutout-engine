// AI background-removal provider abstraction.
// Default: remove.bg API. Swap providers by setting AI_BG_PROVIDER.
// All keys are placeholders — set them via Lovable Cloud secrets.

export interface BgRemovalResult {
  /** PNG as base64 (no data URI prefix). */
  base64: string;
  /** Optional credits charged by the provider. */
  providerCredits?: number;
}

const PROVIDER = process.env.AI_BG_PROVIDER ?? "remove_bg"; // remove_bg | clipdrop | photoroom

export async function removeBackground(imageUrl: string): Promise<BgRemovalResult> {
  switch (PROVIDER) {
    case "clipdrop":
      return removeBgClipdrop(imageUrl);
    case "photoroom":
      return removeBgPhotoroom(imageUrl);
    default:
      return removeBgRemoveBg(imageUrl);
  }
}

async function removeBgRemoveBg(imageUrl: string): Promise<BgRemovalResult> {
  const key = process.env.REMOVE_BG_API_KEY;
  if (!key) throw new Error("REMOVE_BG_API_KEY not configured");

  const form = new FormData();
  form.append("image_url", imageUrl);
  form.append("size", "auto");
  form.append("format", "png");

  const res = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": key },
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`remove.bg failed [${res.status}]: ${txt}`);
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  const credits = Number(res.headers.get("x-credits-charged") ?? 1);
  return { base64: bytesToBase64(buf), providerCredits: credits };
}

async function removeBgClipdrop(imageUrl: string): Promise<BgRemovalResult> {
  const key = process.env.CLIPDROP_API_KEY;
  if (!key) throw new Error("CLIPDROP_API_KEY not configured");
  const img = await fetch(imageUrl).then((r) => r.blob());
  const form = new FormData();
  form.append("image_file", img);
  const res = await fetch("https://clipdrop-api.co/remove-background/v1", {
    method: "POST",
    headers: { "x-api-key": key },
    body: form,
  });
  if (!res.ok) throw new Error(`Clipdrop failed [${res.status}]: ${await res.text()}`);
  return { base64: bytesToBase64(new Uint8Array(await res.arrayBuffer())) };
}

async function removeBgPhotoroom(imageUrl: string): Promise<BgRemovalResult> {
  const key = process.env.PHOTOROOM_API_KEY;
  if (!key) throw new Error("PHOTOROOM_API_KEY not configured");
  const res = await fetch("https://sdk.photoroom.com/v1/segment", {
    method: "POST",
    headers: { "x-api-key": key, "Content-Type": "application/json" },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!res.ok) throw new Error(`Photoroom failed [${res.status}]: ${await res.text()}`);
  return { base64: bytesToBase64(new Uint8Array(await res.arrayBuffer())) };
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  // btoa exists in Workers + browsers
  return btoa(bin);
}

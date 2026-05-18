// Cloudinary upload helper (server-only).
// Uses unsigned upload preset OR signed upload via API secret.
// All env vars are placeholders until configured.

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ?? "";
const API_KEY = process.env.CLOUDINARY_API_KEY ?? "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET ?? "";
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET ?? "cutly_unsigned";

export interface CloudinaryAsset {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

export async function uploadToCloudinary(
  file: Blob | string,
  folder = "cutly/uploads",
): Promise<CloudinaryAsset> {
  if (!CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME not configured");
  }

  const form = new FormData();
  if (typeof file === "string") {
    form.append("file", file); // data URI or remote URL
  } else {
    form.append("file", file);
  }
  form.append("folder", folder);

  // Prefer signed upload when API secret is available
  if (API_KEY && API_SECRET) {
    const timestamp = Math.floor(Date.now() / 1000);
    const toSign = `folder=${folder}&timestamp=${timestamp}${API_SECRET}`;
    const sig = await sha1Hex(toSign);
    form.append("api_key", API_KEY);
    form.append("timestamp", String(timestamp));
    form.append("signature", sig);
  } else {
    form.append("upload_preset", UPLOAD_PRESET);
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cloudinary upload failed [${res.status}]: ${txt}`);
  }
  return (await res.json()) as CloudinaryAsset;
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return;
  const timestamp = Math.floor(Date.now() / 1000);
  const toSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const sig = await sha1Hex(toSign);
  const form = new FormData();
  form.append("public_id", publicId);
  form.append("api_key", API_KEY);
  form.append("timestamp", String(timestamp));
  form.append("signature", sig);
  await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
    { method: "POST", body: form },
  );
}

async function sha1Hex(str: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

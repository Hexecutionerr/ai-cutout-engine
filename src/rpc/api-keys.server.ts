// API-key helpers (server-only). Generates random keys and sha256 hashes.

export interface GeneratedApiKey {
  /** Full key shown once to the user. */
  raw: string;
  /** First 12 chars stored as plaintext for display. */
  prefix: string;
  /** sha256(raw) hex — what we persist & lookup. */
  hash: string;
}

export async function generateApiKey(env: "live" | "test" = "live"): Promise<GeneratedApiKey> {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  const body = bytesToBase64Url(bytes);
  const raw = `ck_${env}_${body}`;
  const prefix = raw.slice(0, 12);
  const hash = await sha256Hex(raw);
  return { raw, prefix, hash };
}

export async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

import type { UploadRow } from "@/lib/local-db";
import type { UploadHistoryRow } from "@/rpc/uploads.functions";

export function mapServerUploads(uploads: UploadHistoryRow[]): UploadRow[] {
  return uploads.map((u) => ({
    id: u.id,
    filename: u.filename,
    original_url: u.original_url,
    result_url: u.result_url,
    status: u.status,
    created_at: u.created_at,
    size_bytes: u.size_bytes,
    processing_duration_ms: u.processing_duration_ms,
    download_count: u.download_count,
  }));
}

export function mergeUploadHistory(server: UploadRow[], local: UploadRow[]): UploadRow[] {
  const byId = new Map<string, UploadRow>();
  for (const u of server) byId.set(u.id, u);
  for (const u of local) {
    const existing = byId.get(u.id);
    if (!existing) {
      byId.set(u.id, u);
      continue;
    }
    byId.set(u.id, {
      ...existing,
      ...u,
      download_count: Math.max(existing.download_count ?? 0, u.download_count ?? 0),
      processing_duration_ms: u.processing_duration_ms ?? existing.processing_duration_ms,
    });
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

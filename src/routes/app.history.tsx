import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Wallet, Timer, Download, Search, Filter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuthServerFn } from "@/hooks/useAuthServerFn";
import {
  getDashboardSummary,
  renameUpload,
  recordDownload,
  type HistoryAnalytics,
} from "@/rpc/uploads.functions";
import { getUploadsLocal, saveUploadLocal, type UploadRow } from "@/lib/local-db";
import { mapServerUploads, mergeUploadHistory } from "@/lib/upload-history";
import { useAuth } from "@/hooks/useAuth";
import { HistoryUploadCard } from "@/components/history/HistoryUploadCard";
import { formatDurationMs } from "@/lib/format-duration";
import { toast } from "sonner";

export const Route = createFileRoute("/app/history")({
  head: () => ({ meta: [{ title: "History — Cutly AI" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { user } = useAuth();
  const summaryFn = useAuthServerFn(getDashboardSummary);
  const renameFn = useAuthServerFn(renameUpload);
  const downloadFn = useAuthServerFn(recordDownload);
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [analytics, setAnalytics] = useState<HistoryAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const refresh = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      const s = await summaryFn();
      const serverRows = s?.uploads ? mapServerUploads(s.uploads) : [];
      const localRows = await getUploadsLocal(user.id);
      setUploads(mergeUploadHistory(serverRows, localRows));
      if (s?.analytics) setAnalytics(s.analytics);
      for (const u of serverRows) {
        saveUploadLocal({ ...u, user_id: user.id }, user.id).catch(console.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [user?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return uploads;
    return uploads.filter((u) => (u.filename ?? "").toLowerCase().includes(q));
  }, [uploads, query]);

  const handleDownload = async (row: UploadRow) => {
    if (!row.result_url) return;
    try {
      const response = await fetch(row.result_url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = row.filename || "cutly_bg_removed.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);

      const res = await downloadFn({ id: row.id });
      if (res && typeof res === "object" && "ok" in res && res.ok && "download_count" in res) {
        const count = res.download_count as number;
        setUploads((prev) =>
          prev.map((u) => (u.id === row.id ? { ...u, download_count: count } : u)),
        );
        if (user?.id) {
          saveUploadLocal({ ...row, download_count: count }, user.id).catch(console.error);
        }
      }
    } catch {
      window.open(row.result_url, "_blank");
    }
  };

  const handleRename = async (id: string, filename: string): Promise<boolean> => {
    try {
      const res = await renameFn({ id, filename });
      if (res && typeof res === "object" && "ok" in res && res.ok) {
        setUploads((prev) => prev.map((u) => (u.id === id ? { ...u, filename } : u)));
        if (user?.id) {
          const row = uploads.find((u) => u.id === id);
          if (row) saveUploadLocal({ ...row, filename }, user.id).catch(console.error);
        }
        toast.success("Renamed");
        return true;
      }
      toast.error("error" in (res as object) ? String((res as { error?: string }).error) : "Rename failed");
      return false;
    } catch {
      toast.error("Rename failed");
      return false;
    }
  };

  const creditPct =
    analytics && analytics.creditsAllocated > 0
      ? Math.min(100, Math.round((analytics.creditsUsed / analytics.creditsAllocated) * 100))
      : 0;

  const timeSavedHours =
    analytics?.avgProcessingMs && analytics.totalProcessed > 0
      ? ((analytics.avgProcessingMs * analytics.totalProcessed * 44) / 3_600_000).toFixed(1)
      : "0";

  return (
    <div className="min-h-screen space-y-12 p-6 lg:p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Upload History</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Rename files, track processing time, and download counts for every cutout.
          </p>
        </div>
        <span className="glass-card flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
          {analytics ? `${analytics.creditsRemaining} credits left` : "Loading…"}
        </span>
      </header>

      <section className="glass-card rounded-2xl p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full gap-2 md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary"
                placeholder="Search by filename…"
              />
            </div>
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5" disabled>
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4" />
            ))
          ) : filtered.length > 0 ? (
            filtered.map((row) => (
              <HistoryUploadCard key={row.id} row={row} onDownload={handleDownload} onRename={handleRename} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center py-16 text-center text-muted-foreground">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <Search className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-white">
                {query ? "No matches for your search" : "No history found"}
              </p>
              <p className="mt-1 text-sm">Images you process in Workspace will appear here.</p>
            </div>
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-muted-foreground">
            <span>
              Showing {filtered.length} of {uploads.length} processed images
            </span>
          </div>
        )}
      </section>

      <div className="pt-4">
        <h2 className="mb-6 px-1 font-display text-2xl font-bold">Analytics Overview</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            label="Credit Usage"
            value={String(analytics?.creditsUsed ?? 0)}
            sub={`/ ${analytics?.creditsAllocated ?? "—"}`}
            pct={creditPct}
            icon={Wallet}
            hint={
              analytics
                ? `${analytics.creditsRemaining} remaining · ${analytics.creditsUsed} used`
                : "Loading your account…"
            }
          />
          <StatCard
            label="Images Processed"
            value={String(analytics?.totalProcessed ?? 0)}
            icon={Timer}
            hint={
              analytics?.avgProcessingMs
                ? `Avg process time: ${formatDurationMs(analytics.avgProcessingMs)}`
                : "Process an image to see timing stats"
            }
          />
          <StatCard
            label="Total Downloads"
            value={String(analytics?.totalDownloads ?? 0)}
            sub="times"
            icon={Download}
            hint={`Est. time saved: ~${timeSavedHours} hrs vs manual masking`}
            accentCyan
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  pct,
  icon: Icon,
  hint,
  accentCyan,
}: {
  label: string;
  value: string;
  sub?: string;
  pct?: number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  accentCyan?: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <p className={accentCyan ? "text-sm font-medium text-cyan" : "text-sm font-medium"}>{label}</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-cyan">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold">{value}</span>
        {sub && <span className="text-sm text-muted-foreground">{sub}</span>}
      </div>
      {pct !== undefined && pct > 0 && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan" style={{ width: `${pct}%` }} />
        </div>
      )}
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}


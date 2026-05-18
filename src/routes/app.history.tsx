import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Wallet, Terminal, Zap, Search, Filter, Download, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardSummary } from "@/rpc/uploads.functions";

import { getUploadsLocal, type UploadRow } from "@/lib/local-db";

export const Route = createFileRoute("/app/history")({
  head: () => ({ meta: [{ title: "History — Cutly AI" }] }),
  component: HistoryPage,
});


function HistoryPage() {
  const summaryFn = useServerFn(getDashboardSummary);
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const s = await summaryFn();
      
      const localUploads = await getUploadsLocal();
      const merged = [...localUploads];
      const localIds = new Set(localUploads.map(u => u.id));
      for (const u of s.uploads as UploadRow[]) {
        if (!localIds.has(u.id)) {
          merged.push(u);
        }
      }
      merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setUploads(merged);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      // Fetching the image as a blob forces the browser to download it locally
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || "cutly_bg_removed.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback to opening in a new tab if fetch fails due to CORS
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-8 space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Upload History</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage, view, and download your processed background-removed assets.
          </p>
        </div>
        <span className="glass-card flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
          API Online
        </span>
      </header>

      <section className="glass-card rounded-2xl p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary transition-colors" placeholder="Search by filename…" />
            </div>
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
              <Filter className="mr-2 h-4 w-4" />Filter
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-4 h-64" />
            ))
          ) : uploads.length > 0 ? (
            uploads.map((row) => (
              <div key={row.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/20">
                <div className="checker-bg relative aspect-square overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                  <img 
                    src={row.result_url || row.original_url} 
                    alt={row.filename || "Uploaded image"} 
                    className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center gap-3 backdrop-blur-sm">
                    {row.result_url && (
                      <Button onClick={() => handleDownload(row.result_url!, row.filename!)} size="sm" className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
                        <Download className="mr-2 h-4 w-4" /> Download
                      </Button>
                    )}
                    <Button asChild size="icon" variant="outline" className="rounded-full bg-black/50 border-white/20 text-white hover:bg-white hover:text-black transition-colors">
                      <a href={row.original_url} target="_blank" rel="noreferrer" title="View Original">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <span className={`absolute left-3 top-3 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-widest backdrop-blur-md ${
                    row.status === "completed" 
                      ? "border-success/40 bg-success/20 text-success"
                      : "border-cyan/40 bg-cyan/20 text-cyan"
                  }`}>
                    {row.status}
                  </span>
                </div>
                <div className="p-4 border-t border-white/5">
                  <p className="truncate text-sm font-medium" title={row.filename || "Untitled"}>
                    {row.filename || "Untitled"}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(row.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    {row.size_bytes && <span>{(row.size_bytes / 1024 / 1024).toFixed(2)} MB</span>}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center text-muted-foreground flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-base font-medium text-white">No history found</p>
              <p className="text-sm mt-1">Images you process will appear here.</p>
            </div>
          )}
        </div>

        {!loading && uploads.length > 0 && (
          <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground border-t border-white/10 pt-4">
            <span>Showing {uploads.length} processed images</span>
            <div className="flex gap-1">
              <button className="rounded-lg p-2 hover:bg-white/5 transition-colors"><ChevronLeft className="h-4 w-4" /></button>
              <button className="rounded-lg p-2 hover:bg-white/5 transition-colors"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </section>

      <div className="pt-4">
        <h2 className="font-display text-2xl font-bold mb-6 px-1">Analytics Overview</h2>
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard label="Credit Usage" value="842" sub="/ 1000" pct={84} icon={Wallet} hint="84% Used · Renews in 12 days" />
          <StatCard label="API Requests" value="12,402" trend="+14% from last week" icon={Terminal}>
            <Bars />
          </StatCard>
          <StatCard label="Time Saved" value="42.5" sub="hrs" icon={Zap} hint="AI processing is 45x faster than manual masking." accentCyan />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label, value, sub, pct, icon: Icon, hint, trend, accentCyan, children,
}: {
  label: string; value: string; sub?: string; pct?: number; icon: React.ComponentType<{className?: string}>; hint?: string; trend?: string; accentCyan?: boolean; children?: React.ReactNode;
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
      {pct !== undefined && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan" style={{ width: `${pct}%` }} />
        </div>
      )}
      {children && <div className="mt-3">{children}</div>}
      {hint && <p className="mt-3 text-xs text-muted-foreground">{hint}</p>}
      {trend && <p className="mt-2 text-xs font-semibold text-cyan">↗ {trend}</p>}
    </div>
  );
}

function Bars() {
  const data = [40, 30, 55, 35, 65, 50, 80];
  return (
    <div className="flex h-16 items-end gap-1.5">
      {data.map((h, i) => (
        <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-cyan/20 to-cyan/80" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

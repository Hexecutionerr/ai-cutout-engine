import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { UploadCloud, Settings2, Download, Sparkles, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { processBackgroundRemoval, getDashboardSummary, saveUpload } from "@/rpc/uploads.functions";
import { toast } from "sonner";
import { removeBackground } from "@imgly/background-removal";

import { saveUploadLocal, getUploadsLocal, type UploadRow } from "@/lib/local-db";

export const Route = createFileRoute("/app/workspace")({
  head: () => ({ meta: [{ title: "Workspace — Cutly AI" }] }),
  component: WorkspacePage,
});


function WorkspacePage() {
  const processFn = useServerFn(processBackgroundRemoval);
  const summaryFn = useServerFn(getDashboardSummary);
  const saveUploadFn = useServerFn(saveUpload);
  const inputRef = useRef<HTMLInputElement>(null);
  const [credits, setCredits] = useState(0);
  const [uploads, setUploads] = useState<UploadRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<{ original: string; result: string | null; filename: string } | null>(null);

  const refresh = async () => {
    try {
      const s = await summaryFn();
      setCredits(s.credits);
      
      const localUploads = await getUploadsLocal();
      const merged = [...localUploads];
      const localIds = new Set(localUploads.map(u => u.id));
      for (const u of s.uploads as UploadRow[]) {
        if (!localIds.has(u.id)) {
          merged.push(u);
          saveUploadLocal(u).catch(console.error); // sync to local
        }
      }
      merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setUploads(merged);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { refresh(); }, []);

  const handleFile = async (file: File) => {
    if (file.size > 15 * 1024 * 1024) { toast.error("Max file size is 15 MB"); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setBusy(true);
      setActive({ original: dataUrl, result: null, filename: file.name });
      try {
        let resultUrl = "";
        // Send image to webhook in binary format
        try {
          const res = await fetch("https://rock123.app.n8n.cloud/webhook/Remove-Background", {
            method: "POST",
            body: file,
            headers: {
              "Content-Type": file.type || "application/octet-stream"
            }
          });
          
          if (!res.ok) {
             throw new Error(`Webhook responded with status: ${res.status}`);
          }
          
          const data = await res.json();
          resultUrl = data.url;
        } catch (webhookErr) {
          console.error("Failed to process via webhook, falling back to local processing:", webhookErr);
          const blob = await removeBackground(file);
          const base64 = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result as string);
            r.onerror = reject;
            r.readAsDataURL(blob);
          });
          resultUrl = base64;
        }

        setActive({ original: dataUrl, result: resultUrl, filename: file.name });
        
        const newUpload: UploadRow = {
          id: crypto.randomUUID(),
          filename: file.name,
          original_url: dataUrl,
          result_url: resultUrl,
          status: "completed",
          created_at: new Date().toISOString(),
          size_bytes: file.size
        };

        setUploads(prev => [newUpload, ...prev]);
        saveUploadLocal(newUpload).catch(err => console.error("Failed to save to local DB", err));
        saveUploadFn({ data: newUpload }).catch(err => console.error("Failed to save to history", err));
        
        toast.success("Background removed successfully");
      } catch (e) { toast.error(e instanceof Error ? e.message : "Failed to remove background"); }
      finally { setBusy(false); }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <header className="flex items-center justify-between">
        <div className="glass-card flex items-center gap-2 rounded-full px-4 py-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold">{credits.toLocaleString()}</span>
          <span className="text-muted-foreground">Credits Remaining</span>
        </div>
        {/* Sign out hidden — public access mode */}
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="font-display text-4xl font-bold">Workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">Upload images to remove backgrounds with 99.9% precision using Cutly AI.</p>

          {active && (
            <div className="glass-card mt-6 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5"><Sparkles className="h-4 w-4 text-cyan" /></div>
                  <p className="text-sm font-medium">{active.filename}</p>
                </div>
                <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${busy ? "border-cyan/40 bg-cyan/10 text-cyan" : "border-success/40 bg-success/10 text-success"}`}>{busy ? "Processing" : "Done"}</span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900">
                  <img src={active.original} alt="original" className="h-full w-full object-contain" />
                  <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest">Original</span>
                </div>
                <div className="checker-bg relative flex aspect-square items-end overflow-hidden rounded-xl border border-white/10">
                  {active.result ? <img src={active.result} alt="result" className="h-full w-full object-contain" /> : (
                    <div className="m-4 w-full"><div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"><div className="shimmer-bar h-full w-2/3 rounded-full" /></div><p className="mt-2 text-center text-xs text-muted-foreground">Removing background…</p></div>
                  )}
                  <span className="absolute left-3 top-3 rounded bg-primary/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground">AI Predicted</span>
                </div>
              </div>
              {active.result && (
                <div className="mt-5 flex justify-center">
                  <Button asChild className="btn-glow rounded-lg"><a href={active.result} download target="_blank" rel="noreferrer"><Download className="mr-2 h-4 w-4" />Download High Res</a></Button>
                </div>
              )}
            </div>
          )}

          <div onClick={() => inputRef.current?.click()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }} className="glass-card mt-6 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 px-6 py-16 text-center hover:border-primary/50">
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5"><UploadCloud className="h-6 w-6 text-muted-foreground" /></div>
            <p className="mt-4 font-display text-lg font-semibold">Drag &amp; drop new assets</p>
            <p className="mt-1 text-xs text-muted-foreground">Supports PNG, JPG, WEBP. Up to 15 MB per file.</p>
            <p className="mt-4 text-sm"><span className="text-primary hover:underline">Browse files</span></p>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl border-white/10 bg-white/5"><Settings2 className="mr-2 h-4 w-4" />Batch Settings</Button>
            <Button variant="outline" className="flex-1 rounded-xl border-white/10 bg-white/5"><Download className="mr-2 h-4 w-4" />Export All</Button>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Credits</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold">{credits.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">remaining</span>
            </div>
            <Button asChild variant="outline" className="mt-4 w-full rounded-xl border-white/10 bg-white/5"><Link to="/app/billing">Upgrade Plan</Link></Button>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Recent Activity</p>
              <Link to="/app/history" className="text-[10px] font-semibold uppercase tracking-widest text-primary">View All</Link>
            </div>
            <ul className="mt-4 space-y-3">
              {uploads.slice(0, 5).map((u) => (
                <li key={u.id} className="flex items-center gap-3">
                  <img src={u.result_url ?? u.original_url} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover bg-gradient-to-br from-slate-700 to-slate-900" />
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{u.filename ?? "Untitled"}</p><p className="text-[11px] text-muted-foreground">{new Date(u.created_at).toLocaleString()}</p></div>
                </li>
              ))}
              {uploads.length === 0 && <li className="text-xs text-muted-foreground">No uploads yet.</li>}
            </ul>
          </div>

          <div className="gradient-border rounded-2xl p-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan">Pro Tip</p>
            <p className="mt-2 text-sm">Use our <span className="text-cyan">Batch API</span> to process up to 1,000 images per minute via command line.</p>
            <Link to="/api-docs" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">Read API Docs →</Link>
          </div>
        </aside>
      </div>

      <button onClick={() => inputRef.current?.click()} className="fixed bottom-8 right-8 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan to-purple shadow-[0_0_28px_var(--brand-purple)]"><Plus className="h-5 w-5 text-background" /></button>
    </div>
  );
}

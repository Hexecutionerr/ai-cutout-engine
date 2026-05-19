import { Button } from "@/components/ui/button";
import { formatDurationMs } from "@/lib/format-duration";
import type { UploadRow } from "@/lib/local-db";
import { Download, ExternalLink, Pencil, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  row: UploadRow;
  onDownload: (row: UploadRow) => void;
  onRename: (id: string, filename: string) => Promise<boolean>;
};

export function HistoryUploadCard({ row, onDownload, onRename }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(row.filename ?? "Untitled");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(row.filename ?? "Untitled");
  }, [row.id, row.filename]);

  const saveName = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setName(row.filename ?? "Untitled");
      setEditing(false);
      return;
    }
    if (trimmed === (row.filename ?? "Untitled")) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const ok = await onRename(row.id, trimmed);
    setSaving(false);
    if (ok) setEditing(false);
    else setName(row.filename ?? "Untitled");
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/20">
      <div className="checker-bg relative aspect-square overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
        <img
          src={row.result_url || row.original_url}
          alt={row.filename || "Uploaded image"}
          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          {row.result_url && (
            <Button
              onClick={() => onDownload(row)}
              size="sm"
              className="rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          )}
          <Button
            asChild
            size="icon"
            variant="outline"
            className="rounded-full border-white/20 bg-black/50 text-white transition-colors hover:bg-white hover:text-black"
          >
            <a href={row.original_url} target="_blank" rel="noreferrer" title="View original">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <span
          className={`absolute left-3 top-3 rounded-md border px-2 py-1 text-[9px] font-semibold uppercase tracking-widest backdrop-blur-md ${
            row.status === "completed"
              ? "border-success/40 bg-success/20 text-success"
              : "border-cyan/40 bg-cyan/20 text-cyan"
          }`}
        >
          {row.status}
        </span>
      </div>

      <div className="border-t border-white/5 p-4">
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void saveName();
                if (e.key === "Escape") {
                  setName(row.filename ?? "Untitled");
                  setEditing(false);
                }
              }}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm outline-none focus:border-primary"
              autoFocus
              disabled={saving}
            />
            <button type="button" onClick={() => void saveName()} className="rounded-lg p-1.5 text-success hover:bg-white/5" aria-label="Save name">
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setName(row.filename ?? "Untitled");
                setEditing(false);
              }}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex w-full items-center gap-2 text-left text-sm font-medium hover:text-primary"
            title="Click to rename"
          >
            <span className="truncate">{row.filename || "Untitled"}</span>
            <Pencil className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-60" />
          </button>
        )}

        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>
              {new Date(row.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {row.size_bytes != null && <span>{(row.size_bytes / 1024 / 1024).toFixed(2)} MB</span>}
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span>Process: {formatDurationMs(row.processing_duration_ms)}</span>
            <span>Downloads: {row.download_count ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

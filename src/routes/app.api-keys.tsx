import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Copy, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/api-keys")({
  head: () => ({ meta: [{ title: "API Keys — Cutly AI" }] }),
  component: ApiKeysPage,
});

const KEYS = [
  { name: "Production", key: "ck_live_8j3k••••••••••••••••••••••••sd29", created: "Apr 12, 2026", usage: "8,402 reqs", env: "live" },
  { name: "Staging", key: "ck_test_2m5n••••••••••••••••••••••••pq11", created: "Mar 04, 2026", usage: "1,124 reqs", env: "test" },
];

function ApiKeysPage() {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">API Keys</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Generate and manage keys to integrate Cutly AI into your applications.
          </p>
        </div>
        <Button className="btn-glow rounded-xl"><Plus className="mr-2 h-4 w-4" />Create new key</Button>
      </header>

      <div className="glass-card mt-8 overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr className="border-b border-white/5">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Key</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Usage</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {KEYS.map((k) => (
              <tr key={k.name} className="border-b border-white/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{k.name}</span>
                    <span className={
                      k.env === "live"
                        ? "rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary"
                        : "rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
                    }>
                      {k.env}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {revealed[k.name] ? k.key.replace(/•+/, "secret_revealed_xxxxx") : k.key}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{k.created}</td>
                <td className="px-6 py-4">{k.usage}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setRevealed((r) => ({ ...r, [k.name]: !r[k.name] }))} className="rounded-lg p-2 hover:bg-white/5">
                      {revealed[k.name] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button className="rounded-lg p-2 hover:bg-white/5"><Copy className="h-4 w-4" /></button>
                    <button className="rounded-lg p-2 text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="gradient-border mt-8 rounded-2xl p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan">Quick Start</p>
        <pre className="mt-3 overflow-x-auto rounded-xl bg-black/40 p-4 text-xs">
{`curl https://api.cutly.ai/v1/images/remove-background \\
  -H "Authorization: Bearer $CUTLY_API_KEY" \\
  -F "image=@product.jpg"`}
        </pre>
      </div>
    </div>
  );
}

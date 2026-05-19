import { createFileRoute } from "@tanstack/react-router";
import { Users, DollarSign, Activity, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthServerFn } from "@/hooks/useAuthServerFn";
import { getAdminMetrics } from "@/rpc/admin.functions";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin — Cutly AI" }] }),
  component: AdminPage,
});

type Metrics = {
  totalUsers: number;
  uploads24h: number;
  failed24h: number;
  mrrInr: number;
  recentUsers: Array<{ email: string | null; full_name: string | null; created_at: string }>;
};

function AdminPage() {
  const metricsFn = useAuthServerFn(getAdminMetrics);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    metricsFn()
      .then((data) => {
        if (data) setMetrics(data as Metrics);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load admin data"))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      icon: Users,
      label: "Total Users",
      value: loading ? "…" : (metrics?.totalUsers ?? 0).toLocaleString(),
      sub: loading ? "" : `${metrics?.uploads24h ?? 0} uploads (24h)`,
    },
    {
      icon: DollarSign,
      label: "Revenue (30d)",
      value: loading ? "…" : `₹${(metrics?.mrrInr ?? 0).toLocaleString("en-IN")}`,
      sub: "Captured payments",
    },
    {
      icon: Activity,
      label: "Uploads / 24h",
      value: loading ? "…" : (metrics?.uploads24h ?? 0).toLocaleString(),
      sub: "All users",
    },
    {
      icon: AlertTriangle,
      label: "Failed Jobs",
      value: loading ? "…" : String(metrics?.failed24h ?? 0),
      sub: "Last 24 hours",
    },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Live data from your Supabase project.</p>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((m) => (
          <div key={m.label} className="glass-card rounded-2xl p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <m.icon className="h-4 w-4" />
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">{m.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{m.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </div>

      <section className="glass-card mt-8 rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Recent signups</h2>
        <ul className="mt-4 space-y-3">
          {loading && <li className="text-sm text-muted-foreground">Loading…</li>}
          {!loading && (metrics?.recentUsers?.length ?? 0) === 0 && (
            <li className="text-sm text-muted-foreground">No users yet.</li>
          )}
          {(metrics?.recentUsers ?? []).map((u) => (
            <li key={u.email ?? u.created_at} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
              <div>
                <p className="text-sm font-medium">{u.full_name || "—"}</p>
                <p className="text-xs text-muted-foreground">{u.email ?? "—"}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(u.created_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}


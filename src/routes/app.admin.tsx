import { createFileRoute } from "@tanstack/react-router";
import { Users, DollarSign, Activity, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/admin")({
  head: () => ({ meta: [{ title: "Admin — Cutly AI" }] }),
  component: AdminPage,
});

function AdminPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Real-time platform health and revenue.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: "Total Users", value: "10,482", sub: "+248 this week" },
          { icon: DollarSign, label: "MRR", value: "₹14.2L", sub: "+9.4% MoM" },
          { icon: Activity, label: "Workflows / 24h", value: "184,209", sub: "99.97% success" },
          { icon: AlertTriangle, label: "Failed Jobs", value: "42", sub: "Last 24h" },
        ].map((m) => (
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

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">Recent Users</h2>
          <ul className="mt-4 space-y-3">
            {["alex@studio.io", "marcus@frame.ai", "sarah@pixl.co", "david.miller@me.com"].map((e, i) => (
              <li key={e} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan to-purple" />
                  <div>
                    <p className="text-sm font-medium">{e}</p>
                    <p className="text-xs text-muted-foreground">{i === 0 ? "Pro" : i === 1 ? "Business" : "Free"}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{i + 2}h ago</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="glass-card rounded-2xl p-6">
          <h2 className="font-display text-xl font-semibold">AI Provider Health</h2>
          <ul className="mt-4 space-y-3">
            {[
              { name: "Remove.bg", uptime: "99.99%", state: "Healthy" },
              { name: "ClipDrop", uptime: "99.92%", state: "Healthy" },
              { name: "Photoroom", uptime: "98.10%", state: "Degraded" },
            ].map((p) => (
              <li key={p.name} className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Uptime {p.uptime}</p>
                </div>
                <span className={
                  p.state === "Healthy"
                    ? "rounded-md border border-success/40 bg-success/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-success"
                    : "rounded-md border border-destructive/40 bg-destructive/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-destructive"
                }>
                  • {p.state}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

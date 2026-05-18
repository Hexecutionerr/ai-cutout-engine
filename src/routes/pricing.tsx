import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Check, Zap, Sparkles, Plug } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Cutly AI" },
      { name: "description", content: "High-performance AI for high-velocity teams. Simple, transparent pricing for one image or one million." },
      { property: "og:title", content: "Cutly AI Pricing" },
      { property: "og:description", content: "Free, Pro, Credits and Enterprise plans for every workflow." },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  {
    label: "STARTER",
    name: "Free",
    price: "₹0",
    sub: "forever",
    desc: "Perfect for personal projects and exploring the AI capabilities.",
    cta: "Start Free",
    to: "/register" as const,
    features: ["5 credits per month", "Standard resolution", "Web dashboard access"],
  },
  {
    label: "SUBSCRIPTION",
    name: "Pro",
    price: "₹99",
    sub: "/month",
    desc: "Built for professional creators who need high-volume, HD output.",
    cta: "Get Pro Access",
    to: "/register" as const,
    popular: true,
    features: [
      "200 credits per month",
      "4K Resolution Support",
      "Batch processing (up to 50)",
      "Priority AI queue",
    ],
  },
  {
    label: "PAY AS YOU GO",
    name: "Credits",
    price: "₹29",
    sub: "/50 credits",
    desc: "Credits never expire. Top up whenever your workflow demands it.",
    cta: "Buy Credits",
    to: "/register" as const,
    features: ["No monthly commitment", "Full API access included", "All resolution sizes"],
  },
  {
    label: "FOR DEVELOPERS",
    name: "Enterprise",
    price: "Custom",
    sub: "",
    desc: "Scale your app with our robust API and high-concurrency engine.",
    cta: "Contact Sales",
    to: "/contact" as const,
    features: [
      "Unlimited concurrent requests",
      "Custom SLA & dedicated support",
      "White-label licensing",
      "On-premise deployment options",
    ],
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="mx-auto max-w-7xl px-6 pt-20 text-center">
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
          Pricing built for precision
        </span>
        <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">
          High-performance AI for
          <br />
          high-velocity teams.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
          Simple, transparent pricing whether you're processing one image or one million.
          Choose the plan that fits your production scale.
        </p>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-5 px-6 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={
              p.popular
                ? "gradient-border relative rounded-2xl p-6"
                : "glass-card relative rounded-2xl p-6"
            }
          >
            {p.popular && (
              <span className="absolute -top-3 right-6 rounded-full bg-gradient-to-r from-cyan to-purple px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
                Popular
              </span>
            )}
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {p.label}
            </p>
            <p className="mt-1 font-display text-xl font-semibold">{p.name}</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              {p.sub && <span className="text-sm text-muted-foreground">{p.sub}</span>}
            </div>
            <p className="mt-3 min-h-[60px] text-sm text-muted-foreground">{p.desc}</p>
            <Button
              asChild
              className={
                p.popular
                  ? "btn-glow mt-2 w-full rounded-xl"
                  : "mt-2 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
              }
              variant={p.popular ? "default" : "secondary"}
            >
              <Link to={p.to}>{p.cta}</Link>
            </Button>
            <ul className="mt-6 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan" /> {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6 text-center">
        <h2 className="font-display text-2xl font-semibold md:text-3xl">The edge you need.</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Don't let technical limits slow down your creative momentum.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { icon: Zap, title: "Instant Processing", desc: "Remove backgrounds in under 2 seconds. No queues, no waiting, just results." },
            { icon: Sparkles, title: "Lossless Quality", desc: "Retain every hair strand and transparent fabric detail with our refined AI edges." },
            { icon: Plug, title: "Deep Integration", desc: "Connect directly to Figma, Photoshop, or your own app with our enterprise API." },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple/15 text-purple ring-1 ring-purple/30">
                <f.icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-center font-display text-lg font-semibold">{f.title}</p>
              <p className="mt-2 text-center text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-5xl px-6 pb-24">
        <h2 className="text-center font-display text-2xl font-semibold md:text-3xl">Feature Breakdown</h2>
        <div className="glass-card mt-8 overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[11px] uppercase tracking-widest text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Capabilities</th>
                <th className="px-6 py-4">Free</th>
                <th className="px-6 py-4 text-primary">Pro</th>
                <th className="px-6 py-4">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Max Resolution", "720p", "4K / Original", "8K / Original"],
                ["Batch Processing", "None", "50 images", "Unlimited"],
                ["Edge Refining Tool", "Basic", "Advanced Manual", "AI-Assisted"],
                ["API Access", "None", "Standard Rate", "Custom Limits"],
                ["Custom AI Models", "—", "—", "Included"],
                ["Support", "Community", "24h Priority", "Dedicated Account Manager"],
              ].map((row) => (
                <tr key={row[0]} className="border-t border-white/5">
                  {row.map((c, i) => (
                    <td key={i} className={i === 2 ? "px-6 py-4 text-primary" : "px-6 py-4 text-muted-foreground"}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

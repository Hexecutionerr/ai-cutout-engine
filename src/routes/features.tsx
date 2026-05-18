import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Sparkles, Zap, Code2, Layers, ShieldCheck, Globe2 } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Cutly AI" },
      { name: "description", content: "Edge-aware refining, hyper-speed batch processing, dev-first API and smart layering." },
    ],
  }),
  component: FeaturesPage,
});

const ALL = [
  { icon: Sparkles, title: "Edge-Aware Refining", desc: "Hair, fur, and semi-transparent fabrics handled with sub-pixel accuracy." },
  { icon: Zap, title: "Hyper-Speed Batches", desc: "Process up to 500 images simultaneously in under 60 seconds." },
  { icon: Code2, title: "Dev-First REST API", desc: "Drop-in integration in less than 10 lines of code." },
  { icon: Layers, title: "Smart Layering", desc: "Export layered PSDs or transparent PNGs with optional shadow restoration." },
  { icon: ShieldCheck, title: "Enterprise Security", desc: "End-to-end encryption, SOC 2-ready, with auto-purge of original assets." },
  { icon: Globe2, title: "Global CDN", desc: "Multi-region GPU pipelines deliver consistent latency anywhere on Earth." },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="font-display text-4xl font-bold md:text-6xl">
          Everything you need for <span className="text-ai-gradient">flawless cutouts.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
          Cutly AI is engineered end-to-end for production-grade image workflows.
        </p>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {ALL.map((f) => (
          <div key={f.title} className="glass-card rounded-2xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>
      <MarketingFooter />
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { triggerRazorpayCheckout } from "@/lib/razorpay-checkout";
import {
  Sparkles,
  Zap,
  Layers,
  Code2,
  Check,
  ImageIcon,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cutly AI — Delete distractions. Perfected by AI." },
      {
        name: "description",
        content:
          "Commercial-grade AI background removal in milliseconds. Edge-aware refining, hair-strand precision, and a developer-first API.",
      },
      { property: "og:title", content: "Cutly AI — AI background removal" },
      {
        property: "og:description",
        content: "High-velocity neural networks isolate subjects with pixel-perfect precision.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketingHeader />
      <Hero />
      <Features />
      <BeforeAfter />
      <PricingPreview />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero-glow relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-24 pt-20 lg:grid-cols-[1.1fr_1fr] lg:pt-28">
        <div>
          <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
            <Sparkles className="mr-1.5 h-3 w-3" /> NEW · Precision AI Engine 2.0
          </Badge>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-[64px]">
            Delete Distractions.
            <br />
            <span className="text-ai-gradient">Perfected by AI.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Cutly AI uses high-velocity neural networks to isolate subjects with
            pixel-perfect precision. Professional background removal in milliseconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="btn-glow rounded-xl">
              <Link to="/register">
                Start Free <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-xl border-white/15 bg-white/5">
              <Link to="/api-docs">View API Docs</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> No credit card</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Instant access</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> 5 free per day</span>
          </div>
        </div>

        <div className="glass-card-strong relative flex min-h-[340px] flex-col items-center justify-center overflow-hidden p-10">
          <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,oklch(0.62_0.22_305_/_0.18),transparent)]" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <div className="relative mt-5 text-center">
            <p className="font-display text-xl font-semibold">Drag &amp; Drop Image</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
              PNG, JPG or HEIC up to 20 MB
            </p>
          </div>
          <div className="relative mt-8 flex -space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan to-purple ring-2 ring-background" />
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple to-primary ring-2 ring-background" />
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan ring-2 ring-background" />
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: Sparkles,
    title: "Edge-Aware Refining",
    desc: "Our neural networks are specifically trained to handle complex edges like hair, fur, and semi-transparent objects with zero haloing.",
  },
  {
    icon: Zap,
    title: "Hyper-Speed",
    desc: "Process batches of up to 500 images simultaneously in under 60 seconds.",
    accent: true,
  },
  {
    icon: Code2,
    title: "Dev-First API",
    desc: "Simple REST API that integrates into your existing app in less than 10 lines of code.",
  },
  {
    icon: Layers,
    title: "Smart Layering",
    desc: "Automatically export as layered PSDs or transparent PNGs with custom shadow restoration.",
  },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">
        Powering the <span className="text-ai-gradient">Next Gen</span> Workflow
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
        Built for designers, developers, and creators who refuse to compromise on quality.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={
              f.accent
                ? "gradient-border relative overflow-hidden rounded-2xl p-6"
                : "glass-card relative overflow-hidden rounded-2xl p-6"
            }
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/30">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">{f.desc}</p>
            {f.accent && (
              <Sparkles className="absolute right-6 top-6 h-12 w-12 text-purple/40" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function BeforeAfter() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="font-display text-3xl font-semibold md:text-4xl">
            Visual Integrity,
            <br />
            <span className="text-ai-gradient">Preserved.</span>
          </h2>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            See the difference our high-fidelity engine makes. We don't just cut — we
            reconstruct the surrounding pixels for a seamless finish.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan" /> Sub-pixel feathering technology</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan" /> Preserves delicate hair strands</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan" /> AI shadow reconstruction</li>
          </ul>
        </div>
        <div className="glass-card-strong relative grid h-72 grid-cols-2 overflow-hidden p-0">
          <div className="relative bg-gradient-to-br from-slate-700 to-slate-900">
            <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 text-[10px] tracking-widest">BEFORE</span>
          </div>
          <div className="checker-bg relative">
            <span className="absolute bottom-3 right-3 rounded bg-primary/80 px-2 py-1 text-[10px] tracking-widest text-primary-foreground">AFTER · CUTLY</span>
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_24px_var(--primary)]">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  const { user } = useAuth();
  const PLANS = [
    {
      name: "Starter",
      price: "₹0",
      period: "/mo",
      desc: "For hobbyists and casual creators.",
      features: ["5 images / month", "Standard quality", "Personal use only"],
      cta: "Get Started",
      to: "/register" as const,
    },
    {
      name: "Pro Plan",
      price: "₹99",
      period: "/mo",
      desc: "For professional designers and studios.",
      features: [
        "Unlimited HD images",
        "Precision Edge Removal",
        "Batch Processing (50)",
        "API Access (10k requests)",
      ],
      cta: "Go Pro",
      to: "/pricing" as const,
      popular: true,
      planKey: "pro" as const,
    },
    {
      name: "Business",
      price: "₹199",
      period: "/mo",
      desc: "For large-scale production teams.",
      features: ["Everything in Pro", "Priority GPU Queue", "Custom Workflows", "Dedicated Manager"],
      cta: "Go Business",
      to: "/contact" as const,
      planKey: "business" as const,
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <h2 className="text-center font-display text-3xl font-semibold md:text-4xl">
        Simple, <span className="text-ai-gradient">Transparent</span> Pricing
      </h2>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Choose the plan that matches your scale.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-3">
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
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.name}</p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-cyan" /> {f}
                </li>
              ))}
            </ul>
            {p.planKey ? (
              <Button
                onClick={() => {
                  triggerRazorpayCheckout({
                    plan: p.planKey,
                    userId: user?.id || "00000000-0000-0000-0000-000000000000",
                    userEmail: user?.email || "guest@cutly.ai",
                  });
                }}
                className={
                  p.popular ? "btn-glow mt-6 w-full rounded-xl" : "mt-6 w-full rounded-xl bg-white/5 hover:bg-white/10"
                }
                variant={p.popular ? "default" : "secondary"}
              >
                {p.cta}
              </Button>
            ) : (
              <Button
                asChild
                className={
                  p.popular ? "btn-glow mt-6 w-full rounded-xl" : "mt-6 w-full rounded-xl bg-white/5 hover:bg-white/10"
                }
                variant={p.popular ? "default" : "secondary"}
              >
                <Link to={p.to}>{p.cta}</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const T = [
    { name: "Sarah Jenkins", role: "Creative Director @ Pixl", quote: "The accuracy on hair is unlike anything I've seen. It saves our design team hours every single week." },
    { name: "Marcus Chen", role: "Founder @ Frame.ai", quote: "Integrating the API was a breeze. Our users love the instant background removal feature." },
    { name: "David Miller", role: "Freelance Photographer", quote: "Batch processing is a game changer for my e-commerce clients. Clean edges every single time." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <h2 className="text-center font-display text-3xl font-semibold">
        Loved by <span className="text-ai-gradient">Creators</span>
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {T.map((t) => (
          <div key={t.name} className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan to-purple" />
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">{t.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">"{t.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const Q = [
    { q: "How does Cutly AI handle complex edges like fur?", a: "Our edge-aware engine uses sub-pixel feathering and dedicated hair-strand models for natural, halo-free cutouts." },
    { q: "Is there a limit on file size?", a: "Free tier supports up to 10MB per image. Pro and Business support 5000×5000 resolution and HD output." },
    { q: "Can I use the API for commercial projects?", a: "Yes — Pro and Business plans include a commercial license with rate-limited API keys and audit logs." },
  ];
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <h2 className="text-center font-display text-3xl font-semibold">
        Common <span className="text-ai-gradient">Questions</span>
      </h2>
      <div className="mt-8 space-y-3">
        {Q.map((item) => (
          <details key={item.q} className="glass-card group rounded-xl px-5 py-4 [&_summary]:cursor-pointer">
            <summary className="flex items-center justify-between text-sm font-medium">
              {item.q}
              <span className="text-muted-foreground transition-transform group-open:rotate-180">▾</span>
            </summary>
            <p className="mt-3 text-sm text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="gradient-border relative overflow-hidden rounded-3xl p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_50%,oklch(0.58_0.22_260_/_0.25),transparent)]" />
        <h2 className="relative font-display text-3xl font-semibold md:text-4xl">
          Ready to elevate your <span className="text-ai-gradient">Visual Identity?</span>
        </h2>
        <p className="relative mt-3 text-sm text-muted-foreground">
          Join over 10,000+ creators who use Cutly AI to power their daily creative workflow.
        </p>
        <Button asChild size="lg" className="btn-glow relative mt-6 rounded-xl">
          <Link to="/register">Start Processing for Free</Link>
        </Button>
        <p className="relative mt-3 text-[10px] uppercase tracking-widest text-muted-foreground">
          No credit card required · Instant access
        </p>
      </div>
    </section>
  );
}

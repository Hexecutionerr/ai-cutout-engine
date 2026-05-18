import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Cutly AI" },
      { name: "description", content: "Talk to Cutly AI sales and engineering. Custom plans, SLAs, and on-prem deployments." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="mx-auto max-w-2xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Talk to us.</h1>
        <p className="mt-3 text-muted-foreground">Tell us about your scale and we'll match you with the right plan.</p>
        <form className="glass-card mt-10 space-y-5 rounded-2xl p-6">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Work email</label>
            <input className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="you@company.com" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Company</label>
            <input className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Acme Inc." />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">How can we help?</label>
            <textarea rows={5} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Tell us about your use case…" />
          </div>
          <Button type="button" className="btn-glow w-full rounded-xl">Send Message</Button>
          <p className="text-center text-xs text-muted-foreground">
            Or just <Link to="/register" className="text-primary">start free</Link> and explore.
          </p>
        </form>
      </section>
      <MarketingFooter />
    </div>
  );
}

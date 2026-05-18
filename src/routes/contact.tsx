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
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="font-display text-4xl font-bold md:text-5xl text-center">Talk to us.</h1>
        <p className="mt-3 text-muted-foreground text-center max-w-xl mx-auto">
          Tell us about your scale, get custom integration help, or contact our support team.
        </p>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <form className="glass-card space-y-5 rounded-2xl p-6 border border-white/5">
            <h3 className="font-display text-lg font-semibold text-foreground">Send us a message</h3>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Work email</label>
              <input className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary text-foreground" placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Company</label>
              <input className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary text-foreground" placeholder="Acme Inc." />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">How can we help?</label>
              <textarea rows={4} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary text-foreground" placeholder="Tell us about your use case…" />
            </div>
            <Button type="button" className="btn-glow w-full rounded-xl">Send Message</Button>
            <p className="text-center text-xs text-muted-foreground">
              Or just <Link to="/register" className="text-primary">start free</Link> and explore.
            </p>
          </form>

          {/* Compliance Contact Card */}
          <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">Official Registered Office</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                For transaction disputes, merchant activation inquiries, or general support questions, you can contact our registered entity directly.
              </p>
              
              <div className="space-y-3 text-sm border-t border-white/5 pt-5">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Legal Merchant Name:</span>
                  <span className="font-medium text-foreground">Hasnain Khan</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Brand Name:</span>
                  <span className="font-medium text-foreground">Cutly AI</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Registered Address:</span>
                  <span className="font-medium text-foreground text-right">Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Support & Billing Email:</span>
                  <span className="font-medium text-primary">support@cutly.ai</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Helpline Number:</span>
                  <span className="font-medium text-foreground">+91 99999 99999</span>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-primary/5 border border-primary/10 rounded-xl p-4 text-xs text-muted-foreground text-center">
              Our support team operates 24/7. Response times for billing queries are typically under 2 hours.
            </div>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

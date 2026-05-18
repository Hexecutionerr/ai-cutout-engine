import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery Policy — Cutly AI" },
      { name: "description", content: "Shipping & Delivery Policy for Cutly AI. Understand how our digital SaaS cutout credits are delivered instantly." },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl backdrop-blur-xl">
          <h1 className="font-display text-3xl font-bold md:text-5xl text-ai-gradient mb-2">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: May 18, 2026</p>

          <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              Welcome to the Shipping & Delivery Policy for <strong>Cutly AI</strong>, owned and operated by <strong>Hasnain Khan</strong>.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">1. Purely Digital Service Fulfillment</h2>
            <p>
              Cutly AI is a cloud-based Artificial Intelligence image processing SaaS (Software as a Service) platform.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>No Physical Shipping:</strong> We do not package, manufacture, or ship physical products. There are absolutely no shipping fees, handling rates, or physical courier services associated with our products.</li>
              <li><strong>Instant Provisioning:</strong> Any image background removal credits or subscription plan purchases are delivered electronically to your user account instantly upon payment confirmation.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">2. Electronic Delivery Process</h2>
            <p>
              Our automated credit fulfillment engine operates as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Once our secure checkout provider, <strong>Razorpay</strong>, confirms a successful billing transaction, your Cutly AI workspace balance is updated in real-time.</li>
              <li>You will receive an automated transaction confirmation email detailing the package, quantity, and payment reference number to your registered email address within seconds of completion.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">3. Troubleshooting Activation Outages</h2>
            <p>
              In rare instances where a payment goes through but credits do not show immediately in your account:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Please allow up to 10 minutes for our database system to complete synchronization.</li>
              <li>If your credit balance still does not update, please contact our support desk immediately at <strong>support@cutly.ai</strong>.</li>
              <li>Provide your payment reference ID, registered email, and billing screenshots. We will resolve and provision your credits manually within 12 hours.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">4. Contact Us</h2>
            <p>
              If you have any questions regarding how digital delivery is handled at Cutly AI, please write to us:
            </p>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 not-italic text-sm">
              <strong className="text-foreground">Cutly AI</strong><br />
              Attn: Hasnain Khan (Founder)<br />
              Mumbai, Maharashtra,<br />
              India<br />
              Email: support@cutly.ai
            </div>
          </div>
        </div>
      </div>
      <MarketingFooter />
    </div>
  );
}

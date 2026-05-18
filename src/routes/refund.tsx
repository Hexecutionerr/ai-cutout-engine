import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy — Cutly AI" },
      { name: "description", content: "Cancellation & Refund Policy for Cutly AI. Learn about subscription cancellations and refund processing timelines." },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl backdrop-blur-xl">
          <h1 className="font-display text-3xl font-bold md:text-5xl text-ai-gradient mb-2">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: May 18, 2026</p>

          <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              At <strong>Cutly AI</strong>, we want to ensure you have an exceptional experience with our background removal studio. Please read our Cancellation & Refund Policy below to understand your options regarding subscriptions, purchases, and refund eligibility.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">1. Subscription Cancellations</h2>
            <p>
              You can cancel your Cutly AI subscription plan (Pro or Business) at any time.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cancellations can be made directly by visiting your <strong>Billing Settings</strong> in the user dashboard.</li>
              <li>When you cancel, your active subscription remains valid with all benefits until the end of your current billing cycle.</li>
              <li>No further recurring charges will be made to your payment source after cancellation.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">2. Refund Eligibility & Digital Fulfillment</h2>
            <p>
              Because Cutly AI delivers intangible digital assets (image cutout credits) that are provisioned instantly upon transaction completion, our refund rules are structured as follows:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Used Credits:</strong> Credits that have already been consumed to process images cannot be refunded under any circumstances.</li>
              <li><strong>Unused Purchases:</strong> If you purchased a subscription or credits pack by mistake and have <strong>not used any credits</strong> from that transaction, you are eligible for a full refund if requested within <strong>48 hours</strong> of purchase.</li>
              <li><strong>Technical Platform Errors:</strong> If our neural network fails to process your images due to backend server outages or critical system issues, we will credit your balance back or issue a complete refund upon review.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">3. Refund Processing Timeline</h2>
            <p>
              To request a refund, please contact our support team at <strong>support@cutly.ai</strong> with your account email, purchase date, and transaction reference ID.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We will review your claim within <strong>24 to 48 hours</strong>.</li>
              <li>Once approved, the refund is initiated instantly via our payment gateway partner, <strong>Razorpay</strong>.</li>
              <li>The refunded amount will be credited back to your original source of payment (credit card, debit card, UPI, net banking, or wallet) within <strong>5 to 7 business days</strong> as per bank processing timelines.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">4. Contact Us</h2>
            <p>
              If you have any questions or require immediate support with a billing transaction, please contact us:
            </p>
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5 not-italic text-sm">
              <strong className="text-foreground">Cutly AI Support</strong><br />
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

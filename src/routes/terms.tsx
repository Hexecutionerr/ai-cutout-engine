import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Cutly AI" },
      { name: "description", content: "Terms of Service for Cutly AI. Read our governing rules, user guidelines, and subscription details." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl backdrop-blur-xl">
          <h1 className="font-display text-3xl font-bold md:text-5xl text-ai-gradient mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: May 18, 2026</p>

          <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the <strong>https://ai-cutout-engine.vercel.app</strong> website and SaaS platform (the "Service") operated by <strong>Cutly AI</strong>, owned by <strong>Hasnain Khan</strong> ("us", "we", or "our").
            </p>
            <p>
              Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">1. Account Terms</h2>
            <p>
              To access certain features of the Service, you must create a Cutly AI account. You agree to provide accurate, current, and complete information during registration.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for safeguarding your password and account details.</li>
              <li>You must immediately notify us of any unauthorized use or security breaches.</li>
              <li>One person or legal entity may not maintain more than one free/starter account.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">2. Subscriptions, Payments & Billing</h2>
            <p>
              By selecting a paid plan (₹99/month Pro Plan, ₹199/month Business Plan) or purchasing credit packs (₹29 pack), you agree to pay Cutly AI the fees indicated for that service.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Secure Payments:</strong> All payment transactions are securely executed through the <strong>Razorpay</strong> payment gateway.</li>
              <li><strong>Automatic Renewal:</strong> Recurring subscription plans renew automatically at the end of each billing cycle unless cancelled beforehand.</li>
              <li><strong>Taxes:</strong> All fees are exclusive of any applicable regional taxes (GST, etc.) unless stated otherwise.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">3. Permitted & Prohibited Use</h2>
            <p>
              You may use Cutly AI to remove backgrounds from images for personal, editorial, or commercial use in accordance with your plan limits. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service to process unlawful, defamatory, abusive, or obscene media.</li>
              <li>Reverse engineer, scrape, or systematically bypass platform credit systems.</li>
              <li>Attempt to disrupt our server networks or GPU processing pipelines.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">4. Intellectual Property</h2>
            <p>
              You retain all ownership rights, copyright, and intellectual property rights in the images you upload to the Service. Cutly AI does not claim any ownership of your media.
            </p>
            <p>
              The Cutly AI website design, source code, branding, logos, and neural network pipelines are the exclusive property of Cutly AI and Hasnain Khan.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">5. Disclaimer & Limitation of Liability</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranty that our background removal algorithms will satisfy 100% of image variations. In no event shall Cutly AI or Hasnain Khan be liable for any indirect, incidental, or consequential damages resulting from platform use.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">6. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of <strong>Maharashtra, India</strong>, without regard to its conflict of law provisions. Any legal actions must be initiated in courts situated in Mumbai, Maharashtra, India.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">7. Modifications to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide prominent notification on our website of any substantial terms adjustments.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">8. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please reach out to us:
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

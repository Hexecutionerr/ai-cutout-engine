import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Cutly AI" },
      { name: "description", content: "Privacy Policy for Cutly AI. Understand how we collect, protect, and handle your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <div className="mx-auto max-w-4xl px-6 py-20">
        <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl backdrop-blur-xl">
          <h1 className="font-display text-3xl font-bold md:text-5xl text-ai-gradient mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Last Updated: May 18, 2026</p>

          <div className="prose prose-invert max-w-none text-muted-foreground space-y-6 text-sm md:text-base leading-relaxed">
            <p>
              Welcome to <strong>Cutly AI</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy or our practices with regards to your personal information, please contact us at <strong>support@cutly.ai</strong>.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register on our website, express an interest in obtaining information about us or our products and services, or when you participate in activities on our platform.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Credentials:</strong> Name, email address, password, and similar security information used for authentication.</li>
              <li><strong>Transaction Data:</strong> Payment details collected securely through our payment processor, Razorpay. We do not store credit card/banking data on our servers.</li>
              <li><strong>User Uploads:</strong> Images uploaded to our service to perform background removal. These images are processed in real-time.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">2. How We Use Your Information</h2>
            <p>
              We use personal information collected via our website for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To facilitate account creation and logon process.</li>
              <li>To deliver the background removal services and process your images.</li>
              <li>To fulfill and manage purchases, subscriptions, and payment transactions through Razorpay.</li>
              <li>To protect our services, monitor usage, and prevent fraud.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">3. Image Data & Privacy Protection</h2>
            <p>
              We value your creative intellectual property. All uploaded images are processed temporarily on our secure GPU servers to perform AI background removal.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Images are stored briefly to complete processing.</li>
              <li>We automatically purge processed images and original files from our cache to ensure absolute confidentiality.</li>
              <li>We do not train our AI models on your uploaded images without explicit opt-in consent.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">4. Sharing Your Information</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Razorpay:</strong> To process secure subscription and credit card billing transactions.</li>
              <li><strong>Supabase:</strong> For database hosting, authentication, and platform security.</li>
            </ul>

            <h2 className="text-xl font-semibold text-foreground mt-8">5. Your Privacy Rights</h2>
            <p>
              You have the right to access, correct, or request deletion of your personal data at any time. You can request account deletion by emailing us at <strong>support@cutly.ai</strong>. We will fulfill request and delete all records within 14 business days.
            </p>

            <h2 className="text-xl font-semibold text-foreground mt-8">6. Contact Us</h2>
            <p>
              If you have questions or comments about this policy, you may email us at <strong>support@cutly.ai</strong> or contact us by mail at:
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

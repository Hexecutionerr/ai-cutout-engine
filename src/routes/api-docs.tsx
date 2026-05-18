import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const Route = createFileRoute("/api-docs")({
  head: () => ({
    meta: [
      { title: "API Documentation — Cutly AI" },
      { name: "description", content: "Cutly AI REST API reference for background removal, batch processing, and webhooks." },
    ],
  }),
  component: ApiDocsPage,
});

function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold md:text-5xl">API Documentation</h1>
        <p className="mt-3 text-muted-foreground">Drop Cutly AI into any product in under 10 lines of code.</p>

        <div className="mt-10 space-y-10">
          <section>
            <h2 className="font-display text-2xl font-semibold">Authentication</h2>
            <p className="mt-2 text-sm text-muted-foreground">Pass your API key as a Bearer token in the Authorization header.</p>
            <pre className="glass-card mt-4 overflow-x-auto rounded-xl p-4 text-xs">
{`Authorization: Bearer ck_live_xxxxxxxxxxxxxxxxxxxxxxxxxx`}
            </pre>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Remove Background</h2>
            <p className="mt-2 text-sm text-muted-foreground">POST <code className="text-cyan">/v1/images/remove-background</code></p>
            <pre className="glass-card mt-4 overflow-x-auto rounded-xl p-4 text-xs">
{`curl https://api.cutly.ai/v1/images/remove-background \\
  -H "Authorization: Bearer $CUTLY_API_KEY" \\
  -F "image=@product.jpg" \\
  -F "format=png"`}
            </pre>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Batch Processing</h2>
            <p className="mt-2 text-sm text-muted-foreground">Submit up to 500 image URLs for parallel processing.</p>
            <pre className="glass-card mt-4 overflow-x-auto rounded-xl p-4 text-xs">
{`POST /v1/batch
{
  "callback_url": "https://your.app/webhooks/cutly",
  "images": ["https://...", "https://..."]
}`}
            </pre>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold">Rate Limits</h2>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>Free: 5 requests / day</li>
              <li>Pro: 200 requests / month, 60 RPM</li>
              <li>Enterprise: custom SLA</li>
            </ul>
          </section>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

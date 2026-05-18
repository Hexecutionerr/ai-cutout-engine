import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Cutly AI" },
      { name: "description", content: "Insights on AI image processing, edge cases, and creative production workflows." },
    ],
  }),
  component: BlogPage,
});

const POSTS = [
  { title: "How we cut hair: behind Cutly's edge engine", date: "Apr 28, 2026", excerpt: "A deep dive into the sub-pixel feathering pipeline that powers production cutouts." },
  { title: "Batch processing 10,000 product shots in 90 seconds", date: "Apr 14, 2026", excerpt: "How a leading marketplace cut studio costs by 70% with the Cutly API." },
  { title: "Designing for transparency: file format primer", date: "Mar 30, 2026", excerpt: "PNG vs WebP vs PSD — what to ship and when." },
];

function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-display text-4xl font-bold md:text-5xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">Stories from the Cutly AI engineering and creator community.</p>
        <div className="mt-10 space-y-4">
          {POSTS.map((p) => (
            <article key={p.title} className="glass-card rounded-2xl p-6 transition-colors hover:bg-white/5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.date}</p>
              <h2 className="mt-1 font-display text-xl font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

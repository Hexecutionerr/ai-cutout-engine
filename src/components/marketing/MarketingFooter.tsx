export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
        <div>
          <div className="font-display text-lg font-semibold">
            Cutly <span className="text-gold">AI</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cutly AI. Precision background removal.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
          <a href="/legal/privacy" className="hover:text-foreground">Privacy Policy</a>
          <a href="/legal/terms" className="hover:text-foreground">Terms of Service</a>
          <a href="/status" className="hover:text-foreground">Status</a>
          <a href="https://twitter.com" className="hover:text-foreground">Twitter</a>
          <a href="https://github.com" className="hover:text-foreground">GitHub</a>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";

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
          <Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-foreground">Terms & Conditions</Link>
          <Link to="/refund" className="hover:text-foreground">Refund Policy</Link>
          <Link to="/shipping" className="hover:text-foreground">Shipping Policy</Link>
          <Link to="/contact" className="hover:text-foreground">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(128),
});

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Cutly AI" },
      { name: "description", content: "Start removing backgrounds with Cutly AI in seconds. 2 free credits on signup." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/app/workspace" });
  }, [authLoading, user, navigate]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setLoading(true);
    const { error, needsEmailConfirmation } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) toast.error(error);
    else if (needsEmailConfirmation) {
      toast.success("Check your email to confirm your account, then sign in.");
      navigate({ to: "/login" });
    } else {
      toast.success("Account created — welcome!");
      navigate({ to: "/app/workspace" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="hero-glow relative flex flex-1 items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-4xl gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="hidden flex-col justify-center lg:flex">
            <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">
              Join 10,000+ creators
              <br /> using <span className="text-ai-gradient">Cutly AI</span>
            </h1>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              {["2 free background removals","Pixel-perfect edge AI","Pro plan: 10 credits/month","No credit card required"].map((b) => (
                <li key={b} className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan" /> {b}</li>
              ))}
            </ul>
          </div>

          <div className="glass-card-strong rounded-2xl p-8">
            <Logo />
            <h2 className="mt-6 font-display text-2xl font-semibold">Create your account</h2>

            <Button
              type="button"
              onClick={async () => {
                const { error } = await signInWithGoogle();
                if (error) toast.error(error);
              }}
              variant="outline"
              className="mt-6 w-full rounded-xl border-white/10 bg-white/5"
            >
              Continue with Google
            </Button>

            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Full name</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="Alex Chen" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="you@email.com" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="At least 8 characters" />
              </div>
              <Button type="submit" disabled={loading} className="btn-glow w-full rounded-xl">{loading ? "Creating…" : "Create Account"}</Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary">Sign in</Link>
            </p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

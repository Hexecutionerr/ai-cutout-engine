import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Cutly AI" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) toast.error(error);
    else toast.success("Check your inbox for the reset link");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="glass-card-strong w-full max-w-md rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold">Forgot your password?</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter your email and we'll send a reset link.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="you@email.com" />
            <Button type="submit" disabled={loading} className="btn-glow w-full rounded-xl">{loading ? "Sending…" : "Send Reset Link"}</Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary">Back to sign in</Link>
          </p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

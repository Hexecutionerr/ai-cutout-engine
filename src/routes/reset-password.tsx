import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — Cutly AI" }] }),
  component: ResetPage,
});

function ResetPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Use at least 8 characters"); return; }
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) toast.error(error);
    else {
      toast.success("Password updated");
      navigate({ to: "/app/workspace" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <MarketingHeader />
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="glass-card-strong w-full max-w-md rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold">Set a new password</h1>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" placeholder="New password" />
            <Button type="submit" disabled={loading} className="btn-glow w-full rounded-xl">{loading ? "Updating…" : "Update password"}</Button>
          </form>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}

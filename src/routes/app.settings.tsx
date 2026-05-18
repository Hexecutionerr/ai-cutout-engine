import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/app/settings")({
  head: () => ({ meta: [{ title: "Settings — Cutly AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <h1 className="font-display text-3xl font-bold">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage your profile and preferences.</p>

      <section className="glass-card mt-8 max-w-2xl rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Profile</h2>
        <div className="mt-5 space-y-4">
          <Field label="Full name" defaultValue="Alex Chen" />
          <Field label="Email" defaultValue="alex@cutly.ai" type="email" />
          <Field label="Company" defaultValue="Cutly Studios" />
          <Button className="btn-glow rounded-xl">Save changes</Button>
        </div>
      </section>

      <section className="glass-card mt-6 max-w-2xl rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Security</h2>
        <p className="mt-1 text-sm text-muted-foreground">Update your password and enable 2FA.</p>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5">Change password</Button>
          <Button variant="outline" className="rounded-xl border-white/10 bg-white/5">Enable 2FA</Button>
        </div>
      </section>
    </div>
  );
}

function Field({ label, defaultValue, type = "text" }: { label: string; defaultValue?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input type={type} defaultValue={defaultValue} className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-primary" />
    </div>
  );
}

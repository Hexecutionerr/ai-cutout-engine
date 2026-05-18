import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CreditCard, Download } from "lucide-react";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{ title: "Billing — Cutly AI" }] }),
  component: BillingPage,
});

function BillingPage() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <h1 className="font-display text-3xl font-bold">Billing</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage your subscription, credits and payment method.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="gradient-border rounded-2xl p-6 lg:col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan">Current Plan</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">Pro · Monthly</h2>
          <p className="mt-1 text-sm text-muted-foreground">Renews on May 28, 2026 · ₹2,499 / month</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button className="btn-glow rounded-xl">Upgrade to Business</Button>
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5">Cancel Subscription</Button>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Payment Method</p>
          <div className="mt-3 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">•••• •••• •••• 4242</p>
              <p className="text-xs text-muted-foreground">Expires 09 / 28</p>
            </div>
          </div>
          <Button variant="outline" className="mt-5 w-full rounded-xl border-white/10 bg-white/5">Update Card</Button>
        </div>
      </div>

      <section className="glass-card mt-8 rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Invoice History</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-widest text-muted-foreground">
            <tr className="border-b border-white/5">
              <th className="py-3">Invoice</th>
              <th className="py-3">Date</th>
              <th className="py-3">Amount</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">PDF</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["INV-2026-0428", "Apr 28, 2026", "₹2,499", "Paid"],
              ["INV-2026-0328", "Mar 28, 2026", "₹2,499", "Paid"],
              ["INV-2026-0228", "Feb 28, 2026", "₹2,499", "Paid"],
            ].map(([inv, date, amt, st]) => (
              <tr key={inv} className="border-b border-white/5">
                <td className="py-3 font-medium">{inv}</td>
                <td className="text-muted-foreground">{date}</td>
                <td>{amt}</td>
                <td>
                  <span className="rounded-md border border-success/40 bg-success/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-success">
                    {st}
                  </span>
                </td>
                <td className="text-right">
                  <button className="rounded-lg p-2 hover:bg-white/5"><Download className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

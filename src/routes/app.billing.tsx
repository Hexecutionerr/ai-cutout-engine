import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CreditCard, Download, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthServerFn } from "@/hooks/useAuthServerFn";
import { listPayments } from "@/rpc/billing.functions";
import { getDashboardSummary } from "@/rpc/uploads.functions";

export const Route = createFileRoute("/app/billing")({
  head: () => ({ meta: [{ title: "Billing — Cutly AI" }] }),
  component: BillingPage,
});

function BillingPage() {
  const getPayments = useAuthServerFn(listPayments);
  const getSummary = useAuthServerFn(getDashboardSummary);

  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pData, sData] = await Promise.all([getPayments(), getSummary()]);
        setPayments(pData || []);
        setSummary(sData);
      } catch (err) {
        console.error("Failed to load billing summary:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 lg:p-8">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading your secure billing ledger...</p>
        </div>
      </div>
    );
  }

  const sub = summary?.subscription;
  const activePlan = sub?.status === "active";
  const planName = sub?.plan === "pro" ? "Pro Plan" : sub?.plan === "business" ? "Business Plan" : "Starter (Free)";
  const planPrice = sub?.plan === "pro" ? "₹99 / month" : sub?.plan === "business" ? "₹199 / month" : "₹0 / month";
  const renewText = sub?.current_period_end 
    ? `Renews on ${new Date(sub.current_period_end).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}` 
    : "No upcoming renewals";

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <h1 className="font-display text-3xl font-bold">Billing</h1>
      <p className="mt-2 text-sm text-muted-foreground">Manage your subscription, credits and payment method.</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        <div className="gradient-border rounded-2xl p-6 lg:col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-cyan">Current Plan</p>
          <h2 className="mt-1 font-display text-2xl font-semibold">{planName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{renewText} · {planPrice}</p>
          
          <div className="mt-5 flex flex-wrap gap-3">
            {sub?.plan !== "business" && (
              <Button asChild className="btn-glow rounded-xl">
                <a href="/pricing">Upgrade Plan</a>
              </Button>
            )}
            {activePlan && (
              <Button variant="outline" className="rounded-xl border-white/10 bg-white/5" onClick={() => window.location.href = "/contact"}>
                Manage Subscription
              </Button>
            )}
          </div>
        </div>
        
        <div className="glass-card rounded-2xl p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Payment Method</p>
          <div className="mt-3 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-medium">Razorpay Gateway Enabled</p>
              <p className="text-xs text-muted-foreground">Secured checkout integration</p>
            </div>
          </div>
          <Button variant="outline" className="mt-5 w-full rounded-xl border-white/10 bg-white/5" onClick={() => window.location.href = "/pricing"}>
            Top Up Credits
          </Button>
        </div>
      </div>

      <section className="glass-card mt-8 rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold">Invoice History</h2>
        
        {payments.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground text-center py-6">No transaction or invoice logs found.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[600px]">
              <thead className="text-[11px] uppercase tracking-widest text-muted-foreground border-b border-white/5">
                <tr>
                  <th className="py-3">Invoice / Receipt</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Plan / Item</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  if (!p) return null;
                  const dateStr = p.created_at 
                    ? new Date(p.created_at).toLocaleDateString("en-IN", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                    : "Unknown Date";
                  const pId = p.id || "";
                  const invId = p.created_at 
                    ? `INV-${new Date(p.created_at).getFullYear()}-${pId.slice(0, 4).toUpperCase()}`
                    : "INV-TEMP";
                  
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 font-medium">{p.razorpay_payment_id || invId}</td>
                      <td className="text-muted-foreground">{dateStr}</td>
                      <td>₹{(p.amount_paise / 100).toFixed(2)}</td>
                      <td className="capitalize">{p.plan === "starter" ? "Credits Topup" : `${p.plan} Plan`}</td>
                      <td>
                        <span className={`rounded-md border px-2 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                          p.status === "captured"
                            ? "border-success/40 bg-success/10 text-success"
                            : p.status === "created"
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-500"
                            : "border-white/10 bg-white/5 text-muted-foreground"
                        }`}>
                          {p.status === "captured" ? "Paid" : p.status === "created" ? "Pending" : p.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button 
                          onClick={() => window.print()} 
                          className="rounded-lg p-2 hover:bg-white/10 transition-colors"
                          title="Print Receipt"
                        >
                          <Download className="h-4 w-4 text-muted-foreground hover:text-white" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getDashboardSummary } from "@/rpc/uploads.functions";
import {
  LayoutGrid,
  History,
  Wallet,
  KeyRound,
  ShieldCheck,
  Upload,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app/workspace", label: "Workspace", icon: LayoutGrid },
  { to: "/app/history", label: "History", icon: History },
  { to: "/app/billing", label: "Billing", icon: Wallet },
  { to: "/app/api-keys", label: "API Keys", icon: KeyRound },
  { to: "/app/admin", label: "Admin", icon: ShieldCheck },
] as const;

export function AppSidebar() {
  const getSummary = useServerFn(getDashboardSummary);
  const [plan, setPlan] = useState("Starter Plan");

  useEffect(() => {
    getSummary()
      .then((s) => {
        if (s?.subscription?.status === "active") {
          const name = s.subscription.plan === "pro" ? "Pro Plan" : "Business Plan";
          setPlan(name);
        } else {
          setPlan("Starter Plan");
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">
      <Logo subtitle={plan} />

      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className: "bg-sidebar-accent text-primary",
            }}
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
                <span className="font-medium">{label}</span>
                {isActive && (
                  <span className="absolute right-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-l bg-primary shadow-[0_0_12px_var(--primary)]" />
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-3">
        <Button asChild className="btn-glow w-full rounded-xl">
          <Link to="/app/workspace">
            <Upload className="mr-2 h-4 w-4" /> Upload Image
          </Link>
        </Button>
        <Link
          to="/api-docs"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          <FileText className="h-4 w-4" /> Documentation
        </Link>
        <Link
          to="/app/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </div>
    </aside>
  );
}

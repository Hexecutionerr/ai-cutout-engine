import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function ensureAdmin(supabase: { auth: { getUser: () => Promise<{ data: { user: { id: string } | null } }> } }, userId: string) {
  void supabase;
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (!data) throw new Error("Forbidden: admin only");
}

export const getAdminMetrics = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.supabase, context.userId);

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const [usersRes, uploads24Res, failed24Res, paymentsRes, recentUsersRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("uploads").select("id", { count: "exact", head: true }).gte("created_at", since24h),
      supabaseAdmin.from("uploads").select("id", { count: "exact", head: true }).eq("status", "failed").gte("created_at", since24h),
      supabaseAdmin.from("payments").select("amount_paise").eq("status", "captured").gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabaseAdmin.from("profiles").select("email, full_name, created_at").order("created_at", { ascending: false }).limit(8),
    ]);

    const mrrPaise = (paymentsRes.data ?? []).reduce((s, p) => s + Number(p.amount_paise), 0);

    return {
      totalUsers: usersRes.count ?? 0,
      uploads24h: uploads24Res.count ?? 0,
      failed24h: failed24Res.count ?? 0,
      mrrInr: mrrPaise / 100,
      recentUsers: recentUsersRes.data ?? [],
    };
  });

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { createOrder, PLAN_CATALOG, type PlanKey } from "./razorpay.server";

const planSchema = z.object({ plan: z.enum(["starter", "pro", "business"]) });

export const createCheckoutOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => planSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const cfg = PLAN_CATALOG[data.plan as PlanKey];

    try {
      const order = await createOrder({
        amountPaise: cfg.amountPaise,
        currency: "INR",
        receipt: `cutly_${userId.slice(0, 8)}_${Date.now()}`,
        notes: { user_id: userId, plan: data.plan },
      });

      await supabaseAdmin.from("payments").insert({
        user_id: userId,
        razorpay_order_id: order.id,
        amount_paise: cfg.amountPaise,
        currency: "INR",
        status: "created",
        plan: data.plan,
        credits_granted: cfg.credits,
      });

      return {
        ok: true as const,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID ?? "",
        plan: data.plan,
      };
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not create order";
      console.error("[razorpay] order failed", e);
      return { ok: false as const, error: msg };
    }
  });

export const listPayments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("payments")
      .select("id, razorpay_payment_id, amount_paise, currency, status, plan, credits_granted, invoice_url, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data;
  });

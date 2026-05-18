// Razorpay helpers (server-only).
// Uses Basic Auth with key_id:key_secret. Webhook signatures verified with HMAC-SHA256.

import crypto from "node:crypto";

const KEY_ID = process.env.RAZORPAY_KEY_ID ?? "";
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? "";
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

const AUTH = "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export async function createOrder(params: {
  amountPaise: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  if (!KEY_ID || !KEY_SECRET) throw new Error("RAZORPAY_KEY_ID/SECRET not configured");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: params.amountPaise,
      currency: params.currency ?? "INR",
      receipt: params.receipt,
      notes: params.notes,
    }),
  });
  if (!res.ok) throw new Error(`Razorpay order failed [${res.status}]: ${await res.text()}`);
  return (await res.json()) as RazorpayOrder;
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
): boolean {
  if (!KEY_SECRET) return false;
  const expected = crypto.createHmac("sha256", KEY_SECRET).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEq(expected, signature);
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!WEBHOOK_SECRET || !signature) return false;
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  return safeEq(expected, signature);
}

function safeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Plan catalog — credits granted per plan / pack
export const PLAN_CATALOG = {
  starter: { amountPaise: 99900, credits: 200, label: "Starter" },
  pro: { amountPaise: 249900, credits: 1000, label: "Pro" },
  business: { amountPaise: 999900, credits: 5000, label: "Business" },
} as const;

export type PlanKey = keyof typeof PLAN_CATALOG;

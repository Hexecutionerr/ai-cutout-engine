/** Credit limits per plan — single source of truth. */
export const CREDITS = {
  FREE_SIGNUP: 2,
  PRO_PLAN: 10,
  BUSINESS_PLAN: 50,
  STARTER_PACK: 50,
} as const;

export function defaultCreditsForPlan(plan: string | null | undefined): number {
  if (plan === "pro") return CREDITS.PRO_PLAN;
  if (plan === "business") return CREDITS.BUSINESS_PLAN;
  return CREDITS.FREE_SIGNUP;
}

export function creditsForPurchase(plan: string): number {
  if (plan === "pro") return CREDITS.PRO_PLAN;
  if (plan === "business") return CREDITS.BUSINESS_PLAN;
  if (plan === "starter") return CREDITS.STARTER_PACK;
  return CREDITS.FREE_SIGNUP;
}

export const NO_CREDITS_MESSAGE =
  "No credits left. Free plan includes 2 background removals — upgrade to Pro for 10 credits.";

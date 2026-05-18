import { createCheckoutOrder } from "@/rpc/billing.functions";
import { toast } from "sonner";

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface TriggerCheckoutOptions {
  plan: "starter" | "pro" | "business";
  userId: string;
  userEmail: string;
  onSuccess?: () => void;
}

export async function triggerRazorpayCheckout(options: TriggerCheckoutOptions) {
  const { plan, userId, userEmail, onSuccess } = options;
  
  toast.loading("Initiating secure payment gateway...", { id: "razorpay-checkout" });
  
  try {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay SDK. Please check your network connection.", { id: "razorpay-checkout" });
      return;
    }

    // Call server function to create order
    const orderData = await createCheckoutOrder({ plan });
    
    if (!orderData || 'error' in orderData || !orderData.orderId) {
      const errMsg = (orderData as any)?.error || "Failed to establish secure order connection.";
      toast.error(errMsg, { id: "razorpay-checkout" });
      return;
    }

    toast.dismiss("razorpay-checkout");

    const rzpOptions = {
      key: orderData.keyId || (import.meta as any).env.VITE_RAZORPAY_KEY_ID || "rzp_test_change_me",
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Cutly AI",
      description: `Upgrade to ${plan === "starter" ? "Credits Pack" : plan === "pro" ? "Pro Plan" : "Business Plan"}`,
      order_id: orderData.orderId,
      theme: {
        color: "#8B5CF6", // Dynamic premium violet styling
      },
      prefill: {
        email: userEmail,
      },
      notes: {
        user_id: userId,
        plan: plan,
      },
      handler: async function (response: any) {
        toast.success("Payment authorized successfully!", { id: "razorpay-checkout" });
        if (onSuccess) onSuccess();
        // Force refresh / redirect to billing route so they see their active plan
        window.location.href = "/app/billing";
      },
      modal: {
        ondismiss: function () {
          toast.info("Payment cancelled.", { id: "razorpay-checkout" });
        }
      }
    };

    const rzp = new (window as any).Razorpay(rzpOptions);
    rzp.open();
  } catch (err: any) {
    console.error("Razorpay checkout trigger error:", err);
    toast.error(err.message || "Failed to initiate payment gateway.", { id: "razorpay-checkout" });
  }
}

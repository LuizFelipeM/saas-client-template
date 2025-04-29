import { getAddOnStripePriceId, getStripePriceId } from "@/lib/pricing";
import { BillingPeriod, PlanAddOn, PricingPlan } from "@/types/pricing";
import Stripe from "stripe";

// Initialize Stripe with the secret key from environment variables
// Note: This is for server-side only, never expose in client-side code
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil", // Latest supported version
});

interface CreateCheckoutSessionParams {
  plan: PricingPlan;
  billingPeriod: BillingPeriod;
  quantity?: number;
  selectedAddOns?: PlanAddOn[];
  customerId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

/**
 * Create a Stripe Checkout Session
 */
export const createCheckoutSession = async ({
  plan,
  billingPeriod,
  quantity = 1,
  selectedAddOns = [],
  customerId,
  successUrl,
  cancelUrl,
  metadata = {},
}: CreateCheckoutSessionParams): Promise<string> => {
  try {
    const priceId = getStripePriceId(plan, billingPeriod);

    if (!priceId) {
      throw new Error(`No Stripe price ID found for plan: ${plan.id}`);
    }

    // Prepare line items starting with the base plan
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price: priceId,
        quantity: plan.model === "per-user" ? quantity : 1,
      },
    ];

    // Add selected add-ons as line items
    if (selectedAddOns.length > 0) {
      for (const addon of selectedAddOns) {
        const addonPriceId = getAddOnStripePriceId(addon, billingPeriod);

        if (addonPriceId) {
          lineItems.push({
            price: addonPriceId,
            quantity: 1,
          });
        }
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: billingPeriod === "lifetime" ? "payment" : "subscription",
      customer: customerId,
      line_items: lineItems,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId: plan.id,
        billingPeriod,
        ...metadata,
      },
      subscription_data:
        billingPeriod !== "lifetime"
          ? {
              metadata: {
                planId: plan.id,
                ...metadata,
              },
              trial_period_days:
                plan.callToAction.action === "trial" ? 14 : undefined,
            }
          : undefined,
    });

    return session.url || "";
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw error;
  }
};

/**
 * Create a Stripe Customer Portal Session
 */
export const createCustomerPortalSession = async (
  customerId: string,
  returnUrl: string
): Promise<string> => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error("Error creating Stripe customer portal session:", error);
    throw error;
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleWebhookEvent = async (
  rawBody: string,
  signature: string,
  endpointSecret: string
): Promise<{ success: boolean; event?: Stripe.Event }> => {
  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      endpointSecret
    );

    return { success: true, event };
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return { success: false };
  }
};

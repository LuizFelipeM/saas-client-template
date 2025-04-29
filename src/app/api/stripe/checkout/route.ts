import { pricingConfig } from "@/config/pricing";
import { createCheckoutSession } from "@/lib/services/stripe";
import { BillingPeriod, PlanAddOn } from "@/types/pricing";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      planId,
      billingPeriod = "monthly",
      quantity = 1,
      selectedAddOnIds = [],
      customerId,
      successPath = "/dashboard",
      cancelPath = "/pricing",
      metadata = {},
    } = await request.json();

    // Find the selected plan from the config
    const plan = pricingConfig.plans.find((p) => p.id === planId);

    if (!plan) {
      return NextResponse.json(
        { error: `Plan with ID ${planId} not found` },
        { status: 400 }
      );
    }

    // Get selected add-ons
    const selectedAddOns: PlanAddOn[] = [];

    if (plan.addOns && selectedAddOnIds.length > 0) {
      for (const addOnId of selectedAddOnIds) {
        const addOn = plan.addOns.find((a) => a.id === addOnId);
        if (addOn) selectedAddOns.push(addOn);
      }
    }

    // Generate absolute URLs for success and cancel
    const origin = request.headers.get("origin") || request.nextUrl.origin;
    const successUrl = `${origin}${successPath}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}${cancelPath}`;

    // Create checkout session
    const sessionUrl = await createCheckoutSession({
      plan,
      billingPeriod: billingPeriod as BillingPeriod,
      quantity: Number(quantity),
      selectedAddOns,
      customerId,
      successUrl,
      cancelUrl,
      metadata,
    });

    return NextResponse.json({ url: sessionUrl });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// Stripe typically expects you to return a 200 status for webhook requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

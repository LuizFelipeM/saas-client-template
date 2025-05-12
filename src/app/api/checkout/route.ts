import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { prisma } from "@/lib/prisma";
import { Price } from "@/types/price";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    // TODO: Add validation
    // TODO: Add logging
    // TODO: Add addon management
    const { planId, priceId, addonIds, companyId } = await req.json();

    if (!planId || !companyId) {
      return NextResponse.json(
        { error: "Missing planId or companyId" },
        { status: 400 }
      );
    }

    // Get the plan details
    const plan = await prisma.plan.findUniqueOrThrow({
      where: {
        id: planId,
        isActive: true,
        prices: { array_contains: { id: priceId } },
      },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (
      !plan.prices ||
      !Array.isArray(plan.prices) ||
      plan.prices.length === 0
    ) {
      return NextResponse.json(
        { error: "Plan has no prices" },
        { status: 400 }
      );
    }

    const stripe = DIContainer.getInstance<Stripe>(DITypes.Stripe);

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: (plan.prices[0] as Price).id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        planId,
        companyId,
      },
      subscription_data: {
        metadata: {
          planId,
          companyId,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

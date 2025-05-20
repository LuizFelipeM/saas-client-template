import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { Price } from "@/types/price";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // TODO: Add validation
    // TODO: Add logging
    // TODO: Add addon management
    const { planId, priceId, organizationId } = await req.json();

    if (!planId || !organizationId) {
      return NextResponse.json(
        { error: "Missing planId or organizationId" },
        { status: 400 }
      );
    }

    const { userId } = await auth();
    const userService = DIContainer.getInstance(DITypes.UserService);
    const user = await userService.getByClerkId(userId!);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const planService = DIContainer.getInstance(DITypes.PlanService);
    const plan = await planService.getActivePlanById(planId);

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    if (!Array.isArray(plan.prices) || plan.prices.length === 0) {
      return NextResponse.json(
        { error: "Plan has no prices" },
        { status: 400 }
      );
    }

    const price = plan.prices?.find((p) => (p as Price).id === priceId);
    if (!price) {
      return NextResponse.json({ error: "Price not found" }, { status: 404 });
    }

    const stripe = DIContainer.getInstance(DITypes.Stripe);
    const organizationService = DIContainer.getInstance(
      DITypes.OrganizationService
    );

    const organization = await organizationService.getByClerkId(organizationId);
    if (!organization) {
      console.error("Organization not found", organizationId);
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      customer: user.stripeId!,
      payment_method_types: ["card"],
      line_items: [
        {
          price: (price as Price).id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        planId,
        organizationId: organization.id,
      },
      subscription_data: {
        metadata: {
          planId,
          organizationId: organization.id,
          userId,
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

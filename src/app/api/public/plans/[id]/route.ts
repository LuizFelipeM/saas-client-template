import { prisma } from "@/lib/prisma";
import { PlanService } from "@/services/plan.service";
import { Price } from "@/types/price";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // Get the plan by stripe product ID
    const plan = await prisma.plan.findUnique({
      where: { stripeProductId: id },
    });

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Fetch all active prices for the product
    const pricesList = await stripe.prices.list({
      product: id,
      active: true,
    });

    const formattedPrices = pricesList.data.map<Price>((price) => ({
      id: price.id,
      active: price.active,
      currency: price.currency,
      unit_amount: price.unit_amount,
      type: price.type,
      recurring: price.recurring,
      metadata: price.metadata,
    }));

    const planService = new PlanService();
    const updatedPlan = await planService.updatePrices(id, formattedPrices);

    return NextResponse.json(updatedPlan);
  } catch (error) {
    console.error("Error updating plan prices:", error);
    return NextResponse.json(
      { error: "Failed to update plan prices" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // Deactivate the plan instead of deleting it
    await prisma.plan.update({
      where: { stripeProductId: id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deactivating plan:", error);
    return NextResponse.json(
      { error: "Failed to deactivate plan" },
      { status: 500 }
    );
  }
}

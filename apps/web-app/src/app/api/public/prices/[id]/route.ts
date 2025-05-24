import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { Price } from "@/types/price";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: priceId } = await params;

  try {
    const stripe = DIContainer.getInstance(DITypes.Stripe);

    // Get the price information from Stripe
    const price = await stripe.prices.retrieve(priceId);

    if (!price.product || typeof price.product !== "string") {
      return NextResponse.json(
        { error: "Price is missing product ID" },
        { status: 400 }
      );
    }

    const productId = price.product;

    const planService = DIContainer.getInstance(DITypes.PlanService);
    const addonService = DIContainer.getInstance(DITypes.AddonService);

    const isPlan = await planService.planExists(productId);
    const isAddon = await addonService.addonExists(productId);

    if (!isPlan && !isAddon) {
      return NextResponse.json(
        { error: "Associated product not found" },
        { status: 404 }
      );
    }

    // Fetch all active prices for the product, excluding the deleted one
    const pricesList = await stripe.prices.list({
      product: productId,
      active: true,
    });

    const formattedPrices = pricesList.data
      .filter((p) => p.id !== priceId) // Exclude the deleted price
      .map<Price>((p) => ({
        id: p.id,
        active: p.active,
        currency: p.currency,
        unit_amount: p.unit_amount,
        type: p.type,
        recurring: p.recurring,
        metadata: p.metadata,
      }));

    if (isPlan) {
      await planService.updatePrices(productId, formattedPrices);
    } else {
      await addonService.updatePrices(productId, formattedPrices);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling price deletion:", error);
    return NextResponse.json(
      { error: "Failed to handle price deletion" },
      { status: 500 }
    );
  }
}

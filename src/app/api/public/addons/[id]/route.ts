import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { prisma } from "@/lib/prisma";
import { AddonService } from "@/services/addon.service";
import { Price } from "@/types/price";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // Get the addon by stripe product ID
    const addon = await prisma.addon.findUnique({
      where: { stripeProductId: id },
    });

    if (!addon) {
      return NextResponse.json({ error: "Addon not found" }, { status: 404 });
    }

    const stripe = DIContainer.getInstance<Stripe>(DITypes.Stripe);

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

    const addonService = DIContainer.getInstance<AddonService>(
      DITypes.AddonService
    );
    const updatedAddon = await addonService.updatePrices(id, formattedPrices);

    return NextResponse.json(updatedAddon);
  } catch (error) {
    console.error("Error updating addon prices:", error);
    return NextResponse.json(
      { error: "Failed to update addon prices" },
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
    // Deactivate the addon instead of deleting it
    await prisma.addon.update({
      where: { stripeProductId: id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deactivating addon:", error);
    return NextResponse.json(
      { error: "Failed to deactivate addon" },
      { status: 500 }
    );
  }
}

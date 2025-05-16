import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { prisma } from "@/lib/prisma";
import { Price } from "@/types/price";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const addons = await prisma.addon.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        metadata: true,
        key: true,
        feature: true,
        stripeProductId: true,
        prices: true,
      },
    });

    return NextResponse.json(addons);
  } catch (error) {
    console.error("Error fetching addons:", error);
    return NextResponse.json(
      { error: "Failed to fetch addons" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { stripeProductId } = body;

    if (!stripeProductId) {
      return NextResponse.json(
        { error: "Missing stripeProductId in request body" },
        { status: 400 }
      );
    }

    const stripe = DIContainer.getInstance(DITypes.Stripe);

    // Fetch the product and prices from Stripe
    const product = await stripe.products.retrieve(stripeProductId);

    if (!product.metadata?.type || product.metadata.type !== "addon") {
      return NextResponse.json(
        { error: "Product is not an addon, missing metadata.type" },
        { status: 400 }
      );
    }

    const pricesList = await stripe.prices.list({
      product: stripeProductId,
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

    const addonService = DIContainer.getInstance(DITypes.AddonService);
    const addon = await addonService.createOrUpdate(product, formattedPrices);

    return NextResponse.json(addon);
  } catch (error) {
    console.error("Error creating/updating addon:", error);
    return NextResponse.json(
      { error: "Failed to create or update addon" },
      { status: 500 }
    );
  }
}

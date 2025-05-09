import { prisma, Prisma } from "@/lib/prisma";
import { Feature } from "@/types/feature";
import { Price } from "@/types/price";
import Stripe from "stripe";

export class AddonService {
  constructor() {}

  private getFeatureType(price: Stripe.Price) {
    if (price.billing_scheme === "tiered") {
      return "DEFAULT";
    }

    if (!price.recurring) throw new Error("Price has no recurring");

    if (price.recurring.usage_type === "licensed") {
      return "USAGE";
    }
    return "METERED";
  }

  // Create a new addon
  async createOrUpdate(product: Stripe.Product, prices: Price[]) {
    const { features: featuresString, ...metadata } =
      product.metadata as Stripe.Metadata & {
        features: string;
      };

    const features: Record<string, Feature> = JSON.parse(featuresString);

    if (metadata?.type !== "addon") {
      throw new Error("Product is not an addon, missing metadata.type");
    }

    if (!features || Object.keys(features).length === 0) {
      throw new Error(
        "Product doesn't have a features, missing metadata.features"
      );
    }

    const featureKeys = Object.keys(features);
    if (featureKeys.length > 1) {
      throw new Error(
        "Product has multiple features, only one feature is allowed for addons"
      );
    }

    // const price = await this.stripe.prices.retrieve(
    //   product.default_price as string
    // );

    const addonData: Prisma.AddonCreateInput = {
      name: product.name,
      description: product.description ?? null,
      stripeProductId: product.id,
      metadata: metadata,
      key: featureKeys[0],
      feature: features[featureKeys[0]] as any,
      // JSON.stringify({
      //   ...features[featureKeys[0]],
      //   type: this.getFeatureType(price),
      // }),
      prices: prices as any,
      isActive: true,
    };

    return prisma.addon.upsert({
      where: { stripeProductId: product.id },
      create: addonData,
      update: addonData,
    });
  }

  async updatePrices(stripeProductId: string, prices: Price[]) {
    return prisma.addon.update({
      where: { stripeProductId },
      data: {
        prices: prices as any,
      },
    });
  }

  async getAddonsById(ids: string[]) {
    return prisma.addon.findMany({
      where: { id: { in: ids } },
    });
  }

  async getAddonById(id: string) {
    return prisma.addon.findUnique({
      where: { id },
    });
  }

  async addonExists(stripeProductId: string) {
    const addon = await prisma.addon.findUnique({
      where: { stripeProductId },
      select: { id: true },
    });
    return !!addon;
  }
}

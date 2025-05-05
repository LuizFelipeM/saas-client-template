import { Feature } from "@/types/feature";
import Stripe from "stripe";
import { prisma, Prisma } from "../lib/prisma";
import { Addon, AddonValue, ConfigureAddonInput } from "../types/addon";

export class AddonService {
  constructor(private readonly stripe: Stripe) {}

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
  async createOrUpdate(product: Stripe.Product) {
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
      isActive: true,
    };

    return prisma.addon.upsert({
      where: { stripeProductId: product.id },
      create: addonData,
      update: addonData,
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

  // Configure an addon for a subscription
  async configureAddon(input: ConfigureAddonInput): Promise<void> {
    const { subscriptionId, addonId, value } = input;

    // Check if the addon exists and is active
    const addon = await prisma.addon.findUnique({
      where: { id: addonId },
    });

    if (!addon || !addon.isActive) {
      throw new Error("Addon not found or inactive");
    }

    // Validate the value based on feature type
    // this.validateAddonValue(addon, value);

    // Upsert the subscription addon
    // await prisma.subscriptionAddon.upsert({
    //   where: {
    //     subscriptionId_addonId: {
    //       subscriptionId,
    //       addonId,
    //     },
    //   },
    //   create: {
    //     subscriptionId,
    //     addonId,
    //     value,
    //   },
    //   update: {
    //     value,
    //   },
    // });
  }

  // Remove an addon from a subscription
  async removeAddonFromSubscription(
    subscriptionId: string,
    addonId: string
  ): Promise<void> {
    await prisma.subscriptionAddon.delete({
      where: {
        subscriptionId_addonId: {
          subscriptionId,
          addonId,
        },
      },
    });
  }

  // Get all addons for a subscription
  // async getSubscriptionAddons(subscriptionId: string) {
  //   return prisma.subscriptionAddon.findMany({
  //     where: { subscriptionId },
  //     include: { addon: true },
  //   });
  // }

  // Validate addon value based on feature type and metadata
  private validateAddonValue(addon: Addon, value: AddonValue): void {
    const { featureType, metadata } = addon;

    switch (featureType) {
      case "DEFAULT":
        if (typeof value.enabled !== "boolean") {
          throw new Error(
            "DEFAULT type addons require an enabled boolean value"
          );
        }
        break;

      case "USAGE":
        if (typeof value.quantity !== "number") {
          throw new Error("USAGE type addons require a quantity number value");
        }
        if (metadata) {
          if (metadata.min !== undefined && value.quantity < metadata.min) {
            throw new Error(`Quantity must be at least ${metadata.min}`);
          }
          if (metadata.max !== undefined && value.quantity > metadata.max) {
            throw new Error(`Quantity must be at most ${metadata.max}`);
          }
          if (
            metadata.step !== undefined &&
            value.quantity % metadata.step !== 0
          ) {
            throw new Error(`Quantity must be a multiple of ${metadata.step}`);
          }
        }
        break;

      case "METERED":
        if (value.customValue === undefined) {
          throw new Error("METERED type addons require a customValue");
        }
        break;

      default:
        throw new Error(`Invalid feature type: ${featureType}`);
    }
  }
}

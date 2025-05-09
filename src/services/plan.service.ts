import { prisma, Prisma } from "@/lib/prisma";
import { Feature } from "@/types/feature";
import { Price } from "@/types/price";
import Stripe from "stripe";

export class PlanService {
  constructor() {}

  async createOrUpdate(product: Stripe.Product, prices: Price[]) {
    const { features: featuresString, ...metadata } =
      product.metadata as Stripe.Metadata & {
        features: string; // JSON string
      };

    const features: Record<string, Feature> = JSON.parse(featuresString);

    if (metadata?.type !== "plan") {
      throw new Error("Product is not a plan, missing metadata.type");
    }

    if (!features) {
      throw new Error(
        "Product doesn't have features, missing metadata.features"
      );
    }

    const planData: Prisma.PlanCreateInput = {
      name: product.name,
      description: product.description ?? null,
      stripeProductId: product.id,
      metadata,
      features: features as any,
      prices: prices as any,
      isActive: true,
    };

    return prisma.plan.upsert({
      where: { stripeProductId: product.id },
      create: planData,
      update: planData,
    });
  }

  async updatePrices(stripeProductId: string, prices: Price[]) {
    return prisma.plan.update({
      where: { stripeProductId },
      data: {
        prices: prices as any,
      },
    });
  }

  async getFeatures(planId: string) {
    const plan = await prisma.plan.findUnique({
      select: { features: true },
      where: { id: planId },
    });
    return plan?.features;
  }

  async getPlanById(planId: string) {
    return prisma.plan.findUnique({
      where: { id: planId },
    });
  }

  async planExists(stripeProductId: string) {
    const plan = await prisma.plan.findUnique({
      where: { stripeProductId },
      select: { id: true },
    });
    return !!plan;
  }
}

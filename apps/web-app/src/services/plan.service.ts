import { prisma, Prisma } from "@/lib/prisma";
import { Feature } from "@/types/feature";
import { Price } from "@/types/price";
import { injectable } from "inversify";
import Stripe from "stripe";

@injectable()
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
      features: features as unknown as Prisma.JsonObject,
      prices: prices as unknown as Prisma.JsonObject,
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
        prices: prices as unknown as Prisma.JsonObject,
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

  async getById(planId: string) {
    return prisma.plan.findUnique({
      where: { id: planId },
    });
  }

  async getActivePlanById(planId: string) {
    return prisma.plan.findUnique({
      where: { id: planId, isActive: true },
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

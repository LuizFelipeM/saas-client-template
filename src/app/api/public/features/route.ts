import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { prisma } from "@/lib/prisma";
import { FeatureService } from "@/services/feature/feature.service";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId")!;
  const addonIds = searchParams.get("addonIds")!.split(",");

  const plan = await prisma.plan.findUniqueOrThrow({
    where: { id: planId },
  });

  const addons = await prisma.addon.findMany({
    where: { id: { in: addonIds } },
  });

  const featureService = DIContainer.getInstance<FeatureService>(
    DITypes.FeatureService
  );
  const features = featureService.generateSubscriptionFeatures(plan, addons);

  return NextResponse.json(features);
}

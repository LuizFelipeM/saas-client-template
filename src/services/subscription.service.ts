import { prisma, SubscriptionStatus } from "@/lib/prisma";
import Stripe from "stripe";
import { AddonService } from "./addon.service";
import { FeatureService } from "./feature/feature.service";
import { PlanService } from "./plan.service";

type StripeSubscription = Stripe.Subscription & {
  current_period_end: number;
};

export class SubscriptionService {
  constructor(
    private readonly stripe: Stripe,
    private readonly planService: PlanService,
    private readonly addonService: AddonService,
    private readonly featureService: FeatureService
  ) {}

  async completeSession(session: Stripe.Checkout.Session) {
    if (!session.metadata) {
      throw new Error("Missing metadata in checkout session");
    }

    const planId: string = session.metadata.planId;
    const addonIds: string[] = JSON.parse(session.metadata.addonIds);
    const companyId: string = session.metadata.companyId;

    if (!planId || !companyId) {
      throw new Error("Missing planId or companyId in session metadata");
    }

    // Get subscription details
    const subscriptionId = session.subscription as string;
    const subscription = (await this.stripe.subscriptions.retrieve(
      subscriptionId
    )) as unknown as StripeSubscription;

    if (!subscription) {
      throw new Error("Failed to retrieve subscription");
    }

    const plan = await this.planService.getPlanById(planId);
    if (!plan) {
      throw new Error("Plan not found");
    }

    const addons = await this.addonService.getAddonsById(addonIds);
    const features = this.featureService.generateSubscriptionFeatures(
      plan,
      addons
    );

    if (!features || (Array.isArray(features) && features.length === 0)) {
      throw new Error("Plan not found");
    }

    await prisma.subscription.create({
      data: {
        companyId,
        planId,
        status: "TRIALING",
        stripeSubscriptionId: subscriptionId,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        features: JSON.stringify(features),
      },
    });
  }

  async invoicePaid(subscriptionId: string) {
    if (!subscriptionId) {
      throw new Error("No subscription ID found in invoice");
    }

    const subscription = (await this.stripe.subscriptions.retrieve(
      subscriptionId
    )) as unknown as StripeSubscription;

    if (!subscription) {
      throw new Error("Failed to retrieve subscription");
    }

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: "ACTIVE",
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  async subscriptionUpdated(subscription: Stripe.Subscription) {
    if (!subscription.metadata) {
      throw new Error("Missing metadata in subscription");
    }

    const planId = subscription.metadata.planId;
    const companyId = subscription.metadata.companyId;

    if (!planId || !companyId) {
      throw new Error("Missing planId or companyId in subscription metadata");
    }

    const features = await this.planService.getFeatures(planId);

    if (!features || (Array.isArray(features) && features.length === 0)) {
      throw new Error("Plan not found");
    }

    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        planId,
        status: subscription.status.toUpperCase() as SubscriptionStatus,
        currentPeriodEnd: new Date(
          (subscription as StripeSubscription).current_period_end * 1000
        ),
        features,
      },
    });
  }

  async subscriptionDeleted(subscription: Stripe.Subscription) {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: "CANCELED",
      },
    });
  }
}

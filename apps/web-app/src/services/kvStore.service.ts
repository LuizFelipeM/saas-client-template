import { DITypes } from "@/lib/di.container.types";
import { Redis } from "@upstash/redis";
import { inject, injectable } from "inversify";
import Stripe from "stripe";

type StripeSubscription = Stripe.Subscription & {
  current_period_start: number;
  current_period_end: number;
};

@injectable()
export class KVStoreService {
  constructor(
    @inject(DITypes.Redis)
    private readonly redis: Redis,
    @inject(DITypes.Stripe)
    private readonly stripe: Stripe
  ) {}

  async updateSubscription(customerId: string) {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        limit: 1,
        status: "all",
        expand: ["data.default_payment_method"],
      });

      if (subscriptions.data.length === 0) {
        await this.redis.set(customerId, { status: "none" });
        return { status: "none" };
      }

      const subscription = subscriptions
        .data[0] as unknown as StripeSubscription;
      const subscriptionData = {
        subscriptionId: subscription.id,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        paymentMethod:
          subscription.default_payment_method &&
          typeof subscription.default_payment_method !== "string"
            ? {
                brand: subscription.default_payment_method.card?.brand ?? null,
                last4: subscription.default_payment_method.card?.last4 ?? null,
              }
            : null,
      };

      await this.redis.set(customerId, subscriptionData);
      return subscriptionData;
    } catch (error) {
      console.error("Error updating Stripe Subscription data:", error);
      throw error;
    }
  }

  async getSubscription(customerId: string) {
    const subscription = await this.redis.get(customerId);
    return subscription || { status: "none" };
  }
}

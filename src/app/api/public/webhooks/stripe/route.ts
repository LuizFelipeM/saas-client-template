import { AddonService } from "@/services/addon.service";
import { FeatureService } from "@/services/feature/feature.service";
import { PlanService } from "@/services/plan.service";
import { SubscriptionService } from "@/services/subscription.service";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Define custom types for Stripe responses

type StripeInvoice = Stripe.Invoice & {
  subscription: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    const planService = new PlanService();
    const addonService = new AddonService(stripe);
    const featureService = new FeatureService();
    const subscriptionService = new SubscriptionService(
      stripe,
      planService,
      addonService,
      featureService
    );

    try {
      switch (event.type) {
        case "product.created":
        case "product.updated": {
          const product = event.data.object;

          if (!product.metadata?.type) {
            throw new Error("Product missing metadata.type");
          }

          if (product.metadata.type === "plan") {
            await planService.createOrUpdate(product);
          } else {
            await addonService.createOrUpdate(product);
          }

          break;
        }

        case "checkout.session.completed": {
          const session = event.data.object;
          await subscriptionService.completeSession(session);
          break;
        }

        case "invoice.paid": {
          const invoice = event.data.object as StripeInvoice;
          const subscriptionId = invoice.subscription;
          await subscriptionService.invoicePaid(subscriptionId);
          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object;
          await subscriptionService.subscriptionUpdated(subscription);
          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object;
          await subscriptionService.subscriptionDeleted(subscription);
          break;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      throw error;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

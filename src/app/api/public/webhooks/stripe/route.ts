import { Prisma, prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Define custom types for Stripe responses
type StripeSubscription = Stripe.Subscription & {
  current_period_end: number;
};

type StripeInvoice = Stripe.Invoice & {
  subscription: string;
};

// Helper function to create or update a plan
async function createOrUpdatePlan(product: Stripe.Product) {
  const features = product.metadata?.features
    ? JSON.parse(product.metadata.features)
    : [];

  delete product.metadata?.features;

  const planData: Prisma.PlanCreateInput = {
    name: product.name,
    description: product.description ?? null,
    stripeProductId: product.id,
    metadata: product.metadata,
    features,
    isActive: true,
  };

  return prisma.plan.upsert({
    where: { stripeProductId: product.id },
    create: planData,
    update: planData,
  });
}

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

    // Handle different event types
    switch (event.type) {
      case "product.created":
      case "product.updated": {
        await createOrUpdatePlan(event.data.object);
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (!session.metadata) {
          console.error("Missing metadata in checkout session");
          return NextResponse.json(
            { error: "Missing metadata in checkout session" },
            { status: 400 }
          );
        }

        const planId = session.metadata.planId;
        const companyId = session.metadata.companyId;

        if (!planId || !companyId) {
          console.error("Missing planId or companyId in session metadata");
          return NextResponse.json(
            { error: "Missing planId or companyId in session metadata" },
            { status: 400 }
          );
        }

        // Get subscription details
        const subscriptionId = session.subscription as string;
        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId
        )) as unknown as StripeSubscription;

        if (!subscription) {
          console.error("Failed to retrieve subscription");
          return NextResponse.json(
            { error: "Failed to retrieve subscription" },
            { status: 400 }
          );
        }

        // Get the plan to copy its features
        const plan = await prisma.plan.findUnique({
          where: { id: planId },
          select: { features: true },
        });

        if (!plan) {
          console.error("Plan not found");
          return NextResponse.json(
            { error: "Plan not found" },
            { status: 404 }
          );
        }

        await prisma.subscription.create({
          data: {
            companyId,
            planId,
            status: "TRIALING",
            stripeSubscriptionId: subscriptionId,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            features: plan.features as Prisma.InputJsonValue,
          },
        });
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as StripeInvoice;

        // Get the subscription ID from the invoice's subscription property
        const subscriptionId = invoice.subscription;

        if (!subscriptionId) {
          console.error("No subscription ID found in invoice");
          return NextResponse.json(
            { error: "No subscription ID found in invoice" },
            { status: 400 }
          );
        }

        // Get the subscription to get the current period end
        const subscription = (await stripe.subscriptions.retrieve(
          subscriptionId
        )) as unknown as StripeSubscription;

        if (!subscription) {
          console.error("Failed to retrieve subscription");
          return NextResponse.json(
            { error: "Failed to retrieve subscription" },
            { status: 400 }
          );
        }

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: "ACTIVE",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as StripeSubscription;

        if (!subscription.metadata) {
          console.error("Missing metadata in subscription");
          return NextResponse.json(
            { error: "Missing metadata in subscription" },
            { status: 400 }
          );
        }

        const planId = subscription.metadata.planId;
        const companyId = subscription.metadata.companyId;

        if (!planId || !companyId) {
          console.error("Missing planId or companyId in subscription metadata");
          break;
        }

        // Get the plan to copy its features
        const plan = await prisma.plan.findUnique({
          where: { id: planId },
          select: { features: true },
        });

        if (!plan) {
          console.error("Plan not found");
          return NextResponse.json(
            { error: "Plan not found" },
            { status: 404 }
          );
        }

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            planId,
            status: subscription.status.toUpperCase() as any,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            features: plan.features as Prisma.InputJsonValue,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "CANCELED",
          },
        });
        break;
      }
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

import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { waitUntil } from "@vercel/functions";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// type StripeInvoice = Stripe.Invoice & {
//   subscription: string;
// };

const allowedEvents: Stripe.Event.Type[] = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.pending_update_applied",
  "customer.subscription.pending_update_expired",
  "customer.subscription.trial_will_end",
  "invoice.paid",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
  "invoice.payment_action_required",
  "invoice.upcoming",
  "invoice.marked_uncollectible",
  "payment_intent.succeeded",
  "payment_intent.payment_failed",
  "payment_intent.canceled",
];

async function processEvent(event: Stripe.Event) {
  if (!allowedEvents.includes(event.type)) {
    console.log(`[STRIPE WEBHOOK] Ignoring event type ${event.type}`);
    return;
  }

  const { customer: customerId } = event.data.object as { customer: string };

  if (typeof customerId !== "string") {
    throw new Error(
      `[STRIPE WEBHOOK] ID isn't a string.\nEvent type: ${event.type}`
    );
  }

  const kvStoreService = DIContainer.getInstance(DITypes.KVStoreService);

  return await kvStoreService.updateSubscription(customerId);
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

    const stripe = DIContainer.getInstance(DITypes.Stripe);

    // Verify webhook signature
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      waitUntil(processEvent(event));
    } catch (error) {
      console.error("[STRIPE WEBHOOK] Error processing webhook:", error);
    }

    // const subscriptionService = DIContainer.getInstance(
    //   DITypes.SubscriptionService
    // );

    // try {
    //   switch (event.type) {
    //     case "checkout.session.completed": {
    //       const session = event.data.object;
    //       await subscriptionService.completeSession(session);
    //       break;
    //     }

    //     case "invoice.paid": {
    //       const invoice = event.data.object as StripeInvoice;
    //       const subscriptionId = invoice.subscription;
    //       await subscriptionService.invoicePaid(subscriptionId);
    //       break;
    //     }

    //     case "customer.subscription.updated": {
    //       const subscription = event.data.object;
    //       await subscriptionService.subscriptionUpdated(subscription);
    //       break;
    //     }

    //     case "customer.subscription.deleted": {
    //       const subscription = event.data.object;
    //       await subscriptionService.subscriptionDeleted(subscription);
    //       break;
    //     }
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     console.error(error);
    //     return NextResponse.json({ error: error.message }, { status: 400 });
    //   }

    //   throw error;
    // }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

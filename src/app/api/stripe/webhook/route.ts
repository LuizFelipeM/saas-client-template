import { handleWebhookEvent } from "@/lib/services/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  try {
    const body = await request.text();
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    const { success, event } = await handleWebhookEvent(
      body,
      signature,
      endpointSecret
    );

    if (!success || !event) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle specific events
    switch (event.type) {
      case "checkout.session.completed":
        // Payment is successful and the subscription is created.
        const checkoutSession = event.data.object as any;
        console.log("Checkout session completed:", checkoutSession.id);

        // Here you would typically:
        // 1. Match the checkout session to your internal records
        // 2. Provision access to the purchased plan
        // 3. Update user subscription status
        break;

      case "customer.subscription.updated":
        // Subscription is updated (e.g., plan change, quantity change)
        const subscription = event.data.object as any;
        console.log("Subscription updated:", subscription.id);

        // Update the subscription status in your database
        break;

      case "invoice.payment_succeeded":
        // Customer's payment succeeded
        const invoice = event.data.object as any;
        console.log("Invoice payment succeeded:", invoice.id);

        // Credit the customer's account or extend their access period
        break;

      case "invoice.payment_failed":
        // Customer's payment failed
        const failedInvoice = event.data.object as any;
        console.log("Invoice payment failed:", failedInvoice.id);

        // Notify the customer and try to recover the payment
        break;
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

// Stripe typically expects you to return a 200 status for webhook requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

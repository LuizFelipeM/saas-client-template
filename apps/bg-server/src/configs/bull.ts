import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { stripeWebhookQueue } from "../jobs/stripe-webhook/stripeWebhook.queue";

export const serverAdapter = new ExpressAdapter();

createBullBoard({
  queues: [new BullMQAdapter(stripeWebhookQueue)],
  serverAdapter,
});

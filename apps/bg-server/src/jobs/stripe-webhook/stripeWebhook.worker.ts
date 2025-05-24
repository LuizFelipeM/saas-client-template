import { Worker } from "bullmq";
import { stripeWebhookQueue } from "./stripeWebhook.queue";

export const stripeWebhookWorker = new Worker(
  stripeWebhookQueue.name,
  async (job) => {
    console.log(`Processing job ${job.id}`);
    // Add your job processing logic here
    return { processed: true, jobId: job.id };
  }
);

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing Stripe Webhook queues and workers...");
  await stripeWebhookQueue.close();
  await stripeWebhookWorker.close();
  process.exit(0);
});

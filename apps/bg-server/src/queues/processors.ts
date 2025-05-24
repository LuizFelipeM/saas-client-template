import { queueManager, SharedQueues } from "@packages/queues";

export const initializeQueueProcessors = () => {
  // Create queues (same as in web-app)
  queueManager.createWorker(
    SharedQueues.STRIPE_WEBHOOKS,
    async (job, token) => {
      // Process email job
      console.log("queueManager.createWorker worker");
      job.log(`Processing stripe event: ${JSON.stringify(job.data, null, 2)}`);
      // Add your email sending logic here
    }
  );

  // Add more workers as needed

  // Handle cleanup on process termination
  process.on("SIGTERM", async () => {
    await queueManager.close();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    await queueManager.close();
    process.exit(0);
  });
};

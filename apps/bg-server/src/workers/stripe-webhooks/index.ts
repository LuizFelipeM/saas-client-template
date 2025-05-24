import { Job } from "bullmq";

// Create queues (same as in web-app)
export default async (job: Job, token: string) => {
  // Process email job
  console.log("queueManager.createWorker worker");
  job.log(`Processing stripe event: ${JSON.stringify(job.data, null, 2)}`);
  // Add your email sending logic here
};

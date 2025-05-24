import { queueManager } from "@packages/queues";

// Initialize queues
export const initializeQueues = () => {
  // Create your queues here
  queueManager.createQueue({
    name: "email-queue",
  });

  // Add more queues as needed
};

// Helper function to add jobs to queues
export const addEmailJob = async (data: {
  to: string;
  subject: string;
  body: string;
}) => {
  await queueManager.addJob("email-queue", data);
};

// Add more helper functions for other queues as needed

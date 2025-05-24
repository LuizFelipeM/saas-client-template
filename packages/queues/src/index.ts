import { QueueManager } from "./QueueManager";
export * from "./SharedQueues";

// Export a singleton instance
export const queueManager = QueueManager.getInstance();

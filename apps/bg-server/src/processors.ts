import { queueManager, SharedQueues } from "@packages/queues";
import fs from "node:fs";
import path from "node:path";

export const registerWorkers = () => {
  // Register workers for shared queues
  const sharedQueues = Object.values(SharedQueues);
  sharedQueues.forEach(async (queue) => {
    try {
      const module = await import(`./workers/${queue}`);
      queueManager.createWorker(queue, module.default);
    } catch (error) {
      console.error(`Error importing worker for Shared Queue ${queue}:`, error);
    }
  });

  // Register workers from the workers directory
  fs.readdirSync(path.join(__dirname, "workers"))
    .filter((file) => !sharedQueues.includes(file as SharedQueues))
    .forEach(async (file) => {
      try {
        const module = await import(`./workers/${file}`);

        queueManager.createQueue({ name: file });
        queueManager.createWorker(file, module.default);
      } catch (error) {
        console.error(`Error importing worker for queue ${file}:`, error);
      }
    });

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

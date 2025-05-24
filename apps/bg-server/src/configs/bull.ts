import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { queueManager } from "@packages/queues";

export const serverAdapter = new ExpressAdapter();

const { addQueue, removeQueue } = createBullBoard({
  queues: queueManager.getAllQueues().map((queue) => new BullMQAdapter(queue)),
  serverAdapter,
});

queueManager.subscribe("queueCreated", (queue) => {
  addQueue(new BullMQAdapter(queue));
});

queueManager.subscribe("queueRemoved", (queue) => {
  removeQueue(new BullMQAdapter(queue));
});

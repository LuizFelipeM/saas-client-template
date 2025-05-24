import { Queue, Worker } from "bullmq";

export interface QueueConfig {
  name: string;
}

export interface QueueMessage<T = any> {
  data: T;
  timestamp: number;
}

export interface Subscriber {
  on(context: any): void;
}

export type QueueManagerEvent =
  | "queueCreated"
  | "queueRemoved"
  | "workerCreated"
  | "workerRemoved"
  | "newListener"
  | "removeListener"
  | "queueManagerClosed";

export type QueueManagerListener = {
  queueEvent: (queue: Queue) => void;
  workerEvent: (worker: Worker) => void;
  listenerEvent: (event: QueueManagerEvent, listener: Function) => void;
  queueManagerClosed: () => void;
};

import { Job, Queue, Worker } from "bullmq";
import { EventEmitter } from "events";
import { Redis } from "ioredis";
import { SharedQueues } from "./SharedQueues";
import {
  QueueConfig,
  QueueManagerEvent,
  QueueManagerListener,
  QueueMessage,
} from "./types";

export class QueueManager extends EventEmitter {
  private static instance: QueueManager;
  private readonly queues: Map<string, Queue> = new Map();
  private readonly connection: Redis;

  private constructor() {
    super();

    if (!process.env.REDIS_HOST) {
      throw new Error("REDIS_HOST environment variable is not set");
    }

    this.connection = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || "6379"),
      maxRetriesPerRequest: null,
    });

    Object.values(SharedQueues).forEach((queue) => {
      this.createQueue({ name: queue });
    });
  }

  subscribe<E extends QueueManagerEvent>(
    event: E,
    listener: E extends "queueCreated" | "queueRemoved"
      ? QueueManagerListener["queueEvent"]
      : E extends "workerCreated" | "workerRemoved" | "workerUpdated"
      ? QueueManagerListener["workerEvent"]
      : E extends "newListener" | "removeListener"
      ? QueueManagerListener["listenerEvent"]
      : E extends "queueManagerClosed"
      ? QueueManagerListener["queueManagerClosed"]
      : never
  ): void {
    this.on(event, listener);
    this.notify("newListener", event, listener);
  }

  unsubscribe(event: QueueManagerEvent, listener: (...args: any[]) => void) {
    this.off(event, listener);
    this.notify("removeListener", event, listener);
  }

  private notify(event: QueueManagerEvent, ...data: any[]) {
    this.emit(event, ...data);
  }

  static getInstance(): QueueManager {
    if (!QueueManager.instance) {
      QueueManager.instance = new QueueManager();
    }
    return QueueManager.instance;
  }

  createQueue<T = any>(config: QueueConfig): Queue<T> {
    if (this.queues.has(config.name)) {
      return this.queues.get(config.name) as Queue<T>;
    }

    const queue = new Queue<T>(config.name, {
      connection: this.connection,
    });

    this.queues.set(config.name, queue);

    this.notify("queueCreated", queue);

    return queue;
  }

  getAllQueues(): Queue[] {
    return Array.from(this.queues.values());
  }

  getQueue<T = any>(name: string): Queue<T> | undefined {
    return this.queues.get(name) as Queue<T>;
  }

  async addJob<T = any>(
    queueName: string,
    data: T,
    options?: { delay?: number }
  ): Promise<void> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const message: QueueMessage<T> = {
      data,
      timestamp: Date.now(),
    };

    await queue.add("job", message, {
      delay: options?.delay,
    });
  }

  createWorker<
    DataType = any,
    ResultType = any,
    NameType extends string = string
  >(
    queueName: string,
    processor?: (
      job: Job<DataType, ResultType, NameType>,
      token?: string
    ) => Promise<ResultType>,
    opts?: Omit<WorkerOptions, "connection">
  ): Worker<DataType, ResultType, NameType> {
    const queue = this.queues.get(queueName);
    if (!queue) {
      throw new Error(`Queue ${queueName} not found`);
    }

    const worker = new Worker<DataType, ResultType, NameType>(
      queueName,
      processor,
      {
        ...opts,
        connection: this.connection,
      }
    );

    this.notify("workerCreated", worker);

    return worker;
  }

  async close(): Promise<void> {
    await Promise.all([
      ...Array.from(this.queues.values()).map((queue) => queue.close()),
    ]);

    this.notify("queueManagerClosed");
  }
}

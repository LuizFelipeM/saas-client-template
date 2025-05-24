import { Queue } from "bullmq";
import IORedis from "ioredis";

export const stripeWebhookQueue = new Queue("stripe-webhook-queue", {
  connection: new IORedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
  }),
});

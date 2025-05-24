# Queues Package

This package provides a shared queue implementation using BullMQ for communication between the Next.js app and the background server.

## Installation

The package is part of the monorepo and can be used by other packages by adding it as a dependency:

```json
{
  "dependencies": {
    "@packages/queues": "workspace:*"
  }
}
```

## Usage

### Creating a Queue

```typescript
import { queueManager } from '@packages/queues';

// Create a queue
const queue = queueManager.createQueue({
  name: 'my-queue',
  redisUrl: 'redis://localhost:6379'
});
```

### Adding Jobs to a Queue

```typescript
// Add a job to the queue
await queueManager.addJob('my-queue', {
  // your data here
  someData: 'value'
});

// Add a delayed job
await queueManager.addJob('my-queue', {
  someData: 'value'
}, {
  delay: 5000 // 5 seconds delay
});
```

### Processing Jobs

```typescript
// Create a worker to process jobs
const worker = queueManager.createWorker('my-queue', async (job) => {
  const { data } = job.data;
  // Process the job
  console.log('Processing job:', data);
});
```

### Cleanup

```typescript
// Close all queues when shutting down
await queueManager.close();
```

## Configuration

The package requires a Redis instance to be running. Make sure to provide the correct Redis URL when creating queues.

## Types

The package exports the following types:

- `QueueConfig`: Configuration for creating a queue
- `QueueMessage`: Type for queue messages 
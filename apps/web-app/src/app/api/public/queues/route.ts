import { queueManager, SharedQueues } from "@packages/queues";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Add job to queue
    await queueManager.addJob(SharedQueues.STRIPE_WEBHOOKS, body);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding job to queue:", error);
    return NextResponse.json(
      { error: "Failed to add job to queue" },
      { status: 500 }
    );
  }
}

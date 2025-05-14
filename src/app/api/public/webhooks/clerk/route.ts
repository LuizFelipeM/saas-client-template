import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { UserRole } from "@/lib/prisma";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

export async function POST(req: Request) {
  try {
    const clerkWebhook = new Webhook(process.env.CLERK_SIGNING_SECRET!);
    const body = await req.text();
    const headersList = (await headers())
      .entries()
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const event = clerkWebhook.verify(body, headersList) as WebhookEvent;

    const userService = DIContainer.getInstance(DITypes.UserService);
    const prisma = DIContainer.getInstance(DITypes.Prisma);

    switch (event.type) {
      case "user.created": {
        const email = event.data.primary_email_address_id;
        if (!email) {
          throw new Error("Email not found");
        }

        const organizationId = event.data.organization_memberships?.[0]?.id;
        const userId = event.data.id;

        await userService.create(userId, email);

        const organizationService = DIContainer.getInstance(
          DITypes.OrganizationService
        );
        if (organizationId) {
          const organization = await prisma.organization.findUnique({
            where: { clerkId: organizationId },
          });

          if (organization) {
            await organizationService.addUser(
              organization.id,
              userId,
              UserRole.VIEWER
            );
          } else {
            await organizationService.create("Organization Name", userId);
          }
        } else {
          await organizationService.create("Organization Name", userId);
        }
        break;
      }

      case "user.deleted": {
        const userId = event.data.id;
        if (userId) {
          await userService.delete(userId);
        }
        break;
      }
    }
  } catch (err) {
    console.error(`Error: Could not verify webhook: ${JSON.stringify(err)}`);
    throw NextResponse.json(
      { error: "Error: Verification error" },
      { status: 400 }
    );
  }
}

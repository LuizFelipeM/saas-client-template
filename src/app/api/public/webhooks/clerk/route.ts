import { DIContainer } from "@/lib/di.container";
import { DITypes } from "@/lib/di.container.types";
import { UserRole } from "@/lib/prisma";
import { isClerkError } from "@/lib/utils";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const event = await verifyWebhook(req);

    const userService = DIContainer.getInstance(DITypes.UserService);
    const prisma = DIContainer.getInstance(DITypes.Prisma);

    switch (event.type) {
      case "user.created": {
        const email = event.data.email_addresses[0].email_address;
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

    return NextResponse.json(undefined, { status: 204 });
  } catch (err) {
    console.error("Error: Could not process webhook.\n", err);
    if (isClerkError(err)) {
      console.error("Clerk error: ", JSON.stringify(err, null, 2));
    }

    return NextResponse.json(
      { error: "Error: Could not process webhook" },
      { status: 400 }
    );
  }
}

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

        const errors: Error[] = [];

        try {
          await userService.sync(userId, email);
        } catch (error) {
          console.error("Error: Could not sync user.\n", error);
          errors.push(error as Error);
        }

        try {
          const organizationService = DIContainer.getInstance(
            DITypes.OrganizationService
          );

          const organizationName = `${
            event.data.first_name ??
            event.data.email_addresses[0].email_address.split("@")[0]
          }'s Organization`;

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
              await organizationService.create(organizationName, userId);
            }
          } else {
            await organizationService.create(organizationName, userId);
          }
        } catch (error) {
          console.error("Error: Could not create organization.\n", error);
          errors.push(error as Error);
        }

        if (errors.length > 0) {
          throw new AggregateError(
            errors,
            "Error: Could not sync user and create organization."
          );
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

    return new Response(null, { status: 204 });
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

import { prisma, UserRole } from "@/lib/prisma";
import { Permit } from "permitio";

const permit = new Permit({
  token: process.env.PERMIT_API_KEY!,
  pdp: process.env.PERMIT_PDP_URL!,
});

export async function syncUserRolesToPermit() {
  try {
    // Fetch all company users with their roles
    const companyUsers = await prisma.companyUser.findMany({
      include: {
        user: true,
        company: true,
      },
    });

    // Sync each user's roles to Permit
    for (const companyUser of companyUsers) {
      await permit.api.syncUser({
        key: companyUser.user.clerkUserId,
        attributes: {
          email: companyUser.user.email,
          firstName: companyUser.user.firstName,
          lastName: companyUser.user.lastName,
        },
      });

      // Assign the user to the company with their role
      await permit.api.assignRole({
        user: companyUser.user.clerkUserId,
        role: companyUser.role.toLowerCase(),
        tenant: companyUser.company.id,
      });
    }
  } catch (error) {
    console.error("Error syncing roles to Permit:", error);
    throw error;
  }
}

export async function syncSingleUserRole(
  clerkUserId: string,
  companyId: string,
  role: UserRole
) {
  try {
    // Sync user to Permit
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await permit.api.syncUser({
      key: clerkUserId,
      attributes: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    // Assign role in the specific company
    await permit.api.assignRole({
      user: clerkUserId,
      role: role.toLowerCase(),
      tenant: companyId,
    });
  } catch (error) {
    console.error("Error syncing single user role to Permit:", error);
    throw error;
  }
}

export async function removeUserRole(clerkUserId: string, companyId: string) {
  try {
    await permit.api.unassignRole({
      user: clerkUserId,
      role: "*", // Remove all roles
      tenant: companyId,
    });
  } catch (error) {
    console.error("Error removing user role from Permit:", error);
    throw error;
  }
}

// Helper function to check permissions
export async function checkPermission(
  clerkUserId: string,
  companyId: string,
  action: string
) {
  try {
    const result = await permit.check(clerkUserId, action, {
      type: "company",
      key: companyId,
    });
    return result;
  } catch (error) {
    console.error("Error checking permission:", error);
    throw error;
  }
}

import {
  Organization,
  OrganizationUser,
  Plan,
  prisma,
  Subscription,
  User,
} from "@/lib/prisma";
import { useQuery } from "@tanstack/react-query";

export type OrganizationWithUsers = Organization & {
  users: (OrganizationUser & {
    user: User;
  })[];
};

export type OrganizationWithSubscription = Organization & {
  subscriptions: (Subscription & {
    plan: Plan;
  })[];
};

export function useUserOrganizations(clerkUserId: string) {
  return useQuery({
    queryKey: ["userOrganizations", clerkUserId],
    queryFn: async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { clerkId: clerkUserId },
          include: {
            organizations: {
              include: {
                organization: true,
              },
            },
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        return user.organizations.map((organizationUser) => ({
          ...organizationUser.organization,
          role: organizationUser.role,
        }));
      } catch (error) {
        console.error("Error fetching user companies:", error);
        throw error;
      }
    },
    enabled: !!clerkUserId,
  });
}

export function useOrganizationUsers(organizationId: string) {
  return useQuery({
    queryKey: ["organizationUsers", organizationId],
    queryFn: async () => {
      try {
        const organization = await prisma.organization.findUnique({
          where: { id: organizationId },
          include: {
            users: {
              include: {
                user: true,
              },
            },
          },
        });

        if (!organization) {
          throw new Error("Organization not found");
        }

        return organization.users.map((organizationUser) => ({
          ...organizationUser.user,
          role: organizationUser.role,
        }));
      } catch (error) {
        console.error("Error fetching organization users:", error);
        throw error;
      }
    },
    enabled: !!organizationId,
  });
}

export function useOrganizationSubscription(organizationId: string) {
  return useQuery({
    queryKey: ["organizationSubscription", organizationId],
    queryFn: async () => {
      try {
        const organization = await prisma.organization.findUnique({
          where: { id: organizationId },
          include: {
            subscriptions: {
              where: {
                status: {
                  in: ["ACTIVE", "TRIALING"],
                },
              },
              // include: {
              // plan: true,
              // },
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
        });

        if (!organization) {
          throw new Error("Organization not found");
        }

        const currentSubscription = organization.subscriptions[0];

        if (!currentSubscription) {
          return null;
        }

        return {
          plan: currentSubscription.planId,
          status: currentSubscription.status,
        };
      } catch (error) {
        console.error("Error fetching organization subscription:", error);
        throw error;
      }
    },
    enabled: !!organizationId,
  });
}

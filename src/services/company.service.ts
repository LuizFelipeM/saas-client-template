import {
  Company,
  CompanyUser,
  Plan,
  prisma,
  Subscription,
  User,
} from "@/lib/prisma";

export type CompanyWithUsers = Company & {
  users: (CompanyUser & {
    user: User;
  })[];
};

export type CompanyWithSubscription = Company & {
  subscriptions: (Subscription & {
    plan: Plan;
  })[];
};

export async function getUserCompanies(clerkUserId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        companies: {
          include: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user.companies.map((companyUser) => ({
      ...companyUser.company,
      role: companyUser.role,
    }));
  } catch (error) {
    console.error("Error fetching user companies:", error);
    throw error;
  }
}

export async function getCompanyUsers(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company.users.map((companyUser) => ({
      ...companyUser.user,
      role: companyUser.role,
    }));
  } catch (error) {
    console.error("Error fetching company users:", error);
    throw error;
  }
}

export async function getCompanySubscription(companyId: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
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

    if (!company) {
      throw new Error("Company not found");
    }

    const currentSubscription = company.subscriptions[0];

    if (!currentSubscription) {
      return null;
    }

    return {
      plan: currentSubscription.planId,
      status: currentSubscription.status,
      currentPeriodEnd: currentSubscription.currentPeriodEnd,
      // metadata: currentSubscription.plan.metadata,
    };
  } catch (error) {
    console.error("Error fetching company subscription:", error);
    throw error;
  }
}

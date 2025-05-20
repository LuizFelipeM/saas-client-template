import { DITypes } from "@/lib/di.container.types";
import { PrismaClient, UserRole } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { inject, injectable } from "inversify";

@injectable()
export class OrganizationService {
  constructor(
    @inject(DITypes.Prisma)
    private readonly prisma: PrismaClient
  ) {}

  async getOrganization(id: string) {
    return await this.prisma.organization.findUnique({
      where: { id },
    });
  }

  async getByClerkId(clerkId: string) {
    return await this.prisma.organization.findUnique({
      where: { clerkId },
    });
  }

  async create(name: string, userId: string) {
    const clerk = await clerkClient();
    const clerkOrg = await clerk.organizations.createOrganization({
      name,
      createdBy: userId,
    });

    return await this.prisma.organization.create({
      data: {
        clerkId: clerkOrg.id,
        name: clerkOrg.name,
        slug: clerkOrg.slug,
      },
    });
  }

  async addUser(organizationId: string, userId: string, role: UserRole) {
    const clerk = await clerkClient();
    await clerk.organizations.createOrganizationMembership({
      organizationId,
      userId,
      role,
    });

    await this.prisma.organizationUser.create({
      data: { organizationId, userId, role },
    });
  }
}

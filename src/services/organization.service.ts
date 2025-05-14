import { DITypes } from "@/lib/di.container.types";
import { PrismaClient, UserRole } from "@/lib/prisma";
import type { ClerkClient } from "@clerk/backend";
import { inject, injectable } from "inversify";

@injectable()
export class OrganizationService {
  constructor(
    @inject(DITypes.Prisma)
    private readonly prisma: PrismaClient,
    @inject(DITypes.Clerk)
    private readonly clerk: ClerkClient
  ) {}

  async getOrganization(id: string) {
    return await this.prisma.organization.findUnique({
      where: { id },
    });
  }

  async create(name: string, userId: string) {
    const clerkOrg = await this.clerk.organizations.createOrganization({
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
    await this.clerk.organizations.createOrganizationMembership({
      organizationId,
      userId,
      role,
    });

    await this.prisma.organizationUser.create({
      data: { organizationId, userId, role },
    });
  }
}

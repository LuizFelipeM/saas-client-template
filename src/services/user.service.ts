import { DITypes } from "@/lib/di.container.types";
import { PrismaClient } from "@/lib/prisma";
import { inject, injectable } from "inversify";

@injectable()
export class UserService {
  constructor(
    @inject(DITypes.Prisma)
    private readonly prisma: PrismaClient
  ) {}

  async create(clerkUserId: string, email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email }],
      },
    });

    if (user) {
      throw new Error(`User ${email} already exists`);
    }

    return await this.prisma.user.create({
      data: { email, clerkId: clerkUserId },
    });
  }

  async delete(clerkUserId: string) {
    await this.prisma.user.delete({
      where: { clerkId: clerkUserId },
    });
  }
}

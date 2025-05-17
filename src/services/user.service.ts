import { DITypes } from "@/lib/di.container.types";
import { PrismaClient, User } from "@/lib/prisma";
import { inject, injectable } from "inversify";
import Stripe from "stripe";
@injectable()
export class UserService {
  constructor(
    @inject(DITypes.Prisma)
    private readonly prisma: PrismaClient,
    @inject(DITypes.Stripe)
    private readonly stripe: Stripe
  ) {}

  async sync(clerkUserId: string, email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email }],
      },
    });

    let stripeId: string | undefined = user?.stripeId ?? undefined;
    if (!stripeId) {
      try {
        stripeId = (
          await this.stripe.customers.create({
            email,
          })
        ).id;
      } catch (error) {
        console.error(error);
      }
    }

    return await this.prisma.user.upsert({
      where: { clerkId: clerkUserId },
      update: { email, stripeId },
      create: { email, clerkId: clerkUserId, stripeId },
    });
  }

  async getByClerkId(clerkId: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { clerkId },
    });
  }

  async delete(clerkUserId: string) {
    await this.prisma.user.delete({
      where: { clerkId: clerkUserId },
    });
  }
}

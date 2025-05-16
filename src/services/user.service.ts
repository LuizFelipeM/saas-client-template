import { DITypes } from "@/lib/di.container.types";
import { PrismaClient } from "@/lib/prisma";
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

  async create(clerkUserId: string, email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ clerkId: clerkUserId }, { email }],
      },
    });

    if (user) {
      throw new Error(`User ${email} already exists`);
    }

    let stripeId: string | null = null;
    try {
      stripeId = (
        await this.stripe.customers.create({
          email,
        })
      ).id;
    } catch (error) {
      console.error(error);
    }

    return await this.prisma.user.create({
      data: { email, clerkId: clerkUserId, stripeId },
    });
  }

  async delete(clerkUserId: string) {
    await this.prisma.user.delete({
      where: { clerkId: clerkUserId },
    });
  }
}

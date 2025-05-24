import { Prisma, PrismaClient } from "@/lib/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    email: "alice@prisma.io",
    clerkId: "user_2t34567890",
    organizations: {
      create: {
        role: "OWNER",
        organization: {
          create: {
            clerkId: "org_2t34567890",
            name: "Alice's Organization",
            slug: "alice-org",
          },
        },
      },
    },
  },
  {
    email: "bob.o.bobo@prisma.io",
    clerkId: "user_2t34567891",
    organizations: {
      create: {
        role: "VIEWER",
        organization: {
          connect: {
            clerkId: "org_2t34567890",
          },
        },
      },
    },
  },
  {
    email: "bob@prisma.io",
    clerkId: "user_2t34567892",
    organizations: {
      create: {
        role: "OWNER",
        organization: {
          create: {
            clerkId: "org_2t34567891",
            name: "Bob's Organization",
            slug: "bob-org",
          },
        },
      },
    },
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();

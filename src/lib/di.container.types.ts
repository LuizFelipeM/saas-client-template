import { AddonService } from "@/services/addon.service";
import { FeatureService } from "@/services/feature/feature.service";
import { OrganizationService } from "@/services/organization.service";
import { PlanService } from "@/services/plan.service";
import { SubscriptionService } from "@/services/subscription.service";
import { UserService } from "@/services/user.service";
import { ClerkClient } from "@clerk/backend";
import { Stripe } from "stripe";
import { PrismaClient } from "./prisma";

export const DITypes = {
  Clerk: "Clerk",
  Prisma: "Prisma",
  Stripe: "Stripe",
  AddonService: "AddonService",
  //   OrganizationService: "OrganizationService",
  //   PermitService: "PermitService",
  PlanService: "PlanService",
  SubscriptionService: "SubscriptionService",
  FeatureService: "FeatureService",
  OrganizationService: "OrganizationService",
  UserService: "UserService",
} as const;

export type ServiceTypes = {
  [DITypes.Clerk]: ClerkClient;
  [DITypes.Prisma]: PrismaClient;
  [DITypes.Stripe]: Stripe;
  [DITypes.AddonService]: AddonService;
  [DITypes.PlanService]: PlanService;
  [DITypes.SubscriptionService]: SubscriptionService;
  [DITypes.FeatureService]: FeatureService;
  [DITypes.OrganizationService]: OrganizationService;
  [DITypes.UserService]: UserService;
};

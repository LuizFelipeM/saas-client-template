import { AddonService } from "@/services/addon.service";
import { FeatureService } from "@/services/feature/feature.service";
import { KVStoreService } from "@/services/kvStore.service";
import { OrganizationService } from "@/services/organization.service";
import { PlanService } from "@/services/plan.service";
import { SubscriptionService } from "@/services/subscription.service";
import { UserService } from "@/services/user.service";
import { Redis } from "@upstash/redis";
import { Stripe } from "stripe";
import { PrismaClient } from "./prisma";

export const DITypes = {
  Prisma: "Prisma",
  Stripe: "Stripe",
  Redis: "Redis",
  AddonService: "AddonService",
  //   OrganizationService: "OrganizationService",
  //   PermitService: "PermitService",
  PlanService: "PlanService",
  SubscriptionService: "SubscriptionService",
  FeatureService: "FeatureService",
  OrganizationService: "OrganizationService",
  UserService: "UserService",
  KVStoreService: "KVStoreService",
} as const;

export type ServiceTypes = {
  [DITypes.Prisma]: PrismaClient;
  [DITypes.Stripe]: Stripe;
  [DITypes.Redis]: Redis;
  [DITypes.AddonService]: AddonService;
  [DITypes.PlanService]: PlanService;
  [DITypes.SubscriptionService]: SubscriptionService;
  [DITypes.FeatureService]: FeatureService;
  [DITypes.OrganizationService]: OrganizationService;
  [DITypes.UserService]: UserService;
  [DITypes.KVStoreService]: KVStoreService;
};

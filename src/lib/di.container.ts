import { AddonService } from "@/services/addon.service";
import { FeatureService } from "@/services/feature/feature.service";
import { OrganizationService } from "@/services/organization.service";
import { PlanService } from "@/services/plan.service";
import { SubscriptionService } from "@/services/subscription.service";
import { UserService } from "@/services/user.service";
import { clerkClient } from "@clerk/nextjs/server";
import { Container, Newable } from "inversify";
import Stripe from "stripe";
import { DITypes, ServiceTypes } from "./di.container.types";
import { PrismaClient } from "./prisma";

function isClass(func: unknown): func is Newable {
  return (
    typeof func === "function" &&
    /^class\s/.test(Function.prototype.toString.call(func))
  );
}

export class DIContainer {
  private static _container = new Container({
    defaultScope: "Singleton",
  });

  public static get container() {
    return this._container;
  }

  public static initialize() {
    // Bind Prisma instance
    this._container.bind(DITypes.Prisma).toConstantValue(new PrismaClient());

    // Bind Clerk instance
    this._container
      .bind(DITypes.Clerk)
      .toResolvedValue(async () => await clerkClient());

    // Bind Stripe instance
    this._container.bind(DITypes.Stripe).toConstantValue(
      new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-03-31.basil",
      })
    );

    // Bind services
    this._container.bind(DITypes.AddonService).to(AddonService);
    this._container.bind(DITypes.PlanService).to(PlanService);
    this._container.bind(DITypes.SubscriptionService).to(SubscriptionService);
    this._container.bind(DITypes.FeatureService).to(FeatureService);
    this._container.bind(DITypes.OrganizationService).to(OrganizationService);
    this._container.bind(DITypes.UserService).to(UserService);
  }

  public static getInstance<T extends keyof ServiceTypes>(type: T) {
    return this._container.get<ServiceTypes[T]>(type) as ServiceTypes[T];
  }
}

DIContainer.initialize();

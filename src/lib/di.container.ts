import { AddonService } from "@/services/addon.service";
import { FeatureService } from "@/services/feature/feature.service";
import { PlanService } from "@/services/plan.service";
import { SubscriptionService } from "@/services/subscription.service";
import { Container, Newable } from "inversify";
import Stripe from "stripe";
import { DIContainerSymbols, DITypes } from "./di.container.types";

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
    // Bind Stripe instance
    this._container.bind(DIContainerSymbols[DITypes.Stripe]).toConstantValue(
      new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-03-31.basil",
      })
    );

    // Bind services
    this._container
      .bind(DIContainerSymbols[DITypes.AddonService])
      .to(AddonService);
    this._container
      .bind(DIContainerSymbols[DITypes.PlanService])
      .to(PlanService);
    this._container
      .bind(DIContainerSymbols[DITypes.SubscriptionService])
      .to(SubscriptionService);
    this._container
      .bind(DIContainerSymbols[DITypes.FeatureService])
      .to(FeatureService);
  }

  public static getInstance<T>(type: DITypes) {
    return this._container.get<T>(DIContainerSymbols[type]);
  }
}

DIContainer.initialize();

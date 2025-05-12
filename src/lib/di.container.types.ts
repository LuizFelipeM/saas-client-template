export enum DITypes {
  Stripe = "Stripe",
  AddonService = "AddonService",
  //   CompanyService = "CompanyService",
  //   PermitService = "PermitService",
  PlanService = "PlanService",
  SubscriptionService = "SubscriptionService",
  FeatureService = "FeatureService",
}

export const DIContainerSymbols: Record<DITypes, symbol> = {
  [DITypes.Stripe]: Symbol.for(DITypes.Stripe),
  [DITypes.AddonService]: Symbol.for(DITypes.AddonService),
  //   CompanyService: Symbol.for("CompanyService"),
  //   PermitService: Symbol.for("PermitService"),
  [DITypes.PlanService]: Symbol.for(DITypes.PlanService),
  [DITypes.SubscriptionService]: Symbol.for(DITypes.SubscriptionService),
  [DITypes.FeatureService]: Symbol.for(DITypes.FeatureService),
};

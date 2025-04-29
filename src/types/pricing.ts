export type BillingPeriod = "monthly" | "yearly" | "lifetime";

export type PricingModel =
  | "flat"
  | "tiered"
  | "per-user"
  | "usage-based"
  | "feature-based"
  | "storage-based"
  | "active-user"
  | "volume-discount"
  | "custom"
  | "modular"
  | "credit-based"
  | "hybrid";

export type PlanFeature = {
  id: string;
  name: string;
  description?: string;
  included: boolean;
  limit?: number | string;
  icon?: string; // Lucide icon name
};

export type PlanAddOn = {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceYearly?: number;
  stripePriceId?: {
    monthly?: string;
    yearly?: string;
  };
};

export type VolumeDiscount = {
  minQuantity: number;
  discountPercentage: number;
};

export type PlanTier = {
  id: string;
  name: string;
  price: number;
  priceYearly?: number;
  stripePriceId?: {
    monthly?: string;
    yearly?: string;
  };
  minQuantity?: number;
  maxQuantity?: number;
};

export type PricingPlan = {
  id: string;
  name: string;
  description?: string;
  model: PricingModel;
  badge?: string;
  basePrice: number;
  basePriceYearly?: number;
  stripePriceId?: {
    monthly?: string;
    yearly?: string;
  };
  currency: string;
  features: PlanFeature[];
  addOns?: PlanAddOn[];
  tiers?: PlanTier[];
  volumeDiscounts?: VolumeDiscount[];
  minUsers?: number;
  maxUsers?: number;
  usageMultiplier?: number;
  usageMetric?: string;
  credits?: number;
  isPopular?: boolean;
  callToAction: {
    text: string;
    action: "checkout" | "trial" | "contact";
    url?: string;
  };
};

export type PricingConfig = {
  currency: string;
  defaultBillingPeriod: BillingPeriod;
  yearlyDiscountPercentage?: number;
  plans: PricingPlan[];
  showAddOns?: boolean;
  showUserCount?: boolean;
  showUsageCalculator?: boolean;
  contactSalesEmail?: string;
  contactSalesUrl?: string;
  termsUrl?: string;
  faqUrl?: string;
};

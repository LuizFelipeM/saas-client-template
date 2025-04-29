import { BillingPeriod, PlanAddOn, PricingPlan } from "@/types/pricing";

/**
 * Format price with currency symbol and proper decimal places
 */
export const formatPrice = (
  price: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Calculate price based on billing period
 */
export const getPriceByPeriod = (
  plan: PricingPlan,
  billingPeriod: BillingPeriod,
  quantity: number = 1
): number => {
  if (billingPeriod === "yearly" && plan.basePriceYearly !== undefined) {
    return plan.basePriceYearly * quantity;
  }
  return plan.basePrice * quantity;
};

/**
 * Calculate total price with add-ons
 */
export const calculateTotalPrice = (
  plan: PricingPlan,
  billingPeriod: BillingPeriod,
  selectedAddOns: string[] = [],
  quantity: number = 1,
  usage: number = 0
): number => {
  let basePrice = getPriceByPeriod(plan, billingPeriod, quantity);

  // Add price for selected add-ons
  if (plan.addOns) {
    const addOnTotal = plan.addOns
      .filter((addon) => selectedAddOns.includes(addon.id))
      .reduce((total, addon) => {
        if (billingPeriod === "yearly" && addon.priceYearly) {
          return total + addon.priceYearly;
        }
        return total + addon.price;
      }, 0);

    basePrice += addOnTotal;
  }

  // Add usage-based price
  if (plan.model === "usage-based" && plan.usageMultiplier && usage > 0) {
    basePrice += usage * plan.usageMultiplier;
  }

  // Apply volume discounts if available
  if (plan.volumeDiscounts && plan.volumeDiscounts.length > 0 && quantity > 1) {
    // Find the applicable discount tier
    const applicableDiscount = [...plan.volumeDiscounts]
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find((discount) => quantity >= discount.minQuantity);

    if (applicableDiscount) {
      const discountMultiplier =
        1 - applicableDiscount.discountPercentage / 100;
      basePrice *= discountMultiplier;
    }
  }

  // Apply tiered pricing if available
  if (plan.model === "tiered" && plan.tiers && plan.tiers.length > 0) {
    basePrice = 0; // Reset base price for tiered pricing

    // Sort tiers by minimum quantity in ascending order
    const sortedTiers = [...plan.tiers].sort(
      (a, b) => (a.minQuantity || 0) - (b.minQuantity || 0)
    );

    let remainingQuantity = quantity;

    for (const tier of sortedTiers) {
      if (remainingQuantity <= 0) break;

      const minQty = tier.minQuantity || 0;
      const maxQty = tier.maxQuantity || Infinity;

      const tierQuantity = Math.min(remainingQuantity, maxQty - minQty + 1);

      const tierPrice =
        billingPeriod === "yearly" && tier.priceYearly
          ? tier.priceYearly
          : tier.price;

      basePrice += tierQuantity * tierPrice;
      remainingQuantity -= tierQuantity;
    }
  }

  return basePrice;
};

/**
 * Get Stripe price ID based on billing period
 */
export const getStripePriceId = (
  plan: PricingPlan,
  billingPeriod: BillingPeriod
): string | undefined => {
  if (!plan.stripePriceId) return undefined;

  if (billingPeriod === "yearly" && plan.stripePriceId.yearly) {
    return plan.stripePriceId.yearly;
  }

  return plan.stripePriceId.monthly;
};

/**
 * Get add-on Stripe price ID
 */
export const getAddOnStripePriceId = (
  addon: PlanAddOn,
  billingPeriod: BillingPeriod
): string | undefined => {
  if (!addon.stripePriceId) return undefined;

  if (billingPeriod === "yearly" && addon.stripePriceId.yearly) {
    return addon.stripePriceId.yearly;
  }

  return addon.stripePriceId.monthly;
};

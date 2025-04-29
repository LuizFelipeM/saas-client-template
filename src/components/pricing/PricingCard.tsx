import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateTotalPrice, formatPrice } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { BillingPeriod, PricingPlan } from "@/types/pricing";
import { motion } from "framer-motion";
import FeatureIcon from "./FeatureIcon";

interface PricingCardProps {
  plan: PricingPlan;
  billingPeriod: BillingPeriod;
  className?: string;
  userCount?: number;
  usage?: number;
  selectedAddOns?: string[];
  onSelectAddOn?: (addOnId: string) => void;
  onUserCountChange?: (count: number) => void;
  onUsageChange?: (usage: number) => void;
  onSelectPlan: (plan: PricingPlan) => void;
}

export default function PricingCard({
  plan,
  billingPeriod,
  className,
  userCount = 1,
  usage = 0,
  selectedAddOns = [],
  onSelectAddOn,
  onUserCountChange,
  onUsageChange,
  onSelectPlan,
}: PricingCardProps) {
  const {
    id,
    name,
    description,
    model,
    features,
    addOns,
    isPopular,
    callToAction,
  } = plan;

  // Calculate the total price based on selected options and billing period
  const totalPrice = calculateTotalPrice(
    plan,
    billingPeriod,
    selectedAddOns,
    userCount,
    usage
  );

  // Determine if this plan is per-user
  const isPerUser = model === "per-user";

  // Determine if this plan is usage-based
  const isUsageBased = model === "usage-based";

  // Handle the CTA button click
  const handleCtaClick = () => {
    onSelectPlan(plan);
  };

  // Get the price label
  const getPriceLabel = () => {
    if (model === "custom") {
      return "Custom pricing";
    }

    let label = formatPrice(totalPrice, plan.currency);

    if (isPerUser && userCount > 0) {
      label += ` / ${userCount} ${userCount === 1 ? "user" : "users"}`;
    } else if (billingPeriod !== "lifetime") {
      label += ` / ${billingPeriod === "monthly" ? "mo" : "yr"}`;
    }

    return label;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden transition-all",
          isPopular && "border-primary shadow-lg",
          className
        )}
      >
        {isPopular && (
          <div className="bg-primary py-1 text-center text-xs font-medium text-primary-foreground">
            Most Popular
          </div>
        )}

        <CardHeader className="p-6">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}

          <div className="mt-4">
            <div className="text-3xl font-bold">{getPriceLabel()}</div>
            {isUsageBased && plan.usageMetric && (
              <div className="text-sm text-muted-foreground mt-1">
                + ${plan.usageMultiplier} per {plan.usageMetric}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6 pt-0">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Features included:</h4>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature.id} className="flex items-start gap-3">
                  <FeatureIcon
                    name={feature.icon}
                    included={feature.included}
                    className="h-5 w-5 shrink-0"
                  />
                  <div>
                    <span
                      className={cn(
                        !feature.included && "text-muted-foreground"
                      )}
                    >
                      {feature.name}
                    </span>
                    {feature.included && feature.limit && (
                      <span className="text-muted-foreground">
                        {" "}
                        ({feature.limit})
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Add-ons section */}
            {addOns && addOns.length > 0 && onSelectAddOn && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium">Add-ons (optional):</h4>
                <ul className="space-y-2">
                  {addOns.map((addon) => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    const addonPrice =
                      billingPeriod === "yearly" && addon.priceYearly
                        ? addon.priceYearly
                        : addon.price;

                    return (
                      <li key={addon.id}>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelectAddOn(addon.id)}
                            className="rounded text-primary"
                          />
                          <span>{addon.name}</span>
                          <span className="text-muted-foreground text-sm ml-auto">
                            {formatPrice(addonPrice, plan.currency)}
                          </span>
                        </label>
                        {addon.description && (
                          <p className="text-xs text-muted-foreground ml-5 mt-1">
                            {addon.description}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* User count selector for per-user plans */}
            {isPerUser && onUserCountChange && (
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Number of users:</h4>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        userCount > (plan.minUsers || 1) &&
                        onUserCountChange(userCount - 1)
                      }
                      disabled={userCount <= (plan.minUsers || 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{userCount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUserCountChange(userCount + 1)}
                      disabled={
                        plan.maxUsers ? userCount >= plan.maxUsers : false
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Usage slider for usage-based plans */}
            {isUsageBased && plan.usageMetric && onUsageChange && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium">
                  Estimated {plan.usageMetric}:
                </h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={usage}
                    onChange={(e) => onUsageChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0 {plan.usageMetric}</span>
                    <span>
                      {usage.toLocaleString()} {plan.usageMetric}
                    </span>
                    <span>10,000 {plan.usageMetric}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full"
            size="lg"
            variant={isPopular ? "default" : "outline"}
            onClick={handleCtaClick}
          >
            {callToAction.text}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

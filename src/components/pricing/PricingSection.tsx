"use client";
import { BillingPeriod, PricingConfig, PricingPlan } from "@/types/pricing";
import { motion } from "framer-motion";
import { useCallback, useState } from "react";
import BillingToggle from "./BillingToggle";
import PricingCard from "./PricingCard";

interface PricingSectionProps {
  config: PricingConfig;
}

export default function PricingSection({ config }: PricingSectionProps) {
  // State for selected options
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>(
    config.defaultBillingPeriod
  );
  const [userCounts, setUserCounts] = useState<Record<string, number>>({});
  const [usageLevels, setUsageLevels] = useState<Record<string, number>>({});
  const [selectedAddOns, setSelectedAddOns] = useState<
    Record<string, string[]>
  >({});

  // Handle billing period change
  const handleBillingPeriodChange = useCallback((period: BillingPeriod) => {
    setBillingPeriod(period);
  }, []);

  // Handle user count change for a specific plan
  const handleUserCountChange = useCallback((planId: string, count: number) => {
    setUserCounts((prev) => ({ ...prev, [planId]: count }));
  }, []);

  // Handle usage level change for a specific plan
  const handleUsageChange = useCallback((planId: string, usage: number) => {
    setUsageLevels((prev) => ({ ...prev, [planId]: usage }));
  }, []);

  // Handle add-on toggle for a specific plan
  const handleAddOnToggle = useCallback((planId: string, addOnId: string) => {
    setSelectedAddOns((prev) => {
      const planAddOns = prev[planId] || [];
      const updatedAddOns = planAddOns.includes(addOnId)
        ? planAddOns.filter((id) => id !== addOnId)
        : [...planAddOns, addOnId];

      return { ...prev, [planId]: updatedAddOns };
    });
  }, []);

  // Handle selecting a plan
  const handleSelectPlan = useCallback(
    async (plan: PricingPlan) => {
      if (plan.callToAction.action === "contact") {
        // Redirect to contact page for custom pricing
        window.location.href =
          config.contactSalesUrl || `/contact?plan=${plan.id}`;
        return;
      }

      try {
        // Get the relevant data for this plan
        const planUserCount = userCounts[plan.id] || 1;
        const planUsage = usageLevels[plan.id] || 0;
        const planAddOns = selectedAddOns[plan.id] || [];

        // Call the Stripe Checkout API
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId: plan.id,
            billingPeriod,
            quantity: planUserCount,
            selectedAddOnIds: planAddOns,
            successPath: "/dashboard",
            cancelPath: window.location.pathname,
          }),
        });

        const { url } = await response.json();

        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error("Failed to create checkout session:", error);
      }
    },
    [
      billingPeriod,
      config.contactSalesUrl,
      selectedAddOns,
      userCounts,
      usageLevels,
    ]
  );

  return (
    <div className="w-full py-12">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your needs. All plans include a 14-day
              free trial with no credit card required.
            </p>

            {/* Billing period toggle */}
            {config.yearlyDiscountPercentage && (
              <BillingToggle
                billingPeriod={billingPeriod}
                onChange={handleBillingPeriodChange}
                yearlySavingsPercent={config.yearlyDiscountPercentage}
              />
            )}
          </motion.div>
        </div>

        {/* Pricing cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {config.plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              userCount={userCounts[plan.id] || 1}
              usage={usageLevels[plan.id] || 0}
              selectedAddOns={selectedAddOns[plan.id] || []}
              onSelectAddOn={(addOnId) => handleAddOnToggle(plan.id, addOnId)}
              onUserCountChange={
                plan.model === "per-user" && config.showUserCount
                  ? (count) => handleUserCountChange(plan.id, count)
                  : undefined
              }
              onUsageChange={
                plan.model === "usage-based" && config.showUsageCalculator
                  ? (usage) => handleUsageChange(plan.id, usage)
                  : undefined
              }
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>

        {/* FAQ and terms links */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Have questions?{" "}
            <a
              href={config.faqUrl || "/faq"}
              className="text-primary hover:underline"
            >
              Check our FAQ
            </a>
            {" or "}
            <a
              href={config.contactSalesUrl || "/contact"}
              className="text-primary hover:underline"
            >
              contact our sales team
            </a>
            .
          </p>
          <p className="mt-2">
            By subscribing, you agree to our{" "}
            <a
              href={config.termsUrl || "/terms"}
              className="text-primary hover:underline"
            >
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

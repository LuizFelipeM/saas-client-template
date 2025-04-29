import { cn } from "@/lib/utils";
import { BillingPeriod } from "@/types/pricing";
import { motion } from "framer-motion";
import React from "react";

const Background: React.FC = () => (
  <motion.div
    layoutId="billingTabActive"
    className="-z-10 absolute inset-0 bg-primary rounded-full"
    style={{ borderRadius: 9999 }}
    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
  />
);

interface BillingToggleProps {
  billingPeriod: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
  yearlySavingsPercent?: number;
}

export default function BillingToggle({
  billingPeriod,
  onChange,
  yearlySavingsPercent,
}: BillingToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center gap-4 p-1 border rounded-full bg-background">
        <button
          onClick={() => onChange("monthly")}
          className={cn(
            "z-10 relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
            billingPeriod === "monthly"
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Monthly
          {billingPeriod === "monthly" && <Background />}
        </button>
        <button
          onClick={() => onChange("yearly")}
          className={cn(
            "z-0 relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
            billingPeriod === "yearly"
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Yearly
          {billingPeriod === "yearly" && <Background />}
        </button>
      </div>

      {yearlySavingsPercent && (
        <div
          className={cn(
            "text-sm text-green-600 font-medium opacity-0 select-none transition-all",
            billingPeriod === "yearly" && "opacity-100"
          )}
        >
          Save {yearlySavingsPercent}% with yearly billing
        </div>
      )}
    </div>
  );
}

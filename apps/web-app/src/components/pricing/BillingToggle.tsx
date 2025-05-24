import { cn } from "@/lib/utils";
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
  isYearly: boolean;
  onChange: (isYearly: boolean) => void;
  yearlySavingsPercent?: number;
}

export default function BillingToggle({
  isYearly,
  onChange,
  yearlySavingsPercent,
}: BillingToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 mb-4">
      <div className="flex items-center gap-2 p-1 border rounded-full bg-background">
        <button
          onClick={() => onChange(false)}
          className={cn(
            "z-10 relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
            !isYearly
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Mensal
          {!isYearly && <Background />}
        </button>
        <button
          onClick={() => onChange(true)}
          className={cn(
            "z-0 relative px-4 py-2 text-sm font-medium rounded-full transition-colors",
            isYearly
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Anual
          {isYearly && <Background />}
        </button>
      </div>

      {yearlySavingsPercent && (
        <div
          className={cn(
            "text-sm text-green-600 font-medium opacity-0 select-none transition-all",
            isYearly && "opacity-100"
          )}
        >
          Economize {yearlySavingsPercent}% com o plano anual
        </div>
      )}
    </div>
  );
}

import PricingSection from "@/components/pricing/PricingSection";
import { pricingConfig } from "@/config/pricing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Your SaaS Platform",
  description: "Find the perfect plan for your needs",
};

export default function PricingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-b from-background to-muted/20 pt-20 pb-10">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Pricing Plans
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your business. All plans include a
            14-day free trial.
          </p>
        </div>
      </div>

      <PricingSection config={pricingConfig} />
    </main>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toggle } from "@/components/ui/toggle";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Define the metadata types to avoid linter errors
type PlanMetadata = {
  price?: {
    monthly?: number;
    yearly?: number;
  };
  features?: string[];
};

type Plan = {
  id: string;
  name: string;
  metadata: PlanMetadata;
};

export default function PricingPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/public/plans", {
          method: "GET",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch plans");
        }

        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleCheckout = async (planId: string) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          companyId: "current-company-id", // You'll need to get this from your auth context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading plans...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select the perfect plan for your business needs
        </p>
      </div>

      <div className="flex justify-center mb-8 space-x-2">
        <Toggle
          variant="outline"
          pressed={!isYearly}
          onPressedChange={(pressed) => setIsYearly(!pressed)}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          Monthly
        </Toggle>
        <Toggle
          variant="outline"
          pressed={isYearly}
          onPressedChange={(pressed) => setIsYearly(pressed)}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          Yearly
        </Toggle>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  $
                  {isYearly
                    ? plan.metadata?.price?.yearly
                    : plan.metadata?.price?.monthly || 0}
                </span>
                <span className="text-muted-foreground">
                  /{isYearly ? "year" : "month"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {(plan.metadata?.features || []).map(
                  (feature: string, index: number) => (
                    <li key={index} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  )
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleCheckout(plan.id)}
              >
                Select Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

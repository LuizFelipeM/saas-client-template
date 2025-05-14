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
import { Feature } from "@/types/feature";
import { Price } from "@/types/price";
import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Plan = {
  id: string;
  name: string;
  description?: string | null;
  metadata: Record<string, any>;
  stripeProductId: string;
  features: Record<string, Feature>;
  prices: Price[];
};

export default function PricingPage() {
  const router = useRouter();

  const { getToken } = useAuth();
  const { user, isSignedIn, isLoaded } = useUser();
  const { redirectToSignIn } = useClerk();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Single loading state
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const plansResponse = await fetch("/api/public/plans", {
          method: "GET",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!plansResponse.ok) {
          throw new Error("Failed to fetch plans");
        }

        const plansData = await plansResponse.json();
        setPlans(plansData);
      } catch (error) {
        console.error("Error fetching plans:", error);
        // Handle plan fetch error appropriately
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const findPriceForInterval = (
    planPrices: Price[],
    yearly: boolean
  ): Price | undefined => {
    const interval = yearly ? "year" : "month";
    return planPrices?.find(
      (p) =>
        p.active && p.type === "recurring" && p.recurring?.interval === interval
    );
  };

  // Helper function to get the price amount
  const getPriceAmount = (plan: Plan): number | string => {
    const priceObject = findPriceForInterval(plan.prices, isYearly);
    if (!priceObject?.unit_amount) return "N/A";
    return priceObject.unit_amount / 100;
  };

  // Helper function to get the currency
  const getCurrency = (plan: Plan): string => {
    const priceObject = findPriceForInterval(plan.prices, isYearly);
    if (priceObject?.currency) {
      return priceObject.currency.toUpperCase();
    }
    // Fallback - Review in detail
    const fallbackPriceObject = findPriceForInterval(plan.prices, !isYearly);
    if (fallbackPriceObject?.currency) {
      return fallbackPriceObject.currency.toUpperCase();
    }
    return ""; // Default or error currency
  };

  // Helper function to get the Stripe Price ID for checkout
  const getStripePriceId = (plan: Plan): string | undefined => {
    const priceObject = findPriceForInterval(plan.prices, isYearly);
    return priceObject?.id;
  };

  const handleCheckout = async (plan: Plan) => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      redirectToSignIn({ redirectUrl: window.location.href });
      return;
    }

    const priceId = getStripePriceId(plan);
    if (!priceId) {
      console.error(
        "Selected price ID not found for plan:",
        plan.name,
        " Yearly:",
        isYearly
      );
      alert("Sorry, the selected pricing option is not available.");
      return;
    }

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      const token = await getToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          planId: plan.id,
          priceId,
          organizationId: user.organizationMemberships[0].organization.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await response.json();
      router.push(url);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(
        "There was an issue starting the checkout process. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading plans and pricing...</div>
      </div>
    );
  }

  if (!plans.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-red-600">
          No plans available at the moment. Please try again later.
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number | string, currencyCode: string) => {
    if (typeof amount === "string") return amount; // for "N/A"
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode,
      }).format(amount);
    } catch (e) {
      // Fallback for invalid currency code, though ideally currency codes from Stripe are valid
      return `${currencyCode} ${amount.toFixed(2)}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          {/* Display a general description or a specific one if available */}
          Select the perfect plan for your business needs
        </p>
      </div>

      <div className="flex justify-center mb-8 space-x-2">
        <Toggle
          variant="outline"
          pressed={!isYearly}
          onPressedChange={() => setIsYearly(false)}
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          Monthly
        </Toggle>
        <Toggle
          variant="outline"
          pressed={isYearly}
          onPressedChange={() => setIsYearly(true)}
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
              {plan.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
              )}
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {formatCurrency(getPriceAmount(plan), getCurrency(plan))}
                </span>
                <span className="text-muted-foreground">
                  /{isYearly ? "year" : "month"}
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {Object.entries(plan.features || {}).map(([key, feature]) => (
                  <li key={key} className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-primary" />
                    {key} {/* Use the key as the feature name/title */}
                    {feature.type === "USAGE" && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (Usage-based)
                      </span>
                    )}
                    {/* Add other feature type specific displays if needed e.g. METERED or DEFAULT values */}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleCheckout(plan)}
                disabled={!getStripePriceId(plan) || !isLoaded}
              >
                {!isLoaded ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : getStripePriceId(plan) ? (
                  "Select Plan"
                ) : (
                  "Unavailable"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

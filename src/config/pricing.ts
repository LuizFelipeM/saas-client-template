import { PricingConfig } from "@/types/pricing";

export const pricingConfig: PricingConfig = {
  currency: "USD",
  defaultBillingPeriod: "monthly",
  yearlyDiscountPercentage: 20,
  showAddOns: true,
  showUserCount: true,
  showUsageCalculator: true,
  contactSalesEmail: "sales@example.com",
  contactSalesUrl: "/contact",
  termsUrl: "/terms",
  faqUrl: "/faq",
  plans: [
    // Free Plan (Freemium model)
    {
      id: "free",
      name: "Free",
      description: "For individuals and small projects",
      model: "flat",
      basePrice: 0,
      basePriceYearly: 0,
      currency: "USD",
      features: [
        {
          id: "storage",
          name: "Storage",
          included: true,
          limit: "1GB",
          icon: "Database",
        },
        {
          id: "users",
          name: "Team members",
          included: true,
          limit: "1",
          icon: "Users",
        },
        {
          id: "projects",
          name: "Projects",
          included: true,
          limit: "3",
          icon: "Folder",
        },
        {
          id: "api-access",
          name: "API access",
          included: false,
          icon: "Code",
        },
        {
          id: "support",
          name: "Priority support",
          included: false,
          icon: "LifeBuoy",
        },
      ],
      callToAction: {
        text: "Get Started",
        action: "checkout",
      },
    },

    // Starter Plan (Per-user pricing)
    {
      id: "starter",
      name: "Starter",
      description: "For growing teams",
      model: "per-user",
      basePrice: 12,
      basePriceYearly: 9.6,
      stripePriceId: {
        monthly: "price_starter_monthly",
        yearly: "price_starter_yearly",
      },
      currency: "USD",
      minUsers: 2,
      features: [
        {
          id: "storage",
          name: "Storage",
          included: true,
          limit: "10GB",
          icon: "Database",
        },
        {
          id: "users",
          name: "Team members",
          included: true,
          limit: "Unlimited",
          icon: "Users",
        },
        {
          id: "projects",
          name: "Projects",
          included: true,
          limit: "10",
          icon: "Folder",
        },
        {
          id: "api-access",
          name: "API access",
          included: true,
          icon: "Code",
        },
        {
          id: "support",
          name: "Priority support",
          included: false,
          icon: "LifeBuoy",
        },
      ],
      isPopular: true,
      callToAction: {
        text: "Start Free Trial",
        action: "trial",
      },
    },

    // Professional Plan (Usage-based pricing)
    {
      id: "professional",
      name: "Professional",
      description: "For serious businesses",
      model: "usage-based",
      basePrice: 49,
      basePriceYearly: 39.2,
      stripePriceId: {
        monthly: "price_professional_monthly",
        yearly: "price_professional_yearly",
      },
      currency: "USD",
      usageMultiplier: 0.001, // $0.001 per unit
      usageMetric: "API calls",
      features: [
        {
          id: "storage",
          name: "Storage",
          included: true,
          limit: "100GB",
          icon: "Database",
        },
        {
          id: "users",
          name: "Team members",
          included: true,
          limit: "Unlimited",
          icon: "Users",
        },
        {
          id: "projects",
          name: "Projects",
          included: true,
          limit: "Unlimited",
          icon: "Folder",
        },
        {
          id: "api-access",
          name: "API access",
          included: true,
          icon: "Code",
        },
        {
          id: "support",
          name: "Priority support",
          included: true,
          icon: "LifeBuoy",
        },
        {
          id: "advanced-analytics",
          name: "Advanced Analytics",
          included: true,
          icon: "BarChart",
        },
      ],
      addOns: [
        {
          id: "addl-storage",
          name: "Additional Storage",
          description: "100GB of extra storage",
          price: 20,
          priceYearly: 16,
          stripePriceId: {
            monthly: "price_storage_addon_monthly",
            yearly: "price_storage_addon_yearly",
          },
        },
      ],
      callToAction: {
        text: "Start Free Trial",
        action: "trial",
      },
    },

    // Enterprise Plan (Custom pricing)
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For large organizations",
      model: "custom",
      basePrice: 0,
      currency: "USD",
      features: [
        {
          id: "storage",
          name: "Storage",
          included: true,
          limit: "Unlimited",
          icon: "Database",
        },
        {
          id: "users",
          name: "Team members",
          included: true,
          limit: "Unlimited",
          icon: "Users",
        },
        {
          id: "projects",
          name: "Projects",
          included: true,
          limit: "Unlimited",
          icon: "Folder",
        },
        {
          id: "api-access",
          name: "API access",
          included: true,
          icon: "Code",
        },
        {
          id: "support",
          name: "24/7 Premium support",
          included: true,
          icon: "LifeBuoy",
        },
        {
          id: "advanced-analytics",
          name: "Advanced Analytics",
          included: true,
          icon: "BarChart",
        },
        {
          id: "sla",
          name: "Custom SLA",
          included: true,
          icon: "Shield",
        },
        {
          id: "dedicated",
          name: "Dedicated infrastructure",
          included: true,
          icon: "Server",
        },
      ],
      callToAction: {
        text: "Contact Sales",
        action: "contact",
      },
    },
  ],
};

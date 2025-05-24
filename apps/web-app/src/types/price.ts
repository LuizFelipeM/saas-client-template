import Stripe from "stripe";

// Define the Price type
export type Price = {
  id: string; // Stripe Price ID
  active: boolean;
  currency: string;
  unit_amount: number | null;
  type: "one_time" | "recurring";
  recurring: Stripe.Price.Recurring | null;
  metadata: Stripe.Metadata;
};

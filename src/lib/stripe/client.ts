"use client";

import { loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<import("@stripe/stripe-js").Stripe | null> | null =
  null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

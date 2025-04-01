"use client";
import React from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { getStripe } from "@/lib/stripe/client";

export default function Pricing() {
  const { user } = useUser();
  const handleSubscription = async (priceId: string) => {
    try {
      // 1. Call your API to create the checkout session
      const response = await axios.post("/api/subscriptions/create", {
        price: priceId, // Use priceId instead of price
        customerEmail: user?.emailAddresses[0].emailAddress,
      });

      // 2. Get the session ID from response
      const { sessionId } = response.data;

      // 3. Redirect to Stripe Checkout
      const stripe = await getStripe(); // Import getStripe from '@/lib/stripe/client'
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe redirect error:", error);
        alert("Failed to redirect to payment page");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to start subscription process");
    }
  };
  return (
    <section id="pricing" className="py-16 bg-[#4EB18D]">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-white mb-4"
        >
          Start Your Free Trial
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-white/90 mb-12 max-w-2xl mx-auto text-sm"
        >
          Want to learn more about MaxPilot? Enjoy a free 7-day trial and
          explore all the features. Terms and conditions applied*
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: "BASIC",
              price: "$25",
              priceId: "price_1R8bmv09Pi8IX7t925EFf0Iq",
              description:
                "Includes all the features necessary for rostering, and easily submit progress notes and track team availability.",
              popular: false,
            },
            {
              title: "PROFESSIONAL",
              price: "$50",
              priceId: "price_1R8bkC09Pi8IX7t9BJ28Q8mf",
              description:
                "Includes client management, check-ups tracking, and invoice generation with NDIS payment integration.",
              popular: false,
            },
            {
              title: "PREMIUM",
              price: "$100",
              priceId: "price_1R8bng09Pi8IX7t9oMrZxw9h",
              description:
                "Unlock all the features, including custom programs, custom forms, and advanced invoice management.",
              popular: true,
            },
          ].map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + 0.1 * index }}
              viewport={{ once: true }}
              className={`bg-white rounded-lg overflow-hidden shadow-lg relative ${
                plan.popular ? "transform -translate-y-2" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-yellow-400 text-xs font-bold px-3 py-1 transform rotate-45 translate-x-6 -translate-y-1">
                    POPULAR
                  </div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{plan.title}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-gray-500 text-sm">per staff/month</span>
                </div>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

                <Tabs defaultValue="monthly" className="w-full mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="annually">Annually</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Button
                  onClick={() => handleSubscription(plan.priceId)}
                  className={`w-full ${
                    plan.popular
                      ? "bg-[#4EB18D] hover:bg-[#4EB18D]/90"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {plan.popular ? "Get Started" : "Choose Plan"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

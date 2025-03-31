import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing to handle raw body
  },
};

export async function POST(request: Request) {
  console.log("Received webhook request");

  // Get raw request body
  const body = await request.text();
  console.log("Request Body: ", body); // Log the raw body for debugging

  // Extract the Stripe signature
  const signature = request.headers.get("stripe-signature")!;
  console.log("Stripe Signature: ", signature); // Debug the signature

  let event: Stripe.Event;

  try {
    // Construct the event from Stripe's raw payload
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET! // Ensure this is correct
    );
  } catch (err) {
    console.error(`Webhook Error: ${err}`);
    return NextResponse.json(
      { error: { message: `Webhook Error: ${err}` } },
      { status: 400 }
    );
  }

  console.log(`Received event type: ${event.type}`);

  // Handle the relevant event types
  switch (event.type) {
    case "checkout.session.completed":
      console.log("Handling checkout session completed event");
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(checkoutSession);
      break;

    case "customer.subscription.updated":
      console.log("Handling subscription updated event");
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    if (!session.subscription || !session.customer) return;

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    const customerId = session.customer as string;
    const userId = subscription.metadata.userId;

    // Update your database with the new subscription
    await prisma.stripe.create({
      data: {
        userId: userId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        stripeSubscriptionStatus: subscription.status,
      },
    });
  } catch (error) {
    console.error("Error handling checkout session:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  await prisma.stripe.update({
    where: { id: userId },
    data: {
      stripePriceId: subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionStatus: subscription.status,
    },
  });
}

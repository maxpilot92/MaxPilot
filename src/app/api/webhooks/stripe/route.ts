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
  // Get raw request body
  const body = await request.text();

  // Extract the Stripe signature
  const signature = request.headers.get("stripe-signature")!;

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

  // Handle the relevant event types
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(checkoutSession);
      break;

    case "customer.subscription.updated":
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

// enum SubscriptionPeriod {
//   Monthly,
//   Annually,
//   Free_Trail,
// }

// async function handleInvoicePaid(subscriptionId: string) {
//   const {userId} = useAuth()
//   const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
//     expand: ['items.data.price.product'],
//   });

//    // Extract subscription plan/type
//    const priceId = subscription.items.data[0].price.id;
//    const product = subscription.items.data[0].price.product;
//    const productName = typeof product === "object" && "name" in product ? product.name : "Unknown Product"; // e.g., "Premium Plan"
//    const billingInterval = subscription.items.data[0].price.recurring?.interval ?? "unknown"; // "month", "year", or "unknown"

//    let subscriptionPeriod: SubscriptionPeriod;

//    if (billingInterval === "unknown") {
//      console.error("Error: billingInterval is unknown");
//      return;
//    } else if (billingInterval === "month" ) {
//       subscriptionPeriod = SubscriptionPeriod.Monthly;

//    } else if (billingInterval === "year") {
//       subscriptionPeriod = SubscriptionPeriod.Annually;
//    }

//     // Update your database with the new subscription
//     if (userId) {
//       await prisma.user.update({
//         where: { id: userId },
//         data: {
//           subscriptionEnd:,
//           subscriptionPeriod: subscriptionPeriod as SubscriptionPeriod | undefined,
//         },
//       });
//     } else {
//       console.error("Error: userId is null or undefined");
//     }
// }

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

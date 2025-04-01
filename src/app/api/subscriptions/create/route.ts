import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { BASE_URL } from "@/utils/domain";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { price, customerEmail } = await request.json();

    // Create a Stripe customer if not exists
    const customers = await stripe.customers.list({ email: customerEmail });
    let customer = customers.data[0];

    if (!customer) {
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId,
        },
      });
    }

    // Create subscription
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ["card"],
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      mode: "subscription",
      //   success_url: `${process.env.DOMAIN}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      //   cancel_url: `${process.env.DOMAIN}/pricing`,
      success_url: `${BASE_URL}/dashboard`,
      cancel_url: `${BASE_URL}/pricing`,
      subscription_data: {
        metadata: {
          userId,
        },
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: { message: err } }, { status: 500 });
  }
}

export async function GET() {
  try {
    const payment = await prisma.stripe.findMany({});
    return NextResponse.json(payment);
  } catch (error) {
    console.log(error);
    return NextResponse.json(new Error("Failed to get payment"));
  }
}

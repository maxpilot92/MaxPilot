import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { customerId } = await request.json();

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.DOMAIN}/dashboard`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: { message: err } }, { status: 500 });
  }
}

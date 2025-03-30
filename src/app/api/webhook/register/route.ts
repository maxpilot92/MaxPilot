import { headers } from "next/headers";
import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";

// Fix: Properly handle Svix verification and response
export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) throw new Error("Missing webhook secret");

  const headersList = await headers();
  const svixId = headersList.get("svix-id");
  const svixSignature = headersList.get("svix-signature");

  const payload = await req.json();
  const wh = new Webhook(WEBHOOK_SECRET);

  if (!svixId || !svixSignature) {
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  try {
    const evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svixId,
      "svix-signature": svixSignature,
    }) as WebhookEvent;

    if (evt.type === "user.created") {
      const client = await clerkClient();
      await client.users.updateUser(evt.data.id, {
        publicMetadata: {
          onboardingComplete: false,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}

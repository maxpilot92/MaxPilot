import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { BASE_URL } from "./utils/domain";

const isProtectedRoute = createRouteMatcher(["/users(.*)"]);
const authRoute = createRouteMatcher(["/sign-up", "/sign-in"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (isProtectedRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(`${BASE_URL}/sign-in`);
    }
  }

  if (authRoute(req) && userId) {
    return NextResponse.redirect(`${BASE_URL}/users/dashboard`);
  }

  const client = await clerkClient();

  if (userId) {
    const user = client.users.getUser(userId!);

    const companyId = (await user).publicMetadata.companyId;

    const response = NextResponse.next();

    response.headers.set("company-id", companyId as string);

    return response;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

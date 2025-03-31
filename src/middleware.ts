import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/users(.*)"]);
const authRoute = createRouteMatcher(["/sign-up", "/sign-in"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const DOMAIN = process.env.DOMAIN;
  if (isProtectedRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(
        `${DOMAIN ? DOMAIN : "http://localhost:3000"}/sign-in`
      );
    }
  }

  if (authRoute(req) && userId) {
    return NextResponse.redirect(
      `${DOMAIN ? DOMAIN : "http://localhost:3000"}/dashboard`
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

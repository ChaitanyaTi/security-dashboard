import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define matchers for protected dashboard and public auth routes
const isDashboardRoute = createRouteMatcher([
  "/overview(.*)",
  "/threats(.*)",
  "/incidents(.*)",
  "/compliance(.*)",
  "/reports(.*)",
  "/chat(.*)",
  "/settings(.*)"
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId } = await auth();

  // 1. Force authentication for any dashboard console routes
  if (!userId && isDashboardRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 2. Multi-tenancy enforcement: if signed in but no active B2B organization is set, force onboarding
  if (userId && !orgId && isDashboardRoute(req) && !isAuthRoute(req)) {
    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }
});

export const config = {
  matcher: [
    // Exclude Next.js internals, static assets, and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|json|png|jpg|jpeg|gif|svg|ico)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

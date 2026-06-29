import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRateLimiter } from "./lib/dashboard/rate-limiter";

const isDashboardRoute = createRouteMatcher([
  "/overview(.*)",
  "/threats(.*)",
  "/incidents(.*)",
  "/compliance(.*)",
  "/reports(.*)",
  "/chat(.*)",
  "/settings(.*)",
  "/team(.*)"
]);

const isAuthRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/onboarding(.*)"
]);

function isSuspiciousRequest(url: string): boolean {
  const decoded = decodeURIComponent(url).toLowerCase();
  const signatures = [
    "<script",
    "javascript:",
    "union select",
    "select * from",
    "insert into",
    "delete from",
    "drop table",
    "or 1=1",
    "or '1'='1"
  ];
  return signatures.some(sig => decoded.includes(sig));
}

export default clerkMiddleware(async (auth, req) => {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || (req as any).ip || "127.0.0.1";
  const { pathname, search } = req.nextUrl;

  // 1. Detect Suspicious Request Patterns
  if (isSuspiciousRequest(pathname + search)) {
    fetch(`${req.nextUrl.origin}/api/security-log`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Aegis-Internal-Key": process.env.AEGIS_INTERNAL_KEY || "aegis_local_secret"
      },
      body: JSON.stringify({
        ipAddress: ip,
        eventType: "suspicious",
        details: { path: pathname, query: search, reason: "XSS_SQL_Injection_Signature" },
      }),
    }).catch(err => console.error("Suspicious log request failed:", err));

    return new NextResponse(
      JSON.stringify({ error: "Malicious payload signature detected." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // 2. Abstracted Rate Limiting Protection (Memory / Redis)
  const rateLimiter = getRateLimiter();
  const isLimited = await rateLimiter.isRateLimited(`rl:${ip}`, 120, 60 * 1000);
  if (isLimited) {
    fetch(`${req.nextUrl.origin}/api/security-log`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Aegis-Internal-Key": process.env.AEGIS_INTERNAL_KEY || "aegis_local_secret"
      },
      body: JSON.stringify({
        ipAddress: ip,
        eventType: "rate_limit",
        details: { path: pathname, limit: 120 },
      }),
    }).catch(err => console.error("Rate limit log request failed:", err));

    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Limit exceeded." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  if (process.env.PLAYWRIGHT_TEST === "true") {
    const response = NextResponse.next();
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.aegis.com;
      connect-src 'self' https://*.clerk.accounts.dev https://clerk.aegis.com http://localhost:8000;
      img-src 'self' data: https://img.clerk.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      frame-src 'self' https://*.clerk.accounts.dev;
      object-src 'none';
      base-uri 'self';
    `.replace(/\s{2,}/g, " ").trim();
    response.headers.set("Content-Security-Policy", cspHeader);

    return response;
  }

  const session = await auth();
  const { userId, orgId } = session;

  // 3. Authentication Checks
  if (!userId && isDashboardRoute(req)) {
    fetch(`${req.nextUrl.origin}/api/security-log`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Aegis-Internal-Key": process.env.AEGIS_INTERNAL_KEY || "aegis_local_secret"
      },
      body: JSON.stringify({
        ipAddress: ip,
        eventType: "auth_failure",
        details: { path: pathname, reason: "Unauthenticated dashboard access attempt" },
      }),
    }).catch(err => console.error("Auth failure log request failed:", err));

    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // 4. B2B Multi-tenancy checks
  if (userId && !orgId && isDashboardRoute(req) && !isAuthRoute(req)) {
    fetch(`${req.nextUrl.origin}/api/security-log`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Aegis-Internal-Key": process.env.AEGIS_INTERNAL_KEY || "aegis_local_secret"
      },
      body: JSON.stringify({
        ipAddress: ip,
        eventType: "authz_failure",
        userId,
        details: { path: pathname, reason: "Missing active Clerk organization" },
      }),
    }).catch(err => console.error("Authz failure log request failed:", err));

    const onboardingUrl = new URL("/onboarding", req.url);
    return NextResponse.redirect(onboardingUrl);
  }

  // 5. Apply Security Headers & CSP
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.aegis.com;
    connect-src 'self' https://*.clerk.accounts.dev https://clerk.aegis.com http://localhost:8000;
    img-src 'self' data: https://img.clerk.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    frame-src 'self' https://*.clerk.accounts.dev;
    object-src 'none';
    base-uri 'self';
  `.replace(/\s{2,}/g, " ").trim();
  response.headers.set("Content-Security-Policy", cspHeader);

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|json|png|jpg|jpeg|gif|svg|ico)).*)",
    "/(api|trpc)(.*)",
  ],
};

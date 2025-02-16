import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const routeToRedirect = "/dashboard";

const publicRoutes = [
  { path: "/pricing", type: "next" },
  { path: "/sign-in", type: "redirect" },
] as const;

const isNextPublicRoute = createRouteMatcher(
  publicRoutes.filter((r) => r.type === "next").map((r) => r.path)
);
const isRedirectPublicRoute = createRouteMatcher(
  publicRoutes.filter((r) => r.type === "redirect").map((r) => r.path)
);

export default clerkMiddleware(
  async (auth, req: NextRequest) => {
    const { userId, redirectToSignIn } = await auth();

    if (userId && isRedirectPublicRoute(req)) {
      console.log(`go to to ${routeToRedirect}`);
      return NextResponse.redirect(new URL(routeToRedirect, req.url));
    }

    const isRedirect = isRedirectPublicRoute(req);
    const isNext = isNextPublicRoute(req);
    if (!userId && !isRedirect && !isNext) {
      console.log(`go to SignIn isRedirect=${isRedirect} isNext=${isNext}`);
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    console.log("go next");
    return NextResponse.next();
  }
  // { debug: true }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

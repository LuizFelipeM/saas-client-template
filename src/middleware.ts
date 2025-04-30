import { clerkMiddleware, ClerkMiddlewareAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import {
  isNextPublicRoute,
  isRedirectPublicRoute,
  routeToRedirect,
} from "./app/(public)/publicRoutes";

const appRouteValidator = async (
  auth: ClerkMiddlewareAuth,
  req: NextRequest
): Promise<Response> => {
  const { userId, redirectToSignIn } = await auth();

  const isRedirect = isRedirectPublicRoute(req);
  if (userId && isRedirect)
    return NextResponse.redirect(new URL(routeToRedirect, req.url));

  const isNext = isNextPublicRoute(req);
  if (!userId && !isRedirect && !isNext)
    return redirectToSignIn({ returnBackUrl: req.url });

  return NextResponse.next();
};

export default clerkMiddleware(
  async (auth, req: NextRequest) => {
    const { pathname } = req.nextUrl;

    if (
      /(\/(api|trpc)\/public|\/_next)/.test(pathname) ||
      /\.(html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/.test(
        pathname
      )
    )
      return NextResponse.next();

    return appRouteValidator(auth, req);
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

import { createRouteMatcher } from "@clerk/nextjs/server";

export const routeToRedirect = "/dashboard";

const publicRoutes = [
  { path: "/", type: "next" },
  { path: "/pricing", type: "next" },
  { path: "/sign-in", type: "redirect" },
] as const;

export const isNextPublicRoute = createRouteMatcher(
  publicRoutes.filter((r) => r.type === "next").map((r) => r.path)
);
export const isRedirectPublicRoute = createRouteMatcher(
  publicRoutes.filter((r) => r.type === "redirect").map((r) => r.path)
);

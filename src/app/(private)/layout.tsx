import { AppSidebar } from "@/components/app-sidebar/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { Providers } from "./providers";

export default async function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();

  const defaultOpen = (await cookies()).get("sidebar:state")?.value === "true";

  return (
    <Providers defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset className="flex-1">
        <header className="flex items-center h-16 px-4 border-b">
          <SidebarTrigger />
          <h1 className="ml-4 text-xl font-semibold">Dashboard</h1>
        </header>
        <main className="p-4">{children}</main>
      </SidebarInset>
    </Providers>
  );
}

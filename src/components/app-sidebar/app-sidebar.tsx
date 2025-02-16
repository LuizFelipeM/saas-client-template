import { MenuItem } from "@/types/menu-item";
import { currentUser } from "@clerk/nextjs/server";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "../ui/sidebar";
import { AppSidebarContentWrapper } from "./app-sidebar-content/app-sidebar-content-wrapper";
import AppSidebarFooterWrapper from "./app-sidebar-footer/app-sidebar-footer-wrapper";

export async function AppSidebar({ items }: { items: MenuItem[] }) {
  const user = await currentUser();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem>
                  <span>Acme Inc</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Acme Corp.</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <AppSidebarContentWrapper items={items} />

      <AppSidebarFooterWrapper
        avatar={user?.imageUrl}
        fullName={user?.fullName}
        email={user?.primaryEmailAddress?.emailAddress}
      />

      <SidebarRail />
    </Sidebar>
  );
}

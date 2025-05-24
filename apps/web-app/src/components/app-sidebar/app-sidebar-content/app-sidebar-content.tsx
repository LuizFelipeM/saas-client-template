import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { MenuItem as MenuItemType, isMenuItemUrl } from "@/types/menu-item";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const MenuItem = React.memo<{
  item: MenuItemType;
}>(function Item({ item }) {
  if (isMenuItemUrl(item))
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={item.url}>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );

  return (
    <Collapsible className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
            <ChevronRight className="transition-transform ml-auto group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.submenus.map(({ title, url }) => (
              <SidebarMenuSubItem key={item.title + title}>
                <SidebarMenuSubButton asChild>
                  <Link href={url}>
                    <span>{title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
});

interface AppSidebarContentProps {
  children: React.ReactNode;
  groupTitle?: string;
}

interface AppSidebarContentCompound extends React.FC<AppSidebarContentProps> {
  MenuItem: typeof MenuItem;
}

const AppSidebarContent: AppSidebarContentCompound = ({
  children,
  groupTitle,
}) => {
  return (
    <SidebarContent>
      {groupTitle ? (
        <SidebarGroup>
          <SidebarGroupLabel>{groupTitle}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{children}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ) : (
        <SidebarMenu>{children}</SidebarMenu>
      )}
    </SidebarContent>
  );
};

AppSidebarContent.MenuItem = MenuItem;

export { AppSidebarContent };

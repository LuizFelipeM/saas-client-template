import { MenuItem } from "@/types/menu-item";
import React from "react";
import { AppSidebarContent } from "./app-sidebar-content";

interface AppSidebarContentWrapperProps {
  items: MenuItem[];
}

export const AppSidebarContentWrapper: React.FC<
  AppSidebarContentWrapperProps
> = ({ items }) => {
  return (
    <AppSidebarContent groupTitle="Application">
      {items?.map((item) => (
        <AppSidebarContent.MenuItem key={item.title} item={item} />
      ))}
    </AppSidebarContent>
  );

  // <SidebarContent>
  //   <SidebarGroup>
  //     <SidebarGroupLabel>Application</SidebarGroupLabel>
  //     <SidebarGroupContent>
  //       <SidebarMenu>
  //         {items?.map((item) => (
  //           <RenderMenuItem key={item.title} item={item} />
  //         ))}
  //       </SidebarMenu>
  //     </SidebarGroupContent>
  //   </SidebarGroup>
  // </SidebarContent>;
};

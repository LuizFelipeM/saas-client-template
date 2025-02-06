"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction, SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronsUpDown } from "lucide-react";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import React from "react";

const Header = React.memo<{
  children: React.ReactNode;
}>(function Header({ children }) {
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton>
        <h4 className="text-sm font-semibold flex gap-2 items-center">
          {children}
        </h4>
        <SidebarMenuAction asChild>
          <ChevronsUpDown />
        </SidebarMenuAction>
      </SidebarMenuButton>
    </DropdownMenuTrigger>
  );
});

const Content = React.memo<{
  children: React.ReactNode;
}>(function Content({ children }) {
  return (
    <DropdownMenuContent side="right" align="end" className="min-w-56">
      {children}
    </DropdownMenuContent>
  );
});

const ContentHeader = React.memo<{ children: React.ReactNode }>(
  function Header({ children }) {
    return <DropdownMenuLabel>{children}</DropdownMenuLabel>;
  }
);

const ContentSeparator = React.memo(function Separator() {
  return <DropdownMenuSeparator />;
});

const ContentItem = React.memo<{
  title: string;
  url: string;
  icon: IconName;
}>(function Item({ icon, title, url }) {
  return (
    <DropdownMenuItem key={title}>
      <a href={url} className="cursor-default text-sm flex gap-2 items-center">
        {typeof icon === "string" && (
          <DynamicIcon name={icon} className="h-4 w-4" />
        )}
        <span>{title}</span>
      </a>
    </DropdownMenuItem>
  );
});

interface AppSidebarFooterProps {
  children: React.ReactNode;
}

interface AppSidebarFooterCompound extends React.FC<AppSidebarFooterProps> {
  Header: typeof Header;
  Content: typeof Content;
  ContentHeader: typeof ContentHeader;
  ContentSeparator: typeof ContentSeparator;
  ContentItem: typeof ContentItem;
}

const AppSidebarFooter: AppSidebarFooterCompound = ({ children }) => {
  return <DropdownMenu>{children}</DropdownMenu>;
};

AppSidebarFooter.Header = Header;
AppSidebarFooter.Content = Content;
AppSidebarFooter.ContentHeader = ContentHeader;
AppSidebarFooter.ContentSeparator = ContentSeparator;
AppSidebarFooter.ContentItem = ContentItem;

export default AppSidebarFooter;

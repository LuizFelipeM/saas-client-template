"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import React from "react";

const Header = React.memo<{
  children: React.ReactNode;
  className?: string;
}>(function Header({ children, className }) {
  return (
    <DropdownMenuTrigger asChild>
      <SidebarMenuButton
        className={`text-sm font-semibold ${className}`}
        asChild
      >
        <span>{children}</span>
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

const ContentHeader = React.memo<{
  children: React.ReactNode;
  className?: string;
}>(function Header({ children, className }) {
  return (
    <DropdownMenuLabel className={className}>{children}</DropdownMenuLabel>
  );
});

const ContentSeparator = React.memo(function Separator() {
  return <DropdownMenuSeparator />;
});

const ContentLink = React.memo<{ title: string; icon: IconName; url: string }>(
  function ContentLink({ icon, title, url }) {
    return (
      <DropdownMenuItem key={title}>
        <a
          href={url}
          className="cursor-default text-sm flex gap-2 items-center"
        >
          {icon && <DynamicIcon name={icon} className="h-4 w-4" />}
          <span>{title}</span>
        </a>
      </DropdownMenuItem>
    );
  }
);

const ContentItem = React.memo<{
  children?: React.ReactNode;
}>(function Item({ children }) {
  return (
    <DropdownMenuItem className="cursor-default text-sm flex gap-2 items-center">
      {children}
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
  ContentLink: typeof ContentLink;
}

const AppSidebarFooter: AppSidebarFooterCompound = ({ children }) => {
  return <DropdownMenu>{children}</DropdownMenu>;
};

AppSidebarFooter.Header = Header;
AppSidebarFooter.Content = Content;
AppSidebarFooter.ContentHeader = ContentHeader;
AppSidebarFooter.ContentSeparator = ContentSeparator;
AppSidebarFooter.ContentItem = ContentItem;
AppSidebarFooter.ContentLink = ContentLink;

export default AppSidebarFooter;

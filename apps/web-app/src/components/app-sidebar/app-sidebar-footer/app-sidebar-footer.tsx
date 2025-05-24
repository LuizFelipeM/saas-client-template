"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { LucideProps } from "lucide-react";
import Link from "next/link";
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

const ContentLink = React.memo<{
  title: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  url: string;
}>(function ContentLink({ icon: Icon, title, url }) {
  return (
    <DropdownMenuItem key={title}>
      <Link
        href={url}
        className="cursor-default text-sm flex gap-2 items-center"
      >
        <Icon className="h-4 w-4" />
        <span>{title}</span>
      </Link>
    </DropdownMenuItem>
  );
});

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
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>{children}</DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

AppSidebarFooter.Header = Header;
AppSidebarFooter.Content = Content;
AppSidebarFooter.ContentHeader = ContentHeader;
AppSidebarFooter.ContentSeparator = ContentSeparator;
AppSidebarFooter.ContentItem = ContentItem;
AppSidebarFooter.ContentLink = ContentLink;

export { AppSidebarFooter };

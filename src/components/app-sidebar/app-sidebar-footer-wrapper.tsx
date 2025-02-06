"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MenuItem } from "@/types/menu-item";
import { User2 } from "lucide-react";
import { IconName } from "lucide-react/dynamic";
import AppSidebarFooter from "./app-sidebar-footer";

interface AppSidebarFooterWrapperProps {
  avatar?: string;
  fullName?: string | null;
  email?: string | null;
}

export default function AppSidebarFooterWrapper({
  avatar,
  fullName,
  email,
}: AppSidebarFooterWrapperProps) {
  const footerItems: MenuItem[] = [
    {
      title: "Organização",
      url: "#",
      icon: "building-2",
    },
    {
      title: "Cobrança",
      url: "#",
      icon: "receipt",
    },
    {
      title: "Contato",
      url: "#",
      icon: "send",
    },
  ];

  const getFallback = (input: string): string => {
    const words = input.trim().split(/\s+/);
    if (words.length < 2) return words[0]?.charAt(0) ?? "";
    return words[0][0] + words[1][0];
  };

  return (
    <AppSidebarFooter>
      <AppSidebarFooter.Header>
        <User2 />
        <span>{fullName ?? email ?? "Configurações"}</span>
      </AppSidebarFooter.Header>
      <AppSidebarFooter.Content>
        <AppSidebarFooter.ContentHeader>
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback>
              {getFallback(fullName ?? "Uknown User")}
            </AvatarFallback>
          </Avatar>
        </AppSidebarFooter.ContentHeader>

        <AppSidebarFooter.ContentSeparator />

        {footerItems.map(({ icon, title, url }, i) => (
          <AppSidebarFooter.ContentItem
            key={`${title}-${i}`}
            icon={icon as IconName}
            title={title}
            url={url}
          />
        ))}
      </AppSidebarFooter.Content>
    </AppSidebarFooter>
  );
}

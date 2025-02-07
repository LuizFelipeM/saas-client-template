"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User2 } from "lucide-react";
import { IconName } from "lucide-react/dynamic";
import AppSidebarFooter from "./app-sidebar-footer";

interface MenuItem {
  title: string;
  url: string;
  icon: IconName;
}

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
  const items: MenuItem[] = [
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
        <AppSidebarFooter.ContentHeader className="flex gap-2">
          <Avatar>
            <AvatarImage src={avatar} />
            <AvatarFallback>
              {getFallback(fullName ?? "Uknown User")}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight font-normal">
            <span className="truncate font-semibold">{fullName}</span>
            <span className="truncate text-xs">{email}</span>
          </div>
        </AppSidebarFooter.ContentHeader>

        <AppSidebarFooter.ContentSeparator />

        {items.map(({ icon, title, url }, i) => (
          <AppSidebarFooter.ContentItem
            key={`${title}-${i}`}
            icon={icon}
            title={title}
            url={url}
          />
        ))}
      </AppSidebarFooter.Content>
    </AppSidebarFooter>
  );
}

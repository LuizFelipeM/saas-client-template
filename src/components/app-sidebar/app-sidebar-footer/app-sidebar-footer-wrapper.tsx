"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MenuItemUrl } from "@/types/menu-item";
import { SignOutButton } from "@clerk/nextjs";
import { Building2, LogOut, Receipt, Send, User2 } from "lucide-react";
import { AppSidebarFooter } from "./app-sidebar-footer";

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
  // const { user } = useUser();

  // if (!has) return null;

  // const canManageSettings = has({ permission: "org:sys_profile:manage" });
  // console.log(
  //   "canManageSettings",
  //   canManageSettings,
  //   "orgId",
  //   orgId,
  //   "orgRole",
  //   orgRole
  // );

  const items: MenuItemUrl[] = [
    {
      title: "Contato",
      url: "#",
      icon: Send,
    },
    ...(true //orgId && canManageSettings
      ? [
          {
            title: "Organização",
            url: "#",
            icon: Building2,
          },
          {
            title: "Cobrança",
            url: "#",
            icon: Receipt,
          },
        ]
      : []),
  ];

  const getFallback = (input: string): string => {
    const words = input.trim().split(/\s+/);
    if (words.length < 2)
      return words[0] ? words[0]?.charAt(0) + words[0]?.charAt(1) : "";
    return words[0][0] + words[1][0];
  };

  return (
    <AppSidebarFooter>
      <AppSidebarFooter.Header className="cursor-pointer">
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
            <span className="truncate font-semibold">
              {fullName ?? "Configurações"}
            </span>
            <span className="truncate text-xs">{email ?? "-"}</span>
          </div>
        </AppSidebarFooter.ContentHeader>

        <AppSidebarFooter.ContentSeparator />

        {items.map(({ icon, title, url }, i) => (
          <AppSidebarFooter.ContentLink
            key={`${title}-${i}`}
            icon={icon}
            title={title}
            url={url}
          />
        ))}

        <AppSidebarFooter.ContentSeparator />

        <AppSidebarFooter.ContentItem>
          <SignOutButton redirectUrl="/sign-in">
            <button className="cursor-default text-sm flex gap-2 items-center">
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </SignOutButton>
        </AppSidebarFooter.ContentItem>
      </AppSidebarFooter.Content>
    </AppSidebarFooter>
  );
}

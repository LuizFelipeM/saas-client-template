import { MenuItem } from "@/types/menu-item";
import { Bot, LayoutDashboard } from "lucide-react";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Models",
    icon: Bot,
    submenus: [
      {
        title: "DeepSeek",
        url: "/deepseek",
      },
      {
        title: "ChatGPT",
        url: "/chatgpt",
      },
    ],
  },
];

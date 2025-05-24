import { LucideProps } from "lucide-react";

export type MenuItem = MenuItemUrl | MenuItemSubmenu;

export const isMenuItemUrl = (value: MenuItem): value is MenuItemUrl =>
  "url" in value;

export interface MenuItemUrl {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  submenus?: never;
}

export interface MenuItemSubmenu {
  title: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  submenus: Omit<MenuItemUrl, "icon" | "submenus">[];
  url?: never;
}

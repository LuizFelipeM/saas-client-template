import { LucideProps } from "lucide-react";
import { IconName } from "lucide-react/dynamic";

export interface MenuItem {
  title: string;
  url: string;
  icon:
    | IconName
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >;
}

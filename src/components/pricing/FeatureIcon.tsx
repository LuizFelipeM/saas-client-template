import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";

interface FeatureIconProps {
  name?: string;
  className?: string;
  size?: number;
  included: boolean;
}

export default function FeatureIcon({
  name,
  className,
  size = 20,
  included,
}: FeatureIconProps) {
  // If no icon name is provided, use CheckIcon for included features and XIcon for excluded
  if (!name) {
    const IconComponent = included ? LucideIcons.CheckIcon : LucideIcons.XIcon;
    return (
      <IconComponent
        size={size}
        className={cn(!included && "text-gray-300", className)}
      />
    );
  }

  // Try to get the icon by name
  const IconComponent = (LucideIcons as Record<string, any>)[name];

  // Fallback to CircleIcon if the icon isn't found
  if (!IconComponent) {
    return (
      <LucideIcons.CircleIcon
        size={size}
        className={cn(!included && "text-gray-300", className)}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      className={cn(!included && "text-gray-300", className)}
    />
  );
}

import * as React from "react";
import { Icon as IconifyIcon } from "@iconify/react";

// This component serves as a wrapper/proxy for Tabler icons
// It's designed to be used with unplugin-icons for on-demand loading of icons
// instead of importing all icons from @tabler/icons-react

interface IconProps {
  icon: string;
  size?: number | string;
  stroke?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({
  icon,
  size = 24,
  stroke = 2,
  color = "currentColor",
  className,
  style,
}) => {
  // Convert from our internal format to Iconify format
  // 1. Remove 'Icon' prefix if present
  // 2. Convert camelCase/PascalCase to kebab-case
  // Example: "MessagePlus" -> "message-plus"
  const iconName = icon
    .replace(/^Icon/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();

  // Tabler icons in Iconify use "tabler" as the prefix
  const fullIconName = `tabler:${iconName}`;

  return (
    <IconifyIcon
      icon={fullIconName}
      width={size}
      height={size}
      color={color}
      className={className}
      style={{ strokeWidth: stroke, ...style }}
    />
  );
};

export default Icon;

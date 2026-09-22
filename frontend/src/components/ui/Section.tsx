import React from "react";
import { cn } from "@/utils/cn";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "none";
  as?: React.ElementType;
}

/**
 * Global Section Component
 * Bound directly to the global CSS section tokens (--section-padding-y).
 * Guarantees uniform vertical top-to-bottom spacing throughout the entire website.
 */
export default function Section({
  children,
  className = "",
  size = "default",
  as: Component = "section",
  ...props
}: SectionProps) {
  const paddingClass =
    size === "sm"
      ? "section-padding-sm"
      : size === "none"
      ? "py-0"
      : "section-padding";

  return (
    <Component className={cn(paddingClass, className)} {...props}>
      {children}
    </Component>
  );
}

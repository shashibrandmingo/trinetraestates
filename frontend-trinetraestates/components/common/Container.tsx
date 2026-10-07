import React from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * Global Container Component
 * Enforces unified left-to-right margins, max-width, and responsive padding across all sections.
 */
export default function Container({
  children,
  className,
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

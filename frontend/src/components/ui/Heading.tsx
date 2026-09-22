import React from "react";
import { cn } from "@/utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: React.ReactNode;
  className?: string;
}

/**
 * Global Heading Component
 * Guaranteed typography hierarchy across the entire website.
 * Uses fluid font-size tokens defined centrally in globals.css.
 */
export default function Heading({
  as: Tag = "h2",
  children,
  className = "",
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn(Tag, className)} {...props}>
      {children}
    </Tag>
  );
}

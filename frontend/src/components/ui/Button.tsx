import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href?: string;
  variant?: "gold" | "blue" | "outline-gold" | "outline-blue";
  size?: "sm" | "md" | "lg";
  withArrow?: boolean;
  className?: string;
}

/**
 * Global Button Component
 * Bound to CSS variables in globals.css (--gold, --primary, --radius-button).
 * Changing colors in globals.css automatically updates every button.
 */
export default function Button({
  children,
  href,
  variant = "gold",
  size = "md",
  withArrow = false,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const variantClasses: Record<string, string> = {
    gold: "btn-gold",
    blue: "btn-blue",
    "outline-gold": "btn-outline-gold",
    "outline-blue": "btn-outline-blue",
  };

  const sizeClasses: Record<string, string> = {
    sm: "text-xs px-3.5 py-2",
    md: "text-sm px-6 py-3",
    lg: "text-base px-8 py-3.5",
  };

  const buttonClasses = cn(
    "btn",
    variantClasses[variant] || variantClasses.gold,
    sizeClasses[size] || sizeClasses.md,
    className
  );

  const content = (
    <>
      <span>{children}</span>
      {withArrow && <i className="fa-solid fa-arrow-right text-xs ml-1" aria-hidden="true" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} className={buttonClasses} {...props}>
      {content}
    </button>
  );
}

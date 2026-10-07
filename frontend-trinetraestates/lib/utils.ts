import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind and custom classnames safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees format (e.g., ₹ 1.75 L / mo or ₹ 45,000)
 */
export function formatIndianCurrency(amount?: number): string {
  if (!amount || isNaN(amount)) return "Price on Request";
  if (amount >= 100000) {
    const inLakh = amount / 100000;
    return `₹ ${inLakh.toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`;
  }
  return `₹ ${amount.toLocaleString("en-IN")}`;
}

/**
 * Format area in Sq. Ft.
 */
export function formatArea(sqFt?: number | string): string {
  if (!sqFt) return "Area on Request";
  const num = typeof sqFt === "string" ? parseInt(sqFt.replace(/[^0-9]/g, ""), 10) : sqFt;
  if (isNaN(num)) return String(sqFt);
  return `${num.toLocaleString("en-IN")} Sq. Ft.`;
}

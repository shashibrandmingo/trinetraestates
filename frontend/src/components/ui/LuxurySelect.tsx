"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface LuxurySelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

/**
 * LuxurySelect Component
 * 
 * Elegant theme-aligned custom dropdown for forms across the website.
 * Styled with global design tokens (--gold, --gold-light, --border-subtle, --bg-surface).
 * Features:
 * - Smart auto-positioning (opens upward if space below is limited)
 * - Custom luxury scrollbar (no Windows OS gray scrollbar)
 * - Error border styling
 * - Smooth rotation and animations
 */
export default function LuxurySelect({
  name,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  icon,
  className,
  disabled = false,
  error,
}: LuxurySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Smart direction detection: open upward if near bottom of screen or card
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If space below is less than 230px and there is more room above, open upward
      if (spaceBelow < 230 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, [isOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "ArrowDown" && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full select-none", className)}
      style={{ zIndex: isOpen ? 50 : 1 }}
    >
      {/* Hidden input for standard form serialization */}
      <input type="hidden" name={name} value={value} />

      {/* Left Input Icon */}
      {icon && (
        <span
          className={cn(
            "absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10.5px] transition-colors duration-200 z-10",
            error
              ? "text-rose-400"
              : isOpen
              ? "text-[var(--gold)]"
              : "text-[var(--text-muted)]"
          )}
          aria-hidden="true"
        >
          <i className={icon} />
        </span>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "w-full rounded-lg border text-left text-[11.5px] py-1.5 pr-7 transition-all duration-200 cursor-pointer flex items-center justify-between outline-none",
          icon ? "pl-7.5" : "pl-3",
          error
            ? "border-rose-400 bg-rose-50/15 focus:border-rose-500 ring-1 ring-rose-300/40"
            : isOpen
            ? "border-[var(--gold)] bg-[var(--bg-surface)] ring-2 ring-[var(--gold)]/20 shadow-xs"
            : "border-[var(--border-subtle)] bg-[var(--bg-subtle)]/60 hover:border-[var(--gold)]/60 hover:bg-[var(--bg-surface)]",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "truncate block leading-normal",
            selectedOption
              ? "text-[var(--text-heading)] font-medium"
              : "text-[var(--text-muted)]"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {/* Right Animated Chevron */}
        <span
          className={cn(
            "absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px] transition-transform duration-200",
            error
              ? "text-rose-400"
              : isOpen
              ? "rotate-180 text-[var(--gold)]"
              : "text-[var(--text-muted)]"
          )}
          aria-hidden="true"
        >
          <i className="fa-solid fa-chevron-down" />
        </span>
      </button>

      {/* Luxury Theme Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={cn(
            "absolute left-0 right-0 bg-[var(--bg-surface)] border border-[var(--gold-border)] rounded-xl shadow-[0_12px_28px_-4px_rgba(10,35,60,0.18),0_4px_12px_-2px_rgba(10,35,60,0.08)] p-1 z-50 max-h-52 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(157,116,72,0.3)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[var(--gold)]/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[var(--gold)]/60 animate-in fade-in zoom-in-98 duration-150",
            openUpward
              ? "bottom-[calc(100%+4px)] shadow-[0_-12px_28px_-4px_rgba(10,35,60,0.18),0_-4px_12px_-2px_rgba(10,35,60,0.08)]"
              : "top-[calc(100%+4px)]"
          )}
        >
          {/* Default / Reset Option */}
          <div
            role="option"
            aria-selected={!value}
            onClick={() => handleSelect("")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-[11.5px] cursor-pointer flex items-center justify-between transition-colors my-0.5 font-medium",
              !value
                ? "bg-[var(--gold-light)] text-[var(--gold)] font-semibold"
                : "text-[var(--text-muted)] hover:bg-[var(--gold-light)] hover:text-[var(--gold)]"
            )}
          >
            <span>{placeholder}</span>
            {!value && (
              <i className="fa-solid fa-check text-[9.5px] text-[var(--gold)]" aria-hidden="true" />
            )}
          </div>

          {/* Option Items */}
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11.5px] cursor-pointer flex items-center justify-between transition-colors my-0.5 font-medium",
                  isSelected
                    ? "bg-[var(--gold-light)] text-[var(--gold)] font-semibold"
                    : "text-[var(--text-heading)] hover:bg-[var(--gold-light)] hover:text-[var(--gold)]"
                )}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <i className="fa-solid fa-check text-[9.5px] text-[var(--gold)]" aria-hidden="true" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

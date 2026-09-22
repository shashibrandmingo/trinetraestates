"use client";

import React, { useEffect } from "react";
import RequirementForm, { RequirementFormData } from "@/components/forms/RequirementForm";

export interface RequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: RequirementFormData;
  onSubmit?: (data: RequirementFormData) => Promise<void> | void;
}

/**
 * RequirementModal Component
 * 
 * Luxury Popup Dialog that opens when users click cards on:
 * 1. EXPLORE BY LOCATION (PopularSectorsSection)
 * 2. FIND YOUR IDEAL SPACE (SpaceCategoriesSection)
 * 3. Premium Office Spaces in Noida (FeaturedPropertiesSection)
 */
export default function RequirementModal({
  isOpen,
  onClose,
  initialData = {},
  onSubmit,
}: RequirementModalProps) {
  // Handle Escape key and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Lock background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-requirement-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto"
    >
      {/* Dark Luxury Blur Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#07192b]/75 backdrop-blur-xs transition-opacity animate-fade-in"
        aria-hidden="true"
      />

      {/* Modal Dialog Card Container */}
      <div className="relative w-full max-w-[420px] bg-[var(--bg-surface)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(10,35,60,0.35)] border border-[var(--border-card)] z-10 my-auto animate-scale-in">
        {/* Sleek Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--gold-light)] text-[var(--text-muted)] hover:text-[var(--gold)] border border-[var(--border-subtle)] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs hover:rotate-90 z-20"
        >
          <i className="fa-solid fa-xmark text-sm" aria-hidden="true" />
        </button>

        {/* Reusable Form inside Modal */}
        <RequirementForm
          isModal={true}
          initialData={initialData}
          onSubmit={onSubmit}
          onSuccess={() => {
            setTimeout(() => {
              onClose();
            }, 3000);
          }}
        />
      </div>
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import EnquiryForm from "@/components/forms/EnquiryForm";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * GLOBAL ENQUIRY MODAL POPUP
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable modal popup containing the EnquiryForm.
 * Can be opened from any "Enquire Now" / "Book a Visit" / "Get Quote" button.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  propertyName?: string;
  initialLookingFor?: string;
  initialPreferredLocation?: string;
}

export default function EnquiryModal({
  isOpen,
  onClose,
  title = "Get in Touch with our Workspace Experts",
  subtitle = "Share your requirements and we will find the ideal commercial office space in Noida for you.",
  propertyName = "",
  initialLookingFor = "",
  initialPreferredLocation = "",
}: EnquiryModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Modal Card — Centered, Responsive & Fully Visible on All Screen Sizes */}
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-black/10 z-10 my-auto overflow-hidden animate-scale-up">
        {/* Top Decorative Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b58b53] via-[#deb881] to-[#b58b53] z-20" />

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm"
        >
          <i className="fa-solid fa-xmark text-sm" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-3 sm:space-y-4">
          {/* Header */}
          <div className="space-y-1 pr-7">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[1.5px] bg-[var(--color-gold)] inline-block" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#b58b53] font-sans">
                QUICK ENQUIRY
              </span>
            </div>

            <h3 className="font-heading text-base sm:text-lg lg:text-xl font-medium text-[#141414] leading-snug">
              {title}
            </h3>

            <p className="text-[11px] sm:text-xs text-zinc-500 font-sans leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Reusable Form */}
          <EnquiryForm
            isModal={true}
            initialLookingFor={initialLookingFor}
            initialPreferredLocation={initialPreferredLocation}
            onSuccess={() => {
              setTimeout(() => {
                onClose();
              }, 2500);
            }}
          />
        </div>
      </div>
    </div>
  );
}

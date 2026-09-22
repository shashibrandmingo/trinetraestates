"use client";

import React from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import RequirementForm, { RequirementFormData } from "@/components/forms/RequirementForm";

export interface ContactCtaSectionProps {
  onFormSubmit?: (data: RequirementFormData) => Promise<void> | void;
}

export default function ContactCtaSection({ onFormSubmit }: ContactCtaSectionProps) {
  return (
    <section
      id="contact"
      className="contact-cta-section py-5 sm:py-7 lg:py-8 bg-[var(--bg-main)] relative overflow-hidden"
    >
      {/* Subtle luxury ambient decorative circle */}
      <div
        className="absolute -top-28 -left-28 w-80 h-80 rounded-full border border-[var(--gold-border)]/20 pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-28 -right-28 w-96 h-96 rounded-full border border-[var(--gold-border)]/20 pointer-events-none -z-10"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* 2-Column Responsive Layout: Left Compact Form + Right Compact Image Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          {/* Left Column: Global Requirement Form Card */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
            <div className="w-full h-full">
              <RequirementForm
                onSubmit={onFormSubmit}
                badge="GET STARTED"
                title="Find Your Perfect Office Space"
                subtitle="Our team will get in touch with the best options for you."
                className="w-full max-w-none h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-5.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[0_8px_24px_-6px_rgba(10,35,60,0.06)] hover:shadow-[0_12px_32px_-6px_rgba(10,35,60,0.09)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Column: User ctaimage.png + Compact Floating Pill & Assistance Bar */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--border-subtle)] shadow-[0_8px_24px_-6px_rgba(10,35,60,0.06)] hover:shadow-[0_12px_32px_-6px_rgba(10,35,60,0.09)] transition-all duration-300 w-full h-full min-h-[340px] sm:min-h-[400px] lg:min-h-full bg-[var(--primary)] group">
              {/* User Background Image */}
              <Image
                src="/images/ctaimage/ctaimage.png"
                alt="Find Your Perfect Office Space - Noida Commercial Workspaces"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
              />

              {/* Refined gradient overlay for contrast and text clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary)]/75 via-transparent to-black/15 pointer-events-none" />

              {/* Top-Left Floating Badge (Compact & Refined) */}
              <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 z-20 bg-white/90 backdrop-blur-md rounded-lg sm:rounded-xl py-1 sm:py-1.5 px-2.5 sm:px-3 shadow-xs border border-white/60 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold)] text-[10px]">
                  <i className="fa-solid fa-city" aria-hidden="true" />
                </div>
                <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.16em] uppercase text-[var(--text-heading)]">
                  PREMIUM &nbsp;&bull;&nbsp; FLEXIBLE &nbsp;&bull;&nbsp; STRATEGIC
                </span>
              </div>

              {/* Bottom Direct Assistance Card (Compact, Sleek & Luxury) */}
              <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 z-20 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-2.5 sm:p-3 md:px-4 md:py-3 shadow-[0_10px_28px_-5px_rgba(10,35,60,0.14)] border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3.5 transition-all duration-300">
                <div className="space-y-0.5 text-left">
                  <div className="text-[8.5px] sm:text-[9px] font-bold tracking-[0.16em] uppercase text-[var(--gold)]">
                    DIRECT ASSISTANCE
                  </div>
                  <h4 className="text-xs sm:text-[13.5px] md:text-[14.5px] font-bold text-[var(--text-heading)] leading-snug">
                    Need Immediate Office Options?
                  </h4>
                  <p className="text-[10.5px] sm:text-[11px] text-[var(--text-body)]">
                    Speak directly with our Noida leasing manager.
                  </p>
                </div>

                <a
                  href="tel:9999901196"
                  className="btn btn-gold rounded-lg sm:rounded-xl px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold tracking-wide shrink-0 flex items-center justify-center gap-1.5 shadow-xs hover:shadow-sm hover:scale-102 active:scale-95 transition-all w-full sm:w-auto"
                >
                  <i className="fa-solid fa-phone text-[10px]" aria-hidden="true" />
                  <span>Call: 99999 01196</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

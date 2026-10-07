"use client";

import React from "react";
import Image from "next/image";
import EnquiryForm from "@/components/forms/EnquiryForm";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPONENT: GetInTouch (Contact / Enquiry Section)
 * ─────────────────────────────────────────────────────────────────────────────
 * - Equal 50/50 balance & full-height match between left and right columns
 * - Left side: Curated luxury image with asymmetric curves & floating stats
 * - Right side: Section header + 3 value props + Reusable EnquiryForm
 * ─────────────────────────────────────────────────────────────────────────────
 */

export default function GetInTouch() {
  return (
    <section
      id="get-in-touch"
      className="relative bg-white text-[#141414] section-padding overflow-hidden"
    >
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          
          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN: LUXURY ARCHITECTURAL IMAGE & FLOATING STATS (50%)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 relative flex flex-col justify-between h-full">
            
            {/* Top Tagline */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-5 sm:w-6 h-[1.5px] bg-[var(--color-gold)] inline-block shrink-0" />
              <span className="text-[9px] sm:text-[9.5px] tracking-[0.2em] uppercase text-gray-500 font-semibold font-sans">
                A BRIGHTER NOIDA AHEAD
              </span>
            </div>

            {/* Main Image Container — dynamically stretches to match right form height */}
            <div className="relative w-full flex-1 min-h-[480px] sm:min-h-[540px] lg:min-h-[610px] rounded-tl-[48px] sm:rounded-tl-[60px] rounded-br-[48px] sm:rounded-br-[60px] rounded-tr-[16px] rounded-bl-[16px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.1)] border border-black/[0.05]">
              <Image
                src="/images/gateintuch/gateintuch.png"
                alt="Modern commercial office space in Noida"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />

              {/* Ambient gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

              {/* Floating Bottom Stats Pill Card & Tagline */}
              <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 z-10 space-y-3">
                {/* Stats Pill Card */}
                <div className="bg-[#faf8f5]/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-[0_12px_32px_rgba(0,0,0,0.14)] border border-white/80 transition-all duration-300 hover:shadow-[0_16px_36px_rgba(198,153,96,0.18)] hover:-translate-y-0.5">
                  <div className="grid grid-cols-3 divide-x divide-black/[0.08] text-center">
                    <div className="px-1.5 sm:px-3">
                      <span className="font-heading text-lg sm:text-2xl font-semibold text-[var(--color-gold)] block leading-tight tracking-tight">
                        500+
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#141414] font-sans font-medium leading-tight block mt-1">
                        Spaces Supported
                      </span>
                    </div>

                    <div className="px-1.5 sm:px-3">
                      <span className="font-heading text-lg sm:text-2xl font-semibold text-[var(--color-gold)] block leading-tight tracking-tight">
                        20+
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#141414] font-sans font-medium leading-tight block mt-1">
                        Prime Locations
                      </span>
                    </div>

                    <div className="px-1.5 sm:px-3">
                      <span className="font-heading text-lg sm:text-2xl font-semibold text-[var(--color-gold)] block leading-tight tracking-tight">
                        100+
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#141414] font-sans font-medium leading-tight block mt-1">
                        Happy Businesses
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtle Inner Tagline */}
                <div className="flex items-center gap-2 pl-1">
                  <span className="w-5 sm:w-6 h-[1.5px] bg-white/75 inline-block shrink-0" />
                  <span className="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-white/90 font-medium font-sans">
                    PREMIUM WORKSPACES FOR A BRIGHTER TOMORROW.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN: HEADING, VALUE PROPS & COMPACT ENQUIRY FORM (50%)
              ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-3 sm:space-y-3.5">
            
            {/* Header Block */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-block w-5 sm:w-6 h-[1.5px] bg-[var(--color-gold)]" />
                <span className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.22em] uppercase text-[var(--color-gold)] font-sans">
                  GET IN TOUCH
                </span>
              </div>

              <h2 className="font-heading text-[22px] sm:text-[26px] lg:text-[30px] font-normal text-[#141414] leading-[1.18] tracking-tight">
                Let&apos;s Find a <br />
                <span className="text-gold font-medium">Workspace</span> <br />
                for Your Next Move
              </h2>

              <p className="text-[11.5px] sm:text-xs text-zinc-600 font-sans leading-relaxed max-w-lg">
                Share your requirements and our experts <br className="hidden sm:inline" />
                will get back to you with the best options in Noida.
              </p>
            </div>

            {/* 3 Value Props Feature Badges — Refined Compact Luxury Style */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 py-1">
              {/* Feature 1 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full bg-[#fbf6ee] border border-[#c69960]/25 flex items-center justify-center text-[#c69960] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c69960] group-hover:text-white group-hover:shadow-md">
                  <i className="fa-solid fa-city text-xs sm:text-[13px] transition-colors" />
                </div>
                <span className="font-sans text-[11px] sm:text-[12px] font-medium text-[#141414] leading-tight mt-1.5 block">
                  Curated Options
                </span>
                <span className="text-[9px] sm:text-[9.5px] text-zinc-500 font-sans leading-tight mt-0.5 block">
                  Only verified spaces
                </span>
              </div>

              {/* Feature 2 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full bg-[#fbf6ee] border border-[#c69960]/25 flex items-center justify-center text-[#c69960] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c69960] group-hover:text-white group-hover:shadow-md">
                  <i className="fa-regular fa-user text-xs sm:text-[13px] transition-colors" />
                </div>
                <span className="font-sans text-[11px] sm:text-[12px] font-medium text-[#141414] leading-tight mt-1.5 block">
                  Expert Guidance
                </span>
                <span className="text-[9px] sm:text-[9.5px] text-zinc-500 font-sans leading-tight mt-0.5 block">
                  From search to site visit
                </span>
              </div>

              {/* Feature 3 */}
              <div className="group flex flex-col items-center text-center">
                <div className="w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-full bg-[#fbf6ee] border border-[#c69960]/25 flex items-center justify-center text-[#c69960] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#c69960] group-hover:text-white group-hover:shadow-md">
                  <i className="fa-regular fa-clock text-xs sm:text-[13px] transition-colors" />
                </div>
                <span className="font-sans text-[11px] sm:text-[12px] font-medium text-[#141414] leading-tight mt-1.5 block">
                  Hassle-Free
                </span>
                <span className="text-[9px] sm:text-[9.5px] text-zinc-500 font-sans leading-tight mt-0.5 block">
                  We handle the rest
                </span>
              </div>
            </div>

            {/* Reusable Form Container Card */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 lg:p-4.5 border border-black/[0.07] shadow-[0_8px_28px_rgba(0,0,0,0.05)]">
              <EnquiryForm />
            </div>

            {/* Bottom Accent */}
            <div className="flex items-center justify-end gap-2 pt-0.5 pr-1">
              <span className="w-5 h-[1.5px] bg-[var(--color-gold)] inline-block shrink-0" />
              <span className="text-[8px] sm:text-[9px] tracking-[0.22em] uppercase text-gray-400 font-semibold font-sans">
                SPACES &nbsp;•&nbsp; PEOPLE &nbsp;•&nbsp; POSSIBILITIES
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

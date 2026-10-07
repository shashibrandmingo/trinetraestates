"use client";

import React, { useState } from "react";
import Image from "next/image";
import EnquiryModal from "@/components/modals/EnquiryModal";

interface LetsTalkProps {
  phone?: string;
  phoneRaw?: string;
}

export default function LetsTalk({
  phone = "+91 99999 01196",
  phoneRaw = "+919999901196",
}: LetsTalkProps) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <section id="lets-talk" className="relative bg-white py-8 sm:py-12 lg:py-16 overflow-hidden">
      <div className="site-container max-w-6xl">
        
        {/* ── MAIN COMPACT & FULLY RESPONSIVE CARD ── */}
        <div className="relative rounded-[22px] sm:rounded-[32px] lg:rounded-[36px] bg-[#fbf9f6] border border-black/[0.06] shadow-[0_10px_35px_rgba(0,0,0,0.03)] overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[300px] lg:min-h-[340px]">
            
            {/* ── LEFT COLUMN: HEADINGS & CALL TO ACTION ── */}
            <div className="lg:col-span-5 p-5 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-center space-y-3 sm:space-y-4 z-10 text-left">
              
              {/* Eyebrow */}
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-zinc-400 font-sans">
                LET&apos;S TALK
              </span>

              {/* Main Heading */}
              <h2 className="font-heading text-[24px] sm:text-[32px] lg:text-[38px] font-medium tracking-tight text-[#141414] leading-[1.15]">
                Find a Space <br />
                <span className="text-[#b58b53] font-medium">That Works for You</span>
              </h2>

              {/* Description */}
              <p className="text-zinc-600 text-[12px] sm:text-[13px] font-sans leading-relaxed max-w-sm">
                Tell us your requirements and our experts will get back to you with the best options.
              </p>

              {/* Action Buttons & Contact Row */}
              <div className="pt-1.5 sm:pt-2 flex flex-wrap items-center gap-3.5 sm:gap-5">
                
                {/* Enquire Now Pill Button */}
                <button
                  type="button"
                  onClick={() => setIsEnquiryOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#b58b53] to-[#a07742] hover:from-[#a07742] hover:to-[#8c6534] text-white text-[11.5px] sm:text-xs font-medium transition-all duration-300 shadow-[0_4px_14px_rgba(181,139,83,0.3)] hover:shadow-[0_6px_18px_rgba(181,139,83,0.4)] hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Enquire Now</span>
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </button>

                {/* Call Us Link */}
                <div className="flex items-center gap-1.5 text-[11.5px] sm:text-xs font-sans">
                  <span className="underline underline-offset-4 decoration-zinc-400 text-zinc-600 font-normal">
                    Call Us
                  </span>
                  <a
                    href={`tel:${phoneRaw}`}
                    className="font-medium text-[#141414] hover:text-[#b58b53] transition-colors"
                  >
                    {phone}
                  </a>
                </div>

              </div>
            </div>

            {/* ── MIDDLE COLUMN: GLASS BUILDING PANORAMA WITH SEAMLESS BLEND ── */}
            <div className="lg:col-span-4 px-4 sm:px-6 lg:px-0 relative h-56 sm:h-64 lg:h-[340px] w-full flex items-center justify-center overflow-hidden">
              
              {/* Soft Ambient Sky Backdrop Container */}
              <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-tr from-[#eef4f9]/70 via-[#f4f8fc]/40 to-[#e8f1f8]/80">
                
                {/* Building Asset */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/images/letstalk/LET'S TALK.png"
                    alt="Modern Corporate Commercial Building in Noida"
                    fill
                    sizes="(max-width: 640px) 95vw, (max-width: 1024px) 50vw, 35vw"
                    className="object-contain object-bottom sm:object-center drop-shadow-md scale-95 sm:scale-100"
                    priority
                  />
                </div>

                {/* Left Feather / Soft Fade for Seamless Card Integration (Desktop Only) */}
                <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#fbf9f6] via-[#fbf9f6]/40 to-transparent pointer-events-none z-10" />
              </div>

            </div>

            {/* ── RIGHT COLUMN: STATEMENT & PROPERTIES TRUST BADGE ── */}
            <div className="lg:col-span-3 p-5 sm:p-7 md:p-8 lg:p-8 flex flex-col justify-between items-start lg:items-end lg:text-right space-y-4 sm:space-y-6 lg:space-y-8 z-10">
              
              {/* Stacked Vertical Statement with Gold Line */}
              <div className="flex flex-col items-start lg:items-end space-y-0.5">
                <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-zinc-500 font-sans font-semibold">
                  A
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-zinc-500 font-sans font-semibold">
                  BRIGHTER
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-zinc-500 font-sans font-semibold">
                  NOIDA
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-zinc-500 font-sans font-semibold">
                  AHEAD
                </span>
                <span className="w-7 sm:w-9 h-[2px] bg-[#deb881] inline-block mt-1.5 sm:mt-2" />
              </div>

              {/* Social Proof: 3 Commercial Property Photo Circles + Trusted Tag */}
              <div className="flex items-center gap-2.5">
                {/* 3 Overlapping Circular Property Photos (Exact Match to SS 2) */}
                <div className="flex -space-x-2.5 overflow-hidden">
                  <div className="inline-block h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full ring-2 ring-white overflow-hidden relative bg-neutral-200 shadow-sm">
                    <Image
                      src="/images/sectors/sector-62.jpg"
                      alt="Commercial Property 1"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="inline-block h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full ring-2 ring-white overflow-hidden relative bg-neutral-200 shadow-sm">
                    <Image
                      src="/images/sectors/sector-142.jpg"
                      alt="Commercial Property 2"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <div className="inline-block h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full ring-2 ring-white overflow-hidden relative bg-neutral-200 shadow-sm">
                    <Image
                      src="/images/sectors/sector-18.jpg"
                      alt="Commercial Property 3"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Tag */}
                <div className="text-left">
                  <span className="text-[8px] sm:text-[8.5px] font-semibold text-zinc-400 tracking-wider uppercase block font-sans leading-tight">
                    TRUSTED BY
                  </span>
                  <span className="text-[8.5px] sm:text-[9px] font-semibold text-zinc-800 tracking-wider uppercase block font-sans leading-tight">
                    GROWING BUSINESSES
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ── BOTTOM BRAND & SLOGAN BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 sm:pt-6 text-zinc-400 text-center sm:text-left">
          <span className="text-[8.5px] sm:text-[9.5px] font-semibold tracking-[0.22em] uppercase font-sans">
            TRINETRA ESTATES
          </span>
          <div className="hidden sm:block flex-1 max-w-sm h-[1px] bg-black/10 mx-4" />
          <span className="text-[8.5px] sm:text-[9.5px] font-semibold tracking-[0.22em] uppercase font-sans">
            SPACES &nbsp; PEOPLE &nbsp; POSSIBILITIES
          </span>
        </div>

      </div>

      {/* ── GLOBAL ENQUIRY MODAL ── */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        title="Find Your Ideal Office Space in Noida"
        subtitle="Share your requirements and our commercial real estate experts will connect with you within 30 minutes."
        initialLookingFor="Commercial Office Space"
      />
    </section>
  );
}



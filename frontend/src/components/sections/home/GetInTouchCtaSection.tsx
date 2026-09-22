"use client";

import React from "react";
import Container from "@/components/ui/Container";
import { useInView } from "@/hooks/useInView";

export interface GetInTouchCtaSectionProps {
  onOpenForm?: (data?: { type?: string }) => void;
}

export default function GetInTouchCtaSection({ onOpenForm }: GetInTouchCtaSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.12, triggerOnce: true });

  const stats = [
    { value: "500+", label: "Spaces Available" },
    { value: "1,000+", label: "Businesses Served" },
    { value: "98%", label: "Client Satisfaction" },
  ];

  return (
    <section
      ref={sectionRef}
      className="get-in-touch-cta-section global-section-padding-last bg-[var(--bg-main)] relative overflow-hidden"
    >
      <Container className="relative z-10">
        {/* Main Luxury Banner Container */}
        <div
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[var(--gold-light)] via-[var(--bg-surface)] to-[var(--gold-light)] border border-[var(--gold-border)]/70 shadow-[0_8px_30px_-6px_rgba(10,35,60,0.06)] overflow-hidden transition-all duration-700 animate-fade-up"
        >
          {/* Far-Left Vertical Tagline */}
          <div className="absolute left-6 xl:left-8 top-10 xl:top-12 z-20 hidden xl:block select-none pointer-events-none">
            <div className="text-[9.5px] font-bold tracking-[0.22em] uppercase text-[var(--text-muted)] leading-[1.6]">
              <div>SPACES</div>
              <div>PEOPLE</div>
              <div>POSSIBILITIES</div>
            </div>
            <div className="w-6 h-[1.5px] bg-[var(--gold)] rounded-full mt-2" />
          </div>

          {/* Left Side: Cutout */}
          <div className="lg:absolute lg:left-0 lg:bottom-0 lg:top-0 lg:w-[48%] xl:w-[49%] w-full h-[190px] sm:h-[240px] lg:h-full pointer-events-none z-10 overflow-hidden flex items-end justify-center lg:justify-start pt-2 sm:pt-4 lg:pt-0">
            <img
              src="/images/cta/GET IN TOUCH.png"
              alt="Premium Noida Commercial Workspace Building"
              className="h-full w-auto max-w-none object-contain lg:object-left-bottom drop-shadow-[0_10px_25px_rgba(10,35,60,0.08)]"
            />
          </div>

          {/* Right Side */}
          <div className="relative z-20 lg:ml-auto w-full lg:w-[57%] xl:w-[55%] p-4 sm:p-8 lg:py-9 lg:pr-8 xl:pr-10 lg:pl-4 flex flex-col justify-between">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-8 border-b border-[var(--gold-border)]/60">
              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-2 mb-1.5 sm:mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--gold)]">
                    LET&apos;S BUILD TOGETHER
                  </span>
                  <span className="w-8 sm:w-10 h-[1.5px] bg-[var(--gold)] rounded-full" />
                </div>

                <h2 className="text-[15.5px] min-[390px]:text-[17px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] font-bold text-[var(--text-heading)] leading-[1.24] tracking-tight">
                  <span className="block whitespace-nowrap">The right workspace today,</span>
                  <span className="block whitespace-nowrap mt-0.5 sm:mt-1">a bigger tomorrow.</span>
                </h2>
              </div>

              <div className="flex items-center sm:border-l sm:border-[var(--gold-border)]/60 sm:pl-6 shrink-0 self-start sm:self-center mt-1 sm:mt-0">
                <button
                  type="button"
                  onClick={() => onOpenForm && onOpenForm({ type: "get-in-touch" })}
                  className="group flex flex-row sm:flex-col items-center gap-2.5 sm:gap-2 cursor-pointer transition-transform duration-300 hover:-translate-y-0.5"
                  aria-label="Get In Touch"
                >
                  <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-white flex items-center justify-center text-xs sm:text-sm shadow-md transition-all duration-300 group-hover:scale-108 group-hover:shadow-lg shrink-0">
                    <i className="fa-solid fa-arrow-right text-[12px] sm:text-[13px] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </div>

                  <span className="text-[10px] sm:text-[10px] font-bold tracking-[0.18em] uppercase text-[var(--text-heading)] group-hover:text-[var(--gold)] transition-colors whitespace-nowrap">
                    GET IN TOUCH
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Row: 3 Real Statistics */}
            <div className="pt-4 sm:pt-7 grid grid-cols-3 gap-1.5 sm:gap-4">
              {stats.map((stat, idx) => {
                const isLast = idx === stats.length - 1;
                return (
                  <div
                    key={stat.label}
                    className={`flex flex-col text-left ${!isLast ? "border-r border-[var(--gold-border)]/60 pr-1.5 sm:pr-4" : ""
                      }`}
                  >
                    <div className="text-base sm:text-xl lg:text-2xl font-bold text-[var(--text-heading)] tracking-tight">
                      {stat.value}
                    </div>
                    <div className="text-[9.5px] min-[380px]:text-[10px] sm:text-[11.5px] lg:text-xs text-[var(--text-muted)] font-normal mt-0.5 leading-snug">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

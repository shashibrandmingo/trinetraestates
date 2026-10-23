"use client";

import React, { useState } from "react";
import Container from "@/components/ui/Container";
import { useInView } from "@/hooks/useInView";
import { faqsData, FaqItem } from "@/data/faqsData";

export type { FaqItem };
export { faqsData };

export default function FaqSection() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="faq-section global-section-padding bg-[var(--bg-main)] relative overflow-hidden"
    >
      {/* Subtle ambient luxury gold glow in background */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[340px] bg-[var(--gold-light)]/30 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* Section Header - Short, Punchy & SEO Targeted */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          {/* Eyebrow */}
          <div
            className={`flex items-center justify-center gap-3 sm:gap-4 mb-2.5 sm:mb-3 transition-opacity duration-500 ${
              isInView ? "animate-fade-down" : "opacity-0"
            }`}
          >
            <span className="w-8 sm:w-12 h-[1px] bg-[var(--gold)]/60 rounded-full" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[var(--gold)]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-[var(--gold)]/60 rounded-full" />
          </div>

          {/* Main Short SEO Heading */}
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-[var(--text-heading)] leading-tight tracking-tight transition-opacity duration-500 ${
              isInView ? "animate-fade-up delay-100" : "opacity-0"
            }`}
          >
            Office Space in <span className="text-[var(--gold)]">Noida FAQs</span>
          </h2>

          <p
            className={`text-[13px] sm:text-[14.5px] md:text-[15px] text-[var(--text-body)] leading-relaxed font-normal mt-2 max-w-xl mx-auto transition-opacity duration-500 ${
              isInView ? "animate-fade-up delay-200" : "opacity-0"
            }`}
          >
            Everything you need to know about verified commercial workspaces, IT corridors, and leasing in Noida.
          </p>
        </div>

        {/* FAQs Accordion Cards */}
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-3.5">
          {faqsData.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xl sm:rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? "bg-[var(--bg-surface)] border-[var(--gold)]/60 shadow-[0_8px_24px_-8px_rgba(157,116,72,0.12)]"
                    : "bg-[var(--bg-surface)]/80 hover:bg-[var(--bg-surface)] border-[var(--border-card)] hover:border-[var(--gold)]/40 shadow-xs"
                } ${
                  isInView ? `animate-fade-up delay-${Math.min((index + 1) * 60, 400)}` : "opacity-0"
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3.5 sm:gap-4 text-left cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <span
                      className={`shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[10.5px] sm:text-[11px] font-bold flex items-center justify-center transition-colors duration-300 ${
                        isOpen
                          ? "bg-[var(--gold)] text-white shadow-xs"
                          : "bg-[var(--gold-light)] text-[var(--gold-hover)] group-hover:bg-[var(--gold)] group-hover:text-white"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-[13.5px] sm:text-[15px] md:text-[15.5px] font-semibold tracking-tight transition-colors duration-200 leading-snug ${
                        isOpen
                          ? "text-[var(--gold-hover)]"
                          : "text-[var(--text-heading)] group-hover:text-[var(--gold)]"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  {/* Clean Animated Toggle Indicator */}
                  <div
                    className={`shrink-0 w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                      isOpen
                        ? "bg-[var(--gold)] text-white rotate-180"
                        : "bg-[var(--border-subtle)]/70 text-[var(--text-muted)] group-hover:bg-[var(--gold-light)] group-hover:text-[var(--gold)]"
                    }`}
                  >
                    <i className="fa-solid fa-chevron-down text-[10px]" aria-hidden="true" />
                  </div>
                </button>

                {/* Accordion Content */}
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={faq.id}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0 text-[12.5px] sm:text-[13.5px] md:text-[14px] text-[var(--text-body)] leading-relaxed border-t border-[var(--gold-border)]/30 mt-1">
                      <p className="pt-2.5 sm:pt-3">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

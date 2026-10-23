"use client";

import React, { useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqsData: FaqItem[] = [
  {
    id: "faq-1",
    question: "What are the best locations for commercial office space for rent in Noida?",
    answer:
      "The top commercial hubs in Noida include Sector 62 (established IT hub with excellent Blue Line metro connectivity), Sector 132, Sector 135 & Sector 142 (Noida-Greater Noida Expressway corporate corridor), Sector 16 & Sector 18 (prime central retail & business district), Sector 63, and Sector 125. Trinetra Estates offers verified commercial office spaces across all these prime sectors.",
  },
  {
    id: "faq-2",
    question: "What types of commercial office spaces does Trinetra Estates provide?",
    answer:
      "Trinetra Estates provides fully furnished plug-and-play office spaces, managed coworking desks, bare shell commercial properties, and custom built-to-suit enterprise office floors ranging from 500 sq.ft to 50,000+ sq.ft with 100% verified listings and 0% brokerage options.",
  },
  {
    id: "faq-3",
    question: "What is the average rent for office space in Noida?",
    answer:
      "Commercial office rent in Noida typically ranges from ₹35/sq.ft for bare shell setups up to ₹60–₹110/sq.ft for Grade-A IT parks and commercial corporate towers, depending on the sector, metro accessibility, building amenities, and furnishing quality.",
  },
  {
    id: "faq-4",
    question: "How can I book a site visit for office spaces in Noida?",
    answer:
      "You can connect directly with Trinetra Estates commercial leasing specialists by calling +91 99999 01196 or submitting an enquiry on our website. Our team arranges same-day guided site visits with curated options tailored to your team size and budget.",
  },
  {
    id: "faq-5",
    question: "Does Trinetra Estates assist with lease agreements and negotiations?",
    answer:
      "Yes, Trinetra Estates provides complete end-to-end commercial advisory, including space shortlisting, transparent price negotiation with landlords, legal lease agreement drafting, and smooth key handover.",
  },
];

export default function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative z-10 bg-white text-[#141414] py-14 sm:py-20 lg:py-24 border-t border-neutral-100 overflow-hidden"
    >
      {/* Subtle warm luxury ambient backdrop */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#deb881]/10 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          {/* Eyebrow with gold accent lines */}
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <span className="w-6 sm:w-10 h-[1.5px] bg-[#c69960]" />
            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.22em] uppercase text-[#8c6b3e]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <span className="w-6 sm:w-10 h-[1.5px] bg-[#c69960]" />
          </div>

          {/* Main SEO Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#141414] tracking-tight leading-tight">
            Office Space in <span className="text-[#c69960]">Noida FAQs</span>
          </h2>

          <p className="text-[13.5px] sm:text-[15px] text-[#555555] mt-2.5 max-w-xl mx-auto leading-relaxed">
            Everything you need to know about verified commercial properties, IT corridors, and leasing with Trinetra Estates.
          </p>
        </div>

        {/* Accordion Cards */}
        <div className="max-w-3xl mx-auto space-y-3.5 sm:space-y-4">
          {faqsData.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-xl sm:rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? "bg-white border-[#c69960]/80 shadow-[0_10px_28px_-6px_rgba(198,153,96,0.18)]"
                    : "bg-[#faf8f5] hover:bg-white border-[#e8e2d8] hover:border-[#c69960]/50 shadow-xs"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-4 text-left cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <span
                      className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full text-[11px] sm:text-[12px] font-bold flex items-center justify-center transition-colors duration-300 ${
                        isOpen
                          ? "bg-[#c69960] text-white shadow-xs"
                          : "bg-[#eee7dc] text-[#8c6b3e] group-hover:bg-[#c69960] group-hover:text-white"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={`text-[14.5px] sm:text-[16px] font-medium transition-colors duration-200 leading-snug ${
                        isOpen
                          ? "text-[#141414] font-semibold"
                          : "text-[#222222] group-hover:text-[#c69960]"
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>

                  <span
                    className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen
                        ? "bg-[#c69960]/15 text-[#c69960] rotate-180"
                        : "bg-white border border-neutral-200 text-neutral-400 group-hover:border-[#c69960]/40 group-hover:text-[#c69960] rotate-0"
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current stroke-2"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-4 sm:pb-5 pt-0 pl-14 sm:pl-18 pr-6">
                      <p className="text-[13.5px] sm:text-[14.5px] text-[#4a4a4a] leading-relaxed border-t border-[#f0ece5] pt-3">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Helper Bar for High Conversion & Local Trust */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-[13px] sm:text-[14px] text-[#666666] inline-flex flex-wrap items-center justify-center gap-1.5 bg-[#faf8f5] border border-[#e8e2d8] px-5 py-2.5 rounded-full shadow-2xs">
            <span>Have more questions about office leasing in Noida?</span>
            <a
              href="tel:+919999901196"
              className="font-semibold text-[#c69960] hover:underline inline-flex items-center gap-1"
            >
              <span>Talk to our leasing manager</span>
              <span>→</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";

interface WhyChooseItem {
  id: string;
  num: string;
  icon: string;
  title: string;
  description: string;
}

const WHY_CHOOSE_ITEMS: WhyChooseItem[] = [
  {
    id: "prime-locations",
    num: "01",
    icon: "fa-solid fa-location-dot",
    title: "Prime Locations",
    description:
      "Access premium office spaces across Noida's key business hubs.",
  },
  {
    id: "wide-options",
    num: "02",
    icon: "fa-solid fa-building",
    title: "Wide Range of Options",
    description:
      "From coworking spaces to GRADE A offices, we have spaces for every business size.",
  },
  {
    id: "expert-guidance",
    num: "03",
    icon: "fa-solid fa-handshake",
    title: "Expert Guidance",
    description:
      "End-to-end support including site visits, negotiations and documentation.",
  },
  {
    id: "verified-trusted",
    num: "04",
    icon: "fa-solid fa-shield-halved",
    title: "Verified & Trusted",
    description:
      "Only genuine and legally verified properties from reputed developers.",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      className="relative bg-white text-[#141414] py-8 sm:py-10 lg:py-12 overflow-hidden"
    >
      <div className="site-container">
        
        {/* ── TOP CENTERED HEADER ── */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2 pb-6 sm:pb-8">
          
          {/* Eyebrow Tag with Dual Gold Accent Lines */}
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block w-6 sm:w-8 h-[1.5px] bg-[var(--color-gold)]" />
            <span className="text-[10px] sm:text-[10.5px] font-semibold tracking-[0.2em] uppercase text-gray-500 font-sans">
              WHY CHOOSE US
            </span>
            <span className="inline-block w-6 sm:w-8 h-[1.5px] bg-[var(--color-gold)]" />
          </div>

          {/* Main H2 Heading */}
          <h2 className="font-heading text-[24px] sm:text-[30px] lg:text-[36px] font-medium tracking-tight text-[#141414] leading-[1.15]">
            More Than Spaces,
            <br />
            <span className="text-gold font-normal">A Partner in Your Growth.</span>
          </h2>

          {/* Subtitle / Description Paragraph */}
          <p className="text-[12px] sm:text-[13px] text-[#555] font-normal leading-relaxed max-w-xl mx-auto pt-0.5">
            We go beyond just finding office spaces. We provide the right spaces, guidance and support to help your business thrive in Noida.
          </p>

        </div>

        {/* ── 4 LUXURY COMPACT FEATURE CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-4.5">
          {WHY_CHOOSE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="
                group relative bg-white
                rounded-2xl sm:rounded-3xl
                border border-gray-100/90
                p-4.5 sm:p-5 lg:p-5.5
                shadow-[0_4px_18px_rgba(0,0,0,0.03)]
                hover:shadow-[0_14px_30px_rgba(198,153,96,0.12)]
                hover:border-[var(--color-gold-border)]
                transition-all duration-500 hover:-translate-y-1
                flex flex-col justify-between cursor-pointer
              "
            >
              <div>
                {/* Top Row: Circular Icon Badge & Step Number */}
                <div className="flex items-center justify-between pb-3.5 sm:pb-4">
                  {/* Soft Gold-tinted Round Icon Container */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--color-gold-light)] text-[var(--color-gold)] flex items-center justify-center text-[15px] sm:text-[16px] group-hover:scale-105 group-hover:bg-[var(--color-gold)] group-hover:text-white transition-all duration-300 shadow-sm">
                    <i className={item.icon} />
                  </div>

                  {/* Card Step Number */}
                  <span className="text-[11px] sm:text-[11.5px] font-semibold text-gray-300 tracking-wider font-sans">
                    {item.num}
                  </span>
                </div>

                {/* Card Title (Compact, Elegant & 1 Single Line matching Screenshot 1) */}
                <h3 className="!text-[14px] sm:!text-[14.5px] lg:!text-[15px] font-heading font-semibold text-[#0e0e0e] tracking-tight leading-snug group-hover:text-gold transition-colors">
                  {item.title}
                </h3>

                {/* Card Description */}
                <p className="text-[11.5px] sm:text-[12px] text-[#64748b] font-normal leading-[1.55] mt-1.5">
                  {item.description}
                </p>
              </div>

              {/* Bottom Row: Circular Action Arrow Button */}
              <div className="pt-3.5 sm:pt-4">
                <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[var(--color-gold-light)] text-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                  <i className="fa-solid fa-arrow-right text-[9.5px] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

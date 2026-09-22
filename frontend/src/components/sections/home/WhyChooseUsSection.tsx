"use client";

import React from "react";
import Container from "@/components/ui/Container";
import { useInView } from "@/hooks/useInView";

export default function WhyChooseUsSection() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.12, triggerOnce: true });

  const features = [
    {
      id: 1,
      icon: "fa-solid fa-location-dot",
      title: "Prime Locations",
      description:
        "Access premium office spaces across Noida's key business hubs.",
    },
    {
      id: 2,
      icon: "fa-regular fa-building",
      title: "Wide Range of Options",
      description:
        "From coworking spaces to GRADE A offices, we have spaces for every business size.",
    },
    {
      id: 3,
      icon: "fa-solid fa-handshake",
      title: "Expert Guidance",
      description:
        "End-to-end support including site visits, negotiations and documentation.",
    },
    {
      id: 4,
      icon: "fa-solid fa-shield-halved",
      title: "Verified & Trusted",
      description:
        "Only genuine and legally verified properties from reputed developers.",
    },
  ];

  return (
    <section
      id="why-choose-us"
      ref={sectionRef}
      className="why-choose-us-section global-section-padding bg-[var(--bg-main)] relative overflow-hidden"
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--gold-light)]/40 rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* Top Centered Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          {/* Subtitle Badge with Elegant Horizontal Lines */}
          <div
            className={`flex items-center justify-center gap-3 sm:gap-4 mb-2.5 sm:mb-3 transition-opacity duration-500 ${
              isInView ? "animate-fade-down" : "opacity-0"
            }`}
          >
            <span className="w-8 sm:w-12 h-[1px] bg-[var(--gold)]/60 rounded-full" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.22em] uppercase text-[var(--gold)]">
              WHY CHOOSE US
            </span>
            <span className="w-8 sm:w-12 h-[1px] bg-[var(--gold)]/60 rounded-full" />
          </div>

          {/* Main 2-Line Headline */}
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold tracking-tight leading-[1.18] transition-opacity duration-500 ${
              isInView ? "animate-fade-up delay-100" : "opacity-0"
            }`}
          >
            <span className="text-[var(--text-heading)] block">More Than Spaces,</span>
            <span className="text-[var(--gold)] block mt-0.5 sm:mt-1">A Partner in Your Growth.</span>
          </h2>

          {/* Subtitle Paragraph */}
          <p
            className={`text-xs sm:text-sm lg:text-[14.5px] text-[var(--text-muted)] max-w-2xl mx-auto mt-2.5 sm:mt-3 leading-relaxed font-normal transition-opacity duration-500 ${
              isInView ? "animate-fade-up delay-200" : "opacity-0"
            }`}
          >
            We go beyond just finding office spaces. We provide the right spaces, guidance and support to help your business thrive in Noida.
          </p>
        </div>

        {/* 4 Feature Columns Grid with Vertical Hairline Dividers */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 lg:gap-0 transition-opacity duration-500 ${
            isInView ? "animate-fade-up delay-300" : "opacity-0"
          }`}
        >
          {features.map((feature, idx) => {
            const isLastOnDesktop = idx === features.length - 1;
            const isLastOnTabletEven = (idx + 1) % 2 === 0;

            return (
              <div
                key={feature.id}
                className={`group flex flex-col items-center text-center px-3 sm:px-4 lg:px-4.5 xl:px-6 transition-all duration-300 relative ${
                  !isLastOnDesktop ? "lg:border-r lg:border-[var(--border-subtle)]" : ""
                } ${
                  !isLastOnTabletEven ? "sm:border-r sm:border-[var(--border-subtle)] lg:border-r-0" : ""
                }`}
              >
                {/* Circular Icon Container */}
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-[var(--gold-light)] border border-[var(--gold-border)]/80 flex items-center justify-center text-[var(--gold)] text-lg sm:text-xl mb-3 sm:mb-4 group-hover:scale-110 group-hover:bg-[var(--gold)] group-hover:text-white group-hover:border-[var(--gold)] transition-all duration-300 shadow-xs cursor-default">
                  <i className={feature.icon} aria-hidden="true" />
                </div>

                {/* Feature Title */}
                <h3 className="text-[14px] sm:text-[14.5px] lg:text-[15px] font-bold text-[var(--text-heading)] group-hover:text-[var(--gold)] transition-colors duration-200 leading-snug whitespace-nowrap">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-[11.5px] sm:text-[12px] lg:text-[12.5px] text-[var(--text-muted)] font-normal leading-relaxed mt-2 max-w-[260px] mx-auto">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { useInView } from "@/hooks/useInView";

export default function AboutSection() {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.12, triggerOnce: true });

  const features = [
    {
      icon: "fa-solid fa-location-dot",
      title: "Prime",
      subtitle: "Locations",
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "Trusted",
      subtitle: "Advisory",
    },
    {
      icon: "fa-regular fa-building",
      title: "Wide Range",
      subtitle: "of Options",
    },
    {
      icon: "fa-solid fa-user-group",
      title: "End-to-End",
      subtitle: "Support",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section global-section-padding-first bg-[var(--bg-main)] overflow-hidden"
    >
      <Container>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-14 xl:gap-16">
          {/* Left Column: Story, Highlights & CTA */}
          <div className="w-full lg:w-[50%] xl:w-[48%] space-y-4 sm:space-y-6 text-left">
            {/* Eyebrow Label */}
            <div
              className={`inline-flex items-center gap-2.5 sm:gap-3 transition-opacity duration-500 ${
                isInView ? "animate-fade-down" : "opacity-0"
              }`}
            >
              <span className="w-7 sm:w-8 h-[2px] bg-[var(--gold)] rounded-full" />
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.18em] uppercase text-[var(--gold)]">
                ABOUT US
              </span>
            </div>

            {/* Main Section Heading */}
            <h2
              className={`text-[1.65rem] sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold text-[var(--text-heading)] leading-[1.18] tracking-tight transition-opacity duration-500 ${
                isInView ? "animate-fade-up delay-100" : "opacity-0"
              }`}
            >
              Redefining Workspaces <br />
              <span className="text-[var(--gold)]">in Noida</span>
            </h2>

            {/* Descriptive Body Text */}
            <p
              className={`text-[13px] sm:text-[15px] md:text-[15.5px] text-[var(--text-body)] leading-relaxed font-normal transition-opacity duration-500 ${
                isInView ? "animate-fade-up delay-200" : "opacity-0"
              }`}
            >
              We specialize in providing premium office spaces across Noida for
              businesses of every size. From startups to established enterprises,
              we help you find the right space to work, grow and succeed.
            </p>

            {/* 4 Feature Points with Clean Responsive Dividers */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-4 pt-2 sm:pt-3 pb-1 border-y border-[var(--border-subtle)] sm:border-y-0 transition-opacity duration-500 ${
                isInView ? "animate-fade-up delay-300" : "opacity-0"
              }`}
            >
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center p-2.5 sm:p-0 sm:px-3.5 group cursor-default transition-transform hover:-translate-y-0.5 ${
                    idx % 2 === 0 ? "border-r" : "border-r-0"
                  } ${
                    idx < 2
                      ? "border-b pb-3 sm:border-b-0 sm:pb-0"
                      : "pt-3 sm:pt-0"
                  } sm:border-r sm:last:border-r-0 border-[var(--border-subtle)]`}
                >
                  <div className="text-[var(--gold)] text-xl sm:text-2xl sm:text-[26px] mb-1.5 transition-transform duration-300 group-hover:scale-110">
                    <i className={item.icon} aria-hidden="true" />
                  </div>
                  <div className="text-[12px] sm:text-[13px] font-semibold text-[var(--text-heading)] leading-snug">
                    {item.title}
                  </div>
                  <div className="text-[10.5px] sm:text-[11.5px] text-[var(--text-muted)] font-normal mt-0.5">
                    {item.subtitle}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div
              className={`pt-1 sm:pt-2 transition-opacity duration-500 ${
                isInView ? "animate-fade-up delay-400" : "opacity-0"
              }`}
            >
              <Link
                href="#about"
                className="btn btn-gold w-full sm:w-auto px-7 py-3 rounded-xl inline-flex items-center justify-center gap-2.5 text-xs sm:text-[13.5px] tracking-wide"
              >
                <span>Learn More About Us</span>
                <i
                  className="fa-solid fa-arrow-right text-[11px]"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>

          {/* Right Column: Office Image with Floating Quote Card */}
          <div className="w-full lg:w-[50%] xl:w-[50%]">
            <div
              className={`relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_16px_40px_-8px_rgba(10,35,60,0.12)] border border-[var(--border-card)] group transition-opacity duration-500 ${
                isInView ? "animate-scale-in delay-150" : "opacity-0"
              }`}
            >
              <img
                src="/images/homepagesimage/about.png"
                alt="Noida Office Spaces Workspace & Reception"
                className="w-full h-[300px] sm:h-[400px] lg:h-[470px] xl:h-[490px] object-cover object-center transition-transform duration-700 group-hover:scale-102"
              />

              {/* Floating Quote Card */}
              <div
                className={`absolute bottom-3 left-3 right-3 sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-[310px] bg-[var(--bg-surface)]/95 sm:bg-[var(--bg-surface)] backdrop-blur-md sm:backdrop-blur-none rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-[0_10px_30px_-4px_rgba(10,35,60,0.22)] border border-[var(--border-card)] transition-opacity duration-500 ${
                  isInView ? "animate-fade-up delay-300" : "opacity-0"
                }`}
              >
                {/* Quotation Icon */}
                <i
                  className="fa-solid fa-quote-left text-xl sm:text-2xl lg:text-3xl text-[var(--gold)]"
                  aria-hidden="true"
                />

                {/* Quote Text */}
                <p className="text-[12px] sm:text-[13.5px] lg:text-[14.5px] font-semibold text-[var(--text-heading)] leading-snug mt-1 sm:mt-2">
                  &ldquo;More than spaces, we create possibilities for your
                  business.&rdquo;
                </p>

                {/* Golden Line Separator */}
                <span className="block w-6 sm:w-8 h-[1.5px] sm:h-[2px] bg-[var(--gold)] mt-2 sm:mt-3 mb-1.5 sm:mb-2 rounded-full" />

                {/* Attribution */}
                <span className="text-[9px] sm:text-[10.5px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)] block">
                  TEAM NOIDA OFFICE SPACES
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

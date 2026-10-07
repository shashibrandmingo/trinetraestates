"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { STATS, TRUSTED_BUSINESSES } from "@/lib/constants";
import VideoModal from "@/components/modals/VideoModal";

/**
 * AboutUs Section — Ultra-luxury real estate about section on clean white background
 * - Left Column:
 *    - Subtitle: "ABOUT TRINETRA ESTATES —"
 *    - Heading: "Spaces That Inspire Progress" (Dark + Gold accent)
 *    - Paragraph: Descriptive body text about Trinetra Estates
 *    - CTA Buttons: "Our Story →" + "Watch Our Journey" (Play button with modal)
 *    - Slogan: "PEOPLE • SPACES • POSSIBILITIES" (High contrast, clearly visible)
 * - Right Column:
 *    - Image: '/images/about/about.png' with luxury top-left arched curve
 *    - Floating Stats Card: 500+ Spaces Available | 20+ Prime Locations | 100+ Happy Businesses (Dark, crisp labels)
 * - Bottom Bar:
 *    - "TRUSTED BY BUSINESSES LIKE YOURS"
 *    - Categories: Startups / SMEs / Enterprises / IT / ITES / Retail Brands / Professional Firms
 *    - Right Slogan: "DIFFERENT BUSINESSES. A BRIGHTER NOIDA."
 * - Compact vertical rhythm and smooth scroll animations
 * - 100% Global CSS variables, Font Awesome 6 icons (Zero SVGs)
 */
export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Start visible immediately so content is never blank, animate gracefully
    setIsVisible(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        id="about"
        ref={sectionRef}
        className="relative z-10 bg-white text-[#0a0100] pt-10 sm:pt-14 lg:pt-16 pb-6 sm:pb-8 lg:pb-10 overflow-hidden"
      >
        <div className="site-container relative z-10">
          
          {/* ═══════════════════════════════════════════════════════════════
              TOP TWO-COLUMN LAYOUT: Content (Left) & Image with Stats (Right)
              ═══════════════════════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* ── LEFT COLUMN: Text Content & CTAs ── */}
            <div
              className={`lg:col-span-6 space-y-5 sm:space-y-6 transition-all duration-700 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Eyebrow / Subtitle */}
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] sm:text-[11.5px] tracking-[0.2em] font-semibold text-[var(--color-gold)] uppercase font-sans">
                  ABOUT TRINETRA ESTATES
                </span>
                <span className="w-8 sm:w-12 h-[1.5px] bg-[var(--color-gold)]" />
              </div>

              {/* Main Heading */}
              <h2 className="heading-h2 text-[#0a0100] text-[28px] sm:text-[38px] lg:text-[46px] leading-[1.15]">
                Spaces That
                <br />
                <span className="text-gold font-normal">Inspire Progress</span>
              </h2>

              {/* Body Text */}
              <p className="text-[14px] sm:text-[15px] leading-relaxed max-w-lg text-[#4a4a4a] font-normal">
                At Trinetra Estates, we go beyond real estate to create meaningful
                workspaces. We curate premium office environments across Noida that
                help startups, SMEs and enterprises grow, collaborate and achieve more.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3.5 sm:gap-5 pt-1">
                {/* Our Story Button */}
                <a
                  href="#why-choose-us"
                  className="btn-gold !px-5 !py-2.5 text-[13px] group"
                >
                  <span>Our Story</span>
                  <i className="fa-solid fa-arrow-right text-[11px] transition-transform duration-300 group-hover:translate-x-1" />
                </a>

                {/* Watch Our Journey Button Link to Instagram Reel */}
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  aria-label="Watch Our Journey"
                  className="inline-flex items-center gap-2.5 group cursor-pointer text-left"
                >
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--color-gold-border)] bg-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-sm">
                    <i className="fa-solid fa-play text-[10px] ml-0.5" />
                  </span>
                  <div>
                    <span className="block text-[12.5px] sm:text-[13px] font-semibold text-[#0a0100] group-hover:text-[var(--color-gold)] transition-colors">
                      Watch Our Journey
                    </span>
                    <span className="block text-[10.5px] sm:text-[11px] text-[#666] font-normal">
                      A glimpse into Trinetra Estates
                    </span>
                  </div>
                </button>
              </div>

              {/* Bottom Slogan Line */}
              <div className="pt-2 sm:pt-3 flex items-center gap-2.5">
                <span className="w-6 h-[1.5px] bg-[var(--color-gold)]" />
                <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-semibold text-[#555] font-sans">
                  PEOPLE • SPACES • POSSIBILITIES
                </p>
              </div>
            </div>

            {/* ── RIGHT COLUMN: Arched Image & Floating Stats Card ── */}
            <div
              className={`lg:col-span-6 relative transition-all duration-700 delay-100 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* Image Container with Luxury Arched Top-Left Corner */}
              <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-black/5 bg-[#f8f8f8]">
                <Image
                  src="/images/about/about.png"
                  alt="Trinetra Estates Reception Office"
                  width={800}
                  height={550}
                  unoptimized
                  className="w-full h-[300px] sm:h-[380px] lg:h-[420px] object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Subtle Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* ── FLOATING STATS BADGE CARD (High Contrast Crisp Dark Text) ── */}
              <div className="relative lg:absolute lg:-bottom-5 lg:left-5 lg:right-5 bg-white rounded-2xl shadow-[0_14px_35px_rgba(0,0,0,0.12)] border border-black/10 p-3.5 sm:p-4.5 mt-3 lg:mt-0">
                <div className="flex items-center justify-between sm:justify-around gap-2 sm:gap-5 text-center">
                  {STATS.map((stat, idx) => (
                    <React.Fragment key={stat.label}>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[18px] sm:text-[22px] font-medium text-gold font-heading leading-none">
                          {stat.value}
                        </h4>
                        <p className="text-[#333] text-[10px] sm:text-[11.5px] font-medium mt-1 whitespace-nowrap">
                          {stat.label}
                        </p>
                      </div>
                      {idx < STATS.length - 1 && (
                        <div className="w-[1px] h-6 sm:h-7 bg-black/15 shrink-0 self-center" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ═══════════════════════════════════════════════════════════════
              BOTTOM TRUSTED TICKER BAR: "TRUSTED BY BUSINESSES LIKE YOURS"
              ═══════════════════════════════════════════════════════════════ */}
          <div
            className={`mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-black/10 transition-all duration-700 delay-200 ease-out ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              
              {/* Left: Ticker Subtitle & Category Pills */}
              <div className="space-y-2">
                <p className="text-[10px] sm:text-[10.5px] tracking-[0.2em] uppercase font-semibold text-[#666] font-sans">
                  TRUSTED BY BUSINESSES LIKE YOURS
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] text-[#222] font-medium">
                  {TRUSTED_BUSINESSES.map((item, idx) => (
                    <React.Fragment key={item}>
                      <span className="hover:text-[var(--color-gold)] transition-colors cursor-default">
                        {item}
                      </span>
                      {idx < TRUSTED_BUSINESSES.length - 1 && (
                        <span className="text-[#aaa]">/</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Right: Tagline */}
              <div className="hidden lg:flex items-center gap-3 text-right lg:border-l lg:border-black/10 lg:pl-6">
                <div className="text-[10px] sm:text-[10.5px] tracking-[0.2em] uppercase font-semibold text-[#555] font-sans leading-tight">
                  DIFFERENT BUSINESSES.
                  <br />
                  <span className="text-[#0a0100]">A BRIGHTER NOIDA.</span>
                </div>
                <span className="w-1 h-7 bg-[var(--color-gold)] rounded-full" />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── VIDEO JOURNEY MODAL (Ultra-Luxury Responsive Video Modal) ── */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="Our Journey • Trinetra Estates"
        subtitle="Modern Workspaces in Noida"
        videoSrc="/videos/our-journey.mp4"
        instagramUrl="https://www.instagram.com/reel/DdTlSRyMuc9/"
        instagramEmbedUrl="https://www.instagram.com/reel/DdTlSRyMuc9/embed/"
      />
    </>
  );
}

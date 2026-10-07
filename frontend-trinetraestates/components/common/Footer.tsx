"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SITE_CONFIG, NAV_LINKS, SPACE_TYPES } from "@/lib/constants";

/**
 * Footer — Ultra-luxury responsive footer
 * - Responsive background image:
 *    - Mobile (< md): 'footermobilebanner.png' via .footer-banner-bg
 *    - Desktop (md+): 'footer bg.png' via .footer-banner-bg
 * - Mobile 2-by-2 Grid Layout:
 *    - Row 1: Logo + Tagline + Socials (compact)
 *    - Row 2: 2-Col (Col A: Quick Links, Col B: Our Spaces)
 *    - Row 3: 2-Col (Col A: Call & Email, Col B: Office Address)
 *    - Row 4: Stay Updated Newsletter (Sleek full-width pill)
 *    - Row 5: Copyright & Legal
 * - Desktop Layout: 5-Col elegant luxury layout
 * - 100% Global CSS variables, Font Awesome 6 icons (zero SVGs)
 */
export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <footer
      className="footer-banner-bg relative text-white overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
      }}
    >
      {/* Subtle overlay if needed on mobile for readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none md:hidden" />

      {/* ═══════════════════════════════════════════════════════════════
          1. MAIN NAVIGATION & NEWSLETTER (2-by-2 on Mobile, 5-Col on Desktop)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 pt-8 sm:pt-12 lg:pt-20 pb-8 sm:pb-12">
        <div className="site-container">
          <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-6 sm:gap-y-8 items-start">
            
            {/* ── COL 1: Brand Logo, Tagline & Socials (Full width on Mobile, 3-col on Desktop) ── */}
            <div className="col-span-2 lg:col-span-3 space-y-3 sm:space-y-4">
              <a
                href="/"
                onClick={(e) => scrollToSection(e, "/")}
                className="inline-block group"
                aria-label="Trinetra Estates Home"
              >
                <Image
                  src="/images/logo/Trinetra Estates logo.png"
                  alt="Trinetra Estates"
                  width={220}
                  height={60}
                  unoptimized
                  className="h-[42px] sm:h-[48px] lg:h-[54px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 origin-left"
                />
              </a>

              <p className="font-heading italic text-white/90 text-[13.5px] sm:text-[15px] leading-snug sm:leading-relaxed max-w-xs">
                Spaces for People.
                <br />
                Possibilities for a{" "}
                <span className="text-gold font-normal">Bigger Tomorrow.</span>
              </p>

              {/* Social Media Icons — Active: Instagram only */}
              <div className="flex items-center gap-2 pt-0.5">
                {/* LinkedIn - Pending account creation
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(198,153,96,0.3)]"
                >
                  <i className="fa-brands fa-linkedin-in text-[10.5px] sm:text-[11.5px]" />
                </a>
                */}

                {/* Instagram (Active) */}
                <a
                  href="https://www.instagram.com/trinetraestate/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow Trinetra Estates on Instagram"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(198,153,96,0.3)]"
                >
                  <i className="fa-brands fa-instagram text-[10.5px] sm:text-[11.5px]" />
                </a>

                {/* Facebook - Pending account creation
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(198,153,96,0.3)]"
                >
                  <i className="fa-brands fa-facebook-f text-[10.5px] sm:text-[11.5px]" />
                </a>
                */}

                {/* YouTube - Pending account creation
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center text-white/80 hover:bg-[var(--color-gold)] hover:border-[var(--color-gold)] hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(198,153,96,0.3)]"
                >
                  <i className="fa-brands fa-youtube text-[10.5px] sm:text-[11.5px]" />
                </a>
                */}
              </div>
            </div>

            {/* ── COL 2: Quick Links (1-Col on Mobile side-by-side with Our Spaces, 2-col on Desktop) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-2 sm:space-y-3">
              <div>
                <h4 className="footer-heading">
                  QUICK LINKS
                </h4>
                <div className="w-5 h-[1.5px] bg-[var(--color-gold)] rounded-full mt-1" />
              </div>

              <ul className="space-y-1.5 sm:space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.href)}
                      className="footer-link inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── COL 3: Our Spaces (1-Col on Mobile side-by-side with Quick Links, 2-col on Desktop) ── */}
            <div className="col-span-1 lg:col-span-2 space-y-2 sm:space-y-3">
              <div>
                <h4 className="footer-heading">
                  OUR SPACES
                </h4>
                <div className="w-5 h-[1.5px] bg-[var(--color-gold)] rounded-full mt-1" />
              </div>

              <ul className="space-y-1.5 sm:space-y-2">
                {SPACE_TYPES.map((space) => (
                  <li key={space}>
                    <a
                      href="#featured-properties"
                      onClick={(e) => scrollToSection(e, "#featured-properties")}
                      className="footer-link inline-block"
                    >
                      {space}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── COL 4: Get In Touch (2-Col split on Mobile for compactness, 2-col on Desktop) ── */}
            <div className="col-span-2 lg:col-span-2 space-y-2 sm:space-y-3 min-w-[210px]">
              <div>
                <h4 className="footer-heading">
                  GET IN TOUCH
                </h4>
                <div className="w-5 h-[1.5px] bg-[var(--color-gold)] rounded-full mt-1" />
              </div>

              {/* Mobile 2-column or Desktop stacked format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3 text-[12px] sm:text-[12.5px]">
                {/* Phone & Email */}
                <div className="space-y-2.5 sm:space-y-3">
                  {/* Phone (Fully clickable) */}
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2.5 group cursor-pointer"
                    aria-label={`Call us at ${SITE_CONFIG.phone}`}
                  >
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 border border-[var(--color-gold-border)] flex items-center justify-center text-[var(--color-gold)] shrink-0 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-black transition-all duration-300">
                      <i className="fa-solid fa-phone text-[10px] sm:text-[11px]" />
                    </span>
                    <div>
                      <p className="text-[10px] sm:text-[10.5px] text-white/45 leading-none font-normal">Call Us</p>
                      <span className="text-white/85 group-hover:text-[var(--color-gold)] font-normal transition-colors text-[12px] sm:text-[12.5px] mt-0.5 inline-block whitespace-nowrap">
                        {SITE_CONFIG.phone}
                      </span>
                    </div>
                  </a>

                  {/* Email (Fully clickable) */}
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex items-center gap-2.5 group cursor-pointer"
                    aria-label={`Email us at ${SITE_CONFIG.email}`}
                  >
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 border border-[var(--color-gold-border)] flex items-center justify-center text-[var(--color-gold)] shrink-0 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-black transition-all duration-300">
                      <i className="fa-solid fa-envelope text-[10px] sm:text-[11px]" />
                    </span>
                    <div>
                      <p className="text-[10px] sm:text-[10.5px] text-white/45 leading-none font-normal">Email Us</p>
                      <span className="text-white/85 group-hover:text-[var(--color-gold)] font-normal transition-colors text-[12px] sm:text-[12.5px] mt-0.5 inline-block whitespace-nowrap">
                        {SITE_CONFIG.email}
                      </span>
                    </div>
                  </a>
                </div>

                {/* Office Location (Clickable to Google Maps) */}
                <a
                  href="https://maps.google.com/?q=Sector+62,+Noida,+Uttar+Pradesh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 group cursor-pointer"
                  aria-label="View office location on Google Maps"
                >
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/50 border border-[var(--color-gold-border)] flex items-center justify-center text-[var(--color-gold)] shrink-0 mt-0.5 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)] group-hover:text-black transition-all duration-300">
                    <i className="fa-solid fa-location-dot text-[10px] sm:text-[11px]" />
                  </span>
                  <div>
                    <p className="text-[10px] sm:text-[10.5px] text-white/45 leading-none font-normal">Visit Our Office</p>
                    <p className="text-white/75 group-hover:text-[var(--color-gold)] text-[11.5px] sm:text-[12px] mt-0.5 leading-snug font-normal transition-colors">
                      {SITE_CONFIG.officeAddress}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* ── COL 5: Stay Updated (Full width on Mobile, 3-col on Desktop with divider) ── */}
            <div className="col-span-2 lg:col-span-3 space-y-2 sm:space-y-2.5 lg:pl-6 lg:border-l lg:border-white/10 pt-2 lg:pt-0">
              <div>
                <p className="text-[9.5px] sm:text-[10px] tracking-[0.2em] font-medium text-[var(--color-gold)] uppercase font-sans">
                  STAY UPDATED
                </p>
                <h3 className="footer-newsletter-title mt-0.5">
                  Get the Latest Office Spaces & Insights
                </h3>
              </div>

              {/* Form or Luxury Thank-You Box */}
              {subscribed ? (
                <div className="bg-[var(--color-gold-light)] border border-[var(--color-gold-border)] rounded-2xl p-3.5 text-center space-y-1.5 animate-[fadeIn_0.35s_ease-out]">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--color-gold)] text-[var(--color-bg-secondary)] flex items-center justify-center mx-auto text-xs shadow-[0_4px_12px_rgba(198,153,96,0.35)]">
                    <i className="fa-solid fa-check" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-[13px] sm:text-[13.5px]">Thank You for Subscribing!</h4>
                    <p className="text-[11px] sm:text-[11.5px] text-white/75 mt-0.5 leading-snug">
                      You’ll now receive our curated office spaces & commercial insights directly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSubscribed(false)}
                    className="text-[10.5px] text-[var(--color-gold)] hover:underline pt-0.5 inline-block cursor-pointer"
                  >
                    Subscribe another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="relative mt-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full bg-[#141414]/90 border border-white/15 rounded-full pl-4 pr-11 py-2.5 text-[12.5px] sm:text-[13px] text-white placeholder-white/40 focus:outline-none focus:border-[var(--color-gold)] focus:bg-black/80 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe to newsletter"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--color-gold)] text-[var(--color-bg-secondary)] flex items-center justify-center hover:bg-[var(--color-gold-hover)] hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm"
                  >
                    <i className="fa-solid fa-arrow-right text-[10.5px] sm:text-[11.5px]" />
                  </button>
                </form>
              )}

              {!subscribed && (
                <p className="flex items-center gap-1.5 text-[11px] sm:text-[11.5px] text-white/45 pt-0.5">
                  <i className="fa-solid fa-lock text-[9.5px] text-white/60" />
                  <span>We respect your privacy. No spam ever.</span>
                </p>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          2. BOTTOM COPYRIGHT & LEGAL BAR
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 py-4 sm:py-5 border-t border-white/10">
        <div className="site-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 text-[11.5px] sm:text-[12px] text-white/70 text-center md:text-left">
            {/* Left: Copyright */}
            <p>© {new Date().getFullYear()} Trinetra Estates. All rights reserved.</p>

            {/* Center: Legal Links */}
            <div className="flex items-center gap-3 sm:gap-4 text-white/75 font-medium justify-center">
              <a href="/privacy-policy" className="hover:text-[var(--color-gold)] transition-colors">
                Privacy Policy
              </a>
              <span className="text-white/20">|</span>
              <a href="/terms-of-service" className="hover:text-[var(--color-gold)] transition-colors">
                Terms of Service
              </a>
            </div>

            {/* Right: Slogan with Gold Line */}
            <div className="flex items-center gap-2 sm:gap-2.5 justify-center">
              <span className="inline-block w-5 sm:w-7 h-[1px] bg-[var(--color-gold)]" />
              <div className="text-[9px] sm:text-[9.5px] tracking-[0.24em] uppercase font-semibold text-white/80 space-y-0.5 font-sans">
                <p>SPACES • PEOPLE • PROGRESS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

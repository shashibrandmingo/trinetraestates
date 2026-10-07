"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";

/**
 * Navbar — Luxury floating white pill navbar
 * - Top of page: Floats cleanly over hero
 * - On Scroll: Smooth ambient gradient mask (from dark to transparent) so
 *   page content scrolling up softly fades out without any hard box line!
 * - Mobile view (< lg): Brand Logo + Call button + fa-bars-staggered toggle
 * - Desktop view (lg+): Centred nav links + Phone pill + Enquire Now CTA
 * - Drawer: Full screen slide-in with Enquire Now CTA
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("/");

  /* ── Scroll: detect elevation + active section ── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_LINKS.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1));
      let current = "/";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) current = `#${id}`;
        }
      }
      if (window.scrollY < 120) current = "/";
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Lock body scroll when mobile drawer open ── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── Smooth scroll handler ── */
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setIsOpen(false);

      if (href === "/") {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (href.startsWith("#")) {
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = `/${href}`;
          return;
        }
        const id = href.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          const yOffset = -90;
          const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    },
    []
  );

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          FIXED NAVBAR WRAPPER
          - Uses a smooth ambient gradient fade on scroll
          - Fades out text scrolling behind the top gap smoothly without hard boxes
          ═══════════════════════════════════════════════════════════════ */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-[999] pointer-events-none
          transition-all duration-300
          ${scrolled
            ? "pt-2 sm:pt-2.5 lg:pt-3 pb-3 bg-gradient-to-b from-[var(--color-bg-dark)] via-[var(--color-bg-dark)]/85 to-transparent backdrop-blur-[2px]"
            : "pt-2.5 sm:pt-3.5 lg:pt-4 pb-0 bg-transparent"
          }
        `}
      >
        <div className="site-container">
          <nav
            className={`
              pointer-events-auto
              flex items-center justify-between
              bg-white
              rounded-full
              pl-3.5 sm:pl-5 md:pl-6 lg:pl-7
              pr-2 sm:pr-3 lg:pr-3.5
              py-1.5 sm:py-2
              border border-[rgba(10,1,0,0.06)]
              transition-all duration-300
              ${scrolled
                ? "shadow-[0_12px_36px_rgba(0,0,0,0.28)] border-[rgba(10,1,0,0.1)]"
                : "shadow-[0_4px_24px_rgba(10,1,0,0.08)]"
              }
            `}
          >
            {/* ── 1. BRAND LOGO ── */}
            <a
              href="/"
              onClick={(e) => handleNavClick(e, "/")}
              className="shrink-0 flex items-center py-0.5 group focus:outline-none"
              aria-label="Trinetra Estates Home"
            >
              <Image
                src="/images/logo/Trinetra Estates logo.png"
                alt="Trinetra Estates"
                width={240}
                height={80}
                priority
                unoptimized
                className="h-[36px] sm:h-[40px] md:h-[42px] lg:h-[46px] xl:h-[48px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 origin-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              />
            </a>

            {/* ── 2. DESKTOP NAV LINKS (Centered, hidden on mobile/tablet) ── */}
            <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className={`
                        relative px-3.5 xl:px-4 py-2
                        text-[13.5px] xl:text-[14.5px] font-medium
                        rounded-full
                        transition-colors duration-200
                        ${isActive
                          ? "text-[var(--color-bg-secondary)] font-semibold"
                          : "text-[var(--color-text-light-body)] hover:text-[var(--color-bg-secondary)]"
                        }
                      `}
                    >
                      {link.label}
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-[var(--color-gold)] rounded-full" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* ── 3. RIGHT ACTIONS ── */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* ── DESKTOP ONLY: Phone pill + Enquire Now CTA (Hidden completely on mobile) ── */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-2.5">
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-gold-border)] bg-transparent text-[var(--color-bg-secondary)] text-[13px] xl:text-[13.5px] font-semibold hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-light)] transition-all duration-200"
                >
                  <i className="fa-solid fa-phone text-[var(--color-gold)] text-[12px]" />
                  <span>{SITE_CONFIG.phone}</span>
                </a>

                <a
                  href="#get-in-touch"
                  onClick={(e) => handleNavClick(e, "#get-in-touch")}
                  className="btn-black text-[13px] xl:text-[13.5px] px-5 xl:px-6 py-2.5 rounded-full"
                >
                  <span>Enquire Now</span>
                  <i className="fa-solid fa-arrow-right text-[11px]" />
                </a>
              </div>

              {/* ── MOBILE ONLY: Call Icon Button + Hamburger (< lg) ── */}
              <div className="flex lg:hidden items-center gap-2">
                {/* Mobile Phone Call Button */}
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  aria-label={`Call ${SITE_CONFIG.phone}`}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[var(--color-bg-secondary)] text-white hover:bg-[var(--color-gold)] transition-colors duration-200 shadow-sm"
                >
                  <i className="fa-solid fa-phone text-[13px]" />
                </a>

                {/* Mobile Hamburger Toggle */}
                <button
                  type="button"
                  aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-[rgba(10,1,0,0.1)] text-[var(--color-bg-secondary)] hover:bg-[var(--color-gold)] hover:text-white hover:border-[var(--color-gold)] transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <i
                    className={`fa-solid ${isOpen ? "fa-xmark text-[16px]" : "fa-bars-staggered text-[14px]"}`}
                  />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════════
          MOBILE SLIDE-IN DRAWER (z-[1001] to cleanly overlay navbar)
          ═══════════════════════════════════════════════════════════════ */}
      {isOpen && (
        <div className="fixed inset-0 z-[1001] lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-[var(--color-bg-secondary)]/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer container */}
          <div
            className="absolute top-0 right-0 w-[88%] max-w-[340px] h-full bg-white flex flex-col shadow-[-8px_0_40px_rgba(10,1,0,0.3)] animate-[slideInRight_0.3s_ease-out]"
          >
            {/* Drawer header with logo & close */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[rgba(10,1,0,0.06)] bg-white">
              <Image
                src="/images/logo/Trinetra Estates logo.png"
                alt="Trinetra Estates"
                width={210}
                height={70}
                unoptimized
                className="h-[38px] sm:h-[42px] w-auto object-contain"
              />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setIsOpen(false)}
                className="w-9 h-9 rounded-full bg-[var(--color-bg-secondary)] text-white flex items-center justify-center hover:bg-[var(--color-gold)] transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-[15px]" />
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, idx) => {
                  const isActive = activeSection === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        className={`
                          flex items-center gap-3 px-3.5 py-3
                          rounded-xl text-[14.5px] font-medium
                          transition-all duration-200
                          ${isActive
                            ? "bg-[var(--color-gold-light)] text-[var(--color-gold)] font-semibold"
                            : "text-[var(--color-text-light-body)] hover:bg-[rgba(198,153,96,0.06)] hover:text-[var(--color-bg-secondary)]"
                          }
                        `}
                      >
                        <span className="w-6 h-6 rounded-full bg-[var(--color-gold-light)] flex items-center justify-center text-[10px] font-bold text-[var(--color-gold)]">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>{link.label}</span>
                        {isActive && (
                          <i className="fa-solid fa-chevron-right text-[11px] text-[var(--color-gold)] ml-auto" />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Drawer footer — Only Enquire Now CTA */}
            <div className="px-5 pb-6 pt-3 border-t border-[rgba(10,1,0,0.06)] bg-white">
              <a
                href="#get-in-touch"
                onClick={(e) => handleNavClick(e, "#get-in-touch")}
                className="btn-gold w-full py-3 rounded-xl text-[14px] shadow-[0_4px_16px_rgba(198,153,96,0.3)]"
              >
                <span>Enquire Now</span>
                <i className="fa-solid fa-arrow-right text-[11px]" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

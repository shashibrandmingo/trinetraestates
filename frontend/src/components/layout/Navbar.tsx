"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";

interface NavLinkItem {
  label: string;
  href: string;
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");

  const navLinks: NavLinkItem[] = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Office Spaces", href: "#office-spaces" },
    { label: "Our Services", href: "#featured-spaces" },
    { label: "Why Noida", href: "#why-choose-us" },
    { label: "Contact", href: "#contact" },
  ];

  // Smooth scroll click handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavLinkItem) => {
    e.preventDefault();
    setActiveItem(item.label);
    setMobileMenuOpen(false);

    if (item.href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.querySelector(item.href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll spy to highlight active nav item dynamically while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      if (window.scrollY < 200) {
        setActiveItem("Home");
        return;
      }

      for (let i = navLinks.length - 1; i >= 0; i--) {
        const item = navLinks[i];
        if (item.href.startsWith("#") && item.href !== "#home") {
          const el = document.querySelector(item.href) as HTMLElement | null;
          if (el) {
            const top = el.offsetTop;
            if (scrollPosition >= top) {
              setActiveItem(item.label);
              break;
            }
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[var(--border-subtle)]">
      <Container>
        <div className="flex h-22 sm:h-26 md:h-[102px] items-center justify-between py-1.5">
          {/* Logo on Left - Big, Bold & Highly Visible on Desktop and Mobile */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, { label: "Home", href: "#home" })}
            className="flex items-center shrink-0 overflow-visible cursor-pointer"
          >
            <Image
              src="/images/logo/logo.png"
              alt="Noida Office Spaces"
              width={300}
              height={140}
              priority
              className="h-18 sm:h-22 md:h-[92px] w-auto object-contain scale-115 sm:scale-120 md:scale-125 origin-left transition-transform"
            />
          </a>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) => {
              const isActive = activeItem === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`relative text-[14.5px] transition-colors py-2.5 cursor-pointer ${
                    isActive
                      ? "font-bold text-[var(--text-heading)]"
                      : "font-medium text-[var(--text-body)] hover:text-[var(--text-heading)]"
                  }`}
                >
                  {item.label}
                  {/* Golden Active Underline Bar */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[var(--gold)] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Call Now Button (Desktop Only: Only 'Call Now' text, dials on click) */}
          <div className="hidden lg:flex items-center">
            <a
              href="tel:9999901196"
              className="btn btn-blue px-5 sm:px-6 py-2.5 flex items-center gap-2.5 text-xs sm:text-[13.5px] font-semibold tracking-wide"
            >
              {/* FontAwesome Phone Icon */}
              <i className="fa-solid fa-phone text-[13px] shrink-0" aria-hidden="true" />
              <span>Call Now</span>
            </a>
          </div>

          {/* Mobile Right Section - Call Now Button outside + Hamburger Menu Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 lg:hidden">
            {/* Call Icon Button on Mobile Navbar directly before hamburger */}
            <a
              href="tel:9999901196"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-white)] flex items-center justify-center cursor-pointer shadow-xs hover:shadow-md active:scale-95 transition-all"
              aria-label="Call Now"
              title="Call Now: 99999 01196"
            >
              <i className="fa-solid fa-phone text-[13px] sm:text-[14px]" aria-hidden="true" />
            </a>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--primary)] flex items-center justify-center cursor-pointer shadow-xs hover:bg-[var(--bg-subtle)] active:scale-95 transition-all"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <i className="fa-solid fa-xmark text-[18px] text-[var(--primary)] transition-transform duration-200" aria-hidden="true" />
              ) : (
                <i className="fa-solid fa-bars-staggered text-[16px] text-[var(--primary)] transition-transform duration-200" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (Clean links only, Call Now is already outside in header) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[var(--border-subtle)] py-3 px-2 space-y-1 bg-[var(--bg-surface)] animate-fade-up shadow-lg rounded-b-2xl">
            {navLinks.map((item) => {
              const isActive = activeItem === item.label;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[var(--gold-light)] text-[var(--gold)] font-bold"
                      : "text-[var(--text-body)] font-medium hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                  )}
                </a>
              );
            })}
          </div>
        )}
      </Container>
    </header>
  );
}

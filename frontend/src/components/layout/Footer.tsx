"use client";

import React, { useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@") || !email.includes(".")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }
    setErrorMsg("");
    setSubscribed(true);
    setEmail("");
    setTimeout(() => {
      setSubscribed(false);
    }, 6000);
  };

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleQuickLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      if (href === "#home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "About Us", href: "#about" },
    { label: "Office Spaces", href: "#space-categories" },
    { label: "By Sector", href: "#office-spaces" },
    { label: "Why Choose Us", href: "#why-choose-us" },
    { label: "Our Process", href: "#featured-spaces" },
    { label: "Contact Us", href: "#contact" },
  ];

  const officeSpaces = [
    { label: "IT & Corporate Offices", href: "/offices?type=it-park" },
    { label: "Managed Offices", href: "/offices?type=managed" },
    { label: "Coworking Spaces", href: "/offices?type=coworking" },
    { label: "Plug & Play Offices", href: "/offices?furnishing=furnished" },
    { label: "Commercial Spaces", href: "/offices?type=commercial" },
    { label: "Built-to-Suit Offices", href: "/offices?type=built-to-suit" },
    { label: "Virtual Offices", href: "/offices?type=virtual" },
  ];

  const popularSectors = [
    { label: "Sector 62", href: "/offices?sector=sector-62" },
    { label: "Sector 63", href: "/offices?sector=sector-63" },
    { label: "Sector 125", href: "/offices?sector=sector-125" },
    { label: "Sector 126", href: "/offices?sector=sector-126" },
    { label: "Sector 132", href: "/offices?sector=sector-132" },
    { label: "Sector 135", href: "/offices?sector=sector-135" },
    { label: "Sector 142", href: "/offices?sector=sector-142" },
  ];

  return (
    <footer className="relative w-full bg-[var(--footer-bg)] text-[var(--text-light)] overflow-hidden border-t border-[var(--footer-border)] font-sans">
      {/* Full-width Screen Edge Anchored Building Image */}
      <div className="absolute right-0 bottom-[54px] pointer-events-none z-0 select-none overflow-hidden hidden lg:flex items-end justify-end h-[300px] xl:h-[340px] 2xl:h-[370px] w-[380px] xl:w-[460px] 2xl:w-[520px]">
        <img
          src="/images/bgbanners/footer.png"
          alt="Noida Skyline"
          className="h-full w-auto object-contain object-right-bottom opacity-85"
        />
      </div>

      <Container className="relative z-10">
        {/* Main Footer Columns */}
        <div className="pt-12 pb-9 flex flex-wrap lg:flex-nowrap gap-y-10 lg:gap-0">
          {/* Column 1: Brand & Bio */}
          <div className="w-full lg:w-[22%] lg:pr-6 lg:border-r border-[var(--footer-border)] space-y-4">
            <Link href="/" className="inline-block transition-transform hover:scale-[1.02] duration-200">
              <img
                src="/images/logo/logo-white.png"
                alt="Noida Office Spaces"
                className="h-20 sm:h-24 md:h-[96px] w-auto object-contain"
              />
            </Link>

            <p className="text-[13.5px] text-[var(--text-light)] leading-relaxed max-w-sm sm:max-w-md lg:max-w-[240px]">
              Helping businesses find the right workspaces in Noida. From startups
              to enterprises, we create spaces for a brighter tomorrow.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {[
                { icon: "fa-brands fa-linkedin-in", href: "https://linkedin.com", label: "LinkedIn" },
                { icon: "fa-brands fa-instagram", href: "https://instagram.com", label: "Instagram" },
                { icon: "fa-brands fa-facebook-f", href: "https://facebook.com", label: "Facebook" },
                { icon: "fa-brands fa-youtube", href: "https://youtube.com", label: "YouTube" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="w-8.5 h-8.5 rounded-full border border-[var(--footer-border)] bg-[var(--footer-input)]/70 flex items-center justify-center text-[var(--text-light-muted)] hover:text-[var(--text-white)] hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(157,116,72,0.35)] transition-all duration-300"
                >
                  <i className={`${item.icon} text-[11px]`} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="w-full lg:contents grid grid-cols-2 sm:grid-cols-3 gap-y-8 gap-x-6 sm:gap-x-8 lg:gap-0">
            {/* Column 2: Quick Links */}
            <div className="lg:w-[14%] lg:px-5 lg:border-r border-[var(--footer-border)]">
              <div className="mb-3">
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--text-white)] block whitespace-nowrap">
                  QUICK LINKS
                </span>
                <span className="inline-block w-6 h-[2px] bg-[var(--gold)] mt-1.5 rounded-full" />
              </div>
              <ul className="space-y-2 text-[13px]">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleQuickLinkClick(e, link.href)}
                      className="text-[var(--text-light-muted)] hover:text-[var(--text-white)] hover:translate-x-1.5 transition-all duration-200 inline-block cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Office Spaces */}
            <div className="lg:w-[15.5%] lg:px-5 lg:border-r border-[var(--footer-border)]">
              <div className="mb-3">
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--text-white)] block whitespace-nowrap">
                  OFFICE SPACES
                </span>
                <span className="inline-block w-6 h-[2px] bg-[var(--gold)] mt-1.5 rounded-full" />
              </div>
              <ul className="space-y-2 text-[13px]">
                {officeSpaces.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[var(--text-light-muted)] hover:text-[var(--text-white)] hover:translate-x-1.5 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Popular Sectors */}
            <div className="col-span-2 sm:col-span-1 lg:w-[16.5%] lg:px-5 lg:border-r border-[var(--footer-border)]">
              <div className="mb-3">
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--text-white)] block whitespace-nowrap">
                  POPULAR SECTORS
                </span>
                <span className="inline-block w-6 h-[2px] bg-[var(--gold)] mt-1.5 rounded-full" />
              </div>
              <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2 text-[13px]">
                {popularSectors.map((sector) => (
                  <li key={sector.label}>
                    <Link
                      href={sector.href}
                      className="text-[var(--text-light-muted)] hover:text-[var(--text-white)] hover:translate-x-1.5 transition-all duration-200 inline-block"
                    >
                      {sector.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-1 col-span-2 sm:col-span-1">
                  <Link
                    href="/offices"
                    className="text-[var(--gold)] hover:text-[var(--gold-hover)] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors group"
                  >
                    <span>View All Sectors</span>
                    <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Column 5: Stay Updated */}
          <div className="w-full lg:w-[32%] lg:pl-8 space-y-3.5 relative z-10 pt-2 lg:pt-0">
            <div>
              <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--text-white)] block whitespace-nowrap">
                STAY UPDATED
              </span>
              <span className="inline-block w-6 h-[2px] bg-[var(--gold)] mt-1.5 rounded-full" />
            </div>

            <p className="text-[13.5px] text-[var(--text-light)] leading-relaxed max-w-md lg:max-w-[310px]">
              Get the latest office spaces, market insights and exclusive listings directly in your inbox.
            </p>

            {/* Subscribe Form */}
            <form onSubmit={handleSubscribe} className="space-y-2 pt-0.5 max-w-md lg:max-w-[340px]">
              <div className="flex items-stretch overflow-hidden rounded-xl border border-[var(--footer-border)] bg-[var(--footer-input)] shadow-sm focus-within:border-[var(--gold)] focus-within:shadow-[0_0_15px_rgba(157,116,72,0.2)] transition-all duration-300">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent px-3.5 py-2.5 text-[13px] text-[var(--text-white)] placeholder:text-[var(--text-light-muted)] focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-[var(--gold)] hover:bg-[var(--gold-hover)] text-[var(--text-white)] font-semibold text-[13px] px-5 py-2.5 transition-all duration-300 cursor-pointer shrink-0 active:scale-95 shadow-xs hover:shadow-[0_4px_15px_rgba(157,116,72,0.35)]"
                >
                  Subscribe
                </button>
              </div>

              {/* Feedback messages */}
              {errorMsg && (
                <p className="text-xs text-[var(--gold)] font-medium">{errorMsg}</p>
              )}

              {subscribed && (
                <div className="p-2 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)] text-xs text-[var(--gold)] flex items-center gap-2 animate-fade-up">
                  <i className="fa-solid fa-circle-check text-[var(--gold)]" aria-hidden="true" />
                  <span>Thank you for subscribing! We&apos;ll keep you updated.</span>
                </div>
              )}

              <p className="text-[11.5px] text-[var(--text-light-muted)]">
                We respect your privacy. No spam, ever.
              </p>
            </form>

            {/* Bottom Slogan */}
            <div className="pt-2">
              <div className="text-[10.5px] tracking-[0.22em] uppercase font-bold text-[var(--text-light-muted)] leading-snug">
                <div>A</div>
                <div>BETTER</div>
                <div>BUSINESS</div>
                <div>TOMORROW</div>
              </div>
              <span className="inline-block w-7 h-[2px] bg-[var(--gold)] mt-1.5 rounded-full" />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Policies & Back to Top */}
        <div className="py-4.5 border-t border-[var(--footer-border)] text-xs text-[var(--text-light-muted)] flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Copyright */}
          <div className="order-2 md:order-1">
            © {new Date().getFullYear()} Noida Office Spaces. All rights reserved.
          </div>

          {/* Policy Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 order-1 md:order-2 text-[var(--text-light-muted)]">
            <Link href="/privacy" className="hover:text-[var(--text-white)] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[var(--footer-border)]">|</span>
            <Link href="/terms" className="hover:text-[var(--text-white)] transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-[var(--footer-border)]">|</span>
            <Link href="/sitemap" className="hover:text-[var(--text-white)] transition-colors">
              Sitemap
            </Link>
          </div>

          {/* Location & Back to Top */}
          <div className="flex flex-wrap items-center justify-center gap-6 order-3">
            <div className="flex items-center gap-1.5 text-[var(--text-light-muted)]">
              <i className="fa-solid fa-location-dot text-[var(--gold)] text-sm" aria-hidden="true" />
              <span>Noida, Uttar Pradesh, India</span>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              type="button"
              className="flex items-center gap-2.5 text-[var(--text-white)] hover:text-[var(--gold)] transition-colors cursor-pointer group"
              aria-label="Back to Top"
            >
              <span className="w-8 h-8 rounded-full border border-[var(--gold)] bg-transparent flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--gold)] group-hover:-translate-y-0.5 shadow-xs">
                <i className="fa-solid fa-arrow-up text-[11px] text-[var(--text-white)] transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
              </span>
              <span className="text-[12.5px] font-medium text-[var(--text-white)]">Back to Top</span>
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}

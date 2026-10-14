"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import RequirementModal from "@/components/modals/RequirementModal";
import { RequirementFormData } from "@/components/forms/RequirementForm";
import { getApiBaseUrl } from "@/config/apiConfig";

const API_BASE = getApiBaseUrl();

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<RequirementFormData>({});
  const [activeBackendSectors, setActiveBackendSectors] = useState<string[]>([]);

  // Fetch active sectors from backend to dynamically know which sectors have listings
  useEffect(() => {
    let isSubscribed = true;
    const fetchSectors = async () => {
      try {
        const res = await fetch(`${API_BASE}/offices/sectors`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && Array.isArray(json.data.sectors) && isSubscribed) {
            const sectorsWithProps = json.data.sectors
              .filter((s: { sector: string; count: number }) => s.count > 0)
              .map((s: { sector: string; count: number }) => s.sector);
            setActiveBackendSectors(sectorsWithProps);
          }
        }
      } catch (err) {
        console.warn("Could not load backend sector summary for footer:", err);
      }
    };

    fetchSectors();
    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleOpenOfficeSpaceModal = (spaceType: string) => {
    setModalInitialData({
      spaceType,
      requirements: `Interested in ${spaceType} in Noida`,
    });
    setIsModalOpen(true);
  };

  const handleSectorClick = async (sectorName: string) => {
    let currentSectors = activeBackendSectors;

    // Fast fallback if user clicked before initial useEffect resolved
    if (currentSectors.length === 0) {
      try {
        const res = await fetch(`${API_BASE}/offices/sectors`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && Array.isArray(json.data.sectors)) {
            currentSectors = json.data.sectors
              .filter((s: { sector: string; count: number }) => s.count > 0)
              .map((s: { sector: string; count: number }) => s.sector);
            setActiveBackendSectors(currentSectors);
          }
        }
      } catch (e) {
        // fallback
      }
    }

    const cleanTarget = sectorName.trim().toLowerCase().replace(/[\s-_]+/g, "");
    const matchingBackendSector = currentSectors.find(
      (s) => s.trim().toLowerCase().replace(/[\s-_]+/g, "") === cleanTarget
    );

    if (matchingBackendSector) {
      // Sector has active property listings in the database!
      // Scroll smoothly to FEATURED SPACES and open this sector's tab!
      if (typeof window !== "undefined") {
        const isHomePage = window.location.pathname === "/" || window.location.pathname === "";
        if (isHomePage) {
          window.dispatchEvent(
            new CustomEvent("select-featured-sector", {
              detail: { sector: matchingBackendSector },
            })
          );
          const featuredEl = document.getElementById("featured-spaces");
          if (featuredEl) {
            featuredEl.scrollIntoView({ behavior: "smooth" });
          }
        } else {
          router.push(`/#featured-spaces?sector=${encodeURIComponent(matchingBackendSector)}`);
        }
      }
      return;
    }

    // No property listed for this sector in DB: open global RequirementModal with pre-filled sector!
    setModalInitialData({
      area: sectorName,
      requirements: `Interested in commercial office spaces in ${sectorName}, Noida`,
    });
    setIsModalOpen(true);
  };

  const handleViewAllSectors = () => {
    if (typeof window !== "undefined") {
      const isHomePage = window.location.pathname === "/" || window.location.pathname === "";
      if (isHomePage) {
        window.dispatchEvent(
          new CustomEvent("select-featured-sector", {
            detail: { sector: "all" },
          })
        );
        const featuredEl = document.getElementById("featured-spaces");
        if (featuredEl) {
          featuredEl.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push("/#featured-spaces");
      }
    }
  };

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
    { label: "IT & Corporate Offices" },
    { label: "Managed Offices" },
    { label: "Coworking Spaces" },
    { label: "Plug & Play Offices" },
    { label: "Commercial Spaces" },
    { label: "Built-to-Suit Offices" },
    { label: "Virtual Offices" },
  ];

  const popularSectors = [
    { label: "Sector 62" },
    { label: "Sector 63" },
    { label: "Sector 125" },
    { label: "Sector 126" },
    { label: "Sector 132" },
    { label: "Sector 135" },
    { label: "Sector 142" },
  ];

  return (
    <>
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

            {/* Social Icons (Temporarily commented out until official social handles are available) */}
            {/*
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
            */}
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

            {/* Column 3: Office Spaces (Opens Global Requirement Form with Pre-Filled Space Type) */}
            <div className="lg:w-[15.5%] lg:px-5 lg:border-r border-[var(--footer-border)]">
              <div className="mb-3">
                <span className="text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--text-white)] block whitespace-nowrap">
                  OFFICE SPACES
                </span>
                <span className="inline-block w-6 h-[2px] bg-[var(--gold)] mt-1.5 rounded-full" />
              </div>
              <ul className="space-y-2 text-[13px]">
                {officeSpaces.map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => handleOpenOfficeSpaceModal(item.label)}
                      className="text-[var(--text-light-muted)] hover:text-[var(--text-white)] hover:translate-x-1.5 transition-all duration-200 inline-block text-left cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Popular Sectors (Opens Global Requirement Form with Pre-Filled Sector) */}
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
                    <button
                      type="button"
                      onClick={() => handleSectorClick(sector.label)}
                      className="text-[var(--text-light-muted)] hover:text-[var(--text-white)] hover:translate-x-1.5 transition-all duration-200 inline-block text-left cursor-pointer"
                    >
                      {sector.label}
                    </button>
                  </li>
                ))}
                <li className="pt-1 col-span-2 sm:col-span-1">
                  <button
                    type="button"
                    onClick={handleViewAllSectors}
                    className="text-[var(--gold)] hover:text-[var(--gold-hover)] font-semibold text-xs inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span>View All Sectors</span>
                    <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                  </button>
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

        {/* SEO Popular Searches & Keyword Cloud (100% White-Hat, User-Visible, and Crawlable) */}
        <div className="py-5 border-t border-[var(--footer-border)] text-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
              Trending Office Searches in Noida
            </span>
            <span className="inline-block w-8 h-[1px] bg-[var(--gold)]/40" />
          </div>
          <div className="flex flex-wrap gap-2 text-[12px] text-[var(--text-light-muted)]">
            {[
              "Office Space for Rent in Noida",
              "Commercial Office Space Sector 62",
              "Fully Furnished Office in Sector 63",
              "Plug and Play Offices Noida Expressway",
              "IT Corporate Office Space Sector 132",
              "Managed Coworking Spaces Sector 135",
              "Office Space for Rent Sector 142",
              "Corporate Office Space Sector 125 & 126",
              "Small Office Space for Startups Noida",
              "Ready to Move Commercial Space Noida",
              "Bare Shell Office Space Lease Noida",
              "Office Space near Noida Metro Station",
              "Zero Brokerage Office Rentals Noida",
            ].map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleOpenOfficeSpaceModal(kw)}
                className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-[var(--gold)]/20 border border-white/10 hover:border-[var(--gold)]/50 hover:text-[var(--text-white)] transition-all cursor-pointer text-left"
              >
                {kw}
              </button>
            ))}
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

    {/* Global Requirement Enquiry Modal for Footer Triggers */}
    <RequirementModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      initialData={modalInitialData}
    />
  </>
);
}

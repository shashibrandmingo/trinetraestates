import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service | Trinetra Estates - Commercial Real Estate Services in Noida",
  description:
    "Review the Terms of Service governing commercial office space listings, leasing advisory, site inspections, and digital services provided by Trinetra Estates in Noida.",
};

export default function TermsOfServicePage() {
  const lastUpdated = "September 29, 2026";

  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "advisory-scope", label: "2. Scope of Commercial Services" },
    { id: "listings-accuracy", label: "3. Property Listings & Pricing" },
    { id: "client-obligations", label: "4. Client Inquiries & Obligations" },
    { id: "site-visits", label: "5. Site Visits & Inspections" },
    { id: "lease-agreements", label: "6. Lease Transactions & Contracts" },
    { id: "intellectual-property", label: "7. Intellectual Property" },
    { id: "limitation-liability", label: "8. Limitation of Liability" },
    { id: "governing-law", label: "9. Governing Law & Jurisdiction" },
    { id: "contact-support", label: "10. Contact & Support" },
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#faf9f6] text-[#141414] pt-20 sm:pt-24 lg:pt-28">
        
        {/* ── TOP HERO HEADER (Balanced & Luxury) ── */}
        <section className="relative bg-[#141414] text-white py-8 sm:py-10 lg:py-12 overflow-hidden">
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="site-container relative z-10 max-w-6xl">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-400 mb-2.5 font-sans">
              <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-[var(--color-gold)] font-medium">Terms of Service</span>
            </nav>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-[1.5px] bg-[var(--color-gold)] inline-block" />
              <span className="text-[9.5px] sm:text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--color-gold)] font-sans">
                TERMS &amp; CONDITIONS
              </span>
            </div>

            <h1 className="!font-heading !text-2xl sm:!text-3xl lg:!text-4xl !font-medium tracking-tight text-white mb-2 !leading-tight">
              Terms of <span className="text-gold font-medium">Service</span>
            </h1>

            <p className="text-zinc-300 text-xs sm:text-[13px] font-sans max-w-2xl leading-relaxed">
              These Terms of Service govern your access to the Trinetra Estates website, commercial property listings, and commercial real estate advisory services in Noida and surrounding NCR regions.
            </p>

            <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-5 text-[10.5px] sm:text-[11px] text-zinc-400 font-sans">
              <div>
                <span className="text-zinc-500">Effective Date: </span>
                <span className="text-zinc-200">January 01, 2026</span>
              </div>
              <div>
                <span className="text-zinc-500">Last Updated: </span>
                <span className="text-[var(--color-gold)] font-medium">{lastUpdated}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── MAIN CONTENT & QUICK NAVIGATION ── */}
        <section className="py-8 sm:py-10 lg:py-12">
          <div className="site-container max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              
              {/* ── STICKY TABLE OF CONTENTS (Desktop) ── */}
              <aside className="hidden lg:block lg:col-span-4 sticky top-28 bg-white rounded-2xl p-5 border border-black/[0.06] shadow-sm">
                <div className="flex items-center gap-2 pb-2.5 border-b border-black/[0.06] mb-3">
                  <i className="fa-solid fa-file-shield text-[var(--color-gold)] text-xs" />
                  <h3 className="!font-heading !text-[12px] !font-semibold uppercase tracking-wider text-zinc-800">
                    Terms Index
                  </h3>
                </div>

                <nav className="space-y-1 text-[12px] font-sans">
                  {sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block px-2.5 py-1.5 rounded-lg text-zinc-600 hover:text-[var(--color-gold)] hover:bg-[#faf8f5] transition-all truncate"
                    >
                      {sec.label}
                    </a>
                  ))}
                </nav>

                {/* Advisory Help Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#faf8f5] border border-[#c69960]/20 space-y-1.5">
                  <h4 className="!text-[11.5px] !font-semibold text-zinc-900 font-sans">
                    Need Lease Advisory?
                  </h4>
                  <p className="text-[10.5px] text-zinc-600 leading-relaxed font-sans">
                    Our senior commercial workspace consultants are available to guide you.
                  </p>
                  <a
                    href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-gold)] hover:underline pt-0.5"
                  >
                    <i className="fa-solid fa-phone text-[9.5px]" />
                    <span>{SITE_CONFIG.phone}</span>
                  </a>
                </div>
              </aside>

              {/* ── TERMS DOCUMENT BODY (Balanced & Premium Headings) ── */}
              <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-9 border border-black/[0.06] shadow-sm space-y-7 sm:space-y-8">
                
                {/* 1. Acceptance of Terms */}
                <section id="acceptance" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    1. Acceptance of Terms
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    By browsing, accessing, or utilizing the digital platform, property portfolios, or consultation services provided by <strong>Trinetra Estates</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our services.
                  </p>
                </section>

                {/* 2. Scope of Commercial Services */}
                <section id="advisory-scope" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    2. Scope of Commercial Services
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    Trinetra Estates operates as an end-to-end commercial real estate consultancy and transaction advisory firm. Our services include:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-zinc-700 text-xs sm:text-[13px] font-sans">
                    <li>Commercial office space discovery and space requirement analysis.</li>
                    <li>Shortlisting verified furnished, bare-shell, managed, and coworking workspaces across Noida and Noida Expressway.</li>
                    <li>Conducting guided physical and virtual site inspections.</li>
                    <li>Commercial lease negotiation, term-sheet structuring, and fit-out handover facilitation.</li>
                  </ul>
                </section>

                {/* 3. Property Listings & Pricing */}
                <section id="listings-accuracy" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    3. Property Listings &amp; Pricing Disclaimers
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    While Trinetra Estates makes every effort to ensure that property availability, area specifications (super area vs. carpet area), seating configurations, and pricing quotations on our platform are up-to-date and verified:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-zinc-700 text-xs sm:text-[13px] font-sans">
                    <li>All commercial listings are subject to market availability, prior leasing, and landlord confirmation.</li>
                    <li>Quoted rental rates, maintenance charges, car parking fees, and fit-out costs are indicative and subject to final formal negotiation during lease execution.</li>
                    <li>Architectural images, floor layouts, and rendering visuals are for illustrative representation.</li>
                  </ul>
                </section>

                {/* 4. Client Obligations */}
                <section id="client-obligations" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    4. Client Inquiries &amp; Obligations
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    When engaging with our team, clients agree to provide accurate and truthful corporate information regarding their workspace requirements, authorized signatories, target occupancy dates, and financial parameters.
                  </p>
                </section>

                {/* 5. Site Visits & Inspections */}
                <section id="site-visits" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    5. Site Visits &amp; Property Inspections
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    Site visits coordinated by Trinetra Estates are conducted in collaboration with property developers, institutional asset managers, or building owners. Visitors must adhere to the security, health, safety, and building protocols established by the respective commercial park management.
                  </p>
                </section>

                {/* 6. Lease Transactions */}
                <section id="lease-agreements" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    6. Lease Transactions &amp; Commercial Contracts
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    Trinetra Estates acts as an advisory facilitator. Final lease deeds, sublease contracts, lock-in periods, security deposits, and fit-out covenants are legal agreements entered into directly between the Lessee (Client) and Lessor (Property Owner/Developer). Clients are advised to seek independent legal counsel for statutory deed registration.
                  </p>
                </section>

                {/* 7. Intellectual Property */}
                <section id="intellectual-property" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    7. Intellectual Property &amp; Brand Assets
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    All website content, custom UI designs, graphics, branding logos, property compilation databases, copywriting, and software code are the exclusive intellectual property of <strong>Trinetra Estates</strong> and protected under Indian Copyright and Trademark laws. Unauthorized reproduction or scraping is strictly prohibited.
                  </p>
                </section>

                {/* 8. Limitation of Liability */}
                <section id="limitation-liability" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    8. Limitation of Liability
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    To the maximum extent permitted by applicable law, Trinetra Estates, its partners, directors, and employees shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from third-party builder delays, fit-out schedule alterations, or landlord contractual variances.
                  </p>
                </section>

                {/* 9. Governing Law */}
                <section id="governing-law" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    9. Governing Law &amp; Jurisdiction
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or related to our services or website shall be subject to the exclusive jurisdiction of the competent courts in <strong>Gautam Buddha Nagar (Noida), Uttar Pradesh</strong>.
                  </p>
                </section>

                {/* 10. Contact & Support */}
                <section id="contact-support" className="space-y-2.5 pt-1">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    10. Contact &amp; Corporate Advisory Desk
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    For inquiries regarding these Terms of Service, partnership proposals, or legal notices, please contact us:
                  </p>

                  <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#c69960]/25 space-y-1.5 text-xs sm:text-[12.5px] font-sans text-zinc-800">
                    <p className="font-semibold text-zinc-900 text-xs sm:text-[13px] font-heading">
                      Trinetra Estates
                    </p>
                    <p className="flex items-center gap-2 text-zinc-700">
                      <i className="fa-solid fa-location-dot text-[var(--color-gold)] text-[11px]" />
                      <span>{SITE_CONFIG.officeAddress}</span>
                    </p>
                    <p className="flex items-center gap-2 text-zinc-700">
                      <i className="fa-solid fa-envelope text-[var(--color-gold)] text-[11px]" />
                      <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-[var(--color-gold)] transition-colors">
                        {SITE_CONFIG.email}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 text-zinc-700">
                      <i className="fa-solid fa-phone text-[var(--color-gold)] text-[11px]" />
                      <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`} className="hover:text-[var(--color-gold)] transition-colors">
                        {SITE_CONFIG.phone}
                      </a>
                    </p>
                  </div>
                </section>

              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

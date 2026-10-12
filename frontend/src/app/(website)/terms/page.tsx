import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service | Noida Office Spaces - Commercial Real Estate Services",
  description:
    "Review the Terms of Service governing commercial office space listings, leasing advisory, site inspections, and property transactions provided by Noida Office Spaces.",
};

export default function TermsAndConditionsPage() {
  const lastUpdated = "October 12, 2026";
  const contactPhone = "+91 99999 01196";
  const contactPhoneRaw = "+919999901196";

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
    <main className="min-h-screen bg-[var(--bg-main)] text-[var(--text-body)] font-sans">
      {/* ── TOP HERO HEADER (Compact, Balanced & Luxury) ── */}
      <section className="relative bg-[#07192b] text-white py-6 sm:py-8 lg:py-9 overflow-hidden border-b border-[#142a40]">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[var(--gold)]/10 rounded-full blur-3xl pointer-events-none" />

        <Container className="relative z-10 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 mb-2 font-sans">
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--gold)] font-medium">Terms of Service</span>
          </nav>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-[1.5px] bg-[var(--gold)] inline-block" />
            <span className="text-[9.5px] sm:text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--gold)] font-sans">
              TERMS &amp; CONDITIONS
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-semibold tracking-tight text-white mb-1.5 leading-snug">
            Terms of <span className="text-[var(--gold)] font-semibold">Service</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-[12.5px] font-sans max-w-2xl leading-relaxed">
            These Terms of Service govern your access to the Noida Office Spaces website, commercial property listings, and commercial real estate advisory services across Noida and NCR corridors.
          </p>

          <div className="mt-3.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-5 text-[10.5px] sm:text-[11px] text-slate-400 font-sans">
            <div>
              <span className="text-slate-500">Effective Date: </span>
              <span className="text-slate-200">January 01, 2026</span>
            </div>
            <div>
              <span className="text-slate-500">Last Updated: </span>
              <span className="text-[var(--gold)] font-medium">{lastUpdated}</span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── MAIN CONTENT & QUICK NAVIGATION (Compact & Refined) ── */}
      <section className="py-6 sm:py-8 lg:py-10">
        <Container className="max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
            
            {/* ── STICKY TABLE OF CONTENTS (Desktop) ── */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 bg-white rounded-2xl p-4.5 border border-black/[0.06] shadow-sm">
              <div className="flex items-center gap-2 pb-2.5 border-b border-black/[0.06] mb-2.5">
                <i className="fa-solid fa-file-shield text-[var(--gold)] text-xs" />
                <h3 className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-800">
                  Terms Index
                </h3>
              </div>

              <nav className="space-y-0.5 text-[11.5px] font-sans">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="block px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-[var(--gold)] hover:bg-[#faf8f5] transition-all truncate"
                  >
                    {sec.label}
                  </a>
                ))}
              </nav>

              {/* Advisory Help Box */}
              <div className="mt-4 p-3 rounded-xl bg-[#faf8f5] border border-[var(--gold)]/20 space-y-1">
                <h4 className="text-[11.5px] font-semibold text-slate-900 font-sans">
                  Need Lease Advisory?
                </h4>
                <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans">
                  Our commercial workspace specialists are available to guide you.
                </p>
                <div className="pt-0.5">
                  <a
                    href={`tel:${contactPhoneRaw}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--gold)] hover:underline"
                  >
                    <i className="fa-solid fa-phone text-[9px]" />
                    <span>{contactPhone}</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* ── TERMS DOCUMENT BODY (Compact & Balanced Headings) ── */}
            <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 border border-black/[0.06] shadow-sm space-y-6 sm:space-y-7 text-left">
              
              {/* 1. Acceptance of Terms */}
              <section id="acceptance" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  1. Acceptance of Terms
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  By browsing, accessing, or utilizing the digital platform, verified office portfolios, or consultation services provided by <strong>Noida Office Spaces</strong>, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our services.
                </p>
              </section>

              {/* 2. Scope of Commercial Services */}
              <section id="advisory-scope" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  2. Scope of Commercial Services
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  Noida Office Spaces operates as an end-to-end commercial real estate consultancy and transaction advisory firm. Our services include:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 text-xs sm:text-[12.5px] font-sans">
                  <li>Commercial office space discovery and space requirement analysis.</li>
                  <li>Shortlisting verified furnished, bare-shell, managed, and coworking workspaces across Noida and Noida Expressway.</li>
                  <li>Conducting guided physical and virtual site inspections.</li>
                  <li>Commercial lease negotiation, term-sheet structuring, and fit-out handover facilitation.</li>
                </ul>
              </section>

              {/* 3. Property Listings & Pricing */}
              <section id="listings-accuracy" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  3. Property Listings &amp; Pricing
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  All commercial office space listings, square footage specifications, seat capacities, and rental estimates presented on this website are compiled from information provided by commercial developers, IT park managements, and verified asset owners.
                </p>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  While we strive for accuracy, properties are subject to prior lease commitments, market rental fluctuations, and developer revisions until a formal Letter of Intent (LOI) or Agreement to Lease is executed.
                </p>
              </section>

              {/* 4. Client Inquiries & Obligations */}
              <section id="client-obligations" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  4. Client Inquiries &amp; Obligations
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  When submitting inquiry forms or communicating with our leasing team, you agree to:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 text-xs sm:text-[12.5px] font-sans">
                  <li>Provide legitimate, accurate corporate contact details (name, corporate email, and telephone number).</li>
                  <li>Represent bona fide commercial leasing or purchase intentions.</li>
                  <li>Refrain from using automated bots, data scrapers, or unauthorized indexing tools against our portal.</li>
                </ul>
              </section>

              {/* 5. Site Visits & Inspections */}
              <section id="site-visits" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  5. Site Visits &amp; Inspections
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  Physical property tours arranged through Noida Office Spaces are guided by our authorized commercial specialists. Visitors must comply with building management protocols, security check-ins, and safety standards during on-site inspections in commercial towers.
                </p>
              </section>

              {/* 6. Lease Transactions & Contracts */}
              <section id="lease-agreements" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  6. Lease Transactions &amp; Contracts
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  Commercial lease agreements, sub-lease contracts, lock-in clauses, and security deposit terms are executed directly between the lessee (client) and the legal lessor (property owner/developer). Noida Office Spaces provides facilitation, term negotiation, and advisory support throughout the closing process.
                </p>
              </section>

              {/* 7. Intellectual Property */}
              <section id="intellectual-property" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  7. Intellectual Property
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  All branding elements, logos, photographs, floor plan layouts, written content, and user interface designs displayed on this website are protected intellectual property of Noida Office Spaces. Any unauthorized reproduction, resale, or distribution is strictly prohibited.
                </p>
              </section>

              {/* 8. Limitation of Liability */}
              <section id="limitation-liability" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  8. Limitation of Liability
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  To the extent permissible under Indian law, Noida Office Spaces and its consultants shall not be held liable for indirect, consequential, or incidental losses arising from commercial leasing transactions, third-party fit-out delays, or utility disruptions. Clients are advised to perform standard legal due diligence prior to signing binding lease deeds.
                </p>
              </section>

              {/* 9. Governing Law & Jurisdiction */}
              <section id="governing-law" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  9. Governing Law &amp; Jurisdiction
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  These Terms of Service are governed by the laws of India. Any legal dispute or controversy arising out of these terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Gautam Buddha Nagar (Noida), Uttar Pradesh</strong>.
                </p>
              </section>

              {/* 10. Contact & Support */}
              <section id="contact-support" className="space-y-2.5 pt-2 border-t border-black/[0.06]">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  10. Contact &amp; Support
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  For questions regarding these Terms of Service or commercial office inquiries, contact our advisory desk:
                </p>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#faf8f5] border border-black/[0.06] space-y-1.5 text-xs sm:text-[12.5px]">
                  <div className="font-semibold text-slate-900">
                    Noida Office Spaces — Commercial Advisory Desk
                  </div>
                  <div>
                    <span className="text-slate-500">Address: </span>
                    <span className="text-slate-800 font-medium">Commercial Sector Hub, Noida, Uttar Pradesh, India</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone: </span>
                    <a href={`tel:${contactPhoneRaw}`} className="text-[var(--gold)] font-medium hover:underline">
                      {contactPhone}
                    </a>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

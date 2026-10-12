import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy | Noida Office Spaces - Commercial Real Estate Specialists",
  description:
    "Read the Privacy Policy of Noida Office Spaces. Learn how we collect, use, protect, and handle your data during commercial office searches, lease inquiries, and site visits in Noida.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 12, 2026";
  const contactPhone = "+91 99999 01196";
  const contactPhoneRaw = "+919999901196";

  const sections = [
    { id: "intro", label: "1. Introduction & Scope" },
    { id: "info-collected", label: "2. Information We Collect" },
    { id: "how-we-use", label: "3. How We Use Your Data" },
    { id: "property-inquiry", label: "4. Property Inquiries & Advisory" },
    { id: "data-sharing", label: "5. Information Sharing & Disclosure" },
    { id: "cookies-tracking", label: "6. Cookies & Tracking Technologies" },
    { id: "data-security", label: "7. Data Security & Storage" },
    { id: "user-rights", label: "8. Your Rights & Choices" },
    { id: "third-party", label: "9. Third-Party Portals & Links" },
    { id: "contact-grievance", label: "10. Contact & Grievance Redressal" },
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
            <span className="text-[var(--gold)] font-medium">Privacy Policy</span>
          </nav>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-[1.5px] bg-[var(--gold)] inline-block" />
            <span className="text-[9.5px] sm:text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--gold)] font-sans">
              LEGAL &amp; COMPLIANCE
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-semibold tracking-tight text-white mb-1.5 leading-snug">
            Privacy <span className="text-[var(--gold)] font-semibold">Policy</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-[12.5px] font-sans max-w-2xl leading-relaxed">
            At Noida Office Spaces, your privacy and trust are paramount. This policy outlines how we handle, protect, and process personal and commercial data across our workspace advisory services in Noida and Expressway corridors.
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
                <i className="fa-solid fa-list-check text-[var(--gold)] text-xs" />
                <h3 className="text-[11.5px] font-semibold uppercase tracking-wider text-slate-800">
                  Table of Contents
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

              {/* Quick Contact Box */}
              <div className="mt-4 p-3 rounded-xl bg-[#faf8f5] border border-[var(--gold)]/20 space-y-1">
                <h4 className="text-[11.5px] font-semibold text-slate-900 font-sans">
                  Have privacy questions?
                </h4>
                <p className="text-[10.5px] text-slate-600 leading-relaxed font-sans">
                  Contact our compliance team for data inquiries.
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

            {/* ── POLICY DOCUMENT BODY (Compact & Balanced Headings) ── */}
            <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 border border-black/[0.06] shadow-sm space-y-6 sm:space-y-7 text-left">
              
              {/* 1. Introduction */}
              <section id="intro" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  1. Introduction &amp; Scope
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  Welcome to <strong>Noida Office Spaces</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;). We are a dedicated commercial workspace advisory and leasing facilitation platform serving startups, SMEs, and corporate enterprises across Noida, Greater Noida, and Yamuna Expressway corridors.
                </p>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  This Privacy Policy explains how we collect, store, utilize, and protect the information you provide when visiting our website, filling out workspace requirement forms, scheduling physical site inspections, or communicating with our commercial leasing advisors.
                </p>
              </section>

              {/* 2. Information We Collect */}
              <section id="info-collected" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  2. Information We Collect
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  We collect personal and corporate details strictly necessary to provide curated commercial real estate advisory services:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 text-xs sm:text-[12.5px] font-sans">
                  <li>
                    <strong>Contact Details:</strong> Full name, official corporate email address, contact phone number ({contactPhone}), company/business name, and designation.
                  </li>
                  <li>
                    <strong>Workspace Preferences:</strong> Required seat capacity, preferred sector/location in Noida (e.g., Sector 62, Sector 132, Sector 142, Expressway), workspace type, carpet area, and target rental budget.
                  </li>
                  <li>
                    <strong>Site Visit &amp; Inquiry Records:</strong> Date/time of booked site tours, feedback on visited commercial towers, and custom fit-out notes.
                  </li>
                  <li>
                    <strong>Technical &amp; Usage Information:</strong> IP address, device type, browser metadata, and pages viewed, collected via standard analytics to improve user experience.
                  </li>
                </ul>
              </section>

              {/* 3. How We Use Your Data */}
              <section id="how-we-use" className="space-y-2.5">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  3. How We Use Your Data
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  Your data is exclusively utilized for commercial real estate fulfillment:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-black/[0.04]">
                    <h4 className="text-[12px] font-semibold text-slate-800 font-sans mb-1 flex items-center gap-1.5">
                      <i className="fa-solid fa-magnifying-glass text-[var(--gold)] text-[10px]" />
                      <span>Curated Property Matching</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                      Shortlisting verified commercial options that match your team size, budget, and preferred Noida sector.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-black/[0.04]">
                    <h4 className="text-[12px] font-semibold text-slate-800 font-sans mb-1 flex items-center gap-1.5">
                      <i className="fa-solid fa-calendar-check text-[var(--gold)] text-[10px]" />
                      <span>Site Visit Coordination</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                      Arranging guided inspection tours with commercial property managers and authorized asset teams.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-black/[0.04]">
                    <h4 className="text-[12px] font-semibold text-slate-800 font-sans mb-1 flex items-center gap-1.5">
                      <i className="fa-solid fa-file-contract text-[var(--gold)] text-[10px]" />
                      <span>Lease Advisory &amp; Negotiation</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                      Assisting in proposal comparisons, rental agreement structuring, lock-in terms, and fit-out timelines.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-black/[0.04]">
                    <h4 className="text-[12px] font-semibold text-slate-800 font-sans mb-1 flex items-center gap-1.5">
                      <i className="fa-solid fa-headset text-[var(--gold)] text-[10px]" />
                      <span>Client Support &amp; Updates</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                      Providing timely assistance via telephone ({contactPhone}), WhatsApp, or email throughout the leasing lifecycle.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4. Property Inquiries */}
              <section id="property-inquiry" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  4. Property Inquiries &amp; Advisory
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  When you submit a workspace requirement form or schedule an inquiry, your request is reviewed exclusively by verified Noida commercial leasing specialists. We never publish your contact details publicly or sell lists to third-party telemarketers.
                </p>
              </section>

              {/* 5. Information Sharing */}
              <section id="data-sharing" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  5. Information Sharing &amp; Disclosure
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  We respect the confidential nature of corporate real estate planning. Information is only shared under the following conditions:
                </p>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700 text-xs sm:text-[12.5px] font-sans">
                  <li>
                    <strong>Commercial Property Owners &amp; Operators:</strong> Basic corporate profile and requirements are shared only when scheduling site tours or drafting commercial letters of intent (LOI), with your consent.
                  </li>
                  <li>
                    <strong>Verified Infrastructure Partners:</strong> Cloud hosting, CRM, and communication service providers bound by strict confidentiality agreements.
                  </li>
                  <li>
                    <strong>Legal &amp; Statutory Authorities:</strong> Disclosures strictly mandated under applicable Indian law, judicial summons, or regulatory decrees.
                  </li>
                </ul>
              </section>

              {/* 6. Cookies */}
              <section id="cookies-tracking" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  6. Cookies &amp; Tracking Technologies
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  Our website uses cookies to remember browsing preferences (such as selected sector filters) and analyze platform performance. You can disable cookies through your browser settings without impacting core office browsing features.
                </p>
              </section>

              {/* 7. Data Security */}
              <section id="data-security" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  7. Data Security &amp; Storage
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  We implement robust industry-standard administrative and technical security measures (including SSL/TLS encryption and protected database controls) to safeguard your data. Information is retained only as long as necessary to fulfill commercial advisory obligations.
                </p>
              </section>

              {/* 8. User Rights */}
              <section id="user-rights" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  8. Your Rights &amp; Choices
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  You have the right to request access to the personal data we maintain, request corrections to outdated records, or request deletion of your requirement inquiry once your office search is complete.
                </p>
              </section>

              {/* 9. Third-Party Portals */}
              <section id="third-party" className="space-y-2">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  9. Third-Party Portals &amp; Links
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  Our website may feature external links to mapping tools, municipal resources, or social platforms. We are not responsible for the privacy practices of external websites and recommend reviewing their independent policies.
                </p>
              </section>

              {/* 10. Contact & Grievance */}
              <section id="contact-grievance" className="space-y-2.5 pt-2 border-t border-black/[0.06]">
                <h3 className="text-[15px] sm:text-[16px] font-semibold text-slate-900 leading-snug">
                  10. Contact &amp; Grievance Redressal
                </h3>
                <p className="text-slate-700 text-xs sm:text-[12.5px] font-sans leading-relaxed">
                  For privacy-related queries, data requests, or grievance redressal, please contact our compliance desk:
                </p>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#faf8f5] border border-black/[0.06] space-y-1.5 text-xs sm:text-[12.5px]">
                  <div className="font-semibold text-slate-900">
                    Noida Office Spaces — Compliance Division
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

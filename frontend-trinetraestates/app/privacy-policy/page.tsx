import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | Trinetra Estates - Commercial Office Space Specialists in Noida",
  description:
    "Read the Privacy Policy of Trinetra Estates. Learn how we collect, use, protect, and handle your information during commercial property searches, inquiries, and site visits in Noida.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "September 29, 2026";

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
              <span className="text-[var(--color-gold)] font-medium">Privacy Policy</span>
            </nav>

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-5 h-[1.5px] bg-[var(--color-gold)] inline-block" />
              <span className="text-[9.5px] sm:text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--color-gold)] font-sans">
                LEGAL &amp; COMPLIANCE
              </span>
            </div>

            <h1 className="!font-heading !text-2xl sm:!text-3xl lg:!text-4xl !font-medium tracking-tight text-white mb-2 !leading-tight">
              Privacy <span className="text-gold font-medium">Policy</span>
            </h1>

            <p className="text-zinc-300 text-xs sm:text-[13px] font-sans max-w-2xl leading-relaxed">
              At Trinetra Estates, your privacy and trust are paramount. This Privacy Policy details how we handle, protect, and process personal and commercial data across our digital platforms and workspace advisory services.
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
                  <i className="fa-solid fa-list-check text-[var(--color-gold)] text-xs" />
                  <h3 className="!font-heading !text-[12px] !font-semibold uppercase tracking-wider text-zinc-800">
                    Table of Contents
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

                {/* Quick Contact Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-[#faf8f5] border border-[#c69960]/20 space-y-1.5">
                  <h4 className="!text-[11.5px] !font-semibold text-zinc-900 font-sans">
                    Have privacy questions?
                  </h4>
                  <p className="text-[10.5px] text-zinc-600 leading-relaxed font-sans">
                    Contact our compliance team for data inquiries.
                  </p>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-gold)] hover:underline pt-0.5"
                  >
                    <i className="fa-solid fa-envelope text-[9px]" />
                    <span>{SITE_CONFIG.email}</span>
                  </a>
                </div>
              </aside>

              {/* ── POLICY DOCUMENT BODY (Balanced & Premium Headings) ── */}
              <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-9 border border-black/[0.06] shadow-sm space-y-7 sm:space-y-8">
                
                {/* 1. Introduction */}
                <section id="intro" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    1. Introduction &amp; Scope
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    Welcome to <strong>Trinetra Estates</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;). Trinetra Estates is a premier commercial real estate advisory firm specializing in office spaces, managed corporate floors, plug-and-play centers, and bare-shell commercial properties across Noida and Expressway corridors.
                  </p>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    This Privacy Policy explains how we collect, store, utilize, and protect the information you provide when visiting our website, filling out requirement inquiry forms, scheduling physical site visits, or communicating with our leasing specialists.
                  </p>
                </section>

                {/* 2. Information We Collect */}
                <section id="info-collected" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    2. Information We Collect
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    We collect personal and corporate details strictly necessary to provide curated commercial real estate advisory services:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-zinc-700 text-xs sm:text-[13px] font-sans">
                    <li>
                      <strong>Contact Details:</strong> Full name, official corporate email address, phone number, and designation.
                    </li>
                    <li>
                      <strong>Workspace Preferences:</strong> Required seat capacity (e.g., 10-25 seats, 100+ enterprise), preferred sector/location in Noida (e.g., Sector 62, Sector 132, Sector 142, Expressway), space type, and target lease budget.
                    </li>
                    <li>
                      <strong>Site Visit &amp; Inquiry Records:</strong> Date/time of booked site tours, feedback on visited commercial parks, and custom fit-out notes.
                    </li>
                    <li>
                      <strong>Technical &amp; Usage Information:</strong> IP address, device type, browser metadata, and pages viewed, collected via standard analytics to improve user experience.
                    </li>
                  </ul>
                </section>

                {/* 3. How We Use Your Data */}
                <section id="how-we-use" className="space-y-2.5">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    3. How We Use Your Data
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    Your data is exclusively utilized for commercial real estate fulfillment:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-black/[0.04]">
                      <h4 className="!text-[12px] !font-semibold text-zinc-800 font-sans mb-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-magnifying-glass text-[var(--color-gold)] text-[10px]" />
                        <span>Curated Property Matching</span>
                      </h4>
                      <p className="text-[11px] text-zinc-600 font-sans leading-relaxed">
                        Shortlisting verified commercial options that match your team size, budget, and location criteria.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-black/[0.04]">
                      <h4 className="!text-[12px] !font-semibold text-zinc-800 font-sans mb-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-calendar-check text-[var(--color-gold)] text-[10px]" />
                        <span>Site Visit Coordination</span>
                      </h4>
                      <p className="text-[11px] text-zinc-600 font-sans leading-relaxed">
                        Arranging guided inspection tours with commercial property managers and developer authorities.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-black/[0.04]">
                      <h4 className="!text-[12px] !font-semibold text-zinc-800 font-sans mb-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-file-contract text-[var(--color-gold)] text-[10px]" />
                        <span>Lease Advisory &amp; Negotiation</span>
                      </h4>
                      <p className="text-[11px] text-zinc-600 font-sans leading-relaxed">
                        Assisting in proposal comparisons, rental agreement structuring, and fit-out timelines.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-black/[0.04]">
                      <h4 className="!text-[12px] !font-semibold text-zinc-800 font-sans mb-1 flex items-center gap-1.5">
                        <i className="fa-solid fa-shield-halved text-[var(--color-gold)] text-[10px]" />
                        <span>Legal Compliance</span>
                      </h4>
                      <p className="text-[11px] text-zinc-600 font-sans leading-relaxed">
                        Fulfilling Indian regulatory standards under the Real Estate Regulation and Information Technology Acts.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 4. Property Inquiries & Advisory */}
                <section id="property-inquiry" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    4. Property Inquiries &amp; Advisory
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    When you submit an inquiry through our website forms or phone line ({SITE_CONFIG.phone}), our dedicated workspace advisor will contact you within 30 minutes to understand your fit-out timeline and send verified property brochures. We strictly maintain a zero-spam policy and never sell client leads to third-party telemarketing networks.
                  </p>
                </section>

                {/* 5. Information Sharing & Disclosure */}
                <section id="data-sharing" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    5. Information Sharing &amp; Disclosure
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    Trinetra Estates does not sell, rent, or trade your personal information. We may share limited relevant details only under the following strictly regulated circumstances:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-zinc-700 text-xs sm:text-[13px] font-sans">
                    <li>
                      <strong>With Verified Property Developers / Landlords:</strong> Strictly when scheduling an official site tour or drafting an Expression of Interest (EOI) requested by you.
                    </li>
                    <li>
                      <strong>With Authorized Service Providers:</strong> Trusted cloud hosting, security, and SMS/email communication gateways under non-disclosure obligations.
                    </li>
                    <li>
                      <strong>Legal &amp; Regulatory Authorities:</strong> When mandated by court order, law enforcement, or statutory authorities in accordance with applicable laws in India.
                    </li>
                  </ul>
                </section>

                {/* 6. Cookies & Tracking Technologies */}
                <section id="cookies-tracking" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    6. Cookies &amp; Tracking Technologies
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    We use standard session cookies and analytical pixels to monitor page load speeds, retain your office filter preferences during a browsing session, and analyze aggregated traffic. You can adjust your browser settings to reject cookies, though certain interactive filter features may perform with reduced convenience.
                  </p>
                </section>

                {/* 7. Data Security & Storage */}
                <section id="data-security" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    7. Data Security &amp; Storage
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    We implement industry-standard SSL encryption (HTTPS 256-bit), access controls, and firewall defenses to safeguard all incoming inquiry data. Client information is stored securely in encrypted cloud environments located in compliance with the Digital Personal Data Protection Act (DPDP Act) of India.
                  </p>
                </section>

                {/* 8. Your Rights & Choices */}
                <section id="user-rights" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    8. Your Rights &amp; Choices
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    As a client or website visitor, you retain full rights regarding your data:
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5 text-zinc-700 text-xs sm:text-[13px] font-sans">
                    <li><strong>Right to Access:</strong> Request a copy of the corporate details we hold for your leasing account.</li>
                    <li><strong>Right to Rectification:</strong> Request instant correction of contact numbers, company names, or seating requirements.</li>
                    <li><strong>Right to Erasure:</strong> Request permanent removal of your contact record from our advisory database upon concluding your lease search.</li>
                    <li><strong>Opt-Out:</strong> Unsubscribe from WhatsApp or email market updates with a single reply or link.</li>
                  </ul>
                </section>

                {/* 9. Third-Party Portals & Links */}
                <section id="third-party" className="space-y-2">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    9. Third-Party Portals &amp; External Links
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    Our platform may contain links to external developer websites, Google Maps location markers, or partner portals. We do not govern the privacy practices of external third-party sites and encourage users to review their respective privacy policies upon navigating outside our domain.
                  </p>
                </section>

                {/* 10. Contact & Grievance Redressal */}
                <section id="contact-grievance" className="space-y-2.5 pt-1">
                  <h3 className="!font-heading !text-[16.5px] sm:!text-[17.5px] !font-semibold text-zinc-900 !leading-snug">
                    10. Contact Information &amp; Grievance Redressal
                  </h3>
                  <p className="text-zinc-700 text-xs sm:text-[13px] font-sans leading-relaxed">
                    For any questions, feedback, or grievance redressal concerning this Privacy Policy or your data handling, please contact our designated compliance officer:
                  </p>

                  <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#c69960]/25 space-y-1.5 text-xs sm:text-[12.5px] font-sans text-zinc-800">
                    <p className="font-semibold text-zinc-900 text-xs sm:text-[13px] font-heading">
                      Trinetra Estates — Compliance &amp; Legal Desk
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

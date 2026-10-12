import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { getApiBaseUrl } from "@/config/apiConfig";

export const metadata: Metadata = {
  title: "Sitemap | Noida Office Spaces - Complete Platform Directory",
  description:
    "Explore the complete website directory of Noida Office Spaces. Find direct links to prime commercial office listings, sector guides, workspace categories, and advisory services in Noida.",
};

interface PropertySummary {
  _id: string;
  propertyId?: string;
  title?: string;
  slug?: string;
  location?: {
    sector?: string;
    city?: string;
  };
  sector?: string;
  badge?: string;
  areaSqFt?: number;
  monthlyRentInLakh?: number;
  price?: number;
}

async function getLiveProperties(): Promise<PropertySummary[]> {
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/offices?status=Active&limit=100`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("Could not load dynamic properties for sitemap:", err);
  }
  return [];
}

export default async function SitemapPage() {
  const properties = await getLiveProperties();
  const contactPhone = "+91 99999 01196";
  const contactPhoneRaw = "+919999901196";

  const mainPages = [
    { label: "Home", href: "/", description: "Homepage with workspace discovery, advisory, and featured listings." },
    { label: "About Us", href: "/#about", description: "Our mission, Noida commercial leasing advisory team & track record." },
    { label: "Featured Spaces", href: "/#featured-spaces", description: "Handpicked premium office spaces filtered by sector & size." },
    { label: "Find Your Ideal Space", href: "/#space-categories", description: "Interactive category selection and requirement inquiry." },
    { label: "Why Choose Us", href: "/#why-choose-us", description: "Zero brokerage for tenants, verified owners & fast handover." },
    { label: "Contact Us", href: "/#contact", description: "Get in touch with commercial leasing advisors in Noida." },
  ];

  const officeTypes = [
    { label: "IT & Corporate Offices", sector: "Sector 62, 132, 142", desc: "Grade-A corporate campuses with 100% power backup." },
    { label: "Managed Offices", sector: "Expressway & Sector 125", desc: "Turnkey enterprise offices tailored to your headcount." },
    { label: "Coworking Spaces", sector: "Sector 62, 63, 135", desc: "Flexible hot desks, dedicated desks & private cabins." },
    { label: "Plug & Play Offices", sector: "Sector 132, 142, 126", desc: "Fully furnished ready-to-move workspaces." },
    { label: "Commercial Bare Shell", sector: "Sector 62, Expressway", desc: "Customizable bare spaces ready for bespoke interiors." },
    { label: "Built-to-Suit Offices", sector: "Expressway Corridors", desc: "Customized multi-floor corporate headquarters." },
    { label: "Virtual Offices", sector: "Prime Noida Hubs", desc: "Prestigious corporate GST & company registration address." },
  ];

  const popularSectors = [
    { label: "Sector 62, Noida", desc: "Major IT & Institutional hub near Electronic City Metro.", href: "/#featured-spaces?sector=Sector%2062" },
    { label: "Sector 63, Noida", desc: "Industrial & commercial business park corridor.", href: "/#featured-spaces?sector=Sector%2063" },
    { label: "Sector 125, Noida", desc: "Prime Expressway corridor adjacent to Okhla Bird Sanctuary.", href: "/#featured-spaces?sector=Sector%20125" },
    { label: "Sector 126, Noida", desc: "Corporate campus hub along the Noida-Greater Noida Expressway.", href: "/#featured-spaces?sector=Sector%20126" },
    { label: "Sector 132, Noida", desc: "Grade-A tech parks with multi-level parking and cafeteria.", href: "/#featured-spaces?sector=Sector%20132" },
    { label: "Sector 135, Noida", desc: "Enterprise SEZ corridor near major corporate headquarters.", href: "/#featured-spaces?sector=Sector%20135" },
    { label: "Sector 142, Noida", desc: "Fastest growing commercial metro hub on Aqua Line.", href: "/#featured-spaces?sector=Sector%20142" },
  ];

  const legalPages = [
    { label: "Privacy Policy", href: "/privacy", description: "Data handling, client privacy & inquiry protection protocols." },
    { label: "Terms & Conditions", href: "/terms", description: "Commercial real estate advisory and leasing terms of service." },
    { label: "XML Sitemap", href: "/sitemap.xml", description: "Machine-readable search engine index for Google & Bing." },
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
            <span className="text-[var(--gold)] font-medium">Sitemap</span>
          </nav>

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-5 h-[1.5px] bg-[var(--gold)] inline-block" />
            <span className="text-[9.5px] sm:text-[10px] font-semibold tracking-[0.25em] uppercase text-[var(--gold)] font-sans">
              PLATFORM DIRECTORY
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-[28px] font-semibold tracking-tight text-white mb-1.5 leading-snug">
            Visual <span className="text-[var(--gold)] font-semibold">Sitemap</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-[12.5px] font-sans max-w-2xl leading-relaxed">
            Welcome to the platform directory of Noida Office Spaces. Navigate through core sections, commercial workspace categories, popular Noida sectors, and verified real estate listings.
          </p>

          <div className="mt-3.5 pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-5 text-[10.5px] sm:text-[11px] text-slate-400 font-sans">
            <div>
              <span className="text-slate-500">Live Listings: </span>
              <span className="text-[var(--gold)] font-semibold">{properties.length} Active Spaces</span>
            </div>
            <div>
              <span className="text-slate-500">Advisory Helpline: </span>
              <a href={`tel:${contactPhoneRaw}`} className="text-white hover:text-[var(--gold)] font-medium transition-colors">
                {contactPhone}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* ── SITEMAP DIRECTORY SECTIONS (Compact & Balanced) ── */}
      <section className="py-6 sm:py-8 lg:py-10">
        <Container className="max-w-6xl space-y-7 sm:space-y-8">
          
          {/* SECTION 1: Core Navigation Pages */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-black/[0.06] shadow-sm text-left">
            <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.06] mb-4">
              <span className="w-7 h-7 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold)] shrink-0">
                <i className="fa-solid fa-compass text-[11px]" />
              </span>
              <div>
                <h2 className="text-[14.5px] sm:text-[15.5px] font-semibold text-slate-900 leading-snug">
                  Core Website Pages
                </h2>
                <p className="text-[11px] text-slate-500">
                  Primary pages for workspace discovery, agency insights, and direct consultation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {mainPages.map((page) => (
                <Link
                  key={page.label}
                  href={page.href}
                  className="p-3.5 rounded-xl bg-[#faf8f5]/80 hover:bg-[var(--gold-light)]/40 border border-black/[0.04] hover:border-[var(--gold)]/50 transition-all group block"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-[var(--gold)] mb-0.5">
                    <span>{page.label}</span>
                    <i className="fa-solid fa-arrow-right text-[9px] text-[var(--gold)] transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* SECTION 2: Office Space Categories */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-black/[0.06] shadow-sm text-left">
            <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.06] mb-4">
              <span className="w-7 h-7 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold)] shrink-0">
                <i className="fa-solid fa-building-circle-check text-[11px]" />
              </span>
              <div>
                <h2 className="text-[14.5px] sm:text-[15.5px] font-semibold text-slate-900 leading-snug">
                  Office Space Types in Noida
                </h2>
                <p className="text-[11px] text-slate-500">
                  Explore tailored workspace configurations suited for startups, mid-market, and corporate enterprises.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {officeTypes.map((item) => (
                <div
                  key={item.label}
                  className="p-3.5 rounded-xl bg-[#faf8f5]/80 border border-black/[0.04] space-y-0.5"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                    <span>{item.label}</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[var(--gold-light)] text-[var(--gold)]">
                      {item.sector}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans pt-0.5">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 3: Popular Sectors */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-black/[0.06] shadow-sm text-left">
            <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.06] mb-4">
              <span className="w-7 h-7 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold)] shrink-0">
                <i className="fa-solid fa-map-location-dot text-[11px]" />
              </span>
              <div>
                <h2 className="text-[14.5px] sm:text-[15.5px] font-semibold text-slate-900 leading-snug">
                  Popular Sectors in Noida
                </h2>
                <p className="text-[11px] text-slate-500">
                  Prime commercial business hubs with proximity to metro lines and Expressway infrastructure.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {popularSectors.map((sector) => (
                <Link
                  key={sector.label}
                  href={sector.href}
                  className="p-3.5 rounded-xl bg-[#faf8f5]/80 hover:bg-[var(--gold-light)]/40 border border-black/[0.04] hover:border-[var(--gold)]/50 transition-all group block"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-[var(--gold)] mb-0.5">
                    <span>{sector.label}</span>
                    <i className="fa-solid fa-location-arrow text-[9px] text-[var(--gold)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {sector.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* SECTION 4: Live Verified Properties Directory (from Database) */}
          {properties.length > 0 && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-black/[0.06] shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold)] shrink-0">
                    <i className="fa-solid fa-cubes text-[11px]" />
                  </span>
                  <div>
                    <h2 className="text-[14.5px] sm:text-[15.5px] font-semibold text-slate-900 leading-snug">
                      Live Verified Properties ({properties.length})
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Active commercial office listings stored in the database.
                    </p>
                  </div>
                </div>
                <Link
                  href="/#featured-spaces"
                  className="text-[11.5px] font-semibold text-[var(--gold)] hover:underline hidden sm:inline-flex items-center gap-1.5"
                >
                  <span>View All in Gallery</span>
                  <i className="fa-solid fa-arrow-right text-[9px]" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {properties.map((prop, idx) => {
                  const slug = prop.slug || prop.propertyId || prop._id;
                  const sector = prop.location?.sector || prop.sector || "Noida";
                  const title = prop.title || `Commercial Office ${idx + 1}`;
                  const areaText = prop.areaSqFt ? `${prop.areaSqFt.toLocaleString("en-IN")} Sq. Ft.` : "";
                  const rent = prop.monthlyRentInLakh || prop.price;
                  const rentText = rent ? `₹${rent} L / mo` : "Price on Request";

                  return (
                    <Link
                      key={prop._id || slug}
                      href={`/properties/${slug}`}
                      className="p-3 rounded-xl bg-[#faf8f5]/80 hover:bg-[var(--gold-light)]/40 border border-black/[0.04] hover:border-[var(--gold)]/50 transition-all group block"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-[var(--gold)] truncate">
                        <span className="truncate pr-2">{title}</span>
                        <i className="fa-solid fa-arrow-up-right-from-square text-[9px] text-[var(--gold)] shrink-0" />
                      </div>
                      <div className="flex items-center justify-between text-[10.5px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 truncate">
                          <i className="fa-solid fa-location-dot text-[8.5px] text-[var(--gold)]" />
                          <span>{sector}</span>
                        </span>
                        <span className="font-semibold text-slate-900">
                          {rentText}
                        </span>
                      </div>
                      {areaText && (
                        <div className="text-[10px] text-slate-400 pt-0.5">
                          Area: {areaText}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 5: Legal & Regulatory Pages */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-black/[0.06] shadow-sm text-left">
            <div className="flex items-center gap-2.5 pb-3 border-b border-black/[0.06] mb-4">
              <span className="w-7 h-7 rounded-full bg-[var(--gold-light)] flex items-center justify-center text-[var(--gold)] shrink-0">
                <i className="fa-solid fa-scale-balanced text-[11px]" />
              </span>
              <div>
                <h2 className="text-[14.5px] sm:text-[15.5px] font-semibold text-slate-900 leading-snug">
                  Legal &amp; Policy Pages
                </h2>
                <p className="text-[11px] text-slate-500">
                  Platform policies, terms of service, and search engine sitemap protocols.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {legalPages.map((page) => (
                <Link
                  key={page.label}
                  href={page.href}
                  className="p-3.5 rounded-xl bg-[#faf8f5]/80 hover:bg-[var(--gold-light)]/40 border border-black/[0.04] hover:border-[var(--gold)]/50 transition-all group block"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-900 group-hover:text-[var(--gold)] mb-0.5">
                    <span>{page.label}</span>
                    <i className="fa-solid fa-arrow-right text-[9px] text-[var(--gold)] transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                    {page.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Help & Advisory CTA */}
          <div className="bg-gradient-to-r from-[#07192b] to-[#0c2b4a] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-left border border-[#142a40] shadow-sm">
            <div className="space-y-1 max-w-xl">
              <div className="text-[9.5px] sm:text-[10px] uppercase font-semibold tracking-[0.2em] text-[var(--gold)]">
                NEED PERSONALIZED ASSISTANCE?
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                Can&apos;t find the specific office space you are looking for?
              </h3>
              <p className="text-[11.5px] text-slate-300 leading-relaxed">
                Connect directly with our commercial leasing desk for verified off-market office floorplates in Noida.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
              <a
                href={`tel:${contactPhoneRaw}`}
                className="btn btn-gold text-xs px-4.5 py-2 rounded-xl font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <i className="fa-solid fa-phone text-[10px]" />
                <span>Call {contactPhone}</span>
              </a>
            </div>
          </div>

        </Container>
      </section>
    </main>
  );
}

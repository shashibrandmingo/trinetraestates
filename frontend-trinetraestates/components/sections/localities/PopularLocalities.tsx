"use client";

import React, { useState } from "react";
import Image from "next/image";
import EnquiryModal from "@/components/modals/EnquiryModal";

interface LocationItem {
  id: string;
  name: string;
  sectorNumber: string;
  badge?: string;
  image: string;
  spacesCount: string;
}

const ALL_LOCATIONS: LocationItem[] = [
  {
    id: "sec-62",
    name: "Sector 62",
    sectorNumber: "62",
    badge: "MOST DEMANDED",
    image: "/images/sectors/sector-62.jpg",
    spacesCount: "120+ Spaces",
  },
  {
    id: "sec-63",
    name: "Sector 63",
    sectorNumber: "63",
    image: "/images/sectors/sector-63.jpg",
    spacesCount: "85+ Spaces",
  },
  {
    id: "sec-136",
    name: "Sector 136",
    sectorNumber: "136",
    image: "/images/sectors/sector-136.jpg",
    spacesCount: "65+ Spaces",
  },
  {
    id: "sec-132",
    name: "Sector 132",
    sectorNumber: "132",
    image: "/images/sectors/sector-132.jpg",
    spacesCount: "70+ Spaces",
  },
  {
    id: "sec-142",
    name: "Sector 142",
    sectorNumber: "142",
    image: "/images/sectors/sector-142.jpg",
    spacesCount: "55+ Spaces",
  },
  {
    id: "sec-125",
    name: "Sector 125",
    sectorNumber: "125",
    image: "/images/sectors/sector-125.jpg",
    spacesCount: "50+ Spaces",
  },
  {
    id: "sec-18",
    name: "Sector 18",
    sectorNumber: "18",
    image: "/images/sectors/sector-18.jpg",
    spacesCount: "90+ Spaces",
  },
  {
    id: "sec-144",
    name: "Sector 144",
    sectorNumber: "144",
    image: "/images/sectors/sector-144.jpg",
    spacesCount: "45+ Spaces",
  },
];

export default function PopularLocalities() {
  const [startIndex, setStartIndex] = useState(0);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocName, setSelectedLocName] = useState("");
  const itemsPerPage = 5;

  const handleOpenEnquiry = (locName?: string) => {
    setSelectedLocName(locName || "Noida Commercial Spaces");
    setIsModalOpen(true);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev === 0 ? ALL_LOCATIONS.length - itemsPerPage : prev - 1));
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev >= ALL_LOCATIONS.length - itemsPerPage ? 0 : prev + 1));
  };

  // Visible 5 items on desktop carousel
  const desktopVisibleLocations = ALL_LOCATIONS.slice(startIndex, startIndex + itemsPerPage).concat(
    startIndex + itemsPerPage > ALL_LOCATIONS.length
      ? ALL_LOCATIONS.slice(0, (startIndex + itemsPerPage) % ALL_LOCATIONS.length)
      : []
  );

  // Mobile locations (Initial 6 items or expanded)
  const mobileVisibleLocations = showAllMobile ? ALL_LOCATIONS : ALL_LOCATIONS.slice(0, 6);

  return (
    <section
      id="popular-localities"
      className="relative bg-white pt-5 sm:pt-7 lg:pt-8 pb-10 sm:pb-14 lg:pb-16 overflow-hidden"
    >
      <div className="site-container">
        
        {/* ── TOP HEADER ── */}
        <div className="flex flex-row items-end justify-between gap-4 pb-6 sm:pb-8">
          
          {/* Left Column: Heading & Subtitle */}
          <div className="space-y-1.5 sm:space-y-2">
            {/* Sub-tag with Gold Accent Line */}
            <div className="flex items-center gap-2">
              <span className="inline-block w-6 sm:w-8 h-[1.5px] bg-[var(--color-gold)]" />
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-gray-500 font-sans">
                POPULAR LOCALITIES
              </span>
            </div>

            {/* Main H2 Heading (2 Lines, Pure Poppins) */}
            <h2 className="font-heading text-[26px] sm:text-[34px] lg:text-[40px] font-medium tracking-tight text-[#141414] leading-[1.14]">
              Prime Locations
              <br />
              <span className="text-gold font-normal">Across Noida</span>
            </h2>

            {/* Tagline */}
            <p className="text-[9.5px] sm:text-[10.5px] tracking-[0.2em] uppercase text-gray-400 font-sans font-medium pt-0.5">
              SPACES THAT MOVE BUSINESSES FORWARD
            </p>
          </div>

          {/* Right Column: Arrow Buttons & Tagline (Desktop & Tablet Only — Hidden on Mobile) */}
          <div className="hidden md:flex flex-col items-end gap-2.5 sm:gap-3 shrink-0">
            {/* Subtle Brand Tagline */}
            <div className="flex items-center gap-2 text-right">
              <span className="w-[1.5px] h-8 bg-gray-300/80 inline-block shrink-0" />
              <span className="text-[8.5px] sm:text-[9.5px] tracking-[0.18em] uppercase text-gray-400 font-semibold leading-tight text-left">
                A BRIGHTER
                <br />
                BUSINESS
                <br />
                TOMORROW
              </span>
            </div>

            {/* Desktop Navigation Arrow Buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              {/* Left Arrow */}
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous locations"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gray-300/90 bg-white hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] text-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-sm cursor-pointer"
              >
                <i className="fa-solid fa-arrow-left text-[10px] sm:text-[11px]" />
              </button>

              {/* Right Arrow (Gold Solid Button) */}
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next locations"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-gold)] hover:bg-[var(--color-gold-hover)] text-white flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-[0_3px_10px_rgba(198,153,96,0.35)] cursor-pointer"
              >
                <i className="fa-solid fa-arrow-right text-[10px] sm:text-[11px]" />
              </button>
            </div>
          </div>

        </div>

        {/* ── DESKTOP CARDS ROW (Exact 5 cards on desktop, untouched) ── */}
        <div className="hidden lg:grid grid-cols-5 gap-3 sm:gap-3.5 lg:gap-4 w-full">
          {desktopVisibleLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => handleOpenEnquiry(`${loc.name}, Noida`)}
              role="button"
              tabIndex={0}
              aria-label={`Enquire for ${loc.name}`}
              className="
                group relative
                h-[275px] sm:h-[305px] lg:h-[335px]
                rounded-2xl sm:rounded-3xl
                overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)]
                hover:shadow-[0_16px_36px_rgba(0,0,0,0.14)]
                transition-all duration-500 hover:-translate-y-1.5
                bg-[#141416] cursor-pointer flex flex-col justify-between select-none
              "
            >
              {/* Top part: Building Image */}
              <div className="relative w-full flex-1 overflow-hidden">
                <Image
                  src={loc.image}
                  alt={loc.name}
                  fill
                  sizes="20vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                {/* Subtle bottom fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141416]/90 via-transparent to-transparent pointer-events-none" />

                {/* Optional Badge */}
                {loc.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-gold)] text-white text-[8.5px] sm:text-[9px] font-semibold tracking-wider uppercase shadow-md">
                      {loc.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Dark Sector Bar */}
              <div className="relative z-10 bg-[#141416] px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between border-t border-white/[0.08] rounded-b-2xl sm:rounded-b-3xl">
                <div className="min-w-0">
                  <span className="block text-[8.5px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase text-white/55 font-sans leading-none">
                    SECTOR
                  </span>
                  <h3 className="text-[20px] sm:text-[23px] lg:text-[25px] font-heading font-medium text-white leading-none mt-1 group-hover:text-gold transition-colors">
                    {loc.sectorNumber}
                  </h3>
                </div>

                {/* Thin Outlined Circle Arrow Action Button */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/30 group-hover:border-[var(--color-gold)] group-hover:bg-[var(--color-gold)] text-white/80 group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm shrink-0">
                  <i className="fa-solid fa-arrow-right text-[9.5px] sm:text-[10.5px] group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MOBILE & TABLET CARDS GRID (Initial 6 items, 2-column grid, with Load More button) ── */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5 w-full">
            {mobileVisibleLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleOpenEnquiry(`${loc.name}, Noida`)}
                role="button"
                tabIndex={0}
                aria-label={`Enquire for ${loc.name}`}
                className="
                  group relative
                  h-[260px] sm:h-[285px]
                  rounded-2xl
                  overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.06)]
                  bg-[#141416] cursor-pointer flex flex-col justify-between select-none
                "
              >
                {/* Top part: Building Image */}
                <div className="relative w-full flex-1 overflow-hidden">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141416]/90 via-transparent to-transparent pointer-events-none" />

                  {loc.badge && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[var(--color-gold)] text-white text-[8px] font-semibold tracking-wider uppercase shadow-md">
                        {loc.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Dark Sector Bar */}
                <div className="relative z-10 bg-[#141416] px-3 py-2.5 flex items-center justify-between border-t border-white/[0.08] rounded-b-2xl">
                  <div className="min-w-0">
                    <span className="block text-[8px] font-semibold tracking-[0.2em] uppercase text-white/55 font-sans leading-none">
                      SECTOR
                    </span>
                    <h3 className="text-[19px] sm:text-[21px] font-heading font-medium text-white leading-none mt-0.5">
                      {loc.sectorNumber}
                    </h3>
                  </div>

                  <div className="w-7 h-7 rounded-full border border-white/30 text-white/80 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-arrow-right text-[9px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Load More / View All Sectors Action Button */}
          {ALL_LOCATIONS.length > 6 && (
            <div className="flex justify-center pt-5 sm:pt-6">
              <button
                type="button"
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--color-gold-border)] bg-[var(--color-gold-light)] hover:bg-[var(--color-gold)] text-[var(--color-gold)] hover:text-white text-[11.5px] sm:text-[12px] font-medium transition-all duration-300 shadow-sm cursor-pointer"
              >
                <span>{showAllMobile ? "Show Fewer Locations" : `View All Locations (${ALL_LOCATIONS.length})`}</span>
                <i className={`fa-solid fa-chevron-down text-[9.5px] transition-transform duration-300 ${showAllMobile ? "rotate-180" : ""}`} />
              </button>
            </div>
          )}
        </div>

        {/* ── BOTTOM LUXURY FLOATING BANNER CARD ── */}
        <div className="pt-6 sm:pt-8 lg:pt-10">
          <div className="bg-[#faf8f5] rounded-2xl sm:rounded-3xl border border-gray-200/80 p-4 sm:p-5 lg:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
              
              {/* Left Headline */}
              <div className="space-y-1 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] sm:text-[9.5px] tracking-[0.25em] uppercase text-gray-400 font-semibold font-sans">
                    NOIDA
                  </span>
                  <span className="inline-block w-6 h-[1.5px] bg-[var(--color-gold)]" />
                </div>
                <h3 className="font-heading text-[18px] sm:text-[21px] lg:text-[23px] font-medium text-[#141414] leading-tight">
                  The Right Location
                  <br />
                  for <span className="text-gold font-medium">Your Business</span>
                </h3>
              </div>

              {/* Vertical Divider (Desktop) */}
              <div className="hidden lg:block w-[1px] h-12 bg-gray-300/70 shrink-0" />

              {/* Center Stats (Closer together & compactly arranged with Poppins) */}
              <div className="flex items-center gap-4 sm:gap-7 lg:gap-9">
                {/* Stat 1 */}
                <div className="text-left">
                  <h4 className="font-heading text-[19px] sm:text-[23px] font-medium text-gold leading-none">
                    500+
                  </h4>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-gray-500 font-sans mt-1 font-medium whitespace-nowrap">
                    SPACES
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="text-left border-l border-gray-300/80 pl-4 sm:pl-7 lg:pl-9">
                  <h4 className="font-heading text-[19px] sm:text-[23px] font-medium text-gold leading-none">
                    20+
                  </h4>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-gray-500 font-sans mt-1 font-medium whitespace-nowrap">
                    PRIME LOCATIONS
                  </p>
                </div>

                {/* Stat 3 */}
                <div className="text-left border-l border-gray-300/80 pl-4 sm:pl-7 lg:pl-9">
                  <h4 className="font-heading text-[19px] sm:text-[23px] font-medium text-gold leading-none">
                    100+
                  </h4>
                  <p className="text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-gray-500 font-sans mt-1 font-medium whitespace-nowrap">
                    HAPPY BUSINESSES
                  </p>
                </div>
              </div>

              {/* Right CTA Button — opens EnquiryModal */}
              <div className="pt-1 lg:pt-0 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEnquiry("All Prime Locations, Noida")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[var(--color-gold)] hover:bg-[var(--color-gold-hover)] text-white text-[12px] sm:text-[12.5px] font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 shadow-[0_3px_12px_rgba(198,153,96,0.3)] cursor-pointer whitespace-nowrap"
                >
                  <span>View All Locations</span>
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ── GLOBAL ENQUIRY MODAL POPUP ── */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedLocName ? `Enquire for ${selectedLocName}` : "Find Workspaces in Noida"}
        subtitle="Share your requirement and our commercial real-estate specialist will connect with you with verified spaces."
        initialPreferredLocation={selectedLocName}
        initialLookingFor="Furnished Offices"
      />
    </section>
  );
}

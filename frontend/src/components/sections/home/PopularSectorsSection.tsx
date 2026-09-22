"use client";

import React from "react";
import Container from "@/components/ui/Container";
import { sectorsData as defaultSectors, SectorItem } from "@/data/sectorsData";
import { useInView } from "@/hooks/useInView";

export interface PopularSectorsSectionProps {
  sectors?: SectorItem[];
  title?: string;
  subtitle?: React.ReactNode;
  onSelectSector?: (sector: { name: string; id?: string }) => void;
}

export default function PopularSectorsSection({
  sectors = defaultSectors,
  title = "Popular Sectors in Noida",
  subtitle = null,
  onSelectSector,
}: PopularSectorsSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      id="office-spaces"
      ref={sectionRef}
      className="popular-sectors-section global-section-padding bg-[var(--bg-main)] overflow-hidden"
    >
      <Container>
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 transition-opacity duration-500 ${
            isInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          {/* Left Title & Eyebrow */}
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-3">
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.18em] uppercase text-[var(--gold)]">
                EXPLORE BY LOCATION
              </span>
              <span className="w-8 sm:w-10 h-[2px] bg-[var(--gold)] rounded-full" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.55rem] font-bold text-[var(--text-heading)] leading-tight tracking-tight mt-2.5">
              {title}
            </h2>

            <p className="text-[13px] sm:text-[14.5px] md:text-[15px] text-[var(--text-body)] leading-relaxed font-normal mt-2">
              {subtitle || (
                <>
                  Discover prime business locations with world-class infrastructure <br className="hidden sm:inline" />
                  and unmatched connectivity.
                </>
              )}
            </p>
          </div>

          {/* Right Slogan / Tagline */}
          <div className="hidden md:flex flex-col items-end text-right shrink-0">
            <div className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)] leading-[1.6]">
              <div>PRIME SPACES</div>
              <div>BETTER BUSINESSES</div>
              <div>A STRONGER NOIDA</div>
            </div>
            <span className="w-12 h-[2px] bg-[var(--gold)] mt-2 rounded-full" />
          </div>
        </div>

        {/* Sectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-5.5 mt-8 sm:mt-10 lg:mt-12">
          {sectors.map((sector, idx) => (
            <div
              key={sector.id || idx}
              onClick={() => onSelectSector && onSelectSector(sector)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelectSector && onSelectSector(sector);
                }
              }}
              aria-label={`Explore office spaces in ${sector.name}`}
              className={`group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_4px_16px_-4px_rgba(10,35,60,0.12)] border border-[var(--border-card)] hover:border-[var(--gold)]/50 block cursor-pointer transition-all duration-400 ease-out hover:-translate-y-1.5 hover:shadow-[0_18px_36px_-8px_rgba(10,35,60,0.28)] ${
                isInView ? `animate-fade-up delay-${Math.min((idx + 1) * 75, 500)}` : "opacity-0"
              }`}
            >
              {/* Sector Card Image */}
              <div className="relative w-full h-[175px] sm:h-[185px] lg:h-[195px] xl:h-[200px] overflow-hidden bg-[var(--primary)]">
                <img
                  src={sector.image}
                  alt={`${sector.name} - ${sector.tagline}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                />

                {/* Deep Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07192b]/95 via-[#07192b]/55 to-transparent pointer-events-none" />

                {/* Sector Information & Action Arrow */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 lg:p-4 flex items-end justify-between gap-2.5">
                  <div className="min-w-0 flex-1 pr-1.5 text-left">
                    <div className="text-[14.5px] sm:text-[15.5px] lg:text-[16px] font-semibold !text-white leading-snug tracking-tight drop-shadow-sm truncate">
                      {sector.name}
                    </div>
                    <div className="text-[11px] sm:text-[11.5px] !text-[#cbd5e1] font-normal leading-tight mt-0.5 whitespace-nowrap truncate drop-shadow-sm">
                      {sector.tagline}
                    </div>
                  </div>

                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[var(--gold)] bg-transparent flex items-center justify-center text-white group-hover:bg-[var(--gold)] group-hover:text-[var(--primary)] group-hover:border-[var(--gold-bright)] transition-all duration-300 shrink-0">
                    <i
                      className="fa-solid fa-arrow-right text-[10px] sm:text-[11px] transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div
          className={`mt-8 sm:mt-12 bg-[var(--gold-light)] rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 border border-[var(--gold-border)]/70 relative overflow-hidden shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5 transition-opacity duration-500 ${
            isInView ? "animate-fade-up delay-300" : "opacity-0"
          }`}
        >
          {/* Banner Text Content */}
          <div className="text-left relative z-10">
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--gold)]">
                LOOKING FOR A SPECIFIC LOCATION?
              </span>
              <span className="w-6 sm:w-8 h-[1.5px] bg-[var(--gold)] rounded-full" />
            </div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-heading)] leading-snug">
              We&apos;ll help you find the right space.
            </h3>

            <p className="text-xs sm:text-[13.5px] text-[var(--text-body)] font-normal mt-1">
              Get personalized options as per your business needs.
            </p>
          </div>

          {/* Banner Action Button */}
          <div className="relative z-10 shrink-0">
            <button
              type="button"
              onClick={() => onSelectSector && onSelectSector({ name: "Any Preferred Location" })}
              className="btn btn-gold w-full sm:w-auto px-6 sm:px-7 py-3 rounded-xl inline-flex items-center justify-center gap-2 text-xs sm:text-[13.5px] font-semibold tracking-wide cursor-pointer"
            >
              <span>Talk to Our Expert</span>
              <i
                className="fa-solid fa-arrow-right text-[11px]"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Container from "@/components/ui/Container";
import { featuredPropertiesData as defaultProperties, FeaturedPropertyItem } from "@/data/featuredPropertiesData";
import { useInView } from "@/hooks/useInView";
import { BackendOfficeDoc } from "@/services/propertyService";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const BADGES = ["POPULAR", "READY TO MOVE", "PRIME LOCATION", "LATEST", "GRADE A", "PREMIUM"];
const CURATED_IMAGES = [
  "/images/sectors/sector-62.jpg",
  "/images/properties/interior-1.jpg",
  "/images/sectors/sector-142.jpg",
  "/images/properties/interior-2.jpg",
  "/images/sectors/sector-125.jpg",
  "/images/sectors/sector-63.jpg",
  "/images/sectors/sector-18.jpg",
  "/images/sectors/sector-136.jpg",
  "/images/sectors/sector-144.jpg",
  "/images/sectors/sector-126.jpg",
];

export interface FeaturedPropertiesSectionProps {
  properties?: FeaturedPropertyItem[];
  onOpenForm?: (property?: Partial<FeaturedPropertyItem> & { type?: string }) => void;
}

const PAGE_SIZE = 12;

function mapBackendOfficeToItem(office: BackendOfficeDoc, idx: number): FeaturedPropertyItem {
  // Clean excessive copy text from title
  const cleanTitle = (office.title || "Premium Office Space")
    .replace(/\s*\(Copy\)+/gi, "")
    .trim();

  // Sector & Location
  const rawSector = office.location?.sector || (office as any).sector || "Sector 62";
  const sector = rawSector.trim();
  const location = sector.toLowerCase().includes("noida") ? sector : `${sector}, Noida`;

  // Area calculation
  const areaNum = Number(
    office.areaSqFt || office.builtUpAreaSqFt || office.carpetAreaSqFt || 1000
  );
  const areaFormatted = `${areaNum.toLocaleString("en-IN")} Sq. Ft.`;

  // Realistic Workstations & Cabins based on area
  const workstationsCount = Math.max(4, Math.round(areaNum / 65));
  const cabinsCount = Math.max(1, Math.round(areaNum / 1200));

  // Luxury Badge matching Screenshot 2 aesthetics
  const badge =
    office.dataAge && office.dataAge !== "Ready to Move"
      ? office.dataAge.toUpperCase()
      : BADGES[idx % BADGES.length];

  // Image resolution with luxury sector fallbacks
  let rawImg = office.thumbnail || (office as any).imageUrl || office.images?.[0]?.url;
  let finalImg = rawImg;
  if (!finalImg || finalImg === "/images/sample-office.png") {
    if (sector.includes("62")) {
      finalImg = idx % 2 === 0 ? "/images/sectors/sector-62.jpg" : "/images/properties/interior-1.jpg";
    } else if (sector.includes("142")) {
      finalImg = "/images/sectors/sector-142.jpg";
    } else if (sector.includes("125") || sector.includes("132")) {
      finalImg = "/images/sectors/sector-125.jpg";
    } else if (sector.includes("135")) {
      finalImg = "/images/sectors/sector-136.jpg";
    } else if (sector.includes("63")) {
      finalImg = "/images/sectors/sector-63.jpg";
    } else if (sector.includes("18")) {
      finalImg = "/images/sectors/sector-18.jpg";
    } else {
      finalImg = CURATED_IMAGES[idx % CURATED_IMAGES.length];
    }
  }

  return {
    id: office._id || office.propertyId || idx + 1,
    title: cleanTitle,
    sector,
    location,
    badge,
    area: areaFormatted,
    workstations: `${workstationsCount} Workstations`,
    cabins: `${cabinsCount} ${cabinsCount === 1 ? "Cabin" : "Cabins"}`,
    image: finalImg,
    slug: office.slug || (office.propertyId ? office.propertyId.toLowerCase() : `office-${idx + 1}`),
  };
}

export default function FeaturedPropertiesSection({
  properties,
  onOpenForm,
}: FeaturedPropertiesSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.08, triggerOnce: true });
  const [currentProperties, setCurrentProperties] = useState<FeaturedPropertyItem[]>(
    properties && properties.length > 0 ? properties : defaultProperties.slice(0, PAGE_SIZE)
  );
  const [activeSector, setActiveSector] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [favorites, setFavorites] = useState<Record<string | number, boolean>>({});
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(defaultProperties.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [sectorTabs, setSectorTabs] = useState<{ id: string; label: string; hasIcon?: boolean }[]>([
    { id: "all", label: `All Properties (${defaultProperties.length})`, hasIcon: true },
  ]);
  const sortRef = useRef<HTMLDivElement>(null);

  // 1. Fetch dynamic sector summary counts from backend
  useEffect(() => {
    let isSubscribed = true;
    const fetchSectors = async () => {
      try {
        const res = await fetch(`${API_BASE}/offices/sectors`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && isSubscribed) {
            const total = json.data.total || 0;
            const tabs = [
              { id: "all", label: `All Properties (${total})`, hasIcon: true },
            ];
            (json.data.sectors || []).forEach((s: { sector: string; count: number }) => {
              tabs.push({
                id: s.sector,
                label: `${s.sector} (${s.count})`,
                hasIcon: false,
              });
            });
            setSectorTabs(tabs);
            if (activeSector === "all") {
              setTotalCount(total);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load sector summary, keeping default tabs:", err);
      }
    };

    fetchSectors();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // 2. Fetch paginated properties on sector or sort change (limit = 12, page = 1)
  useEffect(() => {
    if (properties && properties.length > 0) {
      setCurrentProperties(properties.slice(0, PAGE_SIZE));
      setTotalCount(properties.length);
      setHasMore(properties.length > PAGE_SIZE);
      return;
    }

    let isSubscribed = true;
    const fetchFirstPage = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          status: "Active",
          limit: String(PAGE_SIZE),
          page: "1",
          sortBy: sortBy,
        });
        if (activeSector !== "all") {
          params.set("sector", activeSector);
        }

        const res = await fetch(`${API_BASE}/offices?${params.toString()}`, {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && isSubscribed) {
            const mapped = json.data.map((doc: BackendOfficeDoc, idx: number) =>
              mapBackendOfficeToItem(doc, idx)
            );
            setCurrentProperties(mapped);
            setPage(1);
            setTotalCount(typeof json.total === "number" ? json.total : mapped.length);
            setHasMore(Boolean(json.hasMore));
            return;
          }
        }
      } catch (err) {
        console.warn("Could not load featured properties from backend, using defaults:", err);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchFirstPage();
    return () => {
      isSubscribed = false;
    };
  }, [properties, activeSector, sortBy]);

  // 3. Load next page from backend
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    const nextPage = page + 1;
    try {
      const params = new URLSearchParams({
        status: "Active",
        limit: String(PAGE_SIZE),
        page: String(nextPage),
        sortBy: sortBy,
      });
      if (activeSector !== "all") {
        params.set("sector", activeSector);
      }

      const res = await fetch(`${API_BASE}/offices?${params.toString()}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((doc: BackendOfficeDoc, idx: number) =>
            mapBackendOfficeToItem(doc, currentProperties.length + idx)
          );
          setCurrentProperties((prev) => [...prev, ...mapped]);
          setPage(nextPage);
          setHasMore(Boolean(json.hasMore));
          if (typeof json.total === "number") {
            setTotalCount(json.total);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load more properties:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortOptions = [
    { value: "newest", label: "Latest" },
    { value: "area-desc", label: "Area: High to Low" },
    { value: "area-asc", label: "Area: Low to High" },
  ];

  const toggleFavorite = (e: React.MouseEvent, id: string | number) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCardClick = (e: React.MouseEvent, property: FeaturedPropertyItem) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenForm) {
      onOpenForm(property);
    }
  };

  return (
    <section
      id="featured-spaces"
      ref={sectionRef}
      className="featured-properties-section global-section-padding bg-[var(--bg-main)] relative overflow-hidden"
    >
      <Container className="relative z-10">
        {/* Top Center Luxury Sub-Heading */}
        <div
          className={`flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8 transition-opacity duration-500 ${
            isInView ? "animate-fade-down" : "opacity-0"
          }`}
        >
          <span className="w-10 sm:w-16 h-[1.5px] bg-[var(--gold)]/60 rounded-full" />
          <span className="text-[9.5px] sm:text-[11px] font-bold tracking-[0.24em] uppercase text-[var(--text-heading)]">
            DIFFERENT BUSINESSES. A BETTER TOMORROW.
          </span>
          <span className="w-10 sm:w-16 h-[1.5px] bg-[var(--gold)]/60 rounded-full" />
        </div>

        {/* Section Header Row */}
        <div
          className={`flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative mb-8 sm:mb-10 transition-opacity duration-500 ${
            isInView ? "animate-fade-up delay-100" : "opacity-0"
          }`}
        >
          {/* Left Title Content */}
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2.5 mb-1.5">
              <span className="w-7 sm:w-8 h-[2px] bg-[var(--gold)] rounded-full" />
              <span className="text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.2em] uppercase text-[var(--gold)]">
                FEATURED SPACES
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold text-[var(--text-heading)] leading-tight tracking-tight mt-1">
              Premium Office Spaces <span className="text-[var(--gold)]">in Noida</span>
            </h2>

            <p className="text-[13px] sm:text-[14.5px] text-[var(--text-body)] font-normal mt-2 max-w-xl leading-relaxed">
              Explore handpicked office spaces in prime locations, designed to help your business grow.
            </p>
          </div>

          {/* Right Header Area */}
          <div className="hidden md:flex items-center shrink-0 relative">
            <div className="flex items-center gap-3 border-l border-[var(--border-subtle)] pl-3.5 pr-4 shrink-0 z-10">
              <div className="text-[9.5px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--text-muted)] leading-[1.6]">
                <div>WORK</div>
                <div>GROW</div>
                <div>BELONG</div>
              </div>
            </div>

            <div className="hidden lg:block select-none pl-3 pr-2">
              <div className="font-script -rotate-7 text-right text-[var(--text-muted)] leading-[1.12]">
                <div className="text-[19px] sm:text-[21px] font-medium">Spaces</div>
                <div className="text-[16px] sm:text-[17px] font-normal italic -my-0.5">for a</div>
                <div className="text-[20px] sm:text-[22px] font-semibold text-[var(--text-body)]">Bigger Tomorrow</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills Bar & Sort Dropdown */}
        <div
          className={`relative z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 mb-6 sm:mb-8 transition-opacity duration-500 ${
            isInView ? "animate-fade-up delay-200" : "opacity-0"
          }`}
        >
          {/* Sector Pills */}
          <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none flex-1">
            {sectorTabs.map((tab) => {
              const isActive = activeSector === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSector(tab.id)}
                  className={`px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-[12.5px] font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer flex items-center shrink-0 ${
                    isActive
                      ? "bg-[var(--gold)] text-white shadow-sm"
                      : "bg-[var(--bg-surface)] text-[var(--text-body)] border border-[var(--border-card)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
                  }`}
                >
                  {tab.hasIcon && (
                    <i
                      className="fa-solid fa-table-cells-large text-[10px] sm:text-[11px] mr-1.5"
                      aria-hidden="true"
                    />
                  )}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort By Dropdown */}
          <div
            ref={sortRef}
            className="relative flex items-center justify-between sm:justify-end gap-2 shrink-0 select-none z-30 pt-1 sm:pt-0"
          >
            <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-normal">Sort By:</span>

            <button
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 py-1 text-xs font-semibold text-[var(--text-heading)] hover:text-[var(--gold)] cursor-pointer transition-colors focus:outline-none"
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
            >
              <span>{sortOptions.find((o) => o.value === sortBy)?.label || "Latest"}</span>
              <i
                className={`fa-solid fa-chevron-down text-[9px] text-[var(--gold)] transition-transform duration-200 ${
                  isSortOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-[var(--bg-surface)] rounded-xl border border-[var(--gold-border)] shadow-[0_12px_30px_-6px_rgba(10,35,60,0.14)] py-1.5 z-50 animate-fade-in overflow-hidden">
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[var(--gold-light)] text-[var(--gold)] font-semibold"
                          : "text-[var(--text-heading)] hover:bg-[var(--gold-light)]/60 hover:text-[var(--gold)]"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <i className="fa-solid fa-check text-[10px] text-[var(--gold)]" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 12 Property Cards Grid (with Backend Paginated Load More) */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5 lg:gap-5 transition-opacity duration-300 ${isLoading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
          {currentProperties.map((property, idx) => (
            <div
              key={property.id}
              onClick={(e) => handleCardClick(e, property)}
              className={`group bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-card)] shadow-[0_2px_12px_rgba(10,35,60,0.04)] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-6px_rgba(10,35,60,0.12)] hover:border-[var(--gold)]/45 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between ${
                isInView ? `animate-fade-up delay-${Math.min((idx + 1) * 60, 500)}` : "opacity-0"
              }`}
            >
              {/* Card Image with Badge & Wishlist Heart */}
              <div className="relative w-full h-[162px] sm:h-[170px] lg:h-[176px] overflow-hidden bg-[var(--primary)]">
                <img
                  src={property.image}
                  alt={`Office Space in ${property.location}`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/sectors/sector-62.jpg";
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Status Badge */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="bg-[var(--gold-light)] text-[var(--gold-hover)] border border-[var(--gold-border)]/70 font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    {property.badge}
                  </span>
                </div>

                {/* Wishlist Heart Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(e, property.id)}
                  aria-label="Add to favorites"
                  className="absolute top-2.5 right-2.5 z-10 w-7.5 h-7.5 rounded-full bg-black/25 backdrop-blur-xs flex items-center justify-center text-white hover:text-red-400 hover:bg-black/45 transition-all cursor-pointer border border-white/20 shadow-xs"
                >
                  <i
                    className={`${
                      favorites[property.id]
                        ? "fa-solid fa-heart text-red-500"
                        : "fa-regular fa-heart"
                    } text-[11.5px]`}
                    aria-hidden="true"
                  />
                </button>
              </div>

              {/* Card Details Body */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Highlighted Location (Backend Office Title Hidden) */}
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[var(--gold-light)] border border-[var(--gold-border)]/60 text-[var(--gold)] flex items-center justify-center shrink-0 shadow-xs">
                      <i className="fa-solid fa-location-dot text-[11px]" aria-hidden="true" />
                    </span>
                    <h4
                      className="property-card-title text-[var(--text-heading)] group-hover:text-[var(--gold)] transition-colors tracking-tight truncate font-bold text-[14.5px] sm:text-[15px]"
                      style={{ lineHeight: "1.3" }}
                      title={property.location}
                    >
                      {property.location}
                    </h4>
                  </div>

                  {/* 3 Spec Badges */}
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-body)] font-medium pt-2.5 pb-0.5 border-t border-[var(--border-subtle)] mt-2.5">
                    <div className="flex items-center gap-1 shrink-0">
                      <i className="fa-regular fa-building text-[var(--gold)] text-[9.5px]" aria-hidden="true" />
                      <span className="whitespace-nowrap">{property.area}</span>
                    </div>

                    <span className="text-[var(--border-subtle)] text-[10px] select-none font-light">|</span>

                    <div className="flex items-center gap-1 shrink-0">
                      <i className="fa-solid fa-chair text-[var(--gold)] text-[9.5px]" aria-hidden="true" />
                      <span className="whitespace-nowrap">{property.workstations}</span>
                    </div>

                    <span className="text-[var(--border-subtle)] text-[10px] select-none font-light">|</span>

                    <div className="flex items-center gap-1 shrink-0">
                      <i className="fa-regular fa-id-badge text-[var(--gold)] text-[9.5px]" aria-hidden="true" />
                      <span className="whitespace-nowrap">{property.cabins}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="pt-2 border-t border-[var(--border-subtle)] mt-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[var(--gold)]">
                    Price on Request
                  </span>

                  <div
                    onClick={(e) => handleCardClick(e, property)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-heading)] group-hover:text-[var(--gold)] transition-colors cursor-pointer"
                  >
                    <span>View Details</span>
                    <div className="w-5.5 h-5.5 rounded-full bg-[var(--gold)] text-white flex items-center justify-center text-[8px] group-hover:translate-x-0.5 group-hover:bg-[var(--gold-hover)] transition-all shadow-xs">
                      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Luxury Load More Spaces Button */}
        {hasMore && (
          <div className="flex flex-col items-center justify-center mt-8 sm:mt-10 animate-fade-in">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--gold)] text-[var(--text-heading)] hover:text-white border border-[var(--gold-border)] hover:border-[var(--gold)] font-semibold text-xs sm:text-[13px] inline-flex items-center gap-2.5 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer group disabled:opacity-75 disabled:cursor-not-allowed"
            >
              <span>{isLoadingMore ? "Loading More Spaces..." : "Load More Spaces"}</span>
              {!isLoadingMore && totalCount > currentProperties.length && (
                <span className="text-[11px] opacity-75 font-normal">
                  ({totalCount - currentProperties.length} more)
                </span>
              )}
              <div className="w-5 h-5 rounded-full bg-[var(--gold-light)] group-hover:bg-white/20 text-[var(--gold)] group-hover:text-white flex items-center justify-center text-[8px] transition-colors">
                {isLoadingMore ? (
                  <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                ) : (
                  <i className="fa-solid fa-chevron-down group-hover:translate-y-0.5 transition-transform" aria-hidden="true" />
                )}
              </div>
            </button>
            <span className="text-[11px] text-[var(--text-muted)] mt-2 font-normal">
              Showing {currentProperties.length} of {totalCount} spaces
            </span>
          </div>
        )}

        {/* Bottom Customized Space Requirement Banner */}
        <div
          className={`mt-10 sm:mt-12 bg-gradient-to-r from-[var(--gold-light)] via-[var(--bg-surface)] to-[var(--gold-light)] rounded-2xl border border-[var(--gold-border)] p-3.5 sm:p-4 lg:py-3 lg:px-6 flex flex-col md:flex-row items-center justify-between gap-4 lg:gap-5 shadow-xs relative overflow-hidden transition-opacity duration-500 ${
            isInView ? "animate-fade-up delay-300" : "opacity-0"
          }`}
        >
          {/* Left Block */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 lg:gap-5 shrink-0 text-left w-full md:w-auto">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[9px] sm:text-[9.5px] font-bold tracking-[0.16em] uppercase text-[var(--gold)]">
                <span className="w-3.5 h-[1.5px] bg-[var(--gold)] rounded-full" />
                <span>LOOKING FOR A CUSTOMIZED SPACE?</span>
              </div>

              <h3 className="text-[16px] sm:text-[17.5px] lg:text-[18.5px] font-bold text-[var(--text-heading)] leading-snug tracking-tight mt-0.5">
                Tell us your requirements.
              </h3>

              <p className="text-[10.5px] sm:text-[11px] text-[var(--text-muted)] font-normal mt-0.5">
                Our experts will shortlist the best options for you.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenForm && onOpenForm({ type: "customized" })}
              className="w-full sm:w-auto px-4.5 py-2.5 sm:px-5 sm:py-2.5 rounded-xl bg-[var(--gold)] hover:bg-[var(--gold-hover)] !text-white font-semibold text-[11.5px] sm:text-[12px] inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer shrink-0 group"
            >
              <span>Talk to Our Expert</span>
              <i className="fa-solid fa-arrow-right text-[9.5px] group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </button>
          </div>

          {/* Center: Luxury Office Lounge Image */}
          <div className="relative h-[78px] sm:h-[84px] lg:h-[88px] w-full max-w-[170px] lg:max-w-[210px] shrink-0 overflow-hidden rounded-l-[50px] sm:rounded-l-[60px] border-l-2 border-t border-b border-[var(--gold-border)]/70 hidden md:block">
            <img
              src="/images/properties/customized-space-banner.jpg"
              alt="Customized Office Space Lounge"
              className="w-full h-full object-cover object-center"
              style={{
                maskImage: "linear-gradient(to right, black 65%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to right, black 65%, transparent 100%)",
              }}
            />
          </div>

          {/* Right Highlights */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 shrink-0 border-t md:border-t-0 border-[var(--gold-border)]/60 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-4 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-1.5 text-center sm:text-left">
                <i className="fa-solid fa-location-dot text-[var(--gold)] text-[12px] sm:text-[13px]" aria-hidden="true" />
                <div className="text-[9.5px] sm:text-[10px] font-semibold text-[var(--text-heading)] leading-tight">
                  <div>Prime</div>
                  <div>Locations</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-1.5 text-center sm:text-left">
                <i className="fa-solid fa-shield-halved text-[var(--gold)] text-[12px] sm:text-[13px]" aria-hidden="true" />
                <div className="text-[9.5px] sm:text-[10px] font-semibold text-[var(--text-heading)] leading-tight">
                  <div>Verified</div>
                  <div>Properties</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-1 sm:gap-1.5 text-center sm:text-left">
                <i className="fa-solid fa-handshake text-[var(--gold)] text-[12px] sm:text-[13px]" aria-hidden="true" />
                <div className="text-[9.5px] sm:text-[10px] font-semibold text-[var(--text-heading)] leading-tight">
                  <div>End-to-End</div>
                  <div>Support</div>
                </div>
              </div>
            </div>

            <div className="h-7 w-[1px] bg-[var(--gold-border)] hidden xl:block shrink-0" />

            <div className="hidden xl:block text-left shrink-0">
              <div className="text-[8.5px] font-bold tracking-[0.16em] uppercase text-[var(--text-muted)] leading-[1.3]">
                <div>MORE THAN</div>
                <div>SPACES</div>
                <div>WE CREATE</div>
                <div>POSSIBILITIES</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

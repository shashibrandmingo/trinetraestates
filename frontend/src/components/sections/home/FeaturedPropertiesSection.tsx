"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import { FeaturedPropertyItem } from "@/data/featuredPropertiesData";
import { useInView } from "@/hooks/useInView";
import { BackendOfficeDoc, resolvePropertyImage } from "@/services/propertyService";
import { getApiBaseUrl } from "@/config/apiConfig";

const API_BASE = getApiBaseUrl();

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

export function mapBackendOfficeToItem(office: BackendOfficeDoc, idx: number): FeaturedPropertyItem {
  // Use frontend display title if provided, otherwise default to Ithum Tower
  const cleanTitle = (office.frontendTitle?.trim() || "Ithum Tower")
    .replace(/\s*\(Copy\)+/gi, "")
    .trim();

  // Sector & Location from real database document
  const rawSector = office.location?.sector || (office as any).sector || "Sector 62";
  const sector = rawSector.trim();
  const location = sector.toLowerCase().includes("noida") ? sector : `${sector}, Noida`;

  // Real Area calculation from DB
  const areaNum = Number(
    office.areaSqFt || office.builtUpAreaSqFt || office.carpetAreaSqFt || 1000
  );
  const areaFormatted = `${areaNum.toLocaleString("en-IN")} Sq. Ft.`;

  // Real Workstations from DB (with fallback to area ratio only if missing/zero)
  const rawWorkstations = office.workstations;
  const workstationsText =
    typeof rawWorkstations === "number" && rawWorkstations > 0
      ? `${rawWorkstations} Workstations`
      : `${Math.max(4, Math.round(areaNum / 65))} Workstations`;

  // Real Cabins from DB
  const rawCabins = office.cabins;
  const cabinsText =
    typeof rawCabins === "number"
      ? rawCabins === 0
        ? "0 Cabins"
        : `${rawCabins} ${rawCabins === 1 ? "Cabin" : "Cabins"}`
      : `${Math.max(1, Math.round(areaNum / 1200))} Cabins`;

  // Luxury Badge
  const badge =
    office.badge ||
    (office.dataAge && office.dataAge !== "Ready to Move"
      ? office.dataAge.toUpperCase()
      : BADGES[idx % BADGES.length]);

  // Real Price from DB
  let priceFormatted = "Price on Request";
  const rent = office.monthlyRentInLakh || office.price;
  if (rent && Number(rent) > 0) {
    priceFormatted = `₹${Number(rent).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} L / mo`;
  }

  // Real Image resolution via dynamic backend host
  const rawImg = office.thumbnail || (office as any).imageUrl || office.images?.[0]?.url;
  const resolved = resolvePropertyImage(rawImg);
  const finalImg = resolved || CURATED_IMAGES[idx % CURATED_IMAGES.length];

  return {
    id: office._id || office.propertyId || idx + 1,
    title: cleanTitle,
    sector,
    location,
    badge,
    area: areaFormatted,
    workstations: workstationsText,
    cabins: cabinsText,
    price: priceFormatted,
    image: finalImg,
    slug: office.slug || (office.propertyId ? office.propertyId.toLowerCase() : `office-${idx + 1}`),
  };
}

export default function FeaturedPropertiesSection({
  properties,
  onOpenForm,
}: FeaturedPropertiesSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.08, triggerOnce: true });
  // Dynamic state: start with empty array to NEVER show dummy data
  const [currentProperties, setCurrentProperties] = useState<FeaturedPropertyItem[]>(
    properties && properties.length > 0 ? properties : []
  );
  const [activeSector, setActiveSector] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [favorites, setFavorites] = useState<Record<string | number, boolean>>({});
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(properties ? properties.length : 0);
  const [isLoading, setIsLoading] = useState<boolean>(!properties || properties.length === 0);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [sectorTabs, setSectorTabs] = useState<{ id: string; label: string; hasIcon?: boolean }[]>([
    { id: "all", label: "All Properties", hasIcon: true },
  ]);

  // Horizontal scroll refs & controls for infinite sector scalability
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Check overflow to show/hide desktop scroll arrows
  const updateScrollButtons = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  }, []);

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateScrollButtons());
      ro.observe(el);
    }

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
      ro?.disconnect();
    };
  }, [updateScrollButtons, sectorTabs]);

  const handleScrollLeft = () => {
    tabsScrollRef.current?.scrollBy({ left: -260, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    tabsScrollRef.current?.scrollBy({ left: 260, behavior: "smooth" });
  };

  const handleTabClick = (tabId: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveSector(tabId);
    e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

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
        console.warn("Could not load sector summary:", err);
      }
    };

    fetchSectors();
    return () => {
      isSubscribed = false;
    };
  }, []);

  // Handle programmatic sector selection (from Footer, URL query, or other sections)
  useEffect(() => {
    const handleSelectFeaturedSector = (e: Event) => {
      const customEvent = e as CustomEvent<{ sector: string }>;
      const targetSector = customEvent.detail?.sector;
      if (!targetSector) return;

      if (
        targetSector.toLowerCase() === "all" ||
        targetSector.toLowerCase().includes("all properties")
      ) {
        setActiveSector("all");
        const sectionEl = document.getElementById("featured-spaces");
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }

      const cleanTarget = targetSector.trim().toLowerCase().replace(/[\s-_]+/g, "");
      const matchingTab = sectorTabs.find(
        (t) => t.id.trim().toLowerCase().replace(/[\s-_]+/g, "") === cleanTarget
      );

      const targetId = matchingTab ? matchingTab.id : targetSector;
      setActiveSector(targetId);

      const sectionEl = document.getElementById("featured-spaces");
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: "smooth" });
      }

      setTimeout(() => {
        const activeBtn = tabsScrollRef.current?.querySelector(
          `[data-sector-id="${targetId}"]`
        ) as HTMLElement | null;
        if (activeBtn) {
          activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      }, 300);
    };

    window.addEventListener("select-featured-sector", handleSelectFeaturedSector);

    // Initial check from window.location (?sector=...) on mount
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const sectorParam = searchParams.get("sector");
      if (sectorParam) {
        setTimeout(() => {
          handleSelectFeaturedSector(
            new CustomEvent("select-featured-sector", { detail: { sector: sectorParam } })
          );
        }, 400);
      }
    }

    return () => {
      window.removeEventListener("select-featured-sector", handleSelectFeaturedSector);
    };
  }, [sectorTabs]);

  // 2. Fetch paginated properties on sector or sort change (limit = 12, page = 1)
  useEffect(() => {
    if (properties && properties.length > 0 && activeSector === "all" && sortBy === "newest") {
      setCurrentProperties(properties.slice(0, PAGE_SIZE));
      setTotalCount(properties.length);
      setHasMore(properties.length > PAGE_SIZE);
      setIsLoading(false);
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
        if (isSubscribed) {
          setCurrentProperties([]);
        }
      } catch (err) {
        console.warn("Could not load featured properties from backend:", err);
        if (isSubscribed) {
          setCurrentProperties([]);
        }
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

  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent, property: FeaturedPropertyItem) => {
    e.preventDefault();
    e.stopPropagation();
    const target = property.slug || String(property.id);
    router.push(`/properties/${target}`);
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

        {/* Filter Pills Bar & Sort Dropdown with Desktop Navigation Chevrons */}
        <div
          className={`relative z-30 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-2 mb-6 sm:mb-8 transition-opacity duration-500 ${
            isInView ? "animate-fade-up delay-200" : "opacity-0"
          }`}
        >
          {/* Sector Pills Carousel with Infinite Scalability & Gradient Masks */}
          <div className="relative flex-1 min-w-0 flex items-center">
            {/* Left Chevron Button (Desktop only when scrollable) */}
            {canScrollLeft && (
              <button
                type="button"
                onClick={handleScrollLeft}
                aria-label="Scroll left sectors"
                className="hidden md:flex absolute left-0 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-surface)]/95 hover:bg-[var(--gold)] text-[var(--gold)] hover:text-white border border-[var(--gold-border)] shadow-md items-center justify-center transition-all duration-200 cursor-pointer -translate-x-1"
              >
                <i className="fa-solid fa-chevron-left text-[10px]" aria-hidden="true" />
              </button>
            )}

            {/* Left Gradient Fade Mask */}
            <div
              className={`hidden md:block pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-10 bg-gradient-to-r from-[var(--bg-main)] to-transparent z-10 transition-opacity duration-200 ${
                canScrollLeft ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Scrollable Tabs Track */}
            <div
              ref={tabsScrollRef}
              className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1"
            >
              {sectorTabs.map((tab) => {
                const isActive = activeSector === tab.id;
                return (
                  <button
                    key={tab.id}
                    data-sector-id={tab.id}
                    type="button"
                    onClick={(e) => handleTabClick(tab.id, e)}
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

            {/* Right Gradient Fade Mask */}
            <div
              className={`hidden md:block pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-10 bg-gradient-to-l from-[var(--bg-main)] to-transparent z-10 transition-opacity duration-200 ${
                canScrollRight ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Right Chevron Button (Desktop only when scrollable) */}
            {canScrollRight && (
              <button
                type="button"
                onClick={handleScrollRight}
                aria-label="Scroll right sectors"
                className="hidden md:flex absolute right-0 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-surface)]/95 hover:bg-[var(--gold)] text-[var(--gold)] hover:text-white border border-[var(--gold-border)] shadow-md items-center justify-center transition-all duration-200 cursor-pointer translate-x-1"
              >
                <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Right Area: Showing Count & Sort Dropdown */}
          <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0 pt-1 lg:pt-0 border-t lg:border-t-0 border-[var(--border-subtle)]">
            <span className="text-[11.5px] sm:text-xs text-[var(--text-muted)] font-normal whitespace-nowrap">
              Showing <strong className="text-[var(--text-heading)] font-semibold">{currentProperties.length}</strong>{" "}
              {totalCount > currentProperties.length && (
                <>of <strong className="text-[var(--text-heading)] font-semibold">{totalCount}</strong></>
              )}{" "}
              spaces
            </span>

            <span className="hidden sm:inline w-[1px] h-4 bg-[var(--border-subtle)]" />

            {/* Sort By Dropdown */}
            <div
              ref={sortRef}
              className="relative flex items-center gap-1.5 select-none z-30"
            >
              <span className="text-[11px] sm:text-xs text-[var(--text-muted)] font-normal">Sort:</span>

              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-card)] text-xs font-semibold text-[var(--text-heading)] hover:text-[var(--gold)] hover:border-[var(--gold)] cursor-pointer transition-colors focus:outline-none"
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
        </div>

        {/* Loading Skeleton Cards */}
        {isLoading && currentProperties.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div
                key={`prop-skeleton-${n}`}
                className="bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-card)] shadow-xs flex flex-col justify-between"
              >
                <div className="w-full h-[176px] bg-slate-200/80 dark:bg-slate-700/40" />
                <div className="p-3.5 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-200/80" />
                    <div className="h-4 bg-slate-200/80 rounded-md w-1/2" />
                  </div>
                  <div className="h-3.5 bg-slate-100 rounded-md w-full" />
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="h-3.5 bg-slate-200/80 rounded-md w-20" />
                    <div className="h-5 w-20 bg-slate-200/80 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State when zero properties found */}
        {!isLoading && currentProperties.length === 0 && (
          <div className="py-12 sm:py-16 text-center bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-card)] p-6 sm:p-10 shadow-xs max-w-xl mx-auto animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-[var(--gold-light)] border border-[var(--gold-border)] text-[var(--gold)] flex items-center justify-center mx-auto mb-4 text-xl">
              <i className="fa-solid fa-city" aria-hidden="true" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--text-heading)] mb-1.5">
              No Office Spaces Available in {activeSector === "all" ? "Noida" : activeSector}
            </h3>
            <p className="text-xs sm:text-[13px] text-[var(--text-muted)] max-w-md mx-auto mb-5 leading-relaxed">
              We couldn&apos;t find active listings matching this sector right now. Our commercial property specialists can source verified off-market office spaces for your team.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setActiveSector("all")}
                className="px-4.5 py-2 rounded-full bg-[var(--gold)] text-white text-xs font-semibold hover:bg-[var(--gold-hover)] transition-all cursor-pointer shadow-xs"
              >
                View All Properties
              </button>
              <button
                type="button"
                onClick={() => onOpenForm && onOpenForm({ type: "customized", sector: activeSector })}
                className="px-4.5 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--gold-border)] text-[var(--text-heading)] hover:text-[var(--gold)] text-xs font-semibold transition-all cursor-pointer"
              >
                Speak with an Expert
              </button>
            </div>
          </div>
        )}

        {/* 3-Column Luxury Property Cards Grid (with Backend Paginated Load More) */}
        {!isLoading && currentProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5 lg:gap-5">
            {currentProperties.map((property, idx) => {
              const targetSlug = property.slug || String(property.id);
              const propertyHref = `/properties/${targetSlug}`;
              return (
                <div
                  key={property.id}
                  className={`group bg-[var(--bg-surface)] rounded-2xl overflow-hidden border border-[var(--border-card)] shadow-[0_2px_12px_rgba(10,35,60,0.04)] hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-6px_rgba(10,35,60,0.12)] hover:border-[var(--gold)]/45 transition-all duration-300 ease-out flex flex-col justify-between ${
                    isInView ? `animate-fade-up delay-${Math.min((idx + 1) * 60, 500)}` : "opacity-0"
                  }`}
                >
                  {/* Card Image with Badge & Wishlist Heart */}
                  <div className="relative w-full h-[162px] sm:h-[170px] lg:h-[176px] overflow-hidden bg-[var(--primary)]">
                    <Link
                      href={propertyHref}
                      className="block w-full h-full"
                      aria-label={`View office in ${property.location}`}
                    >
                      <img
                        src={property.image}
                        alt={`Office Space in ${property.location}`}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/sectors/sector-62.jpg";
                        }}
                        className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </Link>

                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
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
                      {/* Highlighted Location */}
                      <Link href={propertyHref} className="flex items-center gap-2 group/title">
                        <span className="w-6 h-6 rounded-full bg-[var(--gold-light)] border border-[var(--gold-border)]/60 text-[var(--gold)] flex items-center justify-center shrink-0 shadow-xs">
                          <i className="fa-solid fa-location-dot text-[11px]" aria-hidden="true" />
                        </span>
                        <h4
                          className="property-card-title text-[var(--text-heading)] group-hover/title:text-[var(--gold)] transition-colors tracking-tight truncate font-bold text-[14.5px] sm:text-[15px]"
                          style={{ lineHeight: "1.3" }}
                          title={property.location}
                        >
                          {property.location}
                        </h4>
                      </Link>

                      {/* 3 Spec Badges from Real DB Data */}
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

                    {/* Card Footer Bar with Real DB Price */}
                    <div className="pt-2 border-t border-[var(--border-subtle)] mt-2 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[var(--gold)]">
                        {property.price || "Price on Request"}
                      </span>

                      <Link
                        href={propertyHref}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-heading)] group-hover:text-[var(--gold)] transition-colors cursor-pointer"
                      >
                        <span>View Details</span>
                        <div className="w-5.5 h-5.5 rounded-full bg-[var(--gold)] text-white flex items-center justify-center text-[8px] group-hover:translate-x-0.5 group-hover:bg-[var(--gold-hover)] transition-all shadow-xs">
                          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

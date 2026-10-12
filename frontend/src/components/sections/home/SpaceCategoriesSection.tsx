"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import { useInView } from "@/hooks/useInView";
import { propertyService, resolvePropertyImage } from "@/services/propertyService";
import { PropertyItem } from "@/types/propertyFilter";
import { RequirementFormData } from "@/components/forms/RequirementForm";

export interface CategoryPropertyItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  sector: string;
  badge?: string;
  areaSqFt: string;
  workstations: string;
  cabins: string;
  price: string;
  image: string;
  amenity: string;
  amenityIcon: string;
}

export interface WorkspaceCategoryMeta {
  id: string;
  slug: string;
  icon: string;
  title: string;
  seatRange: string;
  description: string;
}

export interface CategoryItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
}

export interface SpaceCategoriesSectionProps {
  onSelectCategory?: (category: CategoryItem) => void;
  onOpenEnquiryModal?: (data: Partial<RequirementFormData>) => void;
}

const CATEGORY_DEFINITIONS: WorkspaceCategoryMeta[] = [
  {
    id: "startup-office",
    slug: "startup-office",
    icon: "fa-solid fa-rocket",
    title: "Startup Office",
    seatRange: "1 – 10 Seats",
    description: "Compact, private & furnished workspaces tailored for fast-moving startups and agile teams.",
  },
  {
    id: "10-25-seats",
    slug: "10-25-seats",
    icon: "fa-solid fa-user-group",
    title: "10 – 25 Seats",
    seatRange: "10 – 25 Seats",
    description: "Fully plug & play offices with executive cabins, dedicated meeting rooms & modern reception.",
  },
  {
    id: "25-50-seats",
    slug: "25-50-seats",
    icon: "fa-solid fa-people-group",
    title: "25 – 50 Seats",
    seatRange: "25 – 50 Seats",
    description: "Spacious corporate wings with manager cabins, wet pantry, conference room & server room.",
  },
  {
    id: "50-100-seats",
    slug: "50-100-seats",
    icon: "fa-regular fa-building",
    title: "50 – 100 Seats",
    seatRange: "50 – 100 Seats",
    description: "Independent corporate floors for mid-size companies, tech firms & regional head offices.",
  },
  {
    id: "100-plus-seats",
    slug: "100-plus-seats",
    icon: "fa-solid fa-city",
    title: "100+ Seats",
    seatRange: "100+ Seats",
    description: "Enterprise scale multi-floor managed offices and dedicated building blocks with scalable infrastructure.",
  },
  {
    id: "corporate-office",
    slug: "corporate-office",
    icon: "fa-solid fa-briefcase",
    title: "Corporate Office",
    seatRange: "Custom / 150+ Seats",
    description: "Grade A corporate headquarters with custom fit-outs, boardrooms, client suites & private terraces.",
  },
];

function matchesCategory(prop: PropertyItem, categoryId: string): boolean {
  const seats = Number(prop.workstations) || 0;
  const area = Number(prop.areaSqFt) || Number(prop.builtUpAreaSqFt) || 0;

  const titleLower = (prop.title || "").toLowerCase();
  const descLower = (prop.description || "").toLowerCase();
  const tags = [
    prop.propertyType || "",
    prop.badge || "",
    prop.sector || "",
    ...(Array.isArray((prop as any).categories) ? (prop as any).categories : []),
  ].map((t) => String(t).toLowerCase());

  const hasTag = (regex: RegExp) =>
    tags.some((t) => regex.test(t)) || regex.test(titleLower) || regex.test(descLower);

  switch (categoryId) {
    case "startup-office":
      return (
        (seats > 0 && seats <= 10) ||
        hasTag(/startup|micro|starter|small|pod/i) ||
        (seats === 0 && area > 0 && area <= 800)
      );

    case "10-25-seats":
      return (
        (seats >= 10 && seats <= 25) ||
        hasTag(/10\s*[-–]\s*25/i) ||
        (seats === 0 && area >= 800 && area <= 2000)
      );

    case "25-50-seats":
      return (
        (seats > 25 && seats <= 50) ||
        hasTag(/25\s*[-–]\s*50/i) ||
        (seats === 0 && area > 2000 && area <= 3500)
      );

    case "50-100-seats":
      return (
        (seats > 50 && seats <= 100) ||
        hasTag(/50\s*[-–]\s*100/i) ||
        (seats === 0 && area > 3500 && area <= 7000)
      );

    case "100-plus-seats":
      return (
        seats > 100 ||
        hasTag(/100\+|enterprise|campus/i) ||
        (seats === 0 && area > 7000)
      );

    case "corporate-office":
      return (
        seats >= 50 ||
        hasTag(/corporate|grade\s*a|headquarter|enterprise|tower|commercial/i) ||
        area >= 3000
      );

    default:
      return false;
  }
}

function convertToCategoryPropertyItem(item: PropertyItem): CategoryPropertyItem {
  const seatsNum = Number(item.workstations) || 0;
  const areaNum = Number(item.areaSqFt) || Number(item.builtUpAreaSqFt) || 1000;
  const cabinsNum = Number(item.cabins) || 0;

  let priceDisplay = "Price on Request";
  const rent = item.monthlyRentInLakh || item.price;
  if (rent && Number(rent) > 0) {
    priceDisplay = `₹${Number(rent).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })} L / mo`;
  }

  const rawImg = item.imageUrl || item.images?.[0]?.url;
  const resolved = resolvePropertyImage(rawImg);
  const image = resolved || "/images/sectors/sector-62.jpg";

  return {
    id: String(item.id || item.slug || item.propertyId),
    slug: item.slug || (item.propertyId ? item.propertyId.toLowerCase() : `office-${item.id}`),
    title: item.title,
    location: item.sector
      ? item.sector.toLowerCase().includes("noida")
        ? item.sector
        : `${item.sector}, Noida`
      : "Noida",
    sector: item.sector || "Noida",
    badge: item.badge || "GRADE A",
    areaSqFt: `${areaNum.toLocaleString("en-IN")}`,
    workstations: seatsNum > 0 ? `${seatsNum} Seats` : `${Math.max(4, Math.round(areaNum / 65))} Seats`,
    cabins: cabinsNum === 0 ? "0 Cabins" : `${cabinsNum} ${cabinsNum === 1 ? "Cabin" : "Cabins"}`,
    price: priceDisplay,
    image,
    amenity: item.meetingRooms ? `${item.meetingRooms} Meeting Rooms` : "100% Power Backup",
    amenityIcon: item.meetingRooms ? "fa-solid fa-people-roof" : "fa-solid fa-bolt",
  };
}

export default function SpaceCategoriesSection({
  onSelectCategory,
  onOpenEnquiryModal,
}: SpaceCategoriesSectionProps) {
  const router = useRouter();
  const [sectionRef, isInView] = useInView<HTMLElement>({ threshold: 0.1, triggerOnce: true });
  const [allProperties, setAllProperties] = useState<PropertyItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedMeta, setSelectedMeta] = useState<WorkspaceCategoryMeta | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Fetch live properties strictly from MongoDB backend
  useEffect(() => {
    let isMounted = true;
    const fetchLiveProperties = async () => {
      setIsLoading(true);
      try {
        const res = await propertyService.fetchPropertiesBatch({ limit: 100, status: "Active" });
        if (isMounted && res && Array.isArray(res.properties)) {
          setAllProperties(res.properties);
        }
      } catch (err) {
        console.warn("Could not load backend properties for categories:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLiveProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute live properties for the selected category
  const activeCategoryProperties = React.useMemo<CategoryPropertyItem[]>(() => {
    if (!selectedMeta) return [];
    return allProperties
      .filter((p) => matchesCategory(p, selectedMeta.id))
      .map(convertToCategoryPropertyItem);
  }, [allProperties, selectedMeta]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPopupOpen]);

  // Close popup on Escape key
  useEffect(() => {
    if (!isPopupOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPopupOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPopupOpen]);

  const handleCardClick = (cat: WorkspaceCategoryMeta) => {
    setSelectedMeta(cat);
    setIsPopupOpen(true);

    if (onSelectCategory) {
      onSelectCategory({
        id: cat.id,
        icon: cat.icon,
        title: cat.title,
        subtitle: cat.seatRange,
      });
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePropertyNavigate = (slug: string) => {
    setIsPopupOpen(false);
    router.push(`/properties/${slug}`);
  };

  const handleTriggerCategoryEnquiry = (cat: WorkspaceCategoryMeta) => {
    setIsPopupOpen(false);
    if (onOpenEnquiryModal) {
      onOpenEnquiryModal({
        spaceType: cat.title,
        requirements: `Inquiring for ${cat.title} (${cat.seatRange}) office spaces in Noida`,
      });
    }
  };

  const handleTriggerPropertyEnquiry = (prop: CategoryPropertyItem) => {
    setIsPopupOpen(false);
    if (onOpenEnquiryModal) {
      onOpenEnquiryModal({
        spaceType: selectedMeta?.title || prop.badge || "Furnished Office",
        area: prop.sector || prop.location,
        requirements: `Inquiring for ${prop.title} in ${prop.location} (${prop.areaSqFt} Sq. Ft., ${prop.workstations})`,
      });
    }
  };

  return (
    <section
      id="space-categories"
      ref={sectionRef}
      className="space-categories-section global-section-padding bg-[var(--bg-main)] relative overflow-hidden"
    >
      {/* Subtle Luxury Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-[var(--gold-light)]/20 via-[var(--gold-light)]/40 to-[var(--gold-light)]/20 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        {/* Section Header */}
        <div
          className={`text-center max-w-2xl mx-auto mb-7 sm:mb-10 transition-opacity duration-500 ${
            isInView ? "animate-fade-up" : "opacity-0"
          }`}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center justify-center gap-3">
            <span className="w-8 sm:w-10 h-[2px] bg-[var(--gold)] rounded-full" />
            <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.2em] uppercase text-[var(--gold)]">
              FIND YOUR IDEAL SPACE
            </span>
            <span className="w-8 sm:w-10 h-[2px] bg-[var(--gold)] rounded-full" />
          </div>

          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-bold text-[var(--text-heading)] leading-tight tracking-tight mt-2.5">
            What are you <span className="text-[var(--gold)]">looking for?</span>
          </h2>
        </div>

        {/* 6 Category Cards Grid Matching Screenshot Exact Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-4.5">
          {CATEGORY_DEFINITIONS.map((cat, idx) => {
            const count = allProperties.filter((p) => matchesCategory(p, cat.id)).length;
            const isActive = selectedMeta?.id === cat.id && isPopupOpen;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCardClick(cat)}
                aria-label={`View ${cat.title} office spaces`}
                className={`group relative rounded-2xl py-4 sm:py-5 lg:py-5.5 px-3 sm:px-3.5 flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer min-h-[160px] sm:min-h-[170px] lg:min-h-[180px] ${
                  isActive
                    ? "bg-[var(--gold-light)]/85 border-2 border-[var(--gold)] shadow-[0_10px_24px_-6px_rgba(157,116,72,0.25)] -translate-y-1.5"
                    : "bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-[0_3px_12px_-3px_rgba(10,35,60,0.06)] hover:bg-[var(--gold-light)]/60 hover:border-[var(--gold)] hover:-translate-y-1.5 hover:shadow-[0_12px_26px_-6px_rgba(157,116,72,0.18)]"
                } ${
                  isInView
                    ? `animate-fade-up delay-${Math.min((idx + 1) * 75, 450)}`
                    : "opacity-0"
                }`}
              >
                {/* Center Icon */}
                <div
                  className={`w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-white text-[var(--gold)] shadow-sm scale-105"
                      : "bg-[var(--gold-light)] text-[var(--gold)] group-hover:bg-white group-hover:scale-110 group-hover:shadow-sm"
                  }`}
                >
                  <i
                    className={`${cat.icon} text-lg sm:text-xl transition-transform duration-300 group-hover:scale-105`}
                    aria-hidden="true"
                  />
                </div>

                {/* Category Title & Dynamic Live Count */}
                <div className="my-1.5 sm:my-2">
                  <div
                    className={`text-[13px] sm:text-[14px] font-bold leading-tight tracking-tight transition-colors duration-200 ${
                      isActive
                        ? "text-[var(--text-heading)]"
                        : "text-[var(--text-heading)] group-hover:text-[var(--gold)]"
                    }`}
                  >
                    {cat.title}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {isLoading ? "Checking..." : `${count} ${count === 1 ? "Space" : "Spaces"}`}
                  </div>
                </div>

                {/* Circular Arrow Button */}
                <div
                  className={`w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--gold)] text-white border border-[var(--gold)] shadow-sm"
                      : "bg-transparent border border-[var(--border-subtle)] text-[var(--text-muted)] group-hover:border-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-white"
                  }`}
                >
                  <i
                    className="fa-solid fa-arrow-right text-[9.5px] sm:text-[10.5px] transition-transform duration-300 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </Container>

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY PROPERTY LISTING POPUP MODAL (COMPACT, SLEEK & NO SCROLLBAR)
          ══════════════════════════════════════════════════════════════════════ */}
      {isPopupOpen && selectedMeta && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-category-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Dark Luxury Blur Backdrop */}
          <div
            onClick={handleClosePopup}
            className="fixed inset-0 bg-[#07192b]/80 backdrop-blur-xs transition-opacity animate-fade-in"
            aria-hidden="true"
          />

          {/* Modal Container: Ultra-Compact & Elegant */}
          <div className="relative w-full max-w-4xl max-h-[90vh] sm:max-h-[86vh] flex flex-col bg-[var(--bg-surface)] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(10,35,60,0.4)] border border-[var(--gold-border)] z-10 overflow-hidden animate-scale-in my-auto">
            {/* Top Gold Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--gold)] via-[#deb881] to-[var(--gold)] z-20" />

            {/* Compact Modal Header */}
            <div className="shrink-0 bg-[var(--bg-surface)] px-4 sm:px-5 py-2.5 sm:py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 sm:w-4 h-[1.5px] bg-[var(--gold)] inline-block rounded-full" />
                  <span className="text-[9px] sm:text-[9.5px] font-bold uppercase tracking-wider text-[var(--gold)]">
                    {selectedMeta.seatRange} WORKSPACES
                  </span>
                </div>
                <h3
                  id="modal-category-title"
                  className="text-[15px] sm:text-[17px] font-bold text-[var(--text-heading)] leading-snug tracking-tight"
                >
                  {selectedMeta.title} Options in Noida
                </h3>
              </div>

              {/* Compact Close Button */}
              <button
                type="button"
                onClick={handleClosePopup}
                aria-label="Close category properties modal"
                className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--gold-light)] text-[var(--text-muted)] hover:text-[var(--gold)] border border-[var(--border-subtle)] flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs shrink-0 hover:rotate-90"
              >
                <i className="fa-solid fa-xmark text-xs" aria-hidden="true" />
              </button>
            </div>

            {/* Modal Body: Scrollbar Completely Hidden via Tailwind Arbitrary Classes */}
            <div className="overflow-y-auto px-3.5 sm:px-5 py-3 sm:py-3.5 space-y-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Compact Category Brief Bar */}
              <div className="py-2 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-[var(--gold-light)]/40 via-[var(--bg-surface)] to-[var(--gold-light)]/40 border border-[var(--gold-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 shadow-xs">
                <div className="space-y-0.5 text-left">
                  <p className="text-[11px] sm:text-[11.5px] text-[var(--text-body)] leading-snug">
                    {selectedMeta.description}
                  </p>
                  <span className="text-[10px] sm:text-[10.5px] font-semibold text-[var(--gold)] block">
                    {isLoading
                      ? "Loading live database listings..."
                      : `Showing ${activeCategoryProperties.length} verified ${selectedMeta.title} ${
                          activeCategoryProperties.length === 1 ? "space" : "spaces"
                        } available for lease in Noida.`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerCategoryEnquiry(selectedMeta)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-[var(--gold)] hover:bg-[var(--gold-hover)] !text-white text-[11px] font-semibold transition-all duration-200 shadow-xs shrink-0 cursor-pointer w-full sm:w-auto active:scale-95"
                >
                  <i className="fa-solid fa-phone-volume text-[9.5px]" aria-hidden="true" />
                  <span>Enquire All in {selectedMeta.seatRange}</span>
                </button>
              </div>

              {/* Shimmer Skeletons while loading */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-1 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={`cat-skeleton-${n}`}
                      className="bg-[var(--bg-main)] rounded-xl overflow-hidden border border-[var(--border-card)] shadow-xs"
                    >
                      <div className="w-full h-28 bg-slate-200/80" />
                      <div className="p-3 space-y-2">
                        <div className="h-3.5 bg-slate-200/80 rounded w-3/4" />
                        <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                        <div className="h-5 bg-slate-200/80 rounded w-full mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State when no properties currently listed in this category */}
              {!isLoading && activeCategoryProperties.length === 0 && (
                <div className="py-8 sm:py-10 px-4 text-center bg-[var(--bg-main)] rounded-2xl border border-[var(--border-card)] my-1">
                  <div className="w-10 h-10 rounded-full bg-[var(--gold-light)] border border-[var(--gold-border)] text-[var(--gold)] flex items-center justify-center mx-auto mb-2.5 text-base">
                    <i className="fa-solid fa-building-circle-check" aria-hidden="true" />
                  </div>
                  <h4 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-heading)] mb-1">
                    No active listings in {selectedMeta.title} yet
                  </h4>
                  <p className="text-[11px] sm:text-xs text-[var(--text-muted)] max-w-md mx-auto mb-3.5 leading-relaxed">
                    Properties added by admin matching this seat capacity ({selectedMeta.seatRange}) will automatically appear here. You can also share your requirement for custom arrangements.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTriggerCategoryEnquiry(selectedMeta)}
                      className="px-3.5 py-1.5 rounded-lg bg-[var(--gold)] hover:bg-[var(--gold-hover)] !text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
                    >
                      Enquire for {selectedMeta.seatRange}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPopupOpen(false);
                        const featured = document.getElementById("featured-spaces");
                        featured?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-[var(--bg-surface)] hover:bg-[var(--gold-light)] text-[var(--text-heading)] border border-[var(--border-card)] text-xs font-semibold transition-all cursor-pointer"
                    >
                      View All Featured Offices
                    </button>
                  </div>
                </div>
              )}

              {/* 100% Dynamic Database Properties Grid inside Popup (Compact 3-Columns) */}
              {!isLoading && activeCategoryProperties.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5 pb-1">
                  {activeCategoryProperties.map((prop) => (
                    <div
                      key={prop.id}
                      onClick={() => handlePropertyNavigate(prop.slug)}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${prop.title}`}
                      className="group rounded-xl sm:rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)] hover:border-[var(--gold)]/70 hover:shadow-[0_10px_22px_-6px_rgba(10,35,60,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer text-left select-none shadow-xs hover:-translate-y-0.5"
                    >
                      {/* Compact Property Image Container */}
                      <div className="relative w-full h-28 sm:h-30 lg:h-32 bg-[var(--primary)] overflow-hidden">
                        <img
                          src={prop.image}
                          alt={`${prop.title} - ${prop.location}`}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/images/sectors/sector-62.jpg";
                          }}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                        {/* Top Badge */}
                        {prop.badge && (
                          <div className="absolute top-2 left-2 z-10">
                            <span className="inline-block bg-[var(--gold)] text-white font-bold text-[7.5px] sm:text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs">
                              {prop.badge}
                            </span>
                          </div>
                        )}

                        {/* Price on Image Bottom Left */}
                        {prop.price && (
                          <div className="absolute bottom-1.5 left-2 z-10">
                            <span className="text-[11px] sm:text-[11.5px] font-bold text-white drop-shadow-md">
                              {prop.price}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Property Details Body */}
                      <div className="p-2.5 sm:p-3 flex flex-col flex-1 justify-between space-y-2">
                        <div className="space-y-0.5">
                          <h4
                            className="text-[12.5px] sm:text-[13px] font-bold text-[var(--text-heading)] group-hover:text-[var(--gold)] transition-colors leading-snug truncate"
                            title={prop.title}
                          >
                            {prop.title}
                          </h4>

                          <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] text-[var(--text-muted)]">
                            <i className="fa-solid fa-location-dot text-[var(--gold)] text-[8.5px]" aria-hidden="true" />
                            <span className="truncate">{prop.location}</span>
                          </div>
                        </div>

                        {/* Specs Matrix from Real DB */}
                        <div className="grid grid-cols-2 gap-1 py-1.5 border-y border-[var(--border-subtle)] text-[9px] sm:text-[9.5px] text-[var(--text-body)]">
                          <div className="flex items-center gap-1">
                            <i className="fa-regular fa-building text-[var(--gold)] text-[8.5px]" aria-hidden="true" />
                            <span>{prop.areaSqFt} Sq. Ft.</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <i className="fa-solid fa-chair text-[var(--gold)] text-[8.5px]" aria-hidden="true" />
                            <span>{prop.workstations}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <i className="fa-regular fa-id-badge text-[var(--gold)] text-[8.5px]" aria-hidden="true" />
                            <span>{prop.cabins}</span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <i className={`${prop.amenityIcon} text-[var(--gold)] text-[8.5px]`} aria-hidden="true" />
                            <span className="truncate">{prop.amenity}</span>
                          </div>
                        </div>

                        {/* Compact Action Buttons */}
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePropertyNavigate(prop.slug);
                            }}
                            aria-label={`View details of ${prop.title}`}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-[var(--bg-main)] hover:bg-[var(--gold-light)] text-[var(--text-heading)] hover:text-[var(--gold)] border border-[var(--border-card)] text-[10.5px] font-semibold transition-colors text-center cursor-pointer active:scale-95"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTriggerPropertyEnquiry(prop);
                            }}
                            aria-label={`Enquire about ${prop.title}`}
                            className="py-1.5 px-3 rounded-lg bg-[var(--gold)] hover:bg-[var(--gold-hover)] !text-white text-[10.5px] font-semibold transition-colors text-center cursor-pointer shadow-xs active:scale-95"
                          >
                            Enquire
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import RequirementForm from "@/components/forms/RequirementForm";
import { propertyService, BackendOfficeDoc, resolvePropertyImage } from "@/services/propertyService";

// ─── Amenity Keyword → FontAwesome Icon Map ───────────────────────────────
const AMENITY_ICON_MAP: Record<string, string> = {
  ac: "fa-solid fa-snowflake",
  "air condition": "fa-solid fa-snowflake",
  chill: "fa-solid fa-snowflake",
  hvac: "fa-solid fa-snowflake",
  power: "fa-solid fa-bolt",
  "power backup": "fa-solid fa-bolt",
  generator: "fa-solid fa-bolt",
  ups: "fa-solid fa-bolt",
  security: "fa-solid fa-shield-halved",
  cctv: "fa-solid fa-video",
  guard: "fa-solid fa-user-shield",
  lift: "fa-solid fa-elevator",
  elevator: "fa-solid fa-elevator",
  parking: "fa-solid fa-square-parking",
  pantry: "fa-solid fa-mug-saucer",
  cafeteria: "fa-solid fa-mug-saucer",
  tea: "fa-solid fa-mug-saucer",
  coffee: "fa-solid fa-mug-saucer",
  fire: "fa-solid fa-fire-extinguisher",
  cam: "fa-solid fa-screwdriver-wrench",
  maintenance: "fa-solid fa-screwdriver-wrench",
  housekeeping: "fa-solid fa-broom",
  wifi: "fa-solid fa-wifi",
  internet: "fa-solid fa-wifi",
  broadband: "fa-solid fa-wifi",
  gym: "fa-solid fa-dumbbell",
  fitness: "fa-solid fa-dumbbell",
  reception: "fa-solid fa-concierge-bell",
  lobby: "fa-solid fa-concierge-bell",
  meeting: "fa-solid fa-people-roof",
  conference: "fa-solid fa-people-roof",
  boardroom: "fa-solid fa-people-roof",
  washroom: "fa-solid fa-restroom",
  restroom: "fa-solid fa-restroom",
  bathroom: "fa-solid fa-restroom",
  ev: "fa-solid fa-charging-station",
  electric: "fa-solid fa-charging-station",
  solar: "fa-solid fa-solar-panel",
  rooftop: "fa-solid fa-tower-observation",
  storage: "fa-solid fa-boxes-stacked",
  warehouse: "fa-solid fa-warehouse",
  green: "fa-solid fa-leaf",
  garden: "fa-solid fa-seedling",
  atm: "fa-solid fa-building-columns",
  bank: "fa-solid fa-building-columns",
  food: "fa-solid fa-utensils",
  restaurant: "fa-solid fa-utensils",
  retail: "fa-solid fa-store",
  shop: "fa-solid fa-store",
  common: "fa-solid fa-building-circle-check",
  well: "fa-solid fa-building-circle-check",
  maintained: "fa-solid fa-building-circle-check",
  server: "fa-solid fa-server",
  data: "fa-solid fa-server",
  default: "fa-solid fa-circle-check",
};

function getAmenityIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [keyword, icon] of Object.entries(AMENITY_ICON_MAP)) {
    if (keyword !== "default" && lower.includes(keyword)) {
      return icon;
    }
  }
  return AMENITY_ICON_MAP.default;
}

const DEFAULT_AMENITIES = [
  "Central AC",
  "100% Power Backup",
  "24x7 Security",
  "High-Speed Elevators",
  "Ample Parking",
  "CAM Facility",
  "Well-Maintained Common Areas",
];

export interface PropertyDetailClientProps {
  slug?: string;
  initialDoc?: BackendOfficeDoc | null;
}

export default function PropertyDetailClient({
  slug: propSlug,
  initialDoc,
}: PropertyDetailClientProps) {
  const params = useParams();
  const router = useRouter();
  const slug = propSlug || (params?.slug as string) || "";

  const [activeTab, setActiveTab] = useState<"overview" | "details" | "location">("overview");
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const isScrollingRef = useRef(false);
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Dynamic UI Safety States for large backend content
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Data state
  const [propertyData, setPropertyData] = useState<BackendOfficeDoc | null>(initialDoc || null);
  const [similarProps, setSimilarProps] = useState<BackendOfficeDoc[]>([]);
  const [isLoading, setIsLoading] = useState(!initialDoc);
  const [notFound, setNotFound] = useState(false);

  const TAB_SECTIONS = useMemo(
    () => [
      { id: "overview", elId: "section-overview", label: "Overview" },
      { id: "details", elId: "section-key-details", label: "Key Details & Amenities" },
      { id: "location", elId: "section-location", label: "Location & Connectivity" },
    ],
    []
  );

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTab(tabId as any);
      const section = TAB_SECTIONS.find((s) => s.id === tabId);
      if (section) {
        const el = document.getElementById(section.elId);
        if (el) {
          isScrollingRef.current = true;
          const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
          const offset = isMobile ? 140 : 160;
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 800);
        }
      }
    },
    [TAB_SECTIONS]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      const isMobile = window.innerWidth < 768;
      const scrollPos = window.scrollY + (isMobile ? 150 : 170);
      for (let i = TAB_SECTIONS.length - 1; i >= 0; i--) {
        const section = TAB_SECTIONS[i];
        const el = document.getElementById(section.elId);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setActiveTab(section.id as any);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [TAB_SECTIONS]);

  // Fetch real property details & similar properties
  useEffect(() => {
    let isMounted = true;
    setIsLoading(!initialDoc);
    setNotFound(false);

    propertyService
      .getPropertyBySlugOrId(slug)
      .then((doc) => {
        if (!isMounted) return;
        if (doc) {
          setPropertyData(doc);
          setIsLoading(false);
        } else if (!initialDoc) {
          setNotFound(true);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        if (!initialDoc) setNotFound(true);
        setIsLoading(false);
      });

    propertyService
      .getActiveProperties(12)
      .then((list) => {
        if (!isMounted) return;
        const currentDocId = propertyData?._id ? String(propertyData._id).toLowerCase() : "";
        const currentSlug = (propertyData?.slug || slug).toLowerCase().trim();
        const currentSector = (
          propertyData?.location?.sector ||
          propertyData?.location?.locality ||
          ""
        )
          .toLowerCase()
          .trim();
        const currentType = (propertyData?.propertyType || "").toLowerCase().trim();

        const candidates = list.filter((item) => {
          const itemKey = (item.slug || item.propertyId || item._id || "").toLowerCase().trim();
          return itemKey !== currentSlug && itemKey !== currentDocId && itemKey !== slug.toLowerCase().trim();
        });

        // Relevance sort: 1. same sector, 2. same property type
        candidates.sort((a, b) => {
          const aSecMatch = currentSector && (a.location?.sector || a.location?.locality || "")
            .toLowerCase()
            .includes(currentSector) ? 1 : 0;
          const bSecMatch = currentSector && (b.location?.sector || b.location?.locality || "")
            .toLowerCase()
            .includes(currentSector) ? 1 : 0;
          if (aSecMatch !== bSecMatch) return bSecMatch - aSecMatch;

          const aTypeMatch = currentType && (a.propertyType || "").toLowerCase().includes(currentType) ? 1 : 0;
          const bTypeMatch = currentType && (b.propertyType || "").toLowerCase().includes(currentType) ? 1 : 0;
          return bTypeMatch - aTypeMatch;
        });

        setSimilarProps(candidates.slice(0, 4));
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug, initialDoc, propertyData?._id, propertyData?.slug, propertyData?.location?.sector, propertyData?.location?.locality, propertyData?.propertyType]);

  // Extract gallery images
  const galleryImages = useMemo(() => {
    if (!propertyData) return [];
    const list: string[] = [];

    if (Array.isArray(propertyData.images) && propertyData.images.length > 0) {
      propertyData.images.forEach((imgObj) => {
        const url = typeof imgObj === "string" ? imgObj : imgObj?.url;
        const resolved = resolvePropertyImage(url);
        if (resolved && !list.includes(resolved)) {
          list.push(resolved);
        }
      });
    }

    if (propertyData.thumbnail) {
      const res = resolvePropertyImage(propertyData.thumbnail);
      if (res && !list.includes(res)) list.unshift(res);
    }

    if (propertyData.imageUrl) {
      const res = resolvePropertyImage(propertyData.imageUrl);
      if (res && !list.includes(res)) list.push(res);
    }

    if (list.length === 0) {
      list.push("/images/sectors/sector-62.jpg");
    }

    return list;
  }, [propertyData]);

  const totalImages = galleryImages.length;

  const handleNextImage = useCallback(() => {
    if (totalImages <= 1) return;
    setActiveGalleryIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const handlePrevImage = useCallback(() => {
    if (totalImages <= 1) return;
    setActiveGalleryIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  // Keyboard navigation for Lightbox & Slider (Esc, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextImage, handlePrevImage]);

  // Property fields extraction strictly from backend doc
  const title = propertyData?.frontendTitle?.trim() || "Ithum Tower";
  const buildingName =
    propertyData?.buildingName ||
    (title.includes(",") ? title.split(",")[0].trim() : "Commercial Landmark");
  const rawSector =
    propertyData?.location?.sector ||
    propertyData?.location?.locality ||
    propertyData?.location?.city ||
    "Sector 62";
  const sector = rawSector.trim();
  const locationText =
    propertyData?.location?.address ||
    (sector.includes("Noida") ? sector : `${sector}, Noida, Uttar Pradesh 201301`);

  const areaSqFt = Number(
    propertyData?.areaSqFt ||
      propertyData?.builtUpAreaSqFt ||
      propertyData?.carpetAreaSqFt ||
      0
  );
  const workstations =
    propertyData?.workstations && propertyData.workstations > 0
      ? `${propertyData.workstations} Workstations`
      : areaSqFt > 0
      ? `${Math.max(4, Math.round(areaSqFt / 65))} Workstations`
      : "Customizable Workstations";

  const cabins =
    propertyData?.cabins && propertyData.cabins > 0
      ? propertyData.cabins
      : areaSqFt > 0
      ? Math.max(1, Math.round(areaSqFt / 1200))
      : 1;

  const furnishing = propertyData?.furnishing || "Fully Furnished";
  const propertyType = propertyData?.propertyType || "Commercial Office Space";
  const statusBadge =
    propertyData?.availabilityStatus || propertyData?.dataAge || "Available";

  const descriptionText =
    propertyData?.description ||
    `A fully furnished commercial office space situated at the prime business district of ${sector}, Noida. Located with seamless connectivity to metro routes, expressways, and commercial hubs. Well suited for consulting firms, media agencies, IT startups, and corporate branch offices.`;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--bg-main)] py-16 sm:py-24 flex flex-col items-center justify-center">
        <Container className="text-center">
          <div className="w-12 h-12 rounded-full border-3 border-[var(--gold-border)] border-t-[var(--gold)] animate-spin mx-auto mb-4" />
          <h2 className="text-lg font-bold text-[var(--text-heading)]">
            Loading Property Details...
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Fetching verified commercial office data from server.
          </p>
        </Container>
      </main>
    );
  }

  if (notFound && !propertyData) {
    return (
      <main className="min-h-screen bg-[var(--bg-main)] py-16 sm:py-24 flex flex-col items-center justify-center">
        <Container className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[var(--gold-light)] border border-[var(--gold-border)] text-[var(--gold)] flex items-center justify-center text-2xl mx-auto mb-4">
            <i className="fa-regular fa-building" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-heading)] mb-2">
            Property Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-body)] mb-6 leading-relaxed">
            The commercial office space you are looking for may have been leased or moved.
          </p>
          <Link
            href="/#featured-spaces"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--gold)] transition-colors text-xs font-semibold shadow-sm"
          >
            <i className="fa-solid fa-arrow-left text-[11px]" />
            <span>Explore Other Office Spaces</span>
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-main)] pb-16 sm:pb-24">
      {/* ── BREADCRUMBS BAR (TIGHT PROFESSIONAL SPACING DIRECTLY UNDER NAVBAR) ── */}
      <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] py-2.5 sm:py-3">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] overflow-x-auto whitespace-nowrap scrollbar-none">
              <Link
                href="/"
                className="hover:text-[var(--gold)] transition-colors flex items-center gap-1.5 font-medium"
              >
                <i className="fa-solid fa-house text-[10.5px]" />
                <span>Home</span>
              </Link>
              <span className="text-gray-300">/</span>
              <Link
                href="/#featured-spaces"
                className="hover:text-[var(--gold)] transition-colors font-medium"
              >
                Office Spaces
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-700 font-medium">
                {buildingName}
              </span>
              {areaSqFt > 0 && (
                <>
                  <span className="text-gray-300">/</span>
                  <span className="text-[var(--gold)] font-semibold truncate max-w-[200px] sm:max-w-none">
                    {areaSqFt.toLocaleString("en-IN")} Sq Ft Office Space
                  </span>
                </>
              )}
            </div>

            {/* Gallery Slider Controls (Left & Right Arrow Buttons) */}
            {totalImages > 1 && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-[var(--gold)] hover:border-[var(--gold)] hover:text-white flex items-center justify-center text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Previous Image"
                  aria-label="Previous Image"
                >
                  <i className="fa-solid fa-chevron-left text-[11px]" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-[var(--gold)] hover:border-[var(--gold)] hover:text-white flex items-center justify-center text-gray-700 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Next Image"
                  aria-label="Next Image"
                >
                  <i className="fa-solid fa-chevron-right text-[11px]" />
                </button>
              </div>
            )}
          </div>
        </Container>
      </div>

      <Container className="pt-4 sm:pt-6">
        {/* ── 1. PHOTO GALLERY (MATCHING REFERENCE LAYOUT) ── */}
        <div className="pb-6 sm:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Main Stage Image (8 Cols on Desktop) */}
            <div className="lg:col-span-8 relative h-[280px] sm:h-[370px] md:h-[420px] rounded-2xl overflow-hidden bg-[var(--primary)] group border border-[var(--border-card)] shadow-xs">
              <Image
                key={activeGalleryIndex}
                src={galleryImages[activeGalleryIndex % totalImages]}
                alt={`Office Space in ${sector.includes("Noida") ? sector : `${sector}, Noida`} - ${title} Photo ${activeGalleryIndex + 1}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer"
                onClick={() => setIsLightboxOpen(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Photo Count Badge */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-xs">
                <i className="fa-regular fa-images text-xs text-[var(--gold-bright)]" />
                <span className="font-semibold">
                  {activeGalleryIndex + 1} / {totalImages}
                </span>
              </div>

              {/* Prev/Next overlay controls */}
              {totalImages > 1 && (
                <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevImage();
                    }}
                    className="pointer-events-auto w-9 h-9 rounded-full bg-black/60 hover:bg-[var(--gold)] text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-105"
                    aria-label="Previous photo"
                  >
                    <i className="fa-solid fa-chevron-left text-xs" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextImage();
                    }}
                    className="pointer-events-auto w-9 h-9 rounded-full bg-black/60 hover:bg-[var(--gold)] text-white flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-105"
                    aria-label="Next photo"
                  >
                    <i className="fa-solid fa-chevron-right text-xs" />
                  </button>
                </div>
              )}

              {/* Expand Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/75 backdrop-blur-xs text-white hover:text-[var(--gold-bright)] flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-xs hover:scale-105"
                aria-label="View Fullscreen"
              >
                <i className="fa-solid fa-expand text-xs" />
              </button>
            </div>

            {/* Stacked Interactive Thumbnails on Right (4 Cols on Desktop) */}
            <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 lg:grid-rows-3 gap-2.5 sm:gap-3 h-auto lg:h-[420px]">
              {Array.from({ length: Math.min(3, Math.max(1, totalImages - 1)) }).map((_, i) => {
                const targetIdx = (activeGalleryIndex + i + 1) % totalImages;
                const thumbUrl = galleryImages[targetIdx] || galleryImages[0];
                const isLastThumb = i === 2 && totalImages > 4;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (isLastThumb) {
                        setIsLightboxOpen(true);
                      } else {
                        setActiveGalleryIndex(targetIdx);
                      }
                    }}
                    className="relative h-24 sm:h-28 lg:h-full rounded-xl sm:rounded-2xl overflow-hidden group bg-[var(--primary)] cursor-pointer border border-[var(--border-card)] hover:border-[var(--gold)] transition-all shadow-2xs"
                  >
                    <Image
                      src={thumbUrl}
                      alt={`Office Space in ${sector.includes("Noida") ? sector : `${sector}, Noida`} - ${title} Preview ${targetIdx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isLastThumb && (
                      <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-2 text-center">
                        <span className="text-base sm:text-lg font-bold text-[var(--gold-bright)]">
                          +{totalImages - 3}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider">
                          View All
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── 2. TWO-COLUMN MAIN CONTENT GRID (8 Cols Left + 4 Cols Sticky Form on Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
          {/* ═════════════════════════════════════════════════════════════════
              LEFT 8 COLUMNS: CARD 1 (TITLE + ADDRESS + STATUS + DESCRIPTION)
              FOLLOWED BY TABS & OVERVIEW
              ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-7">
            {/* ── CARD 1: TITLE, ADDRESS WITH PIN, BUILDING, STATUS BADGE & DESCRIPTION (EXACTLY AS SCREENSHOT 1) ── */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(10,35,60,0.04)] space-y-3.5">
              <h1
                className="font-bold text-[#0a233c] tracking-tight leading-snug"
                style={{
                  fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)",
                  lineHeight: "1.3",
                  fontWeight: 700,
                }}
              >
                {title.toLowerCase().includes(sector.toLowerCase())
                  ? title
                  : `${title}, ${sector}, Noida`}
              </h1>

              {/* Sub-info Row with Clean Divider Pipes & FontAwesome Icons */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap text-xs sm:text-[13px] text-gray-600 font-medium pt-0.5">
                <div className="flex items-center gap-1.5 text-gray-700">
                  <i className="fa-solid fa-location-dot text-[#9d7448] text-sm shrink-0" />
                  <span>
                    {locationText}
                    {!locationText.toLowerCase().includes("noida") && ", Noida"}
                    {!locationText.toLowerCase().includes("uttar pradesh") && ", Uttar Pradesh"}
                  </span>
                </div>

                <span className="text-gray-300 font-light hidden sm:inline">|</span>

                <div className="flex items-center gap-1.5 text-gray-700">
                  <i className="fa-solid fa-building text-[#9d7448] text-sm shrink-0" />
                  <span>{buildingName}</span>
                </div>

                <span className="text-gray-300 font-light hidden sm:inline">|</span>

                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[11px] sm:text-xs font-semibold bg-[#eafaf1] text-[#1e7e4e] border border-[#c3edd6]">
                  {statusBadge}
                </span>
              </div>

              {/* Description Paragraph */}
              <p className="text-gray-600 text-xs sm:text-[13.5px] leading-relaxed pt-1">
                {descriptionText}
              </p>
            </div>

            {/* ── STICKY NAVIGATION TAB BAR (MATCHING SCREENSHOT 1 WITH GOLD UNDERLINE) ── */}
            <div
              ref={tabBarRef}
              className="sticky top-[88px] sm:top-[104px] md:top-[102px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200"
            >
              <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto scrollbar-none pt-1">
                {TAB_SECTIONS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabClick(tab.id)}
                      className={`pb-3 text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer relative ${
                        isActive
                          ? "text-[#0a233c] font-bold"
                          : "text-gray-500 hover:text-[#0a233c]"
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#9d7448] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── SECTION 1: OVERVIEW (TWO-COLUMN INTRO: NARRATIVE + MINI CAROUSEL) ── */}
            <section
              id="section-overview"
              className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(10,35,60,0.03)] space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-7 items-start">
                <div className="md:col-span-7 space-y-2.5 min-w-0">
                  <h2
                    className="font-bold text-[#0a233c] tracking-tight break-words"
                    style={{
                      fontSize: "clamp(1.15rem, 1.5vw, 1.35rem)",
                      lineHeight: "1.35",
                      fontWeight: 700,
                    }}
                  >
                    {propertyData?.overviewHeading ||
                      `A Premium Workspace in the Heart of ${sector ? `${sector}, Noida` : "Noida"}'s Business Hub`}
                  </h2>
                  {(() => {
                    const fullText =
                      propertyData?.overviewDescription || propertyData?.description || "";
                    if (!fullText) {
                      return (
                        <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed break-words">
                          Located in {buildingName}, this commercial workspace in {sector}, Noida features verified infrastructure, excellent road &amp; metro connectivity, and immediate leasing availability.
                        </p>
                      );
                    }

                    const isVeryLong = fullText.length > 450;
                    const displayText = isVeryLong && !isDescExpanded ? `${fullText.slice(0, 420)}...` : fullText;

                    return (
                      <div className="space-y-2">
                        <div className="text-gray-600 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line break-words">
                          {displayText}
                        </div>
                        {isVeryLong && (
                          <button
                            type="button"
                            onClick={() => setIsDescExpanded(!isDescExpanded)}
                            className="text-xs font-semibold text-[#9d7448] hover:text-[#86613a] transition-colors inline-flex items-center gap-1 cursor-pointer pt-1"
                          >
                            <span>{isDescExpanded ? "Read Less" : "Read Full Overview"}</span>
                            <i className={`fa-solid ${isDescExpanded ? "fa-chevron-up" : "fa-chevron-down"} text-[9px]`} />
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Right Mini Image Slider with Arrow Navigation */}
                <div className="md:col-span-5 relative h-48 sm:h-52 md:h-56 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs group">
                  {galleryImages.length > 0 ? (
                    <>
                      <Image
                        src={galleryImages[activeGalleryIndex % totalImages] || galleryImages[0]}
                        alt={`Office Space in ${sector.includes("Noida") ? sector : `${sector}, Noida`} - ${title}`}
                        fill
                        className="object-cover"
                      />
                      {totalImages > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={handlePrevImage}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-90"
                            aria-label="Previous Image"
                          >
                            <i className="fa-solid fa-chevron-left text-[11px]" />
                          </button>
                          <button
                            type="button"
                            onClick={handleNextImage}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-800 flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-90"
                            aria-label="Next Image"
                          >
                            <i className="fa-solid fa-chevron-right text-[11px]" />
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <i className="fa-regular fa-building text-3xl mb-1 text-[#9d7448]" />
                      <span className="text-xs">Office Preview</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT 4 COLUMNS: STICKY SIDEBAR REQUIREMENT FORM (OFFICE SPACE NOIDA GLOBAL FORM)
              ═════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 lg:sticky lg:top-[116px] z-20">
            <div id="enquiry-form-card">
              <RequirementForm
                badge=""
                title="Enquire About This Property"
                subtitle=""
                buttonText="Send Enquiry"
                propertyName={title}
                propertyContext={{ sector, buildingName, areaSqFt }}
                initialData={{}}
                className="w-full shadow-[0_4px_24px_rgba(10,35,60,0.06)] border border-gray-200/90"
              />
            </div>
          </div>
        </div>

        {/* ── 3. FULL-WIDTH SECTION: KEY DETAILS & AMENITIES (MATCHING REFERENCE) ── */}
        <section
          id="section-key-details"
          className="mt-8 bg-white p-5 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(10,35,60,0.03)] space-y-7"
        >
          {/* Key Details Grid (2 Rows x 4 Columns = 8 Items) */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#0a233c] mb-6">
              Key Details &amp; Commercial Specifications
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-5 sm:gap-y-7 gap-x-3.5 sm:gap-x-6 lg:gap-x-8 pb-6 sm:pb-8 border-b border-gray-100">
              {/* 1. Property Type */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#faf5ef] border border-[#ebd9c5] flex items-center justify-center text-[#9d7448] shrink-0">
                  <i className="fa-solid fa-building-circle-check text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                    Property Type
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0a233c] font-bold block mt-0.5 leading-snug line-clamp-2 break-words">
                    {propertyType}
                  </strong>
                </div>
              </div>

              {/* 2. Building */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#faf5ef] border border-[#ebd9c5] flex items-center justify-center text-[#9d7448] shrink-0">
                  <i className="fa-solid fa-building text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                    Building
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0a233c] font-bold block mt-0.5 leading-snug line-clamp-2 break-words">
                    {buildingName}
                  </strong>
                </div>
              </div>

              {/* 3. Location */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#faf5ef] border border-[#ebd9c5] flex items-center justify-center text-[#9d7448] shrink-0">
                  <i className="fa-solid fa-location-dot text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                    Location
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0a233c] font-bold block mt-0.5 leading-snug line-clamp-2 break-words">
                    {sector.includes("Noida") ? sector : `${sector}, Noida`}
                  </strong>
                </div>
              </div>

              {/* 4. Total Area */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#faf5ef] border border-[#ebd9c5] flex items-center justify-center text-[#9d7448] shrink-0">
                  <i className="fa-solid fa-vector-square text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                    Total Area
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0a233c] font-bold block mt-0.5 leading-snug line-clamp-2 break-words">
                    {areaSqFt > 0 ? `${areaSqFt.toLocaleString("en-IN")} Sq. Ft.` : "Area on Request"}
                  </strong>
                </div>
              </div>

              {/* 5. Workstations */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#faf5ef] border border-[#ebd9c5] flex items-center justify-center text-[#9d7448] shrink-0">
                  <i className="fa-solid fa-users text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                    Workstations
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0a233c] font-bold block mt-0.5 leading-snug line-clamp-2 break-words">
                    {workstations}
                  </strong>
                </div>
              </div>

              {/* 6. Cabins */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#faf5ef] border border-[#ebd9c5] flex items-center justify-center text-[#9d7448] shrink-0">
                  <i className="fa-regular fa-id-badge text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                    Cabin
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0a233c] font-bold block mt-0.5 leading-snug line-clamp-2 break-words">
                    {cabins} {cabins === 1 ? "Private Cabin" : "Private Cabins"}
                  </strong>
                </div>
              </div>

              {/* 7. Pantry */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#faf5ef] border border-[#ebd9c5] flex items-center justify-center text-[#9d7448] shrink-0">
                  <i className="fa-solid fa-mug-saucer text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                    Pantry
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0a233c] font-bold block mt-0.5 leading-snug line-clamp-2 break-words">
                    {propertyData?.pantry || (propertyData?.amenities?.some((a: string) => a.toLowerCase().includes("pantry")) ? "Dry Pantry" : "Available on Request")}
                  </strong>
                </div>
              </div>

              {/* 8. Furnishing */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#faf5ef] border border-[#ebd9c5] flex items-center justify-center text-[#9d7448] shrink-0">
                  <i className="fa-solid fa-couch text-base" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                    Furnishing
                  </span>
                  <strong className="text-xs sm:text-sm text-[#0a233c] font-bold block mt-0.5 leading-snug line-clamp-2 break-words">
                    {furnishing}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities & Facilities — Dynamic from Backend */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-[#0a233c]">
                Amenities &amp; Facilities
              </h3>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("enquiry-form-card");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs sm:text-[13px] font-semibold text-[#9d7448] hover:text-[#86613a] transition-colors inline-flex items-center gap-1.5 cursor-pointer underline-offset-4 hover:underline"
              >
                <span>Enquire Now</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </button>
            </div>

            {(() => {
              const rawAmenities =
                propertyData?.amenities &&
                Array.isArray(propertyData.amenities) &&
                propertyData.amenities.length > 0
                  ? propertyData.amenities
                  : DEFAULT_AMENITIES;

              const visibleAmenities = showAllAmenities ? rawAmenities : rawAmenities.slice(0, 12);

              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
                    {visibleAmenities.map((amenityName, idx) => {
                      const icon = getAmenityIcon(amenityName);
                      return (
                        <div
                          key={idx}
                          className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-gray-100 bg-white hover:border-[#9d7448]/50 hover:shadow-xs transition-all flex flex-col items-center justify-center text-center group min-w-0"
                        >
                          <div className="text-[#9d7448] mb-2 sm:mb-2.5 group-hover:scale-110 transition-transform">
                            <i className={`${icon} text-xl sm:text-2xl`} />
                          </div>
                          <span className="text-[11px] sm:text-xs font-semibold text-gray-800 leading-snug block line-clamp-2 break-words max-w-full">
                            {amenityName}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {rawAmenities.length > 12 && (
                    <div className="pt-2 flex justify-center">
                      <button
                        type="button"
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="px-5 py-2 rounded-full border border-[#9d7448]/40 hover:border-[#9d7448] text-xs font-semibold text-[#9d7448] hover:bg-[#9d7448]/5 transition-all inline-flex items-center gap-2 cursor-pointer shadow-2xs"
                      >
                        <span>
                          {showAllAmenities
                            ? "Show Fewer Amenities"
                            : `View All ${rawAmenities.length} Amenities (+${rawAmenities.length - 12} more)`}
                        </span>
                        <i
                          className={`fa-solid ${
                            showAllAmenities ? "fa-chevron-up" : "fa-chevron-down"
                          } text-[10px]`}
                        />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── 4. FULL-WIDTH SECTION: LOCATION & CONNECTIVITY (3 EQUAL COLUMNS) ── */}
        <section
          id="section-location"
          className="mt-8 sm:mt-10 lg:mt-12 bg-white p-5 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* 1. Left Column: Description & Checkmarks */}
            <div className="flex flex-col justify-between space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0a233c] pb-2">
                  Location &amp; Connectivity
                </h2>
                <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                  {propertyData?.locationDescription ||
                    `${buildingName} is one of Noida's most sought-after commercial destinations, offering excellent metro and road connectivity, and proximity to major business hubs, corporate offices, and lifestyle amenities.`}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5">
                  <i className="fa-solid fa-circle-check text-[#9d7448] text-sm mt-0.5 shrink-0" />
                  <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                    Located in {sector.includes("Noida") ? sector : `${sector}, Noida`}
                  </span>
                </div>

                {Array.isArray(propertyData?.connectivityHighlights) &&
                propertyData.connectivityHighlights.filter(Boolean).length > 0 ? (
                  propertyData.connectivityHighlights.filter(Boolean).map((pt: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <i className="fa-solid fa-circle-check text-[#9d7448] text-sm mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">{pt}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start gap-2.5">
                      <i className="fa-solid fa-circle-check text-[#9d7448] text-sm mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                        {propertyData?.metroDistance || "Close to Noida Metro Station"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <i className="fa-solid fa-circle-check text-[#9d7448] text-sm mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                        {propertyData?.roadConnectivity || "Easy access to NH-24 and DND Expressway"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <i className="fa-solid fa-circle-check text-[#9d7448] text-sm mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                        Surrounded by corporate offices, cafes and retail outlets
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 2. Middle Column: Interactive Google Maps Card */}
            <div className="relative h-64 lg:h-full min-h-[250px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm group">
              <iframe
                title={`${buildingName} Office Location Map`}
                src={
                  propertyData?.mapEmbedUrl ||
                  `https://maps.google.com/maps?q=${encodeURIComponent(
                    `${buildingName || "Office Space"}, ${sector || "Sector 62"}, Noida, Uttar Pradesh`
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                }
                className="w-full h-full border-0"
                loading="lazy"
              />

              {/* Floating Map Info Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-md border border-gray-200/80 text-xs pointer-events-auto">
                <strong className="block text-gray-900 font-bold text-xs sm:text-sm">
                  {buildingName}
                </strong>
                <span className="text-gray-500 block text-[11px] mb-1.5">
                  {sector}, Noida, Uttar Pradesh
                </span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${buildingName}, ${sector}, Noida`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9d7448] hover:text-[#86613a] font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                >
                  <span>View on Google Maps</span>
                  <i className="fa-solid fa-arrow-right text-[9px]" />
                </a>
              </div>
            </div>

            {/* 3. Right Column: Nearby Places List */}
            {(() => {
              const rawPlaces = (Array.isArray(propertyData?.nearbyPlaces) &&
              propertyData.nearbyPlaces.filter((p: any) => p && p.label).length > 0
                ? propertyData.nearbyPlaces.filter((p: any) => p && p.label)
                : [
                    {
                      icon: "fa-solid fa-train-subway",
                      label: "Noida Metro Station",
                      time: "5 mins",
                    },
                    {
                      icon: "fa-solid fa-road",
                      label: "NH-24 / Expressways",
                      time: "10 mins",
                    },
                    {
                      icon: "fa-solid fa-building",
                      label: "Sector 18 Commercial Hub",
                      time: "15 mins",
                    },
                    {
                      icon: "fa-solid fa-road-bridge",
                      label: "DND Flyway (Delhi Connect)",
                      time: "15 mins",
                    },
                    {
                      icon: "fa-solid fa-plane-departure",
                      label: "IGI Airport & Jewar Airport",
                      time: "45 mins",
                    },
                  ]
              );

              const visiblePlaces = showAllPlaces ? rawPlaces : rawPlaces.slice(0, 5);

              return (
                <div className="flex flex-col justify-between space-y-3 min-w-0">
                  <div>
                    <h4 className="text-lg font-bold text-[#0a233c] pb-1">
                      Nearby Places
                    </h4>

                    <div className="space-y-3 divide-y divide-gray-100/80">
                      {visiblePlaces.map((place: any, i: number) => {
                        const lbl = (place.label || "").toLowerCase();
                        const iconClass =
                          place.icon ||
                          (lbl.includes("metro") || lbl.includes("train") || lbl.includes("station")
                            ? "fa-solid fa-train-subway"
                            : lbl.includes("expressway") || lbl.includes("nh-") || lbl.includes("road") || lbl.includes("highway")
                            ? "fa-solid fa-road"
                            : lbl.includes("airport") || lbl.includes("igi") || lbl.includes("jewar")
                            ? "fa-solid fa-plane-departure"
                            : lbl.includes("dnd") || lbl.includes("bridge") || lbl.includes("flyway")
                            ? "fa-solid fa-road-bridge"
                            : "fa-solid fa-building");

                        return (
                          <div
                            key={i}
                            className={`flex items-center justify-between gap-3 ${i !== 0 ? "pt-2.5" : ""}`}
                          >
                            <span className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-lg bg-[#faf5ef] border border-[#ebd9c5]/60 flex items-center justify-center text-[#9d7448] shrink-0">
                                <i className={`${iconClass} text-xs`} />
                              </div>
                              <span className="text-xs sm:text-[13px] text-gray-700 font-medium truncate block">
                                {place.label}
                              </span>
                            </span>
                            <span className="text-xs sm:text-[13px] text-gray-500 font-medium shrink-0 ml-2 whitespace-nowrap">
                              {place.time}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {rawPlaces.length > 5 && (
                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={() => setShowAllPlaces(!showAllPlaces)}
                        className="text-xs font-semibold text-[#9d7448] hover:text-[#86613a] transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{showAllPlaces ? "Show Fewer Places" : `View All ${rawPlaces.length} Places (+${rawPlaces.length - 5} more)`}</span>
                        <i className={`fa-solid ${showAllPlaces ? "fa-chevron-up" : "fa-chevron-down"} text-[9px]`} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ── 5. TALK TO EXPERTS BANNER (OFFICE SPACE NOIDA) ── */}
        <div className="mt-10 sm:mt-12 rounded-2xl sm:rounded-3xl overflow-hidden relative p-6 sm:p-9 lg:p-10 shadow-xl border border-white/10 text-white flex flex-col md:flex-row items-center justify-between gap-6 bg-[#07192b]">
          {/* Background Image with Balanced High-Contrast Luxury Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/ctaimage/ctaimage.webp"
              alt="Office Space in Noida - Verified Corporate Leasing Advisory"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-[#07192b]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#07192b]/95 via-[#07192b]/85 to-[#07192b]/65" />
          </div>

          <div className="space-y-2 text-center md:text-left relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="w-3.5 h-[2px] bg-[var(--gold)] rounded-full inline-block" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#deb881] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                OFFICE SPACE NOIDA &bull; DIRECT ASSISTANCE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-white tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] leading-tight">
              Need More Workspace Options in {sector.includes("Noida") ? sector : `${sector}, Noida`}?
            </h2>
            <p
              className="text-xs sm:text-[13.5px] font-medium leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)] pt-0.5"
              style={{ color: "#ffffff", opacity: 0.98, textShadow: "0 1px 3px rgba(0,0,0,0.85)" }}
            >
              Connect directly with our Noida workspace advisory team. Get verified commercial options tailored to your team size, budget, and business requirements with 0% brokerage.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("enquiry-form-card");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#9d7448] hover:bg-[#86613a] text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md hover:scale-105 cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 group"
            >
              <span>Enquire for This Space</span>
              <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="tel:9999901196"
              className="w-full sm:w-auto px-5 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md hover:scale-105 whitespace-nowrap flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-phone text-xs text-[#deb881]" />
              <span>Call: 99999 01196</span>
            </a>
          </div>
        </div>

        {/* ── 6. SIMILAR PROPERTIES (REAL BACKEND ONLY) ── */}
        {similarProps.length > 0 && (
          <section className="mt-12 sm:mt-14 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0a233c]">
                Similar Properties You Might Like
              </h2>
              <Link
                href="/#featured-spaces"
                className="text-xs sm:text-[13px] font-semibold text-[#9d7448] hover:text-[#86613a] transition-colors flex items-center gap-1.5"
              >
                <span>View All Properties</span>
                <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {similarProps.map((simProp, idx) => {
                const simTitle = simProp.title || "Office Space in Noida";
                const simSector = simProp.location?.sector || simProp.location?.locality || "Noida";
                const simImg =
                  resolvePropertyImage(
                    simProp.thumbnail || simProp.imageUrl || simProp.images?.[0]?.url
                  ) || "/images/sectors/sector-62.jpg";
                const simSlug = simProp.slug || simProp.propertyId || simProp._id || String(idx);

                return (
                  <div
                    key={simProp._id || idx}
                    onClick={() => router.push(`/properties/${simSlug}`)}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 hover:border-[#9d7448]/60 shadow-[0_2px_10px_rgba(10,35,60,0.03)] hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-[16/10] w-full bg-[#0a233c] overflow-hidden flex items-center justify-center">
                      <Image
                        src={simImg}
                        alt={`Office Space in ${simSector.includes("Noida") ? simSector : `${simSector}, Noida`} - ${simTitle}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2.5">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-xs sm:text-[13.5px] text-[#0a233c] group-hover:text-[#9d7448] transition-colors leading-tight truncate">
                          {simSector.includes("Noida") ? simSector : `${simSector}, Noida`}
                        </h3>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5 font-normal">
                          {simTitle}
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-[#9d7448] group-hover:bg-[#86613a] text-white flex items-center justify-center text-xs transition-all shrink-0 shadow-xs group-hover:scale-105">
                        <i className="fa-solid fa-arrow-right text-[11px]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </Container>

      {/* ── HIGH-Z-INDEX LIGHTBOX MODAL ── */}
      {isLightboxOpen && totalImages > 0 && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Info Pill */}
          <div className="fixed top-6 left-6 z-[100000] bg-black/60 backdrop-blur-xs text-white text-xs px-3.5 py-1.5 rounded-full border border-white/20">
            <span>
              Photo {activeGalleryIndex + 1} of {totalImages}
            </span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="fixed top-5 right-5 z-[100000] w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg transition-all cursor-pointer shadow-xl hover:scale-105"
            aria-label="Close Lightbox"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          {/* Prev Button */}
          {totalImages > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100000] w-11 h-11 rounded-full bg-black/60 hover:bg-[#9d7448] text-white flex items-center justify-center text-sm transition-all cursor-pointer shadow-xl hover:scale-105 border border-white/20"
              aria-label="Previous photo"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
          )}

          {/* Next Button */}
          {totalImages > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100000] w-11 h-11 rounded-full bg-black/60 hover:bg-[#9d7448] text-white flex items-center justify-center text-sm transition-all cursor-pointer shadow-xl hover:scale-105 border border-white/20"
              aria-label="Next photo"
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          )}

          {/* Centered Image Container */}
          <div
            className="relative max-w-6xl w-full h-[75vh] max-h-[750px] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={activeGalleryIndex}
              src={galleryImages[activeGalleryIndex % totalImages]}
              alt={`Office Space in ${sector.includes("Noida") ? sector : `${sector}, Noida`} - ${title} Fullscreen`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}

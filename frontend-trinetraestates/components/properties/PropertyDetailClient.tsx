"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { propertyService } from "@/services/propertyService";
import { BackendOfficeDoc, PropertyCardItem } from "@/types/property";

// ─── Amenity Keyword → FontAwesome Icon Map ───────────────────────────────
// Admin enters plain text amenities (e.g. "24x7 Security", "Power Backup").
// This map resolves the best-matching icon based on keyword matching.
const AMENITY_ICON_MAP: Record<string, string> = {
  // Air Conditioning
  ac: "fa-solid fa-snowflake",
  "air condition": "fa-solid fa-snowflake",
  chill: "fa-solid fa-snowflake",
  hvac: "fa-solid fa-snowflake",
  // Power
  power: "fa-solid fa-bolt",
  "power backup": "fa-solid fa-bolt",
  generator: "fa-solid fa-bolt",
  ups: "fa-solid fa-bolt",
  // Security
  security: "fa-solid fa-shield-halved",
  cctv: "fa-solid fa-video",
  guard: "fa-solid fa-user-shield",
  // Lift / Elevator
  lift: "fa-solid fa-elevator",
  elevator: "fa-solid fa-elevator",
  // Parking
  parking: "fa-solid fa-square-parking",
  // Pantry / Cafeteria
  pantry: "fa-solid fa-mug-saucer",
  cafeteria: "fa-solid fa-mug-saucer",
  tea: "fa-solid fa-mug-saucer",
  coffee: "fa-solid fa-mug-saucer",
  // Fire
  fire: "fa-solid fa-fire-extinguisher",
  // CAM
  cam: "fa-solid fa-screwdriver-wrench",
  maintenance: "fa-solid fa-screwdriver-wrench",
  housekeeping: "fa-solid fa-broom",
  // WiFi / Internet
  wifi: "fa-solid fa-wifi",
  internet: "fa-solid fa-wifi",
  broadband: "fa-solid fa-wifi",
  // Gym / Fitness
  gym: "fa-solid fa-dumbbell",
  fitness: "fa-solid fa-dumbbell",
  // Reception
  reception: "fa-solid fa-concierge-bell",
  lobby: "fa-solid fa-concierge-bell",
  // Meeting / Conference
  meeting: "fa-solid fa-people-roof",
  conference: "fa-solid fa-people-roof",
  boardroom: "fa-solid fa-people-roof",
  // Washroom / Restroom
  washroom: "fa-solid fa-restroom",
  restroom: "fa-solid fa-restroom",
  bathroom: "fa-solid fa-restroom",
  // EV Charging
  ev: "fa-solid fa-charging-station",
  electric: "fa-solid fa-charging-station",
  // Solar
  solar: "fa-solid fa-solar-panel",
  // Rooftop
  rooftop: "fa-solid fa-tower-observation",
  // Warehouse / Storage
  storage: "fa-solid fa-boxes-stacked",
  warehouse: "fa-solid fa-warehouse",
  // Green / Garden
  green: "fa-solid fa-leaf",
  garden: "fa-solid fa-seedling",
  // ATM / Bank
  atm: "fa-solid fa-building-columns",
  bank: "fa-solid fa-building-columns",
  // Food / Restaurant
  food: "fa-solid fa-utensils",
  restaurant: "fa-solid fa-utensils",
  // Retail
  retail: "fa-solid fa-store",
  shop: "fa-solid fa-store",
  // Well maintained / common areas
  common: "fa-solid fa-building-circle-check",
  well: "fa-solid fa-building-circle-check",
  maintained: "fa-solid fa-building-circle-check",
  // IT
  server: "fa-solid fa-server",
  data: "fa-solid fa-server",
  // Default fallback
  default: "fa-solid fa-circle-check",
};

/** Resolve icon for an amenity label string */
function getAmenityIcon(name: string): string {
  const lower = name.toLowerCase();
  for (const [keyword, icon] of Object.entries(AMENITY_ICON_MAP)) {
    if (keyword !== "default" && lower.includes(keyword)) {
      return icon;
    }
  }
  return AMENITY_ICON_MAP.default;
}

/** Default amenities shown when property has no amenities stored in DB */
const DEFAULT_AMENITIES = [
  "Central AC",
  "100% Power Backup",
  "CAM Facility",
  "24x7 Security",
  "High-Speed Elevators",
  "Ample Parking",
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

  const [activeTab, setActiveTab] = useState<
    "overview" | "highlights" | "amenities" | "location"
  >("overview");
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const isScrollingRef = useRef(false);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Tab section IDs mapping
  const TAB_SECTIONS = useMemo(
    () => [
      { id: "overview", elId: "section-overview", label: "Overview" },
      { id: "details", elId: "section-key-details", label: "Key Details & Amenities" },
      { id: "location", elId: "section-location", label: "Location & Connectivity" },
    ],
    [],
  );

  // Scroll to section on tab click
  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTab(tabId as any);
      const section = TAB_SECTIONS.find((s) => s.id === tabId);
      if (section) {
        const el = document.getElementById(section.elId);
        if (el) {
          isScrollingRef.current = true;
          const offset = 130; // account for sticky navbar + tab bar
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 800);
        }
      }
    },
    [TAB_SECTIONS],
  );

  // IntersectionObserver + scroll fallback to update active tab dynamically on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      const scrollPos = window.scrollY + 170;
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

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Backend property data state
  const [propertyData, setPropertyData] = useState<BackendOfficeDoc | null>(
    initialDoc || null,
  );
  const [backendSimilarProps, setBackendSimilarProps] = useState<
    PropertyCardItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(!initialDoc);
  const [notFound, setNotFound] = useState(false);

  // Fetch real property data & similar properties from backend on slug change
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setNotFound(false);

    // 1. Fetch Property Details
    const fetchProperty = propertyService.getPropertyBySlugOrId(slug);

    // 2. Fetch Active Properties for Similar Properties list
    const fetchSimilar = propertyService.getActiveProperties(12);

    Promise.all([fetchProperty, fetchSimilar])
      .then(([doc, activeProps]) => {
        if (!isMounted) return;

        if (doc) {
          setPropertyData(doc);
        } else {
          setNotFound(true);
        }

        // Map backend active properties to similar items (filtering current property & prioritizing same sector)
        if (activeProps && activeProps.length > 0) {
          const currentDocId = doc?._id ? String(doc._id).toLowerCase() : "";
          const currentSlug = (doc?.slug || slug).toLowerCase().trim();
          const currentSector = (
            doc?.location?.sector ||
            doc?.location?.locality ||
            ""
          )
            .toLowerCase()
            .trim();
          const currentType = (doc?.propertyType || "").toLowerCase().trim();

          const candidates = activeProps.filter((p) => {
            const pSlug = (p.slug || "").toLowerCase().trim();
            const pId = String(p.id || "").toLowerCase().trim();
            return (
              pSlug !== currentSlug &&
              pSlug !== slug.toLowerCase().trim() &&
              pId !== currentDocId &&
              pId !== slug.toLowerCase().trim()
            );
          });

          // Sort candidates by relevance:
          // 1. Same Sector (e.g., Sector 62)
          // 2. Same Property Type (e.g., Furnished Offices, Coworking)
          candidates.sort((a, b) => {
            const aSecMatch =
              currentSector && a.sector?.toLowerCase().includes(currentSector)
                ? 1
                : 0;
            const bSecMatch =
              currentSector && b.sector?.toLowerCase().includes(currentSector)
                ? 1
                : 0;
            if (aSecMatch !== bSecMatch) return bSecMatch - aSecMatch;

            const aTypeMatch =
              currentType &&
              a.propertyType?.toLowerCase().includes(currentType)
                ? 1
                : 0;
            const bTypeMatch =
              currentType &&
              b.propertyType?.toLowerCase().includes(currentType)
                ? 1
                : 0;
            return bTypeMatch - aTypeMatch;
          });

          setBackendSimilarProps(candidates.slice(0, 4));
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("[PropertyDetails] Error fetching data:", err);
        if (isMounted) {
          setIsLoading(false);
          setNotFound(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Derived display fields strictly from backend data
  const title = propertyData?.title || "";
  const rawSector =
    propertyData?.location?.sector ||
    propertyData?.location?.locality ||
    propertyData?.location?.address ||
    "";
  const sector = rawSector.trim();
  const locationText = propertyData?.location?.address || sector;
  const buildingName =
    propertyData?.buildingName || title.split(",")[0] || title;
  const areaSqFt = Number(
    propertyData?.areaSqFt ||
      propertyData?.builtUpAreaSqFt ||
      propertyData?.carpetAreaSqFt ||
      0,
  );
  const builtUpAreaSqFt = Number(propertyData?.builtUpAreaSqFt || areaSqFt);
  const carpetAreaSqFt = Number(
    propertyData?.carpetAreaSqFt ||
      (areaSqFt > 0 ? Math.round(areaSqFt * 0.75) : 0),
  );

  // Real DB specs entered by Admin or calculated dynamically
  const workstations =
    propertyData?.workstations && propertyData.workstations > 0
      ? propertyData.workstations
      : areaSqFt > 0
        ? Math.max(4, Math.round(areaSqFt / 65))
        : 10;
  const cabins =
    propertyData?.cabins && propertyData.cabins > 0
      ? propertyData.cabins
      : areaSqFt > 0
        ? Math.max(1, Math.round(areaSqFt / 1200))
        : 1;
  const meetingRooms =
    propertyData?.meetingRooms && propertyData.meetingRooms > 0
      ? propertyData.meetingRooms
      : Math.max(1, Math.floor(cabins / 2));

  const furnishing = propertyData?.furnishing || "Furnished";
  const propertyType = propertyData?.propertyType || "Office Space";
  const statusBadge =
    propertyData?.availabilityStatus || propertyData?.dataAge || "Available";
  const city = (propertyData?.location?.city || "").trim();
  const descriptionText =
    propertyData?.description ||
    `A premium commercial workspace located at ${buildingName}, ${sector}${city ? `, ${city}` : ""}. Equipped with modern infrastructure, high-speed elevators, 100% power backup, and seamless connectivity to metro routes and expressways.`;

  // Gallery images resolution strictly from backend MongoDB images
  const galleryImages = useMemo(() => {
    if (
      propertyData?.images &&
      Array.isArray(propertyData.images) &&
      propertyData.images.length > 0
    ) {
      const extracted = propertyData.images
        .map((img) => (typeof img === "string" ? img : img.url))
        .filter(Boolean);
      if (extracted.length > 0) {
        return extracted;
      }
    }
    if (propertyData?.thumbnail) {
      return [propertyData.thumbnail];
    }
    if (propertyData?.imageUrl) {
      return [propertyData.imageUrl];
    }
    return [];
  }, [propertyData]);

  const totalImages = galleryImages.length;

  // Slide Handlers
  const handleNextImage = useCallback(() => {
    if (totalImages === 0) return;
    setActiveGalleryIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const handlePrevImage = useCallback(() => {
    if (totalImages === 0) return;
    setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1));
  }, [totalImages]);

  // Keyboard navigation for Lightbox & Slider
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNextImage, handlePrevImage]);

  // Similar Properties list (from backend only)
  const similarProps = useMemo(() => {
    return backendSimilarProps;
  }, [backendSimilarProps]);

  return (
    <>
      <Navbar />

      {/* ── LOADING SKELETON ── */}
      {isLoading ? (
        <main className="bg-white text-[#141414] min-h-screen pt-24 sm:pt-28 pb-16 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
            <div className="h-4 bg-gray-100 rounded-md w-72 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-8">
              <div className="lg:col-span-2 h-[350px] bg-gray-100 rounded-2xl" />
              <div className="hidden lg:grid grid-rows-3 gap-3 h-[350px]">
                <div className="bg-gray-100 rounded-2xl" />
                <div className="bg-gray-100 rounded-2xl" />
                <div className="bg-gray-100 rounded-2xl" />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-6">
                <div className="h-24 bg-gray-100 rounded-2xl" />
                <div className="h-48 bg-gray-100 rounded-2xl" />
              </div>
              <div className="lg:col-span-4 h-96 bg-gray-100 rounded-2xl" />
            </div>
          </div>
        </main>
      ) : notFound || !propertyData ? (
        <main className="bg-white text-[#141414] min-h-screen pt-32 pb-16 font-sans flex items-center justify-center">
          <div className="text-center p-8 max-w-md mx-auto space-y-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-[#c69960]/10 rounded-full flex items-center justify-center mx-auto text-[#c69960] text-2xl">
              <i className="fa-solid fa-building-circle-xmark" />
            </div>
            <h2 className="text-2xl font-bold text-[#141414]">
              Property Not Found
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              The requested commercial property could not be found or is no
              longer available.
            </p>
            <Link
              href="/#featured-properties"
              className="inline-block px-6 py-3 bg-[#c69960] hover:bg-[#a87d46] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md"
            >
              Browse All Properties
            </Link>
          </div>
        </main>
      ) : (
        /* Pure Clean White Global Background matching Home Page */
        <main className="bg-white text-[#141414] min-h-screen pt-24 sm:pt-28 pb-16 font-sans">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ── 1. BREADCRUMBS & GALLERY SLIDER CONTROLS (TOP ROW) ── */}
            <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 mb-5 text-xs text-gray-500">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/"
                  className="hover:text-[#c69960] transition-colors flex items-center gap-1.5 font-medium"
                >
                  <i className="fa-solid fa-house text-[11px]" />
                  <span>Home</span>
                </Link>
                <span>/</span>
                <Link
                  href="/#featured-properties"
                  className="hover:text-[#c69960] transition-colors font-medium"
                >
                  Properties
                </Link>
                <span>/</span>
                <span className="text-gray-700 font-medium">
                  {buildingName}
                </span>
                {areaSqFt > 0 && (
                  <>
                    <span>/</span>
                    <span className="text-[#c69960] font-semibold truncate max-w-[200px] sm:max-w-none">
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
                    className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-[#c69960] hover:border-[#c69960] hover:text-white flex items-center justify-center text-gray-700 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Previous Image"
                    aria-label="Previous Image"
                  >
                    <i className="fa-solid fa-chevron-left text-[11px]" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-[#c69960] hover:border-[#c69960] hover:text-white flex items-center justify-center text-gray-700 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Next Image"
                    aria-label="Next Image"
                  >
                    <i className="fa-solid fa-chevron-right text-[11px]" />
                  </button>
                </div>
              )}
            </div>

            {/* ── 2. HERO IMAGE GALLERY (1 LARGE COVER SLIDER + SIDE THUMBNAILS) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 mb-8">
              {/* Main Large Photo (Span 2 cols if side thumbnails exist, else 3 cols full width) */}
              <div
                className={`${totalImages > 1 ? "lg:col-span-2" : "lg:col-span-3"} relative h-[260px] sm:h-[350px] md:h-[400px] lg:h-[415px] rounded-2xl overflow-hidden group bg-gray-900 shadow-sm border border-gray-100 flex items-center justify-center`}
              >
                {totalImages > 0 &&
                galleryImages[activeGalleryIndex % totalImages] ? (
                  <>
                    <Image
                      key={activeGalleryIndex}
                      src={galleryImages[activeGalleryIndex % totalImages]}
                      alt={`${title} - Photo ${activeGalleryIndex + 1}`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-all duration-500 group-hover:scale-105 cursor-pointer animate-in fade-in duration-300"
                      onClick={() => setIsLightboxOpen(true)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                    {/* Exact Photo Count Badge */}
                    <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-md">
                      <i className="fa-regular fa-images text-xs text-[#deb881]" />
                      <span className="font-medium">
                        {activeGalleryIndex + 1}/{totalImages}
                      </span>
                    </div>

                    {/* Expand Fullscreen Button */}
                    <button
                      type="button"
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-black/75 backdrop-blur-md text-white hover:text-[#deb881] flex items-center justify-center border border-white/20 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
                      aria-label="View Fullscreen"
                    >
                      <i className="fa-solid fa-expand text-xs" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400">
                    <i className="fa-regular fa-building text-5xl mb-2 text-zinc-500" />
                    <span className="text-sm font-medium">
                      No Images Uploaded
                    </span>
                  </div>
                )}
              </div>

              {/* Stacked Interactive Thumbnails on Right (Rendered only if multiple images uploaded) */}
              {totalImages > 1 && (
                <div
                  className={`hidden lg:grid ${
                    totalImages === 2
                      ? "grid-rows-1"
                      : totalImages === 3
                        ? "grid-rows-2"
                        : "grid-rows-3"
                  } gap-3 h-[415px]`}
                >
                  {Array.from({ length: Math.min(3, totalImages - 1) }).map(
                    (_, i) => {
                      const offset = i + 1;
                      const targetIdx =
                        (activeGalleryIndex + offset) % totalImages;
                      const thumbUrl = galleryImages[targetIdx];
                      if (!thumbUrl) return null;
                      const isLastThumb = i === 2 && totalImages > 4;
                      const remainingCount = totalImages - 4;

                      return (
                        <div
                          key={offset}
                          className="relative rounded-2xl overflow-hidden group bg-gray-900 cursor-pointer shadow-xs border border-gray-100 hover:border-[#c69960] transition-all duration-200"
                          onClick={() => {
                            if (isLastThumb) {
                              setIsLightboxOpen(true);
                            } else {
                              setActiveGalleryIndex(targetIdx);
                            }
                          }}
                          title={isLastThumb ? `View all ${totalImages} photos` : "Click to view this photo"}
                        >
                          <Image
                            src={thumbUrl}
                            alt={`${title} Preview ${targetIdx + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />

                          {isLastThumb ? (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white group-hover:bg-black/70 transition-all">
                              <i className="fa-solid fa-images text-lg text-[#deb881] mb-1" />
                              <span className="text-xs font-bold tracking-wide">
                                +{remainingCount} More
                              </span>
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-[#c69960]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="bg-black/70 text-white text-[10px] font-medium px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1">
                                <i className="fa-solid fa-eye text-[9px] text-[#deb881]" />
                                <span>View</span>
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>

            {/* ── 3. MAIN CONTENT GRID WITH STICKY SIDEBAR ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ── LEFT COLUMN: DETAILS, METRICS, TABS & SECTIONS (8 Cols) ── */}
              <div className="lg:col-span-8 space-y-8">
                {/* ── HEADER TITLE, SUB-INFO ROW & DESCRIPTION (MATCHING SCREENSHOT 2) ── */}
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3.5">
                  <h1
                    className="font-semibold text-[#141414] tracking-tight"
                    style={{
                      fontSize: "clamp(1.45rem, 2.2vw, 1.75rem)",
                      lineHeight: "1.25",
                      fontWeight: 600,
                    }}
                  >
                    {title.toLowerCase().includes(sector.toLowerCase())
                      ? title
                      : `${title}, ${sector}, Noida`}
                  </h1>

                  {/* Sub-info Row with Clean Divider Pipes */}
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap text-xs sm:text-[13px] text-gray-600 font-medium pt-0.5">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <i className="fa-solid fa-location-dot text-[#c69960] text-sm shrink-0" />
                      <span>
                        {locationText}
                        {!locationText.toLowerCase().includes("noida") && ", Noida"}
                        {!locationText.toLowerCase().includes("uttar pradesh") && ", Uttar Pradesh"}
                      </span>
                    </div>

                    <span className="text-gray-300 font-light hidden sm:inline">|</span>

                    <div className="flex items-center gap-1.5 text-gray-700">
                      <i className="fa-solid fa-building text-[#c69960] text-sm shrink-0" />
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

                {/* ── STICKY NAVIGATION TAB BAR (MATCHING SCREENSHOT 1) ── */}
                <div
                  ref={tabBarRef}
                  className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-gray-200"
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
                              ? "text-[#141414]"
                              : "text-gray-500 hover:text-[#141414]"
                          }`}
                        >
                          <span>{tab.label}</span>
                          {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#c69960] rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ── SECTION 1: OVERVIEW (MATCHING SCREENSHOT 1 & 2) ── */}
                <section
                  id="section-overview"
                  className="bg-white p-5 sm:p-7 rounded-2xl border border-gray-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-7"
                >
                  {/* Two-Column Intro: Left Narrative + Right Mini Image Carousel */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-7 items-center">
                    <div className="md:col-span-7 space-y-2.5">
                      <h2
                        className="font-bold text-[#141414] tracking-tight"
                        style={{
                          fontSize: "clamp(1.1rem, 1.45vw, 1.28rem)",
                          lineHeight: "1.35",
                          fontWeight: 700,
                        }}
                      >
                        {propertyData?.overviewHeading ||
                          `A Premium Workspace in the Heart of ${sector ? `${sector}, Noida` : "Noida"}'s Business Hub`}
                      </h2>
                      {propertyData?.overviewDescription ? (
                        <div className="text-gray-600 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line space-y-2">
                          {propertyData.overviewDescription}
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed">
                            Located in the iconic {buildingName}, this office space offers a modern, functional design suitable for businesses of all sizes. The tower is known for its premium infrastructure, excellent connectivity, and vibrant business ecosystem.
                          </p>
                          <p className="text-gray-600 text-xs sm:text-[13px] leading-relaxed">
                            With a thoughtfully designed layout, natural light, and access to top-notch facilities, this space provides a professional environment to help your business grow.
                          </p>
                        </>
                      )}
                    </div>

                    {/* Right Mini Image Slider with Arrow Navigation Buttons */}
                    <div className="md:col-span-5 relative h-48 sm:h-52 md:h-56 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs group">
                      {galleryImages.length > 0 ? (
                        <>
                          <Image
                            src={galleryImages[activeGalleryIndex % totalImages] || galleryImages[0]}
                            alt={title}
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
                          <i className="fa-regular fa-building text-3xl mb-1 text-[#c69960]" />
                          <span className="text-xs">Office Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              </div>

              {/* ── RIGHT STICKY SIDEBAR: GLOBAL ENQUIRY FORM (4 Cols) ── */}
              <div className="lg:col-span-4 sticky top-[80px]">
                <div
                  id="enquiry-form-card"
                  className="bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden"
                >
                  <div className="p-4 sm:p-5">
                    <EnquiryForm
                      defaultSector={sector}
                      propertyName={title}
                      propertySlug={slug}
                      compact
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── FULL-WIDTH SECTION: KEY DETAILS & AMENITIES (MATCHING REFERENCE SCREENSHOT) ── */}
            <div
              id="section-key-details"
              className="mt-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-7"
            >
              {/* Key Details Grid (2 Rows x 4 Columns = 8 Items Matching Reference) */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#141414] mb-6">
                  Key Details
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-7 gap-x-6 sm:gap-x-8 pb-7 sm:pb-8 border-b border-gray-100">
                  {/* 1. Property Type */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className="fa-solid fa-building-circle-check text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        Property Type
                      </span>
                      <strong className="text-xs sm:text-sm text-[#141414] font-bold block mt-0.5 leading-snug">
                        {propertyType}
                      </strong>
                    </div>
                  </div>

                  {/* 2. Building */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className="fa-solid fa-building text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        Building
                      </span>
                      <strong className="text-xs sm:text-sm text-[#141414] font-bold block mt-0.5 leading-snug">
                        {buildingName}
                      </strong>
                    </div>
                  </div>

                  {/* 3. Location */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className="fa-solid fa-location-dot text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        Location
                      </span>
                      <strong className="text-xs sm:text-sm text-[#141414] font-bold block mt-0.5 leading-snug">
                        {sector ? `${sector}, Noida` : "Sector 62, Noida"}
                      </strong>
                    </div>
                  </div>

                  {/* 4. Total Area */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className="fa-solid fa-vector-square text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        Total Area
                      </span>
                      <strong className="text-xs sm:text-sm text-[#141414] font-bold block mt-0.5 leading-snug">
                        {areaSqFt > 0 ? `${areaSqFt.toLocaleString("en-IN")} Sq. Ft.` : "513 Sq. Ft."}
                      </strong>
                    </div>
                  </div>

                  {/* 5. Workstations */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className="fa-solid fa-users text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        Workstations
                      </span>
                      <strong className="text-xs sm:text-sm text-[#141414] font-bold block mt-0.5 leading-snug">
                        {workstations}
                      </strong>
                    </div>
                  </div>

                  {/* 6. Cabin */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className="fa-regular fa-id-badge text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        Cabin
                      </span>
                      <strong className="text-xs sm:text-sm text-[#141414] font-bold block mt-0.5 leading-snug">
                        {cabins} {cabins === 1 ? "Private Cabin" : "Private Cabins"}
                      </strong>
                    </div>
                  </div>

                  {/* 7. Pantry */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className="fa-solid fa-mug-saucer text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        Pantry
                      </span>
                      <strong className="text-xs sm:text-sm text-[#141414] font-bold block mt-0.5 leading-snug">
                        {propertyData?.pantry || "1 Pantry"}
                      </strong>
                    </div>
                  </div>

                  {/* 8. Furnishing */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#fdfaf5] border border-[#f5ecde] flex items-center justify-center text-[#c69960] shrink-0">
                      <i className="fa-solid fa-couch text-base" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] sm:text-xs text-gray-500 font-medium block">
                        Furnishing
                      </span>
                      <strong className="text-xs sm:text-sm text-[#141414] font-bold block mt-0.5 leading-snug">
                        {furnishing}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities & Facilities — Dynamic from Backend */}
              <div className="pt-1">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg sm:text-xl font-bold text-[#141414]">
                    Amenities &amp; Facilities
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("enquiry-form-card");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-xs sm:text-[13px] font-semibold text-[#c69960] hover:text-[#a87d46] transition-colors inline-flex items-center gap-1.5 cursor-pointer underline-offset-4 hover:underline"
                  >
                    <span>Enquire Now</span>
                    <i className="fa-solid fa-arrow-right text-[10px]" />
                  </button>
                </div>

                {/* Resolve amenities: use backend data, fallback to defaults */}
                {(() => {
                  const rawAmenities =
                    propertyData?.amenities &&
                    Array.isArray(propertyData.amenities) &&
                    propertyData.amenities.length > 0
                      ? propertyData.amenities
                      : DEFAULT_AMENITIES;

                  return (
                    <div
                      className={`grid gap-3 sm:gap-3.5 ${
                        rawAmenities.length <= 4
                          ? "grid-cols-2 sm:grid-cols-4"
                          : rawAmenities.length <= 6
                          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                          : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"
                      }`}
                    >
                      {rawAmenities.map((amenityName, idx) => {
                        const icon = getAmenityIcon(amenityName);
                        return (
                          <div
                            key={idx}
                            className="p-4 sm:p-5 rounded-2xl border border-[#edf0f5] bg-white hover:border-[#c69960]/50 hover:shadow-sm transition-all flex flex-col items-center justify-center text-center group"
                          >
                            <div className="text-[#c69960] mb-3 group-hover:scale-110 transition-transform">
                              <i className={`${icon} text-2xl`} />
                            </div>
                            <span className="text-[11.5px] sm:text-xs font-semibold text-gray-800 leading-tight block">
                              {amenityName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* ── FULL-WIDTH SECTION: LOCATION & CONNECTIVITY (3 EQUAL COLUMNS) ── */}
            <div
              id="section-location"
              className="mt-12 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {/* 1. Left Column: Description & Checkmarks */}
                <div className="flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#141414] pb-2">
                      Location &amp; Connectivity
                    </h3>
                    <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
                      {propertyData?.locationDescription ||
                        `${buildingName} is one of Noida's most sought-after commercial destinations, offering excellent metro and road connectivity, and proximity to major business hubs, corporate offices, and lifestyle amenities.`}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5">
                      <i className="fa-solid fa-circle-check text-[#c69960] text-sm mt-0.5 shrink-0" />
                      <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                        Located in {sector ? `${sector}, Noida` : "Noida"}
                      </span>
                    </div>

                    {/* Dynamic Connectivity Highlights (or fallback to metro/road/surroundings) */}
                    {Array.isArray(propertyData?.connectivityHighlights) &&
                    propertyData.connectivityHighlights.filter(Boolean).length > 0 ? (
                      propertyData.connectivityHighlights.filter(Boolean).map((pt: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <i className="fa-solid fa-circle-check text-[#c69960] text-sm mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                            {pt}
                          </span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-start gap-2.5">
                          <i className="fa-solid fa-circle-check text-[#c69960] text-sm mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                            {propertyData?.metroDistance || "Close to Noida Metro Station"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <i className="fa-solid fa-circle-check text-[#c69960] text-sm mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                            {propertyData?.roadConnectivity || "Easy access to NH-24 and DND Expressway"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <i className="fa-solid fa-circle-check text-[#c69960] text-sm mt-0.5 shrink-0" />
                          <span className="text-xs sm:text-[13px] text-gray-700 leading-snug">
                            Surrounded by corporate offices, cafes and retail outlets
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Middle Column: Interactive Map Card */}
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
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${buildingName}, ${sector}, Noida`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c69960] hover:text-[#a87d46] font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>View on Google Maps</span>
                      <i className="fa-solid fa-arrow-right text-[9px]" />
                    </a>
                  </div>
                </div>

                {/* 3. Right Column: Nearby Places List */}
                <div className="flex flex-col justify-between space-y-3">
                  <h4 className="text-lg font-bold text-[#141414] pb-1">
                    Nearby Places
                  </h4>

                  <div className="space-y-3 divide-y divide-gray-100/80">
                    {(
                      Array.isArray(propertyData?.nearbyPlaces) &&
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
                    ).map((place: any, i: number) => {
                      // Smart icon mapper if not provided
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
                          <span className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#c69960]/10 flex items-center justify-center shrink-0">
                              <i
                                className={`${iconClass} text-[#c69960] text-xs`}
                              />
                            </div>
                            <span className="text-xs sm:text-[13px] text-gray-700 font-medium truncate">
                              {place.label}
                            </span>
                          </span>
                          <span className="text-xs sm:text-[13px] text-gray-500 font-medium shrink-0 ml-2">
                            {place.time}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── 4. TALK TO EXPERTS BANNER ── */}
            <div className="mt-12 rounded-2xl overflow-hidden relative p-8 sm:p-10 shadow-lg border border-black/20 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Background Image with Balanced Overlay */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/card-cta/card-cta.png"
                  alt="Find Office Space"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
              </div>

              <div className="space-y-2 text-center md:text-left relative z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                <span className="text-[11px] font-bold tracking-[0.18em] text-[#deb881] uppercase block">
                  LOOKING FOR A SIMILAR SPACE?
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Let our experts help you find the right office space.
                </h3>
                <p
                  className="text-xs sm:text-sm text-white font-medium max-w-xl leading-relaxed"
                  style={{ color: "#ffffff", opacity: 1 }}
                >
                  Get personalized options as per your business needs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("enquiry-form-card");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="relative z-10 px-6 py-3.5 bg-[#c69960] hover:bg-[#deb881] text-[#141414] font-bold text-xs sm:text-sm rounded-xl transition-all duration-300 shadow-md hover:scale-105 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <span>Talk to Our Expert</span>
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>

            {/* ── 5. SIMILAR PROPERTIES YOU MIGHT LIKE (FROM REAL BACKEND ONLY) ── */}
            {similarProps.length > 0 && (
              <div className="mt-14 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#141414]">
                    Similar Properties You Might Like
                  </h3>
                  <Link
                    href="/#featured-properties"
                    className="text-xs sm:text-[13px] font-semibold text-[#c69960] hover:text-[#a87d46] transition-colors flex items-center gap-1.5"
                  >
                    <span>View All Properties</span>
                    <i className="fa-solid fa-arrow-right text-[10px]" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                  {similarProps.map((simProp) => (
                    <div
                      key={simProp.id}
                      onClick={() => router.push(`/properties/${simProp.slug}`)}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-200/90 hover:border-[#c69960]/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                    >
                      {/* Clean Widescreen Image Container without overlay badges */}
                      <div className="relative aspect-[16/10] w-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {simProp.image ? (
                          <Image
                            src={simProp.image}
                            alt={simProp.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <i className="fa-regular fa-building text-2xl mb-1" />
                            <span className="text-[10px]">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Compact Info Footer */}
                      <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2.5">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-xs sm:text-[13.5px] text-[#141414] group-hover:text-[#c69960] transition-colors leading-tight truncate">
                            {simProp.sector
                              ? `${simProp.sector}, Noida`
                              : simProp.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate mt-0.5 font-normal">
                            {simProp.title}
                          </p>
                        </div>

                        {/* Circular Gold Button matching reference */}
                        <div className="w-8 h-8 rounded-full bg-[#c69960] group-hover:bg-[#a87d46] text-white flex items-center justify-center text-xs transition-all shrink-0 shadow-xs group-hover:scale-105">
                          <i className="fa-solid fa-arrow-right text-[11px]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      )}

      {/* ── HIGH-Z-INDEX LIGHTBOX MODAL WITH FLOATING CONTROLS & CLOSE BUTTON ── */}
      {isLightboxOpen && totalImages > 0 && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Info Pill */}
          <div className="fixed top-6 left-6 z-[100000] bg-black/60 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full border border-white/20">
            <span>
              Photo {activeGalleryIndex + 1} of {totalImages}
            </span>
          </div>

          {/* High-Visibility Floating Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="fixed top-5 right-5 z-[100000] w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-xl transition-all duration-200 cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
            aria-label="Close Lightbox"
            title="Close Lightbox"
          >
            <i className="fa-solid fa-xmark" />
          </button>

          {/* Floating Prev Button in Lightbox */}
          {totalImages > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100000] w-12 h-12 rounded-full bg-black/60 hover:bg-[#c69960] text-white flex items-center justify-center text-base transition-all duration-200 cursor-pointer shadow-xl hover:scale-105 active:scale-95 border border-white/20"
              aria-label="Previous image"
              title="Previous image"
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
          )}

          {/* Floating Next Button in Lightbox */}
          {totalImages > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100000] w-12 h-12 rounded-full bg-black/60 hover:bg-[#c69960] text-white flex items-center justify-center text-base transition-all duration-200 cursor-pointer shadow-xl hover:scale-105 active:scale-95 border border-white/20"
              aria-label="Next image"
              title="Next image"
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
              alt={`${title} Fullscreen`}
              fill
              className="object-contain animate-in zoom-in-95 duration-200"
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

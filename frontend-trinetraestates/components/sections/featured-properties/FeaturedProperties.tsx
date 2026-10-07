"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EnquiryModal from "@/components/modals/EnquiryModal";
import { propertyService } from "@/services/propertyService";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FEATURED PROPERTIES - TYPES & INTERFACES (LIVE MONGODB DATA ONLY)
 * ─────────────────────────────────────────────────────────────────────────────
 */
export interface PropertyItem {
  id: string;
  slug: string;
  title: string;
  location: string;
  sector: string;
  badge?: "FEATURED" | "READY TO MOVE" | "HOT LISTING" | "PREMIUM" | string;
  areaSqFt: string;
  workstations: string;
  cabins: string;
  amenity: string;
  amenityIcon: string;
  image: string;
  category:
    | "Furnished Offices"
    | "Unfurnished Offices"
    | "Coworking Spaces"
    | "Managed Offices"
    | "Retail Spaces"
    | string;
  categories?: string[];
  price?: string;
  priceOnRequest?: boolean;
  isVerified?: boolean;
}

export interface FeaturedPropertiesProps {
  initialProperties?: PropertyItem[];
}


/**
 * ─────────────────────────────────────────────────────────────────────────────
 * COMPONENT: FeaturedProperties
 * ─────────────────────────────────────────────────────────────────────────────
 * SEAMLESS INFINITE LOOP SLIDER:
 *  - Clones V cards at the start & end of the track
 *  - When sliding past the clone boundary, silently resets position
 *  - Creates a truly continuous, never-stopping carousel
 *  - Desktop: 4 visible | Tablet: 2 | Mobile: 1
 */
export default function FeaturedProperties({
  initialProperties = [],
}: FeaturedPropertiesProps) {
  const router = useRouter();
  const [propertiesList, setPropertiesList] = useState<PropertyItem[]>(initialProperties);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    "All Properties"
  );
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [visibleCards, setVisibleCards] = useState(4);
  const [slideIndex, setSlideIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const isAnimatingRef = useRef(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch real backend MongoDB properties when mounted
  useEffect(() => {
    let isMounted = true;
    propertyService
      .getActiveProperties(50)
      .then((backendCards) => {
        if (!isMounted) return;
        if (backendCards && backendCards.length > 0) {
          const mapped: PropertyItem[] = backendCards.map((b) => ({
            id: String(b.id),
            slug: b.slug,
            title: b.title,
            location: b.location,
            sector: b.sector,
            badge: b.badge,
            areaSqFt: b.area ? String(b.area).replace(/\s*Sq\.\s*Ft\./i, "") : "0",
            workstations: b.workstations ? String(b.workstations).replace(/\s*Workstations/i, "") : "0",
            cabins: b.cabins || "1 Cabin",
            amenity: b.meetingRooms || "1 Meeting Room",
            amenityIcon: "fa-solid fa-users-rectangle",
            image: b.image,
            category: b.propertyType || "Furnished Offices",
            categories: b.categories || [b.propertyType || "Furnished Offices", "All Properties"],
            price: b.price || "Price on Request",
            priceOnRequest: b.priceOnRequest,
            isVerified: true,
          }));
          setPropertiesList(mapped);
        } else {
          setPropertiesList([]);
        }
      })
      .catch((err) => {
        console.warn("[FeaturedProperties] Error loading backend properties:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── MODAL POPUP STATE (FOR EXPLORE ALL CTA ONLY) ───
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProp, setSelectedProp] = useState<PropertyItem | null>(null);

  const handleOpenPropertyEnquiry = (property?: PropertyItem) => {
    if (property) {
      setSelectedProp(property);
    } else {
      setSelectedProp(null);
    }
    setIsModalOpen(true);
  };

  // ─── DYNAMIC DATA-DRIVEN CATEGORIES ───
  // Automatically derives tabs from live active properties while maintaining luxury default ordering
  const DEFAULT_CATEGORIES = [
    "All Properties",
    "Furnished Offices",
    "Unfurnished Offices",
    "Coworking Spaces",
    "Managed Offices",
    "Retail Spaces",
  ];

  const dynamicCategories = useMemo(() => {
    if (!propertiesList || propertiesList.length === 0) {
      return DEFAULT_CATEGORIES;
    }

    const set = new Set<string>();
    propertiesList.forEach((property) => {
      if (property.category && property.category.trim() !== "" && property.category !== "All Properties") {
        set.add(property.category.trim());
      }
      if (property.categories && Array.isArray(property.categories)) {
        property.categories.forEach((c) => {
          if (c && c.trim() !== "" && c !== "All Properties") {
            set.add(c.trim());
          }
        });
      }
    });

    if (set.size === 0) {
      return DEFAULT_CATEGORIES;
    }

    // Preserve priority order for standard tabs, followed by any new custom tabs added by Admin
    const sortedCategories: string[] = ["All Properties"];
    DEFAULT_CATEGORIES.slice(1).forEach((cat) => {
      if (set.has(cat)) {
        sortedCategories.push(cat);
        set.delete(cat);
      }
    });

    // Append any newly created custom categories dynamically
    set.forEach((customCat) => {
      sortedCategories.push(customCat);
    });

    return sortedCategories;
  }, [propertiesList]);

  // Keep selectedCategory valid if categories change
  useEffect(() => {
    if (!dynamicCategories.includes(selectedCategory)) {
      setSelectedCategory("All Properties");
    }
  }, [dynamicCategories, selectedCategory]);

  // Listen for custom filter event from Hero search section
  useEffect(() => {
    const handleFilterEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.category && detail.category !== "All Property Types") {
        const match = dynamicCategories.find(
          (c) => c.toLowerCase() === detail.category.toLowerCase()
        );
        if (match) {
          setSelectedCategory(match);
        }
      }
    };
    window.addEventListener("trinetra:filter", handleFilterEvent);
    return () => window.removeEventListener("trinetra:filter", handleFilterEvent);
  }, [dynamicCategories]);

  // ─── FILTER REAL BACKEND PROPERTIES BY CATEGORY ───
  const filteredProperties = useMemo(() => {
    if (selectedCategory === "All Properties") return propertiesList;
    return propertiesList.filter((property) => {
      if (property.categories && Array.isArray(property.categories)) {
        if (property.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())) {
          return true;
        }
      }
      const propCat = (property.category || "").toLowerCase();
      const selected = selectedCategory.toLowerCase();
      return propCat === selected || propCat.includes(selected);
    });
  }, [propertiesList, selectedCategory]);

  const N = filteredProperties.length; // total original cards
  const needsLoop = N > visibleCards;
  const offsetStart = needsLoop ? visibleCards : 0;

  // ─── EXTENDED ARRAY: [clone-last-V] + [originals] + [clone-first-V] ───
  const extendedProperties = useMemo(() => {
    if (!needsLoop) return filteredProperties;
    return [
      ...filteredProperties.slice(-visibleCards),
      ...filteredProperties,
      ...filteredProperties.slice(0, visibleCards),
    ];
  }, [filteredProperties, visibleCards, needsLoop]);

  // ─── RESPONSIVE VISIBLE CARDS ───
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCards(4);
      else if (w >= 768) setVisibleCards(2);
      else setVisibleCards(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // ─── RESET on category change or visible cards change ───
  useEffect(() => {
    isAnimatingRef.current = false;
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    setEnableTransition(false);
    setSlideIndex(needsLoop ? visibleCards : 0);

    const timer = setTimeout(() => {
      setEnableTransition(true);
    }, 60);
    return () => clearTimeout(timer);
  }, [selectedCategory, visibleCards, needsLoop]);

  // ─── CLEANUP ON UNMOUNT ───
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    };
  }, []);

  // ─── TOGGLE WISHLIST ───
  const toggleWishlist = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setWishlist((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    },
    []
  );

  // ─── TRANSITION END: SILENT TELEPORT WITH SYNCHRONIZED UNLOCK ───
  const TRANSITION_DURATION = 350;

  const handleTransitionEnd = useCallback(() => {
    if (!needsLoop) {
      isAnimatingRef.current = false;
      return;
    }

    if (slideIndex >= N + visibleCards) {
      setEnableTransition(false);
      const target = slideIndex - N;
      setSlideIndex(target);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
          isAnimatingRef.current = false;
        });
      });
    } else if (slideIndex < visibleCards) {
      setEnableTransition(false);
      const target = slideIndex + N;
      setSlideIndex(target);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setEnableTransition(true);
          if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
          isAnimatingRef.current = false;
        });
      });
    } else {
      if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
      isAnimatingRef.current = false;
    }
  }, [slideIndex, N, visibleCards, needsLoop]);

  // ─── SLIDE NAVIGATION WITH STRICT LOCK & SAFE BOUNDARY GUARD ───
  const slideLeft = useCallback(() => {
    if (isAnimatingRef.current) return;

    if (!needsLoop) {
      setSlideIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    // Boundary protection: never advance past clone limit before teleport
    if (slideIndex <= 0) return;

    isAnimatingRef.current = true;
    setSlideIndex((prev) => prev - 1);

    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
    }, TRANSITION_DURATION + 40);
  }, [needsLoop, slideIndex]);

  const slideRight = useCallback(() => {
    if (isAnimatingRef.current) return;

    if (!needsLoop) {
      setSlideIndex((prev) => Math.min(prev + 1, Math.max(0, N - visibleCards)));
      return;
    }

    // Boundary protection: never advance past clone limit before teleport
    if (slideIndex >= N + visibleCards) return;

    isAnimatingRef.current = true;
    setSlideIndex((prev) => prev + 1);

    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      isAnimatingRef.current = false;
    }, TRANSITION_DURATION + 40);
  }, [needsLoop, N, visibleCards, slideIndex]);

  // ─── MOBILE TOUCH SWIPE SUPPORT ───
  const touchStartXRef = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    touchStartXRef.current = null;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        slideRight();
      } else {
        slideLeft();
      }
    }
  };

  // ─── SAFE VISUAL INDEX ───
  const safeSlideIndex = needsLoop
    ? slideIndex
    : Math.max(0, Math.min(slideIndex, Math.max(0, N - visibleCards)));

  const GAP_PX = 20;

  return (
    <>
      <section
        id="featured-properties"
        className="w-full bg-white section-padding font-sans"
      >
        <div className="site-container">
          {/* ── HEADER ROW (MATCHING SCREENSHOT 1) ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="inline-block w-8 h-[2px] bg-[#c69960]" />
                <span className="text-[#c69960] uppercase tracking-[0.25em] text-xs font-semibold">
                  FEATURED PROPERTIES
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-[#141414] tracking-tight leading-[1.15]">
                Premium Office Spaces
                <span className="block text-[#c69960]">Across Noida</span>
              </h2>
            </div>

            {/* Right Tagline with Left Border Divider */}
            <div className="hidden md:flex items-center shrink-0">
              <div className="border-l border-gray-300/80 pl-4 py-1">
                <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#787878] uppercase leading-[1.6]">
                  WORKSPACES<br />
                  FOR A BRIGHTER<br />
                  TOMORROW
                </p>
              </div>
            </div>
          </div>

          {/* ── FILTER TABS & DESKTOP CONTROLS ROW (MATCHING SCREENSHOT 1) ── */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
            {/* Category Filter Tabs — Dynamic & Scroll-Safe on All Screen Sizes */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none flex-nowrap min-w-0 flex-1 scroll-smooth"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {dynamicCategories.map((tab) => {
                const isActive = selectedCategory === tab;
                return (
                  <button
                    key={tab}
                    onClick={(e) => {
                      setSelectedCategory(tab);
                      try {
                        e.currentTarget.scrollIntoView({
                          behavior: "smooth",
                          block: "nearest",
                          inline: "center",
                        });
                      } catch (_) {}
                    }}
                    className={`flex-shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-[13px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? "bg-[#c69960] text-white shadow-sm"
                        : "bg-[#f4f3f0] text-[#555555] hover:bg-[#eae8e3] hover:text-[#141414]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Desktop Carousel Controls */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <button
                onClick={slideLeft}
                disabled={!needsLoop}
                aria-label="Previous Properties"
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 shadow-xs ${
                  !needsLoop
                    ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
                    : "border-gray-200/90 bg-white text-gray-700 hover:text-[#c69960] hover:border-[#c69960] cursor-pointer active:scale-95"
                }`}
              >
                <i className="fa-solid fa-arrow-left text-xs" />
              </button>
              <button
                onClick={slideRight}
                disabled={!needsLoop}
                aria-label="Next Properties"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 shadow-md ${
                  !needsLoop
                    ? "bg-[#c69960]/30 text-white/50 cursor-not-allowed"
                    : "bg-[#c69960] text-white hover:bg-[#b3874f] cursor-pointer active:scale-95 shadow-[#c69960]/25"
                }`}
              >
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>
          </div>

          {/* ── SLIDER VIEWPORT ── */}
          <div
            className="overflow-hidden -mt-3 -mb-3 pt-3 pb-3 px-1 -mx-1 touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {extendedProperties.length > 0 ? (
              <div
                className="flex"
                onTransitionEnd={handleTransitionEnd}
                style={{
                  gap: `${GAP_PX}px`,
                  transition: enableTransition
                    ? "transform 350ms cubic-bezier(0.25, 1, 0.5, 1)"
                    : "none",
                  transform: `translateX(calc(-${safeSlideIndex} * (calc((100% - ${
                    (visibleCards - 1) * GAP_PX
                  }px) / ${visibleCards}) + ${GAP_PX}px)))`,
                }}
              >
                {extendedProperties.map((prop, index) => {
                  const isFav = !!wishlist[prop.id];

                  return (
                    <div
                      key={`card-${index}`}
                      onClick={() => {
                        if (prop.slug) {
                          router.push(`/properties/${prop.slug}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${prop.title}`}
                      className="group flex-shrink-0 rounded-[18px] bg-[#1a1816] border border-[#2e2a25] hover:border-[#c69960]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)] hover:-translate-y-1 transform-gpu cursor-pointer select-none"
                      style={{
                        width: `calc((100% - ${
                          (visibleCards - 1) * GAP_PX
                        }px) / ${visibleCards})`,
                      }}
                    >
                      {/* Top Image Container with Exact Cover Image */}
                      <div className="relative w-full h-40 sm:h-44 bg-[#23201c] overflow-hidden -mb-px flex items-center justify-center">
                        {prop.image ? (
                          <Image
                            src={prop.image}
                            alt={prop.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-zinc-600">
                            <i className="fa-regular fa-building text-3xl mb-1" />
                            <span className="text-[10px] uppercase font-mono">No Image</span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1816] via-[#1a1816]/20 to-transparent pointer-events-none" />

                        {prop.badge && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="inline-block bg-[#deb881] text-[#1c160c] font-semibold text-[9.5px] tracking-wider uppercase px-2.5 py-0.5 rounded-full shadow-md font-sans">
                              {prop.badge}
                            </span>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prop.id, e);
                          }}
                          aria-label="Add to Wishlist"
                          className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/95 hover:bg-white text-zinc-700 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md active:scale-90"
                        >
                          <i
                            className={`${
                              isFav
                                ? "fa-solid fa-heart text-red-500"
                                : "fa-regular fa-heart text-zinc-700 hover:text-red-500"
                            } text-[11px] transition-colors`}
                          />
                        </button>
                      </div>

                      {/* Card Content */}
                      <div className="relative z-10 bg-[#1a1816] p-3 sm:p-3.5 flex flex-col flex-grow justify-between">
                        <div>
                          {/* Ultra-Luxury Compact Lightweight Card Title */}
                          <div
                            className="font-sans text-white/95 group-hover:text-[#c69960] transition-colors leading-snug truncate"
                            style={{
                              fontSize: "13px",
                              fontWeight: 500,
                              lineHeight: "1.35",
                              letterSpacing: "0.01em",
                            }}
                          >
                            {prop.title}
                          </div>

                          <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] text-zinc-400 font-sans mt-0.5">
                            <span className="text-zinc-600">—</span>
                            <i className="fa-solid fa-location-dot text-[#c69960] text-[9px]" />
                            <span className="truncate">{prop.location}</span>
                          </div>

                          {/* Specs Grid */}
                          <div className="grid grid-cols-2 gap-x-2 gap-y-2 my-2.5 pt-2.5 border-t border-white/[0.08]">
                            <div className="flex items-center gap-1.5">
                              <i className="fa-solid fa-vector-square text-[#c69960] text-[11px] shrink-0 w-3.5 text-center" />
                              <div className="text-[11px] leading-tight">
                                <span className="text-white font-medium block">
                                  {prop.areaSqFt}
                                </span>
                                <span className="text-zinc-400 text-[9.5px]">
                                  Sq. Ft.
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <i className="fa-solid fa-users text-[#c69960] text-[11px] shrink-0 w-3.5 text-center" />
                              <div className="text-[11px] leading-tight">
                                <span className="text-white font-medium block">
                                  {prop.workstations}
                                </span>
                                <span className="text-zinc-400 text-[9.5px]">
                                  Workstations
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <i className="fa-solid fa-door-open text-[#c69960] text-[11px] shrink-0 w-3.5 text-center" />
                              <div className="text-[11px] leading-tight text-white font-medium">
                                {prop.cabins}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <i
                                className={`${prop.amenityIcon} text-[#c69960] text-[11px] shrink-0 w-3.5 text-center`}
                              />
                              <div className="text-[11px] leading-tight text-white font-medium truncate">
                                {prop.amenity}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between mt-auto">
                          <span className="text-[11px] font-medium text-zinc-300 group-hover:text-white transition-colors">
                            View Details
                          </span>

                          <div
                            aria-label={`View details for ${prop.title}`}
                            className="w-6.5 h-6.5 rounded-full border border-white/20 group-hover:border-[#c69960] group-hover:bg-[#c69960] text-zinc-300 group-hover:text-white flex items-center justify-center transition-colors duration-200"
                          >
                            <i className="fa-solid fa-arrow-right text-[9.5px]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#c69960]/10 flex items-center justify-center text-[#c69960] mb-3">
                  <i className="fa-regular fa-building text-xl" />
                </div>
                <h4 className="text-gray-800 text-sm font-semibold">No properties found in {selectedCategory}</h4>
                <p className="text-gray-500 text-xs mt-1">Properties in this category will appear here once added in the admin panel.</p>
              </div>
            )}
          </div>

          {/* ── MOBILE CONTROLS ── */}
          {needsLoop && (
            <div className="flex sm:hidden items-center justify-center gap-3 mt-4">
              <button
                onClick={slideLeft}
                disabled={!needsLoop}
                aria-label="Previous"
                className="w-9 h-9 rounded-full border border-black/15 bg-white text-[#4a4a4a] hover:text-[#b58b53] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-arrow-left text-xs" />
              </button>

              {/* Dot Indicators — one per original card */}
              <div className="flex items-center gap-1.5">
                {filteredProperties.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (isAnimatingRef.current) return;
                      setSlideIndex(offsetStart + i);
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      safeSlideIndex - offsetStart === i
                        ? "w-6 bg-[#b58b53]"
                        : "w-2 bg-black/15"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={slideRight}
                disabled={!needsLoop}
                aria-label="Next"
                className="w-9 h-9 rounded-full bg-[#b58b53] text-white hover:bg-[#a07742] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-arrow-right text-xs" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Enquiry Modal */}
      {isModalOpen && (
        <EnquiryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyName={selectedProp ? selectedProp.title : "Featured Properties Enquiry"}
        />
      )}
    </>
  );
}

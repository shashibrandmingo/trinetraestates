"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import EnquiryModal from "@/components/modals/EnquiryModal";
import { propertyService } from "@/services/propertyService";
import { PropertyCardItem } from "@/types/property";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * WORKSPACE CATEGORIES - INTERFACES (API & BACKEND PRODUCTION READY)
 * ─────────────────────────────────────────────────────────────────────────────
 */
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

export interface WorkspaceCategory {
  id: string;
  slug: string;
  title: string;
  seatRange: string;
  description: string;
  image: string;
  spacesCount: string;
  properties: CategoryPropertyItem[];
}

export interface WorkspaceCategoriesProps {
  initialCategories?: WorkspaceCategory[];
}

/**
 * Verified Default Categories & Properties Dataset
 * Clean, modern corporate & luxury workspace photography
 */
const DEFAULT_CATEGORIES: WorkspaceCategory[] = [
  {
    id: "cat-startup",
    slug: "startup-office",
    title: "Startup Office",
    seatRange: "1 - 10 Seats",
    description: "Compact, private & furnished workspaces tailored for fast-moving startups.",
    image: "/images/findyouridealspace/1.jpg",
    spacesCount: "45+ Spaces",
    properties: [
      {
        id: "so-1",
        slug: "ithum-tower-startup-pod",
        title: "I-Thum Tower Starter Suite",
        location: "Sector 62, Noida",
        sector: "Sector 62",
        badge: "READY TO MOVE",
        areaSqFt: "450",
        workstations: "6 Seats",
        cabins: "1 Cabin",
        price: "₹ 38,000 / mo",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
        amenity: "High-Speed WiFi",
        amenityIcon: "fa-solid fa-wifi",
      },
      {
        id: "so-2",
        slug: "logix-techno-compact",
        title: "Logix Techno Park Smart Hub",
        location: "Sector 127, Noida",
        sector: "Sector 127",
        badge: "FURNISHED",
        areaSqFt: "650",
        workstations: "8 Seats",
        cabins: "1 Cabin",
        price: "₹ 52,000 / mo",
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
        amenity: "Cafeteria",
        amenityIcon: "fa-solid fa-utensils",
      },
      {
        id: "so-3",
        slug: "bhutani-alphathum-startup",
        title: "Bhutani Alphathum Micro Office",
        location: "Sector 90, Noida",
        sector: "Sector 90",
        badge: "HOT DEAL",
        areaSqFt: "580",
        workstations: "10 Seats",
        cabins: "1 Cabin",
        price: "₹ 48,000 / mo",
        image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80",
        amenity: "Meeting Room",
        amenityIcon: "fa-solid fa-handshake",
      },
    ],
  },
  {
    id: "cat-10-25",
    slug: "10-25-seats",
    title: "10 – 25 Seats",
    seatRange: "10 - 25 Seats",
    description: "Fully plug & play offices with executive cabins, meeting rooms & reception.",
    image: "/images/findyouridealspace/2.jpg",
    spacesCount: "60+ Spaces",
    properties: [
      {
        id: "seat-1",
        slug: "advant-navis-executive-suite",
        title: "Advant Navis Executive Office",
        location: "Sector 142, Noida",
        sector: "Sector 142",
        badge: "MOST POPULAR",
        areaSqFt: "1,450",
        workstations: "18 Seats",
        cabins: "2 Cabins",
        price: "₹ 1.25 L / mo",
        image: "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80",
        amenity: "Metro Connectivity",
        amenityIcon: "fa-solid fa-train-subway",
      },
      {
        id: "seat-2",
        slug: "assotech-business-cresterra-20",
        title: "Assotech Business Cresterra Wing",
        location: "Sector 135, Noida",
        sector: "Sector 135",
        badge: "GRADE A",
        areaSqFt: "1,650",
        workstations: "22 Seats",
        cabins: "2 Cabins",
        price: "₹ 1.40 L / mo",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
        amenity: "Reserved Parking",
        amenityIcon: "fa-solid fa-square-parking",
      },
      {
        id: "seat-3",
        slug: "max-square-growth-space",
        title: "Max Square Boutique Suite",
        location: "Sector 129, Noida",
        sector: "Sector 129",
        badge: "PREMIUM",
        areaSqFt: "1,800",
        workstations: "24 Seats",
        cabins: "3 Cabins",
        price: "₹ 1.65 L / mo",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        amenity: "100% Power Backup",
        amenityIcon: "fa-solid fa-bolt",
      },
    ],
  },
  {
    id: "cat-25-50",
    slug: "25-50-seats",
    title: "25 – 50 Seats",
    seatRange: "25 - 50 Seats",
    description: "Spacious corporate wings with manager cabins, pantry, conference room & server room.",
    image: "/images/findyouridealspace/3.jpg",
    spacesCount: "40+ Spaces",
    properties: [
      {
        id: "mid-1",
        slug: "candor-techspace-corporate",
        title: "Candor TechSpace Business Wing",
        location: "Sector 62, Noida",
        sector: "Sector 62",
        badge: "IT / ITES PARK",
        areaSqFt: "2,850",
        workstations: "36 Seats",
        cabins: "4 Cabins",
        price: "₹ 2.45 L / mo",
        image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
        amenity: "Food Court & Gym",
        amenityIcon: "fa-solid fa-dumbbell",
      },
      {
        id: "mid-2",
        slug: "express-trade-tower-hub",
        title: "Express Trade Tower Elite",
        location: "Sector 132, Noida",
        sector: "Sector 132",
        badge: "LUXURY INTERIOR",
        areaSqFt: "3,200",
        workstations: "45 Seats",
        cabins: "4 Cabins",
        price: "₹ 2.80 L / mo",
        image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80",
        amenity: "Conference Hub",
        amenityIcon: "fa-solid fa-users",
      },
      {
        id: "mid-3",
        slug: "stellar-it-park-mid",
        title: "Stellar IT Park Custom Wing",
        location: "Sector 62, Noida",
        sector: "Sector 62",
        badge: "VERIFIED",
        areaSqFt: "3,500",
        workstations: "48 Seats",
        cabins: "5 Cabins",
        price: "₹ 2.95 L / mo",
        image: "https://images.unsplash.com/photo-1604328698679-70823ab1f818?auto=format&fit=crop&w=800&q=80",
        amenity: "24/7 Security",
        amenityIcon: "fa-solid fa-shield-halved",
      },
    ],
  },
  {
    id: "cat-50-100",
    slug: "50-100-seats",
    title: "50 – 100 Seats",
    seatRange: "50 - 100 Seats",
    description: "Independent corporate floors for mid-size companies, tech firms & regional head offices.",
    image: "/images/findyouridealspace/4.jpg",
    spacesCount: "30+ Spaces",
    properties: [
      {
        id: "lg-1",
        slug: "skymark-one-corporate-floor",
        title: "Skymark One Commercial Floor",
        location: "Sector 98, Noida Expressway",
        sector: "Sector 98",
        badge: "GRADE A+",
        areaSqFt: "5,400",
        workstations: "72 Seats",
        cabins: "6 Cabins",
        price: "₹ 4.85 L / mo",
        image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
        amenity: "Expressway View",
        amenityIcon: "fa-solid fa-road",
      },
      {
        id: "lg-2",
        slug: "oxygen-business-park-tech",
        title: "Oxygen Business Park Tower A",
        location: "Sector 144, Noida",
        sector: "Sector 144",
        badge: "SEZ & NON-SEZ",
        areaSqFt: "6,500",
        workstations: "88 Seats",
        cabins: "7 Cabins",
        price: "₹ 5.60 L / mo",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        amenity: "Multi-Level Parking",
        amenityIcon: "fa-solid fa-car",
      },
    ],
  },
  {
    id: "cat-100-plus",
    slug: "100-plus-seats",
    title: "100+ Seats",
    seatRange: "100+ Seats",
    description: "Enterprise scale multi-floor managed offices and dedicated building blocks.",
    image: "/images/findyouridealspace/5.jpg",
    spacesCount: "25+ Spaces",
    properties: [
      {
        id: "ent-1",
        slug: "unitech-infospace-enterprise",
        title: "Unitech Infospace Mega Campus",
        location: "Sector 135, Noida",
        sector: "Sector 135",
        badge: "CAMPUS DEVELOPMENT",
        areaSqFt: "11,500",
        workstations: "140 Seats",
        cabins: "12 Cabins",
        price: "₹ 9.80 L / mo",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
        amenity: "Dedicated Lift Lobby",
        amenityIcon: "fa-solid fa-elevator",
      },
      {
        id: "ent-2",
        slug: "tulsiani-easyday-tower",
        title: "Tulsiani Business Landmark",
        location: "Sector 63, Noida",
        sector: "Sector 63",
        badge: "READY OCCUPANCY",
        areaSqFt: "9,200",
        workstations: "110 Seats",
        cabins: "9 Cabins",
        price: "₹ 7.75 L / mo",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
        amenity: "Cafeteria & Lounge",
        amenityIcon: "fa-solid fa-mug-hot",
      },
    ],
  },
  {
    id: "cat-corporate",
    slug: "corporate-office",
    title: "Corporate Office",
    seatRange: "Custom / 150+ Seats",
    description: "Grade A corporate headquarters with custom fit-outs, boardrooms & private terraces.",
    image: "/images/findyouridealspace/6.jpg",
    spacesCount: "20+ Spaces",
    properties: [
      {
        id: "corp-1",
        slug: "world-trade-center-noida",
        title: "World Trade Center Noida Signature",
        location: "TechZone IV / Expressway, Noida",
        sector: "Expressway",
        badge: "GLOBAL ICON",
        areaSqFt: "18,000",
        workstations: "200+ Seats",
        cabins: "18 Cabins",
        price: "₹ 15.5 L / mo",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
        amenity: "Helipad & Concierge",
        amenityIcon: "fa-solid fa-star",
      },
      {
        id: "corp-2",
        slug: "gulshan-one29-corporate",
        title: "Gulshan One29 Executive Tower",
        location: "Sector 129, Noida Expressway",
        sector: "Sector 129",
        badge: "LEED GOLD CERTIFIED",
        areaSqFt: "14,500",
        workstations: "160 Seats",
        cabins: "14 Cabins",
        price: "₹ 12.0 L / mo",
        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80",
        amenity: "Sky Lounge & Terrace",
        amenityIcon: "fa-solid fa-cloud-sun",
      },
    ],
  },
];

/**
 * Helper to parse workstation seat numbers from string or number
 */
function parseNumericSeats(raw?: string | number): number {
  if (typeof raw === "number") return raw;
  if (!raw) return 0;
  const match = String(raw).match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/**
 * Helper to parse numeric sq.ft area
 */
function parseNumericArea(raw?: string | number): number {
  if (typeof raw === "number") return raw;
  if (!raw) return 0;
  const cleaned = String(raw).replace(/[^0-9]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

/**
 * Smart Category Matching:
 * Evaluates whether a live database property belongs to this workstation/category segment
 */
function matchesCategory(prop: PropertyCardItem, categoryId: string): boolean {
  const seats = parseNumericSeats(prop.workstations);
  const area = parseNumericArea(prop.area);

  const allTags: string[] = [
    ...(prop.categories || []),
    prop.category || "",
    prop.propertyType || "",
    prop.badge || "",
    prop.title || "",
  ].map((c) => c.toLowerCase());

  const hasTag = (regex: RegExp) => allTags.some((c) => regex.test(c));

  switch (categoryId) {
    case "cat-startup":
      // 1 - 10 Seats
      return (
        (seats > 0 && seats <= 10) ||
        hasTag(/startup|co-?working|micro|starter|small/i) ||
        (seats === 0 && area > 0 && area <= 800)
      );

    case "cat-10-25":
      // 10 - 25 Seats
      return (
        (seats >= 10 && seats <= 25) ||
        hasTag(/10\s*[-–]\s*25/i) ||
        (seats === 0 && area >= 800 && area <= 2000)
      );

    case "cat-25-50":
      // 25 - 50 Seats
      return (
        (seats > 25 && seats <= 50) ||
        hasTag(/25\s*[-–]\s*50/i) ||
        (seats === 0 && area > 2000 && area <= 3500)
      );

    case "cat-50-100":
      // 50 - 100 Seats
      return (
        (seats > 50 && seats <= 100) ||
        hasTag(/50\s*[-–]\s*100/i) ||
        (seats === 0 && area > 3500 && area <= 7000)
      );

    case "cat-100-plus":
      // 100+ Seats
      return (
        seats > 100 ||
        hasTag(/100\+|enterprise|campus/i) ||
        (seats === 0 && area > 7000)
      );

    case "cat-corporate":
      // Corporate Office / Headquarters
      return (
        seats >= 80 ||
        hasTag(/corporate|grade\s*a|headquarter|enterprise|tower|commercial/i) ||
        area >= 4000
      );

    default:
      return false;
  }
}

/**
 * Convert backend PropertyCardItem into CategoryPropertyItem format for modal cards
 */
function convertToCategoryPropertyItem(item: PropertyCardItem): CategoryPropertyItem {
  const seatsNum = parseNumericSeats(item.workstations);
  const areaNum = parseNumericArea(item.area);

  let priceDisplay = "Price on Request";
  if (!item.priceOnRequest && item.price && item.price.trim() !== "") {
    priceDisplay = item.price.startsWith("₹") ? item.price : `₹ ${item.price}`;
    if (!priceDisplay.includes("/ mo") && !priceDisplay.includes("/mo") && !priceDisplay.includes("Cr")) {
      priceDisplay = `${priceDisplay} / mo`;
    }
  }

  const image =
    item.image && item.image.trim() !== "" && item.image !== "/images/sample-office.png"
      ? item.image
      : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";

  return {
    id: String(item.id || item.slug),
    slug: item.slug,
    title: item.title,
    location: item.location || (item.sector ? `${item.sector}, Noida` : "Noida"),
    sector: item.sector || "Noida",
    badge: item.badge || (item.price && !item.priceOnRequest ? "FEATURED" : "GRADE A"),
    areaSqFt: areaNum > 0 ? areaNum.toLocaleString("en-IN") : (item.area ? item.area.replace(/[^0-9,]/g, "") : "1,200"),
    workstations: seatsNum > 0 ? `${seatsNum} Seats` : (item.workstations || "15 Seats"),
    cabins: item.cabins || "2 Cabins",
    price: priceDisplay,
    image,
    amenity: item.meetingRooms ? `${item.meetingRooms} Meeting Rooms` : "100% Power Backup",
    amenityIcon: item.meetingRooms ? "fa-solid fa-people-roof" : "fa-solid fa-bolt",
  };
}

export default function WorkspaceCategories({
  initialCategories = DEFAULT_CATEGORIES,
}: WorkspaceCategoriesProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<WorkspaceCategory[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<WorkspaceCategory | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [enquiryModalConfig, setEnquiryModalConfig] = useState({
    title: "Find Workspaces in Noida",
    subtitle: "Share your requirements and our workspace specialist will connect with you within 30 minutes.",
    propertyName: "",
    initialPreferredLocation: "Noida",
    initialLookingFor: "Furnished Offices",
  });

  // Seamless 0ms integration with cached live properties
  useEffect(() => {
    let isMounted = true;
    propertyService
      .getActiveProperties(50)
      .then((liveProperties) => {
        if (!isMounted || !Array.isArray(liveProperties) || liveProperties.length === 0) return;

        setCategories((prevCategories) => {
          return prevCategories.map((cat) => {
            const matched = liveProperties
              .filter((p) => matchesCategory(p, cat.id))
              .map(convertToCategoryPropertyItem);

            if (matched.length > 0) {
              return {
                ...cat,
                spacesCount: `${matched.length}+ Spaces`,
                properties: matched,
              };
            }
            return cat;
          });
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // Lock body scroll when popup or enquiry modal is open
  useEffect(() => {
    if (isPopupOpen || isEnquiryModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isPopupOpen, isEnquiryModalOpen]);

  // Close popup modal on Escape key press
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

  // Handle clicking a category circle
  const handleCategoryClick = (category: WorkspaceCategory) => {
    // Lookup latest version from categories state with live DB properties
    const activeCat = categories.find((c) => c.id === category.id) || category;
    setSelectedCategory(activeCat);
    setIsPopupOpen(true);
  };

  // Close category property listing popup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // Navigate to property detail page
  const handlePropertyNavigate = (slug: string) => {
    setIsPopupOpen(false);
    router.push(`/properties/${slug}`);
  };

  // Property-specific enquiry trigger from within the popup card
  const handleTriggerPropertyEnquiry = (propertyTitle: string, location: string) => {
    setEnquiryModalConfig({
      title: `Enquire about ${propertyTitle}`,
      subtitle: `Direct enquiry for verified workspace in ${location}. Our specialist will contact you within 30 minutes.`,
      propertyName: propertyTitle,
      initialPreferredLocation: location || "Noida",
      initialLookingFor: selectedCategory?.title || "Furnished Office",
    });
    setIsPopupOpen(false);
    setIsEnquiryModalOpen(true);
  };

  // Category-level enquiry trigger ("Enquire All in 10 - 25 Seats")
  const handleTriggerCategoryEnquiry = (category: WorkspaceCategory) => {
    setEnquiryModalConfig({
      title: `Enquire for ${category.title} in Noida`,
      subtitle: `Explore available ${category.seatRange} offices matching your team size and budget.`,
      propertyName: "",
      initialPreferredLocation: "Noida",
      initialLookingFor: `${category.title} (${category.seatRange})`,
    });
    setIsPopupOpen(false);
    setIsEnquiryModalOpen(true);
  };

  return (
    <section
      id="workspace-categories"
      className="relative bg-white text-[#141414] section-padding overflow-hidden"
    >
      <div className="site-container">
        
        {/* ── TOP SECTION HEADER ── */}
        <div className="text-center max-w-2xl mx-auto space-y-2 pb-6 sm:pb-8 lg:pb-10">
          
          {/* Eyebrow Tag with Dual Gold Accent Lines */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-7 sm:w-12 h-[1.5px] bg-[var(--color-gold)] inline-block shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] sm:tracking-[0.25em] uppercase text-[var(--color-gold)] font-sans">
              FIND YOUR IDEAL SPACE
            </span>
            <span className="w-7 sm:w-12 h-[1.5px] bg-[var(--color-gold)] inline-block shrink-0" />
          </div>

          {/* Main H2 Heading */}
          <h2 className="font-heading text-[24px] sm:text-[32px] lg:text-[38px] font-medium tracking-tight text-[#141414] leading-[1.18]">
            What are you <span className="text-gold font-medium">looking for?</span>
          </h2>
        </div>

        {/* ── 6 CIRCULAR CATEGORY CARDS (Exact Match: 3x2 on Mobile, 6x1 on Desktop) ── */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5 lg:gap-6 items-start justify-center">
          {categories.map((cat) => {
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                role="button"
                tabIndex={0}
                aria-label={`View ${cat.title} properties`}
                className="group flex flex-col items-center cursor-pointer select-none text-center"
              >
                {/* Double Ring Circular Image Container */}
                <div className="relative">
                  <div
                    className="
                      relative
                      w-20 h-20 min-[380px]:w-24 min-[380px]:h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 xl:w-34 xl:h-34
                      rounded-full
                      p-1 sm:p-1.5
                      border border-black/[0.08]
                      group-hover:border-[var(--color-gold)]
                      group-hover:ring-4 group-hover:ring-[var(--color-gold)]/20
                      shadow-sm group-hover:shadow-lg
                      transition-all duration-300 ease-out
                    "
                  >
                    {/* Inner Circular Photo */}
                    <div className="w-full h-full rounded-full overflow-hidden relative bg-[#f5f2eb]">
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      {/* Subtle gradient vignette */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    </div>
                  </div>

                  {/* Floating Gold Arrow Pill Indicator */}
                  <div
                    className="
                      absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2
                      w-6 h-6 sm:w-8 sm:h-8 rounded-full
                      bg-[var(--color-gold)] text-white
                      flex items-center justify-center
                      shadow-md
                      opacity-0 scale-75
                      group-hover:opacity-100 group-hover:scale-100
                      transition-all duration-300
                    "
                  >
                    <i className="fa-solid fa-arrow-right text-[9px] sm:text-[11px] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Category Title & Subtle Dash Indicator Below Circle */}
                <div className="mt-2 sm:mt-2.5 flex flex-col items-center space-y-1">
                  <span className="w-3.5 sm:w-4 h-[1.5px] bg-[#deb881] inline-block opacity-80 group-hover:opacity-0 transition-opacity duration-300" />
                  <span className="font-sans text-[10.5px] sm:text-[11.5px] lg:text-[12px] font-medium text-[#141414] group-hover:text-[var(--color-gold)] transition-colors leading-tight text-center">
                    {cat.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CATEGORY PROPERTY LISTING POPUP MODAL (100% PRODUCTION READY)
          ══════════════════════════════════════════════════════════════════════ */}
      {isPopupOpen && selectedCategory && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2.5 sm:p-4 md:p-6">
          {/* Backdrop */}
          <div
            onClick={handleClosePopup}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity animate-fade-in"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-black/10 z-10 overflow-hidden animate-scale-up">
            
            {/* Top Gold Gradient Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#b58b53] via-[#deb881] to-[#b58b53] z-20" />

            {/* Modal Header */}
            <div className="shrink-0 bg-white px-4 sm:px-6 py-3 sm:py-3.5 border-b border-black/[0.06] flex items-center justify-between">
              <div className="space-y-0.5 pr-2">
                <div className="flex items-center gap-2">
                  <span className="w-4 sm:w-5 h-[1.5px] bg-[var(--color-gold)] inline-block" />
                  <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider sm:tracking-widest text-[#b58b53] font-sans">
                    {selectedCategory.seatRange} WORKSPACES
                  </span>
                </div>
                <div
                  className="font-sans text-[#141414] text-base sm:text-[17px] font-semibold leading-snug tracking-tight"
                  style={{ fontSize: "16px", fontWeight: 600, lineHeight: 1.3 }}
                >
                  {selectedCategory.title} Options in Noida
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClosePopup}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm shrink-0"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Modal Scrollable Body: Property Cards Grid with Sleek Native Scroll */}
            <div className="overflow-y-auto px-4 sm:px-6 py-3.5 sm:py-4 space-y-3.5 sm:space-y-4 [scrollbar-width:thin] [scrollbar-color:#c69960_transparent]">
              
              {/* Category Brief Bar */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-[#faf8f5] border border-[#c69960]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="space-y-0.5 text-left">
                  <p className="text-[11.5px] sm:text-xs text-zinc-700 font-sans leading-relaxed">
                    {selectedCategory.description}
                  </p>
                  <span className="text-[10.5px] sm:text-[11px] font-semibold text-[#c69960] font-sans block">
                    Showing {selectedCategory.properties.length} verified {selectedCategory.title} spaces available for lease.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerCategoryEnquiry(selectedCategory)}
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl bg-[var(--color-gold)] hover:bg-[var(--color-gold-hover)] text-white text-[11px] sm:text-[11.5px] font-medium transition-all duration-200 shadow-sm shrink-0 cursor-pointer w-full sm:w-auto active:scale-95"
                >
                  <i className="fa-solid fa-phone-volume text-[10px]" />
                  <span>Enquire All in {selectedCategory.seatRange}</span>
                </button>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pb-1">
                {selectedCategory.properties.map((prop) => (
                  <div
                    key={prop.id}
                    onClick={() => handlePropertyNavigate(prop.slug)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${prop.title}`}
                    className="group rounded-xl sm:rounded-2xl bg-[#1a1816] border border-[#2e2a25] hover:border-[#c69960]/60 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 cursor-pointer text-left select-none"
                  >
                    {/* Property Image */}
                    <div className="relative w-full h-32 sm:h-34 bg-[#1a1816] overflow-hidden">
                      <Image
                        src={prop.image}
                        alt={prop.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1816] via-[#1a1816]/30 to-transparent" />

                      {prop.badge && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="inline-block bg-[#deb881] text-[#1c160c] font-semibold text-[8px] sm:text-[8.5px] tracking-wider uppercase px-2 py-0.5 rounded-full shadow-md font-sans">
                            {prop.badge}
                          </span>
                        </div>
                      )}

                      {prop.price && (
                        <div className="absolute bottom-2 left-2.5 z-10">
                          <span className="text-[11px] sm:text-[11.5px] font-semibold text-white font-sans drop-shadow-md">
                            {prop.price}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Property Details */}
                    <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between space-y-2.5 bg-[#1a1816] text-white">
                      <div className="space-y-0.5">
                        <div
                          className="font-sans text-white/95 group-hover:text-[#c69960] transition-colors leading-snug truncate"
                          style={{
                            fontSize: "12.5px",
                            fontWeight: 500,
                            lineHeight: "1.35",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {prop.title}
                        </div>

                        <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] text-zinc-400 font-sans">
                          <i className="fa-solid fa-location-dot text-[#c69960] text-[8.5px]" />
                          <span className="truncate">{prop.location}</span>
                        </div>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-2 gap-1.5 py-1.5 border-y border-white/[0.08] text-[9.5px] sm:text-[10px]">
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <i className="fa-solid fa-vector-square text-[#c69960] text-[9px]" />
                          <span>{prop.areaSqFt} Sq. Ft.</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <i className="fa-solid fa-users text-[#c69960] text-[9px]" />
                          <span>{prop.workstations}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300">
                          <i className="fa-solid fa-door-open text-[#c69960] text-[9px]" />
                          <span>{prop.cabins}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300 truncate">
                          <i className={`${prop.amenityIcon} text-[#c69960] text-[9px]`} />
                          <span className="truncate">{prop.amenity}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePropertyNavigate(prop.slug);
                          }}
                          className="flex-1 py-1.5 sm:py-2 px-2.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10.5px] sm:text-[11px] font-medium transition-colors text-center cursor-pointer active:scale-95"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTriggerPropertyEnquiry(prop.title, prop.location);
                          }}
                          className="py-1.5 sm:py-2 px-3 rounded-lg sm:rounded-xl bg-[#b58b53] hover:bg-[#a07742] text-white text-[10.5px] sm:text-[11px] font-medium transition-colors text-center cursor-pointer shadow-sm active:scale-95"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ── GLOBAL ENQUIRY MODAL (Triggered from within category popup) ── */}
      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        title={enquiryModalConfig.title}
        subtitle={enquiryModalConfig.subtitle}
        propertyName={enquiryModalConfig.propertyName}
        initialPreferredLocation={enquiryModalConfig.initialPreferredLocation}
        initialLookingFor={enquiryModalConfig.initialLookingFor}
      />
    </section>
  );
}


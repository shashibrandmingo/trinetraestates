/**
 * ============================================================================
 * TRINETRA ESTATES — GLOBAL CONSTANTS
 * ============================================================================
 * All brand data used by React components lives here.
 * Colors & styling are ONLY in globals.css (CSS Variables).
 * ============================================================================
 */

/** Site-wide branding, contact info & API config */
export const SITE_CONFIG = {
  name: "Trinetra Estates",
  tagline: "Beyond The Ordinary",
  phone: "+91 99999 01196",
  email: "info@trinetraestates.com",
  officeAddress: "Sector 62, Noida, Uttar Pradesh",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
} as const;

/** Noida sectors shown in dropdowns, filter tabs & location grids */
export const NOIDA_SECTORS = [
  "Sector 62",
  "Sector 63",
  "Sector 125",
  "Sector 126",
  "Sector 132",
  "Sector 135",
  "Sector 136",
  "Sector 142",
  "Sector 18",
  "Noida Expressway",
] as const;

/** Office space categories for filter pills */
export const SPACE_TYPES = [
  "Furnished Offices",
  "Unfurnished Offices",
  "Coworking Spaces",
  "Managed Offices",
  "Commercial Bare Shell",
  "Retail Spaces",
] as const;

/** "Find Your Ideal Space" seat-capacity cards */
export const SEAT_CATEGORIES = [
  { id: "startup", label: "Startup Office", seats: "1 – 10 Seats" },
  { id: "small", label: "10 – 25 Seats", seats: "10 – 25 Seats" },
  { id: "medium", label: "25 – 50 Seats", seats: "25 – 50 Seats" },
  { id: "growing", label: "50 – 100 Seats", seats: "50 – 100 Seats" },
  { id: "enterprise", label: "100+ Seats", seats: "100+ Seats" },
  { id: "corporate", label: "Corporate Office", seats: "Custom Built" },
] as const;

/** Hero / About / Footer stats counters */
export const STATS = [
  { value: "500+", label: "Spaces Available" },
  { value: "20+", label: "Prime Locations" },
  { value: "100+", label: "Happy Businesses" },
] as const;

/** Navbar navigation links */
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "#about" },
  { label: "Properties", href: "#featured-properties" },
  { label: "Why Us", href: "#why-choose-us" },
  { label: "Contact", href: "#get-in-touch" },
] as const;

/** "Trusted by businesses like yours" ticker */
export const TRUSTED_BUSINESSES = [
  "Startups",
  "SMEs",
  "Enterprises",
  "IT / ITES",
  "Retail Brands",
  "Professional Firms",
] as const;

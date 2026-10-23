import type { Metadata } from "next";
import React, { type ReactNode } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://trinetraestates.com"),
  title: {
    default: "Office Space in Noida | Commercial Office Space & Leasing | Trinetra Estates",
    template: "%s | Trinetra Estates Noida",
  },
  description:
    "Find verified office space in Noida with Trinetra Estates. Explore fully furnished, plug-and-play, IT corporate offices & bare-shell spaces in Sector 62, 63, 132, 135, 142 & Noida Expressway. 0% brokerage options.",
  keywords: [
    "office space in Noida",
    "office space for rent in Noida",
    "office space for lease in Noida",
    "commercial office space in Noida",
    "commercial property for rent in Noida",
    "commercial office space for rent in Noida",
    "fully furnished office space in Noida",
    "furnished office space in Noida",
    "plug and play office space in Noida",
    "ready to move office space in Noida",
    "bare shell office space in Noida",
    "IT office space in Noida",
    "corporate office space in Noida",
    "office space in Sector 62 Noida",
    "office space in Sector 63 Noida",
    "office space in Sector 132 Noida",
    "office space in Sector 135 Noida",
    "office space in Sector 142 Noida",
    "office space in Sector 125 Noida",
    "office space in Sector 126 Noida",
    "office space in Noida Expressway",
    "office space near metro station Noida",
    "small office space for rent in Noida",
    "500 sq ft office space in Noida",
    "1000 sq ft office space in Noida",
    "office space under 30000 in Noida",
    "office space under 50000 in Noida",
    "coworking space in Noida",
    "Trinetra Estates",
    "Trinetra Estates Noida",
    "commercial real estate Noida",
    "office space for rent near Noida metro",
  ],
  authors: [{ name: "Trinetra Estates", url: "https://trinetraestates.com" }],
  creator: "Trinetra Estates",
  publisher: "Trinetra Estates",
  category: "Real Estate",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "https://trinetraestates.com",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    title: "Office Space in Noida | Commercial Office Space & Leasing | Trinetra Estates",
    description:
      "Find 500+ premium, verified commercial office spaces across Noida Sector 62, 132, 142 & Expressway. Fully furnished & plug-and-play offices with 0% brokerage.",
    url: "https://trinetraestates.com",
    siteName: "Trinetra Estates",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/bgbanners/herobanner.webp",
        width: 1200,
        height: 630,
        alt: "Office Space in Noida - Trinetra Estates",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Office Space in Noida | Commercial Office Space & Leasing | Trinetra Estates",
    description:
      "Find 500+ premium, verified commercial office spaces for rent across Noida Sector 62, 132, 142 & Expressway.",
    images: ["/images/bgbanners/herobanner.webp"],
    creator: "@trinetraestate",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

// Global JSON-LD Structured Data Schema for Search Engines
const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": "https://trinetraestates.com/#organization",
      name: "Trinetra Estates",
      alternateName: "Trinetra Estates Commercial Real Estate Noida",
      url: "https://trinetraestates.com",
      logo: "https://trinetraestates.com/images/logo/logo.webp",
      image: "https://trinetraestates.com/images/bgbanners/herobanner.webp",
      description:
        "Premier commercial real estate agency offering verified fully furnished, bare-shell, and coworking office spaces for rent across Noida Sector 62, 132, 142, and Expressway corridors.",
      telephone: "+91 99999 01196",
      priceRange: "₹₹ - ₹₹₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Bank Transfer, Cheque",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Commercial Business Hub, Sector 62",
        addressLocality: "Noida",
        addressRegion: "Uttar Pradesh",
        postalCode: "201301",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "28.6280",
        longitude: "77.3649",
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          opens: "09:30",
          closes: "19:30",
        },
      ],
      sameAs: ["https://www.instagram.com/trinetraestate/"],
      areaServed: [
        { "@type": "City", name: "Noida" },
        { "@type": "City", name: "Greater Noida" },
        { "@type": "AdministrativeArea", name: "Delhi NCR" },
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://trinetraestates.com/#website",
      url: "https://trinetraestates.com",
      name: "Trinetra Estates",
      publisher: {
        "@id": "https://trinetraestates.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://trinetraestates.com/?search={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://trinetraestates.com/#breadcrumb",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://trinetraestates.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Office Space for Rent in Noida",
          item: "https://trinetraestates.com",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <head>
        {/* Structured Data / Rich Snippet for Google Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* Font Awesome 6 CDN for rich luxury real estate icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[var(--color-bg-dark)] text-white">
        {children}
      </body>
    </html>
  );
}

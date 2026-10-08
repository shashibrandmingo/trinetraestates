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
    default: "Office Space in Noida | Commercial Office Space for Rent | Trinetra Estates",
    template: "%s | Trinetra Estates Noida",
  },
  description:
    "Explore 500+ verified commercial office spaces for rent in Noida across Sector 62, Sector 132, Sector 142, Sector 16 & Expressway. Fully furnished, bare shell & coworking workspaces with 0% brokerage options.",
  keywords: [
    "Office Space in Noida",
    "Commercial Office Space for Rent in Noida",
    "Office Space for Rent in Noida",
    "Furnished Office Space in Noida",
    "Fully Furnished Office in Noida",
    "Coworking Space in Noida",
    "Bare Shell Office Space Noida",
    "Office Space in Sector 62 Noida",
    "Office Space in Sector 132 Noida",
    "Office Space in Sector 142 Noida",
    "Office Space in Sector 16 Noida",
    "Office Space in Sector 63 Noida",
    "Office Space in Noida Expressway",
    "Plug and Play Office Space Noida",
    "Commercial Real Estate Noida",
    "IT Office Space Noida",
    "Trinetra Estates",
    "Trinetra Estates Noida",
    "Corporate Office for Lease Noida",
    "Commercial Property in Noida for Rent",
    "Ready to Move Office Space Noida",
    "Managed Office Space Noida",
    "Business Center Noida",
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
    title: "Office Space in Noida | Commercial Office Space for Rent | Trinetra Estates",
    description:
      "Find 500+ premium, verified commercial office spaces for rent across Noida Sector 62, 132, 142 & Expressway. Fully furnished & plug-and-play offices.",
    url: "https://trinetraestates.com",
    siteName: "Trinetra Estates",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/bgbanners/herobanner.png",
        width: 1200,
        height: 630,
        alt: "Trinetra Estates - Commercial Office Space in Noida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Office Space in Noida | Commercial Office Space for Rent | Trinetra Estates",
    description:
      "Find 500+ premium, verified commercial office spaces for rent across Noida Sector 62, 132, 142 & Expressway.",
    images: ["/images/bgbanners/herobanner.png"],
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
      logo: "https://trinetraestates.com/images/logo/logo.png",
      image: "https://trinetraestates.com/images/bgbanners/herobanner.png",
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

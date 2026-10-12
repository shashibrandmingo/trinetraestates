import type { Metadata, Viewport } from 'next';
import { Poppins, Plus_Jakarta_Sans, Caveat } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';

// Admin Modern Poppins Font
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Website Executive Plus Jakarta Sans Font
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Website Luxury Script Caveat Font
const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a233c',
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const adsClientId = process.env.NEXT_PUBLIC_ADS_CLIENT_ID;

const isRealAdSense =
  adsClientId &&
  adsClientId.trim() !== '' &&
  adsClientId !== 'ca-pub-0000000000000000' &&
  !adsClientId.includes('00000000');

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : new URL('https://officespaceinnoida.com'),
  title: {
    default: 'Office Space for Rent in Noida | Commercial Office Space & Leasing',
    template: '%s | Noida Office Spaces',
  },
  description:
    'Find verified office space for rent in Noida. Explore fully furnished, plug-and-play, IT corporate offices & bare-shell spaces in Sector 62, 63, 132, 135, 142 & Noida Expressway. Zero brokerage options.',
  keywords: [
    'office space for rent in Noida',
    'office space in Noida',
    'office space for lease in Noida',
    'commercial office space in Noida',
    'office for rent in Noida',
    'fully furnished office space in Noida',
    'office space available in Noida',
    'commercial property for rent in Noida',
    'office space for startups in Noida',
    'corporate office space in Noida',
    'small office space for rent in Noida',
    'office space near Noida Metro',
    'office space for IT companies in Noida',
    'office space for rent in Noida at affordable price',
    'office space rental consultant in Noida',
    'office space for rent in Sector 62 Noida',
    'office space in Sector 62 Noida',
    'furnished office space in Sector 62 Noida',
    'commercial office space in Sector 62 Noida',
    'office space for rent in Sector 63 Noida',
    'office space for rent in Sector 135 Noida',
    'office space for rent in Sector 142 Noida',
    'office space for rent in Sector 132 Noida',
    'office space for rent in Sector 125 Noida',
    'office space for rent in Sector 126 Noida',
    'office space on Noida Expressway',
    'plug and play office space in Noida',
    'ready to move office space in Noida',
    'commercial bare shell office in Noida',
    'managed office space Noida',
    'Noida Office Spaces',
  ],
  authors: [{ name: 'Noida Office Spaces', url: 'https://officespaceinnoida.com' }],
  creator: 'Noida Office Spaces',
  publisher: 'Noida Office Spaces',
  category: 'Commercial Real Estate',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl || 'https://officespaceinnoida.com',
    siteName: 'Noida Office Spaces',
    title: 'Office Space for Rent in Noida | Commercial Office Space & Leasing',
    description:
      'Find verified office space for rent in Noida. Explore fully furnished, plug-and-play, IT corporate offices & bare-shell spaces in Sector 62, 63, 132, 135, 142 & Expressway.',
    images: [
      {
        url: '/images/bgbanners/hero.png',
        width: 1200,
        height: 630,
        alt: 'Office Space for Rent in Noida - Commercial Office Spaces',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Office Space for Rent in Noida | Commercial Office Space & Leasing',
    description:
      'Find verified office space for rent in Noida. Fully furnished, plug-and-play & bare shell corporate offices in Sector 62, 132, 135, 142 & Expressway.',
    images: ['/images/bgbanners/hero.png'],
  },
  alternates: {
    canonical: siteUrl || 'https://officespaceinnoida.com',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'googlec5992d66495aacf0',
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

// Global JSON-LD Structured Data Schema (RealEstateAgent, WebSite & BreadcrumbList)
const realEstateAgentSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'RealEstateAgent',
      '@id': 'https://officespaceinnoida.com/#organization',
      name: 'Noida Office Spaces',
      alternateName: 'Noida Office Spaces Commercial Real Estate',
      url: 'https://officespaceinnoida.com',
      logo: 'https://officespaceinnoida.com/images/logo/logo-white.png',
      image: 'https://officespaceinnoida.com/images/bgbanners/hero.png',
      description:
        'Premier commercial office space advisory offering verified fully furnished, bare-shell, and managed coworking office spaces for rent across Noida Sector 62, 63, 132, 135, 142, and Expressway corridors.',
      telephone: '+91 99999 01196',
      priceRange: '₹₹ - ₹₹₹₹',
      currenciesAccepted: 'INR',
      paymentAccepted: 'Bank Transfer, Cheque',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Commercial Business District, Sector 62',
        addressLocality: 'Noida',
        addressRegion: 'Uttar Pradesh',
        postalCode: '201301',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '28.6280',
        longitude: '77.3649',
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:30',
          closes: '19:30',
        },
      ],
      areaServed: [
        { '@type': 'City', name: 'Noida' },
        { '@type': 'City', name: 'Greater Noida' },
        { '@type': 'AdministrativeArea', name: 'Noida Expressway' },
        { '@type': 'AdministrativeArea', name: 'Sector 62 Noida' },
        { '@type': 'AdministrativeArea', name: 'Sector 63 Noida' },
        { '@type': 'AdministrativeArea', name: 'Sector 132 Noida' },
        { '@type': 'AdministrativeArea', name: 'Sector 135 Noida' },
        { '@type': 'AdministrativeArea', name: 'Sector 142 Noida' },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://officespaceinnoida.com/#website',
      url: 'https://officespaceinnoida.com',
      name: 'Noida Office Spaces',
      publisher: {
        '@id': 'https://officespaceinnoida.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://officespaceinnoida.com/?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://officespaceinnoida.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://officespaceinnoida.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Office Space for Rent in Noida',
          item: 'https://officespaceinnoida.com',
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${plusJakarta.variable} ${caveat.variable} scroll-smooth`}
    >
      <head>
        {/* Structured Data / Rich Snippet for Google Search Engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(realEstateAgentSchema),
          }}
        />

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {isRealAdSense && (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
            <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
            <script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClientId}`}
              crossOrigin="anonymous"
            />
          </>
        )}
      </head>
      <body className="font-sans antialiased min-h-screen overflow-x-hidden w-full">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

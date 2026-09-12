import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';

// Modern, Clean Poppins Font for Entire Website
const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800']
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0c1a30'
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const adsClientId = process.env.NEXT_PUBLIC_ADS_CLIENT_ID;

const isRealAdSense =
  adsClientId &&
  adsClientId.trim() !== '' &&
  adsClientId !== 'ca-pub-0000000000000000' &&
  !adsClientId.includes('00000000');

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: 'Noida Office Spaces | Verified Corporate & Commercial Leasing',
    template: '%s | Noida Office Spaces'
  },
  description:
    'Exclusive commercial office spaces, corporate headquarters, and managed tech offices in prime Noida sectors (Sector 62, 132, 16, Expressway).',
  keywords: [
    'Office Space Noida',
    'Noida Sector 62 Office',
    'Noida Expressway Commercial Space',
    'Furnished Office Rent Noida',
    'Corporate Real Estate Noida'
  ],
  authors: [{ name: 'Noida Office Spaces' }],
  creator: 'Noida Office Spaces',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Noida Office Spaces',
    title: 'Noida Office Spaces | Verified Corporate & Commercial Leasing',
    description:
      'Exclusive commercial office spaces, corporate headquarters, and managed tech offices in prime Noida sectors.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noida Office Spaces',
    description:
      'Exclusive commercial office spaces, corporate headquarters, and managed tech offices in prime Noida sectors.'
  },
  alternates: {
    canonical: siteUrl
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/brand-logo.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} font-sans`}>
      <head>
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
      <body className="font-sans antialiased bg-[#ffffff] text-navy-900 selection:bg-gold-500 selection:text-white min-h-screen overflow-x-hidden w-full">
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

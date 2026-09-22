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
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: 'Noida Office Spaces | Find Premium Commercial Office Spaces in Noida',
    template: '%s | Noida Office Spaces',
  },
  description:
    'Find premium furnished, bare-shell & coworking office spaces across prime sectors of Noida and Greater Noida Expressway. Verified listings with zero brokerage options.',
  keywords: [
    'Noida Office Space',
    'Commercial Office Noida',
    'Office for rent Sector 62',
    'Office space Noida Expressway',
    'Coworking space Noida',
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
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Noida Office Spaces',
    title: 'Noida Office Spaces | Find Premium Commercial Office Spaces in Noida',
    description:
      'Find premium furnished, bare-shell & coworking office spaces across prime sectors of Noida and Greater Noida Expressway.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Noida Office Spaces',
    description:
      'Find premium furnished, bare-shell & coworking office spaces across prime sectors of Noida and Greater Noida Expressway.',
  },
  alternates: {
    canonical: siteUrl,
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

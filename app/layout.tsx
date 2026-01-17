import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import CookieConsent from '@/components/Consent/CookieConsent';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'greek'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Λεξούλι - Ελληνικό Wordle',
  description: 'Μάντεψε τη λέξη της ημέρας! Το αγαπημένο παιχνίδι λέξεων τώρα στα ελληνικά.',
  keywords: ['wordle', 'ελληνικά', 'παιχνίδι λέξεων', 'λεξούλι', 'ελληνικό wordle', 'wordle greek', 'greek wordle'],
  authors: [{ name: 'Λεξούλι' }],
  manifest: '/manifest.json',
  metadataBase: new URL('https://wordlegr.co'),
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Λεξούλι',
  },
  openGraph: {
    title: 'Λεξούλι - Ελληνικό Wordle',
    description: 'Μάντεψε τη λέξη της ημέρας! Το αγαπημένο παιχνίδι λέξεων τώρα στα ελληνικά.',
    type: 'website',
    locale: 'el_GR',
    siteName: 'Λεξούλι',
    url: 'https://wordlegr.co',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Λεξούλι - Ελληνικό Wordle',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Λεξούλι - Ελληνικό Wordle',
    description: 'Μάντεψε τη λέξη της ημέρας!',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Structured data for SEO (Game schema)
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Λεξούλι',
  alternateName: 'Greek Wordle',
  description: 'Μάντεψε τη λέξη της ημέρας! Το αγαπημένο παιχνίδι λέξεων τώρα στα ελληνικά.',
  url: 'https://wordlegr.co',
  applicationCategory: 'GameApplication',
  genre: 'Word Game',
  inLanguage: 'el',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2774055096389711"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}

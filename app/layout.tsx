import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'greek'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Λεξούλι - Ελληνικό Wordle',
  description: 'Μάντεψε τη λέξη της ημέρας! Το αγαπημένο παιχνίδι λέξεων τώρα στα ελληνικά.',
  keywords: ['wordle', 'ελληνικά', 'παιχνίδι λέξεων', 'λεξούλι', 'ελληνικό wordle'],
  authors: [{ name: 'Λεξούλι' }],
  manifest: '/manifest.json',
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Λεξούλι - Ελληνικό Wordle',
    description: 'Μάντεψε τη λέξη της ημέρας!',
  },
  robots: {
    index: true,
    follow: true,
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
      <body className={`${inter.variable} font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}

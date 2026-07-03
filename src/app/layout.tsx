import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'XBT Legal — Digital Asset Law',
    template: '%s — XBT Legal',
  },
  description:
    'Wyoming-licensed attorney specializing in digital asset regulation, securities law, and corporate structuring for blockchain-native companies.',
  metadataBase: new URL('https://xbt.llc'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'XBT Legal',
    title: 'XBT Legal — Digital Asset Law',
    description:
      'Wyoming-licensed attorney specializing in digital asset regulation, securities law, and corporate structuring for blockchain-native companies.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XBT Legal',
    description:
      'Regulatory strategy, corporate formation, securities compliance, and litigation defense at the intersection of law and blockchain technology.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'XBT Legal LLC',
  description:
    'Wyoming-licensed attorney specializing in digital asset regulation, securities law, and corporate structuring.',
  url: 'https://xbt.llc',
  founder: { '@type': 'Person', name: 'Matthew Elias' },
  areaServed: 'US',
  address: { '@type': 'PostalAddress', addressLocality: 'Cheyenne', addressRegion: 'WY' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black focus:outline focus:outline-2 focus:outline-blue-600"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main
            id="main-content"
            className="mx-auto w-full max-w-5xl flex-1 px-4 py-8"
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
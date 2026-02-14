import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import Providers from '@/components/layout/Providers';
import { TranslationProvider } from '@/hooks/useTranslation';
import { ToastProvider } from '@/components/ui/Toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rorschach-calculator.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Rorschach Structural Summary Calculator | Free Online Tool',
    template: '%s | Rorschach Calculator',
  },
  description:
    'Free online Rorschach (Comprehensive System) structural summary calculator for clinical practice and training.',
  keywords: [
    'Rorschach',
    'Rorschach test',
    'Comprehensive System',
    'Exner system',
    'Structural Summary',
    'Rorschach scoring',
    'clinical psychology',
    'psychodiagnostic tool',
  ],
  authors: [{ name: 'Seoul Institute of Clinical Psychology (SICP)' }],
  creator: 'Seoul Institute of Clinical Psychology (SICP)',
  publisher: 'SICP',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Rorschach Calculator',
    title: 'Rorschach Structural Summary Calculator',
    description:
      'Free online Rorschach (Comprehensive System) structural summary calculator.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rorschach Structural Summary Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rorschach Structural Summary Calculator',
    description:
      'Free online Rorschach (Comprehensive System) structural summary calculator.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Rorschach Structural Summary Calculator',
    description:
      'Free online Rorschach (Comprehensive System) structural summary calculator for clinicians and trainees.',
    url: siteUrl,
    applicationCategory: 'MedicalApplication',
    operatingSystem: 'Web Browser',
    inLanguage: ['en', 'ko', 'ja', 'es', 'pt'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    creator: {
      '@type': 'Organization',
      name: 'Seoul Institute of Clinical Psychology (SICP)',
      url: siteUrl,
    },
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {adsenseClientId && adsenseClientId !== 'ca-pub-XXXXXXXXXXXXXXXX' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {gaId && gaId !== 'G-XXXXXXXXXX' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <TranslationProvider>
            <ToastProvider>{children}</ToastProvider>
          </TranslationProvider>
        </Providers>
      </body>
    </html>
  );
}

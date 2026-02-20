import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import Script from 'next/script';
import Providers from '@/components/layout/Providers';
import { TranslationProvider } from '@/hooks/useTranslation';
import { ToastProvider } from '@/components/ui/Toast';
import GoogleAnalyticsPageView from '@/components/analytics/GoogleAnalyticsPageView';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://exnersicp.vercel.app';
const siteUrl = rawSiteUrl.replace(/\s+/g, '').replace(/\/+$/, '');
const googleSiteVerification =
  process.env.GOOGLE_SITE_VERIFICATION ?? 'RNxcEfQGpSUiWQhUoTpaiS1UU0UPB9vLwZ1QUurRLMY';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Computing Program for Rorschach Structural Summary | Free Online Tool',
    template: '%s | Rorschach Structural Summary',
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
  verification: {
    google: googleSiteVerification,
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
    siteName: 'Rorschach Structural Summary',
    title: 'Computing Program for Rorschach Structural Summary',
    description:
      'Free online Rorschach (Comprehensive System) structural summary calculator.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Computing Program for Rorschach Structural Summary',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Computing Program for Rorschach Structural Summary',
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
  const adsenseAccountMeta = adsenseClientId ?? 'ca-pub-4075981627753098';
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const cookieYesScriptUrl = process.env.NEXT_PUBLIC_COOKIEYES_SCRIPT_URL;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Computing Program for Rorschach Structural Summary',
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
        <meta name="google-adsense-account" content={adsenseAccountMeta} />
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
            {cookieYesScriptUrl ? (
              <>
                <Script id="google-consent-default" strategy="beforeInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('consent', 'default', {
                      ad_storage: 'denied',
                      ad_user_data: 'denied',
                      ad_personalization: 'denied',
                      analytics_storage: 'denied'
                    });
                  `}
                </Script>
                <Script id="cookieyes" src={cookieYesScriptUrl} strategy="beforeInteractive" />
              </>
            ) : null}
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
                  send_page_view: false,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <TranslationProvider>
            <ToastProvider>
              {gaId && gaId !== 'G-XXXXXXXXXX' ? (
                <Suspense fallback={null}>
                  <GoogleAnalyticsPageView measurementId={gaId} />
                </Suspense>
              ) : null}
              {children}
            </ToastProvider>
          </TranslationProvider>
        </Providers>
      </body>
    </html>
  );
}

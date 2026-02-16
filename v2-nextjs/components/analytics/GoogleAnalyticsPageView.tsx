'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type Props = {
  measurementId: string;
};

export default function GoogleAnalyticsPageView({ measurementId }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!window.gtag) return;
    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: window.location.href,
      send_to: measurementId,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}

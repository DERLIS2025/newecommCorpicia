'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackEvent } from '@/lib/tracking';

export function InternalPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const trackedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Avoid running on server side or if pathname is not ready
    if (typeof window === 'undefined' || !pathname) return;

    // Construct full URL path to avoid duplicate triggers on same route
    const currentUrl = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    if (trackedUrlRef.current === currentUrl) {
      return; // Already tracked this exact URL
    }

    trackedUrlRef.current = currentUrl;

    trackEvent({
      event_name: 'page_view',
      page_path: pathname, // We keep the clean pathname for easier grouping
    });

  }, [pathname, searchParams]);

  return null; // Component does not render anything
}

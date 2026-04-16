'use client';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(eventName: string, params: EventParams = {}) {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export function trackWhatsAppClick(source: string, label?: string) {
  trackEvent('whatsapp_click', { source, label });
}

export function trackAddToBudget(productName: string, quantity: number) {
  trackEvent('add_to_budget', { product_name: productName, quantity });
}

export function trackProductView(productName: string, slug: string) {
  trackEvent('product_view', { product_name: productName, slug });
}

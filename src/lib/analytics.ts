import { track } from '@vercel/analytics';

type EventParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Fires an event to both Vercel Web Analytics and GA4. window.gtag is only
// defined in production (see BaseLayout.astro), so it's a silent no-op elsewhere.
export function trackEvent(name: string, params?: EventParams): void {
  track(name, params);
  window.gtag?.('event', name, params);
}

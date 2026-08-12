declare global {
  interface Window {
    __ecoEventLog: Array<{ ts: number; eventName: string; params: Record<string, unknown> }>;
    ecoDumpEvents: () => void;
  }
}

import { track } from '@vercel/analytics';

// Initialize ring buffer
if (typeof window !== 'undefined') {
  window.__ecoEventLog = window.__ecoEventLog || [];
}

// Check if debug mode is enabled
function isDebugMode(): boolean {
  if (typeof window === 'undefined') return false;
  const urlParams = new URLSearchParams(window.location.search);
  return import.meta.env.DEV || urlParams.get('ga_debug') === '1';
}

// UTM parameters storage
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

function initUtmTracking(): void {
  if (typeof window === 'undefined') return;

  const urlParams = new URLSearchParams(window.location.search);
  const hasUtm = UTM_KEYS.some(key => urlParams.has(key));

  if (hasUtm) {
    UTM_KEYS.forEach(key => {
      const value = urlParams.get(key);
      if (value) {
        sessionStorage.setItem(key, value);
      }
    });
  }
}

function getUtmParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const params: Record<string, string> = {};
  UTM_KEYS.forEach(key => {
    const value = sessionStorage.getItem(key);
    if (value) {
      params[key] = value;
    }
  });
  return params;
}

function getAttributionParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const referrerDomain = document.referrer ? new URL(document.referrer).hostname : undefined;

  return {
    page_path: window.location.pathname,
    ...(referrerDomain ? { referrer_domain: referrerDomain } : {}),
    ...getUtmParams(),
  };
}

function analyticsMetadata(params: Record<string, unknown>): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key, value]) => !['page_path', 'referrer_domain', ...UTM_KEYS].includes(key) && ['string', 'number', 'boolean'].includes(typeof value))
      .map(([key, value]) => [key, typeof value === 'string' ? value.slice(0, 255) : value as number | boolean])
      .slice(0, 12),
  );
}

function addToRingBuffer(eventName: string, params: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  window.__ecoEventLog.push({ ts: Date.now(), eventName, params });

  if (window.__ecoEventLog.length > 50) {
    window.__ecoEventLog.shift();
  }
}

// Dump events helper
if (typeof window !== 'undefined') {
  window.ecoDumpEvents = () => {
    const events = window.__ecoEventLog.slice(-20);
    console.table(events.map(e => ({
      time: new Date(e.ts).toLocaleTimeString(),
      event: e.eventName,
      ...e.params,
    })));
  };
}

// Core tracking function
export function ecoTrack(eventName: string, params: Record<string, unknown> = {}): void {
  const fullParams = {
    ...params,
    ...getAttributionParams(),
  };

  addToRingBuffer(eventName, fullParams);
  track(eventName, analyticsMetadata(fullParams));

  if (isDebugMode()) {
    console.log('[analytics]', eventName, fullParams);
  }
}

// Initialize analytics
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  initUtmTracking();
  console.log('[analytics] ecoTrack ready', { debug: isDebugMode() });
}

// Newsletter tracking

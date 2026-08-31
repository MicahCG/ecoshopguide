import { useEffect } from 'react';

interface PageSEOOptions {
  title: string;
  description: string;
  canonical?: string;
}

const DEFAULT_TITLE = 'Bambana | Sustainable Living, Simplified';
const DEFAULT_DESC =
  'Bambana - curated guides and tips for sustainable, eco-friendly shopping. Hand-picked by a family-founded team in Austin.';
const DEFAULT_CANONICAL = 'https://shopbambana.com';

/**
 * Updates <title>, <meta name="description">, <link rel="canonical">,
 * and the Open Graph equivalents for any page that calls it.
 * Restores site-level defaults when the component unmounts.
 */
export function usePageSEO({ title, description, canonical }: PageSEOOptions) {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────
    document.title = title;

    // ── Meta description ───────────────────────────────────
    const metaDesc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (metaDesc) metaDesc.setAttribute('content', description);

    // ── Canonical ──────────────────────────────────────────
    let canonicalEl = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (canonical) {
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.setAttribute('href', canonical);
    }

    // ── Open Graph ─────────────────────────────────────────
    const ogTitle = document.querySelector<HTMLMetaElement>(
      'meta[property="og:title"]'
    );
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector<HTMLMetaElement>(
      'meta[property="og:description"]'
    );
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogUrl = document.querySelector<HTMLMetaElement>(
      'meta[property="og:url"]'
    );
    if (ogUrl && canonical) ogUrl.setAttribute('content', canonical);

    // ── Cleanup on unmount ─────────────────────────────────
    return () => {
      document.title = DEFAULT_TITLE;
      if (metaDesc) metaDesc.setAttribute('content', DEFAULT_DESC);
      if (canonicalEl) canonicalEl.setAttribute('href', DEFAULT_CANONICAL);
      if (ogTitle) ogTitle.setAttribute('content', DEFAULT_TITLE);
      if (ogDesc) ogDesc.setAttribute('content', DEFAULT_DESC);
      if (ogUrl) ogUrl.setAttribute('content', DEFAULT_CANONICAL);
    };
  }, [title, description, canonical]);
}

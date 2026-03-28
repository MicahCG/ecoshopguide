import { Link } from 'wouter';

/**
 * Sticky top-of-page disclosure banner required by FTC rules and Google
 * AdSense policies for pages that contain affiliate links.
 * Place this immediately after <Header /> in every Shop the Look page.
 */
export default function AffiliateDisclosure() {
  return (
    <div className="bg-muted/50 border-b border-border/60">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-2.5 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Affiliate Disclosure:</span>{' '}
          This page contains affiliate links. If you purchase something through
          our links, we may earn a small commission at no extra cost to you.{' '}
          <Link href="/pages/terms-of-service">
            <span className="underline hover:text-primary transition-colors cursor-pointer">
              Learn more
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}

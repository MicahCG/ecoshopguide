import { Link } from 'wouter';

export default function Footer({ showAffiliateDisclosure = true }: { showAffiliateDisclosure?: boolean }) {
  return (
    <footer className="border-t border-border bg-card" data-testid="footer">
      {/* ── Affiliate disclosure bar ── */}
      {showAffiliateDisclosure && <div className="bg-muted/40 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Affiliate Disclosure:</span>{' '}
            Bambana participates in affiliate programmes. We may earn a
            small commission when you shop through our links, at no extra cost
            to you. We only recommend products we genuinely stand behind.{' '}
            <Link href="/pages/terms-of-service">
              <span className="underline hover:text-primary transition-colors cursor-pointer">
                Learn more
              </span>
            </Link>
          </p>
        </div>
      </div>}

      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div>
            <h3
              className="font-serif font-bold text-base sm:text-lg mb-3 sm:mb-4"
              data-testid="footer-brand"
            >
              Bambana
            </h3>
            <p
              className="text-muted-foreground text-xs sm:text-sm leading-relaxed"
              data-testid="footer-description"
            >
              Curated home &amp; plant pieces for intentional small spaces.
              Hand-picked by a family-founded team in Austin.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/pages/about">
                  <span
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    data-testid="link-about"
                  >
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shop-the-look">
                  <span
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    data-testid="link-shop-the-look"
                  >
                    Shop the Look
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/pages/contact">
                  <span
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    data-testid="link-contact-page"
                  >
                    Contact
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/pages/privacy-policy">
                  <span
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    data-testid="link-privacy"
                  >
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/pages/terms-of-service">
                  <span
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    data-testid="link-terms"
                  >
                    Terms of Service
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:livebambana@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  data-testid="link-contact"
                >
                  livebambana@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t border-border pt-6 sm:pt-8 flex flex-col items-center gap-3 text-xs sm:text-sm text-muted-foreground">
          <a
            href="https://www.pinterest.com/ecoshopguide/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Follow us on Pinterest"
            data-testid="link-pinterest"
          >
            <svg
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
            </svg>
          </a>
          <p data-testid="footer-copyright">
            &copy; {new Date().getFullYear()} Bambana. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

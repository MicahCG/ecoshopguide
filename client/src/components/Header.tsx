import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import logoImage from '@assets/big_1761933095348.png';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/shop-the-look', label: 'Shop the Look' },
  { href: '/pages/about', label: 'About' },
];

function isActive(href: string, location: string) {
  return location.startsWith(href);
}

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Mobile: hamburger on left */}
          <div className="flex md:hidden items-center">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="h-9 w-9 mr-1">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 pt-8">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="space-y-1 px-2 mt-4">
                  {NAV_LINKS.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                      <div
                        className={cn(
                          'block px-4 py-3 text-sm font-medium rounded-md transition-colors',
                          isActive(link.href, location)
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-accent'
                        )}
                      >
                        {link.label}
                      </div>
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 px-2 sm:px-3 py-2 rounded-md transition-colors cursor-pointer" data-testid="button-home">
              <img src={logoImage} alt="EcoShopGuide" className="h-8 w-8 flex-shrink-0" />
              <span className="hidden sm:inline text-lg font-serif font-bold whitespace-nowrap">EcoShopGuide</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={isActive(link.href, location) ? 'default' : 'ghost'}
                  size="sm"
                  className="min-h-9"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Right side placeholder for layout balance */}
          <div className="w-9 md:w-auto" />
        </div>
      </div>
    </header>
  );
}

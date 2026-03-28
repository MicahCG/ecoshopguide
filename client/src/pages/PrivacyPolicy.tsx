import { Link } from 'wouter';
import { ArrowLeft, Shield, Eye, Lock, Mail, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageSEO } from '@/hooks/usePageSEO';

export default function PrivacyPolicy() {
  usePageSEO({
    title: 'Privacy Policy | EcoShopGuide',
    description:
      'Read the EcoShopGuide Privacy Policy to understand how we collect, use, and protect your information, including our use of Google AdSense and affiliate links.',
    canonical: 'https://ecoshopguide.com/pages/privacy-policy',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent pt-24 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/">
              <Button variant="ghost" className="mb-6" data-testid="button-back-home">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
              data-testid="text-page-title"
            >
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Last updated: March 2026
            </p>
            <p
              className="text-lg text-muted-foreground leading-relaxed"
              data-testid="text-page-intro"
            >
              At EcoShopGuide, we respect your privacy and are committed to
              protecting your personal information.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Information We Collect */}
          <Card className="mb-8" data-testid="card-information-collection">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p className="text-muted-foreground mb-2">
                  When you interact with our site, we may collect:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>
                    Name and email address (when you subscribe to our
                    newsletter)
                  </li>
                  <li>Reading preferences and content interactions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">
                  Automatically Collected Information
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Browser type and device information</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card className="mb-8" data-testid="card-information-use">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                {[
                  'Send newsletter emails and content updates (with your consent)',
                  'Respond to enquiries and customer service requests',
                  'Improve our website and content',
                  'Serve relevant advertisements through Google AdSense',
                  'Prevent fraud and maintain security',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* ── GOOGLE ADSENSE — required disclosure ── */}
          <Card
            className="mb-8 border-primary/30 bg-primary/5"
            data-testid="card-google-adsense"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-primary" />
                Google AdSense &amp; Advertising
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                EcoShopGuide uses <strong>Google AdSense</strong> to display
                advertisements. Google AdSense uses cookies to serve ads based
                on your prior visits to this site and other sites on the
                internet.
              </p>
              <p className="text-muted-foreground">
                Google's use of advertising cookies enables it and its partners
                to serve ads to you based on your visit to our site and/or
                other sites on the internet.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>
                  <strong>Advertising cookies:</strong> Google uses cookies
                  (such as the DoubleClick cookie) and web beacons to display
                  ads and to measure ad effectiveness.
                </li>
                <li>
                  <strong>Personalised ads:</strong> Ads you see may be
                  personalised based on your browsing history and interests.
                </li>
                <li>
                  <strong>Third-party vendors:</strong> Google, as a
                  third-party vendor, uses cookies to serve ads on our site.
                </li>
              </ul>
              <div className="bg-background rounded-lg border border-border p-4">
                <p className="text-sm text-muted-foreground mb-2 font-medium">
                  Opt out of personalised advertising:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside ml-2">
                  <li>
                    Visit{' '}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Google Ad Settings
                    </a>{' '}
                    to opt out of personalised advertising by Google.
                  </li>
                  <li>
                    Visit{' '}
                    <a
                      href="https://www.aboutads.info/choices/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      aboutads.info
                    </a>{' '}
                    to opt out of interest-based advertising from participating
                    companies.
                  </li>
                  <li>
                    You can also disable cookies in your browser settings,
                    though this may affect site functionality.
                  </li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground">
                For more information on how Google uses data when you use our
                site, visit:{' '}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  policies.google.com/technologies/partner-sites
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Affiliate Links */}
          <Card className="mb-8" data-testid="card-affiliate">
            <CardHeader>
              <CardTitle>Affiliate Links &amp; Commission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                EcoShopGuide participates in affiliate marketing programmes,
                including those managed through Impact.com. When you click an
                affiliate link and make a purchase, we may earn a small
                commission at no extra cost to you.
              </p>
              <p className="text-muted-foreground">
                Affiliate partners may use their own cookies and tracking
                technologies. We only recommend products we genuinely believe
                in.
              </p>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card className="mb-8" data-testid="card-data-protection">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Data Protection &amp; Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect
                your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>SSL encryption for all data transmission</li>
                <li>Regular security audits and updates</li>
                <li>Restricted access to personal data</li>
                <li>Secure data storage with encryption</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card className="mb-8" data-testid="card-data-sharing">
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                We do not sell, trade, or rent your personal information. We
                may share your data with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>
                  <strong>Email Service Providers:</strong> To send newsletters
                  (e.g. Resend)
                </li>
                <li>
                  <strong>Analytics Partners:</strong> To understand site
                  traffic (Google Analytics)
                </li>
                <li>
                  <strong>Advertising Partners:</strong> Google AdSense for
                  serving and personalising ads
                </li>
                <li>
                  <strong>Affiliate Networks:</strong> Impact.com for tracking
                  affiliate conversions
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="mb-8" data-testid="card-cookies">
            <CardHeader>
              <CardTitle>Cookies &amp; Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                We use cookies and similar technologies to enhance your
                browsing experience:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>
                  <strong>Essential Cookies:</strong> Required for site
                  functionality
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors use our site (Google Analytics)
                </li>
                <li>
                  <strong>Advertising Cookies:</strong> Used by Google AdSense
                  to display relevant ads based on your interests
                </li>
                <li>
                  <strong>Affiliate Cookies:</strong> Track referrals through
                  our affiliate links (Impact.com)
                </li>
              </ul>
              <p className="text-muted-foreground">
                You can control cookies through your browser settings. Note
                that disabling advertising cookies will not remove ads — it
                will make them less relevant to you.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="mb-8" data-testid="card-your-rights">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Opt-out of personalised advertising (see Google AdSense section above)</li>
                <li>Object to data processing</li>
                <li>Request data portability</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                To exercise these rights, contact us at{' '}
                <a
                  href="mailto:livebambana@gmail.com"
                  className="text-primary hover:underline"
                  data-testid="link-email"
                >
                  livebambana@gmail.com
                </a>
              </p>
            </CardContent>
          </Card>

          {/* Third-Party Links */}
          <Card className="mb-8" data-testid="card-third-party">
            <CardHeader>
              <CardTitle>Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our website contains links to third-party websites, including
                affiliate product links (Amazon, Mavely, and others). We are
                not responsible for the privacy practices of these external
                sites. Please review their privacy policies before providing
                any personal information.
              </p>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="mb-8" data-testid="card-children">
            <CardHeader>
              <CardTitle>Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our services are not directed to children under 13. We do not
                knowingly collect personal information from children. If you
                believe we have collected information from a child, please
                contact us immediately.
              </p>
            </CardContent>
          </Card>

          {/* Changes */}
          <Card className="mb-8" data-testid="card-changes">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by posting the new policy
                on this page and updating the "Last updated" date.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card data-testid="card-contact">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                If you have questions about this Privacy Policy, please contact
                us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong>{' '}
                  <a
                    href="mailto:livebambana@gmail.com"
                    className="text-primary hover:underline"
                    data-testid="link-email-contact"
                  >
                    livebambana@gmail.com
                  </a>
                </p>
                <p>
                  <strong>Location:</strong> Austin, Texas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}

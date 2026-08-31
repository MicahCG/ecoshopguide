import { Link } from 'wouter';
import { ArrowLeft, FileText, AlertCircle, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfService() {
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
              Terms of Service
            </h1>
            
            <p className="text-sm text-muted-foreground mb-6">
              Last updated: November 24, 2025
            </p>
            
            <p 
              className="text-lg text-muted-foreground leading-relaxed"
              data-testid="text-page-intro"
            >
              Please read these Terms of Service carefully before using Bambana.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="mb-8" data-testid="card-acceptance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using Bambana, you accept and agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our website or services.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-use-of-site">
            <CardHeader>
              <CardTitle>Use of Our Website</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">You agree to use our website only for lawful purposes. You must not:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>Use our site in any way that violates applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Transmit any harmful code, viruses, or malicious software</li>
                <li>Engage in any data mining, scraping, or automated data collection</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with the proper functioning of the website</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-content">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Content & Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                We strive to provide accurate and helpful content. However:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>Blog content is for informational purposes only</li>
                <li>We make no warranties about the completeness or accuracy of information</li>
                <li>Content may be updated or removed without notice</li>
                <li>Affiliate links may be included in some posts</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-returns">
            <CardHeader>
              <CardTitle>Returns & Refunds</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our return and refund policy is detailed on our{' '}
                <Link href="/pages/return-policy">
                  <a className="text-primary hover:underline" data-testid="link-return-policy">
                    Return Policy page
                  </a>
                </Link>
                . By making a purchase, you agree to the terms outlined in that policy.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-intellectual-property">
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                All content on this website, including text, graphics, logos, images, and software, is the 
                property of Bambana or its content suppliers and is protected by copyright and
                intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You may not reproduce, distribute, modify, or create derivative works from our content 
                without express written permission.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-affiliate">
            <CardHeader>
              <CardTitle>Affiliate Disclosure</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Bambana participates in affiliate marketing programs. We may earn commissions from
                qualifying purchases made through affiliate links on our website. This does not affect the 
                price you pay, and we only recommend products we genuinely believe in.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-user-content">
            <CardHeader>
              <CardTitle>User-Generated Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                By submitting reviews, comments, or other content to our website, you grant us a 
                non-exclusive, royalty-free, perpetual license to use, reproduce, modify, and display 
                that content.
              </p>
              <p className="text-muted-foreground">
                You are responsible for the content you submit and must ensure it does not violate any 
                third-party rights or applicable laws.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-primary/20 bg-primary/5" data-testid="card-disclaimer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Disclaimer of Warranties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Our website and services are provided "as is" without warranties of any kind, either 
                express or implied. We do not guarantee that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-6">
                <li>The website will be uninterrupted or error-free</li>
                <li>Defects will be corrected</li>
                <li>The website is free from viruses or harmful components</li>
                <li>Results from using our services will meet your requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-limitation">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-primary" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To the fullest extent permitted by law, Bambana shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages, including loss of 
                profits, data, or use, arising from your use of our website or services.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-indemnification">
            <CardHeader>
              <CardTitle>Indemnification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless Bambana from any claims, damages, losses,
                liabilities, and expenses arising from your use of our website, violation of these terms, 
                or infringement of any third-party rights.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-modifications">
            <CardHeader>
              <CardTitle>Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms of Service at any time. Changes will be 
                effective immediately upon posting. Your continued use of the website after changes 
                constitutes acceptance of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-governing-law">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms of Service are governed by and construed in accordance with the laws of 
                the State of Texas, United States, without regard to its conflict of law provisions.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-contact">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <p>
                <strong>Email:</strong>{' '}
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

          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground text-center italic">
              By using Bambana, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

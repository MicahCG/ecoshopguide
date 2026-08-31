import { Link } from 'wouter';
import { ArrowLeft, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageSEO } from '@/hooks/usePageSEO';

export default function Contact() {
  usePageSEO({
    title: 'Contact Us | Bambana',
    description:
      'Get in touch with the Bambana team. Reach out with questions, collaboration ideas, or feedback — we love hearing from our community.',
    canonical: 'https://shopbambana.com/pages/contact',
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        {/* ── Hero ── */}
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
              Get in Touch
            </h1>
            <p
              className="text-lg text-muted-foreground leading-relaxed"
              data-testid="text-page-intro"
            >
              We love hearing from our community. Whether you have a question,
              a collaboration idea, or just want to say hi — drop us a line.
            </p>
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {/* Email */}
            <Card data-testid="card-email">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-3">
                  For general questions, collaborations, or feedback:
                </p>
                <a
                  href="mailto:livebambana@gmail.com"
                  className="text-primary hover:underline font-medium"
                  data-testid="link-email"
                >
                  livebambana@gmail.com
                </a>
                <p className="text-muted-foreground text-xs mt-3">
                  We typically respond within 1–2 business days.
                </p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card data-testid="card-location">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Based In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-sm mb-1">Austin, Texas</p>
                <p className="text-muted-foreground text-sm">
                  Family-founded by Cydel &amp; Mersula Giraudel, rooted in
                  Dominica, The Nature Island.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What to reach out about */}
          <Card className="mb-8" data-testid="card-topics">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                What to Reach Out About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside ml-2">
                <li>Product or brand collaborations</li>
                <li>Questions about something you found on our site</li>
                <li>Content feedback or corrections</li>
                <li>Press or media inquiries</li>
                <li>
                  Anything else — we genuinely enjoy hearing from readers
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Social */}
          <div className="text-center text-sm text-muted-foreground">
            You can also find us on{' '}
            <a
              href="https://www.pinterest.com/ecoshopguide/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              data-testid="link-pinterest"
            >
              Pinterest
            </a>
            .
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

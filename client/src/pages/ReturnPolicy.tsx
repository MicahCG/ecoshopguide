import { Link } from "wouter";
import {
  ArrowLeft,
  Mail,
  Package,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent pt-24 pb-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/">
              <Button
                variant="ghost"
                className="mb-6"
                data-testid="button-back-home"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4"
              data-testid="text-page-title"
            >
              Return & Refund Policy
            </h1>

            <p className="text-sm text-muted-foreground mb-6">
              Last updated: November 24, 2025
            </p>

            <p
              className="text-lg text-muted-foreground leading-relaxed"
              data-testid="text-page-intro"
            >
              At Bambana, we want you to love your purchase. If you're
              not completely satisfied with your order, we're here to help.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="mb-8" data-testid="card-returns">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Returns
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-2">
                  Return Window: 30 days from delivery date
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Eligible Items
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Unused products in original packaging</li>
                  <li>Items in resalable condition</li>
                  <li>All tags and labels attached</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-destructive" />
                  Non-Returnable Items
                </h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Items marked as final sale</li>
                  <li>Opened candles or personal care items</li>
                  <li>Custom or personalized products</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-return-process">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                How to Return an Item
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    1
                  </span>
                  <div>
                    <p className="font-semibold">
                      Contact us within 30 days of receiving your order
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Email:{" "}
                      <a
                        href="mailto:livebambana@gmail.com"
                        className="text-primary hover:underline"
                        data-testid="link-email-support"
                      >
                        livebambana@gmail.com
                      </a>
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Subject: "Return Request - Order #[Your Order Number]"
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    2
                  </span>
                  <div>
                    <p className="font-semibold">
                      Provide the following information
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm mt-1 ml-4">
                      <li>Order number</li>
                      <li>Item(s) you wish to return</li>
                      <li>Reason for return</li>
                      <li>Photos if item is damaged or defective</li>
                    </ul>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    3
                  </span>
                  <div>
                    <p className="font-semibold">Wait for approval</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm mt-1 ml-4">
                      <li>We'll respond within 2 business days</li>
                      <li>You'll receive return shipping instructions</li>
                    </ul>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                    4
                  </span>
                  <div>
                    <p className="font-semibold">Ship your return</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm mt-1 ml-4">
                      <li>Package items securely in original packaging</li>
                      <li>Include all accessories and documentation</li>
                      <li>Use a trackable shipping service</li>
                    </ul>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-refunds">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Refunds
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">Processing Time:</p>
                <p className="text-muted-foreground">
                  5-7 business days after we receive your return
                </p>
              </div>
              <div>
                <p className="font-semibold">Refund Method:</p>
                <p className="text-muted-foreground">Original payment method</p>
              </div>
              <div>
                <p className="font-semibold">Refund Amount:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Full product cost (minus original shipping)</li>
                  <li>
                    Return shipping costs are non-refundable unless item is
                    defective
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-exchanges">
            <CardHeader>
              <CardTitle>Exchanges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                We currently don't offer direct exchanges. To exchange an item:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Return the original item for a refund</li>
                <li>Place a new order for the item you want</li>
              </ol>
            </CardContent>
          </Card>

          <Card
            className="mb-8 border-primary/20 bg-primary/5"
            data-testid="card-damaged"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Damaged or Defective Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-3">
                We cover return shipping for damaged or defective items.
              </p>
              <p className="text-muted-foreground mb-3">
                Contact us immediately if you receive:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6 mb-3">
                <li>Damaged items</li>
                <li>Wrong items</li>
                <li>Defective products</li>
              </ul>
              <p className="text-muted-foreground">
                We'll send a prepaid return label and ship a replacement at no
                cost to you.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8" data-testid="card-shipping">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Shipping Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="text-foreground font-medium italic">
                  Each piece is hand-picked and carefully packaged to ensure quality. Please allow 7-15 business days for your order to arrive.
                </p>
              </div>

              <div>
                <p className="font-semibold">Processing Time:</p>
                <p className="text-muted-foreground">3-7 business days</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Many of our products are made-to-order to reduce waste and support sustainable practices.
                </p>
              </div>

              <div>
                <p className="font-semibold">Delivery Time (Domestic US):</p>
                <p className="text-muted-foreground">7-15 business days</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Total estimated delivery: 7-15 business days from order date
                </p>
              </div>

              <div>
                <p className="font-semibold">Shipping Costs:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Free shipping on all orders</li>
                  <li>Delivery in 7-15 business days</li>
                </ul>
              </div>

              <div>
                <p className="font-semibold">International Shipping:</p>
                <p className="text-muted-foreground">
                  Currently available to Canada only. Delivery time: 15-20 business days.
                </p>
              </div>

              <div>
                <p className="font-semibold">Tracking Information:</p>
                <p className="text-muted-foreground">
                  You'll receive a tracking number via email once your order ships. Please allow 2-3 days for tracking to become active.
                </p>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <p className="font-semibold mb-2">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-6">
                  <li>Custom orders may take additional processing time</li>
                  <li>Delivery times are estimates and may vary during peak seasons</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-contact">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Questions about returns or exchanges?
              </p>

              <div>
                <p className="font-semibold">Email:</p>
                <a
                  href="mailto:livebambana@gmail.com"
                  className="text-primary hover:underline"
                  data-testid="link-email-contact"
                >
                  livebambana@gmail.com
                </a>
              </div>

              <div>
                <p className="font-semibold">Response Time:</p>
                <p className="text-muted-foreground">
                  Within 24 hours (Monday-Friday, 9am-5pm EST)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground text-center italic">
              By making a purchase from Bambana, you agree to this Return
              & Refund Policy.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

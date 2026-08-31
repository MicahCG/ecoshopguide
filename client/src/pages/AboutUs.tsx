import { Link } from 'wouter';
import { ArrowLeft, Mail, MapPin, Calendar, Heart, Leaf, Truck, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SiPinterest } from 'react-icons/si';
import mersulPhoto from '@assets/mersula_giraudel_founder.png';
import cydelPhoto from '@assets/cydel_giraudel_founder.jpeg';
import dominicaImage from '@assets/dominica_nature_island.jpeg';

export default function AboutUs() {
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
              className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
              data-testid="text-page-title"
            >
              About Bambana
            </h1>
            
            <p 
              className="text-lg text-muted-foreground leading-relaxed mb-4"
              data-testid="text-page-intro"
            >
              Bambana is a curated resource for people who care about sustainable living. We hand-pick every guide and recommendation — not because an algorithm told us to, but because we live this way ourselves.
            </p>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-xl font-serif font-bold mb-2">Our Mission</h2>
                  <p className="text-foreground">
                    Curated pieces for intentional small spaces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Roots - Dominica with background image */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${dominicaImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/85 via-green-800/80 to-emerald-900/75" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-green-300" />
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white">Our Roots: Dominica, The Nature Island</h3>
            </div>
            <p className="text-white/95 text-lg leading-relaxed mb-4 max-w-2xl">
              Dominica is one of the most pristine natural environments on Earth, with 365 rivers, volcanic peaks, and rainforests that feel untouched by time. It's where we learned that living in harmony with nature isn't a trend; it's a way of life.
            </p>
            <p className="text-white/80 leading-relaxed max-w-2xl">
              That island spirit of wellness, sustainability, and natural beauty is woven into every product we curate for your home.
            </p>
          </div>
        </div>

        {/* Founder Story Section */}
        <div className="bg-gradient-to-br from-green-50/50 to-primary/5 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-serif font-bold">Meet the Family Behind Bambana</h2>
            </div>

            {/* Photos - Large, side by side at top */}
            <div className="grid grid-cols-2 gap-6 mb-10 max-w-2xl mx-auto">
              <div className="relative pb-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={cydelPhoto}
                    alt="Cydel Giraudel, Co-founder of Bambana"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-md px-4 py-2 whitespace-nowrap">
                  <p className="text-base font-medium text-primary text-center">Cydel</p>
                  <p className="text-xs text-muted-foreground text-center">Co-founder</p>
                </div>
              </div>
              <div className="relative pb-6">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={mersulPhoto}
                    alt="Mersula Giraudel, Co-founder of Bambana"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-md px-4 py-2 whitespace-nowrap">
                  <p className="text-base font-medium text-primary text-center">Mersula</p>
                  <p className="text-xs text-muted-foreground text-center">Co-founder</p>
                </div>
              </div>
            </div>

            {/* Story - Below photos */}
            <div className="space-y-4 max-w-2xl mx-auto text-center">
              <p className="text-lg text-foreground leading-relaxed">
                Hi! We're <span className="font-semibold">Cydel</span> and <span className="font-semibold">Mersula Giraudel</span> — a mother-son duo from <span className="font-semibold text-primary">Dominica</span>, a tiny Caribbean island nicknamed "The Nature Island."
              </p>

              <p className="text-muted-foreground leading-relaxed">
                Growing up surrounded by rainforests, volcanic hot springs, and 365 rivers, we developed an eye for natural beauty that stuck with us. When we moved to Austin, Texas, we kept looking for home pieces that felt earthy and intentional — not mass-produced and soulless.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                We'd find great stuff eventually, but it took forever to dig through thousands of generic options online. So we built Bambana: one curated resource where every guide is hand-picked for natural aesthetic, quality, and sustainable living.
              </p>

              <div className="bg-white/70 rounded-lg p-4 border border-primary/10 text-left">
                <p className="text-sm text-foreground italic">
                  "Think of us as the friend who already found the good stuff, so you don't have to."
                </p>
                <p className="text-xs text-primary mt-2 font-medium">- Cydel & Mersula</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-serif font-bold mb-6" data-testid="text-our-values">
            Our Values
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            <Card data-testid="card-eco-aesthetic">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Curated, Not Cluttered</h3>
                    <p className="text-muted-foreground text-sm">
                      Every product is hand-selected. If we wouldn't put it in our own home, we don't carry it.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-quality-curation">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Rooted in Nature</h3>
                    <p className="text-muted-foreground text-sm">
                      Natural textures, organic shapes, warm tones. Our Dominica roots show in everything we pick.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-worldwide-shipping">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Free Shipping, Always</h3>
                    <p className="text-muted-foreground text-sm">
                      No minimums, no tricks. Every order ships free with tracking.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-quality">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Small Space Specialists</h3>
                    <p className="text-muted-foreground text-sm">
                      Most of our pieces are designed for apartments, studios, and rooms where every inch matters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <Card data-testid="card-founded">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Founded</h3>
                    <p className="text-muted-foreground">2025</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-location">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Location</h3>
                    <p className="text-muted-foreground">Austin, Texas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8" data-testid="card-contact">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Contact
              </h3>
              <a 
                href="mailto:livebambana@gmail.com" 
                className="text-primary hover:underline"
                data-testid="link-email"
              >
                livebambana@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card data-testid="card-social">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Social Media</h3>
              <a 
                href="https://pinterest.com/ecoshopguide"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
                data-testid="link-pinterest"
              >
                <SiPinterest className="w-5 h-5" />
                Pinterest
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

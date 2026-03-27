import { Link } from "wouter";
import { ArrowRight, Leaf, Armchair, Circle, RectangleHorizontal, Frame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@assets/warm-boho-living-room-hero.png";

const SHOP_URL = "https://www.2modern.com/collections/living-room-furniture";

const PRODUCTS = [
  {
    icon: Armchair,
    title: "Mid-Century Wood-Frame Armchair",
    description:
      "A low-profile armchair with warm wood arms and a soft grey cushion anchors the nook — equal parts vintage character and everyday comfort.",
  },
  {
    icon: Circle,
    title: "Moroccan Leather Pouf",
    description:
      "A hand-stitched leather pouf in rich, weathered brown adds organic texture and flexible seating right at floor level.",
  },
  {
    icon: RectangleHorizontal,
    title: "Carved Drum Coffee Table",
    description:
      "A solid round drum table in dark carved wood brings grounding warmth, doubling as a display surface for candles and books.",
  },
  {
    icon: Leaf,
    title: "Lush Indoor Plant Collection",
    description:
      "Palms, monstera, ferns, and trailing pothos layered at every height turn this corner into a living, breathing jungle retreat.",
  },
  {
    icon: Frame,
    title: "Live-Edge Mirror & Woven Wall Art",
    description:
      "A rustic live-edge framed mirror paired with dried-floral wall hangings adds depth and artisan character to the sage-toned walls.",
  },
];

export default function WarmBohoLivingRoom() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative w-full">
          <div className="max-w-6xl mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12 md:pb-20">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-4 text-center">
              Pinterest Pick
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-[3.4rem] font-bold text-center max-w-3xl mx-auto leading-tight">
              Discover Warm Boho Vibes in This Cozy Living Room
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Cozy vibes meet grounded charm in this earthy boho living room
              retreat — think layered textures, warm neutrals, woven accents,
              and soft ambient lighting that makes every corner feel inviting.
            </p>
          </div>

          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Cozy boho living room corner with mid-century armchair, leather pouf, indoor plants, and warm earthy tones"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* ── Aesthetic intro ── */}
        <section className="max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-4">
            The Aesthetic
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
            Earthy Bohemian Meets Collected Comfort
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            This is the kind of corner that makes you cancel plans. Sage green
            walls set a quiet, grounded mood while layers of warm brown leather,
            hand-woven textiles, and burnished brass catch the soft light
            filtering through sheer linen curtains. Every surface tells a story
            — a live-edge mirror, a carved drum table stacked with well-loved
            books, dried-floral wall art, and potted plants at every height that
            make the room feel like it is breathing. It is bohemian without
            trying too hard: personal, earthy, and impossibly inviting.
          </p>
        </section>

        {/* ── Product spotlight ── */}
        <section className="bg-[hsl(30_30%_96%)] py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-4 text-center">
              Shop the Details
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
              What Makes This Look
            </h2>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {PRODUCTS.map((product) => (
                <div
                  key={product.title}
                  className="bg-background rounded-xl p-6 md:p-8 border border-border/60"
                >
                  <product.icon className="w-6 h-6 text-primary/70 mb-4" />
                  <h3 className="font-serif text-lg font-semibold mb-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-4">
              Ready to Recreate This Look?
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-5">
              Shop the Look
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
              We have gathered modern and artisan living room pieces that
              capture the same earthy warmth — textured seating, carved wood
              surfaces, and lush greenery to bring this boho nook to life in
              your own home.
            </p>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background font-semibold text-sm tracking-wider uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Shop the Look <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* ── More inspiration ── */}
        <section className="border-t py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
            <p className="text-muted-foreground mb-4">
              Looking for more inspiration?
            </p>
            <Link href="/shop-the-look">
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase hover:text-primary transition-colors">
                Browse all looks <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

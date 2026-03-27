import { Link } from "wouter";
import { ArrowRight, Leaf, Flame, Bed, TreePine, Scroll } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@assets/jungle-spa-vibes-hero.png";

const SHOP_URL = "https://mavely.app.link/pW8ItLkdR1b";

const PRODUCTS = [
  {
    icon: Bed,
    title: "Canopied Daybed with Linen Drapes",
    description:
      "A low wooden daybed draped in flowing natural linen creates the ultimate retreat within a retreat — a nest made for unwinding.",
  },
  {
    icon: Flame,
    title: "Scattered Pillar Candles & Glass Votives",
    description:
      "Dozens of candles in every size line the steps, ledges, and floor, replacing electric light with a warm, flickering glow that feels almost ceremonial.",
  },
  {
    icon: Leaf,
    title: "Overhead Tropical Greenery & Trailing Vines",
    description:
      "Banana leaves, ferns, and cascading vines drape from heavy timber beams, turning the ceiling into a dense jungle canopy threaded with string lights.",
  },
  {
    icon: TreePine,
    title: "Rustic Timber Beams & Concrete Steps",
    description:
      "Massive reclaimed wood beams frame the space while raw concrete steps and platforms give the room an open-air, Bali-inspired pavilion feel.",
  },
  {
    icon: Scroll,
    title: "Woven Jute Rugs & Floor Cushion Lounge",
    description:
      "Layered striped jute rugs and a low-profile floor cushion create a grounded lounge area — perfect for meditation, reading, or simply doing nothing.",
  },
];

export default function JungleSpaVibes() {
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
              Bring Jungle Spa Vibes Into Your Space
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Step into jungle calm with this dreamy eco wellness retreat scene
              filled with lush greenery, glowing candles, and spa-inspired
              textures. Perfect for your next self-care reset — create cozy
              junglecore vibes at home with tips for earthy lighting and
              grounding spaces.
            </p>
          </div>

          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Jungle spa retreat with canopied daybed, scattered candles, tropical greenery, timber beams, and woven rugs"
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
            Bali Pavilion Meets Candlelit Sanctuary
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            This is the space you picture when someone says "wellness retreat."
            Heavy timber beams hold up a living ceiling of tropical vines and
            string lights, while concrete steps lead down into a softly lit
            lounge where a canopied daybed waits behind flowing linen curtains.
            Every surface is dotted with pillar candles — on the steps, beside
            the plants, nestled between stones — their warm amber glow the
            only light source in the room. Woven jute rugs soften the raw
            floor, and a low cushion lounge invites you to sit, breathe, and
            let the jungle do the rest. It is equal parts grounding and
            magical — a space that proves self-care can be built into the
            architecture of your home.
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
              We have gathered jungle-inspired essentials to bring this
              retreat energy home — candles, linen drapes, tropical planters,
              woven textiles, and grounding accents for your own wellness
              sanctuary.
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

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-background/95 backdrop-blur border-t px-4 py-3">
        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-foreground text-background font-semibold text-sm tracking-wider uppercase py-3.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Get the Look <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { ArrowRight, Sparkles, Flower2, Lamp, GlassWater, Crown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@assets/dreamy-boho-garden-wedding-hero.png";

const SHOP_URL = "https://mavely.app.link/CbzSCyAcR1b";

const PRODUCTS = [
  {
    icon: Flower2,
    title: "Tall Blush Floral Centerpieces",
    description:
      "Towering arrangements of garden roses, cherry blossoms, orchids, and hydrangeas in soft pinks and ivory set the romantic tone for every table.",
  },
  {
    icon: Crown,
    title: "Gold Round-Back Dining Chairs",
    description:
      "Polished gold-framed chairs with cream upholstery add a regal, contemporary edge to the classic reception setting.",
  },
  {
    icon: Lamp,
    title: "Rose Gold Lantern Chandeliers",
    description:
      "Hanging lantern-style fixtures in warm rose gold cast a soft, ambient glow across the vaulted ceilings.",
  },
  {
    icon: GlassWater,
    title: "Glass Cylinder Vases & Floating Candles",
    description:
      "Clusters of clear glass cylinders filled with water and floating candles create a dreamy, flickering tablescape.",
  },
  {
    icon: Sparkles,
    title: "Crystal Glassware & Gold Flatware",
    description:
      "Elegant crystal stemware paired with gold-accented place settings tie together the luxe, garden-party palette.",
  },
];

export default function DreamyBohoGardenWedding() {
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
              Discover a Dreamy Boho Garden Wedding Spot
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Soft linen textures, hanging lanterns glowing under golden hour
              light, and vintage garden details — this enchanted reception is
              everything a whimsical spring wedding should be.
            </p>
          </div>

          {/* Full-width hero image */}
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Dreamy boho garden wedding reception with blush florals, gold chairs, and lantern chandeliers"
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
            Rustic-Luxe Meets Garden Romance
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Imagine a grand hall bathed in natural light from soaring arched
            windows, its vaulted ceilings lined with warm wooden beams.
            Every surface glows with blush and ivory — from the cascading
            cherry blossom centerpieces down to the flickering candles
            reflected in polished gold frames. This is where fairy-tale
            elegance meets effortless bohemian warmth: soft enough to feel
            intimate, refined enough to take your breath away.
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
              We have curated eco-friendly picks that capture the same blush
              tones, golden accents, and garden-party romance — so you can
              bring this dreamy aesthetic to your own celebration.
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
              Looking for more wedding inspiration?
            </p>
            <Link href="/blog">
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase hover:text-primary transition-colors">
                Browse all articles <ArrowRight className="w-4 h-4" />
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

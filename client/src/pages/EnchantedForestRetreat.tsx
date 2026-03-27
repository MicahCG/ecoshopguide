import { Link } from "wouter";
import { ArrowRight, TreePine, Lamp, Flower2, Armchair, Scroll } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@assets/enchanted-forest-retreat-hero.png";

const SHOP_URL = "https://mavely.app.link/cV5fH4NcR1b";

const PRODUCTS = [
  {
    icon: Flower2,
    title: "Cascading Autumn Floral Arch",
    description:
      "A lush ceremony arch dripping with burgundy amaranth, burnt orange dahlias, peach roses, and trailing greenery — the kind of wild, untamed arrangement that feels plucked straight from a forest fairy tale.",
  },
  {
    icon: Lamp,
    title: "Hanging Iron Lanterns",
    description:
      "Vintage-style iron lanterns suspended from the arch, casting a warm amber glow that dances through the canopy of leaves overhead.",
  },
  {
    icon: TreePine,
    title: "Living Tree Canopy & Moss Accents",
    description:
      "Mature trees frame the aisle with dappled light filtering through their canopy, while mossy textures and trailing vines blur the line between decor and nature.",
  },
  {
    icon: Armchair,
    title: "Rustic Wooden Folding Chairs",
    description:
      "Warm-toned wooden folding chairs with padded seats keep the look grounded and organic — perfectly at home in an outdoor woodland setting.",
  },
  {
    icon: Scroll,
    title: "Vintage Persian Aisle Runner",
    description:
      "A richly patterned Persian rug anchors the ceremony aisle, adding soulful, layered texture against the raw stone and earth tones of the forest floor.",
  },
];

export default function EnchantedForestRetreat() {
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
              Explore This Dreamy Enchanted Forest Retreat Vibe
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Step into the glow of an Enchanted Forest Haven, where moody
              greens, warm wood tones, and soft golden light create a storybook
              feel. Think mossy textures, fairycore accents, cottage-inspired
              details, and magical forest atmosphere.
            </p>
          </div>

          {/* Full-width hero image */}
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Enchanted forest wedding ceremony with autumn floral arch, hanging lanterns, and vintage Persian rug aisle runner"
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
            Woodland Fairy Tale Meets Bohemian Warmth
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Picture a hidden clearing beneath a living canopy of sycamores and
            oaks, their autumn-kissed leaves filtering golden hour light onto
            the ceremony below. A grand floral arch bursts with deep burgundy,
            burnt sienna, and blush — cascading like wildflowers that nature
            arranged herself. Vintage lanterns sway gently overhead, pillar
            candles line the stone path, and a richly patterned rug leads the
            way down an aisle framed by overflowing garden arrangements. It is
            equal parts untamed and intentional — a space that feels like
            stepping into the pages of an enchanted storybook.
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
              We have curated eco-friendly picks that capture the same woodland
              magic — rich autumn tones, vintage textures, and enchanted forest
              vibes for your own celebration or reading nook.
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

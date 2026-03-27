import { Link } from "wouter";
import { ArrowRight, Leaf, Flame, Bath, Lamp, TreePine } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import heroImage from "@assets/jungle-spa-retreat-hero.png";

const SHOP_URL = "https://mavely.app.link/pW8ItLkdR1b";

const PRODUCTS = [
  {
    icon: TreePine,
    title: "Reclaimed Wood Plank Walls",
    description:
      "Rich, weathered wood plank paneling wraps every surface, creating a warm cocoon that feels like stepping inside a hidden forest cabin.",
  },
  {
    icon: Leaf,
    title: "Trailing Ferns & Wall-Mounted Planters",
    description:
      "Cascading ferns, pothos, and string-of-pearls spill from rustic wall-mounted planters and overhead shelves, turning the ceiling into a living canopy.",
  },
  {
    icon: Flame,
    title: "Glass Pillar Candles & Iron Lanterns",
    description:
      "Clusters of flickering candles in clear glass holders and a vintage iron lantern cast a soft, amber glow — the only light source this space needs.",
  },
  {
    icon: Bath,
    title: "Sunken Soaking Tub with Wood Surround",
    description:
      "A deep soaking tub set into a thick reclaimed wood surround invites you to sink in and disappear — the centerpiece of this at-home spa ritual.",
  },
  {
    icon: Lamp,
    title: "Organic Linen Towels & Stone Tray",
    description:
      "Neatly rolled linen towels stacked on a carved stone tray add a spa-worthy finishing touch — simple, tactile, and grounding.",
  },
];

export default function JungleSpaRetreat() {
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
              Bring a Jungle Spa Retreat Home to Relax
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Soft light, lush plants, and organic textures turn this jungle
              oasis into a cozy eco-friendly spa retreat. Find ideas for slow
              living, calm routines, and mindful spaces filled with natural
              light and fresh air.
            </p>
          </div>

          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Jungle spa bathroom retreat with reclaimed wood walls, trailing ferns, candlelight, and a sunken soaking tub"
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
            Candlelit Jungle Meets At-Home Sanctuary
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Imagine a bathroom that feels less like a room and more like a
            hidden grotto deep in a tropical forest. Reclaimed wood planks
            climb every wall and frame a sunken soaking tub, while dozens of
            trailing ferns and vines cascade from above until the ceiling
            disappears into a living canopy of green. The only light comes
            from clusters of pillar candles and a single iron lantern, their
            warm glow reflecting off the still water below. Stacked linen
            towels sit ready on a stone tray. The air smells like earth,
            greenery, and calm. This is what slow living looks like — a
            space designed for nothing but rest.
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
              We have gathered nature-inspired pieces that bring the same
              restorative energy home — lush planters, warm wood accents,
              candlelight essentials, and organic bath linens for your own
              peaceful sanctuary.
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

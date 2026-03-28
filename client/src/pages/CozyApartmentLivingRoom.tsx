import { Link } from "wouter";
import { ArrowRight, Sofa, Leaf, Flame, Circle, Frame } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { usePageSEO } from "@/hooks/usePageSEO";
import heroImage from "@assets/cozy-apartment-living-room-hero.png";

const SHOP_URL = "https://mavely.app.link/fjJPuIWcR1b";

const PRODUCTS = [
  {
    icon: Sofa,
    title: "Deep Linen Slipcovered Sofa",
    description:
      "An oversized, cloud-soft sofa in natural linen with sink-in cushions — the kind of couch you build your entire room around.",
  },
  {
    icon: Circle,
    title: "Woven Rattan Baskets & Pouf",
    description:
      "Textured rattan baskets for storage and a dark woven pouf for extra seating add warmth and function without cluttering a small space.",
  },
  {
    icon: Flame,
    title: "Stucco Fireplace & Reclaimed Wood Mantel",
    description:
      "A rustic white stucco fireplace topped with a chunky reclaimed wood mantel shelf creates the ultimate cozy focal point — even in a small apartment.",
  },
  {
    icon: Leaf,
    title: "Macrame Hanging Planters & Greenery",
    description:
      "Macrame plant hangers, a fiddle leaf fig, trailing pothos, and an aloe cluster bring life and fresh air to every corner without taking up floor space.",
  },
  {
    icon: Frame,
    title: "Woven Basket Wall Art & Ceramic Vases",
    description:
      "A trio of woven baskets mounted above the mantel and earthy ceramic vases add artisan character and warmth to the white plaster walls.",
  },
];

export default function CozyApartmentLivingRoom() {
  usePageSEO({
    title: "Cozy Apartment Living Room Decor Ideas | EcoShopGuide",
    description:
      "Small living room ideas for your first apartment: linen sofas, macrame planters, woven baskets, and cozy fireplace styling. Budget-friendly eco decor for any apartment living room.",
    canonical: "https://ecoshopguide.com/pages/cozy-apartment-living-room",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <AffiliateDisclosure />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative w-full">
          <div className="max-w-6xl mx-auto px-4 md:px-6 pt-16 md:pt-24 pb-12 md:pb-20">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-4 text-center">
              Pinterest Pick
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-[3.4rem] font-bold text-center max-w-3xl mx-auto leading-tight">
              Small Living Room Ideas for Your First Apartment
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              New place, blank walls, and no idea how to style your living room? Start with a comfy couch, a simple coffee table, a few plants, and warm lighting for a cozy living room vibe. These budget-friendly decor ideas work for any apartment living room.
            </p>
          </div>
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Cozy apartment living room with linen sofa, woven baskets, fireplace, macrame planters, and warm neutral tones"
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
            Warm Neutrals, Natural Textures, Instant Comfort
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            This room proves you do not need a big budget or a big space to create somewhere that feels like home. A deep linen sofa loaded with textured throw pillows sits against a reclaimed wood accent wall, while a crackling fireplace framed in white stucco fills the room with warmth. Macrame planters hang at staggered heights, woven baskets line the floor, and a chunky knit area rug ties everything together underfoot. The palette stays in the land of oatmeal, sand, and sage — quiet enough to relax in, layered enough to feel rich and lived-in from day one.
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
              We have gathered budget-friendly, apartment-ready pieces that capture the same cozy, layered feel — so you can go from blank walls to a space that actually feels like yours.
            </p>
            <a
              href={SHOP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background font-semibold text-sm tracking-wider uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity"
            >
              Shop the Look
              <ArrowRight className="w-4 h-4" />
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
                Browse all looks
                <ArrowRight className="w-4 h-4" />
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
          Get the Look
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

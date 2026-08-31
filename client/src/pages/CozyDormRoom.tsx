import { Link } from "wouter";
import { ArrowRight, Leaf, Lightbulb, Bed, Frame, RectangleHorizontal } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { usePageSEO } from "@/hooks/usePageSEO";
import heroImage from "@assets/cozy-dorm-room-hero.png";

const SHOP_URL = "https://mavely.app.link/1pwRdJJdR1b";

const PRODUCTS = [
  {
    icon: Bed,
    title: "White Linen Bedding & Textured Throw Pillows",
    description:
      "A crisp white duvet layered with sherpa, striped, and ruffled throw pillows turns a standard dorm mattress into an inviting cloud you actually want to come home to.",
  },
  {
    icon: Lightbulb,
    title: "Warm Fairy String Lights",
    description:
      "A strand of warm white fairy lights draped along the ceiling instantly softens harsh overhead fluorescents and makes the whole room glow.",
  },
  {
    icon: Leaf,
    title: "Hanging Pothos & Snake Plant",
    description:
      "A lush hanging pothos by the window and a potted snake plant on the sill bring life and fresh air into a small space — both are low-maintenance and dorm-proof.",
  },
  {
    icon: RectangleHorizontal,
    title: "Moroccan Diamond Area Rug",
    description:
      "A cozy cream-and-black diamond-patterned rug covers the dorm floor, adding warmth and texture underfoot while tying the neutral palette together.",
  },
  {
    icon: Frame,
    title: "Gallery Wall & Photo Collage",
    description:
      "Art prints, postcards, photos, and paper clippings pinned to the wall create a personal gallery that makes a cookie-cutter dorm feel uniquely yours.",
  },
];

export default function CozyDormRoom() {
  usePageSEO({
    title: "Cozy Dorm Room Decor Ideas | Bambana",
    description:
      "Transform your dorm room with cozy, eco-friendly decor: white linen bedding, warm fairy lights, hanging plants, Moroccan rugs, and a personal gallery wall. Budget-friendly dorm ideas.",
    canonical: "https://shopbambana.com/pages/cozy-dorm-room",
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
              Cozy Dorm Room Ideas for an Eco-Friendly Refresh
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Create a cozy, eco-conscious dorm vibe with earthy textures, warm fairy lights, and thrifted finds that feel like home. Think neutral palettes, natural wood, and soft woven blankets on a budget.
            </p>
          </div>
          <div className="max-w-5xl mx-auto px-4 md:px-6">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={heroImage}
                alt="Cozy dorm room with white bedding, fairy lights, hanging plants, Moroccan rug, and personal gallery wall"
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
            Warm Neutrals, Fairy Lights & Personal Touches
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
            Proof that a tiny dorm room can feel like a sanctuary. The entire palette stays in soft whites, creams, and natural wood tones, letting texture do all the talking — a sherpa throw here, a faux-fur pillow there, a tasseled Moroccan rug underfoot. Fairy lights trace the ceiling like a warm halo, a hanging pothos brings the outdoors in beside the window, and every inch of wall space is covered with a curated collage of art prints, photos, and postcards. It is budget-friendly, renter-friendly, and completely personal — the kind of room that makes you want to skip the library and study right here.
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
              We have gathered budget-friendly, eco-conscious picks to help you recreate this cozy dorm vibe — soft bedding, warm lighting, easy-care plants, and textured rugs that make any small space feel like home.
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

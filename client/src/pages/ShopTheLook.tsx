import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import weddingHero from "@assets/dreamy-boho-garden-wedding-hero.png";
import forestHero from "@assets/enchanted-forest-retreat-hero.png";
import bohoLivingHero from "@assets/warm-boho-living-room-hero.png";
import cozyAptHero from "@assets/cozy-apartment-living-room-hero.png";
import jungleSpaHero from "@assets/jungle-spa-retreat-hero.png";
import jungleVibesHero from "@assets/jungle-spa-vibes-hero.png";
import dormHero from "@assets/cozy-dorm-room-hero.png";

interface LookCard {
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

const LOOKS: LookCard[] = [
  {
    title: "Dreamy Boho Garden Wedding",
    subtitle:
      "Blush florals, gold accents, and lantern chandeliers — a fairy-tale reception that feels effortlessly romantic.",
    image: weddingHero,
    href: "/pages/dreamy-boho-garden-wedding",
  },
  {
    title: "Enchanted Forest Retreat",
    subtitle:
      "Moody greens, autumn florals, hanging lanterns, and a vintage Persian rug — a woodland ceremony straight from a storybook.",
    image: forestHero,
    href: "/pages/enchanted-forest-retreat",
  },
  {
    title: "Warm Boho Living Room",
    subtitle:
      "Earthy neutrals, layered textures, lush plants, and a Moroccan leather pouf — a cozy corner that feels like a hug.",
    image: bohoLivingHero,
    href: "/pages/warm-boho-living-room",
  },
  {
    title: "Cozy Apartment Living Room",
    subtitle:
      "A deep linen sofa, crackling fireplace, macrame planters, and woven textures — budget-friendly first-apartment goals.",
    image: cozyAptHero,
    href: "/pages/cozy-apartment-living-room",
  },
  {
    title: "Jungle Spa Retreat",
    subtitle:
      "Reclaimed wood, trailing ferns, candlelight, and a sunken soaking tub — an at-home sanctuary built for slow living.",
    image: jungleSpaHero,
    href: "/pages/jungle-spa-retreat",
  },
  {
    title: "Jungle Spa Vibes",
    subtitle:
      "A canopied daybed, scattered candles, tropical vines, and timber beams — Bali-inspired wellness right at home.",
    image: jungleVibesHero,
    href: "/pages/jungle-spa-vibes",
  },
  {
    title: "Cozy Eco-Friendly Dorm Room",
    subtitle:
      "Fairy lights, white bedding, a Moroccan rug, and hanging plants — budget-friendly dorm styling with sustainable charm.",
    image: dormHero,
    href: "/pages/cozy-dorm-room",
  },
];

export default function ShopTheLook() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Page header ── */}
        <section className="pt-24 md:pt-32 pb-10 md:pb-14">
          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-4">
              Curated Collections
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-[3.4rem] font-bold leading-tight">
              Shop the Look
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Each look is inspired by a real aesthetic — broken down into the
              key pieces you need to recreate it at home or for your next event.
            </p>
          </div>
        </section>

        {/* ── Looks grid ── */}
        <section className="max-w-5xl mx-auto px-4 md:px-6 pb-20 md:pb-28">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {LOOKS.map((look) => (
              <Link key={look.href} href={look.href}>
                <article className="group cursor-pointer">
                  <div className="rounded-xl overflow-hidden mb-4 aspect-[3/4]">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                    {look.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {look.subtitle}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:text-primary transition-colors">
                    View Look{" "}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

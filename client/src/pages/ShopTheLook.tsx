import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { IDEA_LIST_CATEGORIES } from "@/data/ideaLists";

export default function ShopTheLook() {
  usePageSEO({
    title: "Shop the Look - Curated Idea Lists | EcoShopGuide",
    description:
      "Curated EcoShopGuide idea lists for weddings, dorms, small spaces, living rooms, and green wellness. Shop the look with hand-picked product picks.",
    canonical: "https://ecoshopguide.com/shop-the-look",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="pt-24 md:pt-32 pb-10 md:pb-14">
          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-4">
              Curated Collections
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-[3.4rem] font-bold leading-tight">
              Shop the Look
            </h1>
            <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Recreate dreamy spaces, cozy corners, wellness escapes, and
              event-ready aesthetics with curated product picks.
            </p>
          </div>
        </section>

        {/* ── Category grid ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-20 md:pb-28">
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {IDEA_LIST_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/shop-the-look/${category.slug}`}
              >
                <article
                  className="group cursor-pointer"
                  data-category={category.slug}
                >
                  <div className="rounded-xl overflow-hidden mb-4 aspect-[4/5] bg-muted">
                    <img
                      src={category.heroImage}
                      alt={category.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <h2 className="font-serif text-xl sm:text-2xl font-semibold mb-1 group-hover:text-primary transition-colors">
                    {category.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    {category.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium group-hover:text-primary transition-colors">
                    View Idea List
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

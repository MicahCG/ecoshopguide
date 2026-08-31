import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowRight, ArrowUp, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { usePageSEO } from "@/hooks/usePageSEO";
import NotFound from "@/pages/not-found";
import {
  getCategoryBySlug,
  getRelatedCategories,
  sectionId,
  type IdeaProduct,
  type IdeaListCategory,
} from "@/data/ideaLists";

const ESSENTIALS_ANCHOR = "shop-essentials";
const PRODUCTS_ANCHOR = "shop-products";

/* ──────────────────────────  Building blocks  ────────────────────────── */

function Stars({ rating, count }: { rating?: number; count?: number }) {
  if (!rating) return null;
  const rounded = Math.round(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-500">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i <= rounded ? "fill-current" : "fill-none opacity-40"}`}
          />
        ))}
      </div>
      {count != null && (
        <span className="text-[11px] text-muted-foreground">
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
}

/**
 * Amazon-style product row: small thumbnail, dense detail stack with social
 * proof, deal price, and a clear shop CTA. The whole row is the affiliate link
 * (large tap target) so it converts on a single tap.
 */
function ProductRow({
  product,
  categorySlug,
  look,
}: {
  product: IdeaProduct;
  categorySlug: string;
  look?: string;
}) {
  return (
    <a
      href={product.affiliateUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      data-product-id={product.id}
      data-affiliate-product-id={product.id}
      data-category={categorySlug}
      data-section={product.categorySection}
      data-look={look}
      data-retailer={product.retailer.toLowerCase()}
      data-click-type="affiliate-outbound"
      className="group flex gap-3 p-2.5 sm:p-3 bg-background border border-border/60 rounded-xl hover:shadow-md hover:border-border transition-all"
    >
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith("/placeholder-product.svg")) {
              img.src = "/placeholder-product.svg";
            }
          }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        {product.badge && (
          <span className="self-start text-[10px] font-semibold tracking-wider uppercase text-primary mb-0.5">
            {product.badge}
          </span>
        )}
        <h3 className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>

        <div className="mt-1">
          <Stars rating={product.rating} count={product.reviewCount} />
        </div>
        {product.bought && (
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {product.bought}
          </p>
        )}

        <div className="mt-auto pt-1.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold">{product.price}</span>
              {product.listPrice && (
                <span className="text-[11px] text-muted-foreground line-through">
                  {product.listPrice}
                </span>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {product.retailer}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-foreground text-background text-[11px] font-semibold tracking-wider uppercase px-3.5 py-2 rounded-full group-hover:opacity-90 transition-opacity shrink-0">
            Shop
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </a>
  );
}

function ProductGrid({
  products,
  categorySlug,
  look,
}: {
  products: IdeaProduct[];
  categorySlug: string;
  look?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {products.map((p) => (
        <ProductRow
          key={p.id}
          product={p}
          categorySlug={categorySlug}
          look={look}
        />
      ))}
    </div>
  );
}

function LookProductSection({
  section,
  products,
  categorySlug,
  description,
}: {
  section: string;
  products: IdeaProduct[];
  categorySlug: string;
  description?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section
      className="scroll-mt-20"
      data-section={section}
      id={sectionId(section)}
    >
      <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold">
        {section}
      </h2>
      {description && (
        <p className="mt-1 mb-4 text-sm text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
      <div className={description ? "" : "mt-4"}>
        <ProductGrid
          products={products}
          categorySlug={categorySlug}
          look={section}
        />
      </div>
    </section>
  );
}

/* ─────────────────────────────  Page  ───────────────────────────────── */

export default function IdeaListCategoryPage() {
  const [, params] = useRoute<{ category: string }>("/shop-the-look/:category");
  const slug = params?.category ?? "";
  const category = getCategoryBySlug(slug);

  usePageSEO({
    title: category
      ? `${category.title} Idea List - Shop the Look | Bambana`
      : "Idea List | Bambana",
    description: category
      ? `${category.title} idea list - curated product picks to recreate the look. ${category.shortDescription}`
      : "Curated Bambana idea lists.",
    canonical: category
      ? `https://shopbambana.com/shop-the-look/${category.slug}`
      : "https://shopbambana.com/shop-the-look",
  });

  const hasEssentials = (category?.essentials.length ?? 0) > 0;
  const primaryAnchor = hasEssentials ? ESSENTIALS_ANCHOR : PRODUCTS_ANCHOR;

  // Sticky CTA is smart: it points to the products until the user reaches them,
  // then flips to "Back to Top" so it never sits on top of a product CTA.
  const [inProductArea, setInProductArea] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const el =
        document.getElementById(primaryAnchor) ||
        document.getElementById(PRODUCTS_ANCHOR);
      if (!el) {
        setInProductArea(window.scrollY > 400);
        return;
      }
      const top = el.getBoundingClientRect().top + window.scrollY;
      setInProductArea(window.scrollY > top - 120);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [primaryAnchor, slug]);

  const grouped = useMemo(() => {
    if (!category) return {} as Record<string, IdeaProduct[]>;
    return category.sections.reduce<Record<string, IdeaProduct[]>>(
      (acc, section) => {
        acc[section] = category.products.filter(
          (p) => p.categorySection === section,
        );
        return acc;
      },
      {},
    );
  }, [category]);

  const related = useMemo(
    () => (category ? getRelatedCategories(category.slug) : []),
    [category],
  );

  // Reuse each look's one-line copy as its product-section subtitle.
  const sectionDescriptions = useMemo(() => {
    const map: Record<string, string> = {};
    category?.looks.forEach((l) => {
      if (l.section && l.description) map[l.section] = l.description;
    });
    return map;
  }, [category]);

  if (!category) return <NotFound />;

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-category={category.slug}
    >
      <Header />
      <AffiliateDisclosure />

      <main className="flex-1 pb-24 md:pb-16">
        {/* ── Compact full-bleed hero ── */}
        <section className="relative">
          <div className="relative h-[46vh] min-h-[320px] max-h-[480px] md:h-[420px] w-full overflow-hidden">
            <img
              src={category.creativeImages[0]}
              alt={`${category.title} look`}
              className="absolute inset-0 w-full h-full object-cover"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
            <div className="relative h-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col justify-end pb-6 md:pb-9">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
                {category.title}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed max-w-xl line-clamp-2">
                {category.heroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* ── Shop the Essentials (immediately under hero) ── */}
        {hasEssentials && (
          <section
            id={ESSENTIALS_ANCHOR}
            data-section="shop-essentials"
            className="max-w-6xl mx-auto px-4 md:px-6 pt-7 md:pt-10 pb-8 md:pb-12 scroll-mt-16"
          >
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold">
              Shop the Essentials
            </h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              The core pieces to recreate the whole look.
            </p>
            <ProductGrid
              products={category.essentials}
              categorySlug={category.slug}
              look="essentials"
            />
          </section>
        )}

        {/* ── Look-specific product sections ── */}
        <div
          id={PRODUCTS_ANCHOR}
          className={`max-w-6xl mx-auto px-4 md:px-6 space-y-10 md:space-y-14 scroll-mt-16 ${
            hasEssentials ? "" : "pt-7 md:pt-10"
          }`}
        >
          {category.sections.map((section) => (
            <LookProductSection
              key={section}
              section={section}
              products={grouped[section] ?? []}
              categorySlug={category.slug}
              description={sectionDescriptions[section]}
            />
          ))}
        </div>

        {/* ── Related Idea Lists ── */}
        {related.length > 0 && (
          <section className="border-t mt-12 md:mt-16 pt-9 md:pt-12">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6">
                Related Idea Lists
              </h2>
              <div className="-mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-3 md:grid md:grid-cols-4 md:gap-5 overflow-x-auto snap-x pb-2 [-ms-overflow-style:none] [scrollbar-width:none]">
                  {related.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/shop-the-look/${c.slug}`}
                      data-category={c.slug}
                      data-click-type="related-category"
                    >
                      <div className="group cursor-pointer snap-start shrink-0 w-[55vw] sm:w-48 md:w-auto">
                        <div className="rounded-xl overflow-hidden aspect-[4/3] bg-muted mb-2">
                          <img
                            src={c.heroImage}
                            alt={c.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                          {c.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Sticky mobile Back to Top (only once in the product area) */}
      {inProductArea && (
        <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-background/95 backdrop-blur border-t px-4 py-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            data-click-type="back-to-top"
            className="flex items-center justify-center gap-2 w-full bg-foreground text-background font-semibold text-sm tracking-wider uppercase py-3.5 rounded-full hover:opacity-90 transition-opacity"
          >
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </button>
        </div>
      )}

      {/* Back to top (desktop) */}
      {inProductArea && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="hidden md:flex fixed bottom-6 right-6 z-40 items-center justify-center w-11 h-11 rounded-full bg-foreground text-background shadow-lg hover:opacity-90 transition-opacity"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

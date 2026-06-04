import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowRight, ArrowUp, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import { usePageSEO } from "@/hooks/usePageSEO";
import NotFound from "@/pages/not-found";
import {
  getCategoryBySlug,
  type IdeaProduct,
  type IdeaListCategory,
} from "@/data/ideaLists";

const SHOP_ANCHOR = "shop-products";

function CreativeStrip({ category }: { category: IdeaListCategory }) {
  const images = category.creativeImages.slice(0, 5);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {images.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`rounded-xl overflow-hidden bg-muted ${
            i === 0 ? "col-span-2 sm:col-span-2 aspect-[4/3]" : "aspect-square"
          }`}
        >
          <img
            src={src}
            alt={`${category.title} look ${i + 1}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}

function LookRail({ category }: { category: IdeaListCategory }) {
  return (
    <div className="-mx-4 md:mx-0 overflow-x-auto pb-2">
      <div className="flex gap-4 px-4 md:px-0 md:grid md:grid-cols-3 lg:grid-cols-5">
        {category.looks.map((look) => {
          const inner = (
            <div
              className="group cursor-pointer w-44 md:w-auto shrink-0"
              data-look={look.slug}
            >
              <div className="rounded-xl overflow-hidden aspect-[3/4] mb-2 bg-muted">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors">
                {look.title}
              </p>
            </div>
          );

          return look.href ? (
            <Link key={look.slug} href={look.href}>
              {inner}
            </Link>
          ) : (
            <a key={look.slug} href={`#${SHOP_ANCHOR}`}>
              {inner}
            </a>
          );
        })}
      </div>
    </div>
  );
}

function BadgePill({ label }: { label: string }) {
  return (
    <span className="inline-block text-[10px] font-semibold tracking-wider uppercase bg-foreground text-background px-2 py-0.5 rounded-full">
      {label}
    </span>
  );
}

function ProductCard({
  product,
  categorySlug,
}: {
  product: IdeaProduct;
  categorySlug: string;
}) {
  return (
    <article
      className="group flex flex-col bg-background border border-border/60 rounded-xl overflow-hidden hover:shadow-sm transition-shadow"
      data-product-id={product.id}
      data-category={categorySlug}
      data-section={product.categorySection}
    >
      <div className="relative aspect-square bg-muted">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.badge && (
          <div className="absolute top-3 left-3">
            <BadgePill label={product.badge} />
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-base font-semibold leading-snug mb-1 line-clamp-2">
          {product.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 mb-3">
          <span className="text-sm font-semibold">{product.price}</span>
          <span className="text-xs text-muted-foreground">
            {product.retailer}
          </span>
        </div>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          data-affiliate-product-id={product.id}
          data-affiliate-category={categorySlug}
          className="inline-flex items-center justify-center gap-1.5 w-full bg-foreground text-background text-xs font-semibold tracking-wider uppercase py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Shop Item
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}

function ProductSection({
  section,
  products,
  categorySlug,
}: {
  section: string;
  products: IdeaProduct[];
  categorySlug: string;
}) {
  if (products.length === 0) return null;
  return (
    <section
      className="scroll-mt-24"
      data-section={section}
      id={`section-${section.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
    >
      <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold mb-6 md:mb-8">
        {section}
      </h2>
      <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} categorySlug={categorySlug} />
        ))}
      </div>
    </section>
  );
}

export default function IdeaListCategoryPage() {
  const [, params] = useRoute<{ category: string }>("/shop-the-look/:category");
  const slug = params?.category ?? "";
  const category = getCategoryBySlug(slug);

  usePageSEO({
    title: category
      ? `${category.title} Idea List - Shop the Look | EcoShopGuide`
      : "Idea List | EcoShopGuide",
    description: category
      ? `${category.title} idea list - curated product picks to recreate the look. ${category.shortDescription}`
      : "Curated EcoShopGuide idea lists.",
    canonical: category
      ? `https://ecoshopguide.com/shop-the-look/${category.slug}`
      : "https://ecoshopguide.com/shop-the-look",
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  if (!category) return <NotFound />;

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-category={category.slug}
    >
      <Header />
      <AffiliateDisclosure />

      <main className="flex-1 pb-24 md:pb-16">
        {/* ── Hero ── */}
        <section className="pt-20 md:pt-28 pb-10 md:pb-14">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="text-center mb-8 md:mb-10">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary/70 mb-3">
                EcoShopGuide Idea List
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl xl:text-[3.4rem] font-bold leading-tight">
                {category.title}
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {category.heroDescription}
              </p>
              <div className="mt-6">
                <a
                  href={`#${SHOP_ANCHOR}`}
                  className="inline-flex items-center gap-2 bg-foreground text-background font-semibold text-sm tracking-wider uppercase px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Shop Products
                </a>
              </div>
            </div>

            <CreativeStrip category={category} />
          </div>
        </section>

        {/* ── Shop by Look ── */}
        <section className="max-w-6xl mx-auto px-4 md:px-6 pb-12 md:pb-16">
          <div className="flex items-end justify-between mb-5 md:mb-6">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold">
              Shop by Look
            </h2>
            <Link href="/shop-the-look">
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold tracking-wider uppercase hover:text-primary transition-colors cursor-pointer">
                All Categories
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          <LookRail category={category} />
        </section>

        {/* ── Product sections ── */}
        <div
          id={SHOP_ANCHOR}
          className="max-w-6xl mx-auto px-4 md:px-6 space-y-14 md:space-y-20 scroll-mt-24"
        >
          {category.sections.map((section) => (
            <ProductSection
              key={section}
              section={section}
              products={grouped[section] ?? []}
              categorySlug={category.slug}
            />
          ))}
        </div>

        {/* ── Browse more ── */}
        <section className="border-t mt-16 md:mt-24 pt-12 md:pt-16">
          <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
            <p className="text-muted-foreground mb-4">Browse more idea lists</p>
            <Link href="/shop-the-look">
              <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase hover:text-primary transition-colors cursor-pointer">
                All Categories
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
          href={`#${SHOP_ANCHOR}`}
          className="flex items-center justify-center gap-2 w-full bg-foreground text-background font-semibold text-sm tracking-wider uppercase py-3.5 rounded-full hover:opacity-90 transition-opacity"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop Products
        </a>
      </div>

      {/* Back to top (desktop) */}
      {showBackToTop && (
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

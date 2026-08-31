import { Link } from "wouter";
import { ArrowRight, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import {
  IDEA_LIST_CATEGORIES,
  sectionId,
  type IdeaListCategory,
  type IdeaProduct,
} from "@/data/ideaLists";

/**
 * Home page, rebuilt from the design reference "Bambana Storefront.dc.html"
 * (variant A — editorial-first): hero → category rail → "Why we picked it" →
 * product grid.
 *
 * The reference is modelled as a Shopify storefront (cart drawer, checkout,
 * split-shipment notices). We're an affiliate guide, so every "Add to cart"
 * maps to an outbound affiliate link and the cart layers are dropped.
 *
 * Colours and type live in .esg-home in index.css — home-scoped for now.
 */

/* ─────────────────────────────  Curation  ───────────────────────────────── */

/** Rail order. Weddings leads, matching the design's hero CTA. */
const CATEGORY_ORDER = [
  "weddings",
  "green-wellness",
  "dorm-rooms",
  "small-spaces",
  "living-rooms",
];

/**
 * The three "Why we picked it" rows. Hand-picked so the block stays editorial
 * rather than auto-generated — swap the slugs to re-merchandise it.
 */
const EDITORIAL_PICKS: { category: string; look: string }[] = [
  { category: "weddings", look: "dreamy-boho-garden-wedding" },
  { category: "green-wellness", look: "jungle-spa-retreat" },
  { category: "small-spaces", look: "cozy-apartment-living-room" },
];

/** Products shown in the grid. Only Green Wellness has curated essentials today. */
const GRID_CATEGORY = "green-wellness";
const GRID_SIZE = 6;

const byslug = (slug: string): IdeaListCategory | undefined =>
  IDEA_LIST_CATEGORIES.find((c) => c.slug === slug);

const orderedCategories = CATEGORY_ORDER.map(byslug).filter(
  (c): c is IdeaListCategory => Boolean(c),
);

const pickCount = (c: IdeaListCategory) => c.products.length + c.essentials.length;

const totalPicks = IDEA_LIST_CATEGORIES.reduce((n, c) => n + pickCount(c), 0);

const heroCategory = byslug("weddings") ?? IDEA_LIST_CATEGORIES[0];

const editorial = EDITORIAL_PICKS.flatMap(({ category, look }) => {
  const cat = byslug(category);
  const entry = cat?.looks.find((l) => l.slug === look);
  if (!cat || !entry) return [];
  return [
    {
      key: `${category}-${look}`,
      categoryTitle: cat.title,
      title: entry.title,
      image: entry.image,
      // Look-level copy where a curator wrote one, category copy otherwise.
      note: entry.description ?? cat.shortDescription,
      href:
        entry.href ??
        (entry.section
          ? `/shop-the-look/${cat.slug}#${sectionId(entry.section)}`
          : `/shop-the-look/${cat.slug}`),
    },
  ];
});

const gridProducts: IdeaProduct[] = (
  byslug(GRID_CATEGORY)?.essentials ?? []
).slice(0, GRID_SIZE);

/* ──────────────────────────  Building blocks  ───────────────────────────── */

function Eyebrow({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "accent" | "light";
}) {
  const color =
    tone === "accent"
      ? "text-[var(--esg-terracotta)]"
      : tone === "light"
        ? "text-[var(--esg-clay)]"
        : "text-[var(--esg-muted)]";
  return <p className={`esg-eyebrow ${color}`}>{children}</p>;
}

function Rating({ product }: { product: IdeaProduct }) {
  if (!product.rating) {
    return (
      <p className="mt-1 text-xs text-[var(--esg-muted)]">Editor selected</p>
    );
  }
  return (
    <div className="mt-1 flex items-center gap-1.5 text-xs text-[var(--esg-muted)]">
      <Star className="h-3 w-3 fill-current text-[var(--esg-terracotta)]" />
      <span>{product.rating.toFixed(1)}</span>
      {product.reviewCount != null && (
        <span>({product.reviewCount.toLocaleString()})</span>
      )}
      <span aria-hidden>·</span>
      <span>Editor selected</span>
    </div>
  );
}

/**
 * The design's product card, with "Add to cart" replaced by the outbound
 * affiliate link. Tracking attributes mirror ProductRow in IdeaListCategory so
 * the existing analytics keeps attributing these clicks.
 */
function ProductCard({
  product,
  categorySlug,
}: {
  product: IdeaProduct;
  categorySlug: string;
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
      data-look="home-editor-picks"
      data-retailer={product.retailer.toLowerCase()}
      data-click-type="affiliate-outbound"
      className="group flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] border border-[var(--esg-sand)] bg-[var(--esg-clay)]">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const img = e.currentTarget;
            if (!img.src.endsWith("/placeholder-product.svg")) {
              img.src = "/placeholder-product.svg";
            }
          }}
        />
        {product.badge && (
          <span className="esg-eyebrow absolute left-2 top-2 rounded bg-[var(--esg-surface)]/90 px-2 py-1 text-[var(--esg-terracotta)]">
            {product.badge}
          </span>
        )}
      </div>

      <h3 className="mt-2 text-sm font-medium leading-snug line-clamp-2">
        {product.title}
      </h3>
      <p className="text-[13px] text-[var(--esg-muted)]">{product.retailer}</p>

      <div className="mt-0.5 flex items-baseline gap-1.5">
        <span className="text-sm font-medium">{product.price}</span>
        {product.listPrice && (
          <span className="text-[11px] text-[var(--esg-muted)] line-through">
            {product.listPrice}
          </span>
        )}
      </div>

      <Rating product={product} />

      <span className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-lg border border-[var(--esg-forest)] bg-[var(--esg-surface)] px-3 text-sm font-medium text-[var(--esg-forest)] transition-colors group-hover:bg-[var(--esg-forest)] group-hover:text-[var(--esg-surface)]">
        Shop at {product.retailer}
      </span>
    </a>
  );
}

/* ──────────────────────────────  Page  ──────────────────────────────────── */

export default function Home() {
  return (
    <div className="esg-home flex min-h-screen flex-col">
      <Header />
      <AffiliateDisclosure />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative">
          <div className="relative h-[62vh] min-h-[420px] max-h-[620px] w-full overflow-hidden md:h-[560px]">
            <img
              src={heroCategory.heroImage}
              alt={heroCategory.title}
              className="absolute inset-0 h-full w-full object-cover"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(31,42,36,0.78)] via-[rgba(31,42,36,0.25)] to-transparent" />
            <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-7 md:px-6 md:pb-12">
              <Eyebrow tone="light">Shop by room and moment</Eyebrow>
              <h1 className="esg-serif mt-2.5 max-w-2xl text-[34px] leading-[1.1] text-[#fffdf9] text-pretty md:text-5xl">
                Five short lists,
                <br />
                chosen one item at a time.
              </h1>
              <Link href={`/shop-the-look/${heroCategory.slug}`}>
                <span className="mt-4 inline-flex min-h-[46px] cursor-pointer items-center gap-2 rounded-lg bg-[var(--esg-forest)] px-5 text-[15px] font-medium text-[#fffdf9] transition-colors hover:bg-[var(--esg-forest-dark)]">
                  Start with {heroCategory.title}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Category rail ── */}
        <section className="pt-5 md:pt-8">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <Eyebrow>Idea lists</Eyebrow>
          </div>
          <div className="mx-auto mt-3 max-w-6xl">
            <div className="scrollbar-hide flex snap-x gap-3 overflow-x-auto px-4 pb-3 md:grid md:grid-cols-5 md:gap-5 md:overflow-visible md:px-6">
              {orderedCategories.map((category) => (
                <Link key={category.slug} href={`/shop-the-look/${category.slug}`}>
                  <div
                    className="group w-[148px] shrink-0 cursor-pointer snap-start md:w-auto"
                    data-category={category.slug}
                    data-click-type="home-category"
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-[10px] border border-[var(--esg-sand)] bg-[var(--esg-clay)]">
                      <img
                        src={category.heroImage}
                        alt={category.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 text-[15px] font-medium transition-colors group-hover:text-[var(--esg-terracotta)]">
                      {category.title}
                    </p>
                    <p className="text-[13px] text-[var(--esg-muted)]">
                      {pickCount(category)} picks
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why we picked it ── */}
        <section className="mt-3 border-t border-[var(--esg-sand)] pt-7 md:pt-12">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <Eyebrow tone="accent">From the guide</Eyebrow>
            <h2 className="esg-serif mt-2 text-2xl md:text-[32px]">
              Why we picked it
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--esg-muted)] text-pretty">
              Every list on the site carries a note from the editor who built it.
            </p>

            <div className="mt-5 flex flex-col gap-5 md:mt-8 md:grid md:grid-cols-3 md:gap-8">
              {editorial.map((item) => (
                <Link key={item.key} href={item.href}>
                  <article className="group grid cursor-pointer grid-cols-[104px_1fr] items-start gap-3.5 md:grid-cols-1 md:gap-0">
                    <div className="aspect-[4/5] overflow-hidden rounded-[10px] border border-[var(--esg-sand)] bg-[var(--esg-clay)] md:aspect-[4/3]">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="md:mt-3">
                      <Eyebrow tone="accent">{item.categoryTitle}</Eyebrow>
                      <h3 className="mt-1.5 text-[15px] font-medium transition-colors group-hover:text-[var(--esg-terracotta)]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[13px] leading-relaxed text-[var(--esg-muted)] text-pretty">
                        {item.note}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium">
                        See the list
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Product grid ── */}
        {gridProducts.length > 0 && (
          <section className="mt-9 md:mt-14">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
              <Eyebrow>Editor picks</Eyebrow>
              <h2 className="esg-serif mt-2 text-2xl md:text-[32px]">
                New in the guide
              </h2>

              <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-6 md:mt-7 md:grid-cols-3 md:gap-x-5 md:gap-y-9">
                {gridProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    categorySlug={GRID_CATEGORY}
                  />
                ))}
              </div>

              <Link href="/shop-the-look">
                <span className="mt-6 inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-[var(--esg-sand)] px-4 text-[15px] transition-colors hover:border-[var(--esg-forest)] md:w-auto md:px-8">
                  See all {totalPicks} picks
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  );
}

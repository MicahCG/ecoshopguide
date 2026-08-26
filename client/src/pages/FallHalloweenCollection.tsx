import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { ecoTrack } from "@/lib/analytics";
import { productPriceLabel } from "@/lib/shopify-ui";
import type { ShopifyCollection } from "@shared/shopify";

async function loadFallHalloweenCollection(): Promise<ShopifyCollection> {
  const response = await fetch("/api/shopify/collection/fall-halloween");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to load the seasonal collection.");
  return data;
}

function ProductSkeleton() {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4" aria-busy="true" aria-label="Loading seasonal products">
    {Array.from({ length: 8 }, (_, index) => <div key={index} className="animate-pulse" aria-hidden="true"><div className="aspect-[4/5] rounded-sm bg-[#d8c5aa]/50" /><div className="mt-3 h-5 w-11/12 rounded bg-[#d8c5aa]/50" /><div className="mt-2 h-4 w-6/12 rounded bg-[#d8c5aa]/35" /></div>)}
  </div>;
}

export default function FallHalloweenCollection() {
  const query = useQuery({ queryKey: ["shopify", "fall-halloween"], queryFn: loadFallHalloweenCollection, staleTime: 60_000, retry: 1 });
  const products = query.data?.products ?? [];
  usePageSEO({
    title: "Cozy Fall & Halloween Home | EcoShopGuide",
    description: "A warm seasonal edit for an inviting entryway, table, and home—curated from the current EcoShopGuide shop catalog.",
    canonical: "https://www.ecoshopguide.com/shop-the-look/fall-halloween",
  });
  useEffect(() => {
    if (query.data) ecoTrack("view_category", { category_id: query.data.id, category_name: query.data.title, item_count: products.length, collection: "fall-halloween" });
  }, [query.data?.id, query.data?.title, products.length]);

  return <div className="min-h-screen flex flex-col bg-[#fbf6ee] text-[#2b251f]"><Header /><main className="flex-1">
    <section className="overflow-hidden bg-[#35261f] px-4 py-14 text-[#fff9ef] md:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.1fr_.9fr] md:items-end">
        <div><p className="text-xs font-semibold uppercase tracking-[.24em] text-[#e2a66b]">Seasonal home edit</p><h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-6xl">Cozy Fall &amp; Halloween Home</h1><p className="mt-5 max-w-xl text-base leading-relaxed text-[#f5e9db]/85">Warm layers, welcoming details, and a restrained touch of Halloween—chosen for the season, not just one night.</p><a href="#seasonal-shop" className="mt-7 inline-flex rounded-full bg-[#e5b780] px-5 py-3 text-sm font-semibold text-[#302018] transition-colors hover:bg-[#f0c796]">Shop the seasonal edit</a></div>
        <div className="rounded-sm border border-[#e5b780]/25 bg-[radial-gradient(circle_at_top_right,_rgba(235,169,100,.35),_transparent_45%),linear-gradient(145deg,#5a3526,#211814)] p-6 md:p-8"><p className="font-serif text-2xl">Fall first. Halloween in the details.</p><p className="mt-3 text-sm leading-relaxed text-[#f5e9db]/80">Live price, availability, and delivery options are confirmed by Shopify during checkout.</p></div>
      </div>
    </section>
    <section id="seasonal-shop" className="mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="mb-8 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#a95f37]">Shop the look</p><h2 className="mt-2 font-serif text-3xl md:text-4xl">Make it feel like fall</h2><p className="mt-3 text-muted-foreground">A focused seasonal assortment is coming together. We only surface items that are currently available through our live shop catalog.</p></div>
      {query.isPending && <ProductSkeleton />}
      {query.isError && <div className="rounded-sm border border-[#dcc9b4] bg-white/50 px-6 py-12 text-center"><p>We’re finishing this seasonal edit now.</p><button className="mt-4 underline" onClick={() => query.refetch()}>Try again</button></div>}
      {query.data && !products.length && <div className="rounded-sm border border-[#dcc9b4] bg-white/50 px-6 py-12 text-center"><p className="font-serif text-2xl">The seasonal shop is being curated.</p><p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">Check back shortly for the first live fall and Halloween pieces.</p></div>}
      {products.length > 0 && <div className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4">{products.map(product => <article key={product.id} data-shopify-product-id={product.id}><Link href={`/products/${product.handle}?collection=fall-halloween`} onClick={() => ecoTrack("product_card_click", { item_id: product.id, item_name: product.title, value: Number(product.price.amount), currency: product.price.currencyCode, collection: "fall-halloween" })}><div className="aspect-[4/5] overflow-hidden rounded-sm bg-[#e8ddc9]"><img src={product.featuredImage?.url || "/placeholder-product.svg"} alt={product.featuredImage?.altText || product.title} loading="lazy" className="h-full w-full object-cover transition-transform hover:scale-[1.02]" /></div><h3 className="mt-3 font-serif text-lg leading-tight md:text-xl">{product.title}</h3>{product.review && <p className="mt-1 text-sm">★ {product.review.rating.toFixed(1)} ({product.review.count})</p>}<p className="mt-1 font-medium">{productPriceLabel(product.price, product.variants)}</p></Link></article>)}</div>}
    </section>
  </main><Footer showAffiliateDisclosure={false} /></div>;
}

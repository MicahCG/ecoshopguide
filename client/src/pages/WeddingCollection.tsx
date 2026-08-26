import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header"; import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/usePageSEO"; import { ecoTrack } from "@/lib/analytics"; import { productPriceLabel } from "@/lib/shopify-ui";
import type { ShopifyCollection } from "@shared/shopify";

async function loadCollection(): Promise<ShopifyCollection> { const response = await fetch("/api/shopify/collection/wedding"); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load the collection."); return data; }

function WeddingCollectionSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading Wedding collection products"
      className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-9"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <article key={index} className="animate-pulse" aria-hidden="true">
          <div className="aspect-[4/5] rounded-sm bg-[#e8ddc9]/70" />
          <div className="mt-3 h-5 w-11/12 rounded bg-[#e8ddc9]/70" />
          <div className="mt-2 h-5 w-7/12 rounded bg-[#e8ddc9]/55" />
          <div className="mt-3 h-4 w-20 rounded bg-[#e8ddc9]/55" />
        </article>
      ))}
      <span className="sr-only" role="status">Loading the Wedding collection…</span>
    </section>
  );
}

export default function WeddingCollection() {
  const query = useQuery({ queryKey: ["shopify", "wedding"], queryFn: loadCollection, staleTime: 60_000, retry: 1 });
  const products = query.data ? [...query.data.products].sort((a, b) => {
    const reviewPriority = Number(Boolean(b.review)) - Number(Boolean(a.review));
    return reviewPriority || (b.review?.count ?? 0) - (a.review?.count ?? 0);
  }) : [];
  const reviewedProducts = products.filter((product) => product.review);
  const remainingProducts = products.filter((product) => !product.review);
  usePageSEO({ title: "Wedding Collection | EcoShopGuide", description: "Browse the EcoShopGuide Wedding collection.", canonical: "https://www.ecoshopguide.com/shop-the-look/weddings" });
  useEffect(() => { if (query.data) ecoTrack("view_category", { category_id: query.data.id, category_name: query.data.title, item_count: query.data.products.length }); }, [query.data?.id]);
  return <div className="min-h-screen flex flex-col bg-[#f7f4ee] text-[#1f2a24]"><Header/><main className="flex-1"><section className="px-4 py-14 md:py-20 text-center max-w-4xl mx-auto"><p className="uppercase tracking-[.24em] text-xs text-[#c65f3e] font-semibold">Wedding edit</p><h1 className="font-serif text-4xl md:text-6xl mt-3">{query.data?.title || "Wedding Collection"}</h1><p className="mt-5 text-muted-foreground max-w-2xl mx-auto">Thoughtful details for your celebration, sourced directly from our current shop catalog.</p></section>
  {query.isPending ? <WeddingCollectionSkeleton /> : null}{query.isError && <div role="alert" className="text-center py-16 px-4"><p>We couldn’t load the Wedding collection right now.</p><button className="mt-4 underline" onClick={() => query.refetch()}>Try again</button></div>}
  {query.data && !products.length && <p className="text-center py-16">No Wedding products are available right now.</p>}
  {query.data && <section className="max-w-7xl mx-auto px-4 pb-24">
    {reviewedProducts.length > 0 && <><div className="mb-6 text-center"><p className="uppercase tracking-[.2em] text-xs text-[#c65f3e] font-semibold">Top-rated picks</p><h2 className="font-serif text-3xl mt-2">Loved by customers</h2><p className="mt-2 text-muted-foreground">Our wedding edit starts with products that have verified supplier reviews.</p></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-9">{reviewedProducts.map(product => <WeddingProductCard key={product.id} product={product}/>)}</div></>}
    {remainingProducts.length > 0 && <><div className="mt-16 mb-6 border-t border-[#ded7c9] pt-10"><h2 className="font-serif text-3xl">More wedding details</h2></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-9">{remainingProducts.map(product => <WeddingProductCard key={product.id} product={product}/>)}</div></>}
  </section>}
  </main><Footer showAffiliateDisclosure={false}/></div>;
}

function WeddingProductCard({ product }: { product: ShopifyCollection["products"][number] }) {
  return <article data-shopify-product-id={product.id}><Link href={`/products/${product.handle}?collection=wedding`} onClick={() => ecoTrack("product_card_click", { item_id: product.id, item_name: product.title, value: Number(product.price.amount), currency: product.price.currencyCode, collection: "wedding" })}><div className="aspect-[4/5] bg-[#e8ddc9] overflow-hidden rounded-sm"><img src={product.featuredImage?.url || "/placeholder-product.svg"} alt={product.featuredImage?.altText || product.title} loading="lazy" className="w-full h-full object-cover hover:scale-[1.02] transition-transform"/></div><h3 className="font-serif text-lg md:text-xl mt-3 leading-tight line-clamp-3">{product.title}</h3><p className="mt-1 font-medium">{productPriceLabel(product.price, product.variants)}</p>{product.review && <p className="text-sm mt-1" aria-label={`${product.review.rating} out of 5 stars from ${product.review.count} reviews`}>★ {product.review.rating.toFixed(1)} ({product.review.count})</p>}{!product.availableForSale && <p className="mt-2 text-sm font-semibold text-muted-foreground">Currently unavailable</p>}</Link></article>;
}

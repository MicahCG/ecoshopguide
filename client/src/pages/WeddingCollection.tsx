import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header"; import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/usePageSEO"; import { ecoTrack } from "@/lib/analytics"; import { productPriceLabel } from "@/lib/shopify-ui";
import type { ShopifyCollection } from "@shared/shopify";

async function loadCollection(): Promise<ShopifyCollection> { const response = await fetch("/api/shopify/collection/wedding"); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Unable to load the collection."); return data; }
export default function WeddingCollection() {
  const query = useQuery({ queryKey: ["shopify", "wedding"], queryFn: loadCollection, staleTime: 60_000, retry: 1 });
  usePageSEO({ title: "Wedding Collection | EcoShopGuide", description: "Browse the EcoShopGuide Wedding collection.", canonical: "https://ecoshopguide.com/shop-the-look/weddings" });
  useEffect(() => { if (query.data) ecoTrack("view_category", { category_id: query.data.id, category_name: query.data.title, item_count: query.data.products.length }); }, [query.data?.id]);
  return <div className="min-h-screen flex flex-col bg-[#f7f4ee] text-[#1f2a24]"><Header/><main className="flex-1"><section className="px-4 py-14 md:py-20 text-center max-w-4xl mx-auto"><p className="uppercase tracking-[.24em] text-xs text-[#c65f3e] font-semibold">Wedding edit</p><h1 className="font-serif text-4xl md:text-6xl mt-3">{query.data?.title || "Wedding Collection"}</h1><p className="mt-5 text-muted-foreground max-w-2xl mx-auto">Thoughtful details for your celebration, sourced directly from our current shop catalog.</p></section>
  {query.isPending && <p role="status" className="text-center py-20">Loading the Wedding collection…</p>}{query.isError && <div role="alert" className="text-center py-16 px-4"><p>We couldn’t load the Wedding collection right now.</p><button className="mt-4 underline" onClick={() => query.refetch()}>Try again</button></div>}
  {query.data && !query.data.products.length && <p className="text-center py-16">No Wedding products are available right now.</p>}
  {query.data && <section className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-9">{query.data.products.map(product => <article key={product.id} data-shopify-product-id={product.id}><Link href={`/products/${product.handle}`}><div className="aspect-[4/5] bg-[#e8ddc9] overflow-hidden rounded-sm"><img src={product.featuredImage?.url || "/placeholder-product.svg"} alt={product.featuredImage?.altText || product.title} loading="lazy" className="w-full h-full object-cover hover:scale-[1.02] transition-transform"/></div><h2 className="font-serif text-lg md:text-xl mt-3 leading-tight line-clamp-3">{product.title}</h2><p className="mt-1 font-medium">{productPriceLabel(product.price, product.variants)}</p>{product.review && <p className="text-sm mt-1" aria-label={`${product.review.rating} out of 5 stars from ${product.review.count} reviews`}>★ {product.review.rating.toFixed(1)} ({product.review.count})</p>}{!product.availableForSale && <p className="mt-2 text-sm font-semibold text-muted-foreground">Currently unavailable</p>}</Link></article>)}</section>}
  </main><Footer showAffiliateDisclosure={false}/></div>;
}

import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePageSEO } from "@/hooks/usePageSEO";
import { ecoTrack } from "@/lib/analytics";
import { productPriceLabel } from "@/lib/shopify-ui";
import type { ShopifyCollection } from "@shared/shopify";

async function loadDormCollection(): Promise<ShopifyCollection> {
  const response = await fetch("/api/shopify/collection/dorm");
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Unable to load the collection.");
  return data;
}

export default function DormCollection() {
  const query = useQuery({ queryKey: ["shopify", "dorm"], queryFn: loadDormCollection, staleTime: 60_000, retry: 1 });
  const products = query.data?.products ?? [];
  usePageSEO({ title: "Dorm Decor | Bambana", description: "Warm boho dorm decor and organization, curated for small spaces.", canonical: "https://www.shopbambana.com/shop-the-look/dorm" });
  useEffect(() => { if (query.data) ecoTrack("view_category", { category_id: query.data.id, category_name: query.data.title, item_count: products.length }); }, [query.data?.id, products.length]);
  return <div className="min-h-screen flex flex-col bg-[#f7f4ee] text-[#1f2a24]"><Header /><main className="flex-1"><section className="bg-[#e8ddc9] px-4 py-14 text-center md:py-20"><p className="uppercase tracking-[.24em] text-xs font-semibold text-[#c65f3e]">Dorm room edit</p><h1 className="font-serif text-4xl md:text-6xl mt-3">A warm boho dorm, made easy</h1><p className="mt-5 max-w-2xl mx-auto text-muted-foreground">Small-space essentials for a softer, more personal room: thoughtful lighting, wall decor, organization and cozy texture.</p></section><section className="max-w-7xl mx-auto px-4 py-10 md:py-14">{query.isPending && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" aria-busy="true">{Array.from({ length: 8 }, (_, i) => <div key={i} className="animate-pulse"><div className="aspect-[4/5] bg-[#e8ddc9] rounded-sm" /><div className="mt-3 h-5 w-10/12 bg-[#e8ddc9] rounded" /></div>)}</div>}{query.isError && <div className="py-16 text-center"><p>We’re finishing this dorm edit now.</p><button className="mt-4 underline" onClick={() => query.refetch()}>Try again</button></div>}{query.data && !products.length && <p className="py-16 text-center">New dorm picks are landing shortly.</p>}{products.length > 0 && <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-9">{products.map(product => <article key={product.id}><Link href={`/products/${product.handle}?collection=dorm`} onClick={() => ecoTrack("product_card_click", { item_id: product.id, item_name: product.title, value: Number(product.price.amount), currency: product.price.currencyCode, collection: "dorm" })}><div className="aspect-[4/5] bg-[#e8ddc9] overflow-hidden rounded-sm"><img src={product.featuredImage?.url || "/placeholder-product.svg"} alt={product.featuredImage?.altText || product.title} loading="lazy" className="w-full h-full object-cover hover:scale-[1.02] transition-transform" /></div><h2 className="font-serif text-lg md:text-xl mt-3 leading-tight line-clamp-3">{product.title}</h2><p className="mt-1 font-medium">{productPriceLabel(product.price, product.variants)}</p>{product.review && <p className="text-sm mt-1">★ {product.review.rating.toFixed(1)} ({product.review.count})</p>}</Link></article>)}</div>}</section></main><Footer showAffiliateDisclosure={false} /></div>;
}

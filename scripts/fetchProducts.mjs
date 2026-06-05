#!/usr/bin/env node
/**
 * Pull live product data (image, price, rating, review count, retailer) for the
 * idea-list cards.
 *
 *   node scripts/fetchProducts.mjs
 *
 * Input  : scripts/product-links.json        [{ "id": "...", "url": "https://..." }]
 * Output : client/public/products/<id>.<ext>  (downloaded image)
 *          client/src/data/productData.ts     (id -> { image, price, rating, ... })
 *          scripts/.product-data.json          (persisted results across runs)
 *
 * It follows affiliate redirects (e.g. dhgate.sjv.io -> dhgate.com), reads the
 * page's schema.org Product JSON-LD (price, aggregateRating) plus og: tags, and
 * downloads the main image. Curated titles in ideaLists.ts are kept; everything
 * else is merged in by enrich().
 *
 * If a retailer blocks bots (some Amazon pages 403), the item is reported. You
 * can then add a manual entry to scripts/.product-data.json and rerun, e.g.
 *   "green-002": { "price": "$24.99", "rating": 4.6, "reviewCount": 1200,
 *                  "image": "https://.../img.jpg" }
 * (an image http(s) URL is downloaded; a "/products/x.jpg" path is kept as-is.)
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LINKS = path.join(ROOT, "scripts/product-links.json");
const SIDECAR = path.join(ROOT, "scripts/.product-data.json");
const OUT_DIR = path.join(ROOT, "client/public/products");
const TS_OUT = path.join(ROOT, "client/src/data/productData.ts");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const readJson = async (p, fallback) =>
  existsSync(p) ? JSON.parse(await readFile(p, "utf8")) : fallback;

const RETAILERS = {
  amazon: "Amazon",
  dhgate: "DHgate",
  etsy: "Etsy",
  target: "Target",
  wayfair: "Wayfair",
  walmart: "Walmart",
  aliexpress: "AliExpress",
  ikea: "IKEA",
};
function retailerFromUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const key of Object.keys(RETAILERS)) if (host.includes(key)) return RETAILERS[key];
    const base = host.split(".").slice(-2, -1)[0] || host;
    return base.charAt(0).toUpperCase() + base.slice(1);
  } catch {
    return undefined;
  }
}

const money = (v) => {
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? `$${n.toFixed(2)}` : undefined;
};

function flattenLd(node, out = []) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    node.forEach((n) => flattenLd(n, out));
    return out;
  }
  out.push(node);
  if (node["@graph"]) flattenLd(node["@graph"], out);
  return out;
}

function lowestOfferPrice(offers) {
  if (!offers) return undefined;
  const list = Array.isArray(offers) ? offers : [offers];
  const prices = [];
  for (const o of list) {
    if (o.lowPrice != null) prices.push(parseFloat(o.lowPrice));
    if (o.price != null) prices.push(parseFloat(o.price));
  }
  const valid = prices.filter((n) => Number.isFinite(n) && n > 0);
  return valid.length ? Math.min(...valid) : undefined;
}

function parseJsonLd(html) {
  const out = {};
  const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of blocks) {
    let data;
    try {
      data = JSON.parse(b[1].trim());
    } catch {
      continue;
    }
    const product = flattenLd(data).find((n) => {
      const t = n["@type"];
      return t === "Product" || (Array.isArray(t) && t.includes("Product"));
    });
    if (!product) continue;
    if (product.name) out.title = String(product.name);
    const img = Array.isArray(product.image) ? product.image[0] : product.image;
    if (img) out.image = img;
    const price = lowestOfferPrice(product.offers);
    if (price != null) out.price = money(price);
    const r = product.aggregateRating;
    if (r) {
      if (r.ratingValue != null) out.rating = Math.round(parseFloat(r.ratingValue) * 10) / 10;
      const rc = r.reviewCount ?? r.ratingCount;
      if (rc != null) out.reviewCount = parseInt(String(rc).replace(/[^0-9]/g, ""), 10);
    }
    return out; // first Product wins
  }
  return out;
}

function metaContent(html, key) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const m = html.match(re);
  return m ? m[1] : undefined;
}

function sniffExt(buf) {
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return "webp";
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return "png";
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf.toString("ascii", 0, 4) === "GIF8") return "gif";
  return "jpg";
}

async function downloadImage(url, id) {
  const res = await fetch(url, { headers: { "user-agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const ext = sniffExt(buf);
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(path.join(OUT_DIR, `${id}.${ext}`), buf);
  return `/products/${id}.${ext}`;
}

async function fetchProduct(id, url) {
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: "text/html,application/xhtml+xml,*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`page HTTP ${res.status}`);
  const html = await res.text();

  const ld = parseJsonLd(html);
  const imageUrl = ld.image || metaContent(html, "og:image") || metaContent(html, "twitter:image");
  const price = ld.price || money(metaContent(html, "product:price:amount") || metaContent(html, "og:price:amount"));

  const data = {
    retailer: retailerFromUrl(res.url),
    price,
    rating: ld.rating,
    reviewCount: ld.reviewCount,
    title: ld.title,
  };
  if (imageUrl) {
    data.image = await downloadImage(new URL(imageUrl, res.url).href, id);
  }
  // drop undefined keys
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v != null && v !== ""));
}

const links = await readJson(LINKS, []);
const result = await readJson(SIDECAR, {}); // keep manual + prior runs

let ok = 0;
let failed = 0;
for (const { id, url } of links) {
  if (!id || !url) continue;
  try {
    result[id] = { ...(result[id] || {}), ...(await fetchProduct(id, url)) };
    ok++;
    const r = result[id];
    console.log(`✓ ${id}  ${r.price ?? "?"}  ${r.rating ?? "?"}★ (${r.reviewCount ?? "?"})  ${r.image ?? "no image"}`);
  } catch (err) {
    failed++;
    console.warn(`✗ ${id}  (${url})\n    ${err.message}`);
  }
}

// Resolve any manual sidecar image URLs into downloaded local files.
for (const [id, val] of Object.entries(result)) {
  if (val && typeof val.image === "string" && /^https?:/i.test(val.image)) {
    try {
      val.image = await downloadImage(val.image, id);
    } catch {
      /* keep the remote URL; the site will hotlink it */
    }
  }
}

await writeFile(SIDECAR, JSON.stringify(result, null, 2) + "\n");

const body = Object.entries(result)
  .map(([id, v]) => `  ${JSON.stringify(id)}: ${JSON.stringify(v)},`)
  .join("\n");
const ts =
  "// AUTO-GENERATED by scripts/fetchProducts.mjs — do not edit by hand.\n" +
  "// Live product data (image, price, rating, reviews) keyed by product id.\n" +
  "// Run: node scripts/fetchProducts.mjs\n" +
  "export interface FetchedProduct {\n" +
  "  image?: string;\n  price?: string;\n  listPrice?: string;\n" +
  "  rating?: number;\n  reviewCount?: number;\n  retailer?: string;\n  title?: string;\n}\n\n" +
  `export const PRODUCT_DATA: Record<string, FetchedProduct> = {\n${body}\n};\n`;
await writeFile(TS_OUT, ts);

console.log(
  `\nDone. ${ok} fetched, ${failed} failed. Wrote ${path.relative(ROOT, TS_OUT)}.` +
    (failed ? `\nFor blocked items, add a manual entry to ${path.relative(ROOT, SIDECAR)} and rerun.` : ""),
);

import { isIP } from "node:net";
import { z } from "zod";
import {
  SUPPORTED_COLLECTION_HANDLES,
  isSupportedCollectionHandle,
  type ShopifyCart,
  type ShopifyCollection,
  type ShopifyImage,
  type ShopifyProduct,
  type ShopifyReview,
  type SupportedCollectionHandle,
} from "../shared/shopify.js";
import { VERIFIED_COLLECTIVE_DETAILS } from "../shared/verified-collective-ratings.js";

const gid = (kind: string) => z.string().min(1).max(512).regex(new RegExp(`^gid://shopify/${kind}/[^\\s]+$`));
export const cartIdSchema = gid("Cart");
export const lineIdSchema = gid("CartLine");
export const variantIdSchema = gid("ProductVariant");
export const quantitySchema = z.number().int().min(1).max(100);
// Shopify handles can include Unicode characters (for example ™). Route params
// are already decoded by the framework; reject only separators/control space.
export const handleSchema = z.string().min(1).max(128).regex(/^[^/?#\s]+$/u);
export const collectionHandleSchema = z.enum(SUPPORTED_COLLECTION_HANDLES);
const attributeValue = z.string().trim().min(1).max(255);
export const attributionSchema = z.object({
  epik: attributeValue.optional(), utm_source: attributeValue.optional(), utm_medium: attributeValue.optional(),
  utm_campaign: attributeValue.optional(), utm_content: attributeValue.optional(), utm_term: attributeValue.optional(),
  landing_path: z.string().trim().min(1).max(1000).optional(),
}).strip();
export const cartCreateSchema = z.object({ variantId: variantIdSchema, quantity: quantitySchema.default(1), attribution: attributionSchema.optional() });
export const cartLinesAddSchema = cartCreateSchema;
export const cartLineUpdateSchema = z.object({ lineId: lineIdSchema, quantity: quantitySchema });
export const cartLineRemoveSchema = z.object({ lineId: lineIdSchema });
export const cartCheckoutSchema = z.object({ attribution: attributionSchema.optional() });

export function sanitizeAttribution(input: z.infer<typeof attributionSchema>): Array<{ key: string; value: string }> {
  return Object.entries(input).flatMap(([key, raw]) => {
    if (!raw) return [];
    let value = raw.trim();
    if (key === "landing_path") {
      if (!value.startsWith("/")) return [];
      value = value.split(/[?#]/, 1)[0].slice(0, 255);
    }
    if (/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(value) || /(?:https?:\/\/|www\.)/i.test(value) || /(?:^|\D)\+?\d[\d\s().-]{6,}\d(?:\D|$)/.test(value)) return [];
    return value ? [{ key, value }] : [];
  });
}

export function validatedBuyerIp(value: unknown): string | undefined {
  const candidate = typeof value === "string" ? value.trim() : "";
  return isIP(candidate) ? candidate : undefined;
}

export function parseReview(ratingField: any, countField: any): ShopifyReview | undefined {
  if (!ratingField?.value || !countField?.value) return undefined;
  let rating: number;
  try {
    const parsed = JSON.parse(ratingField.value);
    rating = Number(typeof parsed === "object" ? parsed.value : parsed);
  } catch { rating = Number(ratingField.value); }
  const count = Number(countField.value);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5 || !Number.isInteger(count) || count < 1) return undefined;
  return { rating, count };
}

function image(value: any): ShopifyImage | undefined {
  return value?.url ? { url: value.url, ...(value.altText ? { altText: value.altText } : {}), ...(value.width ? { width: value.width } : {}), ...(value.height ? { height: value.height } : {}) } : undefined;
}

// Shopify Collective displays supplier ratings in its retailer app, but doesn't
// synchronize them to imported product metafields. These are manually verified
// supplier aggregates, keyed to a specific imported product, and intentionally
// only added when an exact Collective listing has been supplied.
const verifiedCollectiveDetails = VERIFIED_COLLECTIVE_DETAILS;

export function normalizeProduct(raw: any): ShopifyProduct {
  const verified = verifiedCollectiveDetails[raw.handle];
  const variants = (raw.variants?.nodes ?? [])
    .filter((variant: any) => variant.availableForSale)
    .map((v: any) => ({ id: v.id, title: v.title, availableForSale: true, price: v.price, selectedOptions: v.selectedOptions ?? [], image: image(v.image) }));
  return {
    id: raw.id, handle: raw.handle, title: raw.title, description: raw.description ?? "", descriptionHtml: raw.descriptionHtml ?? "",
    availableForSale: variants.length > 0, featuredImage: image(raw.featuredImage), images: (raw.images?.nodes ?? []).map(image).filter(Boolean),
    price: raw.priceRange.minVariantPrice, options: raw.options ?? [],
    variants,
    review: parseReview(raw.rating, raw.ratingCount) ?? verified?.review,
    supplierShipsInDays: verified?.supplierShipsInDays,
  };
}

const PRODUCT_FRAGMENT = `
  id handle title description descriptionHtml availableForSale
  featuredImage { url altText width height } images(first: 20) { nodes { url altText width height } }
  priceRange { minVariantPrice { amount currencyCode } }
  options { name values }
  variants(first: 100) { nodes { id title availableForSale price { amount currencyCode } selectedOptions { name value } image { url altText width height } } }
  rating: metafield(namespace: "reviews", key: "rating") { value }
  ratingCount: metafield(namespace: "reviews", key: "rating_count") { value }
`;
const CART_FRAGMENT = `id checkoutUrl totalQuantity cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } } lines(first: 100) { nodes { id quantity cost { totalAmount { amount currencyCode } } merchandise { ... on ProductVariant { id title availableForSale price { amount currencyCode } selectedOptions { name value } image { url altText width height } product { id handle title featuredImage { url altText width height } } } } } }`;

export class ShopifyRequestError extends Error { constructor(public status: number, message: string, public code?: string) { super(message); } }
export function mapShopifyErrors(userErrors: any[] = [], errors: any[] = []): { status: number; message: string } | undefined {
  if (userErrors.length) return { status: 422, message: String(userErrors[0].message || "Shopify rejected this cart change.") };
  if (errors.length) return { status: 502, message: "Shopify is temporarily unavailable." };
}

async function graphql<T>(query: string, variables: Record<string, unknown> = {}, buyerIp?: string): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_STOREFRONT_API_VERSION;
  const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;
  const publicToken = process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
  if (!domain || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(domain) || !/^\d{4}-\d{2}$/.test(version || "") || (!privateToken && !publicToken)) {
    throw new ShopifyRequestError(503, "Shopify is not configured.");
  }
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (privateToken) headers["Shopify-Storefront-Private-Token"] = privateToken;
  else headers["X-Shopify-Storefront-Access-Token"] = publicToken!;
  if (buyerIp) headers["Shopify-Storefront-Buyer-IP"] = buyerIp;
  let response: Response;
  try { response = await fetch(`https://${domain}/api/${version}/graphql.json`, { method: "POST", headers, body: JSON.stringify({ query, variables }), signal: AbortSignal.timeout(10_000) }); }
  catch { throw new ShopifyRequestError(502, "Shopify is temporarily unavailable."); }
  if (!response.ok) throw new ShopifyRequestError(502, "Shopify is temporarily unavailable.");
  const payload = await response.json() as any;
  const mapped = mapShopifyErrors([], payload.errors);
  if (mapped) throw new ShopifyRequestError(mapped.status, mapped.message);
  return payload.data as T;
}

const dormProductOrder = [
  "Luxury Travel Backpack for Women's Fashion Women's Backpack",
  "Vintage Wooden Rotating Makeup Mirror, 360 Swivel Large Desktop Vanity Mirror For Bedroom Dormitory Standing Cosmetic Mirror For Table",
  "Ins Style Student Dormitory Desktop Storage Fresh and Cute Multi-layer Drawer-type Cosmetic Organizer Lipstick Holder",
  "Enjoy Organizer-Shower Caddy Organizer with Handle, 3 Compartments, Portable Storage Bin for Bathroom, Dorm, Gym -Made In USA",
  "The Hamper",
  "The Sculpted Bin - Petite with Lid | Set of 3",
  "Tache White Ivory Polar Faux Fur with Sherpa Throw Blanket",
  "Tall Bamboo Bookshelf – Adjustable Shelves, Narrow Freestanding Storage Rack",
  "Wood Wall Shelves 15.8” with Metal Brackets – Rustic Floating Shelves | 5/8 Pack",
  "Bamboo Woven Storage Basket",
  "Bamboo Laptop Lap Desk with Pillow Cushion Stand Holder Table",
  "Full-Length Arched Floor Mirror with Stand - Multiple Size",
  "Organic Sateen Bed Sheets Set",
  "Fadey White 3D Washable Rug",
  "Fennco Styles Handmade Tufted Woven Tassel Decorative Throw Pillow Cover 20\" W x 20\" L - White Boho Cushion Case for Home, Couch, Living Room, Bedroom, Office Décor",
  "Modern Classic Desk Lamp - Arcana Table Lamp",
  "40 LED Large Photo Clip Clear Cable Lights - Plug in",
  "Vesta Green Macrame Wall Hangings",
  "Artificial Ivy Leaf Garland Fake Leaves Hanging Vines For Home Decor Creeper Green Ivy Artificial Ivy Garland Greenery Hanging Plant Vine for Wedding Wall Party Room Astethic Stuff Decor 100pcs Leaf 1 piece 2.4M",
  "Succulent 'String of Pearls'",
  "Bender Wall Planter",
  "5\" Faux Green Sedum Succulent Pick",
  "Forest Bathing - Signature Candle (Fir + Pine + Patchouli)",
  "Geranium + Rose - Signature Candle",
];

/** Assortment swaps — hide these handles on the Fall collection grid. */
const fallHiddenHandles = new Set(["fall-gingham-blanket", "solid-color-lobster-rope-doormat"]);

function orderDormProducts(products: ShopifyProduct[]): ShopifyProduct[] {
  const order = new Map(dormProductOrder.map((title, index) => [title, index]));
  return [...products].sort((a, b) => (order.get(a.title) ?? Number.MAX_SAFE_INTEGER) - (order.get(b.title) ?? Number.MAX_SAFE_INTEGER));
}

export async function getShopifyCollection(handle: SupportedCollectionHandle): Promise<ShopifyCollection | null> {
  const data = await graphql<any>(`query Collection($handle: String!) { collection(handle: $handle) { id handle title description image { url altText width height } products(first: 100) { nodes { ${PRODUCT_FRAGMENT} } } } }`, { handle });
  const c = data.collection;
  if (!c || c.handle !== handle) return null;
  let products = c.products.nodes.map(normalizeProduct).filter((product: ShopifyProduct) => product.availableForSale);
  if (handle === "fall-halloween") {
    products = products.filter((product: ShopifyProduct) => !fallHiddenHandles.has(product.handle));
  }
  return { id: c.id, handle: c.handle, title: c.title, description: c.description ?? "", image: image(c.image), products: handle === "dorm" ? orderDormProducts(products) : products };
}
export async function getDormCollection() { return getShopifyCollection("dorm"); }
export async function getFallHalloweenCollection() { return getShopifyCollection("fall-halloween"); }
export async function getWeddingCollection() { return getShopifyCollection("wedding"); }
export async function getShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await graphql<any>(`query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FRAGMENT} collections(first: 20) { nodes { handle } } } }`, { handle });
  const p = data.product;
  const product = p?.collections?.nodes?.some((c: any) => isSupportedCollectionHandle(c.handle)) ? normalizeProduct(p) : null;
  return product?.availableForSale ? product : null;
}

export function isApprovedVariant(variant: any): boolean {
  return Boolean(variant?.availableForSale && variant?.product?.collections?.nodes?.some((collection: any) => isSupportedCollectionHandle(collection.handle)));
}

async function assertApprovedVariant(variantId: string, buyerIp?: string): Promise<void> {
  const data = await graphql<any>(`query Variant($id: ID!) { node(id: $id) { ... on ProductVariant { id availableForSale product { collections(first: 20) { nodes { handle } } } } } }`, { id: variantId }, buyerIp);
  if (!isApprovedVariant(data.node)) throw new ShopifyRequestError(422, "This option is unavailable.");
}

type ShopifyPrivateCart = ShopifyCart & { id: string };
function normalizeCart(cart: any): ShopifyPrivateCart {
  return { ...cart, lines: (cart.lines?.nodes ?? []).map((line: any) => ({ ...line, merchandise: { ...line.merchandise, image: image(line.merchandise.image), product: { ...line.merchandise.product, featuredImage: image(line.merchandise.product.featuredImage) } } })) };
}
export function toPublicCart(cart: ShopifyPrivateCart): ShopifyCart {
  const { id: _secretCartId, ...publicCart } = cart;
  return publicCart;
}
async function cartMutation(query: string, variables: Record<string, unknown>, root: string, buyerIp?: string): Promise<ShopifyPrivateCart> {
  const data = await graphql<any>(query, variables, buyerIp); const result = data[root];
  const missingCart = result?.userErrors?.some((error: any) => error?.code === "INVALID" && error?.field?.[0] === "cartId");
  if (missingCart) throw new ShopifyRequestError(404, "Your cart expired. Please add the item again.", "CART_MISSING");
  const mapped = mapShopifyErrors(result?.userErrors); if (mapped) throw new ShopifyRequestError(mapped.status, mapped.message);
  if (!result?.cart) throw new ShopifyRequestError(502, "Shopify is temporarily unavailable.");
  return normalizeCart(result.cart);
}
export async function createCart(variantId: string, quantity: number, attribution: z.infer<typeof attributionSchema> = {}, buyerIp?: string): Promise<ShopifyPrivateCart> {
  await assertApprovedVariant(variantId, buyerIp);
  return cartMutation(`mutation Create($input: CartInput!) { cartCreate(input: $input) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { input: { lines: [{ merchandiseId: variantId, quantity }], attributes: sanitizeAttribution(attribution) } }, "cartCreate", buyerIp);
}
export async function getCart(id: string, buyerIp?: string): Promise<ShopifyPrivateCart | null> { const d = await graphql<any>(`query Cart($id: ID!) { cart(id: $id) { ${CART_FRAGMENT} } }`, { id }, buyerIp); return d.cart ? normalizeCart(d.cart) : null; }
export async function addCartLine(cartId: string, variantId: string, quantity: number, buyerIp?: string) { await assertApprovedVariant(variantId, buyerIp); return cartMutation(`mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { cartId, lines: [{ merchandiseId: variantId, quantity }] }, "cartLinesAdd", buyerIp); }
export async function updateCartLine(cartId: string, lineId: string, quantity: number, buyerIp?: string) { return cartMutation(`mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { cartId, lines: [{ id: lineId, quantity }] }, "cartLinesUpdate", buyerIp); }
export async function removeCartLine(cartId: string, lineId: string, buyerIp?: string) { return cartMutation(`mutation Remove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { cartId, lineIds: [lineId] }, "cartLinesRemove", buyerIp); }
export async function updateCartAttributes(cartId: string, attribution: z.infer<typeof attributionSchema>, buyerIp?: string) {
  return cartMutation(`mutation Attributes($cartId: ID!, $attributes: [AttributeInput!]!) { cartAttributesUpdate(cartId: $cartId, attributes: $attributes) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { cartId, attributes: sanitizeAttribution(attribution) }, "cartAttributesUpdate", buyerIp);
}

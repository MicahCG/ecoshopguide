import { isIP } from "node:net";
import { z } from "zod";
import type { ShopifyCart, ShopifyCollection, ShopifyImage, ShopifyProduct, ShopifyReview } from "@shared/shopify";

const gid = (kind: string) => z.string().min(1).max(512).regex(new RegExp(`^gid://shopify/${kind}/[^\\s]+$`));
export const cartIdSchema = gid("Cart");
export const lineIdSchema = gid("CartLine");
export const variantIdSchema = gid("ProductVariant");
export const quantitySchema = z.number().int().min(1).max(100);
export const handleSchema = z.string().regex(/^[a-z0-9][a-z0-9-]{0,127}$/);
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

export function normalizeProduct(raw: any): ShopifyProduct {
  return {
    id: raw.id, handle: raw.handle, title: raw.title, description: raw.description ?? "", descriptionHtml: raw.descriptionHtml ?? "",
    availableForSale: Boolean(raw.availableForSale), featuredImage: image(raw.featuredImage), images: (raw.images?.nodes ?? []).map(image).filter(Boolean),
    price: raw.priceRange.minVariantPrice, options: raw.options ?? [],
    variants: (raw.variants?.nodes ?? []).map((v: any) => ({ id: v.id, title: v.title, availableForSale: Boolean(v.availableForSale), price: v.price, selectedOptions: v.selectedOptions ?? [], image: image(v.image) })),
    review: parseReview(raw.rating, raw.ratingCount),
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

export async function getWeddingCollection(): Promise<ShopifyCollection | null> {
  const data = await graphql<any>(`query Wedding { collection(handle: "wedding") { id handle title description image { url altText width height } products(first: 100) { nodes { ${PRODUCT_FRAGMENT} } } } }`);
  const c = data.collection;
  return c ? { id: c.id, handle: c.handle, title: c.title, description: c.description ?? "", image: image(c.image), products: c.products.nodes.map(normalizeProduct) } : null;
}
export async function getWeddingProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await graphql<any>(`query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FRAGMENT} collections(first: 20) { nodes { handle } } } }`, { handle });
  const p = data.product;
  return p?.collections?.nodes?.some((c: any) => c.handle === "wedding") ? normalizeProduct(p) : null;
}

export function isWeddingVariant(variant: any): boolean {
  return Boolean(variant?.availableForSale && variant?.product?.collections?.nodes?.some((collection: any) => collection.handle === "wedding"));
}

async function assertWeddingVariant(variantId: string, buyerIp?: string): Promise<void> {
  const data = await graphql<any>(`query Variant($id: ID!) { node(id: $id) { ... on ProductVariant { id availableForSale product { collections(first: 20) { nodes { handle } } } } } }`, { id: variantId }, buyerIp);
  if (!isWeddingVariant(data.node)) throw new ShopifyRequestError(422, "This Wedding option is unavailable.");
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
  await assertWeddingVariant(variantId, buyerIp);
  return cartMutation(`mutation Create($input: CartInput!) { cartCreate(input: $input) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { input: { lines: [{ merchandiseId: variantId, quantity }], attributes: sanitizeAttribution(attribution) } }, "cartCreate", buyerIp);
}
export async function getCart(id: string, buyerIp?: string): Promise<ShopifyPrivateCart | null> { const d = await graphql<any>(`query Cart($id: ID!) { cart(id: $id) { ${CART_FRAGMENT} } }`, { id }, buyerIp); return d.cart ? normalizeCart(d.cart) : null; }
export async function addCartLine(cartId: string, variantId: string, quantity: number, buyerIp?: string) { await assertWeddingVariant(variantId, buyerIp); return cartMutation(`mutation Add($cartId: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { cartId, lines: [{ merchandiseId: variantId, quantity }] }, "cartLinesAdd", buyerIp); }
export async function updateCartLine(cartId: string, lineId: string, quantity: number, buyerIp?: string) { return cartMutation(`mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { cartId, lines: [{ id: lineId, quantity }] }, "cartLinesUpdate", buyerIp); }
export async function removeCartLine(cartId: string, lineId: string, buyerIp?: string) { return cartMutation(`mutation Remove($cartId: ID!, $lineIds: [ID!]!) { cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { cartId, lineIds: [lineId] }, "cartLinesRemove", buyerIp); }
export async function updateCartAttributes(cartId: string, attribution: z.infer<typeof attributionSchema>, buyerIp?: string) {
  return cartMutation(`mutation Attributes($cartId: ID!, $attributes: [AttributeInput!]!) { cartAttributesUpdate(cartId: $cartId, attributes: $attributes) { cart { ${CART_FRAGMENT} } userErrors { field message code } } }`, { cartId, attributes: sanitizeAttribution(attribution) }, "cartAttributesUpdate", buyerIp);
}

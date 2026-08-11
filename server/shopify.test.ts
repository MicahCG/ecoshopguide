import test from "node:test";
import assert from "node:assert/strict";
import {
  attributionSchema,
  cartIdSchema,
  mapShopifyErrors,
  isWeddingVariant,
  normalizeProduct,
  parseReview,
  quantitySchema,
  sanitizeAttribution,
  toPublicCart,
  validatedBuyerIp,
  variantIdSchema,
} from "./shopify";

const money = { amount: "39.50", currencyCode: "USD" };
const rawProduct = {
  id: "gid://shopify/Product/1", handle: "linen-runner", title: "Linen Runner",
  description: "A table runner.", descriptionHtml: "<p>A table runner.</p>", availableForSale: true,
  featuredImage: { url: "https://cdn.shopify.com/a.jpg", altText: null, width: 800, height: 1000 },
  images: { nodes: [] }, priceRange: { minVariantPrice: money },
  options: [{ name: "Color", values: ["Ivory", "Clay"] }],
  variants: { nodes: [{ id: "gid://shopify/ProductVariant/2", title: "Ivory", availableForSale: true, price: money, selectedOptions: [{ name: "Color", value: "Ivory" }], image: null }] },
  rating: { value: '{"value":"4.7","scale_min":"1.0","scale_max":"5.0"}' }, ratingCount: { value: "12" },
};

test("normalizes Shopify product data and real review metafields", () => {
  const product = normalizeProduct(rawProduct);
  assert.equal(product.price.amount, "39.50");
  assert.equal(product.variants[0].id, "gid://shopify/ProductVariant/2");
  assert.deepEqual(product.review, { rating: 4.7, count: 12 });
});

test("omits review unless both valid real fields are present", () => {
  assert.equal(parseReview({ value: "4.9" }, null), undefined);
  assert.equal(parseReview({ value: "not-json" }, { value: "2" }), undefined);
  assert.equal(parseReview({ value: '{"value":"5.1"}' }, { value: "2" }), undefined);
});

test("validates Shopify GIDs and bounded quantities", () => {
  assert.equal(cartIdSchema.safeParse("gid://shopify/Cart/abc?key=secret").success, true);
  assert.equal(variantIdSchema.safeParse("gid://shopify/ProductVariant/12").success, true);
  assert.equal(variantIdSchema.safeParse("gid://shopify/Product/12").success, false);
  assert.equal(quantitySchema.safeParse(0).success, false);
  assert.equal(quantitySchema.safeParse(101).success, false);
});

test("sanitizes allowlisted attribution without PII", () => {
  const parsed = attributionSchema.parse({ epik: " pin-123 ", utm_source: "pinterest", landing_path: "/shop-the-look/weddings?email=x@y.com", email: "x@y.com" });
  assert.deepEqual(sanitizeAttribution(parsed), [
    { key: "epik", value: "pin-123" },
    { key: "utm_source", value: "pinterest" },
    { key: "landing_path", value: "/shop-the-look/weddings" },
  ]);
  assert.deepEqual(sanitizeAttribution(attributionSchema.parse({ utm_campaign: "email-jane@example.com", utm_content: "call-512-555-0199", utm_term: "https://example.com" })), []);
});

test("validates buyer IPs and Wedding variant membership", () => {
  assert.equal(validatedBuyerIp("203.0.113.10"), "203.0.113.10");
  assert.equal(validatedBuyerIp("2001:db8::1"), "2001:db8::1");
  assert.equal(validatedBuyerIp("203.0.113.10, 10.0.0.1"), undefined);
  assert.equal(validatedBuyerIp("not-an-ip"), undefined);
  assert.equal(isWeddingVariant({ availableForSale: true, product: { collections: { nodes: [{ handle: "wedding" }] } } }), true);
  assert.equal(isWeddingVariant({ availableForSale: false, product: { collections: { nodes: [{ handle: "wedding" }] } } }), false);
  assert.equal(isWeddingVariant({ availableForSale: true, product: { collections: { nodes: [{ handle: "other" }] } } }), false);
});

test("maps Shopify userErrors without leaking field internals", () => {
  assert.deepEqual(mapShopifyErrors([{ field: ["lines", "0", "quantity"], message: "Not enough merchandise." }]), { status: 422, message: "Not enough merchandise." });
  assert.deepEqual(mapShopifyErrors([], [{ message: "API unavailable" }]), { status: 502, message: "Shopify is temporarily unavailable." });
});

test("removes the secret-bearing Shopify cart ID from browser responses", () => {
  const cart = {
    id: "gid://shopify/Cart/abc?key=secret",
    checkoutUrl: "https://example.myshopify.com/checkouts/abc",
    totalQuantity: 0,
    lines: [],
    cost: { subtotalAmount: money, totalAmount: money },
  };
  const publicCart = toPublicCart(cart);
  assert.equal("id" in publicCart, false);
  assert.equal(publicCart.checkoutUrl, cart.checkoutUrl);
});

import type { ShopifyMoney } from "@shared/shopify";
const ATTRIBUTION_KEYS = ["epik", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
type AttributionStorage = Pick<Storage, "getItem" | "setItem">;
export function collectAttribution(search: string, path: string, storage: AttributionStorage): Record<string, string> {
  const params = new URLSearchParams(search); const result: Record<string, string> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const storageKey = `eco_shopify_${key}`; const stored = storage.getItem(storageKey); const incoming = params.get(key);
    const safeIncoming = incoming && !/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(incoming) && !/(?:https?:\/\/|www\.)/i.test(incoming) && !/(?:^|\D)\+?\d[\d\s().-]{6,}\d(?:\D|$)/.test(incoming) ? incoming : null;
    if (!stored && safeIncoming) storage.setItem(storageKey, safeIncoming);
    const value = stored || safeIncoming; if (value) result[key] = value;
  }
  const landingKey = "eco_shopify_landing_path"; if (!storage.getItem(landingKey)) storage.setItem(landingKey, path);
  result.landing_path = storage.getItem(landingKey) || path;
  return result;
}
export function formatMoney(money: ShopifyMoney): string {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: money.currencyCode }).format(Number(money.amount));
}
export function productPriceLabel(price: ShopifyMoney, variants: Array<{ price: ShopifyMoney }>): string {
  const distinctPrices = new Set(variants.map((variant) => `${variant.price.currencyCode}:${variant.price.amount}`));
  return `${distinctPrices.size > 1 ? "From " : ""}${formatMoney(price)}`;
}
export function variantRequiresSelection(variants: Array<{ availableForSale: boolean }>): boolean {
  return variants.length > 1;
}

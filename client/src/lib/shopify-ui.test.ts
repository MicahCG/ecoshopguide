import test from "node:test";
import assert from "node:assert/strict";
import { collectAttribution, formatMoney, productPriceLabel, variantRequiresSelection } from "./shopify-ui";

test("formats money using returned currency", () => {
  assert.equal(formatMoney({ amount: "39.50", currencyCode: "USD" }), "$39.50");
  assert.equal(productPriceLabel({ amount: "35.00", currencyCode: "USD" }, [{ price: { amount: "35.00", currencyCode: "USD" } }, { price: { amount: "52.00", currencyCode: "USD" } }]), "From $35.00");
  assert.equal(productPriceLabel({ amount: "35.00", currencyCode: "USD" }, [{ price: { amount: "35.00", currencyCode: "USD" } }]), "$35.00");
});
test("persists first-touch attribution across navigation", () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => void values.set(key, value) };
  assert.deepEqual(collectAttribution("?epik=pin&utm_source=pinterest", "/shop-the-look/weddings", storage), { epik: "pin", utm_source: "pinterest", landing_path: "/shop-the-look/weddings" });
  assert.deepEqual(collectAttribution("", "/products/runner", storage), { epik: "pin", utm_source: "pinterest", landing_path: "/shop-the-look/weddings" });
  assert.deepEqual(collectAttribution("?epik=later&utm_source=email", "/products/runner", storage), { epik: "pin", utm_source: "pinterest", landing_path: "/shop-the-look/weddings" });
  assert.deepEqual(collectAttribution("?utm_campaign=jane@example.com&utm_content=512-555-0199", "/products/runner", storage), { epik: "pin", utm_source: "pinterest", landing_path: "/shop-the-look/weddings" });
});

test("requires explicit selection for multiple available variants", () => {
  assert.equal(variantRequiresSelection([{ availableForSale: true }, { availableForSale: true }]), true);
  assert.equal(variantRequiresSelection([{ availableForSale: true }, { availableForSale: false }]), true);
  assert.equal(variantRequiresSelection([{ availableForSale: true }]), false);
});

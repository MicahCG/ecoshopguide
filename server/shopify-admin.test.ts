import assert from "node:assert/strict";
import test from "node:test";
import {
  clearShopifyAdminTokenCache,
  getShopifyAdminConfig,
  shopifyAdminRequest,
} from "./shopify-admin";

const env = {
  SHOPIFY_STORE_DOMAIN: "https://example.myshopify.com/",
  SHOPIFY_ADMIN_CLIENT_ID: "client-id",
  SHOPIFY_ADMIN_CLIENT_SECRET: "test-secret",
};

test("normalizes a Shopify admin domain", () => {
  const config = getShopifyAdminConfig(env);
  assert.equal(config.storeDomain, "example.myshopify.com");
  assert.equal(config.apiVersion, "2026-07");
});

test("uses a server-only access token for Admin GraphQL", async () => {
  clearShopifyAdminTokenCache();
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const fetchImpl: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    if (requests.length === 1) {
      return new Response(JSON.stringify({ access_token: "temporary-token", expires_in: 3600 }), { status: 200 });
    }
    return new Response(JSON.stringify({ data: { shop: { name: "Bambana" } } }), { status: 200 });
  };

  const result = await shopifyAdminRequest<{ shop: { name: string } }>(
    "query { shop { name } }",
    undefined,
    { env, fetchImpl, now: () => 1_000 },
  );

  assert.equal(result.shop.name, "Bambana");
  assert.match(requests[0].url, /admin\/oauth\/access_token$/);
  assert.match(requests[1].url, /admin\/api\/2026-07\/graphql\.json$/);
  assert.equal(requests[1].init?.headers && (requests[1].init.headers as Record<string, string>)["X-Shopify-Access-Token"], "temporary-token");
});

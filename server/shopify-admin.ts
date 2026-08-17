/** Server-only Shopify Admin API client. Do not import from browser code. */
type Env = Record<string, string | undefined>;
export type ShopifyAdminRequestOptions = { env?: Env; fetchImpl?: typeof fetch; now?: () => number };
type Config = { apiVersion: string; clientId: string; clientSecret: string; storeDomain: string };
type TokenCache = { accessToken: string; expiresAt: number; storeDomain: string };
let tokenCache: TokenCache | null = null;

export class ShopifyAdminRequestError extends Error {
  constructor(message: string) { super(message); this.name = "ShopifyAdminRequestError"; }
}

function storeDomain(value: string) {
  return value.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getShopifyAdminConfig(env: Env = process.env as Env): Config {
  const domain = storeDomain(env.SHOPIFY_STORE_DOMAIN ?? "");
  const clientId = env.SHOPIFY_ADMIN_CLIENT_ID?.trim() ?? "";
  const clientSecret = env.SHOPIFY_ADMIN_CLIENT_SECRET?.trim() ?? "";
  if (!domain.endsWith(".myshopify.com")) throw new ShopifyAdminRequestError("SHOPIFY_STORE_DOMAIN must be your *.myshopify.com domain.");
  if (!clientId || !clientSecret) throw new ShopifyAdminRequestError("Shopify Admin API credentials are not configured.");
  return { storeDomain: domain, clientId, clientSecret, apiVersion: env.SHOPIFY_ADMIN_API_VERSION?.trim() || "2026-07" };
}

export function isShopifyAdminConfigured(env: Env = process.env as Env) {
  try { getShopifyAdminConfig(env); return true; } catch { return false; }
}
export function clearShopifyAdminTokenCache() { tokenCache = null; }

async function json(response: Response): Promise<unknown> {
  try { return await response.json(); } catch { return null; }
}

async function accessToken(config: Config, fetchImpl: typeof fetch, now: () => number) {
  if (tokenCache?.storeDomain === config.storeDomain && tokenCache.expiresAt > now()) return tokenCache.accessToken;
  const response = await fetchImpl(`https://${config.storeDomain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials", client_id: config.clientId, client_secret: config.clientSecret }),
  });
  const payload = await json(response) as { access_token?: unknown; expires_in?: unknown } | null;
  if (!response.ok || typeof payload?.access_token !== "string") throw new ShopifyAdminRequestError("Shopify could not authorize the Store Manager app.");
  const expiresIn = typeof payload.expires_in === "number" && payload.expires_in > 0 ? payload.expires_in : 23 * 60 * 60;
  tokenCache = { accessToken: payload.access_token, expiresAt: now() + Math.max(60, expiresIn - 60) * 1000, storeDomain: config.storeDomain };
  return payload.access_token;
}

export async function shopifyAdminRequest<T>(query: string, variables?: Record<string, unknown>, options: ShopifyAdminRequestOptions = {}): Promise<T> {
  const config = getShopifyAdminConfig(options.env);
  const fetchImpl = options.fetchImpl ?? fetch;
  const token = await accessToken(config, fetchImpl, options.now ?? Date.now);
  const response = await fetchImpl(`https://${config.storeDomain}/admin/api/${config.apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await json(response) as { data?: T; errors?: unknown } | null;
  if (!response.ok || payload?.errors || !payload?.data) throw new ShopifyAdminRequestError("Shopify Admin API could not complete that request.");
  return payload.data;
}

export async function verifyShopifyAdminAccess(options: ShopifyAdminRequestOptions = {}) {
  const data = await shopifyAdminRequest<{ shop: { name: string; myshopifyDomain: string } }>("query StoreManagerHealth { shop { name myshopifyDomain } }", undefined, options);
  return data.shop;
}

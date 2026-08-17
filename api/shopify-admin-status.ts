import { isShopifyAdminConfigured } from "../server/shopify-admin.js";

/**
 * Safe deployment check for the server-only Shopify Admin client.
 * It intentionally never exposes credentials or access tokens.
 */
export default function handler(_request: unknown, response: any) {
  response.setHeader("Cache-Control", "no-store");
  response.status(200).json({
    configured: isShopifyAdminConfigured(),
  });
}

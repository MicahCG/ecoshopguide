import {
  ShopifyAdminRequestError,
  verifyShopifyAdminAccess,
} from "../server/shopify-admin.js";

/**
 * Performs a live, credentialed Shopify Admin API health check without ever
 * returning an access token or app secret. This is useful after changing
 * Vercel environment variables or Shopify app scopes.
 */
export default async function handler(_request: unknown, response: any) {
  response.setHeader("Cache-Control", "no-store");

  try {
    const shop = await verifyShopifyAdminAccess();
    response.status(200).json({
      connected: true,
      shop: {
        name: shop.name,
        myshopifyDomain: shop.myshopifyDomain,
      },
    });
  } catch (error) {
    const message = error instanceof ShopifyAdminRequestError
      ? error.message
      : "Unable to establish a Shopify Admin API connection.";
    response.status(503).json({ connected: false, error: message });
  }
}

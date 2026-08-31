import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { sql } from "drizzle-orm";
import {
  ShopifyRequestError, addCartLine, cartCheckoutSchema, cartCreateSchema, cartIdSchema,
  cartLineRemoveSchema, cartLineUpdateSchema, cartLinesAddSchema, collectionHandleSchema,
  createCart, getCart, getShopifyCollection, getShopifyProduct, handleSchema,
  removeCartLine, toPublicCart, updateCartAttributes, updateCartLine, validatedBuyerIp,
} from "./shopify.js";
import { db, requireDb } from "./db.js";
import { analyticsEvents } from "../shared/schema.js";
import { isShopifyAdminConfigured } from "./shopify-admin.js";

export async function registerRoutes(app: Express): Promise<Server> {
  const cartCookie = "ecoshopguide_shopify_cart";
  const cartCookieOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", maxAge: 10 * 24 * 60 * 60 * 1000, path: "/" };
  const cartCookieClearOptions = { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
  const cartIdFromRequest = (req: any): string | undefined => {
    const encoded = String(req.headers.cookie || "").split(";").map((part: string) => part.trim()).find((part: string) => part.startsWith(`${cartCookie}=`))?.slice(cartCookie.length + 1);
    if (!encoded) return undefined;
    try { const parsed = cartIdSchema.safeParse(decodeURIComponent(encoded)); return parsed.success ? parsed.data : undefined; } catch { return undefined; }
  };
  const buyerIpFromRequest = (req: any): string | undefined => validatedBuyerIp(req.ip);
  const analyticsEventSchema = z.object({
    event_id: z.string().min(12).max(160).regex(/^[A-Za-z0-9_-]+$/),
    session_id: z.string().min(12).max(64).regex(/^[A-Za-z0-9_-]+$/),
    event_name: z.enum(["page_visit", "view_category", "view_item", "product_card_click", "add_to_cart", "begin_checkout", "newsletter_signup", "moment_card_click", "chat_button_click"]),
    page_path: z.string().min(1).max(2_000).regex(/^\//),
    referrer_domain: z.string().max(255).optional(),
    utm_source: z.string().max(255).optional(),
    utm_medium: z.string().max(255).optional(),
    utm_campaign: z.string().max(255).optional(),
    utm_content: z.string().max(255).optional(),
    metadata: z.record(z.string(), z.union([z.string().max(255), z.number().finite(), z.boolean()])).default({}),
  });
  const requireCartId = (req: any) => { const id = cartIdFromRequest(req); if (!id) throw new ShopifyRequestError(404, "Cart not found."); return id; };
  const shopifyHandler = (handler: (req: any, res: any) => Promise<unknown>) => async (req: any, res: any) => {
    try { res.json(await handler(req, res)); }
    catch (error) {
      if (error instanceof ShopifyRequestError && error.code === "CART_MISSING") res.clearCookie(cartCookie, cartCookieClearOptions);
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Invalid Shopify request." });
      const status = error instanceof ShopifyRequestError ? error.status : 500;
      const message = error instanceof ShopifyRequestError ? error.message : "Unable to complete Shopify request.";
      res.status(status).json({ error: message });
    }
  };

  app.get("/api/shopify/admin/status", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ configured: isShopifyAdminConfigured() });
  });

  app.get("/api/shopify/collection/:handle", shopifyHandler(async (req) => {
    const handle = collectionHandleSchema.parse(req.params.handle);
    const collection = await getShopifyCollection(handle);
    if (!collection) throw new ShopifyRequestError(404, "This collection is not available right now.");
    return collection;
  }));
  app.get("/api/shopify/products/:handle", shopifyHandler(async (req) => {
    const product = await getShopifyProduct(handleSchema.parse(req.params.handle));
    if (!product) throw new ShopifyRequestError(404, "This product is not available right now.");
    return product;
  }));
  app.get("/api/shopify/cart", shopifyHandler(async (req, res) => {
    const cartId = cartIdFromRequest(req);
    if (!cartId) return null;
    const cart = await getCart(cartId, buyerIpFromRequest(req));
    if (!cart) { res.clearCookie(cartCookie, cartCookieClearOptions); return null; }
    return toPublicCart(cart);
  }));
  app.post("/api/shopify/cart", shopifyHandler(async (req, res) => { const input = cartCreateSchema.parse(req.body); const cart = await createCart(input.variantId, input.quantity, input.attribution, buyerIpFromRequest(req)); res.cookie(cartCookie, cart.id, cartCookieOptions); return toPublicCart(cart); }));
  app.post("/api/shopify/cart/lines", shopifyHandler(async (req, res) => { const input = cartLinesAddSchema.parse(req.body); const existingId = cartIdFromRequest(req); let cart; try { cart = existingId ? await addCartLine(existingId, input.variantId, input.quantity, buyerIpFromRequest(req)) : await createCart(input.variantId, input.quantity, input.attribution, buyerIpFromRequest(req)); } catch (error) { if (!(error instanceof ShopifyRequestError) || error.code !== "CART_MISSING") throw error; res.clearCookie(cartCookie, cartCookieClearOptions); cart = await createCart(input.variantId, input.quantity, input.attribution, buyerIpFromRequest(req)); } if (!existingId || cart.id !== existingId) res.cookie(cartCookie, cart.id, cartCookieOptions); return toPublicCart(cart); }));
  app.patch("/api/shopify/cart/lines", shopifyHandler(async (req) => { const input = cartLineUpdateSchema.parse(req.body); return toPublicCart(await updateCartLine(requireCartId(req), input.lineId, input.quantity, buyerIpFromRequest(req))); }));
  app.delete("/api/shopify/cart/lines", shopifyHandler(async (req) => { const input = cartLineRemoveSchema.parse(req.body); return toPublicCart(await removeCartLine(requireCartId(req), input.lineId, buyerIpFromRequest(req))); }));
  app.post("/api/shopify/cart/checkout", shopifyHandler(async (req) => { const input = cartCheckoutSchema.parse(req.body); const cartId = requireCartId(req); const cart = input.attribution ? await updateCartAttributes(cartId, input.attribution, buyerIpFromRequest(req)) : await getCart(cartId, buyerIpFromRequest(req)); if (!cart) throw new ShopifyRequestError(404, "Cart not found.", "CART_MISSING"); return { checkoutUrl: cart.checkoutUrl, cart: toPublicCart(cart) }; }));

  app.post("/api/analytics/events", async (req, res) => {
    const parsed = analyticsEventSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid analytics event." });
    const origin = String(req.headers.origin || "");
    if (origin && !new Set(["https://shopbambana.com", "https://www.shopbambana.com"]).has(origin)) {
      return res.status(403).json({ error: "Invalid analytics origin." });
    }
    try {
      const input = parsed.data;
      await requireDb().insert(analyticsEvents).values({
        eventId: input.event_id,
        sessionId: input.session_id,
        eventName: input.event_name,
        pagePath: input.page_path,
        referrerDomain: input.referrer_domain,
        utmSource: input.utm_source,
        utmMedium: input.utm_medium,
        utmCampaign: input.utm_campaign,
        utmContent: input.utm_content,
        metadata: input.metadata,
      }).onConflictDoNothing({ target: analyticsEvents.eventId });
      return res.status(202).json({ recorded: true });
    } catch (error) {
      console.error("First-party analytics write failed", error instanceof Error ? error.message : error);
      return res.status(503).json({ recorded: false });
    }
  });

  app.get("/api/analytics/health", async (_req, res) => {
    if (!db) return res.status(503).json({ firstPartyAnalytics: false });
    try {
      await requireDb().execute(sql`select 1`);
      return res.json({ firstPartyAnalytics: true });
    } catch (error) {
      console.error("First-party analytics health check failed", error instanceof Error ? error.message : error);
      return res.status(503).json({ firstPartyAnalytics: false });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

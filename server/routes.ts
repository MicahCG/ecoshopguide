import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import {
  ShopifyRequestError, addCartLine, cartCheckoutSchema, cartCreateSchema, cartIdSchema,
  cartLineRemoveSchema, cartLineUpdateSchema, cartLinesAddSchema, createCart, getCart,
  getWeddingCollection, getWeddingProduct, handleSchema, removeCartLine, toPublicCart,
  updateCartAttributes, updateCartLine, validatedBuyerIp,
} from "./shopify.js";

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

  app.get("/api/shopify/collection/wedding", shopifyHandler(async () => {
    const collection = await getWeddingCollection();
    if (!collection) throw new ShopifyRequestError(404, "Wedding collection not found.");
    return collection;
  }));
  app.get("/api/shopify/products/:handle", shopifyHandler(async (req) => {
    const product = await getWeddingProduct(handleSchema.parse(req.params.handle));
    if (!product) throw new ShopifyRequestError(404, "Wedding product not found.");
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

  const httpServer = createServer(app);

  return httpServer;
}

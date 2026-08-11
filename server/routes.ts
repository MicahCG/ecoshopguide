import type { Express } from "express";
import { createServer, type Server } from "http";
import { db, requireDb } from "./db";
import { analyticsEvents, blogs, newsletterSubscribers } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import { Resend } from "resend";
import { z } from "zod";
import {
  ShopifyRequestError, addCartLine, cartCheckoutSchema, cartCreateSchema, cartIdSchema,
  cartLineRemoveSchema, cartLineUpdateSchema, cartLinesAddSchema, createCart, getCart,
  getWeddingCollection, getWeddingProduct, handleSchema, removeCartLine, toPublicCart,
  updateCartAttributes, updateCartLine, validatedBuyerIp,
} from "./shopify";

// Initialize Resend for email
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || null;

// Simple in-memory rate limiter for newsletter signups
const newsletterRateLimit = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 attempts per IP per hour
const analyticsRateLimit = new Map<string, number[]>();
const ANALYTICS_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const ANALYTICS_RATE_LIMIT_MAX = 120;
let analyticsSchemaReady: Promise<void> | undefined;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = newsletterRateLimit.get(ip) || [];
  const recent = attempts.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  newsletterRateLimit.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  newsletterRateLimit.set(ip, recent);
  return false;
}

function isAnalyticsRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = analyticsRateLimit.get(ip) || [];
  const recent = attempts.filter(t => now - t < ANALYTICS_RATE_LIMIT_WINDOW_MS);
  analyticsRateLimit.set(ip, recent);
  if (recent.length >= ANALYTICS_RATE_LIMIT_MAX) return true;
  recent.push(now);
  analyticsRateLimit.set(ip, recent);
  return false;
}

const analyticsEventSchema = z.object({
  sessionId: z.string().uuid(),
  eventName: z.string().regex(/^[a-z][a-z0-9_]{0,79}$/),
  pagePath: z.string().startsWith("/").max(2_000),
  referrerDomain: z.string().max(255).optional(),
  utmSource: z.string().max(255).optional(),
  utmMedium: z.string().max(255).optional(),
  utmCampaign: z.string().max(255).optional(),
  utmContent: z.string().max(255).optional(),
  metadata: z.record(z.union([z.string().max(255), z.number(), z.boolean()])).default({}),
});

// Existing deployments predate Drizzle migration history. Bootstrap only the
// new analytics relation, without trying to recreate the application's tables.
function ensureAnalyticsSchema(): Promise<void> {
  if (!analyticsSchemaReady) {
    analyticsSchemaReady = (async () => {
      const database = requireDb();
      await database.execute(sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
          session_id varchar(64) NOT NULL,
          event_name varchar(80) NOT NULL,
          page_path text NOT NULL,
          referrer_domain varchar(255),
          utm_source varchar(255),
          utm_medium varchar(255),
          utm_campaign varchar(255),
          utm_content varchar(255),
          metadata json DEFAULT '{}'::json NOT NULL,
          occurred_at timestamp with time zone DEFAULT now() NOT NULL
        )
      `);
      await database.execute(sql`CREATE INDEX IF NOT EXISTS analytics_events_occurred_at_idx ON analytics_events (occurred_at)`);
      await database.execute(sql`CREATE INDEX IF NOT EXISTS analytics_events_event_name_occurred_at_idx ON analytics_events (event_name, occurred_at)`);
      await database.execute(sql`CREATE INDEX IF NOT EXISTS analytics_events_session_id_occurred_at_idx ON analytics_events (session_id, occurred_at)`);
    })().catch((error) => {
      analyticsSchemaReady = undefined;
      throw error;
    });
  }
  return analyticsSchemaReady;
}

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

  // Receive non-sensitive, first-party visitor events. The database is kept
  // server-side so browser clients never receive a Supabase service key.
  app.post("/api/analytics/events", async (req, res) => {
    const start = Date.now();
    const clientIp = req.ip || req.socket.remoteAddress || "unknown";

    try {
      if (isAnalyticsRateLimited(clientIp)) {
        return res.status(429).json({ error: "Too many analytics events." });
      }

      const event = analyticsEventSchema.parse(req.body);
      const database = requireDb();
      await ensureAnalyticsSchema();
      await database.insert(analyticsEvents).values(event);
      console.log(JSON.stringify({
        level: "info",
        message: "analytics_event_recorded",
        eventName: event.eventName,
        duration_ms: Date.now() - start,
      }));
      return res.status(202).json({ accepted: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid analytics event." });
      }
      console.error(JSON.stringify({
        level: "error",
        message: "analytics_event_failed",
        error: error instanceof Error ? error.message : String(error),
        duration_ms: Date.now() - start,
      }));
      return res.status(500).json({ error: "Unable to record analytics event." });
    }
  });

  // Get all blog posts
  app.get("/api/blogs", async (req, res) => {
    try {
      const database = requireDb();
      const allBlogs = await database
        .select()
        .from(blogs)
        .orderBy(desc(blogs.createdAt));

      res.json(allBlogs);
    } catch (error: any) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Failed to fetch blogs', message: error.message });
    }
  });

  // Get single blog post by slug
  app.get("/api/blogs/:slug", async (req, res) => {
    try {
      const database = requireDb();
      const { slug } = req.params;

      const [blog] = await database
        .select()
        .from(blogs)
        .where(eq(blogs.slug, slug))
        .limit(1);

      if (!blog) {
        return res.status(404).json({ error: 'Blog post not found' });
      }

      res.json(blog);
    } catch (error: any) {
      console.error('Error fetching blog:', error);
      res.status(500).json({ error: 'Failed to fetch blog', message: error.message });
    }
  });

  // Newsletter subscribe endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      // Rate limiting
      const clientIp = req.ip || req.socket.remoteAddress || "unknown";
      if (isRateLimited(clientIp)) {
        return res.status(429).json({ error: "Too many requests. Please try again later." });
      }

      const database = requireDb();
      const { email, source } = req.body;

      // Validate email
      const trimmedEmail = email?.trim()?.toLowerCase();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return res.status(400).json({ error: "Please enter a valid email address" });
      }

      // Validate source
      const validSources = ["homepage_section", "exit_intent_popup"];
      if (!source || !validSources.includes(source)) {
        return res.status(400).json({ error: "Invalid source" });
      }

      let emailSent = false;

      // Check if email already exists
      const existing = await database.query.newsletterSubscribers.findFirst({
        where: eq(newsletterSubscribers.email, trimmedEmail),
      });

      if (existing) {
        emailSent = await sendWelcomeEmail(trimmedEmail);
        return res.json({ success: true, emailSent });
      }

      // Save to database
      await database.insert(newsletterSubscribers).values({
        email: trimmedEmail,
        source,
        status: "active",
      });

      // Send welcome email via Resend
      emailSent = await sendWelcomeEmail(trimmedEmail);

      // Add contact to Resend Audience for future campaigns
      if (resend && RESEND_AUDIENCE_ID) {
        try {
          await resend.contacts.create({
            audienceId: RESEND_AUDIENCE_ID,
            email: trimmedEmail,
            firstName: "",
            lastName: "",
            unsubscribed: false,
          });
        } catch (contactError: any) {
          console.error("Failed to add contact to Resend audience:", contactError.message);
        }
      }

      res.json({ success: true, emailSent });
    } catch (error: any) {
      console.error("Newsletter subscribe error:", error);
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  });

  // Helper: send welcome email via Resend
  async function sendWelcomeEmail(email: string): Promise<boolean> {
    if (!resend) return false;
    try {
      await resend.emails.send({
        from: "EcoShopGuide <livebambana@gmail.com>",
        to: email,
        subject: "Welcome to EcoShopGuide — sustainable living, simplified",
        html: `
          <div style="font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #2a2520;">
            <h1 style="font-family: 'Georgia', serif; font-size: 28px; margin-bottom: 16px; color: #1a3409;">Welcome to EcoShopGuide</h1>
            <p style="font-size: 16px; line-height: 1.6;">Thanks for joining! We share guides, tips, and ideas for sustainable living — once a week. No spam, just good stuff.</p>
            <a href="https://ecoshopguide.com/blog" style="display: inline-block; background-color: #1a3409; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-top: 16px;">Read the Blog →</a>
            <p style="font-size: 13px; color: #999; margin-top: 32px;">You're receiving this because you signed up at ecoshopguide.com.</p>
          </div>
        `,
      });
      return true;
    } catch (emailError: any) {
      console.error("Failed to send welcome email:", emailError.message);
      return false;
    }
  }

  const httpServer = createServer(app);

  return httpServer;
}

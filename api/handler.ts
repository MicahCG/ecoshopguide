import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import path from "path";

const app = express();
app.set("trust proxy", 1);

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// Serve attached assets
app.use('/attached_assets', express.static(path.resolve(process.cwd(), 'attached_assets')));

// Domain redirect middleware
app.use((req, res, next) => {
  const host = req.headers.host || '';
  const primaryDomain = 'ecoshopguide.com';
  const wwwDomain = 'www.ecoshopguide.com';
  const protocol = req.headers['x-forwarded-proto'] || 'https';

  // Skip redirects for API routes to prevent CORS issues
  // (www.ecoshopguide.com -> ecoshopguide.com redirect breaks fetch requests)
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // Skip redirects for Vercel preview deployments and localhost
  const isPreview = host.includes('vercel.app') ||
                    host.includes('localhost') ||
                    host.includes('127.0.0.1') ||
                    process.env.VERCEL_ENV === 'preview';

  if (isPreview) {
    return next();
  }

  if (host !== primaryDomain && host !== wwwDomain) {
    return res.redirect(301, `${protocol}://${primaryDomain}${req.originalUrl}`);
  }

  if (host === wwwDomain) {
    return res.redirect(301, `${protocol}://${primaryDomain}${req.originalUrl}`);
  }

  next();
});

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse && !path.startsWith("/api/shopify/cart")) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Initialize routes (async)
let routesRegistered = false;
const routesPromise = registerRoutes(app).then(() => {
  routesRegistered = true;
  console.log('Routes registered successfully');
}).catch(err => {
  console.error('Failed to register routes:', err);
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error('Error:', err);
  res.status(status).json({ message });
});

// Export for Vercel serverless
export default async function handler(req: any, res: any) {
  // Wait for routes to be registered
  if (!routesRegistered) {
    await routesPromise;
  }

  return app(req, res);
}

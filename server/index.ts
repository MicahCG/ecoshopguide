import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
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

app.use('/attached_assets', express.static(path.resolve(import.meta.dirname, '..', 'attached_assets')));

app.use((req, res, next) => {
  const host = req.headers.host || '';
  const primaryDomain = 'shopbambana.com';
  const wwwDomain = 'www.shopbambana.com';
  const protocol = req.headers['x-forwarded-proto'] || 'https';

  // Skip redirects for API routes to prevent CORS issues
  if (req.path.startsWith('/api/')) {
    return next();
  }

  // Skip redirects for development environments (localhost, Replit dev domains)
  const isDev = host.includes('localhost') ||
                host.includes('127.0.0.1') ||
                host.includes('replit') ||
                host.includes('.dev') ||
                process.env.NODE_ENV === 'development';

  if (isDev) {
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

app.use((req, res, next) => {
  // Skip path validation entirely in development
  const host = req.headers.host || '';
  const isDev = host.includes('localhost') || 
                host.includes('127.0.0.1') || 
                host.includes('replit') ||
                host.includes('.dev') ||
                host.includes('.repl.co') ||
                process.env.NODE_ENV === 'development';
  
  if (isDev) {
    return next();
  }

  const validPaths = [
    '/',                          // Homepage
    '/favicon.ico',               // Favicon
    '/robots.txt',                // Robots file
    '/sitemap.xml',               // Sitemap
    '/ads.txt',                   // Ads.txt
  ];

  const validPrefixes = [
    '/api/',                      // API routes
    '/attached_assets/',          // Static assets
    '/assets/',                   // Vite built assets
    '/static/',                   // Static files
    '/pages/',                    // Static pages (about, privacy, etc.)
    '/shop-the-look',             // Curated commerce routes
    '/collections/',              // Shopify collection aliases
    '/products/',                 // Shopify Wedding products
    '/@',                         // Vite dev server assets (e.g. /@vite/, /@react-refresh)
  ];
  
  const path = req.path;
  
  // Allow exact matches
  if (validPaths.includes(path)) {
    return next();
  }
  
  // Allow prefix matches
  if (validPrefixes.some(prefix => path.startsWith(prefix))) {
    return next();
  }
  
  // Allow file extensions (images, fonts, manifests, etc.)
  if (/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|json|map|webmanifest|txt|xml)$/i.test(path)) {
    return next();
  }
  
  // Everything else → redirect to homepage with full domain
  return res.redirect(301, 'https://shopbambana.com');
});

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

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    // reusePort is unsupported on macOS/Windows sockets (ENOTSUP)
    ...(process.platform === "linux" ? { reusePort: true } : {}),
  }, () => {
    log(`serving on port ${port}`);
  });
})();

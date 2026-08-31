# Bambana Essentials Storefront

## Overview
The Bambana Essentials Storefront is a conversion-optimized e-commerce platform designed to streamline the online shopping experience for sustainable home and wellness products. It aims to reduce the Pinterest-to-purchase friction to two steps, leveraging a modern, eco-friendly aesthetic. Built with React and Express, it features a single-click purchase flow via Stripe, with Shopify handling backend fulfillment. The project prioritizes mobile-first design, prominent trust signals, and fast loading times to maximize conversion rates among environmentally conscious consumers.

## User Preferences
Preferred communication style: Simple, everyday language.

**Content Writing Style**:
- NEVER use em dashes (—) anywhere in content, copy, or articles
- Use regular hyphens (-) instead when needed for breaks or pauses in sentences

## Database Safety & Data Preservation

**CRITICAL: Review Data Protection**
- NEVER delete, modify, or overwrite any review data in the database
- NEVER delete, modify, or overwrite any photos attached to reviews
- This data is sensitive and contains user-generated content that must be preserved at all times
- When making database schema changes or migrations, ensure review and review photo data is never touched or altered
- Always verify that migrations preserve existing review data completely intact

**Application-Level Protections Implemented:**
- **Soft Deletes**: Reviews use a `deletedAt` timestamp instead of hard deletes - data is never actually removed
- **Audit Logging**: All review operations are logged to `review_audit_log` table with:
  - Action type (CREATE, UPDATE, SOFT_DELETE, RESTORE)
  - User/performer ID
  - Previous and new data snapshots
  - IP address for security tracking
  - Timestamp
- **Query Filtering**: All review queries automatically filter out soft-deleted records (where `deletedAt IS NULL`)
- **No DELETE Operations**: There are no API endpoints that perform hard deletes on reviews

## System Architecture

### Frontend
The frontend uses React with TypeScript and Vite, following a component-based architecture. shadcn/ui (Radix UI primitives) provides accessible, customizable components styled with Tailwind CSS, adhering to an earth-tone color palette and specific typography (Playfair Display, Inter). Client-side routing is managed by Wouter, supporting main product listings, individual product pages, a Pinterest-style masonry grid blog, and various static content pages (Return Policy, About Us, Privacy Policy, Terms of Service). Blog posts utilize a discriminated union for affiliate products or editorial content, with responsive layouts and custom-generated images. State management relies on TanStack Query for server state and React's built-in hooks for local UI state. Framer Motion and Embla Carousel are used for animations and interactive elements like the social proof review carousel.

### Backend
The backend is built with Node.js and Express.js, offering RESTful API endpoints for products, checkout, webhooks (Stripe), reviews, and blog content. Product data is synced from Shopify every 5 minutes and cached, with a fallback to sample data if Shopify is unavailable. `mapShopifyCategory` function ensures accurate product categorization. The system handles guest user reviews by creating temporary user profiles. While a user schema exists, full authentication is pending, with current operations focused on guest interactions. Error handling ensures graceful degradation, especially if Stripe is unconfigured.

### Data Storage
Drizzle ORM is used with a schema-first approach for PostgreSQL, utilizing Neon's serverless driver for scalable access. The database schema includes tables for `users`, `orders`, `order_items`, `reviews`, `review_votes`, `wishlists`, and `blogs`, with Zod validation for type-safe data. Schema changes are managed via `drizzle-kit` migrations.

## External Dependencies

### Payment Processing
- **Stripe**: Handles all payment processing and checkout flows using Stripe Checkout Sessions. Integrated with `@stripe/stripe-js` and `@stripe/react-stripe-js`. Configured via `STRIPE_SECRET_KEY`.

### E-commerce Backend
- **Shopify**: Fully integrated for inventory management, product catalog synchronization, and order fulfillment. The `shopify-api-node` package is used, and Stripe webhooks automatically create Shopify orders. Configured via `SHOPIFY_SHOP_NAME` and `SHOPIFY_ACCESS_TOKEN`.

### Database Service
- **Neon Serverless PostgreSQL**: Primary database for application data, utilizing `@neondatabase/serverless` for edge-compatible connections. Configured via `DATABASE_URL`.

### UI Component Libraries
- **Radix UI Primitives**: Provides unstyled, accessible UI components customized with Tailwind CSS.

### Development Tools
- **Vite**: Frontend bundling and development server.
- **esbuild**: Server-side bundling for production.
- **PostCSS**: CSS processing with Tailwind and Autoprefixer.
- **Replit-Specific Plugins**: `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` for enhanced development experience.

### Asset Management
- **Unsplash**: Used for placeholder product imagery.
- **Google Fonts CDN**: Delivers Playfair Display and Inter typefaces.

## Shopping Cart System

### Cart State Management (client/src/lib/cart.tsx)
- **CartProvider**: React Context wrapper that provides cart state to all components
- **localStorage Persistence**: Cart persists across sessions using key `ecoshopguide_cart_v1`
- **Cart Operations**: addItem, removeItem, updateQuantity, addBundle, clearCart
- **CartItem Interface**: productId, variantId, name, price, imageUrl, quantity, source ('single' or 'bundle'), bundleId

### Cart UI (client/src/components/CartSlideOver.tsx)
- Slide-over panel triggered from header cart icon
- Shows line items with quantity controls (+/- buttons)
- Bundle items display "Bundle" badge
- Empty state messaging when cart is empty
- Checkout button initiates Stripe checkout with cart items

### Bundle System (client/src/lib/bundles.ts)
- **Dynamic Bundle Configs**: 8 pre-defined bundles across collections (wedding, small-spaces, home-decor, dorms)
- **Product Matching**: Uses keyword matching on product title, category, and tags
- **Bundle Discount**: 10% off applied automatically at Stripe checkout via reusable coupon
- **BundleSection Component**: Displays curated bundles on collection pages

### Stripe Cart Checkout (server/routes.ts)
- Supports two modes: 'single' (one product) and 'cart' (multiple items)
- Multi-item checkout creates Stripe session with all line items
- Bundle discount uses persistent Stripe coupon ID: 'eco-bundle-10-off'
- Coupon created once and reused for all bundle checkouts

## Analytics Events
- **Cart Events**: add_to_cart, remove_from_cart, cart_view, cart_checkout_start
- **Bundle Events**: bundle_section_view, bundle_impression, bundle_add_to_cart, bundle_buy_now_click
- All events include proper GA4 e-commerce parameters
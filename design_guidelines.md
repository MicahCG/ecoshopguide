# Design Guidelines: Bambana Essentials Storefront

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium sustainable e-commerce sites (Goop, The Sill, Package Free) combined with Shopify's clean product-focused layouts. The design must match the existing Webflow site aesthetic while optimizing for conversion with trust signals and minimal friction.

---

## Core Design Elements

### A. Color Palette

**Primary Brand Colors:**
- Deep Forest Green: 145 66% 14% (primary brand color)
- Forest Green Light: 100 47% 33% (hover states, accents)
- Forest Green Dark: 100 56% 12% (text on light backgrounds)

**Earth Tone Neutrals:**
- Warm Beige: 40 38% 93% (backgrounds, cards)
- Sand: 40 31% 84% (borders, dividers)
- Clay: 35 20% 70% (secondary text)

**Accent Colors:**
- Muted Gold: 30 42% 64% (CTA highlights, badges) - use sparingly
- Soft Sage: 88 16% 70% (success states, secondary accents)

**Neutral Scale:**
- Lightest: 60 9% 98% (page background)
- Darkest: 30 7% 11% (primary text)

### B. Typography

**Font Families:**
- Display/Headers: Playfair Display (serif, elegant)
- Body/UI: Inter (sans-serif, clean, modern)

**Type Scale:**
- Hero Headline: 3.5rem (56px) desktop, 2.5rem mobile / Playfair Display Bold
- Section Headers: 2.25rem (36px) desktop, 1.75rem mobile / Playfair Display Semibold
- Product Titles: 1.5rem (24px) / Inter Semibold
- Body Text: 1rem (16px) / Inter Regular
- Small/Meta Text: 0.875rem (14px) / Inter Regular
- Trust Badges: 0.75rem (12px) / Inter Medium uppercase

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 (mobile), p-8 (tablet), p-12 (desktop)
- Section spacing: py-16 (mobile), py-24 (desktop)
- Card gaps: gap-6 (mobile), gap-8 (desktop)
- Element spacing: space-y-4 for vertical rhythm

**Container System:**
- Max width: 1280px (7xl) for product grids
- Content max width: 1024px (4xl) for text-heavy sections
- Full-width hero with contained content overlay

**Grid Structure:**
- Product Grid: 1 column (mobile), 2 columns (tablet), 3-4 columns (desktop)
- Trust Badges: Horizontal scroll on mobile, 4-6 items visible on desktop

### D. Component Specifications

**Hero Section:**
- Height: 60vh minimum (500px)
- Full-bleed background image with gradient overlay (black 40% top to 60% bottom opacity)
- Centered content with white text
- Trust signals (badges carousel) positioned at bottom of hero, above fold

**Product Cards:**
- Aspect ratio: 4:3 for product images
- Rounded corners: 8px
- Subtle shadow on hover: shadow-lg transition
- White background with sand-colored border
- Padding: p-4
- Image treatment: Object-cover, subtle zoom on hover (scale-105)

**Navigation Bar (Sticky):**
- White background with sand bottom border
- Category filters as pill-shaped buttons
- Active state: forest green background with white text
- Inactive state: transparent with dark text, hover shows light beige background

**Trust Badges:**
- Circular or shield icons (32x32px)
- White background with subtle shadow
- Include: Secure Checkout, Eco-Certified, Free Shipping, 30-Day Returns
- Horizontal carousel on mobile, static row on desktop

**Call-to-Action Buttons:**
- Primary: Forest green background, white text, rounded-lg, py-3 px-6
- Hover: Slightly lighter green with shadow
- On images: White/light background with blur backdrop, dark text

**Product Quick Buy:**
- Single "Add to Cart" or "Quick Buy" button
- Stripe-powered one-click checkout
- Loading state with spinner
- Success toast notification

### E. Image Strategy

**Required Images:**
1. **Hero Image**: Full-width lifestyle shot showcasing sustainable wellness space (spa-like setting, natural materials, plants, warm lighting) - 1920x1080px minimum
2. **Product Images**: High-quality product photography on neutral backgrounds (white/beige) - 800x600px minimum
3. **Category Headers** (optional): Small banner images for filtered views - 1200x300px
4. **Trust Badge Icons**: SVG icons for security, shipping, returns, eco-certification

**Image Treatment:**
- Soft corners (rounded-lg) on product cards
- No borders on hero images
- Subtle overlay gradients for text readability
- Lazy loading for performance
- WebP format with fallbacks

### F. Responsive Behavior

**Breakpoints:**
- Mobile: 0-640px (single column, stacked layout)
- Tablet: 641-1024px (2 column grid)
- Desktop: 1025px+ (3-4 column grid)

**Mobile Priorities:**
- Hero reduced to 50vh minimum
- Category filters as horizontal scroll
- Product cards full width with smaller images
- Trust badges as compact carousel
- Sticky "Quick Buy" bar at bottom

### G. Animations & Interactions

**Minimal Animation Philosophy:**
- Hero content: Subtle fade-in on load (opacity + slight Y-axis movement)
- Product cards: Scale on hover (1.02), shadow enhancement
- Filter transitions: Smooth fade between filtered states
- Page transitions: None (instant for performance)
- Loading states: Simple spinner, no elaborate animations

**Interactive States:**
- Buttons: Hover darkens by 10%, active state slightly darker
- Links: Underline on hover, forest green color
- Product cards: Lift effect (translateY -4px) with shadow
- Form inputs: Forest green focus ring

---

## Page-Specific Guidelines

### Homepage/Storefront
1. **Hero Section** (60vh): Full-bleed image, centered headline + subheading, trust badges at bottom
2. **Sticky Filter Bar**: Category navigation (All, Wellness, Bedroom, Patio, Home Decor)
3. **Product Grid**: 3-4 column responsive grid with quick buy buttons
4. **Footer**: Minimal - link back to main site, contact, trust reassurance

### Success Page
- Centered card with order confirmation
- Order number prominent
- "What's Next" section with fulfillment timeline
- CTA to return to shop or visit main site

---

## Accessibility & Performance
- Maintain WCAG AA contrast ratios (forest green on white = 7.8:1)
- Focus indicators visible on all interactive elements
- Alt text for all product images
- Semantic HTML structure
- Page load target: < 2 seconds
- Mobile-optimized images (responsive srcset)
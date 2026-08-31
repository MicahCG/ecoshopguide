# Bambana — GA4 Schema Reference

**Measurement ID:** `G-JWZKR16JFE`
**Property type:** Google Analytics 4 (web)
**Tracking layers:** Client-side (gtag.js) + Server-side (Measurement Protocol)

---

## Dual-Event System

This codebase fires **two events** for most ecommerce actions:

1. **Custom event** (e.g. `product_click`) — carries our own params like `product_id`, `collection_name`
2. **GA4 recommended event** (e.g. `select_item`) — uses Google's standard `items[]` schema

Both are fired from the same helper function. The GA4 recommended events populate the built-in Monetization reports. The custom events give us granular control.

**Source file:** `client/src/lib/analytics.ts`

---

## Every Event + Exact Parameters

### Page & Navigation Events

| Event Name | Type | Trigger | Parameters |
|---|---|---|---|
| `page_view` | GA4 auto | Every route change | `page_path` (auto) |
| `collection_view` | Custom | Collection page loads | `collection_name`, `collection_slug` |

### Product Discovery Events

| Event Name | Type | Trigger | Parameters |
|---|---|---|---|
| `product_impression` | Custom | Product card scrolls into viewport (IntersectionObserver, 50% threshold) | `product_id`, `product_name`, `collection_name`, `price`, `currency` |
| `product_click` | Custom | User clicks a product card | `product_id`, `product_name`, `collection_name`, `price`, `currency` |
| `select_item` | GA4 standard | Fires alongside `product_click` | `items[].item_id`, `items[].item_name`, `items[].item_category`, `items[].price`, `items[].currency` |
| `product_view` | Custom | Product detail page loads | `product_id`, `product_name`, `category`, `price`, `currency`, `variant_id` (optional) |
| `view_item` | GA4 standard | Fires alongside `product_view` | `currency`, `value`, `items[].item_id`, `items[].item_name`, `items[].item_category`, `items[].price`, `items[].item_variant` (optional) |

### Single-Product Purchase Flow

| Event Name | Type | Trigger | Parameters |
|---|---|---|---|
| `buy_click` | Custom | "Buy Now" button clicked on product | `product_id`, `product_name`, `collection_name`, `price`, `currency`, `variant_id` (optional) |
| `begin_checkout` | GA4 standard | Fires alongside `buy_click` | `currency`, `value`, `items[].item_id`, `items[].item_name`, `items[].item_category`, `items[].price`, `items[].quantity`, `items[].item_variant` (optional) |
| `checkout_redirect` | Custom | Right before browser navigates to Stripe | `session_id`, `product_id`, `product_name`, `collection_name`, `price`, `currency`, `variant_id` (optional) |
| `checkout_success` | Custom | Success page loads after payment | `session_id`, `value`, `currency`, `item_count` |
| `purchase` | GA4 standard | Fires on success page (client) AND via Measurement Protocol (server) | `transaction_id`, `value`, `currency`, `items[].item_id`, `items[].item_name`, `items[].price`, `items[].quantity` |
| `checkout_cancel` | Custom | User returns from Stripe without paying | `session_id` |

### Cart Flow

| Event Name | Type | Trigger | Parameters |
|---|---|---|---|
| `add_to_cart` | Custom + GA4 standard | Product added to cart | Custom: `product_id`, `product_name`, `collection_slug`, `price`, `currency`. GA4: `currency`, `value`, `items[]` |
| `remove_from_cart` | Custom + GA4 standard | Product removed from cart | Custom: `product_id`, `product_name`, `price`, `currency`. GA4: `currency`, `value`, `items[]` |
| `cart_view` | Custom | Cart slide-over opened | `cart_value`, `items_count` |
| `cart_checkout_start` | Custom | "Checkout" clicked inside cart | `cart_value`, `items_count`, `has_bundle` |
| `begin_checkout` | GA4 standard | Fires alongside `cart_checkout_start` | `currency`, `value` |

### Bundle Events

| Event Name | Type | Trigger | Parameters |
|---|---|---|---|
| `bundle_section_view` | Custom | Bundle section scrolls into viewport | `collection_slug` |
| `bundle_impression` | Custom | Individual bundle card scrolls into viewport | `bundle_id`, `collection_slug` |
| `bundle_add_to_cart` | Custom | "Add to Cart" clicked on a bundle | `bundle_id`, `collection_slug`, `bundle_value` |
| `bundle_buy_now_click` | Custom | "Buy Bundle" clicked | `bundle_id`, `collection_slug`, `bundle_value` |

### Combo Section Events

| Event Name | Type | Trigger | Parameters |
|---|---|---|---|
| `combo_section_view` | Custom | Combo section scrolls into viewport | `combo_section_id`, `combo_section_name`, `collection_name` |

---

## Attribution Parameters (Auto-Attached to ALL Events)

Every event fired through `ecoTrack()` or `ecoEcomTrack()` automatically includes:

| Parameter | Source | Description |
|---|---|---|
| `click_id` | `crypto.randomUUID()`, stored in sessionStorage | Unique ID per browser session, links all events from one visit |
| `page_path` | `window.location.pathname` | Page the event fired on |
| `referrer` | `document.referrer` | Previous page / external referrer (only if present) |
| `utm_source` | URL query param, persisted in sessionStorage | Marketing source |
| `utm_medium` | URL query param, persisted in sessionStorage | Marketing medium |
| `utm_campaign` | URL query param, persisted in sessionStorage | Campaign name |
| `utm_content` | URL query param, persisted in sessionStorage | Ad content variant |
| `utm_term` | URL query param, persisted in sessionStorage | Paid search keyword |

---

## Server-Side Purchase Tracking (Measurement Protocol)

**Endpoint:** `https://www.google-analytics.com/mp/collect?measurement_id=G-JWZKR16JFE&api_secret={GA4_API_SECRET}`
**Source file:** `server/routes.ts` — `trackPurchaseServerSide()`

Fires on Stripe webhook `checkout.session.completed`. This is the **most reliable** purchase signal because it doesn't depend on the user staying on the success page.

**Payload shape:**
```json
{
  "client_id": "<stripe_session_id or generated>",
  "events": [{
    "name": "purchase",
    "params": {
      "transaction_id": "<stripe_payment_intent_id>",
      "value": 29.99,
      "currency": "USD",
      "items": [
        { "item_id": "prod_123", "item_name": "Product Name", "price": 29.99, "quantity": 1 }
      ]
    }
  }]
}
```

**Deduplication note:** The `purchase` event fires both client-side (success page) and server-side (webhook). GA4 deduplicates by `transaction_id` if both arrive.

---

## Definitions for Reporting

### What is a "Landing Page"?
The first `pagePath` in a user's session. Use the GA4 dimension `landingPage` — this is set automatically by GA4 from the first `page_view` hit in each session.

### What is a "Product Impression"?
A `product_impression` custom event. Fired when a product card enters the viewport at 50%+ visibility via `IntersectionObserver`. One impression per product per scroll-into-view. **This is NOT the GA4 built-in `itemListViews` metric** — to query impressions, use:
```
eventName == "product_impression"
```
with `eventCount` as the metric.

### What is a "Page Impression" / "Pageview"?
The GA4 metric `screenPageViews`. Every route change fires a `page_view` via the `GoogleAnalytics.tsx` component. Breakdown by page using the `pagePath` dimension.

### What is a "Purchase"?
The GA4 recommended `purchase` event. It carries `transaction_id`, `value`, `currency`, and `items[]`. Use the GA4 metrics `ecommercePurchases`, `purchaseRevenue`, `transactions`, or `totalPurchasers` to report on purchases.

### What is a "Top Product"?
Query using GA4 item-scoped dimensions: `itemName` and `itemId`. Metrics: `itemsViewed`, `itemsAddedToCart`, `itemsPurchased`, `itemRevenue`. These come from the GA4 recommended events (`view_item`, `add_to_cart`, `purchase`) where `items[]` is present.

### What is a "Funnel"?
The purchase funnel for this site is:

```
product_impression  →  product_click / select_item  →  product_view / view_item
       ↓                                                        ↓
  (discovery)                                          buy_click / add_to_cart
                                                              ↓
                                                        begin_checkout
                                                              ↓
                                                       checkout_redirect
                                                              ↓
                                                          purchase
```

The GA4 Data API does not have a native funnel endpoint. To reconstruct:
- Pull `eventCount` grouped by `eventName` for the funnel events
- Or pull the aggregate ecommerce metrics: `itemsViewed` → `addToCarts` → `checkouts` → `ecommercePurchases`
- Calculate drop-off rate = `1 - (next_step / current_step)`

### What is a "User Journey"?
The sequence of events a single user fires in one session. GA4's Path Exploration (UI only) visualizes this. Via the Data API, approximate it by querying events with the `date` + `sessionDefaultChannelGroup` dimensions, or by pulling the custom `click_id` parameter which links all events from one session.

---

## GA4 Data API — Dimension & Metric Compatibility

**Critical rule:** You cannot mix item-scoped and session-scoped dimensions in a single request.

### Session-Scoped (traffic, pages, geo)
**Dimensions:** `date`, `pagePath`, `landingPage`, `sessionSourceMedium`, `sessionDefaultChannelGroup`, `country`, `city`, `deviceCategory`, `operatingSystem`, `browser`
**Metrics:** `activeUsers`, `newUsers`, `sessions`, `engagedSessions`, `engagementRate`, `averageSessionDuration`, `screenPageViews`, `bounceRate`, `eventCount`, `conversions`

### Event-Scoped (custom events)
**Dimensions:** `eventName`, `date`, `pagePath`
**Metrics:** `eventCount`, `eventCountPerUser`, `totalUsers`
**Filter to our events:** Use `dimensionFilter` with `inListFilter` on `eventName`

### Item-Scoped (product/ecommerce — GA4 recommended events only)
**Dimensions:** `itemName`, `itemId`, `itemCategory`, `itemListName`
**Metrics:** `itemsViewed`, `itemsAddedToCart`, `itemsPurchased`, `itemRevenue`, `itemsClickedInList`, `itemListViews`, `itemListClicks`, `itemListClickThroughRate`, `cartToViewRate`, `purchaseToViewRate`

### Ecommerce Aggregate (no product breakdown)
**Dimensions:** `date`, `transactionId`
**Metrics:** `ecommercePurchases`, `purchaseRevenue`, `totalPurchasers`, `transactions`, `averagePurchaseRevenue`, `addToCarts`, `checkouts`

---

## Querying Custom Events via the Data API

Our custom events (`product_impression`, `buy_click`, `bundle_impression`, etc.) do **not** populate GA4's built-in ecommerce metrics. To report on them:

```json
{
  "dateRanges": [{ "startDate": "30daysAgo", "endDate": "today" }],
  "dimensions": [
    { "name": "eventName" },
    { "name": "date" }
  ],
  "metrics": [
    { "name": "eventCount" },
    { "name": "totalUsers" }
  ],
  "dimensionFilter": {
    "filter": {
      "fieldName": "eventName",
      "inListFilter": {
        "values": [
          "product_impression",
          "product_click",
          "product_view",
          "buy_click",
          "checkout_redirect",
          "checkout_success",
          "checkout_cancel",
          "bundle_impression",
          "bundle_add_to_cart",
          "bundle_buy_now_click",
          "bundle_section_view",
          "cart_view",
          "cart_checkout_start",
          "combo_section_view",
          "collection_view"
        ]
      }
    }
  }
}
```

To get custom event parameters (like `product_name` or `bundle_id`), you must first register them as **custom dimensions** in GA4 Admin > Custom definitions. Without registration, they exist in raw data but cannot be queried via the Data API.

---

## Date Granularity

Include `{ "name": "date" }` as a dimension to get daily rows (format: `YYYYMMDD`). Aggregate client-side for weekly/monthly views. Or change `dateRanges`:

| View | startDate | endDate |
|---|---|---|
| Today | `today` | `today` |
| Yesterday | `yesterday` | `yesterday` |
| Last 7 days | `7daysAgo` | `today` |
| Last 30 days | `30daysAgo` | `today` |
| Last 90 days | `90daysAgo` | `today` |
| Custom | `2025-01-01` | `2025-01-31` |

---

## Debug & Validation

- **Client debug mode:** Append `?ga_debug=1` to any page URL
- **Console dump:** Run `window.ecoDumpEvents()` in browser console (shows last 20 events)
- **Debug widget:** Auto-mounts in bottom-right when debug mode is active (shows last 10 events live)
- **Ring buffer:** `window.__ecoEventLog` holds last 50 events in memory
- **GA4 DebugView:** Admin > DebugView in the GA4 console (requires Chrome debug extension)

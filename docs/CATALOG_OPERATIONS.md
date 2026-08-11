# EcoShopGuide catalog, sourcing, and merchandising operations

This runbook governs owned products sold through EcoShopGuide. Affiliate products remain a separate catalog class and must never be represented as owned inventory.

The machine-readable policy is `config/catalog-governance.json`.

## Target operating model

```text
Supplier or Shopify Collective
        |
        v
Shopify product, variant, inventory, shipping, and return records
        |
        +--> EcoShopGuide React storefront through Shopify Storefront API
        |       |
        |       +--> Shopify Cart API
        |       +--> Shopify-hosted checkout URL
        |
        +--> Product and inventory webhooks to EcoShopGuide server
        |
        +--> Paid order, refund, and fulfillment webhooks
                |
                v
First-party performance store with product and variant join keys
                |
                v
Catalog operator recommendation
                |
                v
Hermes review and explicit approval
                |
                v
Reversible merchandising or catalog action
```

Shopify is the canonical record for owned product identity, variants, current price, inventory, order, checkout, refund, and fulfillment state. EcoShopGuide must not maintain an independent editable copy of price or inventory that can drift from Shopify.

The current React/Vite site remains the presentation layer. A future implementation should use Shopify's Storefront API for products and carts, then send customers to the Shopify-hosted checkout URL. Admin API credentials and webhook secrets must remain server-side.

## Sourcing strategy

### Stage 1: Shopify Collective

Use Shopify Collective first when it offers products that fit EcoShopGuide's audience, quality, margin, shipping, and return requirements. Collective can synchronize supplier inventory and forward orders to the supplier for fulfillment. This lowers initial inventory risk but does not remove EcoShopGuide's customer-service responsibility.

### Stage 2: vetted domestic supplier

Use another supplier or integration only when it passes the same data contract and operating gates. An app listing is not supplier approval. Require samples, written shipping and return terms, stable inventory synchronization, defect responsibility, and test orders.

### Stage 3: owned wholesale inventory plus 3PL

Move validated products to wholesale inventory and a 3PL when improved contribution, packaging, delivery consistency, or stock control justifies working capital. Shopify remains the order and inventory control plane.

### Stage 4: private label

Develop private-label or exclusive specifications only after product-market evidence exists. Private label requires additional compliance, quality, insurance, packaging, and working-capital review.

## Product lifecycle

### Candidate

The operator records the product, supplier, fit, likely customer problem, Pinterest/onsite evidence, comparable alternatives, and missing evidence. No product is created in Shopify.

### Supplier review

Collect every required sourcing field from `catalog-governance.json`. Reject products with opaque origin, uncontrolled shipping, unclear returns, unsupported claims, weak contribution, high breakage, or excessive variants.

### Sample ordered

A sample purchase requires approval. Record the exact supplier and product version. Supplier photos do not substitute for physical verification.

### Sample approved

Verify identity, dimensions, materials, finish, packaging, delivery tracking, defect risk, and claim evidence. Produce original product, detail, scale, in-use, and what-arrives imagery.

### Listing draft

The catalog operator drafts a Shopify-ready record from verified facts. It must include:

- precise title
- one-sentence benefit
- problem and use-case description
- materials and dimensions
- care
- what is included
- variants
- delivery range
- return summary
- verified claims and evidence references
- original images
- cost, fulfillment, payment, and return reserve
- estimated contribution per order
- SEO title and description
- Pinterest title and description drafts when needed

Do not copy supplier marketing verbatim. Never invent reviews, sales counts, discounts, certifications, scarcity, sustainability, or shipping claims.

### Ready for approval

The operator returns a structured change package and side-by-side preview. Product creation, publication, price, collection membership, and homepage placement all require explicit approval in the current `recommend_only` mode.

### Published and monitoring

Monitor inventory, price, product views, add-to-cart, checkout, paid orders, refunds, fulfillment speed, returns, support burden, contribution, and source traffic.

### Paused or retired

Pause or retire products for stock, safety, quality, fulfillment, returns, supplier, contribution, or policy problems. Preserve the decision history and customer/order records.

## Product classes

### Owned product

- Has Shopify product and variant IDs.
- Uses Shopify inventory and checkout.
- EcoShopGuide is responsible to the customer.
- Paid orders, refunds, and fulfillment can be measured through approved server-side Shopify events.

### Affiliate product

- Has retailer and affiliate destination.
- Does not enter the Shopify cart.
- Must retain affiliate disclosure and `rel="sponsored"` behavior.
- Downstream Amazon purchases remain aggregate and cannot be joined deterministically to a visitor.

Never mix an affiliate destination and owned-product Add to Cart action under the same button or product identity.

## Analytics data contract

### Storefront events

Use stable Shopify product and variant IDs where applicable:

- `product_impression`
- `view_item`
- `select_item`
- `add_to_cart`
- `remove_from_cart`
- `view_cart`
- `begin_checkout`
- `checkout_redirect`

Each event should include only the fields needed for merchandising and attribution:

```text
first_party_session_id
shopify_product_gid
shopify_variant_gid
internal_sku
collection_or_surface
slot_position
merchandising_decision_id
utm_source
utm_medium
utm_campaign
utm_content
quantity
currency
price_at_event
```

Do not place name, email, phone, street address, payment data, or full IP address in the storefront analytics event.

### Server-side Shopify events

Subscribe only after approving scopes and architecture. Candidate topics include product create/update/delete, inventory-level updates, orders paid, refunds created, and fulfillment created. Verify webhook signatures, deduplicate by Shopify event ID, process idempotently, and store the minimum required order/product metrics without exposing customer identity to merchandising tools.

Read-only Shopify access must also be explicitly provisioned. Hermes records the approved store identity and scope names without recording credential values. Verification consists of read-only shop and product queries; no mutation is permitted during access verification. Credentials remain server-side and must never appear in logs, screenshots, commits, browser code, or agent output.

### Attribution

Owned Shopify orders can be joined to EcoShopGuide checkout sessions using first-party cart/order attributes designed for that purpose. This is distinct from Amazon affiliate purchases, which remain aggregate. Never upload Shopify customer identities to Pinterest without a separate lawful, consented, reviewed purpose.

## Adaptive merchandising

### Primary principle

Rank products by expected contribution and customer outcome per eligible exposure, not by raw sales. Raw sales produce a feedback loop because products already shown prominently receive more traffic.

The policy combines:

- contribution per eligible product view
- conversion confidence lower bound
- sales velocity compared with the product's prior baseline
- fulfillment reliability
- inventory health
- return-rate penalty
- editorial and board fit

### Above-the-fold placement

Above-the-fold placement is a merchandising action and requires approval in the current mode. A recommendation must include:

- exact measurement window
- impressions and product-detail views
- paid orders and net contribution
- refunds and returns
- inventory and fulfillment state
- source mix
- current and proposed slot
- expected benefit
- guardrails and rollback trigger

The system reserves most slots for proven products, a controlled share for exploration, and one editorial slot. This prevents early winners from permanently monopolizing visibility and allows new products to earn evidence.

### Trending badge

“Trending” is a factual performance label, not decorative urgency. The configurable initial threshold in `catalog-governance.json` requires sufficient product views and paid orders, a material increase in sales velocity over the prior baseline, acceptable refunds, and healthy inventory/fulfillment. The label expires and must be re-earned. It does not auto-publish.

Before expiry, inventory unavailability, fulfillment failure, excess refunds, safety/quality incidents, or invalidated claims create an immediate removal recommendation. Removal remains approval-gated in `recommend_only` mode unless the user later approves a narrowly defined automatic safety policy.

Use “New” from publication date and “Editor pick” only through explicit editorial approval. Do not display “Best seller,” “Hot,” or “Trending” without a defined, met, and logged rule.

### Stability

Evaluate daily but avoid non-emergency live reorder changes more than once per seven days. Use `no_change` when evidence is weak. Stock, safety, or fulfillment failures can generate immediate removal recommendations.

## Catalog operator permissions

Allowed without live approval:

- read-only supplier and product research
- read-only Shopify/catalog inspection after access is provisioned
- aggregate analytics inspection
- candidate scorecards
- listing and image-shot drafts
- margin and fulfillment modeling
- merchandising recommendations
- `no_change`
- rollback preparation

Explicit approval is required for every live action listed in `config/catalog-governance.json`, including supplier connections, purchases, products, publication, pricing, inventory, collections, badges, above-the-fold changes, checkout settings, apps, scopes, credentials, and webhooks.

No automatic live catalog actions are authorized initially.

## Decision package

Every recommendation uses this structure:

```text
Catalog decision ID:
Product and supplier:
Lifecycle transition requested:
Evidence window and sources:
Customer problem and board/category fit:
Sample status:
Quality and claims evidence:
Unit economics:
Shipping, fulfillment, and returns:
Inventory state:
Analytics sample:
Recommended catalog action:
Recommended merchandising action:
Customer-facing copy and image requirements:
Risks and guardrails:
Rollback:
Explicit live actions requested:
```

Before any approved merchandising change, save the exact current slot order, labels, collection membership, and decision ID as the rollback snapshot.

## Current repository blockers

As of 2026-08-10, freshly verify before acting:

1. The site is an affiliate guide with static TypeScript product records, not an owned Shopify catalog.
2. Homepage product selection is hardcoded in `client/src/pages/Home.tsx`.
3. `client/src/data/ideaLists.ts` fabricates placeholder ratings, review counts, bought counts, and compare-at prices for products without fetched data. This is prohibited for owned commerce and should be removed or isolated before launch.
4. The independent audit counted 118 generated product records and found 117 resolving to `affiliateUrl: "#"`; unavailable products must be hidden or clearly non-clickable rather than opening a duplicate page.
5. Only one product currently has fetched retailer data in `client/src/data/productData.ts`.
6. Existing tracking attributes are not yet wired to an `affiliate_click` analytics event.
7. Product-impression events do not exist, so exposure-normalized merchandising cannot yet be calculated.
8. First-party analytics depends on a production database path that was observed unhealthy.
9. There is no Shopify Storefront API, cart, checkout, Admin API, webhook, or inventory implementation in the current code.
10. Homepage categories, editorial picks, and product grid selection are hardcoded in `client/src/pages/Home.tsx`.
11. Stale deployment documents incorrectly claim Shopify and Stripe are already integrated.
12. Affiliate CTAs are fragmented across homepage, category, blog, and standalone-look components; several omit first-party outbound events or `rel="sponsored"`.
13. Current sustainability and eco-friendly language is not consistently backed by SKU-level evidence.
14. Return, free-shipping, delivery, replacement, and support promises exist even though the owned-commerce operation does not yet exist; policy copy must match the approved supplier and Shopify configuration.
15. `ProductFAQ.tsx` contains exact product specifications without linked authoritative SKU evidence and must not become a live product source.
16. The return-policy component is not routed, and its content must be reconciled before routing it.
17. Client query caching currently uses infinite freshness, which is unsafe for Shopify price and inventory.
18. Shopify synchronization will require verified signatures, idempotent webhook processing, and scheduled reconciliation because webhooks are not an authoritative ledger.

These blockers do not authorize code or production changes. They determine the phased implementation plan.

## Phased implementation

### Phase 0: truth and measurement

- Remove fabricated commercial proof from production surfaces.
- Hide or disable products with placeholder destinations.
- Restore and verify first-party analytics.
- Instrument affiliate outbound clicks.
- Instrument product impressions with stable product and slot IDs.
- Reconcile affiliate disclosures and unsupported product, sustainability, shipping, return, delivery, replacement, and support claims.
- Establish clean TypeScript and CI baselines.

### Phase 1: Shopify foundation

- Create or verify the Shopify store.
- Define product metafields and internal SKU rules.
- Configure policies and approved payments.
- Add Storefront API product reads, cart creation, and hosted checkout.
- Add signed, idempotent server-side webhooks.
- Add scheduled reconciliation and bounded price/inventory freshness.
- Keep owned and affiliate product classes visually and analytically distinct.

### Phase 2: controlled catalog pilot

- Approve one or two suppliers.
- Sample five to ten products.
- Publish only verified products.
- Route a minority of eligible traffic to owned products while retaining the affiliate control.

### Phase 3: adaptive merchandising

- Collect sufficient impressions, views, carts, paid orders, refunds, fulfillment, and contribution data.
- Generate daily recommendations.
- Apply approved reorders no more than weekly unless operational risk requires removal.
- Retain exploration and editorial slots.

### Phase 4: limited automation

Only after sustained verification may the user explicitly authorize narrow automatic actions such as hiding unavailable items or applying an already approved ranking policy. Price, purchasing, supplier, checkout, and policy changes should remain approval-gated.

## Owned-commerce traffic-test launch gate

Do not merge the owned-commerce release to `main` or redirect test traffic until every item below has current evidence:

- Shopify store identity, domains, payment methods, tax behavior, and hosted checkout are verified.
- Storefront product reads, variant selection, cart creation, checkout redirect, order confirmation, refund, and fulfillment events pass end to end.
- Five to ten launch products have approved suppliers, physical sample evidence, complete factual listings, original imagery, and no fabricated proof.
- Supplier inventory synchronization, processing time, delivery range, split-shipment behavior, return responsibility, defect handling, and customer-support escalation are documented and tested.
- At least one real test order and one real return are completed for each fulfillment model used at launch.
- Price, inventory, product status, and fulfillment promises come from Shopify without a drifting local copy.
- Product impressions, detail views, add-to-cart, checkout start, checkout redirect, paid order, refund, and fulfillment events are verified with stable product and variant IDs.
- Analytics exclude prohibited customer data and preserve the boundary between owned Shopify orders and aggregate affiliate outcomes.
- Placeholder destinations, fabricated ratings, review counts, bought counts, compare-at prices, scarcity, and unsupported claims are absent from production surfaces.
- Mobile product discovery, filters, product detail, sticky Add to Cart, cart, checkout handoff, delivery, returns, keyboard access, reduced motion, and 44px controls are verified.
- Performance budgets, image optimization, error handling, out-of-stock behavior, and monitoring are acceptable for the traffic-test scope.
- Shipping, return, privacy, terms, affiliate disclosure, contact, and support information match actual operations.
- Contribution-per-order assumptions and the initial traffic allocation versus the Amazon affiliate control are documented.
- The exact release commit, preview deployment, Shopify configuration snapshot, rollback target, rollback triggers, and post-release observation window are recorded.
- The independent reviewer returns `PASS`, checks and build pass, and Hermes presents the release evidence for the final production gate.

Use a feature branch and pull request. Do not commit directly to `main`. After the release gate is approved, merge the reviewed PR, verify that `main` contains the expected commit, verify the production deployment, and only then begin the approved minority traffic test.

The user's request to launch once these conditions are met establishes the target outcome; it does not permit an agent to claim readiness without evidence or bypass the final production gate.

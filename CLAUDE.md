# EcoShopGuide repository instructions

This file is the authoritative operating context for coding agents. `replit.md`, `DEPLOYMENT_GUIDE.md`, `VERCEL_DEPLOY_CHECKLIST.md`, and the GA4 guides contain stale descriptions and must not be treated as current architecture.

## Product and business model

EcoShopGuide is currently an affiliate discovery and editorial site. It sends visitors to external retailers and Amazon idea-list destinations. It is not currently a working Shopify or Stripe checkout storefront.

Business decisions must be evaluated against contribution and affiliate performance, not visual preference alone. Relevant metrics include:

- affiliate outbound click-through rate
- outbound clicks per visitor
- Amazon Tracking-ID clicks, ordered items, revenue, commission, and EPC
- Pinterest traffic quality, CPOC, and CTR
- page speed and Core Web Vitals
- newsletter signup rate

Amazon aggregate results do not provide deterministic customer-level attribution. Do not claim that a site visitor caused a specific Amazon order.

## Audience and design direction

The audience is younger, predominantly female, design-conscious, and strongly interested in home decor, design, entertaining, small spaces, organization, wellness, dorms, compact outdoor living, and entryways. A meaningful share of traffic arrives from Pinterest on mobile.

Use a warm editorial-commerce visual direction. Preserve product visibility, attainable spaces, mobile usability, clear affiliate disclosures, and accessible controls. Avoid generic eco imagery, unsupported sustainability claims, fake reviews, invented scarcity, and mansion-scale imagery as the default.

Do not use em dashes in customer-facing copy. Use commas, parentheses, colons, or regular hyphens.

## Current architecture

- Frontend: React 18, TypeScript, Vite, Wouter, TanStack Query, Tailwind, Radix/shadcn
- Frontend source: `client/src/`
- Local server: Express in `server/`
- Vercel entrypoint: `api/index.ts` through `api/handler.ts`
- Shared schema: `shared/schema.ts`
- Database: PostgreSQL through Drizzle and `postgres.js`
- Production hosting: Vercel
- Production deployment: a push to `main` currently triggers Vercel production automatically

Important routing caveat: local development and Vercel do not always exercise the same implementation. `/api/blogs` exists in both `server/routes.ts` and `api/blogs.ts`; `vercel.json` determines the production route.

## Commands

```bash
npm run dev
npm run check
npm run build
npm run vercel-build
```

`npm run check` has a known pre-existing baseline of 13 TypeScript errors in old database maintenance and seed scripts. Do not treat those as newly introduced without comparing the baseline. The baseline must be fixed before TypeScript can become a hard CI gate.

There is currently no automated test suite or GitHub Actions workflow. Do not claim tests passed when only the build passed.

## Protected assets and data

Never read, print, modify, commit, or expose secret values. Do not open `.env` or credential files unless the user explicitly directs a narrowly scoped credential operation.

Never delete, modify, or overwrite user-generated review data or review photos if such data is restored or reintroduced. The current schema does not contain the review system described by `replit.md`, but the preservation rule remains active.

Treat these as protected unless the user explicitly authorizes changes:

- production database contents and schema
- Vercel environment variables and settings
- GitHub repository settings and branch protection
- analytics history
- `attached_assets/` originals
- published editorial content
- Amazon affiliate links, Tracking IDs, disclosures, and tracking attributes
- the user's existing commits and uncommitted work
- `CLAUDE.md`, `.claude/agents/`, `.claude/settings.local.json`, and `docs/AGENT_OPERATIONS.md`
- `docs/CATALOG_OPERATIONS.md` and `config/catalog-governance.json`

## Owner-agent workflow

Use the project agent `ecoshopguide-owner` for implementation ownership.

For every performance-driven change:

1. Confirm the working tree is clean. Stop if it is dirty; do not stash user work.
2. Fetch the canonical `origin` and branch from current `main`.
3. Record the data window, baseline metric, hypothesis, target metric, guardrails, and rollback trigger.
4. Trace the affected component, route, analytics event, and deployment path before editing.
5. Make the smallest reversible change on a non-`main` branch.
6. Preserve affiliate destinations, tracking attributes, disclosures, and privacy boundaries unless the approved task changes them.
7. Run the relevant local checks and compare failures with the known baseline.
8. Ask Hermes to invoke the separate read-only `ecoshopguide-reviewer`; the implementation owner must not review its own work.
9. Prepare a commit, push, PR, and preview-verification plan without performing those actions.
10. Stop for explicit approval before committing, pushing, opening a PR, or creating a remote preview.
11. After the approved branch and preview exist, collect verification evidence and stop for a separate approval before merge or production promotion.
12. After an approved release, verify production endpoints, mobile behavior, affiliate destinations, analytics delivery, bundle identity, and deployment commit.
13. If a rollback trigger occurs, alert Hermes and hand off the rollback target and trigger. Hermes executes a production rollback only when the release approval explicitly pre-authorized it or the user gives fresh approval. Diagnose and prepare a git revert separately.

## Approval boundaries

Read-only inspection, local builds, local checks, and draft preparation are allowed by default.

Explicit user approval is required before:

- committing or pushing a branch
- opening, merging, or closing a PR
- pushing to `main`
- triggering or promoting a production deployment
- changing GitHub or Vercel settings
- changing environment variables or credentials
- running database writes, migrations, `db:push`, or seed scripts
- installing or upgrading dependencies
- changing affiliate destinations, Tracking IDs, or disclosures
- publishing or deleting content
- rewriting git history

Never force-push, use `git reset --hard` over user work, or deploy from a dirty tree.

## Catalog operator

Use `ecoshopguide-catalog-operator` for read-only supplier research, candidate scorecards, factual listing drafts, unit-economics models, and adaptive merchandising recommendations. Its governing files are `docs/CATALOG_OPERATIONS.md` and `config/catalog-governance.json`.

Shopify is the intended source of truth for owned products, variants, price, inventory, orders, checkout, refunds, and fulfillment. Affiliate products remain a separate class and do not enter Shopify checkout. The catalog operator has no standing live-action authority; all actions listed in `config/catalog-governance.json` require exact approval.

## Performance evidence standard

A change is not successful because it looks better. Report:

- exact comparison window
- sample size
- traffic source and route
- primary metric and guardrails
- desktop and mobile behavior
- build and check results
- preview and production verification
- whether observed changes are directional or statistically reliable

Use `no_change` when evidence does not support an intervention. Keep experiments reversible and avoid changing multiple unrelated variables in one test.

## Known production and repository risks

As of 2026-08-10, verify these before relying on them:

- production `/api/blogs` was observed returning HTTP 500 with a database configuration error
- first-party analytics and newsletter routes depend on the same database path
- `client/public/ads.txt` contains a placeholder publisher value
- tracked deployment docs contain a database connection URI in a public repository; do not reproduce it and treat rotation as required
- the homepage uses several multi-megabyte PNG assets
- `main` is not branch-protected
- no GitHub Actions checks exist
- `npm run check` has 13 pre-existing TypeScript errors
- deployment and GA4 documentation is stale and contradictory

Freshly verify each item before proposing remediation. Do not expose secret material while documenting findings.

## Deployment safety

Current automatic deployment means a direct push to `main` is a production action. Never use it as a development shortcut.

Before an approved production release, require:

- clean branch and reviewed diff
- local build success
- relevant checks or an explicit baseline comparison
- preview deployment verification
- production rollback target identified
- exact production smoke checklist

After release, verify the deployed commit and critical routes. Report failures honestly and roll back according to the approved trigger.

Rollback execution is owned by Hermes after explicit user approval. The implementation owner supplies the rollback target, trigger, verification plan, and revert plan but cannot invoke Vercel or mutate production.